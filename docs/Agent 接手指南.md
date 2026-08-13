# Agent 接手指南

本文是后续 Agent 的入口。它不替代 `AGENTS.md`：后者是仓库级硬约束；本文说明当前系统状态、阅读顺序和文档维护规则。

## 开始前阅读顺序

1. `AGENTS.md`：红线、内容边界和最低验证要求。
2. `docs/文档索引.md`：定位当前任务的权威文档。
3. `docs/博客描述.md`：产品、公开范围与信息架构。
4. `docs/博客架构.md`：已实现的数据流、路由、API 和发布链路。
5. `docs/部署踩坑记录.md`：已验证的排障经验。
6. `docs/Agent 内容更新协议.md`：内容、功能和发布的操作规则。
7. 产品功能改动前，读取 `openspec/changes/` 中活跃变更。

内容作者流程看 `CONTRIBUTING.md`；Cloudflare、GitHub Secret 或轮换看 `docs/Cloudflare 与 GitHub 配置手册.md`。

## 当前状态

- 主分支为 `main`。
- 站点是 Astro 静态内容站，部署为 Cloudflare Worker Static Assets。
- 生产地址为 `https://18mu-blog.15589866906.workers.dev`。
- `src/content/` Markdown 是唯一人工内容源。
- embedding 由 Worker 侧调用，快照存入 KV；仅已发布博客进入地图与随机漫步。
- GitHub Actions 负责构建、Worker 部署和知识同步。
- 所有内容公开；没有登录、评论、支付、私有模式或浏览器端凭据。

接手时必须从实时状态取证：`git status --short --branch`、`git log --oneline -5`、`npm run validate`，以及 `gh run list --repo MonsterPPPP/18mu-blog --limit 5`。

## 任务行动表

| 任务 | 先读 | 主要修改位置 | 必做验证 |
| --- | --- | --- | --- |
| 发布博客 | `CONTRIBUTING.md`、模板、schema | `src/content/blog/`、`public/images/` | `npm run validate`、`npm run build`、发布后检查 `articleCount`。 |
| 发布项目/经历/Agent | 模板、schema、贡献手册 | 对应内容集合 | `npm run validate:relations`、`npm run build`。 |
| 改页面/交互 | 架构、Agent 协议、OpenSpec | `src/` | 类型检查、构建、HTTP 预览或生产路由检查。 |
| 改 Worker/发布 | 架构、配置手册、踩坑记录 | `worker.ts`、`wrangler.toml`、workflow | 构建、配置核对、Actions 成功和同步日志。 |
| 改 schema/关系 | schema、模板、架构 | schema、模板、校验脚本、文档 | 关系校验、类型检查、构建。 |

新增产品行为要先创建或更新 OpenSpec。纯文档澄清、已知故障记录和不改变行为的维护无需伪造 OpenSpec。

## 不可违反的边界

- 不捏造履历、项目结果、文章、引用、翻译或公开关系；缺少来源时请求维护者提供。
- 不输出或提交 API key、token、私有 URL、身份/客户信息和项目机密。
- 不让项目、经历、For Agent 进入 embedding 同步、知识地图或随机漫步。
- 不把标签、分类或手工关系伪装为语义相似度。
- 不覆盖其他协作者未提交的改动，不提交生成目录、`.dev.vars` 或凭据。

## 文档体系维护

| 文档 | 维护的事实 |
| --- | --- |
| `docs/博客描述.md` | 产品目标与内容边界。 |
| `docs/技术选型.md` | 长期技术选择。 |
| `docs/博客架构.md` | 当前实现、数据流、API、路由与运行核对。 |
| `docs/部署踩坑记录.md` | 已验证故障、处理和预防。 |
| `docs/Cloudflare 与 GitHub 配置手册.md` | 人类账户、资源、Secret、轮换和发布配置。 |
| `CONTRIBUTING.md` | 人类日常内容更新。 |
| `docs/Agent 内容更新协议.md` | Agent 操作、验证和交接。 |
| `docs/文档索引.md` | 文档发现入口。 |

以下改动必须同步维护文档：schema/模板/slug 关系变更；页面、路由、API 或数据流变更；Worker binding、Secret 名称、GitHub Secret、工作流、生产 URL 或模型提供方变更；已验证的新故障处理；以及新增长期文档。新文档同一提交更新文档索引和 README。

文档只写已验证事实。故障记录必须有症状、根因、处理、验证和预防；命令必须能在 Windows PowerShell 下执行；永远不写 Secret 实际值。

## 提交、发布与交接

每个可提交改动至少执行 `npm run validate`、`npm run build`、`git diff --check` 和 `git status --short`。使用单一职责 Conventional Commit。正常发布推送到 `main`，然后确认 Actions 的 `npm run build`、`npx wrangler deploy`、`npm run sync:knowledge` 都成功。

交接报告必须说明改动文件、用户可见影响、执行命令及结果、Git 提交/推送/Actions/Cloudflare 各自状态、未完成项和需要维护者决定的内容。报告不得包含凭据或私人内容。
