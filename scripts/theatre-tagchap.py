"""Tag every theatre episode block with the quiz sets that match what it teaches (by title keywords)."""
import json, re, sys
R = r'C:\mindgains-waitlist'
src = open(R + r'\worker\theatre.js', encoding='utf-8').read()
DAY_SETS = json.loads(re.search(r'const DAY_SETS = (\{.*?\});\n', src).group(1))
season = json.load(open(R + r'\play\theatre\season.json', encoding='utf-8'))
STOP = set('the of and in for a to on with upsc cse tnpsc group lecture part class complete one shot video by ias pw only study iq studyiq india indian'.split())
SYN = {  # extra words that point at a set
 'constitution-features': 'preamble salient features making constituent assembly schedules', 'fundamental-rights': 'fundamental rights article writs', 'dpsp': 'directive principles duties',
 'executive': 'president vice prime minister council governor', 'parliament': 'lok sabha rajya bills speaker legislature', 'judiciary': 'supreme court high judicial review',
 'federalism': 'centre state relations emergency', 'local-govt': 'panchayati raj municipalities 73rd 74th', 'constitutional-bodies': 'election commission cag upsc finance commission',
 'int-relations': 'foreign policy', 'indus-valley': 'harappan harappa', 'prehistoric': 'stone age paleolithic neolithic', 'ancient-kingdoms': 'maurya gupta vedic mahajanapadas buddhism jainism sangam',
 'medieval-india': 'delhi sultanate mughal vijayanagara bhakti sufi', 'climate': 'monsoon climate weather', 'rivers-drainage': 'rivers drainage', 'physical-india': 'himalaya plateau physiography',
 'physical-world': 'geomorphology earth interior plate tectonics oceanography atmosphere', 'agriculture-geo': 'crops soils irrigation', 'population': 'census urbanisation migration',
 'natural-resources': 'minerals energy resources', 'transport-infra': 'transport ports railways', 'environment-eco': 'ecosystem ecology',
 'inflation': 'inflation prices cpi wpi', 'money-banking': 'money banking rbi monetary', 'budget-fiscal': 'budget fiscal tax gst deficit', 'national-income': 'gdp national income growth',
 'trade-balance': 'trade balance payments wto forex external', 'agriculture-eco': 'agriculture msp food', 'industry-msme': 'industry msme manufacturing', 'economic-reforms': 'reforms 1991 liberalisation planning',
 'poverty-inclusion': 'poverty unemployment inclusion', 'biodiversity': 'biodiversity species', 'climate-change': 'climate change global warming', 'pollution': 'pollution air water',
 'protected-areas': 'national parks sanctuaries tiger', 'env-laws': 'environment laws conventions protocols', 'ecology-basics': 'ecology ecosystem food chain biogeochemical',
 '1857-revolt': '1857 revolt mutiny', 'gandhi-era': 'gandhi non cooperation civil disobedience quit', 'national-movement': 'congress national movement moderates extremists', 'british-conquest': 'british east india company carnatic plassey',
 'art-culture': 'art culture architecture painting dance music', 'post-1947': 'independence integration post', 'space-tech': 'space isro satellite', 'biotech': 'biotechnology dna genetic', 'defence-tech': 'missile defence',
}
words = lambda t: [w for w in re.findall(r'[a-z0-9]+', t.lower()) if w not in STOP and len(w) > 2]
setinfo = {}
for hall in DAY_SETS:
    for sets in DAY_SETS[hall].values():
        for s in sets:
            if s in setinfo: continue
            try: d = json.load(open(R + r'\assets\quiz-data\\' + s.replace('/', '\\') + '.json', encoding='utf-8'))
            except Exception: continue
            slug = s.split('/')[-1]
            setinfo[s] = {'title': d.get('title') or slug, 'kw': set(words(slug.replace('-', ' ') + ' ' + (d.get('title') or '') + ' ' + (d.get('topic') or '') + ' ' + SYN.get(slug, '')))}
chapters = {}; report = []
for hall, days in season.items():
    chapters[hall] = {}
    for day, chunks in days.items():
        cands = [s for s in DAY_SETS[hall].get(day, []) if s in setinfo]
        out = []
        for k, ch in enumerate(chunks):
            tw = set(words(' '.join(v['title'] for v in ch)))
            sc = sorted(((len(tw & setinfo[s]['kw']), s) for s in cands), reverse=True)
            pick = [s for n, s in sc if n > 0][:3]
            out.append(pick)
            report.append(f"{hall}.{day}.w{k+1}: {' / '.join(v['title'][:45] for v in ch[:2])}  ->  {[setinfo[s]['title'] for s in pick] or 'DAY SUBJECT'}")
        chapters[hall][day] = out
json.dump({'chapters': chapters, 'titles': {s: v['title'] for s, v in setinfo.items()}}, open(R + r'\play\theatre\chapters.json', 'w', encoding='utf-8'), ensure_ascii=False)
sys.stdout.reconfigure(encoding='utf-8')
print('\n'.join(report))
tagged = sum(1 for h in chapters.values() for d in h.values() for x in d if x); total = sum(1 for h in chapters.values() for d in h.values() for x in d)
print('tagged', tagged, 'of', total)
