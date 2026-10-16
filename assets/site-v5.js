/* MindGains v5 shell: glass header on scroll, mobile sheet menu, light hero aurora on inner pages.
   Loaded on every page except /nationlap/ and /chat/. Never touches quiz UI. */
(function(){
  var d=document,b=d.body; if(!b) return;
  var home=b.classList.contains('v2');
  var head=d.querySelector('header.nav');
  /* glass on scroll */
  if(head){var sc=function(){head.classList.toggle('scrolled',scrollY>8)};sc();addEventListener('scroll',sc,{passive:true});}
  /* sign in hand off: inner pages link to /#signin, the homepage (which loads auth.js) opens it */
  if(home&&location.hash==='#signin'){var tries=0,t=setInterval(function(){tries++;if(window.MG&&MG.auth&&MG.auth.signIn){clearInterval(t);history.replaceState(null,'',location.pathname);MG.auth.signIn();}else if(tries>40)clearInterval(t);},150);}
  /* mobile menu */
  if(head&&!d.getElementById('v5sheet')){
    var hin=head.querySelector('.hin')||head;
    var btn=d.createElement('button');btn.type='button';btn.className='v5-burger';btn.setAttribute('aria-label','Open menu');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls','v5sheet');
    btn.innerHTML='<span></span><span></span>';hin.appendChild(btn);
    var ex=[['UPSC','/upsc/'],['TNPSC','/tnpsc/'],['SSC','/ssc/'],['RRB','/rrb/'],['NCERT','/ncert/'],['Samacheer Kalvi','/samacheer/']];
    var main=[['NationLap','/nationlap/','A kart racing game built on the syllabus'],['Quiz Hub','/quiz/','Free topic quizzes for every exam'],['Current affairs','/nationlap/?affairs=1','Published every morning at 5am'],['Editorial','/editorial/','Analysis written for exam preparation']];
    var s=d.createElement('div');s.id='v5sheet';s.className='v5-sheet';s.setAttribute('role','dialog');s.setAttribute('aria-modal','true');s.setAttribute('aria-label','Site menu');s.hidden=true;
    s.innerHTML='<div class="v5-sh-top"><a class="v5-sh-brand" href="/"><span class="v5-mk"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 11-13h-7z"/></svg></span><b>Mind<span>Gains</span></b></a><button type="button" class="v5-close" aria-label="Close menu"><span></span><span></span></button></div>'+
      '<nav class="v5-sh-main" aria-label="Main">'+main.map(function(m){return '<a href="'+m[1]+'"><b>'+m[0]+'</b><small>'+m[2]+'</small></a>'}).join('')+'</nav>'+
      '<p class="v5-sh-k">Exams</p><nav class="v5-sh-ex" aria-label="Exams">'+ex.map(function(e){return '<a href="'+e[1]+'">'+e[0]+'</a>'}).join('')+'</nav>'+
      '<div class="v5-sh-cta"><a class="v5-sh-app" href="/get/">Get the app</a><span class="v5-sh-auth"></span></div>';
    d.body.appendChild(s);
    var auth=s.querySelector('.v5-sh-auth');
    if(window.MG&&MG.auth&&MG.auth.mountChip){MG.auth.mountChip(auth);}else{auth.innerHTML='<a class="v5-sh-in" href="/#signin">Sign in</a>';}
    var last;
    function open(){last=d.activeElement;s.hidden=false;requestAnimationFrame(function(){s.classList.add('on')});b.classList.add('v5-lock');btn.setAttribute('aria-expanded','true');s.querySelector('.v5-close').focus();}
    function close(){s.classList.remove('on');b.classList.remove('v5-lock');btn.setAttribute('aria-expanded','false');setTimeout(function(){s.hidden=true},220);if(last&&last.focus)last.focus();}
    btn.addEventListener('click',open);s.querySelector('.v5-close').addEventListener('click',close);
    s.addEventListener('click',function(e){if(e.target.closest('a'))close();});
    d.addEventListener('keydown',function(e){if(s.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){var f=s.querySelectorAll('a,button'),a=f[0],z=f[f.length-1];if(e.shiftKey&&d.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&d.activeElement===z){e.preventDefault();a.focus()}}});
    matchMedia('(min-width:769px)').addEventListener('change',function(m){if(m.matches&&!s.hidden)close();});
  }
  /* inner page aurora: soft CSS orbs behind the first hero */
  if(!home){
    var hero=d.querySelector('.x-hero,.s-hero,.topic-hero,main .hero,.blog-hero,.page-hero,.legal-hero,main>section:first-child,main>header:first-child');
    if(hero&&!hero.querySelector('.v5-orb')&&!hero.closest('.quiz-player')){hero.classList.add('v5-aur');hero.insertAdjacentHTML('afterbegin','<span class="v5-orb v5-o1" aria-hidden="true"></span><span class="v5-orb v5-o2" aria-hidden="true"></span>');}
  }
})();
