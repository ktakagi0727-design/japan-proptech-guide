#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""git履歴から各公開ページの公開日・最終更新日を集計し data/page-dates.json を生成する。

使い方: python3 scripts/update-page-dates.py
ビルド(scripts/build-data.mjs)の前に実行すると、各ページに公開日・最終更新日が反映される。
既存のpage-dates.jsonにあるpublished(公開日)は保持し、modifiedのみgitの最新履歴で更新する。
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "page-dates.json"

def main():
    log = subprocess.run(
        ["git", "log", "--date=short", "--pretty=format:C|%ad", "--name-only"],
        cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.splitlines()

    first = {}
    last = {}
    current = None
    for line in log:
        if line.startswith("C|"):
            current = line[2:]
        elif line.strip() and current:
            path = line.strip()
            if not (path.endswith(".html") and (
                path.startswith(("services/", "columns/", "comparisons/", "cases/"))
                or path in ("index.html", "tools.html", "band-tool.html",
                            "noi-calculator.html", "dd-checklist.html", "about.html"))):
                continue
            # gitログは新しい順なので、最初に見た日付がmodified、最後がpublished
            last.setdefault(path, current)
            first[path] = current

    existing = {}
    if OUT.exists():
        existing = json.loads(OUT.read_text(encoding="utf-8"))

    result = {}
    for path in sorted(set(first) | set(existing)):
        published = existing.get(path, {}).get("published") or first.get(path)
        modified = last.get(path) or existing.get(path, {}).get("modified") or published
        if published:
            result[path] = {"published": published, "modified": max(modified, published)}

    OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(result)} pages -> {OUT.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
