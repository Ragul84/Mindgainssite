"""Apply review decisions: decisions/<set with / as __>.json = {"retire": [idx...], "fix": {idx: {field: value}}}.
Retired questions stay in place (ids are set#index) and are skipped by usable() on the server."""
import json, sys, glob, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
log = json.load(open('scripts/quiz-review/progress.json', encoding='utf-8')) if os.path.exists('scripts/quiz-review/progress.json') else {}
for path in sorted(glob.glob('scripts/quiz-review/decisions/*.json')):
    s = os.path.basename(path)[:-5].replace('__', '/')
    dec = json.load(open(path, encoding='utf-8'))
    f = f'assets/quiz-data/{s}.json'
    raw = open(f, encoding='utf-8').read(); d = json.loads(raw)
    qs = d['questions'] if isinstance(d, dict) else d
    for i in dec.get('retire', []): qs[i]['retired'] = True
    for i, ch in dec.get('fix', {}).items():
        q = qs[int(i)]
        for k, v in ch.items():
            if k == 'option': q['options'][v[0]] = v[1]
            else: q[k] = v
    compact = '\n' not in raw.strip()
    open(f, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, separators=(',', ':')) if compact else json.dumps(d, ensure_ascii=False, indent=2) + '\n')
    log[s] = {'reviewed_to': dec.get('reviewed_to'), 'total': len(qs), 'retired': sum(1 for q in qs if q.get('retired'))}
    print(s, log[s])
json.dump(log, open('scripts/quiz-review/progress.json', 'w', encoding='utf-8'), indent=1)
