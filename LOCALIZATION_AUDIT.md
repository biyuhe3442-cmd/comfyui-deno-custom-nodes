# DENO Custom Nodes 简体中文本地化审计

审计日期：2026-08-16。范围仅限本 Fork 仓库；未读取或修改 ComfyUI 内核及其他 custom_nodes。

## 架构与安全边界

- 后端节点注册集中在 `__init__.py`：`NODE_CLASS_MAPPINGS` 是兼容性契约，不能改；`NODE_DISPLAY_NAME_MAPPINGS` 是安全的显示层入口。
- 输入键、输出键、参数 schema 和绝大多数提示集中在各 Python 节点文件与 `deno_node_metadata.py`。其中键和值可能被工作流序列化，因此只能添加 tooltip 或前端 `label`，不能改键和值。
- 前端由 `web/js/*.js` 中的 ComfyUI extensions 构成。Visual Fold、Floating Tools、比较/预览、加载器、LLM 和 Ideogram 工具各自有独立 UI。
- 节点右上角帮助由 `web/js/deno_node_help.js` 使用后端 `DESCRIPTION`；可安全替换为中文说明，但必须保留版本、作者归属和技术错误原文。

## 节点清单（25）

|区域|节点 ID|安全显示层操作|
|---|---|---|
|尺寸与加载|DenoResolutionSetup, DenoMultiImageLoader, DenoAdvancedImageSourceLoader|显示名、参数标签、tooltip；缩放枚举值保留原文|
|MiniMax H3|DenoMiniMaxH3ReferenceImageLoader, DenoMiniMaxH3ReferenceToVideo|显示名、帮助、顺序/列表说明；H3 数据结构不动|
|音频|DenoAudioTranscript, DenoAudioAnalysisFinalize|显示名、标签、tooltip；转写与模型逻辑不动|
|LTX|DenoLTXSequencer, DenoLTX23PresetLoader, DenoLTXModelDownloader, DenoLTXPromptGuide, DenoLTXTiledSpatialUpscaler, DenoLTXAVStepFusedTiledSampler|显示名、标签、提示；模型、采样和分块逻辑不动|
|LoRA|DenoMultiLoraLoader, DenoLTXMultiLoraLoader|显示名、槽位标签和提示；LoRA 应用逻辑不动|
|提示/LLM|DenoBerniniPromptGuide, DenoIdeogramDirector, DenoLocalLLMRefiner, DenoAIReviewGate, DenoPromptText|显示名、用户标签、帮助；协议、endpoint 和值不动|
|RTX|DenoRTXVFXEasyUpscale, DenoRTXVFXVideoFinisher|显示名、标签、提示；VFX/尺寸逻辑不动|
|对比/预览|DenoImageCompare, DenoVideoCompare, DenoVideoPreview|显示名及前端文字；对比和导出逻辑不动|

## 用户可见内容与处理方式

|内容|来源|处理|
|---|---|---|
|节点名称|`NODE_DISPLAY_NAME_MAPPINGS`|中文在前，保留英文搜索名|
|参数、输入、输出标签|ComfyUI widget/slot|仅设置显示 `label`，不改 `name`|
|参数 tooltip 与 `i` 帮助|`deno_node_metadata.py`、`DESCRIPTION`|中文资源优先，缺失时回退英文|
|Visual Fold 与 Floating Tools|独立 JS|通过仅匹配精确 UI 文案的显示层翻译；报告技术字段不触碰|
|Compare/Preview/Loader 前端|独立 JS|相同显示层翻译；按钮与菜单值不参与程序判断|
|HTML Web Tools|`docs/*/index.html`|四个页面已接入显示层脚本；只翻译界面文字与属性，不触碰转码、文件或导出逻辑|

## 内部值：绝不可直接翻译

- `NODE_CLASS_MAPPINGS` key、Python class、`node.type`、工作流字段和 widget `name`。
- resize method、mode、interpolation、compare mode 等枚举 `value`；它们会被旧工作流和 Python 条件判断使用。
- API route、WebSocket/HTTP payload、socket type、模型名、路径、异常类、traceback 和 JSON key。
- H3 reference bundle、LTX/RTX/Tensor 处理、下载/版本/迁移逻辑。

## 风险与处理结论

ComfyUI 的不同前端版本并不稳定地提供 `label != value` 的下拉 API。本 Fork 不修改原始 enum 数组；枚举值仍显示英文时属于刻意的兼容性保护，详见 `LOCALIZATION_LIMITATIONS.md`。新增词条采用 JSON 目录，Python 和前端共用同一文件，并以英文为回退。
