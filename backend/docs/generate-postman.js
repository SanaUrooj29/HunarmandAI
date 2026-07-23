const fs = require('fs');
const path = require('path');
const spec = require('./api-spec/index.js');

function authVarFor(auth) {
  if (auth === 'seller') return 'seller_token';
  if (auth === 'buyer') return 'buyer_token';
  if (auth === 'admin') return 'admin_token';
  return null;
}

function buildAuthBlock(auth) {
  const varName = authVarFor(auth);
  if (!varName) return undefined;
  return { type: 'bearer', bearer: [{ key: 'token', value: `{{${varName}}}`, type: 'string' }] };
}

function pathToPostmanUrl(baseUrl, endpointPath) {
  // Convert Express-style :param to Postman-style :param (identical syntax,
  // Postman parses `:param` in the raw URL automatically into path variables).
  const fullPath = `${baseUrl}${endpointPath}`;
  return {
    raw: `{{base_url}}${fullPath}`,
    host: ['{{base_url}}'],
    path: fullPath.split('/').filter(Boolean),
  };
}

function buildQueryParams(endpoint, url) {
  if (!endpoint.queryParams?.length) return url;
  url.query = endpoint.queryParams
    .filter((p) => p.example !== undefined || p.default !== undefined)
    .map((p) => ({ key: p.name, value: String(p.example ?? p.default), disabled: !p.required }));
  // Include ALL query params as disabled placeholders so the user can see what's available, even without example values.
  const existingKeys = new Set((url.query || []).map((q) => q.key));
  endpoint.queryParams.forEach((p) => {
    if (!existingKeys.has(p.name)) {
      url.query = url.query || [];
      url.query.push({ key: p.name, value: '', disabled: true, description: p.description || '' });
    }
  });
  return url;
}

function buildBody(endpoint) {
  if (endpoint.bodyType === 'form-data') {
    return {
      mode: 'formdata',
      formdata: endpoint.formFields.map((f) => ({ key: f.key, type: 'file', src: [] })),
    };
  }
  if (endpoint.body) {
    return { mode: 'raw', raw: JSON.stringify(endpoint.body, null, 2), options: { raw: { language: 'json' } } };
  }
  return undefined;
}

function buildTestScript(endpoint) {
  if (endpoint.postmanTest === 'saveToken') {
    return [
      'const res = pm.response.json();',
      'if (res.success && res.data && res.data.token) {',
      '    const role = pm.request.url.path.includes("seller") ? "seller_token" : "buyer_token";',
      '    pm.collectionVariables.set(role, res.data.token);',
      '    if (res.data.seller) pm.collectionVariables.set("seller_id", res.data.seller.id);',
      '    if (res.data.buyer) pm.collectionVariables.set("buyer_id", res.data.buyer.id);',
      '    console.log("Saved token to collection variable: " + role);',
      '}',
      'pm.test("Status is 200", () => pm.response.to.have.status(200));',
    ];
  }
  if (endpoint.postmanTest === 'saveAdminToken') {
    return [
      'const res = pm.response.json();',
      'if (res.success && res.data && res.data.token) {',
      '    pm.collectionVariables.set("admin_token", res.data.token);',
      '    pm.collectionVariables.set("admin_id", res.data.admin.id);',
      '    console.log("Saved admin_token to collection variable");',
      '}',
      'pm.test("Status is 200", () => pm.response.to.have.status(200));',
    ];
  }
  if (endpoint.postmanTest === 'saveCategoryId') {
    return [
      'const res = pm.response.json();',
      'if (res.success && res.data && res.data._id) {',
      '    pm.collectionVariables.set("category_id", res.data._id);',
      '    console.log("Saved category_id: " + res.data._id);',
      '}',
    ];
  }
  if (endpoint.postmanTest === 'saveProductId') {
    return [
      'const res = pm.response.json();',
      'if (res.success && res.data && res.data._id) {',
      '    pm.collectionVariables.set("product_id", res.data._id);',
      '    console.log("Saved product_id: " + res.data._id);',
      '}',
    ];
  }
  return [`pm.test("Status is ${endpoint.successStatus || 200} or documented error", () => {`, '    pm.expect([200, 201, 400, 401, 403, 404, 409, 429].includes(pm.response.code)).to.be.true;', '});'];
}

function buildRequestItem(mod, endpoint) {
  const url = pathToPostmanUrl(mod.baseUrl, endpoint.path);
  buildQueryParams(endpoint, url);

  const item = {
    name: `${endpoint.method} ${endpoint.path}`,
    request: {
      method: endpoint.method,
      header: endpoint.bodyType === 'form-data' ? [] : endpoint.body ? [{ key: 'Content-Type', value: 'application/json' }] : [],
      auth: buildAuthBlock(endpoint.auth),
      url,
      description: [endpoint.title, endpoint.srs ? `SRS ref: ${endpoint.srs}` : '', endpoint.description || ''].filter(Boolean).join('\n\n'),
    },
    response: [],
  };

  const body = buildBody(endpoint);
  if (body) item.request.body = body;

  item.event = [{ listen: 'test', script: { type: 'text/javascript', exec: buildTestScript(endpoint) } }];

  return item;
}

function buildFolder(mod, folder) {
  return {
    name: folder.name,
    item: folder.endpoints.map((ep) => buildRequestItem(mod, ep)),
  };
}

function buildCollection(key, mod) {
  return {
    info: {
      name: `HunarmandAI \u2014 ${mod.moduleName}`,
      description: mod.description,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: mod.folders.map((folder) => buildFolder(mod, folder)),
    variable: [{ key: 'module_base', value: mod.baseUrl }],
  };
}

function buildEnvironment() {
  return {
    name: 'HunarmandAI Local',
    values: [
      { key: 'base_url', value: spec.serverUrl, type: 'default', enabled: true },
      { key: 'seller_token', value: '', type: 'secret', enabled: true },
      { key: 'buyer_token', value: '', type: 'secret', enabled: true },
      { key: 'admin_token', value: '', type: 'secret', enabled: true },
      { key: 'seller_id', value: '', type: 'default', enabled: true },
      { key: 'buyer_id', value: '', type: 'default', enabled: true },
      { key: 'admin_id', value: '', type: 'default', enabled: true },
      { key: 'category_id', value: '', type: 'default', enabled: true, description: 'Set after creating/listing a category' },
      { key: 'product_id', value: '', type: 'default', enabled: true, description: 'Set after creating/listing a product' },
      { key: 'order_id', value: '', type: 'default', enabled: true, description: 'Set after checkout completes' },
    ],
    _postman_variable_scope: 'environment',
  };
}

function main() {
  const outDir = path.join(__dirname, '..', 'postman');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  Object.entries(spec.modules).forEach(([key, mod]) => {
    const collection = buildCollection(key, mod);
    const filename = `HunarmandAI_${mod.moduleName.replace(/[^a-zA-Z]/g, '')}.postman_collection.json`;
    fs.writeFileSync(path.join(outDir, filename), JSON.stringify(collection, null, 2));
    console.log(`Wrote postman/${filename}`);
  });

  const env = buildEnvironment();
  fs.writeFileSync(path.join(outDir, 'HunarmandAI_Local.postman_environment.json'), JSON.stringify(env, null, 2));
  console.log('Wrote postman/HunarmandAI_Local.postman_environment.json');
}

main();
