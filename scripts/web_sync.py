#!/usr/bin/env python3
"""Sync briefs/digests into web/public/compute-trading.json for the dashboard.

Honest-data policy: emit only what exists on disk. Empty state = empty lists.
Reads:
  briefs/weekly/YYYY-MM-DD.md       (cron weekly digests)
  briefs/signals.json               (signal cards; rewritten by cron each run)
  briefs/summary.md                 (current executive summary)
  briefs/indexes.json               (index/provider snapshot)
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRIEFS = os.path.join(ROOT, "briefs")
PUB = os.path.join(ROOT, "web", "public")
os.makedirs(PUB, exist_ok=True)


def read(path):
    try:
        with open(path) as f:
            return f.read()
    except OSError:
        return ""


digests = []
wdir = os.path.join(BRIEFS, "weekly")
if os.path.isdir(wdir):
    for fn in sorted(os.listdir(wdir), reverse=True):
        m = re.match(r"(\d{4}-\d{2}-\d{2})\.md$", fn)
        if not m:
            continue
        body = read(os.path.join(wdir, fn))
        first = body.lstrip().splitlines()[0] if body.strip() else ""
        title = first[2:].strip() if first.startswith("# ") else fn
        links = []
        seen = set()
        for u in re.findall(r"\[([^\]]+)\]\((https?://[^)]+)\)", body) + [(None, u) for u in re.findall(r"(?<![(])https?://[^\s)>\]]+", body)]:
            url = u[1]
            if url not in seen:
                seen.add(url)
                links.append(url)
        digests.append({
            "title": title,
            "date": m.group(1),
            "links": links[:20],
            "body": re.sub(r"^# .*\n", "", body, count=1).strip(),
        })

summary = read(os.path.join(BRIEFS, "summary.md")).strip()

def load_json(name, default):
    try:
        with open(os.path.join(BRIEFS, name)) as f:
            return json.load(f)
    except (OSError, ValueError):
        return default

signals = load_json("signals.json", [])
if not isinstance(signals, list):
    signals = []
signals = signals[:25]

indexes = load_json("indexes.json", [])
if not isinstance(indexes, list):
    indexes = []

out = {
    "updated": max([d["date"] for d in digests], default=""),
    "executive_summary": summary,
    "indexes": indexes,
    "signals": signals,
    "digests": digests[:12],
}

with open(os.path.join(PUB, "compute-trading.json"), "w") as f:
    json.dump(out, f, indent=1)

print(f"web_sync: {len(indexes)} indexes; {len(signals)} signals; {len(digests)} digests")
