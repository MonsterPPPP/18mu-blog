# Agent 内容更新协议

本协议定义 Agent 在本仓库中更新内容、功能或发布链路时的最低操作标准。目标是让维护动作可复现，同时保持 Markdown 为唯一的人工内容来源。

## 读取顺序与变更分类

开始前依次读取 `AGENTS.md`、`docs/博客描述.md`、`docs/技术选型.md`、本协议，以及适用的 OpenSpec 变更。先确定改动属于以下哪一类：

| 类别 | 可修改区域 | 必须确认的结果 |
| --- | --- | --- |
| 内容发布 | `src/content/`、`public/images/`、内容模板 | schema 合法、公开范围正确、页面能构建。 |
| 内容流程 | `CONTRIBUTING.md`、`AGENTS.md`、`docs/`、模板 | 人与 Agent 的步骤一致且命令可执行。 |
| 站点功能 | `src/`、依赖、配置、测试 | 需求已在 OpenSpec 中描述，关键页面和构建通过。 |
| Cloudflare/语义同步 | `worker.ts`、`wrangler.toml`、工作流、部署文档 | 密钥不入库，绑定与部署路径已验证。 |

跨越多个类别时，将其拆成可审查的小提交；不要借内容更新顺手重构站点。

## 内容更新程序

1. 读取 `src/content.config.ts` 和对应模板，确认当前 schema 接受的字段。
2. 使用唯一、稳定的 slug 新建或修改 Markdown；公开已存在内容时避免改名。
3. 根据内容类型执行边界检查：
   - `blog`：中文定稿、准确的摘要/分类/标签；可参与未来语义处理。
   - `projects` 与 `resume`：中文和英文信息成对且含义一致；只做公开职业叙事。
   - `agent`：抽离具体项目、去除身份与敏感细节，包含适用场景、步骤、验证与限制。
4. 检查正文中的图片、链接、代码片段和附件：路径存在、替代文本准确、无私密信息、无未经授权内容。
5. `published: false` 只用于未准备公开的草稿；发布前显式改为 `true`。
6. 更新 `updated` 为实际修改日期。不要捏造发布日期或历史版本。

## 语义地图与随机漫步

认知地图和随机漫步仅覆盖 `published: true` 的博客文章。标签、分类、链接和相邻文件名都不能被当作语义相似度的替代品。

在 embedding 供应商尚未配置或同步能力未实现时：

- 保持公开 UI 对功能状态的描述真实。
- 不生成伪造的地图节点、随机推荐或手工关系数据。
- 不在浏览器、Markdown、Git history 或公开 JSON 中写入端点、模型密钥或认证头。

供应商接入后，派生数据必须可由已发布博客 Markdown 重建；Worker 保存 provider 配置和密钥，浏览器只读取无密钥的公开快照。

## 公共记录关系

- 文件 slug 是内容的稳定公开标识。项目详情路径为 `/projects/<slug>`，For Agent 详情路径为 `/agent/<slug>`。
- `projects` 支持 `relatedResume`、`relatedBlog`、`relatedAgent`；`resume` 支持 `relatedProjects`。这些字段只能填目标公开 Markdown 文件的 slug。
- 项目与经历应形成双向可阅读关系：任一方声明后，页面会自动呈现另一个方向。项目指向博客或 For Agent 时仅提供单向跳转。
- 每次修改关系后都运行 `npm run validate:relations`；该命令也包含在完整 `npm run validate` 中。不要以页面 URL、标题或人工标签替代 slug。
- Agent 区的标签、搜索与详情只作用于 `agent` collection，绝不发送到 embedding 同步端点。

## 验证与提交程序

每次可提交改动至少执行：

```powershell
npm run validate
npm run build
git diff --check
git status --short
```

对于可见页面、导航、搜索、地图或随机漫步的改动，还要运行本地预览并检查目标路由。对于 Worker 或工作流改动，还要检查 `wrangler.toml`、部署命令和仓库 Secrets 的文档是否仍一致。

仅在以上检查通过后，使用单一职责的 Conventional Commit 提交，例如：

```text
docs: publish markdown writing guide
feat: add semantic map snapshot loader
fix: preserve article image paths
```

禁止提交凭据、生成目录和与本次任务无关的工作区变更。不要自行覆盖其他协作者的未提交内容。

## 发布与验收

优先通过推送 `main` 触发 GitHub Actions；这要求仓库已配置 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。仅在本机已认证且需要直接发布时执行 `npm run deploy`。工作流部署后会自动执行 `npm run sync:knowledge`，只同步 `published: true` 的博客内容；同步令牌和模型密钥由 GitHub Secrets 与 Cloudflare Worker 管理，Agent 不得读取、输出或提交它们。

部署完成后，访问生产站并验证受影响的公开 URL。内容更新至少检查：首页缩略、所属列表、详情页、图片和链接。部署失败时报告失败命令、可复现错误和未完成的步骤，不要把失败描述为已发布。

## 交接报告

完成一次 Agent 任务时，报告：改动文件、用户可见行为、执行过的验证及结果、部署状态、以及仍需维护者提供的输入（例如 embedding provider 的配置）。报告不应包含密钥、令牌或私人内容。
