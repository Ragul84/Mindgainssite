/* v2 skin: header shadow on scroll + scroll-reveal for content blocks (never quiz UI). */
(function(){
  var b=document.body; if(!b||!b.classList.contains('v2s')) return;
  var on=function(){b.classList.toggle('v2s-scrolled',scrollY>8)}; on(); addEventListener('scroll',on,{passive:true});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
  var sel='main>section:not(.quiz-player):not(:first-child),main>div:not(:first-child),.card,.blog-card,.story,.exam,.topic,.tile,.mg-seo-question,.app-bridge,.sec-head';
  var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){return !e.closest('.quiz-player,.quiz-shell,form,[data-quiz]')&&e.getBoundingClientRect().top>innerHeight*.9;});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('v2in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e,i){e.classList.add('v2r');e.style.transitionDelay=(i%4)*60+'ms';io.observe(e);});
})();
