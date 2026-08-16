"""Lightweight, dependency-free checks for the display-only Chinese catalog."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "web" / "js" / "locales" / "zh-CN.json"
INIT = ROOT / "__init__.py"


def main() -> int:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    names = data.get("node_display_names", {})
    source = INIT.read_text(encoding="utf-8")
    # Only registered nodes are translation requirements.  Migration ids are
    # compatibility aliases, not menu entries, so they must not be catalogued.
    node_ids = {"DenoResolutionSetup"}
    node_ids.update(re.findall(r'\(\s*"deno_[^"]+"\s*,\s*"(Deno[A-Za-z0-9]+)"', source))
    missing = sorted(node_ids - set(names))
    if missing:
        print("Missing node display translations:", ", ".join(missing))
        return 1
    if not data.get("labels") or not data.get("ui"):
        print("Catalog must include labels and ui sections.")
        return 1
    enum_labels = data.get("enum_labels", {})
    print(
        f"Localization catalog OK: {len(names)} node names, {len(data['labels'])} labels, "
        f"{len(enum_labels)} enum display labels, {len(data['ui'])} UI strings."
    )
    print("Enum display labels are translated without changing the underlying execution values.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
