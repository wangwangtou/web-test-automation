---
name: web-test-automation
description: Record, author, execute, version, and report role-based web test cases using playwright-cli, Playwright Node locators, and @midscene/web natural-language actions. Use for browser test recording, YAML test-case authoring, UI regression testing, Playwright-to-natural-language fallback, session isolation by role, execution evidence, and test reports.
---

# Web Test Automation

Create portable test cases under `tests/web/cases/`; keep generated artifacts under `tests/web/artifacts/`. Treat the case YAML as the source of truth.

## Define The Test First

Before creating a YAML, recording, or running a browser, establish the test model with the requester. Ask these questions in order when the answer is not already available:

1. What business test case is being verified? Capture its name, purpose, preconditions, and the business outcome that proves success.
2. Which roles participate? List every role, its system identity/session key, and the action or approval it performs. Include both the initiating role and any later reviewer, approver, or recipient.
3. What is the primary business flow? Describe the ordered cross-role path from starting state to final verifiable state, including handoffs, important data, decisions, and failure/exception paths that are in scope.

Restate the proposed case as a compact confirmation before implementation: `case -> roles -> ordered flow -> expected outcome`. Resolve ambiguity before recording. Split independent business outcomes into separate cases; retain a multi-role handoff in one case when it is necessary to prove the end-to-end outcome.

## Case Contract

Start every case with `scripts/case-tool.mjs init`. Keep one business operation chain in one YAML. Every case must declare its business flow, participating roles and session identities, stable Node implementation, natural-language implementation, and snapshots. Use the schema in [case-schema.md](references/case-schema.md).

Use a distinct persisted browser session for each `role.session_key`. Never reuse a session directory across roles or environments. Put secrets and login credentials in environment variables, never in YAML or snapshots.

## Record A Case

1. Confirm the case model. Record each flow segment with the session for the role assigned to that segment.
2. Check the installed `playwright-cli` recorder command with `playwright-cli --help`; start recording in headed mode with the target URL and a role-specific session directory.
3. Perform exactly one operation chain. At meaningful state boundaries, capture a snapshot and label it `before`, `after`, or a business-specific name.
4. Save the raw recording in the case artifact directory. Convert resilient locators and assertions into `stable_node.module`, preserving one ordered step for each recorded interaction.
5. Write an equivalent `natural_language.steps` sequence for Midscene. Use user-visible intent and expected outcome, not implementation details.
6. Validate the case shape with `node scripts/case-tool.mjs validate <case.yaml>`.

Do not treat a raw recorder output as the maintained test. Recorder output is evidence and a starting point; the stable Node module must use explicit, deterministic Playwright locators and assertions.

## Execute

1. Allocate the session path using `node scripts/case-tool.mjs session <case.yaml> --root tests/web/sessions` and launch the target browser with that path.
2. Run the stable Node steps first. Save stdout/stderr, step timings, and requested snapshots under the run artifact directory.
3. If a stable Node step cannot acquire its target after its configured timeout, do not mutate the existing version. Create a new version with `node scripts/case-tool.mjs fork <case.yaml> --reason "<failure reason>"`.
4. Continue the remaining business flow in the new version using `@midscene/web` natural-language steps. Persist the newly observed snapshot and the concrete failure reason. Update only the new version's natural-language steps and evidence; retain the old version as historical evidence.
5. Write one run result using `node scripts/case-tool.mjs result <case.yaml> --status passed|failed|fallback --artifact <run-dir>`.

Only fall back for target-acquisition failures. Assertion failures, authentication failures, navigation failures, and product failures are test failures unless the case explicitly classifies them otherwise.

## Midscene Rules

Use `@midscene/web` to extend, not replace, the deterministic workflow. Start from the current page/session, give one observable action per natural-language step, and assert a visible expected state after each critical action. Store Midscene screenshots and AI action logs beside the run result. Read [tool-integration.md](references/tool-integration.md) before wiring a runner.

## Report

After one or more results exist, generate a self-contained report:

```powershell
node scripts/case-tool.mjs report tests/web/artifacts --output tests/web/reports/latest.html
```

The report must expose case/version, role, status, fallback reason, timing, artifact paths, snapshot paths, and links to raw logs. Do not mark a fallback as a clean stable-path pass.

## Resources

- `scripts/case-tool.mjs`: initialize, validate, fork, record results, and create an HTML report.
- `references/case-schema.md`: YAML schema and a complete example.
- `references/tool-integration.md`: recorder, Playwright, Midscene, session, and evidence rules.
