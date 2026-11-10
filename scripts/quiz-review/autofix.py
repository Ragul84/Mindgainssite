"""Display fixes found by audit.py, written as review decisions (then run apply.py).
Fixes:  strip "A. "/"(a) " prefixes from options; drop "mentioned in the text" / "According to the text," phrasing.
Retires: duplicate options, assertion without reason, broken characters, bad answer index, statement questions
whose statements are missing, match questions whose lists are missing, figure questions with no description.
Usage: python scripts/quiz-review/autofix.py [--write]"""
import json, glob, os, re, sys, collections
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
WRITE = '--write' in sys.argv
PFX = re.compile(r'^\s*\(?([A-Da-d])[.)]\s+')
TEXTREF = [(re.compile(r'^\s*(according to|as per|based on) the (text|passage|lesson|chapter)\s*,?\s*', re.I), ''),
           (re.compile(r'\s+(as\s+)?(mentioned|described|given|stated|discussed|listed|defined|explained|noted)\s+in the (text|passage|lesson|chapter)\b', re.I), ''),
           (re.compile(r'\s+(according to|as per|in) the (text|passage|lesson)\b', re.I), '')]
STMT_NEED = re.compile(r'\bconsider the following( \w+)?\s*(statements|pairs)\b|\bhow many of the (above|following)\b|\bwhich of the above\b', re.I)
NUMBERED = re.compile(r'(^|[\s:])(\(?[1-6ivx]+[.)]|statement\s*[-–]?\s*([1-6ivx]+|[a-d])\b)', re.I)
FIGQ = re.compile(r'\b(given|above|below|shown|adjoining|accompanying)\s+(figures?|images?|diagrams?|graphs?|maps?|pictures?)\b|\b(figures?|diagrams?|graphs?|pictures?)\s+(given|shown)\s+(above|below)\b', re.I)
CODES = re.compile(r'^\s*((only|both|neither|all|none)\b|[1-4ivx]+(\s*(,|and|&)\s*[1-4ivx]+)*(\s+only)?\s*$|statement\s)', re.I)
KEEP = {'samacheer/science/class10#265', 'samacheer/science/class10#266', 'samacheer/science/class10#267'}
out = collections.defaultdict(lambda: {'retire': [], 'fix': {}}); count = collections.Counter(); ex = collections.defaultdict(list)
for f in sorted(glob.glob('assets/quiz-data/**/*.json', recursive=True)):
    try: d = json.load(open(f, encoding='utf-8'))
    except Exception: continue
    s = os.path.relpath(f, 'assets/quiz-data')[:-5].replace('\\', '/')
    for i, q in enumerate(d.get('questions', [])):
        if q.get('retired'): continue
        tag = f'{s}#{i}'
        if tag in KEEP: continue
        t = str(q.get('question') or ''); o = [str(x) for x in (q.get('options') or [])]; a = q.get('answer_index')
        why = None
        if not isinstance(a, int) or not 0 <= a < len(o) or len(o) < 2: why = 'bad answer / options'
        elif len(set(x.strip().lower() for x in o)) < len(o): why = 'duplicate options'
        elif re.search(r'\bassertion\b', t, re.I) and not re.search(r'\breason\b', t, re.I): why = 'assertion without reason'
        elif re.search('[�]', t + ''.join(o)): why = 'broken characters'
        elif STMT_NEED.search(t) and not NUMBERED.search(t) and not re.search(r'\bassertion\b', t, re.I) and sum(1 for x in o if CODES.search(x)) >= 2: why = 'statements missing'
        elif (re.search(r'^\s*match\b', t, re.I) or 'பொருத்துக' in t) and not re.search(r'list\s*-?\s*ii|column\s*-?\s*ii|\b1\.\s|\(1\)|\|', t, re.I) and not any(re.search(r'\s[-–:]\s', x) for x in o): why = 'match lists missing'
        elif any(re.search(r'https?://|\.png\b|\.jpe?g\b', x, re.I) for x in o + [t]): why = 'image links instead of content'
        elif FIGQ.search(t) and not re.search(r'(figure|image)\s*\d\s*:', t, re.I): why = 'figure not shown'
        if why:
            out[s]['retire'].append(i); count['retire: ' + why] += 1
            if len(ex[why]) < 3: ex[why].append(tag + ' | ' + t[:110])
            continue
        fix = {}
        letters = [PFX.match(x) for x in o]
        if all(letters) and [m.group(1).lower() for m in letters] == list('abcd'[:len(o)]):
            fix['options'] = [PFX.sub('', x, count=1) for x in o]; count['fix: option prefixes'] += 1
        t2 = t
        for rx, rep in TEXTREF: t2 = rx.sub(rep, t2)
        t2 = re.sub(r'^\s*([a-z])', lambda m: m.group(1).upper(), t2).strip()
        if t2 != t.strip():
            fix['question'] = t2; count['fix: "in the text" wording'] += 1
            if len(ex['text']) < 4: ex['text'].append(t[:90] + '  ->  ' + t2[:90])
        if fix: out[s]['fix'][str(i)] = fix
for k, v in sorted(count.items()): print(f'{v:6}  {k}')
for k, v in ex.items(): print('\n', k); [print('   ', x) for x in v]
if WRITE:
    for s, dec in out.items():
        if not dec['retire'] and not dec['fix']: continue
        p = f'scripts/quiz-review/decisions/{s.replace("/", "__")}.json'
        old = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {}
        old.setdefault('retire', []); old.setdefault('fix', {})
        old['retire'] = sorted(set(old['retire']) | set(dec['retire']))
        for i, fx in dec['fix'].items():
            if i in old['fix']: continue          # an earlier hand fix wins
            old['fix'][i] = fx
        json.dump(old, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('\nwritten decisions for', len(out), 'sets')
