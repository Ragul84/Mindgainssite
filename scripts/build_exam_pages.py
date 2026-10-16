#!/usr/bin/env python3
"""Rebuild the six exam hub pages (main content + FAQ schema) and clean copy on subject/topic pages.
Idempotent: hubs are regenerated from data; text cleaning is safe to re-run."""
import os,re,json,glob,html,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from exam_data import EXAMS
V='20261016d'
SUB_MIN=100  # subjects with fewer questions show Coming soon
TOP_MIN=20   # topics with fewer questions show Coming soon
DASH=re.compile(r'\s*[—–]\s*')
def clean(t):
    t=re.sub(r'(\d)\s*[–—]\s*(\d)',r'\1 to \2',t)
    t=DASH.sub(', ',t)
    t=re.sub(r'\s*·\s*',', ',t)
    t=re.sub(r'\s*(→|&rarr;)\s*$','',t); t=re.sub(r'\s*(→|&rarr;)\s*',' ',t)
    return t.replace('&mdash;',', ').replace('&middot;',', ')
def esc(s): return html.escape(s,quote=False)
def title_of(p):
    try:
        h=open(p,encoding='utf-8').read(); m=re.search(r'<h1[^>]*>(.*?)</h1>',h,re.S); return re.sub('<[^>]+>','',m.group(1)).strip() if m else None
    except: return None
PRETTY={'general-aware':'General Awareness','csat-english':'CSAT English','csat-quant':'CSAT Quant','social-science':'Social Science','quant':'Quantitative Aptitude','time-work':'Time and Work'}
def pretty(s): return PRETTY.get(s, s.replace('-',' ').title())
def qcount(exam,sub,topic=None):
    pat=f'{ROOT}/assets/quiz-data/{exam}/{sub}/{topic or "*"}.json'; n=0
    for f in glob.glob(pat):
        try: n+=len(json.load(open(f)).get('questions',[]))
        except: pass
    return n
def pick_q(exam):
    prefs=['polity','history','geography','science','maths','reasoning']
    for sub in prefs+sorted(os.listdir(f'{ROOT}/assets/quiz-data/{exam}')):
        if qcount(exam,sub)<SUB_MIN: continue
        for f in sorted(glob.glob(f'{ROOT}/assets/quiz-data/{exam}/{sub}/*.json')):
            try: d=json.load(open(f))
            except: continue
            for q in d.get('questions',[]):
                s=q.get('question','')
                if 50<len(s)<120 and not re.search(r'[—–·\n]|as of',s) and len(q.get('options',[]))==4 and all(len(o)<40 for o in q['options']):
                    return sub,os.path.basename(f)[:-5],q
    return None
def subjects(exam):
    out=[]
    for d in sorted(glob.glob(f'{ROOT}/{exam}/*/index.html')):
        sub=d.split('/')[-2]
        if sub in ('preview',): continue
        topics=[t.split('/')[-2] for t in sorted(glob.glob(f'{ROOT}/{exam}/{sub}/*/index.html'))]
        out.append((sub,topics))
    return out
ICON={'polity':'M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6','history':'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 0 2 2h13','geography':'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
 'maths':'M5 12h14M12 5v14M5 5l4 4M9 5 5 9','quant':'M5 12h14M12 5v14','reasoning':'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z','science':'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3'}
def icon(sub):
    d=ICON.get(sub) or ICON.get('maths' if 'quant' in sub or 'math' in sub else 'science' if sub in('physics','chemistry','biology') else 'history')
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="{d}"/></svg>'
def hub_main(exam):
    E=EXAMS[exam]; subs=subjects(exam)
    def stocked(sub): return qcount(exam,sub)>=SUB_MIN
    good=[(sb,[t for t in tp if qcount(exam,sb,t)>=TOP_MIN]) for sb,tp in subs if stocked(sb)]
    total=sum(qcount(exam,sb,t) for sb,tp in good for t in tp); ntop=sum(len(tp) for _,tp in good)
    q=pick_q(exam)
    vis=''
    if q:
        sub,top,qq=q
        opts=''.join(f'<li class="{"ok" if i==qq["answer_index"] else ""}">{esc(o)}</li>' for i,o in enumerate(qq['options']))
        vis=f'''<div class="x-q" aria-hidden="true"><div class="x-qh"><span>{esc(E["name"])} {esc(pretty(sub))}</span><span>Sample question</span></div><p>{esc(qq["question"])}</p><ol>{opts}</ol></div>'''
    facts=''.join(f'<li><b>{esc(a)}</b><span>{esc(b)}</span></li>' for a,b in E['facts'])
    cards=''
    for sub,tops in subs:
        n=qcount(exam,sub); names=', '.join(pretty(t) for t in tops[:3])+(f' and {len(tops)-3} more' if len(tops)>3 else '')
        tw='topic' if len(tops)==1 else 'topics'; meta=(f'{len(tops)} {tw}, {n:,} questions' if n else f'{len(tops)} {tw}')
        if 0<n<SUB_MIN:
            cards+=f'<a class="x-sub x-soon" href="/{exam}/{sub}/"><span class="x-ic">{icon(sub)}</span><span class="x-st"><b>{esc(pretty(sub))}</b><small class="x-badge">Coming soon</small><em>We are still writing questions for this subject.</em></span></a>'
            continue
        cards+=f'<a class="x-sub" href="/{exam}/{sub}/"><span class="x-ic">{icon(sub)}</span><span class="x-st"><b>{esc(pretty(sub))}</b><small>{esc(meta)}</small><em>{esc(names)}</em></span></a>'
    paths=''.join(f'<article class="x-path{" x-path-a" if i==0 else ""}"><h3>{esc(t)}</h3><p>{esc(d)}</p><a class="x-btn{" x-btn-d" if i==0 else ""}" href="{u}">{esc(c)}</a></article>' for i,(t,d,u,c) in enumerate(E['paths']))
    faq=''.join(f'<details><summary>{esc(a)}</summary><p>{esc(b)}</p></details>' for a,b in E['faq'])
    stat=f'{total:,} free practice questions across {ntop} topics' if total else f'{ntop} free topic quizzes'
    return f'''<main class="x">
  <section class="x-hero"><div class="x-wrap x-hero-g">
    <div><p class="x-kick">{esc(E["kick"])}</p><h1>{esc(E["h1"])}</h1><p class="x-lede">{esc(E["lede"])}</p>
      <div class="x-cta"><a class="x-btn x-btn-d" href="#subjects">Start practising</a><a class="x-btn" href="/get/">Get the app</a></div>
      <p class="x-stat">{esc(stat)}, with no sign up required.</p></div>
    {vis}
  </div></section>
  <section class="x-facts"><div class="x-wrap"><h2 class="x-h2s">The {esc(E["full"])} pattern at a glance</h2><ul>{facts}</ul></div></section>
  <section class="x-sec" id="subjects"><div class="x-wrap"><div class="x-head"><h2>Choose a subject to practise</h2><p>Each subject opens a list of topics. Pick one and the quiz starts straight away.</p></div><div class="x-subs">{cards}</div></div></section>
  <section class="x-sec x-tint"><div class="x-wrap"><div class="x-head"><h2>Three ways to prepare with MindGains</h2></div><div class="x-paths">{paths}</div></div></section>
  <section class="x-sec x-nlsec"><div class="x-wrap"><a class="x-nl" href="/nationlap/"><span class="x-nl-img"><img src="/assets/nationlap-title.webp" alt="The NationLap title screen with karts on the starting grid" width="1120" height="564" loading="lazy"></span><span class="x-nl-t"><small>NationLap</small><b>Revise by racing in a kart game built on the syllabus.</b><span>Every item box on the track asks a real exam question from Polity, History, Geography, Economy, Science, Quant or Reasoning, and a correct answer earns a power up. Each morning's current affairs also become a race of their own.</span><em class="x-btn x-btn-d">Play NationLap</em></span></a><p class="x-nl-ca">Prefer reading? <a href="/nationlap/?affairs=1">Today's current affairs</a> are published at 5am with the source and the static fact behind each story.</p></div></section>
  <section class="x-sec"><div class="x-wrap x-faq"><h2>Common questions about {esc(E["name"])} preparation</h2>{faq}</div></section>
</main>''', E['faq']
def faq_ld(faq):
    return {"@type":"FAQPage","mainEntity":[{"@type":"Question","name":a,"acceptedAnswer":{"@type":"Answer","text":b}} for a,b in faq]}
def replace_faq_ld(h,faq):
    def rep(m):
        try: d=json.loads(m.group(2))
        except Exception: return m.group(0)
        def walk(o):
            if isinstance(o,dict):
                if o.get('@type')=='FAQPage': o['mainEntity']=faq_ld(faq)['mainEntity']
                for v in o.values(): walk(v)
            elif isinstance(o,list):
                for v in o: walk(v)
        walk(d); return m.group(1)+json.dumps(d,ensure_ascii=False)+m.group(3)
    return re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)',rep,h,flags=re.S)
def clean_meta(h):
    def r(m):
        t=re.sub(r'\s+[—–]\s+(\w)',lambda x:'. '+x.group(1).upper(),m.group(2))
        return m.group(1)+clean(t)+m.group(3)
    return re.sub(r'(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")([^"]*)(")',r,h)
def add_css(h):
    h=re.sub(r'/assets/v2-skin\.css\?v=[\w]+','/assets/v2-skin.css?v='+V,h); h=re.sub(r'/assets/v2-skin\.js\?v=[\w]+','/assets/v2-skin.js?v='+V,h)
    if 'exam-v3.css' not in h: h=h.replace('<link rel="stylesheet" href="/assets/v2-skin.css','<link rel="stylesheet" href="/assets/exam-v3.css?v=%s">\n<link rel="stylesheet" href="/assets/v2-skin.css'%V,1)
    else: h=re.sub(r'/assets/exam-v3\.css\?v=[\w]+','/assets/exam-v3.css?v='+V,h)
    return h
def build_hub(exam):
    p=f'{ROOT}/{exam}/index.html'; h=open(p,encoding='utf-8',newline='').read()
    main,faq=hub_main(exam)
    h=re.sub(r'<main\b.*?</main>',lambda m:main,h,count=1,flags=re.S)
    h=replace_faq_ld(h,faq); h=clean_meta(h); h=add_css(h)
    h=h.replace('class="v2s v2s-hub','class="v2s v2s-hub v3x',1) if 'v3x' not in h else h
    open(p,'w',encoding='utf-8',newline='').write(h)
def lw(t): return ' '.join(w if (w.isupper() and len(w)>1) or w[:1].isdigit() else w.lower() for w in t.split())
def PRE(m):
    m=m.replace('Â·','·')
    m=re.sub(r'(<(?:div|p|span) class="(?:eyebrow-chip|eyebrow)"[^>]*>)([^<]*)',lambda x:x.group(1)+re.sub(r'\s*·\s*',' ',x.group(2)),m)
    m=re.sub(r'Race an? ([^<]+?) lap — read the topic, then answer at speed\. Free, no sign-up needed\.',lambda x:f'Play a {x.group(1)} round in NationLap. You read a short summary of the topic, then answer against the clock. It is free and needs no sign up.',m)
    m=re.sub(r'>([^<]*?) practice →<',r'>\1 practice<',m)
    m=m.replace('Free, no sign-up needed.','It is free and needs no sign up.').replace('Free, no sign-up.','It is free and needs no sign up.')
    return m
TEXT=re.compile(r'>([^<>]*[—–·→][^<>]*)<')
def clean_page(p,subject=False):
    h=open(p,encoding='utf-8',newline='').read(); o=h
    a=h.find('<main'); b=h.find('</main>')
    if a<0 or b<0: return False
    m=h[a:b]
    # never touch the quiz player or scripts
    m=PRE(m)
    parts=re.split(r'(<section class="quiz-player".*?</section>|<article class="mg-seo-question".*?</article>|<script.*?</script>|<style.*?</style>)',m,flags=re.S)
    for i in range(0,len(parts),2): parts[i]=TEXT.sub(lambda x:'>'+clean(x.group(1))+'<',parts[i])
    m=''.join(parts)
    if subject:
        m=re.sub(r'<p>([^<]+?) quiz questions for ([^<.]+)\.</p>',lambda x:f'<p>Practise {lw(x.group(1))} questions written for the {x.group(2)} syllabus.</p>',m)
        m=m.replace('<p>Choose a focused topic and practice all available questions.</p>','<p>Pick a topic below. Each quiz is free, starts immediately and explains every answer.</p>')
    if subject:
        parts=p[len(ROOT)+1:].split('/'); ex,sb=parts[0],parts[1]
        if ex=='quiz' and len(parts)>3: ex,sb=parts[1],parts[2]
        def card(x):
            t=x.group(2).rstrip('/').split('/')[-1]; n=qcount(ex,sb,t)
            c=x.group(0)
            if n and n<TOP_MIN:
                c=c.replace('class="card"','class="card soon"',1)
                c=re.sub(r'<div class="meta">[^<]*</div>','<div class="meta">Coming soon</div>',c)
            return c
        m=re.sub(r'<a class="card( soon)?" href="([^"]+)">.*?</a>',card,m,flags=re.S)
    h=h[:a]+m+h[b:]; h=clean_meta(h); h=add_css(h)
    if h!=o: open(p,'w',encoding='utf-8',newline='').write(h); return True
    return False
if __name__=='__main__':
    for e in EXAMS: build_hub(e)
    n=0
    for e in list(EXAMS)+['quiz']:
        for p in glob.glob(f'{ROOT}/{e}/**/index.html',recursive=True):
            if os.path.dirname(p)==f'{ROOT}/{e}': continue
            depth=p[len(ROOT)+1:].count('/')
            n+=clean_page(p,subject=(depth==2 and 'quiz-player' not in open(p,encoding='utf-8').read()))
    print('hubs',len(EXAMS),'pages cleaned',n)
