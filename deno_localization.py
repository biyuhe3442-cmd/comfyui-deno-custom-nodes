"""Read-only Simplified-Chinese display strings for the Chinese-enhanced fork.

This module deliberately has no dependency on ComfyUI.  It only supplies text
that is shown to people; node ids, widget names, enum values, and schemas stay
in the node modules unchanged.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


_CATALOG_PATH = Path(__file__).parent / "web" / "js" / "locales" / "zh-CN.json"


@lru_cache(maxsize=1)
def catalog() -> dict[str, Any]:
    """Return the catalog, falling back to an empty catalog if it is unavailable."""
    try:
        return json.loads(_CATALOG_PATH.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def text(section: str, key: str, fallback: str) -> str:
    """Get a localized display string without ever changing a program value."""
    value = catalog().get(section, {}).get(key)
    return str(value) if isinstance(value, str) and value else fallback


def node_display_name(node_id: str, fallback: str) -> str:
    return text("node_display_names", node_id, fallback)


def input_tooltip(node_id: str, input_name: str, fallback: str) -> str:
    values = catalog().get("input_tooltips", {}).get(node_id, {})
    value = values.get(input_name) if isinstance(values, dict) else None
    if isinstance(value, str) and value:
        if not fallback or value == fallback:
            return value
        return f"{value}\n\nOriginal English: {fallback}"
    return fallback


def output_tooltip(node_id: str, output_index: int, fallback: str) -> str:
    values = catalog().get("output_tooltips", {}).get(node_id, [])
    if isinstance(values, list) and 0 <= output_index < len(values):
        value = values[output_index]
        if isinstance(value, str) and value:
            return value if not fallback or value == fallback else f"{value}\n\nOriginal English: {fallback}"
    return fallback


def description(node_id: str, fallback: str) -> str:
    localized = text("node_help", node_id, fallback)
    if localized == fallback:
        return fallback
    # Keep authoritative technical wording available for model/package names,
    # troubleshooting, and upstream attribution while leading with Chinese.
    return f"{localized}\n\n原始英文说明（用于技术参考）：\n{fallback}"
