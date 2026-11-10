# Web Test Automation

用于记录、编写、执行和报告基于角色的网页测试用例的 Codex Skill。

该 Skill 结合 `playwright-cli` 的录制能力、稳定的 Playwright Node 定位器，以及 `@midscene/web` 的自然语言操作，为同一业务用例维护可追溯的测试流程、会话隔离、版本回退和执行证据。

## 内容

- `SKILL.md`：测试建模、录制、执行和报告流程。
- `scripts/case-tool.mjs`：初始化、校验、会话分配、版本创建、结果记录和报告生成工具。
- `references/`：YAML 用例格式与工具集成说明。
- `docs/`：项目设计与生成过程的对话记录。

## 基本使用

```powershell
node scripts/case-tool.mjs init checkout --root tests/web/cases
node scripts/case-tool.mjs validate tests/web/cases/checkout.yaml
node scripts/case-tool.mjs report tests/web/artifacts --output tests/web/reports/latest.html
```

用例 YAML 是测试的唯一事实来源。凭据应通过环境变量提供，不要写入用例或快照。

详细工作流请参阅 [SKILL.md](SKILL.md)。
