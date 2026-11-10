"""Rebuild defective match questions into real match-the-following questions.
Input: scripts/quiz-review/rebuild/<set with / as __>.json =
  { "<idx>": {"lh": "State", "rh": "Coast", "L": ["Odisha", "Maharashtra", ...], "why": "explanation"} | "retire" }
  L[k] is the partner of the question's existing option k (use null to leave option k out).
  Optional "stem" overrides the opening line; optional "R" replaces the right-hand items (aligned with L).
Output: merged into scripts/quiz-review/decisions/<set>.json as fix/retire entries, then run apply.py.
Each rebuilt question: List I (A..), List II (1..) shuffled, four code options (one correct, three
other orderings), answer position rotated so A/B/C/D each hold about a quarter of the keys."""
import json, glob, os, random, itertools, re
os.chdir(os.path.join(os.path.dirname(__file__), '..', '..'))
LET = 'ABCDE'
def build(q, spec, idx):
    opts = q['options']
    L, R = [], []
    for k, left in enumerate(spec['L']):
        if left is None: continue
        right = (spec.get('R') or opts)[k]
        L.append(left.strip().rstrip('.')); R.append(str(right).strip().rstrip('.'))
    n = len(L)
    if n < 2 or n > 5: raise ValueError(f'{idx}: needs 2-5 pairs, got {n}')
    if len(set(L)) < n or len(set(R)) < n: raise ValueError(f'{idx}: duplicate items')
    rnd = random.Random(idx * 7919 + n)
    order = list(range(n)); rnd.shuffle(order)          # order[j] = which pair sits at List II position j
    pos = {p: j for j, p in enumerate(order)}           # pair p -> List II number
    key = [pos[i] for i in range(n)]
    code = lambda perm: ', '.join(f'{LET[i]}-{perm[i] + 1}' for i in range(n))
    others = [list(p) for p in itertools.permutations(range(n)) if list(p) != key]
    rnd.shuffle(others)
    # prefer near-misses (two items swapped) as distractors: they test the pairing, not guessing
    others.sort(key=lambda p: sum(a != b for a, b in zip(p, key)))
    wrong = others[:3] if n > 2 else others[:1]
    k_at = idx % (len(wrong) + 1)
    choices = wrong[:]; choices.insert(k_at, key)
    lh, rh = spec.get('lh', '').strip(), spec.get('rh', '').strip()
    stem = spec.get('stem') or 'Match List I with List II:'
    qtext = (stem + ' List I' + (f' ({lh})' if lh else '') + ' ' + ' '.join(f'{LET[i]}. {L[i]}' for i in range(n))
             + ' List II' + (f' ({rh})' if rh else '') + ' ' + ' '.join(f'{j + 1}. {R[order[j]]}' for j in range(n)))
    why = spec.get('why') or '; '.join(f'{L[i]} – {R[i]}' for i in range(n)) + '.'
    return {'question': qtext, 'options': [code(c) for c in choices], 'answer_index': k_at, 'explanation': why}
if __name__ == '__main__':
    built = 0; retired = 0
    for path in sorted(glob.glob('scripts/quiz-review/rebuild/*.json')):
        name = os.path.basename(path)
        s = name[:-5].replace('__', '/')
        rb = json.load(open(path, encoding='utf-8'))
        qs = json.load(open(f'assets/quiz-data/{s}.json', encoding='utf-8'))['questions']
        dp = f'scripts/quiz-review/decisions/{name}'
        dec = json.load(open(dp, encoding='utf-8')) if os.path.exists(dp) else {}
        dec.setdefault('retire', []); dec.setdefault('fix', {})
        for i, spec in rb.items():
            i = int(i)
            if spec == 'retire':
                if i not in dec['retire']: dec['retire'].append(i)
                retired += 1; continue
            dec['fix'][str(i)] = build(qs[i], spec, i); built += 1
            if spec.get('recovered'):
                dec['fix'][str(i)]['retired'] = False
                if i in dec['retire']: dec['retire'].remove(i)
        dec['retire'].sort()
        json.dump(dec, open(dp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('rebuilt', built, 'retired', retired)
