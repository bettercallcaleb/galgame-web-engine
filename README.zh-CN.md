# Galgame Web Engine — 简体中文

一个**无需构建链**的开源 Web Galgame / Visual Novel 底座：原生 HTML、CSS、JavaScript + JSON 剧情图。

> 不需要 npm，不需要 bundler，不需要框架。改剧情 JSON、换素材，然后直接当静态网站发布。

## 已有能力

- JSON 驱动的剧情节点图
- 多女主、多路线、多结局
- 变量、效果、条件分支
- 大立绘、头像卡、背景、CG
- AUTO、只跳已读的 SKIP、回退、历史记录
- 多槽位存档/读档 + 自动存档
- CG 回想、人物资料、章节选择、成就、音乐室
- BGM/SFX 接口与程序化雨声
- 剧情断链、可达性、素材引用审计
- `AGENTS.md` + Codex 开发工作流

## 启动

```bash
./start.sh --port 10000
```

浏览器打开：`http://127.0.0.1:10000`

Windows：

```bat
start.bat 10000
```

## 改成你自己的 Galgame

1. 先读 `AGENTS.md` 与 `docs/ARCHITECTURE.md`。
2. 在 `story/story.json` 改标题、角色、章节与剧情节点。
3. 用你自己的背景、立绘、CG、音乐、音效替换示例素材。
4. 在 `js/engine.js` 顶部使用语义化 key 注册素材。
5. 每次结构调整后跑 `python3 build/audit_story.py`。
6. 加图片后跑 `python3 build/audit_assets.py`。
7. 本地完整走一遍修改过的路线。

剧情字段说明见 `docs/STORY_SCHEMA.md`，使用 Codex 继续开发见 `docs/CODEX_WORKFLOW.md`。

## 推荐的 Codex 第一个提示词

```text
Read AGENTS.md and docs/*.md. Do not modify anything yet.
Summarize the runtime architecture, story schema, validation commands,
and the safest extension points for a new heroine route.
```

接下来不要让 Codex “重写整个游戏”，而是给它章节级、路线级、能测试的任务，并要求修改后跑 audit。

## 许可证

MIT。仓库自带的演示图是引擎内联的简单 SVG 占位素材。你加入第三方图片、音乐、字体或音效前，请自行确认再分发权限。
