#!/usr/bin/env python3
"""Idempotently apply the v2 skin to every inner page (never the homepage or /nationlap/)."""
import os,re,sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS={'.git','nationlap','node_modules','.wrangler','scripts','assets'}
SKIP_FILES={'index.html','home-legacy.html'}  # root-level only
V='20261016'
def kind(p,h):
    if 'exam-hubs.css' in h: return 'hub'
    if 'class="quiz-player"' in h: return 'topic'
    if 'hero compact' in h or 'search-panel' in h: return 'index'
    if p.startswith(('blog','editorial')): return 'blog'
    if 'legal.css' in h: return 'legal'
    if p.startswith('quiz'): return 'quizhub'
    return 'page'
n=0
for dp,dn,fn in os.walk(ROOT):
    rel=os.path.relpath(dp,ROOT); top=rel.split(os.sep)[0]
    dn[:]=[d for d in dn if d not in SKIP_DIRS]
    for f in fn:
        if not f.endswith('.html'): continue
        r=os.path.normpath(os.path.join(rel,f))
        if rel=='.' and f in SKIP_FILES: continue
        fp=os.path.join(dp,f); h=open(fp,encoding='utf-8',newline='').read()
        if 'v2-skin.css' in h or '<body' not in h: continue
        k=kind(r.replace(os.sep,'/'),h)
        h=h.replace('</head>','<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">\n<link rel="stylesheet" href="/assets/v2-skin.css?v=%s">\n</head>'%V,1)
        def bod(m):
            t=m.group(0)
            if 'class="' in t: return t.replace('class="','class="v2s v2s-%s '%k,1)
            return t[:-1]+' class="v2s v2s-%s">'%k
        h=re.sub(r'<body\b[^>]*>',bod,h,count=1)
        i=h.rfind('</body>'); h=h[:i]+'<script defer src="/assets/v2-skin.js?v=%s"></script>\n'%V+h[i:]
        open(fp,'w',encoding='utf-8',newline='').write(h); n+=1
print('skinned',n)
