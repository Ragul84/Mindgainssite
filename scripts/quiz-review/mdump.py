"""Print the defective match questions of one set: index | question | options (numbered) | stored answer | explanation.
A match question is defective when its options are single items (no 'X - Y' pairs) and it is not a
'which is correctly matched' question: one single item cannot be the answer to a four-way match.
Usage: python scripts/quiz-review/mdump.py samacheer/geography/class9"""
import json, re, sys, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
SEP = re.compile(r'\s[-–—:→]\s|\s-\s|–|→')
CORR = re.compile(r'correctly matched|not correctly|incorrectly matched|wrongly matched|is matched|are matched|correct match|correctly paired|matched pair', re.I)
def defective(q):
    t = q.get('question') or ''
    if q.get('retired') or not re.search(r'\bmatch', t, re.I) or len(t) >= 80: return False
    opts = q.get('options') or []
    return not (CORR.search(t) or sum(1 for o in opts if SEP.search(str(o))) >= max(2, len(opts) - 1))
if __name__ == '__main__':
    s = sys.argv[1]
    d = json.load(open(f'assets/quiz-data/{s}.json', encoding='utf-8'))
    for i, q in enumerate(d['questions']):
        if defective(q):
            print(f"{i} | {q['question']} | " + ' / '.join(f'{k}){o}' for k, o in enumerate(q['options'])) + f" | ans {q.get('answer_index')} | {str(q.get('explanation',''))[:120]}")
