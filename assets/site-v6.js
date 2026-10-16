/* v6: gentle tilt and pointer glow on desktop cards. Off for touch and reduced motion. Never touches quiz UI. */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sel='[data-tilt],.s-card:not(.s-soon),.x-sub:not(.x-soon),.v6-tilt';
  document.addEventListener('pointermove',function(e){
    var el=e.target.closest&&e.target.closest(sel); if(!el||el.closest('.quiz-player')) return;
    var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    var k=el.classList.contains('x-stage')?3:5;
    el.style.setProperty('--mx',(x*100)+'%');el.style.setProperty('--my',(y*100)+'%');
    el.style.transform='perspective(900px) rotateX('+((.5-y)*k)+'deg) rotateY('+((x-.5)*k)+'deg) translateY(-3px)';
    if(!el.__v6){el.__v6=1;el.addEventListener('pointerleave',function(){el.style.transform='';},{passive:true});}
  },{passive:true});
})();
