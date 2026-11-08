"""Print a quiz-data set compactly for review: idx | question | options | key. Usage: dump.py set [start] [end]"""
import json, sys
s = sys.argv[1]; a = int(sys.argv[2]) if len(sys.argv) > 2 else 0; b = int(sys.argv[3]) if len(sys.argv) > 3 else 10**9
d = json.load(open(f'assets/quiz-data/{s}.json', encoding='utf-8'))
qs = d['questions'] if isinstance(d, dict) else d
for i, q in enumerate(qs[a:b], a):
    o = q.get('options') or []
    if q.get('retired') or len(o) != 4 or len({str(x).strip().lower() for x in o}) < 4 or any(len(str(x).strip()) <= 2 for x in o):
        continue
    print(f"{i}|{q['question'][:220]}|" + ' / '.join(f'{k}:{str(x)[:70]}' for k, x in enumerate(o)) + f"|K{q['answer_index']}")
