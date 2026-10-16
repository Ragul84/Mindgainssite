"""/quiz/<exam>/ index pages in the v4 layout. Keeps <head>; regenerates <main> and swaps the old
footer for the standard site footer. Counts come from assets/quiz-data."""
import os,re,glob,html,sys
sys.path.insert(0,os.path.dirname(__file__))
from build_exam_pages import ROOT,V,SUB_MIN,pretty,icon,qcount
from build_subject_pages import stats,mixbar,CHEV,esc
from exam_data import EXAMS
FOOT=re.search(r'<footer class="mg-foot">.*?</footer>',open(f'{ROOT}/rrb/reasoning/index.html',encoding='utf-8').read(),re.S).group(0)
def build(ex):
    p=f'{ROOT}/quiz/{ex}/index.html'; h=open(p,encoding='utf-8',newline='').read(); E=EXAMS[ex]
    a=h.find('<main'); b=h.find('</main>')+7; m=h[a:b]
    h1=re.search(r'<h1>(.*?)</h1>',m,re.S).group(1)
    subs=[]
    for x in re.finditer(r'<a class="card" href="(/quiz/'+ex+r'/([^/]+)/)">(.*?)</a>',m,re.S):
        t=re.search(r'<h2>(.*?)</h2>',x.group(3),re.S); subs.append((x.group(1),x.group(2),html.unescape(t.group(1)) if t else pretty(x.group(2))))
    if not subs:
        for x in re.finditer(r'<a class="s-card[^"]*" href="(/quiz/'+ex+r'/([^/]+)/)">.*?<h2>(.*?)</h2>',m,re.S): subs.append((x.group(1),x.group(2),html.unescape(x.group(3))))
    rows=[];tot=0;mix={'easy':0,'medium':0,'hard':0}
    for href,sb,title in subs:
        n,d=stats(ex,sb); nt=len(glob.glob(f'{ROOT}/assets/quiz-data/{ex}/{sb}/*.json'))
        rows.append((href,sb,title,n,d,nt))
        if n>=SUB_MIN:
            tot+=n
            for k in mix: mix[k]+=d[k]
    ready=[r for r in rows if r[3]>=SUB_MIN]; ntop=sum(r[5] for r in ready)
    cards=''
    for href,sb,title,n,d,nt in rows:
        if n<SUB_MIN:
            cards+=f'<a class="s-card s-soon" href="{href}"><span class="s-ic">{icon(sb)}</span><span class="s-body"><span class="s-row"><h2>{esc(title)}</h2><small class="s-badge">Coming soon</small></span><p>We are still writing questions for this subject.</p></span></a>'; continue
        tw='topic' if nt==1 else 'topics'
        cards+=f'<a class="s-card" href="{href}"><span class="s-ic">{icon(sb)}</span><span class="s-body"><span class="s-row"><h2>{esc(title)}</h2>{CHEV}</span><p>{nt} {tw} with explanations for every answer.</p><span class="s-foot"><span class="s-n">{n:,} questions</span>{mixbar(d)}</span></span></a>'
    lede=f'Free {E["name"]} practice organised by subject. There are {tot:,} questions across {ntop} topics, and every quiz starts without a sign up.'
    best=max(ready,key=lambda r:r[3]) if ready else None
    main=f'''<main class="s">
  <section class="s-hero"><div class="s-wrap">
    <nav class="s-crumb" aria-label="Breadcrumb"><a href="/">Home</a>{CHEV}<a href="/quiz/">Quiz Hub</a>{CHEV}<span aria-current="page">{esc(E["name"])}</span></nav>
    <div class="s-hero-g">
      <div><p class="s-kick">{esc(E["kick"])}</p><h1>{h1}</h1><p class="s-lede">{esc(lede)}</p></div>
      <ul class="s-tiles"><li><b>{tot:,}</b><span>practice questions</span></li><li><b>{len(ready)}</b><span>subjects ready</span></li><li><b>{ntop}</b><span>topics to practise</span></li><li><b>100%</b><span>of questions explained</span></li></ul>
    </div>
  </div></section>
  <section class="s-main"><div class="s-wrap s-grid">
    <div class="s-content">
      <section class="search-panel s-search">
        <label for="quiz-search">Search every exam, subject and topic</label>
        <div class="s-sbox"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input id="quiz-search" type="search" autocomplete="off" placeholder="Try DPSP, photosynthesis, percentage or class 10 science" /></div>
        <div id="quiz-search-results" class="search-results" hidden></div>
      </section>
      <div class="s-head"><h2 class="s-h2">{esc(E["name"])} subjects</h2><p>Each subject opens its list of topics. The bar shows the real mix of easy, medium and hard questions.</p></div>
      <div class="s-cards">{cards}</div>
    </div>
    <aside class="s-side">
      <div class="s-panel s-sum"><p class="s-pk">{esc(E["name"])} at a glance</p><p class="s-big">{tot:,}<span>questions across {ntop} topics</span></p>{mixbar(mix,True)}{f'<a class="s-btn s-btn-d" href="{best[0]}">Start with {esc(best[2])}</a>' if best else ''}<a class="s-btn" href="/{ex}/">Open the {esc(E["name"])} exam hub</a></div>
      <a class="s-panel s-nl" href="/nationlap/"><img src="/assets/nationlap-title.webp" alt="The NationLap title screen with karts on the starting grid" width="1120" height="564" loading="lazy"><span class="s-nlb"><b>Race the syllabus in NationLap</b><span>A kart racing game where every item box asks a real exam question. It runs in your browser.</span><em>Play NationLap</em></span></a>
      <div class="s-panel s-app"><p class="s-pk">MindGains app</p><p>Mock tests with negative marking, answers grounded in your textbooks, and revision that brings back what you got wrong.</p><a class="s-btn" href="/get/">Get early access</a></div>
    </aside>
  </div></section>
</main>'''
    h=h[:a]+main+h[b:]
    h=re.sub(r'<footer\b.*?</footer>',lambda _:FOOT,h,count=1,flags=re.S)
    h=re.sub(r'<body class="v2s v2s-index[^"]*"','<body class="v2s v2s-index s4"',h,count=1)
    css=f'<link rel="stylesheet" href="/assets/subject-v4.css?v={V}">'
    h=re.sub(r'<link rel="stylesheet" href="/assets/subject-v4\.css\?v=\w+">\n?','',h).replace('</head>',css+'\n</head>',1)
    if 'site-footer.css' not in h: h=h.replace('</head>','<link rel="stylesheet" href="/assets/site-footer.css?v=3">\n</head>',1)
    if 'family=Inter' not in h: h=h.replace('</head>','<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">\n</head>',1)
    open(p,'w',encoding='utf-8',newline='').write(h)
if __name__=='__main__':
    for e in EXAMS: build(e)
    print('quiz exam pages',len(EXAMS))
