/**
 * Sandbox limitation workaround: this environment cannot reach
 * fastdl.mongodb.org (network is allow-listed), so mongodb-memory-server
 * cannot download a real `mongod` binary here.
 *
 * This helper patches a Mongoose Model's DB-touching statics with an
 * in-memory Map-backed store, while still constructing real
 * `new Model(data)` documents and running real `.validate()` underneath —
 * so schema defaults, enums, and validation all run for real. Only the
 * network round-trip to an actual mongod is faked.
 *
 * This is test-only scaffolding, not part of the shipped backend. Replace
 * with a real MongoDB (Atlas, Docker, or a CI service container) for
 * real test/CI runs.
 */
const mongoose = require('mongoose');

function isOperatorObject(condition) {
  if (condition === null || typeof condition !== 'object') return false;
  if (condition instanceof Date) return false;
  if (Array.isArray(condition)) return false;
  // Mongoose ObjectId (and similar BSON types) are objects but represent a
  // scalar value for matching purposes — only true query-operator objects
  // (e.g. { $gt: ... }) have $-prefixed keys.
  const keys = Object.keys(condition);
  return keys.length > 0 && keys.every((k) => k.startsWith('$'));
}

function matchesFilter(obj, filter) {
  return Object.entries(filter).every(([key, condition]) => {
    const actual = key.split('.').reduce((acc, k) => acc?.[k], obj);

    if (isOperatorObject(condition)) {
      if ('$gt' in condition) return actual !== undefined && new Date(actual) > new Date(condition.$gt);
      if ('$gte' in condition) return actual !== undefined && new Date(actual) >= new Date(condition.$gte);
      if ('$ne' in condition) return String(actual) !== String(condition.$ne);
      if ('$in' in condition) return condition.$in.some((v) => String(v) === String(actual));
      if ('$nin' in condition) return !condition.$nin.some((v) => String(v) === String(actual));
      return false;
    }

    // Special-case: matching an array field against a scalar (e.g. Order's
    // `items.productId` — items is an array of subdocs, `key` above only
    // resolves the first element via naive dot-path). Handle explicitly:
    if (key.includes('.')) {
      const [arrayField, subField] = key.split('.');
      const arr = obj[arrayField];
      if (Array.isArray(arr)) {
        return arr.some((item) => String(item?.[subField]) === String(condition));
      }
    }

    return String(actual) === String(condition);
  });
}

function applyUpdateOperators(obj, update) {
  const hasOperators = Object.keys(update).some((k) => k.startsWith('$'));
  if (!hasOperators) {
    Object.assign(obj, update);
    return;
  }
  if (update.$set) Object.assign(obj, update.$set);
  if (update.$inc) {
    Object.entries(update.$inc).forEach(([field, amount]) => {
      obj[field] = (obj[field] || 0) + amount;
    });
  }
  if (update.$push) {
    Object.entries(update.$push).forEach(([field, value]) => {
      if (!Array.isArray(obj[field])) obj[field] = [];
      obj[field].push(value);
    });
  }
}

function applySort(arr, sortSpec) {
  if (!sortSpec) return arr;
  const [[field, dir]] = Object.entries(sortSpec);
  return [...arr].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return dir === -1 ? -cmp : cmp;
  });
}

function makeHydrator(Model) {
  return function hydrate(plainObj) {
    if (!plainObj) return null;
    const doc = new Model(plainObj);
    doc.isNew = false;
    doc._id = plainObj._id;
    return doc;
  };
}

class FakeArrayQuery {
  constructor(factory, hydrate) {
    this._factory = factory; // returns array of PLAIN objects
    this._hydrate = hydrate;
    this._sort = null;
    this._skip = 0;
    this._limit = null;
    this._lean = false;
  }
  select() { return this; }
  lean() { this._lean = true; return this; }
  sort(spec) { this._sort = spec; return this; }
  skip(n) { this._skip = n; return this; }
  limit(n) { this._limit = n; return this; }
  async _resolve() {
    let arr = await this._factory();
    arr = applySort(arr, this._sort);
    if (this._skip) arr = arr.slice(this._skip);
    if (this._limit) arr = arr.slice(0, this._limit);
    // Note: returns store objects directly (not deep-cloned) for lean() —
    // acceptable for this test-only shim; real Mongoose .lean() preserves
    // BSON types (ObjectId/Date) which a JSON round-trip would corrupt.
    return this._lean ? arr : arr.map(this._hydrate);
  }
  then(resolve, reject) { return this._resolve().then(resolve, reject); }
  catch(reject) { return this._resolve().then(undefined, reject); }
}

class FakeSingleQuery {
  constructor(factory, hydrate) {
    this._factory = factory; // returns a single PLAIN object or null
    this._hydrate = hydrate;
    this._lean = false;
  }
  select() { return this; }
  lean() { this._lean = true; return this; }
  async _resolve() {
    const plain = await this._factory();
    if (!plain) return null;
    return this._lean ? plain : this._hydrate(plain);
  }
  then(resolve, reject) { return this._resolve().then(resolve, reject); }
  catch(reject) { return this._resolve().then(undefined, reject); }
}

function patchModelWithFakeStore(Model) {
  const store = new Map();
  const hydrate = makeHydrator(Model);

  Model.prototype.save = async function fakeSave() {
    await this.validate();
    if (!this._id) this._id = new mongoose.Types.ObjectId();
    store.set(String(this._id), this.toObject({ getters: false, virtuals: false }));
    return this;
  };

  function scanAll(filter = {}) {
    const results = [];
    for (const obj of store.values()) {
      if (matchesFilter(obj, filter)) results.push(obj);
    }
    return results;
  }

  Model.findOne = (filter = {}) => new FakeSingleQuery(async () => scanAll(filter)[0] || null, hydrate);

  Model.findById = (id) => new FakeSingleQuery(async () => scanAll({ _id: id })[0] || null, hydrate);

  Model.find = (filter = {}) => new FakeArrayQuery(async () => scanAll(filter), hydrate);

  Model.create = async (data) => {
    const doc = new Model(data);
    await doc.save();
    return doc;
  };

  Model.countDocuments = async (filter = {}) => scanAll(filter).length;

  Model.updateMany = async (filter, update) => {
    const matched = scanAll(filter);
    matched.forEach((obj) => {
      applyUpdateOperators(obj, update);
      store.set(String(obj._id), obj);
    });
    return { matchedCount: matched.length, modifiedCount: matched.length };
  };

  Model.findOneAndUpdate = async (filter, update, opts = {}) => {
    const existing = scanAll(filter)[0];
    if (!existing) {
      if (opts.upsert) {
        const doc = new Model({ ...filter, ...update });
        await doc.save();
        return doc;
      }
      return null;
    }
    applyUpdateOperators(existing, update);
    store.set(String(existing._id), existing);
    return hydrate(existing);
  };

  Model.deleteOne = async (filter) => {
    const existing = scanAll(filter)[0];
    if (existing) store.delete(String(existing._id));
    return { deletedCount: existing ? 1 : 0 };
  };

  Model.insertMany = async (docsData) => {
    const created = [];
    for (const data of docsData) {
      // eslint-disable-next-line no-await-in-loop
      created.push(await Model.create(data));
    }
    return created;
  };

  Model._fakeStore = store; // exposed for test assertions/reset only
  return Model;
}

module.exports = { patchModelWithFakeStore };
