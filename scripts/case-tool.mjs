#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const [command, input, ...args] = process.argv.slice(2);
const opts = {};
for (let index = 0; index < args.length; index += 1) {
  if (args[index].startsWith('--')) opts[args[index].slice(2)] = args[index + 1];
}
const required = ['schema_version', 'id', 'title', 'purpose', 'version', 'roles', 'business_flow', 'stable_node', 'natural_language', 'snapshots', 'artifacts'];

function die(message) { console.error(`Error: ${message}`); process.exit(1); }
function ensure(dir) { mkdirSync(dir, { recursive: true }); }
function yaml(path) { if (!existsSync(path)) die(`case not found: ${path}`); return readFileSync(path, 'utf8'); }
function field(text, key) { return text.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, ''); }
function listMissing(text) { return required.filter((key) => !new RegExp(`^${key}:`, 'm').test(text)); }
function caseInfo(path) { const text = yaml(path); const missing = listMissing(text); if (missing.length) die(`missing fields: ${missing.join(', ')}`); return { text, id: field(text, 'id'), version: Number(field(text, 'version')), session: text.match(/^\s+session_key:\s*(.+)$/m)?.[1]?.trim() }; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

if (command === 'init') {
  const id = input || die('usage: init <case-id>');
  const root = opts.root || 'tests/web/cases'; const file = join(root, `${id}.yaml`); ensure(dirname(file));
  if (existsSync(file)) die(`already exists: ${file}`);
  writeFileSync(file, `schema_version: 1\nid: ${id}\ntitle: ${id}\npurpose: replace-me\nversion: 1\nparent_version: null\nroles:\n  - name: replace-me\n    session_key: replace-me\n    responsibility: replace-me\nbusiness_flow:\n  preconditions: []\n  steps: []\n  expected_outcome: replace-me\nbase_url: https://example.test\nstable_node:\n  module: ./node/${id}.v1.mjs\n  timeout_ms: 10000\n  steps: []\nnatural_language:\n  engine: '@midscene/web'\n  steps: []\nsnapshots: []\nartifacts:\n  recording: artifacts/recordings/${id}.v1\n  results: artifacts/results\n`);
  console.log(file);
} else if (command === 'validate') {
  const info = caseInfo(input || die('usage: validate <case.yaml>'));
  if (!Number.isInteger(info.version) || info.version < 1) die('version must be a positive integer');
  if (!info.session) die('role.session_key is required');
  console.log(`valid: ${info.id} v${info.version}`);
} else if (command === 'session') {
  const info = caseInfo(input || die('usage: session <case.yaml> --root <sessions-dir>'));
  const root = opts.root || 'tests/web/sessions'; const key = `${info.session}|${field(info.text, 'base_url')}`;
  const digest = createHash('sha256').update(key).digest('hex').slice(0, 12); const path = resolve(root, `${info.session}-${digest}`); ensure(path); console.log(path);
} else if (command === 'fork') {
  const source = input || die('usage: fork <case.yaml> --reason <reason>'); const info = caseInfo(source); const next = info.version + 1;
  const target = join(dirname(source), `${info.id}.v${next}.yaml`); if (existsSync(target)) die(`version exists: ${target}`);
  const date = new Date().toISOString(); let text = info.text.replace(/^version:\s*\d+$/m, `version: ${next}`).replace(/^parent_version:.*$/m, `parent_version: ${info.version}`);
  text += `fallback_from:\n  version: ${info.version}\n  timestamp: ${date}\n  reason: ${JSON.stringify(opts.reason || 'stable target acquisition failed')}\n`;
  writeFileSync(target, text); console.log(target);
} else if (command === 'result') {
  const info = caseInfo(input || die('usage: result <case.yaml> --status <status> --artifact <run-dir>')); const status = opts.status;
  if (!['passed', 'failed', 'fallback', 'blocked'].includes(status)) die('invalid status'); const artifact = opts.artifact || die('--artifact is required'); ensure(artifact);
  const result = { case_id: info.id, version: info.version, role: info.session, status, artifact: resolve(artifact), timestamp: new Date().toISOString() };
  writeFileSync(join(artifact, 'run.json'), JSON.stringify(result, null, 2)); console.log(join(artifact, 'run.json'));
} else if (command === 'report') {
  const root = input || die('usage: report <artifact-root> --output <report.html>'); const output = opts.output || die('--output is required');
  const files = []; const walk = (dir) => { if (!existsSync(dir)) return; for (const entry of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, entry.name); entry.isDirectory() ? walk(p) : entry.name === 'run.json' && files.push(p); } }; walk(root);
  const rows = files.map((p) => ({ ...JSON.parse(readFileSync(p, 'utf8')), result_file: p })).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  ensure(dirname(output)); writeFileSync(output, `<!doctype html><meta charset="utf-8"><title>Web Test Report</title><style>body{font:14px system-ui;margin:32px;color:#17212b}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccd6dd;padding:8px;text-align:left}.passed{color:#087f23}.failed,.blocked{color:#b42318}.fallback{color:#a15c00}</style><h1>Web Test Report</h1><p>Generated ${new Date().toISOString()} | ${rows.length} runs</p><table><thead><tr><th>Case</th><th>Version</th><th>Role</th><th>Status</th><th>Time</th><th>Artifact</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${escapeHtml(r.case_id)}</td><td>${r.version}</td><td>${escapeHtml(r.role)}</td><td class="${r.status}">${escapeHtml(r.status)}</td><td>${escapeHtml(r.timestamp)}</td><td>${escapeHtml(r.artifact)}</td></tr>`).join('')}</tbody></table>`); console.log(output);
} else die('commands: init, validate, session, fork, result, report');
