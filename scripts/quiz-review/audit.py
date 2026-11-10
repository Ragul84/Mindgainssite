"""Display audit of every usable question in assets/quiz-data: finds questions that look broken when shown
on the site or in the games. Prints counts per problem and a few examples. Read-only.
Usage: python scripts/quiz-review/audit.py [problem-name]   (a name prints every hit for that problem)"""
import json, glob, os, re, sys, collections
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
REL = re.compile(r'\b(all|none|both|neither)\s+of\s+the\s+(above|these)\b|^\s*(both|neither)\b.*\b(and|nor)\b|^\s*(only\s+)?[1-4ivx]+(\s*(,|and|&)\s*[1-4ivx]+)+(\s+only)?\s*$|\b[A-D]\s+(and|&)\s+[A-D]\b|^\s*(a|b|c|d)\s*(and|&|,)\s*(a|b|c|d)\b', re.I)
FIG = re.compile(r'\b(figure|fig\.|diagram|graph|picture|image|map|table)\s+(given|shown|above|below)|\b(shown|given)\s+(in|above|below)\s+(the\s+)?(figure|diagram|graph|picture|image|map|table)|\bthe\s+(figure|diagram|graph|picture)\b', re.I)
STMT = re.compile(r'\b(consider|following)\s+(the\s+)?(following\s+)?statements?\b|\bwhich of the (above|following) statements\b', re.I)
LETTER = re.compile(r'^\s*\(?[A-Da-d][.)]\s+\S')
problems = collections.defaultdict(list)
total = 0
for f in sorted(glob.glob('assets/quiz-data/**/*.json', recursive=True)):
    try: d = json.load(open(f, encoding='utf-8'))
    except Exception: continue
    s = os.path.relpath(f, 'assets/quiz-data')[:-5].replace('\\', '/')
    for i, q in enumerate(d.get('questions', [])):
        if q.get('retired'): continue
        total += 1
        t = str(q.get('question') or ''); o = [str(x) for x in (q.get('options') or [])]; a = q.get('answer_index')
        tag = f'{s}#{i}'
        if not isinstance(a, int) or not 0 <= a < len(o): problems['bad answer index'].append(tag); continue
        if len(o) < 2: problems['fewer than 2 options'].append(tag)
        if len(set(x.strip().lower() for x in o)) < len(o): problems['duplicate options'].append(tag)
        if REL.search(o[a]): problems['answer only makes sense with all options (All of the above / 1 and 2 / A and B)'].append(tag)
        if FIG.search(t): problems['refers to a figure, diagram, graph, map or table'].append(tag)
        if STMT.search(t) and not re.search(r'(^|\s)(\(?[1-4ivx]+[.)]|statement\s*[1-4ivx]+\s*[:.)-])\s*\S', t, re.I): problems['statements question without the statements'].append(tag)
        if re.search(r'\bassertion\b', t, re.I) and not re.search(r'\breason\b', t, re.I): problems['assertion without reason'].append(tag)
        if sum(1 for x in o if LETTER.match(x)) >= 2: problems['options carry "A." / "(a)" prefixes'].append(tag)
        if len(t) < 12: problems['question too short'].append(tag)
        if re.search(r'\b(textbook|chapter|unit|section)\s+\d+(\.\d+)?\b|\bin (this|the) (chapter|lesson|unit|text)\b|\baccording to the (text|passage|lesson)\b', t, re.I): problems['depends on a textbook chapter / passage the player cannot see'].append(tag)
        if re.search(r'[�]|Ã|â€', t + ''.join(o)): problems['broken characters'].append(tag)
        if re.search(r'^\s*match\b', t, re.I) and not re.search(r'list\s*ii|column\s*ii|\b1\.\s|\(1\)|\|', t, re.I) and not any(re.search(r'\s[-–:]\s', x) for x in o): problems['match question without its lists'].append(tag)
want = sys.argv[1] if len(sys.argv) > 1 else None
print('usable questions:', total)
for k, v in sorted(problems.items(), key=lambda x: -len(x[1])):
    sets = collections.Counter(x.split('#')[0].split('/')[0] for x in v)
    print(f'{len(v):6}  {k}   by exam: {dict(sets)}')
    if want and want in k:
        for x in v: print('   ', x)
