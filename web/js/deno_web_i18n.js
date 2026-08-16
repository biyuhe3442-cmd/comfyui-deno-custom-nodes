/* Display-only Chinese layer for the standalone DENO web tools.
 * It changes visible DOM text/attributes only; input values, file handling,
 * ffmpeg options, and export logic remain untouched. */
(() => {
  const zh = Object.freeze({
    "Deno · Video → GIF / WebP": "Deno · 视频转 GIF / WebP",
    "Deno · Video Compare": "Deno · 视频对比",
    "Deno · Video / Image Compressor for Discord": "Deno · Discord 视频 / 图像压缩",
    "DENO RTX VFX Visual Install Guide": "DENO RTX VFX 图文安装指南",
    "Video to GIF / WebP": "视频转 GIF / WebP", "Video Compare": "视频对比",
    "Video / Image Compressor": "视频 / 图像压缩", "Open video": "打开视频",
    "Open file": "打开文件", "Open": "打开", "Choose file": "选择文件",
    "Drop a video here": "将视频拖到这里", "Drop video or image here": "将视频或图像拖到这里",
    "Drag & drop or click to browse": "拖放文件，或点击浏览", "Browse": "浏览",
    "Start": "开始", "End": "结束", "Duration": "时长", "Preview": "预览",
    "Play": "播放", "Pause": "暂停", "Loop": "循环播放", "Speed": "播放速度",
    "Frame rate": "帧率", "FPS": "FPS", "Quality": "质量", "Format": "格式",
    "GIF": "GIF", "WebP": "WebP", "MP4": "MP4", "Export": "导出",
    "Download": "下载", "Save": "保存", "Reset": "重置", "Clear": "清空",
    "Swap": "交换 A/B", "Before": "处理前", "After": "处理后", "Left": "左侧",
    "Right": "右侧", "Slider": "滑块对比", "Side by Side": "并排对比",
    "Difference": "差异对比", "Help": "帮助", "Settings": "设置",
    "Upload": "上传", "File": "文件", "Size": "大小", "Resolution": "分辨率",
    "Compression": "压缩", "Target size": "目标大小", "Processing…": "正在处理…",
    "Preparing…": "正在准备…", "Done": "完成", "Error": "错误", "Cancel": "取消",
    "RTX VFX Installation Guide": "RTX VFX 安装指南", "Requirements": "环境要求",
    "Installation": "安装", "Step": "步骤", "Next": "下一步", "Back": "返回",
    "Restart ComfyUI": "重启 ComfyUI", "Copy": "复制", "Copied": "已复制"
  });

  const translate = (text) => zh[String(text || "").trim()] || text;
  function apply(element) {
    if (!element || element.nodeType !== 1 || element.dataset?.denoI18nDone) return;
    for (const attr of ["title", "aria-label", "placeholder"]) {
      const current = element.getAttribute?.(attr);
      const translated = translate(current);
      if (translated !== current) element.setAttribute(attr, translated);
    }
    // Text nodes only: never alter form values, source code, exported names,
    // or script-generated technical messages.
    if (element.children?.length === 0 && !/^(SCRIPT|STYLE|CODE|INPUT|TEXTAREA)$/i.test(element.tagName || "")) {
      const current = element.textContent?.trim();
      const translated = translate(current);
      if (translated && translated !== current) element.textContent = translated;
    }
    element.dataset.denoI18nDone = "1";
    element.querySelectorAll?.("*").forEach(apply);
  }

  function run() {
    document.documentElement.lang = "zh-CN";
    document.title = translate(document.title);
    apply(document.body);
    new MutationObserver((entries) => entries.forEach((entry) => entry.addedNodes.forEach(apply)))
      .observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
  else run();
})();
