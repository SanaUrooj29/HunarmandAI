const fs = require('fs');
const path = require('path');
const spec = require('./api-spec/index.js');

function code(text) {
  return '`' + text + '`';
}

function jsonBlock(obj) {
  return '```json\n' + JSON.stringify(obj, null, 2) + '\n```';
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function authBadge(auth) {
  if (!auth) return '🌐 Public';
  if (auth === 'seller') return '🔒 Seller';
  if (auth === 'buyer') return '🔒 Buyer';
  if (auth === 'admin') return '🔒 Admin';
  return auth;
}

function renderEndpoint(mod, endpoint) {
  const lines = [];
  lines.push(`### ${endpoint.method} ${endpoint.path}`);
  lines.push('');
  lines.push(`**${endpoint.title}** — ${authBadge(endpoint.auth)}${endpoint.srs ? ` · _${endpoint.srs}_` : ''}`);
  lines.push('');
  lines.push(`\`${endpoint.method} ${mod.baseUrl}${endpoint.path}\``);
  lines.push('');
  if (endpoint.description) {
    lines.push(endpoint.description);
    lines.push('');
  }
  if (endpoint.pathParams?.length) {
    lines.push('**Path parameters:**');
    lines.push('');
    lines.push('| Name | Type | Description |');
    lines.push('|---|---|---|');
    endpoint.pathParams.forEach((p) => lines.push(`| ${code(p.name)} | ${p.type || 'string'} | ${p.description || ''}${p.enum ? ` (${p.enum.join(' \\| ')})` : ''} |`));
    lines.push('');
  }
  if (endpoint.queryParams?.length) {
    lines.push('**Query parameters:**');
    lines.push('');
    lines.push('| Name | Type | Required | Description |');
    lines.push('|---|---|---|---|');
    endpoint.queryParams.forEach((p) =>
      lines.push(`| ${code(p.name)} | ${p.type} | ${p.required ? 'yes' : 'no'} | ${p.description || ''}${p.enum ? ` (${p.enum.join(' \\| ')})` : ''}${p.default !== undefined ? ` — default ${p.default}` : ''} |`)
    );
    lines.push('');
  }
  if (endpoint.bodyType === 'form-data') {
    lines.push('**Request body:** `multipart/form-data`');
    lines.push('');
    lines.push('| Field | Type |');
    lines.push('|---|---|');
    endpoint.formFields.forEach((f) => lines.push(`| ${code(f.key)} | ${f.type} |`));
    lines.push('');
  } else if (endpoint.body) {
    lines.push('**Request body:**');
    lines.push('');
    lines.push(jsonBlock(endpoint.body));
    lines.push('');
    if (endpoint.bodyFieldNotes?.length) {
      lines.push('Notes:');
      endpoint.bodyFieldNotes.forEach((n) => lines.push(`- ${n}`));
      lines.push('');
    }
  } else if (endpoint.method !== 'GET' && endpoint.method !== 'DELETE') {
    lines.push('_No request body._');
    lines.push('');
  }
  if (endpoint.successExample) {
    lines.push(`**Example response** (${endpoint.successStatus || 200}):`);
    lines.push('');
    lines.push(jsonBlock(endpoint.successExample));
    lines.push('');
  } else {
    lines.push(`**Response:** ${endpoint.successStatus || 200}, standard success envelope (see top of document).`);
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

function renderModule(key, mod) {
  const lines = [];
  lines.push(`# ${mod.moduleName} API`);
  lines.push('');
  lines.push(mod.description);
  lines.push('');
  lines.push(`**Base URL:** \`${spec.serverUrl}${mod.baseUrl}\``);
  lines.push('');
  lines.push('## Contents');
  lines.push('');
  mod.folders.forEach((folder) => {
    lines.push(`- [${folder.name}](#${slugify(folder.name)})`);
  });
  lines.push('');
  mod.folders.forEach((folder) => {
    lines.push(`## ${folder.name}`);
    lines.push('');
    folder.endpoints.forEach((ep) => lines.push(renderEndpoint(mod, ep)));
  });
  return lines.join('\n');
}

function renderMasterDoc() {
  const lines = [];
  lines.push(`# ${spec.apiTitle}`);
  lines.push('');
  lines.push(`Version ${spec.apiVersion}`);
  lines.push('');
  lines.push(spec.description);
  lines.push('');
  lines.push(`**Base URL (local dev):** \`${spec.serverUrl}\``);
  lines.push('');

  lines.push('## Response Envelope');
  lines.push('');
  lines.push('Every response follows one of these two shapes.');
  lines.push('');
  lines.push('**Success:**');
  lines.push('');
  lines.push(jsonBlock(spec.responseEnvelope.success));
  lines.push('');
  lines.push('**Error:**');
  lines.push('');
  lines.push(jsonBlock(spec.responseEnvelope.error));
  lines.push('');

  lines.push('## Authentication');
  lines.push('');
  spec.authModels.forEach((a) => {
    lines.push(`**${a.name}:** ${a.description}`);
    lines.push('');
  });

  lines.push('## Common Error Codes');
  lines.push('');
  lines.push('| Status | Code | When |');
  lines.push('|---|---|---|');
  spec.commonErrorCodes.forEach((e) => lines.push(`| ${e.status} | ${code(e.code)} | ${e.description} |`));
  lines.push('');

  lines.push('## Modules');
  lines.push('');
  lines.push('| Module | Base Path | Endpoints | Reference |');
  lines.push('|---|---|---|---|');
  Object.entries(spec.modules).forEach(([key, mod]) => {
    const count = mod.folders.reduce((sum, f) => sum + f.endpoints.length, 0);
    lines.push(`| ${mod.moduleName} | \`${mod.baseUrl}\` | ${count} | [API_${key.toUpperCase()}.md](./API_${key.toUpperCase()}.md) |`);
  });
  lines.push('');
  lines.push('Each module also has its own dedicated Postman collection under `/postman` — see `postman/README.md`.');
  lines.push('');

  return lines.join('\n');
}

function main() {
  const outDir = path.join(__dirname);
  fs.writeFileSync(path.join(outDir, 'API_REFERENCE.md'), renderMasterDoc());
  console.log('Wrote API_REFERENCE.md');

  Object.entries(spec.modules).forEach(([key, mod]) => {
    const filename = `API_${key.toUpperCase()}.md`;
    fs.writeFileSync(path.join(outDir, filename), renderModule(key, mod));
    console.log(`Wrote ${filename}`);
  });
}

main();
