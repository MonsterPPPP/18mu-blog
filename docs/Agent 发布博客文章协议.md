# Agent 发布博客文章协议

**结论：** Agent 收到一份 Markdown 和发布授权后，必须先读取仓库规范，再补全可确认的元数据，完成校验、构建、提交和推送；任何事实、凭据或权限不明确时必须暂停并向维护者提问。

## 适用范围

本协议只处理 `src/content/blog/` 中博客文章的新增、修改、发布、下架、删除和恢复。Agent 不得借此修改站点功能、Worker 配置、Secret、embedding 配置或无关内容。

## 必须读取

1. `AGENTS.md`
2. `docs/文档索引.md`
3. `docs/博客描述.md`
4. `docs/博客架构.md`
5. `docs/部署踩坑记录.md`
6. `docs/Agent 内容更新协议.md`
7. `src/content.config.ts`、`docs/templates/blog.md` 和目标 Markdown（修改既有文章时）

如果存在与本次内容相关的活动 OpenSpec 变更，也必须先读取其说明和任务。

## 接收输入

Agent 从用户 prompt 或附件中识别以下信息：

- 操作：新增、修改、临时下架、永久删除、恢复或回滚。
- 文章正文或修改要求。
- 用户明确授权的动作：是否允许补全元数据、提交和推送 `main`。
- 可选约束：标题、slug、分类、标签、摘要、`featured`、日期、图片和不可修改范围。

只提供一份 Markdown 时，默认按“新增文章”处理，但必须向用户确认允许生成 slug、摘要、分类、标签、日期和提交推送。用户未授权推送时，只做到本地验证并报告待执行动作。

## 新增文章流程

1. 检查工作区状态，确认不覆盖其他未提交修改；同步 `main` 时使用 `git pull --ff-only origin main`。
2. 根据用户提供的标题和正文生成稳定 slug。优先使用用户指定 slug；没有指定时使用小写英文、数字和连字符，先检查目标文件是否已存在。
3. 根据正文提炼一句准确摘要、一个合适分类和至少一个真实标签。标签只能描述文章主题，不能伪造语义关系；无法确认时向用户提问。
4. 创建 `src/content/blog/<slug>.md`，填写 schema 接受的 `title`、`description`、`updated`、`category`、`tags`、`featured` 和 `published`。得到明确发布授权后设置 `published: true`，否则设置 `false`。
5. 将用户提供的图片放入 `public/images/<slug>/`，修正正文中的绝对图片路径和替代文本。不得自行寻找或编造未经授权的图片来源。
6. 运行 `npm run validate`、`npm run build` 和 `git diff --check`；必要时运行本地预览检查文章页面。
7. 只暂存本次文件，检查 `git diff`，使用 Conventional Commit 提交。得到推送授权后执行 `git push origin main`。
8. 检查 GitHub Actions 的构建、部署和 `sync:knowledge` 状态；区分本地构建成功、已推送和线上发布成功。

## 修改与状态变更

1. 修改既有文章时保持 slug 不变，将 `updated` 改为实际修改日期，并只修改用户授权范围。
2. 临时下架时只将 `published` 改为 `false`，保留 Markdown 和图片。
3. 永久删除前运行 `rg -n "<slug>|/blog/<slug>" . -g '!node_modules' -g '!.git'`，报告引用；只删除用户确认的目标文件和不再使用的图片。
4. 恢复下架文章时将 `published` 改为 `true`；恢复误删内容时从 Git 历史读取并创建新的恢复提交。
5. 错误发布优先创建修复提交。禁止 `git push --force`、改写 `main` 历史和直接修改生成目录。

## 必须暂停的情况

1. 文章包含无法核实的事实、引用、经历、翻译、图片授权或语义关系。
2. slug 已存在但用户未说明是修改还是覆盖。
3. 用户要求读取、输出、写入或提交 token、API key、Secret 或私密资料。
4. 工作区存在与本次任务无关且可能被影响的未提交修改。
5. 构建、关系校验或部署失败，且修复需要超出用户授权范围的配置或代码变更。

## 交付报告

完成后报告：改动文件、最终 slug、标题/摘要/分类/标签、`published` 状态、执行过的验证、提交号、推送结果、Actions 状态和生产 URL。失败时报告失败命令、可复现错误和未完成步骤，不得把失败描述为已发布。
