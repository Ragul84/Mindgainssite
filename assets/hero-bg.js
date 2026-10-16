/* MindGains hero aurora — tiny WebGL fragment shader (no deps). Falls back to CSS orbs. */
(function(){
  var hero=document.querySelector('.hero'); if(!hero) return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var c=document.createElement('canvas'); c.className='hero-gl'; c.setAttribute('aria-hidden','true');
  var gl=c.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'low-power'});
  if(!gl) return;
  var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs='precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;'+
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}'+
  'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 q=uv*vec2(r.x/r.y,1.)*1.6;float T=t*.05;'+
  'vec2 w=vec2(fbm(q+vec2(T,-T)),fbm(q+vec2(5.2-T,1.3+T)));float f=fbm(q+2.2*w+m*.35);'+
  'vec3 teal=vec3(0.,.86,.8),vio=vec3(.5,.35,1.),sky=vec3(1.,.55,.85);'+
  'vec3 col=mix(teal,vio,smoothstep(.42,.62,w.x));col=mix(col,sky,smoothstep(.6,.8,f)*.5);'+
  'float band=smoothstep(.4,.62,f)*(1.-smoothstep(.7,.9,f));'+
  'float a=band*.9+.3*f*f;'+
  'a*=mix(1.,.7,smoothstep(.35,0.,length((uv-vec2(.5,.68))*vec2(1.,1.6))));'+
  'a*=smoothstep(0.,.35,uv.y);'+
  'gl_FragColor=vec4(col,a);}';
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;}
  var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
  var ur=gl.getUniformLocation(pr,'r'),ut=gl.getUniformLocation(pr,'t'),um=gl.getUniformLocation(pr,'m');
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  hero.insertBefore(c,hero.firstChild); hero.classList.add('has-gl');
  var mx=0,my=0,tx=0,ty=0,vis=true,t0=performance.now(),raf;
  var scale=Math.min(devicePixelRatio||1,1)*(innerWidth<700?.5:.6); // render low-res, CSS upscales (soft aurora anyway)
  function size(){var w=hero.clientWidth,h=hero.clientHeight;c.width=Math.max(1,w*scale|0);c.height=Math.max(1,h*scale|0);gl.viewport(0,0,c.width,c.height);gl.uniform2f(ur,c.width,c.height);}
  function draw(now){tx+=(mx-tx)*.04;ty+=(my-ty)*.04;gl.uniform1f(ut,reduce?8.:(now-t0)/1000+8.);gl.uniform2f(um,tx,ty);gl.drawArrays(gl.TRIANGLES,0,3);}
  function loop(now){draw(now);if(vis&&!reduce)raf=requestAnimationFrame(loop);}
  size();addEventListener('resize',function(){size();if(reduce)draw(0);},{passive:true});
  if(matchMedia('(pointer:fine)').matches) hero.addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=.5-e.clientY/innerHeight;},{passive:true});
  if('IntersectionObserver' in window) new IntersectionObserver(function(es){vis=es[0].isIntersecting;cancelAnimationFrame(raf);if(vis&&!reduce)raf=requestAnimationFrame(loop);}).observe(hero);
  document.addEventListener('visibilitychange',function(){cancelAnimationFrame(raf);if(!document.hidden&&vis&&!reduce)raf=requestAnimationFrame(loop);});
  reduce?draw(0):(raf=requestAnimationFrame(loop));
})();
