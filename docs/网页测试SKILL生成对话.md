# 我需要在当前目录整理和网页测试相关的SKILL，包括网页测试和用例自动录入等。使用 @midscene/web 和 p…

> 我需要在当前目录整理和网页测试相关的SKILL，包括网页测试和用例自动录入等。使用 @midscene/web 和 playwright-cli 等技术。 用例录入需包含自然语言和稳定的Node两种方式。 录制时用 开启 playwright-cli 录制，录制完成一个操作链保存到一个yaml中，包含执行的脚本和不同时期的snapshot。不同的角色使用不同的session进行执行。完整用例可在 midscene 的规则上扩展。 执行时，当稳定的Node无法获取时，将该用例保存为一个新的版本，并用自然语言继续执行，并更新到新版本用例中。用例执行需记录执行结果，并最终生成报告。

<details><summary>10 previous messages</summary>

> 我会在当前目录创建一套可复用的网页测试 Skill，覆盖录制、双模式用例、角色会话执行、回退版本化和报告产出。由于这是创建 Skill 的工作，我会按 `skill-creator` 的规范先读取其要求，再落地目录结构和模板。
>
> <details><summary>Ran a command</summary>
>
> - Ran `Get-Content -Raw 'C:\Users\wangx\.codex\skills\.system\skill-creator\SKILL.md'`
>
> </details>
>
> 需求已经足够明确：我会在当前目录生成一个 `web-test-automation` Skill。它会附带确定性的脚本，用来初始化/校验 YAML 用例、创建版本、记录执行结果并汇总 HTML 报告；操作层则明确约束 `playwright-cli` 录制和 `@midscene/web` 的自然语言扩展。
>
> <details><summary>Ran 3 commands</summary>
>
> - Ran `$skillRoot='C:\Users\wangx\.codex\skills\.system\skill-creator'; Get-ChildItem -Recurse -File $skillRoot | Select-Object -ExpandProperty FullName; Get-ChildItem -Force`
> - Ran `python 'C:\Users\wangx\.codex\skills\.system\skill-creator\scripts\init_skill.py' web-test-automation --path 'C:\Users\wangx\Documents\bgdata\codex\ai-test' --resources scripts,references --interface 'display_name=Web Test Automation' --interface 'short_description=Record, execute, version, and report web tests.' --interface 'default_prompt=Use $web-test-automation to record and execute a role-based web test case.'`
> - Ran `Get-Content -Raw 'web-test-automation\SKILL.md'; Get-Content -Raw 'web-test-automation\agents\openai.yaml'; node --version; npm --version`
>
> </details>
>
> 我正在把可变的工具命令从主 Skill 中抽离为参考资料，同时将用例格式固定下来：每条 YAML 包含角色、稳定 Node 流程、自然语言流程、每步快照和版本链。这样录制产物和后续的降级续跑产物能被脚本稳定处理。
>
> <details><summary>Created 4 files</summary>
>
> - Wrote `./web-test-automation/SKILL.md` (+54 -0)
> - Wrote `./web-test-automation/references/case-schema.md` (+46 -0)
> - Wrote `./web-test-automation/references/tool-integration.md` (+23 -0)
> - Wrote `./web-test-automation/scripts/case-tool.mjs` (+49 -0)
>
> </details>
>
> Skill 的主体和可执行工具已经写入。接下来我会修正脚本的 ESM 兼容性，并在临时目录里跑完整生命周期：建用例、校验、分配会话、产生回退版本、写结果、生成报告。
>
> <details><summary>Edited a file, ran 2 commands</summary>
>
> - Wrote `./web-test-automation/scripts/case-tool.mjs` (+3 -3)
> - Ran `$testRoot = Join-Path $env:TEMP ('web-test-skill-' + [guid]::NewGuid().ToString('N')); New-Item -ItemType Directory -Path $testRoot | Out-Null; node .\web-test-automation\scripts\case-tool.mjs init checkout --root (Join-Path $testRoot 'cases'); $case = Join-Path $testRoot 'cases\checkout.yaml'; node .\web-test-automation\scripts\case-tool.mjs validate $case; node .\web-test-automation\scripts\case-tool.mjs session $case --root (Join-Path $testRoot 'sessions'); $fork = node .\web-test-automation\scripts\case-tool.mjs fork $case --reason 'locator timeout'; node .\web-test-automation\scripts\case-tool.mjs result $fork --status fallback --artifact (Join-Path $testRoot 'artifacts\run-001'); node .\web-test-automation\scripts\case-tool.mjs report (Join-Path $testRoot 'artifacts') --output (Join-Path $testRoot 'report.html'); if (-not (Test-Path (Join-Path $testRoot 'report.html'))) { throw 'report was not created' }; Get-Content -Raw (Join-Path $testRoot 'artifacts\run-001\run.json'); Remove-Item -LiteralPath $testRoot -Recurse -Force`
> - Wrote `./web-test-automation/scripts/case-tool.mjs` (+4 -1)
> - Ran `node --check .\web-test-automation\scripts\case-tool.mjs; node .\web-test-automation\scripts\case-tool.mjs init checkout --root .\web-test-automation\.validation\cases; node .\web-test-automation\scripts\case-tool.mjs validate .\web-test-automation\.validation\cases\checkout.yaml; node .\web-test-automation\scripts\case-tool.mjs session .\web-test-automation\.validation\cases\checkout.yaml --root .\web-test-automation\.validation\sessions; node .\web-test-automation\scripts\case-tool.mjs fork .\web-test-automation\.validation\cases\checkout.yaml --reason 'locator timeout'; node .\web-test-automation\scripts\case-tool.mjs result .\web-test-automation\.validation\cases\checkout.v2.yaml --status fallback --artifact .\web-test-automation\.validation\artifacts\run-001; node .\web-test-automation\scripts\case-tool.mjs report .\web-test-automation\.validation\artifacts --output .\web-test-automation\.validation\report.html; Get-Content -Raw .\web-test-automation\.validation\artifacts\run-001\run.json`
>
> </details>
>
> 生命周期测试已通过：脚本能够创建用例、校验 schema、生成角色会话路径、创建 `v2` 回退版本、记录 `fallback` 结果并生成 HTML 报告。我会清理这次专用验证目录，然后运行 Skill 结构校验。
>
> <details><summary>Deleted 4 files, ran 3 commands</summary>
>
> - Ran `$target = 'C:\Users\wangx\Documents\bgdata\codex\ai-test\web-test-automation\.validation'; if (-not (Test-Path -LiteralPath $target)) { throw 'Validation directory not found' }; Remove-Item -LiteralPath $target -Recurse -Force; python 'C:\Users\wangx\.codex\skills\.system\skill-creator\scripts\quick_validate.py' 'C:\Users\wangx\Documents\bgdata\codex\ai-test\web-test-automation'; Get-ChildItem -Recurse -File .\web-test-automation | Select-Object -ExpandProperty FullName`
> - Ran `python 'C:\Users\wangx\.codex\skills\.system\skill-creator\scripts\quick_validate.py' 'C:\Users\wangx\Documents\bgdata\codex\ai-test\web-test-automation'; Get-ChildItem -Recurse -File .\web-test-automation | Select-Object -ExpandProperty FullName`
> - Deleted `./web-test-automation/.validation/artifacts/run-001/run.json` (+0 -8)
> - Deleted `./web-test-automation/.validation/cases/checkout.v2.yaml` (+0 -24)
> - Deleted `./web-test-automation/.validation/cases/checkout.yaml` (+0 -20)
> - Deleted `./web-test-automation/.validation/report.html` (+0 -1)
> - Ran `git status --short; Get-ChildItem -Recurse -File .\web-test-automation | Select-Object -ExpandProperty FullName`
>
> </details>
</details>

已在当前目录创建 [web-test-automation](./web-test-automation/SKILL.md) Skill。

包含：

- `playwright-cli` 录制流程、每个操作链一个 YAML、阶段性 snapshot 保存。
- 每角色独立 session，避免身份与环境串用。
- 同一用例的稳定 Node 实现与 `@midscene/web` 自然语言实现。
- 稳定定位失败时自动 fork 新版本，用自然语言续跑并保留失败证据。
- 运行结果、日志、快照、HTML 汇总报告规范。
- 可执行工具 [case-tool.mjs](./web-test-automation/scripts/case-tool.mjs)，支持 `init`、`validate`、`session`、`fork`、`result`、`report`。
- YAML 格式和工具接入细节见 [case-schema.md](./web-test-automation/references/case-schema.md) 与 [tool-integration.md](./web-test-automation/references/tool-integration.md)。

已完成脚本生命周期测试和 `quick_validate.py` 校验，Skill 结构有效。

> 在SKILL中增加引导，让使用者先确定是什么测试用例，涉及哪几个角色，主要的业务流程描述。

<details><summary>6 previous messages</summary>

> 我会在 Skill 的工作流起点增加“用例建模”引导：先收集测试目标、角色和主业务流程；信息不完整时先追问，确认后才开始录制或创建 YAML。随后会重新跑结构校验。
>
> <details><summary>Ran a command</summary>
>
> - Ran `Get-Content -Raw .\web-test-automation\SKILL.md`
>
> </details>
>
> 我会把建模阶段放在 YAML 创建之前，并同步扩展 YAML 契约，要求记录业务流、参与角色和各自职责，避免录制后才发现覆盖范围不完整。
>
> <details><summary>Edited 3 files, ran a command</summary>
>
> - Wrote `./web-test-automation/SKILL.md` (+17 -6)
> - Wrote `./web-test-automation/references/case-schema.md` (+16 -4)
> - Wrote `./web-test-automation/scripts/case-tool.mjs` (+2 -2)
> - Ran `node --check .\web-test-automation\scripts\case-tool.mjs; node .\web-test-automation\scripts\case-tool.mjs init model-check --root .\web-test-automation\.validation\cases; node .\web-test-automation\scripts\case-tool.mjs validate .\web-test-automation\.validation\cases\model-check.yaml; python 'C:\Users\wangx\.codex\skills\.system\skill-creator\scripts\quick_validate.py' 'C:\Users\wangx\Documents\bgdata\codex\ai-test\web-test-automation'`
>
> </details>
>
> 新增的用例模板和 Skill 结构均已校验通过。我会移除校验过程中生成的临时用例文件，目录只保留正式的 Skill 内容。
>
> <details><summary>Deleted a file</summary>
>
> - Deleted `./web-test-automation/.validation/cases/model-check.yaml` (+0 -26)
>
> </details>
</details>

已更新 [SKILL.md](./web-test-automation/SKILL.md)。

现在开始录制或创建 YAML 前，Skill 会先引导确认：

1. 测试用例是什么：名称、目的、前置条件、成功业务结果。
2. 涉及哪些角色：每个角色的会话身份和职责。
3. 主要业务流程：跨角色操作顺序、交接、关键数据、决策及异常范围。

确认摘要格式为：`case -> roles -> ordered flow -> expected outcome`。同时 YAML 模板已增加 `purpose`、`roles` 与 `business_flow` 字段，并通过结构和脚本校验。
