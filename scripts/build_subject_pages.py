"""Rebuild the subject index pages (/<exam>/<subject>/ and /quiz/<exam>/<subject>/) with the v4 layout.
Keeps <head> (title, meta, canonical, JSON-LD), the footer and all scripts after </main>. Only the
header and <main> are regenerated. Question counts and difficulty mix come from assets/quiz-data."""
import os,re,json,glob,html,sys
sys.path.insert(0,os.path.dirname(__file__))
from build_exam_pages import ROOT,V,SUB_MIN,TOP_MIN,pretty,icon,qcount,subjects
from exam_data import EXAMS
esc=lambda s:html.escape(s,quote=True)
def stats(exam,sub,topic=None):
    n=0;d={'easy':0,'medium':0,'hard':0}
    for f in glob.glob(f'{ROOT}/assets/quiz-data/{exam}/{sub}/{topic or "*"}.json'):
        try: qs=json.load(open(f)).get('questions',[])
        except Exception: continue
        n+=len(qs)
        for q in qs:
            k=q.get('difficulty')
            if k in d: d[k]+=1
    return n,d
def mixbar(d,big=False):
    t=sum(d.values())
    if not t: return ''
    seg=''.join(f'<i class="s-{k}" style="width:{d[k]*100/t:.1f}%"></i>' for k in ('easy','medium','hard') if d[k])
    lab=f'{round(d["easy"]*100/t)}% easy, {round(d["medium"]*100/t)}% medium and {round(d["hard"]*100/t)}% hard'
    leg=(f'<span class="s-leg"><b class="s-easy">Easy {round(d["easy"]*100/t)}%</b><b class="s-medium">Medium {round(d["medium"]*100/t)}%</b><b class="s-hard">Hard {round(d["hard"]*100/t)}%</b></span>' if big else '')
    return f'<span class="s-mix" role="img" aria-label="Difficulty mix: {lab}">{seg}</span>{leg}'
HEADER='''<header class="s-top">
  <div class="wrap hin">
    <a class="brand" href="/">
      <span class="mk" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 11-13h-7z"/></svg></span>
      <b>Mind<span>Gains</span></b>
    </a>
    <div class="hnav">
      <a class="lnk" href="/{ex}/">{exname} hub</a>
      <a class="lnk" href="/quiz/">Quizzes</a>
      <a class="lnk" href="/nationlap/">NationLap</a>
      <a class="lnk" href="/nationlap/?affairs=1">Current affairs</a><a class="btn sm" href="/get/">Get the app</a>
    </div>
  </div>
</header>'''
CHEV='<svg class="s-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def parse_cards(m):
    out=[]
    for x in re.finditer(r'<a class="card( soon)?" href="([^"]+)">(.*?)</a>',m,re.S):
        body=x.group(3)
        t=re.search(r'<h2>(.*?)</h2>',body,re.S); p=re.search(r'<p>(.*?)</p>',body,re.S); pill=re.search(r'<span class="pill">(.*?)</span>',body,re.S)
        out.append(dict(href=x.group(2),title=html.unescape(re.sub('<[^>]+>','',t.group(1)).strip()) if t else '',desc=html.unescape(p.group(1).strip()) if p else '',pill=html.unescape(pill.group(1).strip()) if pill else ''))
    if not out:
        for x in re.finditer(r'<a class="topic" href="([^"]+)">(.*?)</a>',m,re.S):
            t=re.search(r'<h3>(.*?)</h3>',x.group(2),re.S); pp=re.search(r'<p>(.*?)</p>',x.group(2),re.S)
            out.append(dict(href=x.group(1),title=html.unescape(t.group(1)),desc=html.unescape(pp.group(1)) if pp else '',pill=''))
    if not out:
        for x in re.finditer(r'<a class="s-card( s-soon)?" href="([^"]+)">(.*?)</a>',m,re.S):
            t=re.search(r'<h2>(.*?)</h2>',x.group(3),re.S); pp=re.search(r'<p>(.*?)</p>',x.group(3),re.S)
            out.append(dict(href=x.group(2),title=html.unescape(t.group(1)),desc=html.unescape(pp.group(1)) if pp else '',pill=''))
    return out
def href_key(h):
    parts=[x for x in h.strip('/').split('/') if x]
    if parts and parts[0]=='quiz': parts=parts[1:]
    return parts if len(parts)==3 else None
def build(p):
    rel=p[len(ROOT)+1:].split('/'); mirror=rel[0]=='quiz'
    ex,sb=(rel[1],rel[2]) if mirror else (rel[0],rel[1])
    E=EXAMS[ex]
    h=open(p,encoding='utf-8',newline='').read()
    a=h.find('<main'); b=h.find('</main>')+len('</main>')
    m=h[a:b]
    cards=parse_cards(m)
    if not cards: return False
    if '<h1>' not in m: m=m
    h1=re.search(r'<h1>(.*?)</h1>',m,re.S).group(1).strip()
    eyebrow=re.search(r'<(?:p|span) class="eyebrow">(.*?)</(?:p|span)>',m,re.S); eyebrow=eyebrow.group(1).strip() if eyebrow else f'{E["name"]} {pretty(sb)}'
    if eyebrow.isupper(): eyebrow=f'{E["name"]} {pretty(sb)}'
    rows=[]
    for c in cards:
        k=href_key(c['href'])
        n,d=stats(*k) if k else (0,{'easy':0,'medium':0,'hard':0})
        rows.append((c,k,n,d))
    stocked=[r for r in rows if r[2]>=TOP_MIN]
    total=sum(r[2] for r in stocked)
    mix={'easy':0,'medium':0,'hard':0}
    for r in stocked:
        for kk in mix: mix[kk]+=r[3][kk]
    subname=pretty(sb)
    # topic cards
    tc=''
    for c,k,n,d in rows:
        ic=icon(k[1] if k else sb)
        if n and n<TOP_MIN:
            tc+=f'<a class="s-card s-soon" href="{esc(c["href"])}"><span class="s-ic">{ic}</span><span class="s-body"><span class="s-row"><h2>{esc(c["title"])}</h2><small class="s-badge">Coming soon</small></span><p>We are still writing questions for this topic. A short practice set is available in the meantime.</p></span></a>'
            continue
        meta=f'<span class="s-n">{n:,} questions</span>' if n else '<span class="s-n">Open the topic</span>'
        tc+=f'<a class="s-card" href="{esc(c["href"])}"><span class="s-ic">{ic}</span><span class="s-body"><span class="s-row"><h2>{esc(c["title"])}</h2>{CHEV}</span><p>{esc(c["desc"])}</p><span class="s-foot">{meta}{mixbar(d) if n else ""}</span></span></a>'
    # related subjects
    rel_html=''
    for s2,tops in subjects(ex):
        if s2==sb: continue
        n2=qcount(ex,s2)
        if n2==0: lab=f'{len(tops)} topics'
        elif n2<SUB_MIN: lab='Coming soon'
        else: lab=f'{n2:,} questions'
        href=f'/quiz/{ex}/{s2}/' if mirror and os.path.exists(f'{ROOT}/quiz/{ex}/{s2}/index.html') else f'/{ex}/{s2}/'
        rel_html+=f'<li><a href="{href}"{" class=\"s-rsoon\"" if 0<n2<SUB_MIN else ""}><span class="s-ric">{icon(s2)}</span><b>{esc(pretty(s2))}</b><small>{lab}</small></a></li>'
    best=max(stocked,key=lambda r:r[2]) if stocked else None
    ntop=len(stocked); tw='topic' if ntop==1 else 'topics'
    if total:
        lede=f'Practise {ntop} {subname} {tw} written for the {E["full"]}. There are {total:,} questions in this subject, every one comes with an explanation, and each quiz starts without a sign up.'
    else:
        lede=f'Practise {subname} topic by topic for the {E["full"]}. Every question comes with an explanation, and each quiz starts without a sign up.'
    soon_n=len(rows)-len(stocked)
    stat_tiles=(f'<li><b>{total:,}</b><span>practice questions</span></li><li><b>{ntop}</b><span>{tw} ready to practise</span></li>' if total else f'<li><b>{len(rows)}</b><span>topics to practise</span></li>')+'<li><b>100%</b><span>of questions explained</span></li>'+(f'<li><b>{soon_n}</b><span>{"topic" if soon_n==1 else "topics"} coming soon</span></li>' if soon_n else '<li><b>Free</b><span>with no sign up needed</span></li>')
    crumb=f'<nav class="s-crumb" aria-label="Breadcrumb"><a href="/">Home</a>{CHEV}<a href="/{ex}/">{esc(E["name"])}</a>{CHEV}<span aria-current="page">{esc(subname)}</span></nav>'
    summary=f'''<div class="s-panel s-sum"><p class="s-pk">{esc(E["name"])} {esc(subname)} at a glance</p>
        {f'<p class="s-big">{total:,}<span>questions across {ntop} {tw}</span></p>' if total else f'<p class="s-big">{len(rows)}<span>topics</span></p>'}
        {mixbar(mix,True) if total else ''}
        {f'<a class="s-btn s-btn-d" href="{esc(best[0]["href"])}">Start with {esc(best[0]["title"])}</a><p class="s-tiny">This is the largest set in {esc(subname)}, with {best[2]:,} questions.</p>' if best else ''}
      </div>'''
    aside=f'''<aside class="s-side">
      {summary}
      {f'<div class="s-panel"><p class="s-pk">Other {esc(E["name"])} subjects</p><ul class="s-rel">{rel_html}</ul></div>' if rel_html else ''}
      <a class="s-panel s-nl" href="/nationlap/"><img src="/assets/nationlap-title.webp" alt="The NationLap title screen with karts on the starting grid" width="1120" height="564" loading="lazy"><span class="s-nlb"><b>Race the syllabus in NationLap</b><span>A kart racing game where every item box asks a real exam question. It runs in your browser.</span><em>Play NationLap</em></span></a>
      <div class="s-panel s-app"><p class="s-pk">MindGains app</p><p>Mock tests with negative marking, answers grounded in your textbooks, and revision that brings back what you got wrong.</p><a class="s-btn" href="/get/">Get early access</a></div>
    </aside>'''
    main=f'''<main class="s">
  <section class="s-hero"><div class="s-wrap">
    {crumb}
    <div class="s-hero-g">
      <div><p class="s-kick">{esc(eyebrow)}</p><h1>{h1}</h1><p class="s-lede">{esc(lede)}</p></div>
      <ul class="s-tiles">{stat_tiles}</ul>
    </div>
  </div></section>
  <section class="s-main"><div class="s-wrap s-grid">
    <div class="s-content">
      <section class="search-panel s-search">
        <label for="quiz-search">Search every exam, subject and topic</label>
        <div class="s-sbox"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input id="quiz-search" type="search" autocomplete="off" placeholder="Try DPSP, photosynthesis, percentage or class 10 science" /></div>
        <div id="quiz-search-results" class="search-results" hidden></div>
      </section>
      <div class="s-head"><h2 class="s-h2">{esc(subname)} topics</h2><p>Each topic opens a quiz straight away. The bar under each topic shows its real mix of easy, medium and hard questions.</p></div>
      <div class="s-cards">{tc}</div>
    </div>
    {aside}
  </div></section>
</main>'''
    hd=re.search(r'<header class="site-nav">.*?</header>|<header class="s-top">.*?</header>',h,re.S)
    newh=HEADER.format(ex=ex,exname=esc(E['name']))
    if hd: h=h[:hd.start()]+newh+h[hd.end():]; a=h.find('<main'); b=h.find('</main>')+len('</main>')
    h=h[:a]+main+h[b:]
    h=re.sub(r'<body class="v2s v2s-(?:index|page)[^"]*"','<body class="v2s v2s-index s4"',h,count=1)
    css=f'<link rel="stylesheet" href="/assets/subject-v4.css?v={V}">'
    if 'subject-v4.css' in h: h=re.sub(r'<link rel="stylesheet" href="/assets/subject-v4\.css\?v=\w+">',css,h)
    else: h=h.replace('</head>',css+'\n</head>',1)
    if 'family=Inter' not in h: h=h.replace('</head>','<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">\n</head>',1)
    open(p,'w',encoding='utf-8',newline='').write(h); return True
if __name__=='__main__':
    n=0
    for e in EXAMS:
        for p in sorted(glob.glob(f'{ROOT}/{e}/*/index.html')+glob.glob(f'{ROOT}/quiz/{e}/*/index.html')):
            if 'quiz-player' in open(p,encoding='utf-8').read(): continue
            n+=build(p)
    print('subject pages',n)
