"""Pin each rebuild spec's right-hand items ("R") to the question's ORIGINAL options, read from git HEAD
(or the working file when it has not been rebuilt yet). After apply.py runs, a rebuilt question's options
are answer codes, so mbuild must never read them as List II again. Safe to run any time."""
import json, glob, os, re, subprocess
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
CODE = re.compile(r'^[A-E]-\d')
def original(s):
    try:
        raw = subprocess.run(['git', 'show', f'HEAD:assets/quiz-data/{s}.json'], capture_output=True, check=True).stdout.decode('utf-8')
        return json.loads(raw)['questions']
    except Exception:
        return json.load(open(f'assets/quiz-data/{s}.json', encoding='utf-8'))['questions']
for path in sorted(glob.glob('scripts/quiz-review/rebuild/*.json')):
    s = os.path.basename(path)[:-5].replace('__', '/')
    rb = json.load(open(path, encoding='utf-8')); qs = original(s); n = 0
    for i, spec in rb.items():
        if spec == 'retire' or spec.get('R'): continue
        opts = qs[int(i)]['options']
        if any(CODE.match(str(o)) for o in opts): raise SystemExit(f'{s} #{i}: original options already replaced; cannot pin')
        spec['R'] = opts; n += 1
    json.dump(rb, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if n: print(s, 'pinned', n)
