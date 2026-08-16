# Deno Custom Nodes 中文增强版（非官方）

本项目是基于 [Deno2026/comfyui-deno-custom-nodes](https://github.com/Deno2026/comfyui-deno-custom-nodes) 的**非官方中文增强版本**。

本 Fork 主要提供简体中文界面、本地化参数说明和中文使用体验优化；核心节点逻辑及原始功能版权归原作者及各贡献者所有。Deno 品牌、原作者信息、LICENSE 和 GPL-3.0 均完整保留。

## 兼容性承诺

- 不修改 node ID、Python class、输入/输出键、socket type、API、工作流 JSON 字段或 enum 实际值。
- 中文只作用于节点显示名、控件标签、tooltip、帮助和前端按钮；原版工作流应可直接打开。
- 技术错误、traceback、模型名、路径和协议字段保留英文原文，便于搜索和排错。

## 使用

按原项目的安装方式安装本插件，然后刷新 ComfyUI 前端（通常按 `Ctrl+F5`）。本 Fork 默认提供简体中文显示；资源加载失败时自动回退为英文。

## 与上游同步

建议远程仓库保持：

```text
origin   = 你的 Fork
upstream = https://github.com/Deno2026/comfyui-deno-custom-nodes.git
```

同步上游后运行 `python tools/check_localization.py`，补充 `web/js/locales/zh-CN.json` 中新增的显示词条，再运行测试。请将业务变更和中文资源变更分开提交，便于审查与合并。

## 许可证

This project is distributed under **GNU GPL v3.0**. See [LICENSE](LICENSE).
