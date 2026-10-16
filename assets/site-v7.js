(function(){var d=document;if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var sel='.x-sub,.s-card,.exam-grid .exam,.story,.blog-card,.v2s-page .tile,.mg-seo-question,.x-head,.s-head,.feature';
d.documentElement.classList.add('v7r');
function go(){var els=[].slice.call(d.querySelectorAll(sel));var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('v7-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});
els.forEach(function(el,i){el.classList.add('v7-rv');el.style.transitionDelay=Math.min(i%6,5)*50+'ms';io.observe(el)});
setTimeout(function(){els.forEach(function(el){el.classList.add('v7-in')})},2500);}
if(d.readyState!='loading')go();else d.addEventListener('DOMContentLoaded',go);})();
