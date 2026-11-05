#!/usr/bin/env python3
"""Append-only store for raw design-taste evidence.

Library root: $DESIGN_TASTE_HOME, else ~/.claude/design-taste
File: <root>/evidence/raw-annotations.jsonl

Usage:
  append_evidence.py < record.json          append one record (JSON object) or a list
  append_evidence.py --recent 50            print the last N records
  append_evidence.py --since 2026-09-01     print records on or after a date
  append_evidence.py --all                  print every record
  append_evidence.py --mark-review          append a review marker
  append_evidence.py --stats                counts by kind and polarity, last review date

Existing lines are never modified or deleted.
"""
import argparse
import json
import os
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

KINDS = {"annotation", "stated_principle", "correction", "reference",
         "screenshot", "review_answer", "review"}
POLARITIES = {"like", "dislike", "neutral"}


def root() -> Path:
    env = os.environ.get("DESIGN_TASTE_HOME")
    return Path(env).expanduser() if env else Path.home() / ".claude" / "design-taste"


def store() -> Path:
    return root() / "evidence" / "raw-annotations.jsonl"


def load():
    path = store()
    if not path.exists():
        return []
    out = []
    with path.open(encoding="utf-8") as f:
        for n, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                print(f"warning: skipping malformed line {n}", file=sys.stderr)
    return out


def next_id(existing, now):
    prefix = f"ev-{now:%Y%m%d}-"
    nums = [int(r["id"].rsplit("-", 1)[1]) for r in existing
            if str(r.get("id", "")).startswith(prefix)]
    return f"{prefix}{(max(nums) + 1) if nums else 1:04d}"


def validate(rec):
    errors = []
    if not isinstance(rec, dict):
        return ["record must be a JSON object"]
    kind = rec.get("kind")
    if kind not in KINDS:
        errors.append(f"kind must be one of {sorted(KINDS)}")
    if kind != "review":
        if rec.get("polarity") not in POLARITIES:
            errors.append(f"polarity must be one of {sorted(POLARITIES)}")
        if not str(rec.get("quote", "")).strip():
            errors.append("quote is required (the user's exact words or the literal change)")
    if "linked_entries" in rec and not isinstance(rec["linked_entries"], list):
        errors.append("linked_entries must be a list")
    return errors


def append(records):
    existing = load()
    path = store()
    path.parent.mkdir(parents=True, exist_ok=True)
    ids = []
    with path.open("a", encoding="utf-8") as f:
        for rec in records:
            errs = validate(rec)
            if errs:
                print("error: " + "; ".join(errs), file=sys.stderr)
                sys.exit(2)
            now = datetime.now(timezone.utc)
            rec = dict(rec)
            rec.pop("id", None)
            rec = {"id": next_id(existing, now),
                   "timestamp": now.isoformat(timespec="seconds"), **rec}
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
            existing.append(rec)
            ids.append(rec["id"])
    return ids


def last_review(records):
    reviews = [r for r in records if r.get("kind") == "review"]
    return reviews[-1]["timestamp"] if reviews else None


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    g = p.add_mutually_exclusive_group()
    g.add_argument("--recent", type=int)
    g.add_argument("--since")
    g.add_argument("--all", action="store_true")
    g.add_argument("--mark-review", action="store_true")
    g.add_argument("--stats", action="store_true")
    a = p.parse_args()

    if a.recent or a.since or a.all or a.stats:
        recs = load()
        lr = last_review(recs)
        if a.stats:
            ev = [r for r in recs if r.get("kind") != "review"]
            print(json.dumps({
                "library": str(root()),
                "evidence_total": len(ev),
                "by_kind": Counter(r.get("kind") for r in ev),
                "by_polarity": Counter(r.get("polarity") for r in ev),
                "last_review": lr,
                "since_last_review": sum(1 for r in ev if not lr or r["timestamp"] > lr),
            }, indent=2, default=dict))
            return
        if a.since:
            recs = [r for r in recs if r.get("timestamp", "")[:10] >= a.since]
        elif a.recent:
            recs = recs[-a.recent:]
        print(f"# library: {root()}  last_review: {lr or 'never'}  records: {len(recs)}")
        for r in recs:
            print(json.dumps(r, ensure_ascii=False))
        return

    if a.mark_review:
        ids = append([{"kind": "review", "quote": "taste review completed"}])
        print(ids[0])
        return

    raw = sys.stdin.read().strip()
    if not raw:
        p.error("no JSON on stdin")
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"error: invalid JSON: {e}", file=sys.stderr)
        sys.exit(2)
    ids = append(data if isinstance(data, list) else [data])
    print("\n".join(ids))


if __name__ == "__main__":
    main()
