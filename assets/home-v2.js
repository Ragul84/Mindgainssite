(function(){
  var io='IntersectionObserver' in window && new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(function(el,i){ if(io) io.observe(el); else el.classList.add('in'); });
  var nav=document.querySelector('.nav'); addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>10)},{passive:true});
  var tabs=document.querySelectorAll('.tab'),panes=document.querySelectorAll('.pane');
  tabs.forEach(function(t){t.addEventListener('click',function(){var i=t.dataset.i;
    tabs.forEach(function(x){x.classList.toggle('on',x===t);x.setAttribute('aria-selected',x===t)});
    panes.forEach(function(p){p.classList.toggle('on',p.dataset.i===i)});});});
  var st=document.querySelector('.hero-vis .qcard');
  if(st && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.querySelector('.hero').addEventListener('mousemove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
      st.style.transform='perspective(1400px) rotateX('+(-y*5)+'deg) rotateY('+(x*6)+'deg)';});
  }
})();
