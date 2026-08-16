import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "web" / "js" / "locales" / "zh-CN.json"


def test_chinese_catalog_has_all_declared_display_names():
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    display_names = catalog["node_display_names"]
    assert len(display_names) == 25
    assert all(name.startswith("(Deno) ") and " | " in name for name in display_names.values())
    assert catalog["enum_labels"]["Center Crop (Fill)"] == "居中裁切填充"


def test_localization_module_uses_fallback_without_mutating_values():
    import deno_localization

    assert deno_localization.node_display_name("DenoResolutionSetup", "fallback").startswith("(Deno) 图像尺寸调整")
    assert deno_localization.node_display_name("UnknownNode", "fallback") == "fallback"
    assert deno_localization.input_tooltip("UnknownNode", "mode", "English fallback") == "English fallback"


def test_display_layer_documentation_protects_compatibility_contract():
    frontend = (ROOT / "web" / "js" / "deno_i18n.js").read_text(encoding="utf-8")
    assert "widget.label" in frontend
    assert "slot.label" in frontend
    assert "widget.value" in frontend  # Explicit contract comment.
    assert "widget.name =" not in frontend


def test_all_standalone_web_tools_load_the_chinese_display_layer():
    for page in (
        "docs/video-to-gif/index.html",
        "docs/video-compare/index.html",
        "docs/video-to-discord/index.html",
        "docs/rtx-vfx-install/index.html",
    ):
        assert 'src="../../web/js/deno_web_i18n.js"' in (ROOT / page).read_text(encoding="utf-8")
