# Cloudflare 与 GitHub 配置手册

这份手册面向 `18mu-blog` 的站点维护者。完成后，推送到 GitHub 的 `main` 分支会自动完成：内容关系校验、类型检查、静态构建、Cloudflare Workers 部署，以及博客语义快照同步。

不要把任何 token、API key 或同步令牌写进 Markdown、源代码、Git 历史、截图或聊天记录。

## 0. 当前已存在的生产资源

以下资源已经创建，正常维护时只需核对，**不要重复创建**：

| 资源 | 当前值 | 用途 |
| --- | --- | --- |
| Cloudflare Account ID | `8b26118de1720b6efeec0dfdd715b7ad` | GitHub Actions 部署目标 |
| Worker 名称 | `18mu-blog` | 静态站点、公开 API 与同步端点 |
| 生产地址 | `https://18mu-blog.15589866906.workers.dev` | 当前公开站点 |
| KV Namespace | `KNOWLEDGE_KV` | 保存知识地图与随机漫步快照 |
| KV Namespace ID | `ad05af24099647ed989baca691ad90c8` | 写在 `wrangler.toml` 的绑定配置中 |
| embedding 模型 | `qwen3.7-text-embedding` | 博客语义向量 |

当前 Worker 已有两个 Secret：`DASHSCOPE_API_KEY` 和 `SYNC_TOKEN`。Secret 只能确认名称是否存在，不能也不应读取原值。

## 1. 本机前置检查

在项目根目录执行：

```powershell
npx wrangler whoami
npx wrangler secret list
npx wrangler kv namespace list
& 'C:\Program Files\GitHub CLI\gh.exe' auth status
& 'C:\Program Files\GitHub CLI\gh.exe' secret list --repo MonsterPPPP/18mu-blog
```

预期结果：

- `wrangler whoami` 显示 Cloudflare 账号 `15589866906@163.com` 与上表 Account ID。
- Worker Secret 列表包含 `DASHSCOPE_API_KEY`、`SYNC_TOKEN`。
- KV 列表包含 `KNOWLEDGE_KV`。
- GitHub Secret 列表包含 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`、`KNOWLEDGE_SYNC_TOKEN`。

若本机尚未登录，执行：

```powershell
npx wrangler login
& 'C:\Program Files\GitHub CLI\gh.exe' auth login
```

浏览器完成授权即可。Wrangler 登录仅供本机调试或紧急直接发布，不替代 GitHub Actions 使用的 Cloudflare API Token。

## 2. 创建 Cloudflare 部署 API Token

GitHub Actions 需要一枚独立的 Cloudflare API Token。不要使用 Global API Key，也不要把本机 OAuth token 当成长期 CI 凭据。

1. 打开 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)。
2. 选择 **Create Token**，再选择 **Create Custom Token**。
3. 名称填写 `github-actions-18mu-blog-deploy`。
4. 在 **Permissions** 添加以下账户级权限：

   | 范围 | 权限 |
   | --- | --- |
   | Account / Workers Scripts | Edit |
   | Account / Workers KV Storage | Edit |
   | Account / Account Settings | Read |

5. 在 **Account Resources** 选择当前账户：`15589866906@163.com` 对应的账户。不要选择所有账户，除非以后确实需要跨账户部署。
6. 有域名路由需求时再添加 `Account / Workers Routes / Edit`；当前 `workers.dev` 部署不需要这项权限。
7. 创建并复制 Token。Cloudflare 只会显示一次，复制后立即进入下一步；不要保存到文件。

Token 到期策略由维护者决定。个人站点可设为较长有效期，但必须在到期前轮换。Token 被泄露时，立刻在 Cloudflare 页面撤销并按本手册重新创建。

## 3. 配置 GitHub Actions Secrets

仓库：`MonsterPPPP/18mu-blog`。

在 GitHub 网页依次进入：

`Repository -> Settings -> Secrets and variables -> Actions -> New repository secret`

创建或更新以下三项，名称必须完全一致：

| Secret 名称 | 填入内容 | 是否可公开 |
| --- | --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | `8b26118de1720b6efeec0dfdd715b7ad` | 可以，但仍统一作为 Secret 管理 |
| `CLOUDFLARE_API_TOKEN` | 第 2 节新建的 Cloudflare API Token | 不可以 |
| `KNOWLEDGE_SYNC_TOKEN` | 与 Worker 的 `SYNC_TOKEN` **完全相同**的随机令牌 | 不可以 |

也可以通过 GitHub CLI 设置。执行命令会进入交互输入，避免 token 出现在终端历史：

```powershell
& 'C:\Program Files\GitHub CLI\gh.exe' secret set CLOUDFLARE_ACCOUNT_ID --repo MonsterPPPP/18mu-blog
& 'C:\Program Files\GitHub CLI\gh.exe' secret set CLOUDFLARE_API_TOKEN --repo MonsterPPPP/18mu-blog
& 'C:\Program Files\GitHub CLI\gh.exe' secret set KNOWLEDGE_SYNC_TOKEN --repo MonsterPPPP/18mu-blog
```

每条命令执行后按提示粘贴对应值，再按 Enter。配置后只能检查 Secret 名称和更新时间，不能读取值：

```powershell
& 'C:\Program Files\GitHub CLI\gh.exe' secret list --repo MonsterPPPP/18mu-blog
```

## 4. 配置或轮换 Worker Secrets

### 4.1 同步令牌

`SYNC_TOKEN` 用于保护 `POST /api/sync/knowledge`。它必须与 GitHub 的 `KNOWLEDGE_SYNC_TOKEN` 相同。

首次创建或轮换时：

1. 生成一段随机文本，例如使用密码管理器生成 32 字符以上的随机值。
2. 在项目根目录执行：

   ```powershell
   npx wrangler secret put SYNC_TOKEN
   ```

3. 按提示粘贴随机值。
4. 立即在 GitHub 更新 `KNOWLEDGE_SYNC_TOKEN` 为同一个值。
5. 触发一次 GitHub 工作流，按第 6 节验证。

不要执行 `wrangler secret put` 后只更新一端；两端不一致会使知识同步返回 `401 Unauthorized`。

### 4.2 embedding API Key

`DASHSCOPE_API_KEY` 只保存在 Worker 中，用于调用已配置的 OpenAI-compatible embedding 服务。

配置或轮换时：

```powershell
npx wrangler secret put DASHSCOPE_API_KEY
```

粘贴新 key 后，重新触发 GitHub 工作流。公开配置 `EMBEDDING_BASE_URL`、`EMBEDDING_MODEL` 与 `EMBEDDING_DIMENSIONS` 位于 `wrangler.toml`；若切换供应商或模型，必须确认接口兼容 `/embeddings`、返回 OpenAI-compatible `data[].embedding`，并更新这三个公开配置。密钥仍然只通过 `wrangler secret put` 写入。

## 5. KV 与 Worker 绑定的首次创建流程

这一步仅适用于迁移到新 Cloudflare 账户或意外删除资源时；当前账户不需要执行。

```powershell
npx wrangler kv namespace create KNOWLEDGE_KV
```

命令会返回新的 namespace ID。将它填入 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "KNOWLEDGE_KV"
id = "新返回的 namespace ID"
```

随后依次设置 `SYNC_TOKEN`、`DASHSCOPE_API_KEY`，再执行一次部署。不要把 namespace ID 当作 Secret；它是 Worker 绑定标识，不是认证凭据。

## 6. 首次发布与自动部署验证

推荐通过 GitHub Actions 验证完整链路：

1. 打开仓库的 [Actions 页面](https://github.com/MonsterPPPP/18mu-blog/actions)。
2. 选择 **Deploy to Cloudflare Workers**。
3. 点击 **Run workflow**，分支选择 `main`，然后确认运行。
4. 等待以下步骤全部成功：

   ```text
   npm ci
   npm run build
   npx wrangler deploy
   npm run sync:knowledge
   ```

5. 打开 `npm run sync:knowledge` 的日志，确认结果包含类似内容：

   ```json
   {"updatedAt":"...","articleCount":2}
   ```

   `articleCount` 是当前 `published: true` 博客文章数量；随着博客发布而变化。
6. 在浏览器检查：

   - `https://18mu-blog.15589866906.workers.dev`
   - `https://18mu-blog.15589866906.workers.dev/blog`
   - `https://18mu-blog.15589866906.workers.dev/projects`
   - `https://18mu-blog.15589866906.workers.dev/resume`
   - `https://18mu-blog.15589866906.workers.dev/agent`
   - `https://18mu-blog.15589866906.workers.dev/map`
   - `https://18mu-blog.15589866906.workers.dev/walk`

7. 可选地访问公开快照：

   `https://18mu-blog.15589866906.workers.dev/api/knowledge`

   返回的 JSON 只包含公开文章的派生数据，绝不应包含 API key、同步令牌或原始 embedding 向量。

在日常维护中，只要完成 `git push origin main`，同一工作流会自动运行。

## 7. 本机直接部署的用途与限制

本机直接部署用于紧急排障或在 GitHub Actions 未配置前验证 Worker：

```powershell
npm run deploy
```

这个命令会构建并部署站点，但**不会自动执行知识同步**。正常上线仍应通过第 6 节的 GitHub Actions 运行一次，以部署后重建 KV 语义快照。不要为方便本机同步而把 `SYNC_TOKEN` 写入 `.dev.vars`、脚本或仓库文件。

## 8. 常见故障处理

| 现象 | 原因 | 处理方式 |
| --- | --- | --- |
| `Authentication error [10000]` 或 `Invalid access token [9109]` | GitHub 的 `CLOUDFLARE_API_TOKEN` 无效、过期或权限不足 | 新建或轮换第 2 节 Token，更新 GitHub Secret，再手动运行工作流。 |
| `401 Unauthorized` 出现在 `sync:knowledge` | `SYNC_TOKEN` 与 `KNOWLEDGE_SYNC_TOKEN` 不一致 | 按第 4.1 节在两端用同一个新值重新设置。 |
| `502 Embedding provider returned ...` | 模型 API key、端点、模型名、维度或供应商账户不可用 | 先检查 Worker Secret 名称，再核对 `wrangler.toml` 的公开 endpoint/model/dimensions；不要在日志中打印 API key。 |
| `Content relationships are valid` 失败 | Markdown 的关联 slug 指向不存在或未公开的内容 | 修改 `relatedResume`、`relatedProjects`、`relatedBlog` 或 `relatedAgent`，使它指向已发布 Markdown 的文件 slug。 |
| Worker 已部署但地图为空 | 语义同步步骤未执行或没有已发布博客 | 在 Actions 重跑工作流，并检查 `articleCount`；确认目标博客包含 `published: true`。 |

## 9. 轮换清单

每次 token/API key 轮换后，按以下顺序完成：

1. 在提供方创建新值，先不要撤销旧值。
2. 更新对应 Worker Secret 或 GitHub Secret。
3. 手动运行 GitHub 工作流并确认成功。
4. 检查生产站与 `articleCount`。
5. 仅在新链路验证成功后撤销旧值。

Cloudflare 部署 Token 只更新 GitHub Secret；embedding key 只更新 Worker Secret；同步 token 必须同时更新 Worker 和 GitHub Secret。
