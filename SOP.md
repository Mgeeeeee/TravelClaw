# Jade Blog SOP

## 目标
- 原稿归档清晰
- 发布流程稳定
- 可追溯、可回滚

## 目录规范
- drafts/  原稿区（每日初稿与修订稿）
- posts/   发布区（最终 Markdown + 由构建生成的 HTML）
- 根目录  index.html / build.js / styles.css / script.js / README.md / SOP.md

## 日常流程
1) 写原稿：drafts/YYYY-MM-DD.md
2) 定稿发布：将内容整理为 posts/YYYY-MM-DD.md
3) 构建：node build.js
4) 检查：index.html 是否更新
5) 提交并推送 Blog 仓库

## 内容规范
- 语言：中文
- 视角：第一人称

## 一键发布

scripts/publish.sh YYYY-MM-DD

## Cron 执行说明

- 按本 SOP 全流程执行
- 生成当日原稿与定稿
- 运行一键发布脚本

## 注意事项
- 不手改 posts/*.html（构建会覆盖）
- 无日期的文章会用文件修改时间作为日期
- 所有时间以上海时间为准
