import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = Path("D:/edu4bharat/chapter_manifest.json")
OUT_DIR = ROOT / "data" / "pyq-corpus"
SOURCES_JSONL = OUT_DIR / "sources.jsonl"
QUESTIONS_JSONL = OUT_DIR / "questions.jsonl"
PROGRESS_JSON = OUT_DIR / "progress.json"

QUESTION_START_RE = re.compile(r"(?m)^\s*(?:Q(?:uestion)?\.?\s*)?(\d{1,3})[\).]\s+(.+)")
OPTION_RE = re.compile(r"(?m)^\s*(?:\(?([A-Da-d])\)?|([1-4]))[\).]\s+(.+)")


def now():
    return datetime.now(timezone.utc).isoformat()


def infer_exam(entry):
    board = str(entry.get("board") or "unknown").lower()
    file_path = str(entry.get("file_path") or "").lower()
    file_name = str(entry.get("file_name") or "").lower()
    joined = f"{board} {file_path} {file_name}"
    if "tnpsc" in joined or "tn-specific" in joined:
        return "TNPSC"
    if "upsc" in joined or "ias" in joined:
        return "UPSC"
    if "ssc" in joined or "cgl" in joined or "chsl" in joined or "mts" in joined:
        return "SSC"
    if "neet" in joined:
        return "NEET"
    if "jee" in joined:
        return "JEE"
    if "banking" in joined or "ibps" in joined or "sbi" in joined:
        return "Banking"
    if "railway" in joined or "rrb" in joined:
        return "Railway"
    return board.upper()


def clean_text(text):
    return re.sub(r"\s+", " ", str(text or "")).strip()


def clean_label(value):
    value = re.sub(r"\.pdf$", "", str(value or ""), flags=re.I)
    value = re.sub(r"[-_]+", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value.title() if value else "Previous Year Paper"


def load_entries():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    source_root = Path(manifest.get("source_root") or "D:/edu4bharat/raw")
    entries = [
        entry for entry in manifest.get("entries", [])
        if entry.get("source_type") == "pyq" and str(entry.get("file_path") or "").lower().endswith(".pdf")
    ]
    return source_root, entries


def load_done():
    if not PROGRESS_JSON.exists():
        return set(), {"failed": []}
    try:
        data = json.loads(PROGRESS_JSON.read_text(encoding="utf-8"))
        return set(data.get("completed_ids") or []), data
    except Exception:
        return set(), {"failed": []}


def write_progress(total, completed_ids, failed, current=None):
    PROGRESS_JSON.write_text(json.dumps({
        "updated_at": now(),
        "total_sources": total,
        "completed_sources": len(completed_ids),
        "remaining_sources": max(0, total - len(completed_ids)),
        "failed_sources": len(failed),
        "current": current,
        "completed_ids": sorted(completed_ids),
        "failed": failed[-100:],
    }, indent=2), encoding="utf-8")


def source_record(source_root, entry):
    file_path = str(entry.get("file_path") or "")
    return {
        "id": entry.get("id"),
        "exam": infer_exam(entry),
        "board": entry.get("board"),
        "year": entry.get("year"),
        "language": entry.get("language"),
        "title": clean_label(entry.get("file_name")),
        "file_name": entry.get("file_name"),
        "file_path": file_path,
        "absolute_path": str(source_root / file_path),
    }


def split_question_blocks(page_text):
    matches = list(QUESTION_START_RE.finditer(page_text))
    blocks = []
    for idx, match in enumerate(matches):
        start = match.start()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(page_text)
        block = page_text[start:end].strip()
        if len(block) >= 35:
            blocks.append((match.group(1), block))
    return blocks


def parse_options(block):
    options = []
    for match in OPTION_RE.finditer(block):
        option = clean_text(match.group(3))
        if 1 <= len(option) <= 280:
            options.append(option)
    return options[:6]


def extract_questions(source, pdf_path):
    reader = PdfReader(str(pdf_path), strict=False)
    questions = []
    for page_idx, page in enumerate(reader.pages, start=1):
        try:
            text = page.extract_text() or ""
        except Exception:
            continue
        for qno, block in split_question_blocks(text):
            options = parse_options(block)
            question_text = clean_text(OPTION_RE.split(block, maxsplit=1)[0])
            question_text = re.sub(r"^\s*(?:Q(?:uestion)?\.?\s*)?\d{1,3}[\).]\s*", "", question_text, flags=re.I).strip()
            if len(question_text) < 20:
                question_text = clean_text(block)
            if len(question_text) < 20:
                continue
            qid = f"{source['id']}-q{qno}-p{page_idx}"
            questions.append({
                "id": qid,
                "source_id": source["id"],
                "exam": source["exam"],
                "year": source.get("year"),
                "subject": None,
                "topic": None,
                "subtopic": None,
                "question_number": qno,
                "question_text": question_text[:1800],
                "options": options or None,
                "answer_text": None,
                "explanation": None,
                "page_start": page_idx,
                "page_end": page_idx,
                "confidence": 0.58 if options else 0.45,
            })
    return questions


def append_jsonl(path, records):
    with path.open("a", encoding="utf-8") as f:
      for record in records:
          f.write(json.dumps(record, ensure_ascii=False) + "\n")


def main():
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else None
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source_root, entries = load_entries()
    completed_ids, progress = load_done()
    failed = progress.get("failed") or []
    total = len(entries)
    processed_this_run = 0

    for entry in entries:
        source = source_record(source_root, entry)
        sid = source["id"]
        if sid in completed_ids:
            continue
        if limit and processed_this_run >= limit:
            break
        current = {"id": sid, "title": source["title"], "exam": source["exam"]}
        write_progress(total, completed_ids, failed, current)
        started = time.time()
        try:
            pdf_path = Path(source["absolute_path"])
            if not pdf_path.exists():
                raise FileNotFoundError(str(pdf_path))
            questions = extract_questions(source, pdf_path)
            append_jsonl(SOURCES_JSONL, [source])
            if questions:
                append_jsonl(QUESTIONS_JSONL, questions)
            completed_ids.add(sid)
            processed_this_run += 1
        except Exception as exc:
            failed.append({
                "id": sid,
                "exam": source["exam"],
                "file_path": source["file_path"],
                "error": str(exc)[:500],
                "at": now(),
            })
        finally:
            current["elapsed_sec"] = round(time.time() - started, 2)
            write_progress(total, completed_ids, failed, current)

    write_progress(total, completed_ids, failed, None)
    print(f"completed={len(completed_ids)}/{total} failed={len(failed)} run_processed={processed_this_run}")


if __name__ == "__main__":
    main()
