# Tool Integration

## Recording

Use the installed `playwright-cli` help output as the command authority because recorder subcommands differ by release. Launch recording headed and with the role's user-data/session path. Save its generated script and all recording-time snapshots under the case's `artifacts.recording` path.

Review every generated selector. Prefer `getByRole`, `getByLabel`, `getByTestId`, and explicit URL assertions. Avoid CSS position selectors, generated IDs, and text selectors that encode volatile data.

## Stable Node Runner

Create one ESM module per maintained case version. Provide Playwright's `page` and `expect`, plus a `snapshot(name)` helper that stores a screenshot and optional DOM capture. Bound all locator waits with the YAML timeout. Emit structured JSON per step with start time, end time, selector/action, result, and snapshot paths.

## Midscene Runner

Use the role's already-authenticated browser/page with `@midscene/web`. Run one `aiAction` or equivalent observable instruction at a time, followed by an `aiAssert`/visible-state verification for critical outcomes. Persist Midscene's screenshots and action logs. Use neutral instructions that describe the intended UI result, not inaccessible internal state.

## Fallback And Versions

Target acquisition means resolving a locator to an actionable element. On its timeout, fork first, then continue the remaining operation through natural language. The new case version records `fallback_from` with failed step, timestamp, and error; its stable module is left unchanged until a maintainer promotes a verified replacement. Never overwrite recordings, snapshots, or results from previous versions.

## Sessions And Evidence

Derive a session directory from `role.session_key`, environment, and base URL host. Lock access to a session while a run is active. Redact secrets from logs. Evidence is immutable per run: `run.json`, `stdout.log`, `stderr.log`, screenshots, DOM captures, and Midscene logs. Result statuses are `passed`, `failed`, `fallback`, or `blocked`.
