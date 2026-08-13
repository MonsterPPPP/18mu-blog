# 内容更新与发布手册

本手册面向站点维护者。日常只需要维护 Markdown 与图片；页面、索引、标签、RSS、站点地图、构建和部署均由代码自动完成。

完整的内容契约见 `docs/博客描述.md`，面向自动化维护的细则见 `docs/Agent 内容更新协议.md`。

## 一次更新的流程

1. 同步主分支并新建或修改 `src/content/` 下的 Markdown。
2. 从 `docs/templates/` 复制对应模板，填写全部元数据与正文。
3. 将文章图片放入 `public/images/<内容 slug>/`，在正文中以 `/images/<内容 slug>/<文件名>` 引用。
4. 本地预览，确认标题、中文排版、链接、图片和移动端阅读正常。
5. 运行校验与生产构建。
6. 提交并推送到 `main`。已配置 GitHub Secrets 时会自动发布；否则在已登录 Cloudflare 的本机执行部署命令。
7. 访问生产地址和变更对应页面，确认新内容可见。

## 内容位置

| 内容 | 目录 | 语言与用途 |
| --- | --- | --- |
| 博客 / 知识库 | `src/content/blog/` | 中文定稿文章；可被搜索、认知地图和随机漫步使用。 |
| 项目 | `src/content/projects/` | 公开的中英双语项目说明。 |
| 经历 | `src/content/resume/` | 公开的中英双语经历全集。 |
| For Agent | `src/content/agent/` | 公开、脱敏、可复用的经验和 Skills。 |

文件名就是内容 slug。使用小写英文、数字与连字符，例如 `semantic-writing-workflow.md`；一旦公开，尽量不要改名，以免旧链接失效。

## 写作与元数据

- 博客使用中文，必须填写 `title`、`description`、`updated`、`category`、至少一个 `tags` 和 `published`。`description` 是可独立阅读的一句话摘要。
- 只有准备公开的博客、项目和 For Agent 内容才设为 `published: true`。草稿保留 `false`，不会出现在公开列表。
- `updated` 使用实际修改日期，格式为 `YYYY-MM-DD`。站点只展示最后更新时间，不公开版本历史。
- 项目必须同时提供中文和英文标题、摘要。经历页面同样保持中英双语。
- For Agent 文档写清适用场景、步骤、验证方式与边界，并先完成脱敏。

## 图片、链接与公开性

- 优先采用可压缩的 WebP、AVIF 或 PNG/JPEG；文件名使用小写英文与连字符。
- 图片必须有准确的替代文本，例如 `![认知地图的局部聚类示意](/images/semantic-map/cluster.webp)`。
- 站内链接使用稳定站点路径，例如 `[阅读全部文章](/blog/)`；外链应说明目标来源。
- 提交前确认文本、图片、截图、附件和链接不含密码、令牌、私密地址、个人联系方式、未公开合作信息或受版权限制的材料。

## 本地命令

```powershell
npm install
npm run dev
npm run validate
npm run build
```

`npm run dev` 用于本地预览。`npm run validate` 校验 Markdown metadata 和 TypeScript；`npm run build` 会再次校验并生成部署资产。

## 提交和上线

```powershell
npm run validate
npm run build
git diff --check
git add src/content public/images
git commit -m "docs: add article about semantic writing"
git push origin main
```

提交信息遵循 Conventional Commits，常用类型是 `docs:`（内容或文档）、`feat:`（新能力）、`fix:`（修复）、`chore:`（维护）。推送 `main` 后，GitHub Actions 使用仓库 Secrets `CLOUDFLARE_API_TOKEN` 与 `CLOUDFLARE_ACCOUNT_ID` 自动发布。

自动发布尚未配置或需要立即从本机发布时，先完成 `wrangler login`，再执行：

```powershell
npm run deploy
```

生产地址为 `https://18mu-blog.15589866906.workers.dev`。上线后至少检查首页、`/blog/`、变更内容页面，以及图片和链接。

## 不要提交

- `.dev.vars`、Cloudflare API Token、embedding 密钥或任何凭证。
- `dist/`、`.deploy/`、`.astro/`、`.wrangler/` 等生成或本地状态目录。
- 未脱敏的 Agent 经验、项目内部资料或未获授权的图片与附件。
