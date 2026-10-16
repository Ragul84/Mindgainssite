"""Apply the v5 shell (homepage header, mobile sheet menu, aurora, design layer) to every page
except the homepage body, /nationlap/ and /chat/. Idempotent: re-run after the page builders."""
import os,re,glob
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V='20261016f'
HEADER='''<header class="nav">
  <div class="wrap hin">
    <a class="brand" href="/" aria-label="MindGains home"><span class="mk" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 11-13h-7z"/></svg></span><b>Mind<span>Gains</span></b></a>
    <nav class="hnav" aria-label="Main"><a class="lnk" href="/quiz/">Quiz Hub</a><a class="lnk" href="/nationlap/">NationLap</a><a class="lnk" href="/editorial/">Editorial</a><a class="lnk" href="/nationlap/?affairs=1">Current affairs</a><a class="btn sm" href="/get/">Get the app</a></nav>
  </div>
</header>'''
CSS=f'<link rel="stylesheet" href="/assets/site-v5.css?v={V}">'
JS=f'<script defer src="/assets/site-v5.js?v={V}"></script>'
SKIP=('nationlap/','chat/','home-legacy.html','node_modules/','legacy/')
def assets(h):
    h=re.sub(r'\n?<link rel="stylesheet" href="/assets/site-v5\.css\?v=\w+">','',h)
    h=h.replace('</head>',CSS+'\n</head>',1)
    h=re.sub(r'<script[^>]*src="/assets/nav-mobile\.js[^"]*"[^>]*></script>','',h)
    h=re.sub(r'\n?<script defer src="/assets/site-v5\.js\?v=\w+"></script>','',h)
    h=h.replace('</body>',JS+'\n</body>',1) if '</body>' in h else h+JS
    return h
def page(p):
    h=open(p,encoding='utf-8',newline='').read(); o=h
    if 'v2-skin.css' not in h: return False
    bpos=h.find('<body'); mpos=h.find('<main'); 
    m=re.search(r'<header\b[^>]*>.*?</header>',h[bpos:],re.S)
    if m and (mpos<0 or bpos+m.start()<mpos):
        h=h[:bpos+m.start()]+HEADER+h[bpos+m.end():]
    elif 'class="nav">' not in h[bpos:bpos+3000]:
        be=h.find('>',bpos)+1; h=h[:be]+'\n'+HEADER+h[be:]
    h=assets(h)
    if h!=o: open(p,'w',encoding='utf-8',newline='').write(h); return True
    return False
def home():
    p=f'{ROOT}/index.html'; h=open(p,encoding='utf-8',newline='').read(); o=h
    h=assets(h)
    if 'v5-keep' not in h:
        i=h.find('<span class="kick rv">Choose your track</span>'); s=h.rfind('<section class="sec"',0,i)
        h=h[:s]+'<section class="sec v5-keep"'+h[s+len('<section class="sec"'):]
    if h!=o: open(p,'w',encoding='utf-8',newline='').write(h)
if __name__=='__main__':
    n=0
    for p in glob.glob(f'{ROOT}/**/*.html',recursive=True):
        r=p[len(ROOT)+1:]
        if r=='index.html' or r.startswith(SKIP): continue
        n+=page(p)
    home(); print('pages',n)
