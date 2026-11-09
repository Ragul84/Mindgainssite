// ===================== Cut-Off Run: Story mode (chapters, hero, family, bosses, collectibles, map) =====================
// Loaded after the main game script. Shares its globals (S, PL, ctx, P, W, H, HOR, camZ ...).
(function(){
'use strict';
const ST={};window.STORY=ST;
const LV_PER_CH=3;
// ---------- chapters ----------
const CH=[
 {n:'Village Dreams',k:'village',boss:'guardian',base:0,land:1,
  sky:['#4fb3ff','#c9f0ff'],sea:['#86cf5e','#4f9a3a'],a:'#ead6a6',b:'#e0c891',rail:'#9a6a3a',raild:'#6b4520',hill:['rgba(120,190,120,.75)','rgba(80,160,90,.8)'],
  line:'Amma: You did it, kanna. The whole village is proud of you.'},
 {n:'Mukherjee Nagar',k:'coaching',boss:'hydra',base:1,land:1,
  sky:['#ff8f6b','#ffd7a3'],sea:['#9a938d','#6f6863'],a:'#4b505c',b:'#565c69',rail:'#ffcc33',raild:'#b8860b',hill:['rgba(110,80,120,.55)','rgba(70,50,90,.7)'],
  line:'Appa: Delhi is tough, but so are you. Keep going.'},
 {n:'The Library',k:'library',boss:'colossus',base:1,land:1,indoor:1,
  sky:['#4a2c1a','#7a4f30'],sea:['#7a4a2a','#55331d'],a:'#a8323e',b:'#b8434f',rail:'#5c3720',raild:'#3e2414',
  line:'Paati: All those quiet hours will speak for you now.'},
 {n:'Prelims Day',k:'exam',boss:'mech',base:2,land:1,indoor:1,
  sky:['#d9e3ef','#f2f6fb'],sea:['#c9d3df','#aab8ca'],a:'#f2f5f9',b:'#e3e9f1',rail:'#3c5a8a',raild:'#27406a',
  line:'Amma: Prelims cleared! I lit a lamp for you this morning.'},
 {n:'Mains',k:'mains',boss:'titan',base:3,land:1,indoor:1,
  sky:['#fff3d6','#fffaf0'],sea:['#efe4c8','#ddcda4'],a:'#ffffff',b:'#f3f6ff',rail:'#c0283a',raild:'#8f1c2a',
  line:'Appa: Nine papers, one brave heart. Rest a little tonight.'},
 {n:'The Interview',k:'interview',boss:'panel',base:4,land:1,
  sky:['#ffae66','#ffe3b8'],sea:['#78b357','#4f8a3a'],a:'#dca46b',b:'#d0965c',rail:'#a8643a',raild:'#7a4424',hill:['rgba(200,140,90,.5)','rgba(170,110,70,.6)'],
  line:'Paati: Calm and honest. That is how we raised you.'},
 {n:'Academy Hills',k:'academy',boss:'warden',base:5,land:1,
  sky:['#78c3ff','#e3f5ff'],sea:['#64a06d','#3f7a52'],a:'#d3d9df',b:'#c3cbd3',rail:'#4d6b57',raild:'#2f4a38',hill:['rgba(150,180,215,.8)','rgba(90,140,120,.85)'],
  line:'Amma: Officer! Serve every family like ours.'},
 {n:'Chennai Shores',k:'chennai',boss:'sage',base:5,land:0,tn:1,
  sky:['#ffab73','#ffe8cc'],sea:['#36b8e8','#0a78bf'],a:'#f2ddb0',b:'#e8cf9c',rail:'#c0392b',raild:'#8e2a1f',hill:['rgba(255,190,150,.5)','rgba(240,150,120,.55)'],
  line:'Appa: Tamil Nadu will be proud. Now go serve your district.'}
];
ST.CH=CH;
// Story chapters up to STORY_OPEN, then the Exam Season replays the open chapters' scenery with harder questions.
const OPENL=()=>typeof STORY_OPEN==='function'?STORY_OPEN():24,OPENC=()=>Math.max(1,Math.min(CH.length,OPENL()/LV_PER_CH));
const chIdx=l=>{l=Math.max(1,l);const o=OPENL();return l<=o?Math.floor((l-1)/LV_PER_CH)%CH.length:Math.floor((l-o-1)/LV_PER_CH)%OPENC()};
const chOf=l=>CH[chIdx(l)];window.OPENL=OPENL;
ST.chOf=chOf;ST.chIdx=chIdx;
ST.isBossLevel=l=>l%LV_PER_CH===0;
window.storyIsBossLevel=ST.isBossLevel;

// ---------- hero stages ----------
const STAGES=[
 {n:'Schoolkid',shirt:'#ffffff',pants:'#1f3a7a',bag:'#2f6bff',glasses:false},
 {n:'Aspirant',shirt:'#f2b51f',pants:'#f4efe4',bag:'#7a4a2a',glasses:true},
 {n:'Prelims Ready',shirt:'#a9d0f2',pants:'#1f3a7a',bag:'#1f3a7a',glasses:false},
 {n:'Mains Writer',shirt:'#1d2f5e',pants:'#1d2f5e',bag:'#a07850',glasses:false},
 {n:'Interview Ready',shirt:'#efe4cc',pants:'#2a2a2a',bag:'#d8ccb2',glasses:false},
 {n:'Officer',shirt:'#1d2f5e',pants:'#1d2f5e',bag:'#1d2f5e',glasses:false}
];
ST.STAGES=STAGES;

// ---------- sprite cache ----------
const SPR={};
function sprite(key,w,h,fn){if(SPR[key])return SPR[key];const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.lineJoin='round';g.lineCap='round';fn(g,w,h);SPR[key]=c;return c}
ST.sprite=sprite;
function rrp(g,x,y,w,h,r){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,Math.max(0,r));else g.rect(x,y,w,h)}
ST.rrp=rrp;
const INK='rgba(20,33,61,.32)';
function fs(g,fill,lw){g.fillStyle=fill;g.fill();if(lw){g.lineWidth=lw*.55;g.strokeStyle=INK;g.stroke()}} /* soft outline: thin, translucent */
ST.fs=fs;
// draw a sprite anchored at feet (sx,sy) with world height hw (units) at projection scale s
function blit(c,sx,sy,s,hw,alpha){const hp=s*hw,wp=hp*c.width/c.height;if(hp<2)return;if(alpha!=null)ctx.globalAlpha=alpha;ctx.drawImage(c,sx-wp/2,sy-hp,wp,hp);if(alpha!=null)ctx.globalAlpha=1}
ST.blit=blit;

// ---------- person renderer (hero + family). Local units: feet at (0,0), height about 190 ----------
// o: {view:'front'|'back', pose:'stand'|'run'|'cheer', f:0..3, skin, hair:'curly'|'bun'|'grey'|'turban'|'short', outfit:{...}}
function person(g,o){
  const v=o.view||'front',sk=o.skin||'#c98d63',O=o.outfit,fr=o.f||0;
  const sw=o.pose==='run'?Math.sin(fr/4*6.283):0,lift=o.pose==='run'?Math.abs(Math.cos(fr/4*6.283))*6:0,cheer=o.pose==='cheer';
  g.save();g.translate(0,-lift);
  const lw=4;g.strokeStyle=INK;g.lineWidth=lw;
  // legs
  const leg=(sx,ph)=>{const fx=sx+(o.pose==='run'?ph*10:0),fy=o.pose==='run'?-Math.max(0,ph)*8:0;
    if(O.skirt)return;
    g.lineWidth=17;g.strokeStyle=INK;g.beginPath();g.moveTo(sx,-84);g.lineTo(fx,-10+fy);g.stroke();
    g.lineWidth=12;g.strokeStyle=O.shorts?sk:O.pants;g.beginPath();g.moveTo(sx,-84);g.lineTo(fx,-10+fy);g.stroke();
    if(O.shorts){g.strokeStyle=O.pants;g.lineWidth=13;g.beginPath();g.moveTo(sx,-86);g.lineTo(sx+(fx-sx)*.38,-58);g.stroke();g.strokeStyle='#fff';g.lineWidth=11;g.beginPath();g.moveTo(sx+(fx-sx)*.75,-26+fy*.7);g.lineTo(fx,-12+fy);g.stroke()}
    rrp(g,fx-9,-13+fy,19,11,5);fs(g,O.shoe||'#1b1b1b',3)};
  leg(-10,sw);leg(10,-sw);
  // lower garment for skirt / saree / dhoti
  if(O.skirt){g.beginPath();g.moveTo(-24,-92);g.quadraticCurveTo(-30,-40,-30,-6);g.lineTo(30,-6);g.quadraticCurveTo(30,-40,24,-92);g.closePath();fs(g,O.skirt,lw);
    if(O.border){g.fillStyle=O.border;g.fillRect(-29,-16,58,8)}
    rrp(g,-20,-8,14,8,4);fs(g,'#3a2a1a',2);rrp(g,6,-8,14,8,4);fs(g,'#3a2a1a',2)}
  // torso
  const tl=O.long?-58:-80;
  g.beginPath();g.moveTo(-23,-146);g.quadraticCurveTo(-28,-120,-24,tl);g.lineTo(24,tl);g.quadraticCurveTo(28,-120,23,-146);g.closePath();fs(g,O.top,lw);
  if(O.long){g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=2;g.beginPath();g.moveTo(-20,tl+2);g.lineTo(-20,tl-18);g.moveTo(20,tl+2);g.lineTo(20,tl-18);g.stroke()}
  if(v==='front'){
    if(O.jacket){ // blazer / suit
      g.beginPath();g.moveTo(-9,-146);g.lineTo(0,-108);g.lineTo(9,-146);g.closePath();fs(g,O.inner||'#ffffff',2);
      if(O.tie){g.beginPath();g.moveTo(-3,-142);g.lineTo(3,-142);g.lineTo(5,-112);g.lineTo(0,-104);g.lineTo(-5,-112);g.closePath();fs(g,O.tie,1.5)}
      g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=2;g.beginPath();g.moveTo(-10,-146);g.lineTo(-2,-106);g.moveTo(10,-146);g.lineTo(2,-106);g.stroke();
      g.fillStyle='#e8e8e8';g.fillRect(9,-126,9,3);if(O.pocket){g.fillStyle=O.pocket;g.beginPath();g.moveTo(10,-127);g.lineTo(14,-132);g.lineTo(18,-127);g.fill()}}
    if(O.band){ // bandhgala
      g.fillStyle=O.top;rrp(g,-8,-150,16,7,3);fs(g,O.top,2);g.fillStyle='#b89a5a';for(let i=0;i<5;i++){g.beginPath();g.arc(0,-140+i*11,2.2,0,6.283);g.fill()}
      g.fillStyle='#e05a7a';g.beginPath();g.moveTo(10,-127);g.lineTo(14,-132);g.lineTo(18,-127);g.fill()}
    if(O.collar){g.beginPath();g.moveTo(-10,-147);g.lineTo(0,-136);g.lineTo(10,-147);g.lineTo(6,-149);g.lineTo(0,-142);g.lineTo(-6,-149);g.closePath();fs(g,O.collar,2)}
    if(O.ntie){g.beginPath();g.moveTo(-3,-138);g.lineTo(3,-138);g.lineTo(4,-104);g.lineTo(0,-98);g.lineTo(-4,-104);g.closePath();fs(g,O.ntie,1.5);g.strokeStyle='#cfd8ff';g.lineWidth=2;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-3,-130+i*8);g.lineTo(3,-126+i*8);g.stroke()}}
    if(O.lanyard){g.strokeStyle='#2f6bff';g.lineWidth=3;g.beginPath();g.moveTo(-9,-146);g.lineTo(-3,-112);g.moveTo(9,-146);g.lineTo(3,-112);g.stroke();rrp(g,-7,-114,14,16,2);fs(g,'#ffffff',2);g.fillStyle='#2f6bff';g.fillRect(-4,-110,8,3)}
    if(O.kurtaBtn){g.fillStyle='#d99a10';for(let i=0;i<3;i++){g.beginPath();g.arc(0,-140+i*8,1.8,0,6.283);g.fill()}}
    if(O.belt){g.fillStyle='#2a1d14';g.fillRect(-24,-84,48,5);g.fillStyle='#c9a23a';g.fillRect(-3,-84,6,5)}
    if(O.strap){g.strokeStyle=O.strap;g.lineWidth=5;g.beginPath();g.moveTo(-20,-146);g.lineTo(22,-86);g.stroke()}
    if(O.packStraps){g.strokeStyle=O.packStraps;g.lineWidth=6;g.beginPath();g.moveTo(-17,-146);g.lineTo(-19,-100);g.moveTo(17,-146);g.lineTo(19,-100);g.stroke()}
    if(O.pallu){g.beginPath();g.moveTo(-22,-146);g.lineTo(-6,-146);g.lineTo(24,-96);g.lineTo(24,-82);g.lineTo(10,-84);g.closePath();fs(g,O.pallu,2);g.strokeStyle=O.border||'#e8b923';g.lineWidth=3;g.beginPath();g.moveTo(-6,-146);g.lineTo(24,-96);g.stroke()}
  }else{
    if(O.jacket){g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=2;g.beginPath();g.moveTo(0,-140);g.lineTo(0,tl+4);g.stroke()}
    if(O.pack){rrp(g,-21,-144,42,52,10);fs(g,O.pack,lw);rrp(g,-14,-118,28,16,5);fs(g,'rgba(255,255,255,.25)',0)}
    if(O.strap){g.strokeStyle=O.strap;g.lineWidth=5;g.beginPath();g.moveTo(20,-146);g.lineTo(-22,-86);g.stroke()}
    if(O.pallu){g.beginPath();g.moveTo(-6,-146);g.lineTo(22,-146);g.lineTo(26,-60);g.lineTo(4,-66);g.closePath();fs(g,O.pallu,2);g.strokeStyle=O.border||'#e8b923';g.lineWidth=3;g.beginPath();g.moveTo(26,-60);g.lineTo(4,-66);g.stroke()}
  }
  // arms
  const arm=(sg,ph)=>{const sx=sg*24,sy=-140;let hx,hy;
    if(cheer){hx=sg*34;hy=-196+((fr+(sg>0?2:0))%4<2?0:10)}else if(o.pose==='run'){hx=sg*30+ph*-4;hy=-96-ph*16}else if(o.hug){hx=sg*10;hy=-112}else{hx=sg*30;hy=-88}
    g.lineWidth=15;g.strokeStyle=INK;g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(sg*34,(sy+hy)/2,hx,hy);g.stroke();
    g.lineWidth=10;g.strokeStyle=O.sleeve||O.top;g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(sg*34,(sy+hy)/2,hx,hy);g.stroke();
    if(O.short){g.lineWidth=9;g.strokeStyle=sk;g.beginPath();const mx=sx+(hx-sx)*.45,my=sy+(hy-sy)*.45;g.moveTo(mx,my);g.lineTo(hx,hy);g.stroke()}
    g.beginPath();g.arc(hx,hy,6,0,6.283);fs(g,sk,2.5);
    return[hx,hy]};
  const hl=arm(-1,sw),hr2=arm(1,-sw);
  if(v==='front'&&!cheer&&o.pose!=='run'){ // props in hand
    if(O.book){rrp(g,hl[0]-10,hl[1]-12,16,22,2);fs(g,O.book,2)}
    if(O.bottle){rrp(g,hr2[0]-4,hr2[1]-20,8,24,3);fs(g,'#b8c2cc',2)}}
  // neck + head
  rrp(g,-6,-154,12,10,3);fs(g,sk,0);
  const hy=-172,R=19;
  g.beginPath();g.ellipse(0,hy,R*.92,R,0,0,6.283);fs(g,sk,lw);
  // ears
  g.beginPath();g.ellipse(-R*.92,hy+2,4,6,0,0,6.283);fs(g,sk,2);g.beginPath();g.ellipse(R*.92,hy+2,4,6,0,0,6.283);fs(g,sk,2);
  const hairC=o.hair==='grey'?'#d9d9d9':'#1b1410';
  if(o.hair==='turban'&&v==='back'){g.beginPath();g.ellipse(0,hy-10,R*1.05,R*.75,0,Math.PI,6.283);g.lineTo(R,hy-6);g.closePath();fs(g,o.turban||'#f08a24',3);g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=2;g.beginPath();g.moveTo(-R,hy-10);g.quadraticCurveTo(0,hy-24,R,hy-14);g.stroke()}
  else if(v==='back'){g.beginPath();g.ellipse(0,hy-2,R*.98,R*.95,0,0,6.283);fs(g,hairC,0);
    if(o.hair==='curly')for(let i=0;i<7;i++){g.beginPath();g.arc(-15+i*5,hy-17+Math.sin(i)*3,6,0,6.283);g.fill()}
    if(o.hair==='bun'||o.hair==='grey'){g.beginPath();g.arc(0,hy+12,8,0,6.283);fs(g,hairC,2)}}
  else{if(o.hair!=='turban'){g.fillStyle=hairC;g.beginPath();g.ellipse(0,hy-8,R*.98,R*.72,0,Math.PI*1.02,Math.PI*1.98);g.fill()}
    if(o.hair==='curly')for(let i=0;i<7;i++){g.beginPath();g.arc(-15+i*5,hy-18+Math.sin(i*1.7)*3,6.5,0,6.283);g.fill()}
    if(o.hair==='bun'||o.hair==='grey'){g.beginPath();g.arc(0,hy-20,8,0,6.283);g.fill();g.fillRect(-R*.95,hy-10,R*1.9,5)}
    if(o.hair==='short'){g.fillRect(-R*.9,hy-12,R*1.8,6)}
    // face
    const ex=7,ey=hy+1;g.fillStyle='#1b1410';g.beginPath();g.ellipse(-ex,ey,2.6,3.4,0,0,6.283);g.ellipse(ex,ey,2.6,3.4,0,0,6.283);g.fill();
    g.strokeStyle='#1b1410';g.lineWidth=2;g.beginPath();g.moveTo(-ex-4,ey-7);g.lineTo(-ex+3,ey-8);g.moveTo(ex-3,ey-8);g.lineTo(ex+4,ey-7);g.stroke();
    g.strokeStyle='#7a2a20';g.lineWidth=2.4;g.beginPath();g.arc(0,hy+8,cheer||o.smile?6:4.5,.25,Math.PI-.25);g.stroke();
    if(o.bindi){g.fillStyle='#d01f3c';g.beginPath();g.arc(0,hy-7,2,0,6.283);g.fill()}
    if(o.moustache){g.fillStyle='#1b1410';g.beginPath();g.ellipse(-4,hy+5,5,2,.2,0,6.283);g.ellipse(4,hy+5,5,2,-.2,0,6.283);g.fill()}
    if(o.glasses||O.glasses){g.strokeStyle='#111';g.lineWidth=2.2;g.beginPath();g.arc(-ex,ey,6,0,6.283);g.moveTo(ex+6,ey);g.arc(ex,ey,6,0,6.283);g.moveTo(-ex+6,ey);g.lineTo(ex-6,ey);g.stroke()}
    g.fillStyle='rgba(255,120,120,.25)';g.beginPath();g.arc(-11,hy+6,3.5,0,6.283);g.arc(11,hy+6,3.5,0,6.283);g.fill();
    if(o.hair==='turban'){g.beginPath();g.ellipse(0,hy-10,R*1.05,R*.75,0,Math.PI,6.283);g.lineTo(R,hy-6);g.closePath();fs(g,o.turban||'#f08a24',3);g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=2;g.beginPath();g.moveTo(-R,hy-10);g.quadraticCurveTo(0,hy-24,R,hy-14);g.stroke()}}
  g.restore();
}
ST.person=person;
const HERO_OUT=[
 {top:'#ffffff',short:1,shorts:1,pants:'#1f3a7a',ntie:'#2a4a9a',collar:'#ffffff',packStraps:'#2f6bff',pack:'#2f6bff',shoe:'#151515'},
 {top:'#f2b51f',long:1,pants:'#f4efe4',strap:'#6b3f1f',kurtaBtn:1,glasses:1,bottle:1,shoe:'#6b3f1f'},
 {top:'#a9d0f2',pants:'#1f3a7a',belt:1,lanyard:1,book:'#1f3a7a',collar:'#a9d0f2'},
 {top:'#1d2f5e',jacket:1,inner:'#ffffff',pants:'#1d2f5e',book:'#c9a46a',long:0},
 {top:'#efe4cc',band:1,pants:'#2a2a2a',long:1},
 {top:'#1d2f5e',jacket:1,inner:'#ffffff',tie:'#16224a',pocket:'#9fb3d9',pants:'#1d2f5e'}
];
ST.HERO_OUT=HERO_OUT;
function heroSprite(stage,view,pose,f){return sprite(`hero${stage}${view}${pose}${f}`,120,230,(g)=>{g.translate(60,224);person(g,{view,pose,f,skin:'#c98d63',hair:'curly',outfit:HERO_OUT[stage]})})}
ST.heroSprite=heroSprite;
// family
const FAM={
 amma:{skin:'#b97a52',hair:'bun',bindi:1,outfit:{top:'#7b3fa0',skirt:'#7b3fa0',pallu:'#8e4bb5',border:'#f0c330',sleeve:'#7b3fa0',short:1}},
 appa:{skin:'#a86d47',hair:'turban',turban:'#f08a24',moustache:1,outfit:{top:'#f3ead8',long:1,pants:'#f7f2e6',sleeve:'#f3ead8'}},
 paati:{skin:'#b47a55',hair:'grey',glasses:1,bindi:1,outfit:{top:'#2e9a5a',skirt:'#2e9a5a',pallu:'#3cb06a',border:'#e8b923',sleeve:'#2e9a5a',short:1}}
};
function famSprite(who,f){return sprite('fam'+who+f,120,230,g=>{g.translate(60,224);const d=FAM[who];person(g,Object.assign({view:'front',pose:'cheer',f},d))})}
ST.famSprite=famSprite;
})();

(function(){
'use strict';
const ST=window.STORY,{sprite,rrp,fs,blit}=ST,INK='rgba(20,33,61,.32)';
const FONT='"Lilita One","Arial Black",sans-serif';
function T(g,t,x,y,size,fill,stroke){g.font=`${size}px ${FONT}`;g.textAlign='center';g.textBaseline='middle';if(stroke){g.lineWidth=Math.max(2,size*.18);g.strokeStyle=stroke;g.strokeText(t,x,y)}g.fillStyle=fill;g.fillText(t,x,y)}
ST.T=T;
// which chapter is on screen
ST.cur=()=>{if(typeof S!=='undefined'&&S&&S.story)return S.story.ch;return ST.CH[ST.chIdx(typeof level!=='undefined'?level:1)]};
window.storyTR=()=>{if(typeof S!=='undefined'&&S&&!S.story)return null;return ST.cur()};
// ---------- far backdrops (prerendered, 800 x 300, bottom = horizon) ----------
const BW=800,BH=300;
function hills(g,y0,amp,col,seed,n){g.fillStyle=col;g.beginPath();g.moveTo(0,BH);for(let x=0;x<=BW;x+=10){g.lineTo(x,y0-amp*(.5+.5*Math.sin(x/BW*n*6.283+seed))*(.7+.3*Math.sin(x*.031+seed*3)))}g.lineTo(BW,BH);g.closePath();g.fill()}
function palmS(g,x,y,h,col){g.strokeStyle=col;g.lineWidth=h*.06;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+h*.12,y-h*.5,x+h*.05,y-h);g.stroke();g.fillStyle=col;for(let i=0;i<6;i++){const a=-Math.PI/2+(i-2.5)*.55;g.beginPath();g.ellipse(x+h*.05+Math.cos(a)*h*.22,y-h+Math.sin(a)*h*.12+h*.06,h*.24,h*.05,a,0,6.283);g.fill()}}
function pineS(g,x,y,h,col){g.fillStyle=col;for(let i=0;i<3;i++){const yy=y-h*.25-i*h*.25,w=h*(.38-i*.09);g.beginPath();g.moveTo(x-w,yy+h*.12);g.lineTo(x,yy-h*.3);g.lineTo(x+w,yy+h*.12);g.closePath();g.fill()}g.fillRect(x-h*.04,y-h*.2,h*.08,h*.2)}
const BACK={
 village(g){hills(g,190,110,'#9ed6a0',1,1.3);hills(g,230,80,'#6fbf6a',2,2.1);
  for(let i=0;i<9;i++)palmS(g,40+i*92+(i%2)*30,262-(i%3)*8,70+(i%3)*18,'#3f8f4a');
  for(let i=0;i<6;i++){const x=70+i*130,y=278;g.fillStyle='#fff3e0';g.fillRect(x,y-26,44,26);g.fillStyle=['#d9573b','#3b7dd8','#d9573b'][i%3];g.beginPath();g.moveTo(x-6,y-26);g.lineTo(x+22,y-46);g.lineTo(x+50,y-26);g.closePath();g.fill();g.fillStyle='#6b4520';g.fillRect(x+17,y-14,10,14)}
  g.fillStyle='#e8b923';g.beginPath();g.moveTo(612,252);g.lineTo(624,200);g.lineTo(636,252);g.fill();g.fillStyle='#c9861a';for(let k=0;k<4;k++)g.fillRect(614+k*2,214+k*10,20-k*4,3)},
 coaching(g){hills(g,170,60,'rgba(120,70,110,.45)',1,1);
  const hc=['#ff5a5f','#2f6bff','#16a34a','#f59e0b','#8a5cff','#0ea5e9'],words=['NOTES','MOCK TESTS','PG ROOMS','CHAI','LIBRARY','IAS NOTES'];
  for(let i=0;i<9;i++){const x=i*92-10,w=86,h=150+((i*37)%70),y=BH-h;g.fillStyle=['#d9c2a8','#c7b39b','#e6d5bf','#bfa58a'][i%4];g.fillRect(x,y,w,h);g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=2;g.strokeRect(x,y,w,h);
   g.fillStyle='rgba(255,230,160,.9)';for(let r=0;r<Math.floor(h/34)-1;r++)for(let c=0;c<3;c++)if((r+c+i)%3)g.fillRect(x+10+c*26,y+46+r*34,14,16);
   g.fillStyle=hc[i%6];g.fillRect(x+4,y+8,w-8,26);T(g,words[i%6],x+w/2,y+21,15,'#fff')}
  g.strokeStyle='rgba(60,40,40,.6)';g.lineWidth=1.5;g.beginPath();for(let x=0;x<=BW;x+=4)g.lineTo(x,150+Math.sin(x/BW*12.56)*14);g.stroke();
  for(let x=10;x<BW;x+=22){g.fillStyle=['#ffd23f','#ff8a1f','#ff4da6','#3ddc84'][(x/22|0)%4];g.beginPath();g.arc(x,152+Math.sin(x/BW*12.56)*14,4,0,6.283);g.fill()}},
 library(g){g.fillStyle='#5a3620';g.fillRect(0,0,BW,BH);
  for(let a=0;a<3;a++){const x=130+a*270;g.fillStyle='#fde8b5';g.beginPath();g.moveTo(x-40,190);g.lineTo(x-40,90);g.arc(x,90,40,Math.PI,0);g.lineTo(x+40,190);g.closePath();g.fill();g.strokeStyle='#3e2414';g.lineWidth=6;g.stroke();g.beginPath();g.moveTo(x,50);g.lineTo(x,190);g.moveTo(x-40,120);g.lineTo(x+40,120);g.stroke()}
  for(let s=0;s<4;s++){const x0=s*200+(s<2?-10:20)+(s%2?0:0);if(s===0||s===3||true){}}
  for(let b=0;b<4;b++){const sx=[0,215,485,700][b],sw=100;g.fillStyle='#4a2a16';g.fillRect(sx,40,sw,BH-40);for(let r=0;r<6;r++){const y=60+r*40;g.fillStyle='#2e1a0e';g.fillRect(sx+6,y,sw-12,34);for(let k=0;k<9;k++){g.fillStyle=['#c0392b','#2f6bff','#16a34a','#e8b923','#8a5cff','#f5f0e6'][(k+r+b)%6];g.fillRect(sx+8+k*10,y+4+(k%3),8,30-(k%3))}}}
  for(let l=0;l<4;l++){const x=110+l*190;g.strokeStyle='#2e1a0e';g.lineWidth=2;g.beginPath();g.moveTo(x,0);g.lineTo(x,40);g.stroke();g.fillStyle='#e8b923';g.beginPath();g.moveTo(x-16,52);g.lineTo(x-8,38);g.lineTo(x+8,38);g.lineTo(x+16,52);g.closePath();g.fill();g.fillStyle='rgba(255,236,170,.35)';g.beginPath();g.moveTo(x-16,52);g.lineTo(x-50,140);g.lineTo(x+50,140);g.lineTo(x+16,52);g.fill()}},
 exam(g){g.fillStyle='#e9eef5';g.fillRect(0,0,BW,BH);g.fillStyle='#c9d4e2';g.fillRect(0,230,BW,70);
  for(let w=0;w<4;w++){const x=40+w*200;g.fillStyle='#bfe3ff';g.fillRect(x,60,110,120);g.strokeStyle='#5d7392';g.lineWidth=6;g.strokeRect(x,60,110,120);g.beginPath();g.moveTo(x+55,60);g.lineTo(x+55,180);g.moveTo(x,120);g.lineTo(x+110,120);g.stroke()}
  g.fillStyle='#fff';g.beginPath();g.arc(400,46,30,0,6.283);g.fill();g.strokeStyle=INK;g.lineWidth=5;g.stroke();g.beginPath();g.moveTo(400,46);g.lineTo(400,26);g.moveTo(400,46);g.lineTo(414,52);g.stroke();
  g.fillStyle='#1f6f43';rrp(g,300,190,200,40,6);g.fill();T(g,'SILENCE PLEASE',400,211,20,'#fff');
  for(let f=0;f<3;f++){const x=160+f*240;g.strokeStyle='#5d7392';g.lineWidth=3;g.beginPath();g.moveTo(x,0);g.lineTo(x,14);g.stroke();g.fillStyle='#8a9bb5';for(let k=0;k<3;k++){g.save();g.translate(x,18);g.rotate(k*2.094);g.beginPath();g.ellipse(22,0,22,5,0,0,6.283);g.fill();g.restore()}}},
 mains(g){g.fillStyle='#fff8e6';g.fillRect(0,0,BW,BH);g.strokeStyle='rgba(80,120,200,.25)';g.lineWidth=2;for(let y=20;y<BH;y+=22){g.beginPath();g.moveTo(0,y);g.lineTo(BW,y);g.stroke()}g.strokeStyle='rgba(220,60,60,.4)';g.beginPath();g.moveTo(60,0);g.lineTo(60,BH);g.stroke();
  for(let s=0;s<6;s++){const x=30+s*135,h=110+(s*53%90);for(let k=0;k<h/6;k++){g.fillStyle=k%2?'#ffffff':'#ece6d6';g.fillRect(x+Math.sin(k+s)*4,BH-k*6-6,96,6)}g.fillStyle='#c0283a';g.fillRect(x+40,BH-h-6,8,h+6)}
  g.save();g.translate(690,120);g.rotate(.5);g.fillStyle='#2f6bff';rrp(g,-12,-110,24,190,8);g.fill();g.fillStyle='#c9d4e2';g.beginPath();g.moveTo(-12,80);g.lineTo(0,112);g.lineTo(12,80);g.fill();g.restore()},
 interview(g){hills(g,200,40,'rgba(230,170,110,.5)',2,1);
  g.fillStyle='#d9a066';g.fillRect(220,150,360,130);g.fillStyle='#c98f58';for(let a=0;a<7;a++){const x=240+a*48;g.beginPath();g.moveTo(x,280);g.lineTo(x,210);g.arc(x+16,210,16,Math.PI,0);g.lineTo(x+32,280);g.closePath();g.fill()}
  g.fillStyle='#e3b07a';g.fillRect(200,140,400,14);g.fillStyle='#d9a066';g.beginPath();g.arc(400,140,62,Math.PI,0);g.fill();g.fillStyle='#e8bb86';g.fillRect(340,132,120,10);
  g.fillStyle='#c98f58';g.fillRect(396,60,8,20);g.beginPath();g.arc(400,58,6,0,6.283);g.fill();
  for(const x of [250,550]){g.fillStyle='#d9a066';g.fillRect(x-24,120,48,30);g.beginPath();g.arc(x,120,24,Math.PI,0);g.fill()}
  g.fillStyle='#3f7a35';for(let x=0;x<BW;x+=40){g.beginPath();g.ellipse(x+20,284,26,16,0,0,6.283);g.fill()}},
 academy(g){g.fillStyle='#b9cde6';g.beginPath();g.moveTo(0,200);const pk=[[90,70],[230,120],[380,40],[540,110],[680,60],[800,140]];let px=0;for(const[x,y]of pk){g.lineTo(x,y);px=x}g.lineTo(BW,BH);g.lineTo(0,BH);g.closePath();g.fill();
  g.fillStyle='#ffffff';for(const[x,y]of pk){g.beginPath();g.moveTo(x-28,y+30);g.lineTo(x,y);g.lineTo(x+28,y+30);g.lineTo(x+10,y+22);g.lineTo(x,y+32);g.lineTo(x-12,y+22);g.closePath();g.fill()}
  hills(g,240,70,'#5f9070',3,1.8);for(let i=0;i<16;i++)pineS(g,20+i*52,290-(i%3)*10,60+(i%4)*10,'#2f5d42');
  for(let c=0;c<3;c++){const x=160+c*230,y=262;g.fillStyle='#f4efe6';g.fillRect(x,y-30,60,30);g.fillStyle='#7a3b2e';g.beginPath();g.moveTo(x-8,y-30);g.lineTo(x+30,y-52);g.lineTo(x+68,y-30);g.fill()}
  g.fillStyle='rgba(255,255,255,.35)';g.fillRect(0,230,BW,30)},
 chennai(g){g.fillStyle='#ffd08a';g.beginPath();g.arc(560,210,46,0,6.283);g.fill();g.fillStyle='rgba(255,200,120,.35)';g.beginPath();g.arc(560,210,80,0,6.283);g.fill();
  g.fillStyle='#2a9fd4';g.fillRect(0,236,BW,64);g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=2;for(let y=244;y<300;y+=12){g.beginPath();for(let x=0;x<=BW;x+=8)g.lineTo(x,y+Math.sin(x*.05+y)*2);g.stroke()}
  // gopuram silhouette (generic)
  g.fillStyle='#c98f58';const gx=150;for(let k=0;k<6;k++){const w=110-k*16;g.fillRect(gx-w/2,236-k*18-18,w,18)}g.fillStyle='#e8b923';g.beginPath();g.arc(gx,236-6*18-6,8,0,6.283);g.fill();
  // lighthouse
  const lx=700;for(let k=0;k<6;k++){g.fillStyle=k%2?'#ffffff':'#d33c2c';g.beginPath();g.moveTo(lx-18+k*1.5,236-k*24);g.lineTo(lx+18-k*1.5,236-k*24);g.lineTo(lx+16.5-k*1.5,236-(k+1)*24);g.lineTo(lx-16.5+k*1.5,236-(k+1)*24);g.fill()}
  g.fillStyle='#14213d';g.fillRect(lx-12,76,24,16);g.fillStyle='#ffd23f';g.fillRect(lx-9,79,18,10);
  for(let i=0;i<5;i++)palmS(g,280+i*70,240,60+i%2*14,'#2f6d3a')}
};
function backdrop(k){return sprite('bd'+k,BW,BH,g=>BACK[k](g))}
window.storyScenery=function(d){const C=ST.cur();if(!C)return false;
  if(!window.__lowQ&&!C.indoor){const sx=W*.8,sy=HOR*.28,sr=Math.min(W,H)*.055;ctx.fillStyle='rgba(255,252,225,.9)';ctx.beginPath();ctx.arc(sx,sy,sr,0,6.283);ctx.fill()}
  const c=backdrop(C.k),dw=W*1.35,dh=dw*BH/BW*(C.indoor?1.25:1),sh=-((typeof camX!=='undefined'?camX:0)*12)%(W*.2);
  ctx.drawImage(c,(W-dw)/2+sh,HOR-dh+2,dw,dh);
  if(C.indoor&&dh<HOR){ctx.fillStyle=C.sky[0];ctx.fillRect(0,0,W,HOR-dh+2)}
  // side strips along the road (fields, pavement, sand)
  const side=C.side||{village:['#7fc35a','#73b851'],coaching:['#8d8680','#827b75'],library:['#6b3f22','#5f381e'],exam:['#c3cddb','#b8c3d3'],mains:['#efe6cc','#e6dcc0'],interview:['#79b45a','#6ea851'],academy:['#679f6f','#5d9466'],chennai:['#f0d9a8','#e8cf98']}[C.k];
  const z0=Math.floor(camZ/4)*4;for(let z=z0;z<camZ+95;z+=4){const a=Math.max(z,camZ+.45),b=z+4;const col=side[(z/4|0)&1];
    quad(P(-(C.k==='chennai'?6:30),0,b),P(-2.35,0,b),P(-2.35,0,a),P(-(C.k==='chennai'?6:30),0,a),col);quad(P(2.35,0,b),P(C.k==='chennai'?6:30,0,b),P(C.k==='chennai'?6:30,0,a),P(2.35,0,a),col)}
  return true};
// ---------- roadside props ----------
const PROPS={
 hut:[2.3,160,150,g=>{g.translate(80,148);rrp(g,-56,-70,112,70,4);fs(g,'#fff3e0',4);g.beginPath();g.moveTo(-74,-66);g.lineTo(0,-130);g.lineTo(74,-66);g.closePath();fs(g,'#d9573b',4);for(let i=0;i<4;i++){g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=2;g.beginPath();g.moveTo(-60+i*10,-74-i*12);g.lineTo(60-i*10,-74-i*12);g.stroke()}rrp(g,-14,-44,28,44,4);fs(g,'#7a4a2a',3);rrp(g,24,-50,22,20,3);fs(g,'#7fd0ff',3)}],
 palm:[4,140,260,g=>{g.translate(70,256);g.strokeStyle=INK;g.lineWidth=14;g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(18,-110,8,-200);g.stroke();g.strokeStyle='#a0703c';g.lineWidth=9;g.stroke();for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*.5;g.save();g.translate(8,-200);g.rotate(a);g.beginPath();g.ellipse(46,0,48,11,0,0,6.283);fs(g,i%2?'#3f9a4a':'#4fb35a',3);g.restore()}g.beginPath();g.arc(2,-192,9,0,6.283);g.arc(16,-190,9,0,6.283);fs(g,'#8a5a2b',2)}],
 banyan:[4.4,240,260,g=>{g.translate(120,256);rrp(g,-18,-130,36,130,8);fs(g,'#8a5a2b',4);g.strokeStyle='#7a4a24';g.lineWidth=3;for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*26,-120);g.lineTo(i*28,-20);g.stroke()}for(const[x,y,r]of[[-60,-150,56],[60,-150,56],[0,-190,64],[-90,-120,40],[90,-120,40]]){g.beginPath();g.arc(x,y,r,0,6.283);fs(g,'#3f8f3a',4)}for(const[x,y,r]of[[-30,-190,24],[40,-170,20]]){g.beginPath();g.arc(x,y,r,0,6.283);fs(g,'#58ad4c',0)}}],
 hay:[1.2,140,100,g=>{g.translate(70,96);g.beginPath();g.ellipse(0,-40,58,42,0,Math.PI,0);g.lineTo(58,0);g.lineTo(-58,0);g.closePath();fs(g,'#e8c25a',4);g.strokeStyle='#c99a2e';g.lineWidth=2;for(let i=-4;i<=4;i++){g.beginPath();g.moveTo(i*12,-6);g.lineTo(i*10,-60);g.stroke()}}],
 marigold:[.9,140,90,g=>{g.translate(70,86);g.beginPath();g.ellipse(0,-26,60,28,0,0,6.283);fs(g,'#3f8f3a',4);for(let i=0;i<9;i++){g.beginPath();g.arc(-44+i*11,-36+Math.sin(i*2)*10,8,0,6.283);fs(g,i%2?'#ff9f1a':'#ffd23f',2)}}],
 chaiStall:[2.4,180,170,g=>{g.translate(90,166);rrp(g,-70,-70,140,70,4);fs(g,'#b5651d',4);rrp(g,-80,-120,160,26,6);fs(g,'#ffcc33',4);T(g,'CHAI',0,-106,20,'#c0392b');g.strokeStyle=INK;g.lineWidth=4;g.beginPath();g.moveTo(-70,-94);g.lineTo(-70,-70);g.moveTo(70,-94);g.lineTo(70,-70);g.stroke();for(let i=0;i<4;i++){rrp(g,-50+i*28,-86,16,16,4);fs(g,'#fff',2);g.fillStyle='#a0612a';g.fillRect(-48+i*28,-82,12,6)}g.beginPath();g.ellipse(46,-80,14,8,0,0,6.283);fs(g,'#9aa3ad',3)}],
 lamp:[3.2,80,220,g=>{g.translate(40,216);g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.moveTo(0,0);g.lineTo(0,-180);g.quadraticCurveTo(0,-198,18,-198);g.stroke();g.strokeStyle='#3a3a46';g.lineWidth=5;g.stroke();g.beginPath();g.ellipse(22,-192,14,8,0,0,6.283);fs(g,'#ffe08a',3);g.fillStyle='rgba(255,230,140,.25)';g.beginPath();g.arc(22,-186,26,0,6.283);g.fill()}],
 xerox:[2.2,170,150,g=>{g.translate(85,146);rrp(g,-70,-110,140,110,4);fs(g,'#9ec9e6',4);rrp(g,-74,-130,148,30,4);fs(g,'#2f6bff',4);T(g,'PHOTOCOPY',0,-115,17,'#fff');rrp(g,-50,-76,100,60,4);fs(g,'#f4f7fb',3);for(let i=0;i<5;i++){g.fillStyle='#c9d4e2';g.fillRect(-40,-68+i*10,80,5)}}],
 shelf:[3.4,170,240,g=>{g.translate(85,236);rrp(g,-78,-226,156,226,4);fs(g,'#5a3620',4);for(let r=0;r<5;r++){const y=-214+r*44;rrp(g,-68,y,136,38,2);fs(g,'#2e1a0e',0);for(let k=0;k<11;k++){g.fillStyle=['#c0392b','#2f6bff','#16a34a','#e8b923','#8a5cff','#f5f0e6'][(k*3+r)%6];g.fillRect(-66+k*12,y+3+(k%3)*2,10,35-(k%3)*2)}}}],
 readDesk:[1.7,200,140,g=>{g.translate(100,136);rrp(g,-90,-70,180,18,4);fs(g,'#8a5a2b',4);g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.moveTo(-76,-52);g.lineTo(-76,0);g.moveTo(76,-52);g.lineTo(76,0);g.stroke();rrp(g,-60,-84,44,14,2);fs(g,'#f5f0e6',3);rrp(g,-10,-90,36,20,2);fs(g,'#2f6bff',3);g.strokeStyle=INK;g.lineWidth=4;g.beginPath();g.moveTo(54,-70);g.lineTo(54,-110);g.lineTo(40,-122);g.stroke();g.beginPath();g.moveTo(26,-112);g.lineTo(54,-132);g.lineTo(60,-118);g.closePath();fs(g,'#16a34a',3)}],
 globe:[1.6,110,150,g=>{g.translate(55,146);g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.moveTo(-26,0);g.lineTo(26,0);g.moveTo(0,0);g.lineTo(0,-40);g.stroke();g.beginPath();g.arc(0,-84,40,0,6.283);fs(g,'#4fb3ff',4);g.fillStyle='#4caf50';g.beginPath();g.ellipse(-12,-94,16,12,.4,0,6.283);g.ellipse(14,-70,12,16,-.3,0,6.283);g.fill();g.strokeStyle='#c9a23a';g.lineWidth=4;g.beginPath();g.arc(0,-84,48,-1.9,1.9,true);g.stroke()}],
 examDesk:[1.4,200,130,g=>{g.translate(100,126);rrp(g,-84,-66,168,16,3);fs(g,'#c99a6a',4);g.strokeStyle='#5d6b80';g.lineWidth=6;g.beginPath();g.moveTo(-70,-50);g.lineTo(-70,0);g.moveTo(70,-50);g.lineTo(70,0);g.stroke();rrp(g,-40,-76,56,12,2);fs(g,'#fff',2.5);g.fillStyle='#2f6bff';for(let i=0;i<4;i++){g.beginPath();g.arc(-32+i*12,-70,3,0,6.283);g.fill()}rrp(g,-80,-24,160,10,3);fs(g,'#a77b4f',3)}],
 cooler:[1.7,100,160,g=>{g.translate(50,156);rrp(g,-30,-110,60,110,6);fs(g,'#e9eef5',4);rrp(g,-24,-150,48,44,14);fs(g,'#7fd0ff',4);rrp(g,-8,-70,16,8,3);fs(g,'#2f6bff',2)}],
 plant:[1.4,100,140,g=>{g.translate(50,136);g.beginPath();g.moveTo(-22,0);g.lineTo(-28,-40);g.lineTo(28,-40);g.lineTo(22,0);g.closePath();fs(g,'#c0603a',4);for(let i=0;i<6;i++){g.save();g.translate(0,-40);g.rotate(-1.4+i*.55);g.beginPath();g.ellipse(0,-34,10,34,0,0,6.283);fs(g,'#2f9a4a',3);g.restore()}}],
 paper:[2.6,170,190,g=>{g.translate(85,186);for(let k=0;k<26;k++){rrp(g,-66+Math.sin(k*1.3)*5,-8-k*6.4,132,7,1);fs(g,k%2?'#ffffff':'#ece6d6',1.5)}g.fillStyle='#c0283a';g.fillRect(-6,-176,12,176)}],
 pen:[3.6,90,260,g=>{g.translate(45,256);rrp(g,-16,-236,32,190,10);fs(g,'#2f6bff',4);rrp(g,-16,-236,32,26,10);fs(g,'#1d2f5e',4);g.beginPath();g.moveTo(-16,-46);g.lineTo(0,0);g.lineTo(16,-46);g.closePath();fs(g,'#c9d4e2',4);g.fillStyle='#e8b923';g.fillRect(10,-226,6,70)}],
 ink:[1.3,110,110,g=>{g.translate(55,106);rrp(g,-34,-70,68,70,10);fs(g,'#1d2f5e',4);rrp(g,-18,-92,36,24,4);fs(g,'#14213d',3);rrp(g,-24,-50,48,22,3);fs(g,'#fff',2);T(g,'INK',0,-39,13,'#1d2f5e')}],
 hedge:[1,200,90,g=>{g.translate(100,86);rrp(g,-90,-60,180,60,26);fs(g,'#3f7a35',4);for(let i=0;i<6;i++){g.beginPath();g.arc(-70+i*28,-58,16,0,6.283);fs(g,'#4f8f42',0)}}],
 sandLamp:[3,90,220,g=>{g.translate(45,216);rrp(g,-12,-170,24,170,4);fs(g,'#d9a066',4);rrp(g,-22,-24,44,24,4);fs(g,'#c98f58',4);rrp(g,-18,-200,36,34,8);fs(g,'#ffe08a',4);g.beginPath();g.moveTo(-22,-200);g.lineTo(0,-220);g.lineTo(22,-200);g.closePath();fs(g,'#c98f58',4)}],
 chhatri:[3.4,200,250,g=>{g.translate(100,246);rrp(g,-80,-24,160,24,3);fs(g,'#c98f58',4);for(const x of[-64,64,-22,22]){rrp(g,x-7,-150,14,128,3);fs(g,'#e3b07a',3)}rrp(g,-84,-166,168,18,3);fs(g,'#d9a066',4);g.beginPath();g.ellipse(0,-166,70,56,0,Math.PI,0);g.closePath();fs(g,'#e8bb86',4);g.beginPath();g.arc(0,-226,8,0,6.283);fs(g,'#e8b923',3)}],
 fountain:[1.8,200,160,g=>{g.translate(100,156);g.beginPath();g.ellipse(0,-20,90,24,0,0,6.283);fs(g,'#d9a066',4);g.beginPath();g.ellipse(0,-26,74,16,0,0,6.283);fs(g,'#5fc6f0',0);rrp(g,-10,-90,20,66,4);fs(g,'#e3b07a',3);g.strokeStyle='#bfe9ff';g.lineWidth=5;for(const s of[-1,1]){g.beginPath();g.moveTo(0,-92);g.quadraticCurveTo(s*40,-130,s*56,-34);g.stroke()}}],
 pine:[4.4,150,260,g=>{g.translate(75,256);rrp(g,-9,-40,18,40,3);fs(g,'#6b4520',3);for(let i=0;i<4;i++){const y=-40-i*50,w=70-i*14;g.beginPath();g.moveTo(-w,y);g.lineTo(0,y-80);g.lineTo(w,y);g.closePath();fs(g,i%2?'#2f6d4a':'#3a805a',4)}g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.moveTo(-10,-220);g.lineTo(0,-236);g.lineTo(10,-220);g.fill()}],
 cottage:[3,200,190,g=>{g.translate(100,186);rrp(g,-76,-90,152,90,4);fs(g,'#f4efe6',4);g.beginPath();g.moveTo(-90,-86);g.lineTo(0,-160);g.lineTo(90,-86);g.closePath();fs(g,'#7a3b2e',4);rrp(g,-14,-56,28,56,3);fs(g,'#5b3a24',3);for(const x of[-50,36]){rrp(g,x,-70,24,24,3);fs(g,'#9ec9e6',3)}rrp(g,40,-176,16,40,2);fs(g,'#7a3b2e',3)}],
 bench:[1,180,90,g=>{g.translate(90,86);rrp(g,-80,-46,160,14,4);fs(g,'#8a5a2b',4);rrp(g,-80,-74,160,12,4);fs(g,'#8a5a2b',4);g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.moveTo(-66,-32);g.lineTo(-66,0);g.moveTo(66,-32);g.lineTo(66,0);g.stroke()}],
 auto:[1.9,200,170,g=>{g.translate(100,160);g.beginPath();g.moveTo(-80,-30);g.lineTo(-74,-110);g.quadraticCurveTo(-20,-140,60,-112);g.lineTo(84,-30);g.closePath();fs(g,'#1d1d1d',4);g.beginPath();g.moveTo(-74,-60);g.lineTo(-70,-108);g.quadraticCurveTo(-20,-132,56,-108);g.lineTo(78,-60);g.closePath();fs(g,'#ffd23f',0);rrp(g,-84,-62,168,40,10);fs(g,'#2f9a4a',4);rrp(g,-30,-100,60,30,6);fs(g,'#bfe9ff',3);for(const x of[-56,60]){g.beginPath();g.arc(x,-18,18,0,6.283);fs(g,'#1d1d1d',4);g.beginPath();g.arc(x,-18,7,0,6.283);fs(g,'#9aa3ad',0)}}],
 boat:[1.4,220,120,g=>{g.translate(110,116);g.beginPath();g.moveTo(-100,-50);g.quadraticCurveTo(0,10,100,-50);g.lineTo(80,-16);g.quadraticCurveTo(0,10,-80,-16);g.closePath();fs(g,'#2f6bff',4);g.fillStyle='#ffd23f';g.fillRect(-60,-40,120,8);g.strokeStyle=INK;g.lineWidth=5;g.beginPath();g.moveTo(0,-40);g.lineTo(0,-108);g.stroke()}],
 flag:[4.4,120,260,g=>{g.translate(40,256);g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.moveTo(0,0);g.lineTo(0,-240);g.stroke();g.strokeStyle='#e9eef5';g.lineWidth=4;g.stroke();const c=['#ff9933','#ffffff','#138808'];for(let i=0;i<3;i++){g.fillStyle=c[i];g.fillRect(4,-236+i*16,70,16)}g.strokeStyle=INK;g.lineWidth=3;g.strokeRect(4,-236,70,48);g.strokeStyle='#1d3f9a';g.lineWidth=2;g.beginPath();g.arc(39,-212,6,0,6.283);g.stroke()}]
};
function bld(g,k){g.translate(85,326);rrp(g,-78,-300,156,300,4);fs(g,'#e6d5bf',4);const cols=['#ff5a5f','#2f6bff','#16a34a','#f59e0b','#8a5cff'],w=['NOTES POINT','MOCK TESTS','CURRENT AFFAIRS','PG ROOMS','TEST SERIES'];rrp(g,-74,-292,148,44,4);fs(g,cols[k],3);T(g,w[k],0,-269,w[k].length>11?16:20,'#fff');for(let r=0;r<5;r++)for(let c=0;c<3;c++){rrp(g,-60+c*44,-236+r*46,30,30,3);fs(g,(r+c)%2?'#ffe9a8':'#9ec9e6',2.5)}rrp(g,-24,-56,48,56,3);fs(g,'#5b3a24',3);rrp(g,-74,-80,148,14,3);fs(g,'#c0392b',3)}
for(let i=0;i<5;i++)PROPS['bld'+i]=[6.2,170,330,g=>bld(g,i)];
const SETS={village:['hut','palm','banyan','hay','marigold','palm'],coaching:['bld0','chaiStall','bld1','xerox','bld2','lamp','bld3','bld4'],library:['shelf','readDesk','shelf','globe','shelf','lamp'],exam:['examDesk','examDesk','cooler','plant','examDesk','lamp'],
 mains:['paper','pen','paper','ink','paper','paper'],interview:['hedge','sandLamp','chhatri','fountain','hedge','sandLamp'],academy:['pine','cottage','pine','bench','flag','pine'],chennai:['palm','auto','boat','lamp','palm','auto']};
const PADX=k=>Math.round(PROPS[k][1]*.4),PADT=k=>Math.round(PROPS[k][2]*.22);
function propSprite(k){const d=PROPS[k],px=PADX(k),pt=PADT(k);return sprite('p2_'+k,d[1]+2*px,d[2]+pt,g=>{g.translate(px,pt);d[3](g)})}
const propH=k=>PROPS[k][0]*(PROPS[k][2]+PADT(k))/PROPS[k][2];
ST.propSprite=propSprite;ST.PROPS=PROPS;
function h32(n){n=(n^61)^(n>>>16);n=n+(n<<3)|0;n^=n>>>4;n=Math.imul(n,0x27d4eb2d);return(n^(n>>>15))>>>0}
ST.sideProps=function(D){const C=S.story.ch,set=SETS[C.k],step=window.__lowQ?14:11,lim=Math.min(camZ+70,S.ladderZ-3);
  for(let z=Math.ceil((camZ+1)/step)*step;z<lim;z+=step){const h=h32(z|0);for(const sg of[-1,1]){const hh=h32(h+(sg>0?7:3));if(hh%5<2)continue;/* sparse roadside: the road and the gates are the subject */const k=set[hh%set.length],d=PROPS[k];const big=d[0]>3;
    const x=sg*(big?(C.k==='coaching'?5.2:5.4):3.6+(hh%3)*.4),zz=z+(hh%100)/100*2;if(C.k==='chennai'&&(k==='boat'))continue;
    D.push({z:zz,f:()=>{const p=P(x,0,zz);if(!p)return;const c=propSprite(k),hp=p[2]*propH(k),wp=hp*c.width/c.height*.6,l=p[0]-wp/2,r=p[0]+wp/2,vis=Math.max(0,Math.min(r,W)-Math.max(l,0))/Math.max(1,wp);
      if(vis<.35)return;const far=Math.max(.25,Math.min(1,(70-(zz-camZ))/38)),a=(vis<.75?(vis-.35)/.4:1)*far;blit(c,p[0],p[1],p[2],propH(k),a<.99?a:null)}})}}};
})();

(function(){
'use strict';
const ST=window.STORY,{sprite,rrp,fs,T}=ST,INK='rgba(20,33,61,.32)';
const BW=360,BH=420;
function gem(g,x,y,r,c){g.beginPath();g.moveTo(x,y-r);g.lineTo(x+r*.8,y);g.lineTo(x,y+r);g.lineTo(x-r*.8,y);g.closePath();fs(g,c||'#3ee6e0',3);g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(x-r*.2,y-r*.3,r*.22,0,6.283);g.fill()}
function glow(g,x,y,r,c){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}
function gear(g,x,y,r,c,teeth){g.save();g.translate(x,y);g.beginPath();const n=teeth||10;for(let i=0;i<n*2;i++){const a=i/(n*2)*6.283,rr=i%2?r:r*1.22;g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}g.closePath();fs(g,c,3);g.beginPath();g.arc(0,0,r*.4,0,6.283);fs(g,'#5a3a1a',2);g.restore()}
function blockLimb(g,x,y,w,h,c,pat){rrp(g,x,y,w,h,8);fs(g,c,4);if(pat){g.strokeStyle='rgba(90,60,10,.45)';g.lineWidth=2;for(let i=1;i<h/22;i++){g.beginPath();g.moveTo(x+6,y+i*22);g.lineTo(x+w-6,y+i*22);g.stroke()}}}
function knots(g,x,y,w,h){g.strokeStyle='rgba(110,75,15,.55)';g.lineWidth=2.5;for(let i=0;i<w/24;i++)for(let j=0;j<h/24;j++){g.strokeRect(x+4+i*24,y+4+j*24,16,16);g.beginPath();g.moveTo(x+4+i*24,y+4+j*24);g.lineTo(x+20+i*24,y+20+j*24);g.stroke()}}
const DRAW={
 guardian(g){const G='#d8b24a',Gd='#b08a2a';g.translate(180,410);
  blockLimb(g,-78,-120,58,120,G,1);blockLimb(g,20,-120,58,120,G,1);rrp(g,-84,-14,70,16,6);fs(g,Gd,3);rrp(g,14,-14,70,16,6);fs(g,Gd,3);
  rrp(g,-100,-270,200,160,20);fs(g,G,4);knots(g,-92,-262,184,110);rrp(g,-104,-132,208,26,8);fs(g,Gd,4);gem(g,0,-119,14);
  blockLimb(g,-160,-262,56,130,G,1);blockLimb(g,104,-262,56,130,G,1);rrp(g,-166,-140,66,52,14);fs(g,G,4);rrp(g,100,-140,66,52,14);fs(g,G,4);
  rrp(g,-120,-290,72,50,14);fs(g,Gd,4);rrp(g,48,-290,72,50,14);fs(g,Gd,4);gem(g,-84,-266,10);gem(g,84,-266,10);
  // book
  glow(g,-170,-180,90,'rgba(90,230,255,.55)');g.save();g.translate(-170,-170);g.rotate(-.3);rrp(g,-56,-34,56,64,4);fs(g,'#c99a3a',4);rrp(g,0,-34,56,64,4);fs(g,'#c99a3a',4);rrp(g,-50,-30,48,56,2);fs(g,'#fff6dc',0);rrp(g,2,-30,48,56,2);fs(g,'#fff6dc',0);g.strokeStyle='#9ab';g.lineWidth=2;for(let i=0;i<5;i++){g.beginPath();g.moveTo(-44,-20+i*10);g.lineTo(-8,-20+i*10);g.moveTo(8,-20+i*10);g.lineTo(44,-20+i*10);g.stroke()}g.restore();
  for(let i=0;i<8;i++){g.fillStyle='rgba(160,250,255,.9)';g.beginPath();g.arc(-170+Math.cos(i)*50,-230-i*8+Math.sin(i*2)*10,3+i%3,0,6.283);g.fill()}
  // head
  rrp(g,-46,-370,92,84,18);fs(g,G,4);g.beginPath();g.ellipse(0,-366,52,40,0,Math.PI,0);fs(g,Gd,4);rrp(g,-6,-410,12,40,4);fs(g,G,3);gem(g,0,-382,10);
  rrp(g,-32,-336,64,18,6);fs(g,'#3a2a10',3);glow(g,-14,-327,18,'rgba(80,240,255,.9)');glow(g,14,-327,18,'rgba(80,240,255,.9)');g.fillStyle='#bff';g.fillRect(-22,-330,14,6);g.fillRect(8,-330,14,6)},
 hydra(g){g.translate(180,410);const P='#8a5cd0',paper='#ecebe6';
  // tail
  g.beginPath();g.moveTo(60,-40);g.quadraticCurveTo(150,-30,140,-100);g.lineWidth=26;g.strokeStyle=INK;g.stroke();g.lineWidth=20;g.strokeStyle=paper;g.stroke();
  // legs
  for(const x of[-70,40]){rrp(g,x,-90,46,90,16);fs(g,P,4);for(let k=0;k<3;k++){g.beginPath();g.moveTo(x+6+k*14,0);g.lineTo(x+12+k*14,12);g.lineTo(x+18+k*14,0);fs(g,'#f2ead6',2)}}
  // body
  g.beginPath();g.ellipse(0,-150,110,100,0,0,6.283);fs(g,paper,4);g.strokeStyle='rgba(60,60,80,.35)';g.lineWidth=3;for(let i=0;i<8;i++){g.beginPath();g.moveTo(-90,-210+i*16);g.lineTo(90,-210+i*16);g.stroke()}
  g.strokeStyle=P;g.lineWidth=14;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-104,-200+i*36);g.quadraticCurveTo(0,-180+i*36,104,-200+i*36);g.stroke()}
  rrp(g,-30,-196,60,26,4);fs(g,'#fff',3);T(g,'NEWS',0,-182,16,INK);gem(g,0,-130,14);
  // necks + heads
  const heads=[[-120,-330,'#3f8fe8',-.35],[0,-380,'#8a5cd0',0],[120,-340,'#4cc06a',.35]];
  for(const[hx,hy,c,r]of heads){g.lineWidth=40;g.strokeStyle=INK;g.beginPath();g.moveTo(hx*.3,-220);g.quadraticCurveTo(hx*.9,-260,hx,hy+30);g.stroke();g.lineWidth=32;g.strokeStyle=paper;g.stroke();g.strokeStyle=c;g.lineWidth=6;for(let k=0;k<4;k++){const u=.2+k*.2;const x=hx*.3+(hx-hx*.3)*u,y=-220+(hy+30+220)*u;g.beginPath();g.arc(x,y,14,0,3.14);g.stroke()}
   g.save();g.translate(hx,hy);g.rotate(r);g.beginPath();g.ellipse(0,0,40,34,0,0,6.283);fs(g,c,4);g.beginPath();g.ellipse(r>=0?24:-24,12,30,18,0,0,6.283);fs(g,c,4);
   for(const s of[-1,1]){g.beginPath();g.moveTo(s*14,-26);g.quadraticCurveTo(s*30,-64,s*10,-70);g.quadraticCurveTo(s*20,-46,s*4,-28);fs(g,'#f2ead6',3)}
   g.beginPath();g.ellipse(-12,-6,9,11,0,0,6.283);g.ellipse(12,-6,9,11,0,0,6.283);fs(g,'#fff',2.5);g.fillStyle=INK;g.beginPath();g.arc(-10,-4,4.5,0,6.283);g.arc(14,-4,4.5,0,6.283);g.fill();
   g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.arc(r>=0?22:-22,16,16,.2,2.6);g.stroke();g.fillStyle='#fff';g.beginPath();g.moveTo(10,24);g.lineTo(14,32);g.lineTo(18,24);g.fill();g.restore()}},
 colossus(g){const B='#b8843a',Bd='#8a5f24';g.translate(180,410);
  gear(g,0,-350,64,'#c9963f',14);
  blockLimb(g,-74,-130,56,130,B);blockLimb(g,18,-130,56,130,B);rrp(g,-80,-20,68,22,8);fs(g,Bd,3);rrp(g,12,-20,68,22,8);fs(g,Bd,3);
  rrp(g,-104,-290,208,170,30);fs(g,B,4);for(const[x,y]of[[-84,-270],[84,-270],[-84,-140],[84,-140]]){g.beginPath();g.arc(x,y,6,0,6.283);fs(g,'#3ee6e0',2)}
  g.beginPath();g.arc(0,-206,56,0,6.283);fs(g,Bd,4);g.beginPath();g.arc(0,-206,44,0,6.283);fs(g,'#ffeec2',3);
  g.beginPath();g.moveTo(-24,-240);g.lineTo(24,-240);g.lineTo(4,-206);g.lineTo(24,-172);g.lineTo(-24,-172);g.lineTo(-4,-206);g.closePath();fs(g,'rgba(255,255,255,.4)',3);g.fillStyle='#e8b923';g.beginPath();g.moveTo(-16,-178);g.lineTo(16,-178);g.lineTo(0,-198);g.fill();g.beginPath();g.moveTo(-10,-236);g.lineTo(10,-236);g.lineTo(0,-224);g.fill();
  blockLimb(g,-164,-290,58,150,B);blockLimb(g,106,-290,58,150,B);gear(g,-135,-300,34,'#c9963f',9);gear(g,135,-300,34,'#c9963f',9);
  g.beginPath();g.arc(-136,-126,30,0,6.283);fs(g,B,4);gear(g,136,-126,28,'#c9963f',8);
  rrp(g,-44,-372,88,82,26);fs(g,B,4);rrp(g,-30,-344,60,20,8);fs(g,'#2a1d10',3);glow(g,-12,-334,16,'rgba(80,240,255,.9)');glow(g,12,-334,16,'rgba(80,240,255,.9)');rrp(g,-20,-306,40,8,3);fs(g,Bd,2)},
 titan(g){g.translate(180,410);const R='#8f8f86',Rd='#6c6c63',M='#5aa04a';
  const rock=(x,y,r)=>{g.beginPath();for(let i=0;i<9;i++){const a=i/9*6.283,rr=r*(.82+.18*Math.sin(i*2.7+x));g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath();fs(g,R,4);g.fillStyle=M;g.beginPath();g.ellipse(x-r*.2,y-r*.55,r*.5,r*.22,0,0,6.283);g.fill()};
  rock(-50,-60,52);rock(50,-60,52);rock(-60,-170,70);rock(60,-170,70);rock(0,-230,80);rock(-130,-200,46);rock(-140,-120,40);rock(130,-250,44);
  g.strokeStyle='#5fd0ff';g.lineWidth=12;for(const[x0,y0,x1,y1]of[[-20,-290,-40,-20],[30,-260,60,-10],[-90,-220,-120,-90]]){g.beginPath();g.moveTo(x0,y0);g.bezierCurveTo(x0+30,(y0+y1)/2,x1-30,(y0+y1)/2,x1,y1);g.stroke()}g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=3;for(const[x0,y0,x1,y1]of[[-20,-290,-40,-20],[30,-260,60,-10]]){g.beginPath();g.moveTo(x0+3,y0);g.bezierCurveTo(x0+33,(y0+y1)/2,x1-27,(y0+y1)/2,x1+3,y1);g.stroke()}
  for(const[x,y]of[[-100,-270],[-70,-290],[110,-300]]){g.fillStyle='#2f6d3a';g.beginPath();g.moveTo(x-14,y);g.lineTo(x,y-34);g.lineTo(x+14,y);g.closePath();g.fill();g.strokeStyle=INK;g.lineWidth=2;g.stroke()}
  rock(150,-310,36);g.beginPath();g.arc(160,-372,50,0,6.283);fs(g,'#3f8fe8',4);g.fillStyle='#4caf50';g.beginPath();g.ellipse(144,-384,20,16,.5,0,6.283);g.ellipse(176,-356,18,22,-.3,0,6.283);g.fill();glow(g,160,-372,74,'rgba(120,220,255,.35)');
  rock(0,-320,46);g.fillStyle='#2a2a26';g.fillRect(-26,-330,52,12);glow(g,-12,-324,12,'rgba(120,255,200,.9)');glow(g,12,-324,12,'rgba(120,255,200,.9)')},
 mech(g){g.translate(180,410);const Pu='#7b45c9',O='#f59e0b';
  for(const x of[-74,20]){rrp(g,x,-130,54,100,12);fs(g,Pu,4);rrp(g,x-6,-34,66,34,10);fs(g,O,4)}
  rrp(g,-104,-300,208,180,26);fs(g,O,4);rrp(g,-80,-280,160,130,14);fs(g,'#14213d',4);for(let r=0;r<4;r++)for(let c=0;c<4;c++){rrp(g,-68+c*36,-270+r*30,28,22,5);fs(g,'#3ee6e0',2)}
  T(g,'+',-54,-259,18,INK);T(g,'%',-18,-229,18,INK);T(g,'=',18,-199,18,INK);
  for(const s of[-1,1]){rrp(g,s>0?104:-164,-290,60,60,18);fs(g,Pu,4);gear(g,s*134,-260,18,'#ffd23f',8);rrp(g,s>0?112:-156,-232,44,90,12);fs(g,Pu,4);rrp(g,s>0?108:-160,-146,52,36,12);fs(g,'#9aa3ad',4)}
  rrp(g,-74,-404,148,100,22);fs(g,O,4);rrp(g,-58,-390,116,64,14);fs(g,'#14213d',3);glow(g,-26,-358,22,'rgba(62,230,224,.9)');glow(g,26,-358,22,'rgba(62,230,224,.9)');rrp(g,-34,-366,16,16,4);fs(g,'#bfffff',0);rrp(g,18,-366,16,16,4);fs(g,'#bfffff',0);
  rrp(g,-10,-418,20,16,4);fs(g,Pu,3)},
 ledger(g){g.translate(180,410);const Gd='#d8a21f',Gr='#2f8a5a';
  for(const x of[-70,20]){rrp(g,x,-120,50,120,12);fs(g,Gr,4)}
  rrp(g,-110,-300,220,190,24);fs(g,Gd,4);rrp(g,-86,-280,172,130,10);fs(g,'#5a3a1a',4);for(let r=0;r<5;r++){g.strokeStyle='#c9a23a';g.lineWidth=3;g.beginPath();g.moveTo(-80,-266+r*26);g.lineTo(80,-266+r*26);g.stroke();for(let k=0;k<6;k++){g.beginPath();g.arc(-60+k*22+((r*13)%30),-266+r*26,8,0,6.283);fs(g,k%2?'#ff5a5f':'#3ee6e0',2)}}
  for(const s of[-1,1]){rrp(g,s>0?110:-160,-290,50,140,16);fs(g,Gr,4)}
  g.save();g.translate(-150,-120);g.beginPath();g.arc(0,0,30,0,6.283);fs(g,'#ffd23f',4);T(g,'\u20B9',0,2,30,'#b8860b');g.restore();
  rrp(g,-56,-390,112,92,24);fs(g,Gd,4);rrp(g,-38,-360,76,28,8);fs(g,'#14213d',3);glow(g,-16,-346,14,'rgba(255,240,120,.95)');glow(g,16,-346,14,'rgba(255,240,120,.95)');
  g.beginPath();g.moveTo(-50,-390);g.lineTo(-40,-430);g.lineTo(-20,-404);g.lineTo(0,-436);g.lineTo(20,-404);g.lineTo(40,-430);g.lineTo(50,-390);g.closePath();fs(g,'#ffd23f',4)},
 warden(g){g.translate(180,410);const W='#8a5a2b',L='#3f9a4a';
  for(const x of[-60,20]){g.beginPath();g.moveTo(x,0);g.lineTo(x+10,-130);g.lineTo(x+40,-130);g.lineTo(x+50,0);g.closePath();fs(g,W,4)}
  g.beginPath();g.ellipse(0,-210,100,110,0,0,6.283);fs(g,W,4);g.strokeStyle='rgba(60,30,10,.4)';g.lineWidth=3;for(let i=0;i<5;i++){g.beginPath();g.moveTo(-60+i*30,-300);g.quadraticCurveTo(-50+i*30,-210,-60+i*30,-120);g.stroke()}
  g.strokeStyle='#ff8a1f';g.lineWidth=8;for(let i=0;i<3;i++){g.beginPath();g.moveTo(-80,-250+i*40);g.lineTo(-40,-236+i*40);g.moveTo(80,-250+i*40);g.lineTo(40,-236+i*40);g.stroke()}
  for(const s of[-1,1]){g.lineWidth=30;g.strokeStyle=INK;g.beginPath();g.moveTo(s*90,-260);g.quadraticCurveTo(s*170,-220,s*150,-120);g.stroke();g.lineWidth=22;g.strokeStyle=W;g.stroke();g.beginPath();g.arc(s*150,-118,22,0,6.283);fs(g,L,4)}
  for(const[x,y,r]of[[-70,-330,50],[70,-330,50],[0,-370,60],[-110,-290,34],[110,-290,34]]){g.beginPath();g.arc(x,y,r,0,6.283);fs(g,L,4)}for(const[x,y]of[[-40,-370],[30,-390],[80,-320]]){g.fillStyle='#ff9f1a';g.beginPath();g.arc(x,y,7,0,6.283);g.fill()}
  g.beginPath();g.ellipse(0,-262,46,34,0,0,6.283);fs(g,'#6b4520',3);glow(g,-18,-266,16,'rgba(160,255,120,.95)');glow(g,18,-266,16,'rgba(160,255,120,.95)')},
 sage(g){g.translate(180,410);const S1='#cfd8e3',S2='#4aa3d8';
  for(const x of[-66,18]){rrp(g,x,-130,48,130,12);fs(g,S1,4)}
  rrp(g,-96,-300,192,180,28);fs(g,S1,4);g.strokeStyle='#3ee6e0';g.lineWidth=3;for(let i=0;i<5;i++){g.beginPath();g.moveTo(-80,-280+i*30);g.lineTo(-30,-280+i*30);g.lineTo(-20,-268+i*30);g.lineTo(40,-268+i*30);g.stroke();g.beginPath();g.arc(44,-268+i*30,4,0,6.283);g.fillStyle='#3ee6e0';g.fill()}
  for(const s of[-1,1]){rrp(g,s>0?96:-146,-290,50,150,16);fs(g,S2,4);g.beginPath();g.arc(s*121,-126,24,0,6.283);fs(g,S1,4)}
  rrp(g,-40,-360,80,60,16);fs(g,S1,4);glow(g,0,-332,22,'rgba(62,230,224,.9)');
  g.beginPath();g.ellipse(0,-392,80,30,-.2,0,6.283);fs(g,'#e9eef5',4);g.strokeStyle=INK;g.lineWidth=4;g.beginPath();g.moveTo(0,-392);g.lineTo(20,-440);g.stroke();g.beginPath();g.arc(20,-444,8,0,6.283);fs(g,'#ff5a5f',3);
  g.strokeStyle='rgba(62,230,224,.8)';g.lineWidth=4;g.beginPath();g.ellipse(0,-210,170,46,.25,0,6.283);g.stroke();g.beginPath();g.ellipse(0,-210,170,46,-.25,0,6.283);g.stroke();for(const a of[.6,2.6,4.2]){g.beginPath();g.arc(Math.cos(a)*170,-210+Math.sin(a)*46,9,0,6.283);fs(g,'#ffd23f',3)}}
};
const DEF={guardian:{n:'Constitution Guardian',sub:'Polity',c:'#d8b24a',hw:3.3,w:'Polity'},hydra:{n:'Headline Hydra',sub:'CA',c:'#8a5cd0',hw:3.4,w:'Current affairs'},colossus:{n:'History Colossus',sub:'History',c:'#b8843a',hw:3.3,w:'History'},
 mech:{n:'Maths Mech',sub:'CSAT',c:'#7b45c9',hw:3.3,w:'CSAT maths'},titan:{n:'Geography Titan',sub:'Geography',c:'#8f8f86',hw:3.4,w:'Geography'},ledger:{n:'Ledger King',sub:'Economy',c:'#d8a21f',hw:3.3,w:'Economy'},
 warden:{n:'Green Warden',sub:'Environment',c:'#3f9a4a',hw:3.4,w:'Environment'},sage:{n:'Circuit Sage',sub:'Science',c:'#4aa3d8',hw:3.4,w:'Science and tech'},
 panel:{n:'The Interview Panel',sub:'MIX',c:'#2a3550',hw:2.4,w:'All subjects'}};
ST.BOSSDEF=DEF;
function bossSprite(k){if(k==='panel')return sprite('b_panel',560,320,g=>{g.translate(280,316);
   g.beginPath();g.moveTo(-270,0);g.lineTo(-270,-220);g.arc(0,-220,270,Math.PI,0);g.lineTo(270,0);g.closePath();fs(g,'#e3b07a',4);g.beginPath();g.moveTo(-220,0);g.lineTo(-220,-210);g.arc(0,-210,220,Math.PI,0);g.lineTo(220,0);g.closePath();fs(g,'#f3d9b0',0);
   for(let i=0;i<5;i++){const x=-180+i*90,y=-150;g.fillStyle='#232c44';g.beginPath();g.arc(x,y-58,26,0,6.283);g.fill();rrp(g,x-40,y-34,80,90,24);g.fill();g.fillStyle='rgba(255,255,255,.08)';g.beginPath();g.arc(x-8,y-64,10,0,6.283);g.fill()}
   rrp(g,-260,-100,520,40,8);fs(g,'#2f6d3a',4);rrp(g,-260,-62,520,62,4);fs(g,'#245a2f',4);
   for(let i=0;i<5;i++){const x=-180+i*90;rrp(g,x-34,-128,68,24,4);fs(g,'#ffffff',2.5);T(g,'Member '+(i+1),x,-115,12,INK);rrp(g,x+28,-138,10,22,3);fs(g,'rgba(190,230,255,.9)',2)}});
  return sprite('b_'+k,BW+120,BH+60,g=>{g.translate(60,50);DRAW[k](g)})}
ST.bossSprite=bossSprite;ST.DEF=DEF;
const TINT={};
function tint(k,c){const key=k+c;if(TINT[key])return TINT[key];const s=bossSprite(k),t=document.createElement('canvas');t.width=s.width;t.height=s.height;const g=t.getContext('2d');g.drawImage(s,0,0);g.globalCompositeOperation='source-atop';g.fillStyle=c;g.fillRect(0,0,t.width,t.height);TINT[key]=t;return t}
window.storyBoss=function(B){if(!B.kind)return false;const d=DEF[B.kind],z=bossZ(B),p=P(B.x,0,z);if(!p)return true;const s=p[2],t=S.t;
  const spr=bossSprite(B.kind),hw=d.hw*2.3*(.6+.4*B.enter),hp=s*hw,wp=hp*spr.width/spr.height;
  ctx.save();ctx.translate(p[0],p[1]);
  ctx.fillStyle='rgba(0,40,90,.25)';ctx.beginPath();ctx.ellipse(0,0,wp*.4,wp*.08,0,0,6.283);ctx.fill();
  if(B.st==='die'){const u=Math.min(1.2,B.t);ctx.globalAlpha=Math.max(0,1-u*.9);ctx.translate(0,u*hp*.25);ctx.rotate(Math.sin(B.t*30)*.04+u*.25)}
  if(B.st==='leave')ctx.globalAlpha=Math.max(0,1-B.t);
  const br=Math.sin(t*2.5)*.03,cr=(B.crouch||0)*.14;ctx.scale(1+br+cr*.5,1-br-cr);
  if(B.st==='tele'&&!window.__lowQ){const a=.25+.2*Math.sin(t*18);ctx.globalAlpha*=1;const r=tint(B.kind,'#ff2a2a');ctx.save();ctx.globalAlpha=a;ctx.drawImage(r,-wp/2-wp*.03,-hp-hp*.02,wp*1.06,hp*1.04);ctx.restore()}
  ctx.drawImage(spr,-wp/2,-hp,wp,hp);
  if(B.flash>0){ctx.globalAlpha=Math.min(1,B.flash*3)*.85;ctx.drawImage(tint(B.kind,'#ffffff'),-wp/2,-hp,wp,hp)}
  ctx.restore();return true};
window.bossDraw=(function(orig){return function(B){if(window.storyBoss&&window.storyBoss(B))return;orig(B)}})(window.bossDraw);
// HP bar + intro card (screen space)
ST.bossHud=function(){const B=S.boss;if(!B||!B.kind||S.phase!=='boss')return;const d=DEF[B.kind];
  const bw=Math.min(W*.86,360),x=(W-bw)/2,y=Math.max(118,H*.15);
  ctx.fillStyle='rgba(20,33,61,.88)';rrp(ctx,x,y,bw,44,12);ctx.fill();
  ctx.font=`15px ${'"Lilita One",sans-serif'}`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(d.n.toUpperCase(),x+12,y+13);
  ctx.textAlign='right';ctx.fillStyle='#ffd23f';ctx.fillText('HP '+Math.max(0,B.hp)+'/'+B.max,x+bw-12,y+13);
  const gx=x+12,gw=bw-24,seg=gw/B.max;for(let i=0;i<B.max;i++){ctx.fillStyle='rgba(255,255,255,.15)';rrp(ctx,gx+i*seg+2,y+26,seg-4,10,4);ctx.fill();if(i<B.hp){ctx.fillStyle=B.flash>0?'#fff':'#ff4d5e';rrp(ctx,gx+i*seg+2,y+26,seg-4,10,4);ctx.fill()}}
  ctx.textAlign='center';
  if(B.st==='intro'||(B.st==='tele'&&B.asked===0&&B.t<.3)){const a=B.st==='intro'?Math.min(1,B.t*4,(1.6-B.t)*3+.3):.3;ctx.globalAlpha=Math.max(0,Math.min(1,a));
    const cw=Math.min(W*.86,340),ch=150,cx=(W-cw)/2,cy=H*.3;ctx.fillStyle='#fff';rrp(ctx,cx,cy,cw,ch,18);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=INK;ctx.stroke();
    ctx.fillStyle=d.c;rrp(ctx,cx,cy,cw,34,18);ctx.fill();ctx.fillStyle=d.c;ctx.fillRect(cx,cy+18,cw,16);
    txt('BOSS FIGHT',W/2,cy+18,16,'#fff');txt(d.n,W/2,cy+62,26,INK,null);
    ctx.font='700 14px system-ui,sans-serif';ctx.fillStyle='#4a5875';ctx.fillText('Questions: '+d.w,W/2,cy+94);ctx.fillText('Dodge the red zones. Answer right to strike.',W/2,cy+118);ctx.globalAlpha=1}};
// wire bosses to chapters
const _start=window.startBoss;
window.startBoss=function(it){_start(it);if(!S.story||!S.boss)return;const k=S.story.bossKey,d=DEF[k];Object.assign(S.boss,{kind:k,name:d.n,col:d.c,sub:d.sub});
  try{$('banner').classList.remove('show')}catch(e){}
  if(!S.picker.__story){const pk=S.picker,o=pk.sheet.bind(pk);pk.__story=1;pk.sheet=function(s){try{if(s==='CSAT'){const q=csatQ();if(q)return q}if(s==='CA'){const q=pk.ca&&pk.ca();if(q)return q;return o(pick(['Polity','Economy','Science']))}if(s==='MIX')return o(pick(S.subs.length?S.subs:['Polity']))}catch(e){}return o(s)}}};
Object.assign(BOSS_ATK,{CSAT:['protractor','compass'],CA:['fire','dash'],MIX:['compass','protractor']});
const _end=window.bossEnd;window.bossEnd=function(){const B=S&&S.boss;const win=B&&B.hp<=0;_end();if(win&&S.story&&ST.promote)ST.promote(1,'Boss beaten')};
})();

(function(){
'use strict';
const ST=window.STORY,{CH,STAGES,sprite,rrp,fs,T,blit}=ST,INK='rgba(20,33,61,.32)';
const LETTERS=['Kanna, eat on time and sleep well. Love, Amma.','Proud of you for leaving home to chase this. Appa.','Read slowly, remember forever. Your Paati.','We prayed for you this morning. Stay calm. Amma.',
 'Your little cousin says she wants to be like you. Appa.','Wear the cream jacket. You look like a leader. Paati.','The village school wants you to visit and speak. Amma.','Come home soon. Your favourite payasam is waiting. Appa.'];
ST.LETTERS=LETTERS;
const ARCH_TXT={village:'WELCOME HOME',coaching:'WELL DONE',library:'WELL DONE',exam:'PRELIMS CLEARED',mains:'MAINS DONE',interview:'SELECTED',academy:'OFFICER',chennai:'WELCOME HOME'};
function SP(){return PL.story||(PL.story={letters:{},done:{},best:0})}
ST.SP=SP;
function applyOutfit(l,st){const O=STAGES[st];l.shirt=O.shirt;l.pants=O.pants;l.bag=O.bag;l.glasses=O.glasses}
function restyle(){if(!S||!S.story)return;for(const m of S.members)applyOutfit(m.look,S.story.stage)}
window.makeLook=(function(o){return function(r){const l=o(r);if(!r&&typeof S!=='undefined'&&S&&S.story)applyOutfit(l,S.story.stage);return l}})(window.makeLook);
// ---------- run setup ----------
window.storyNewRun=function(mode,lv,seed){
  if(!['level','challenge','daily'].includes(mode)){S.story=null;return}
  const ci=ST.chIdx(lv),ch=CH[ci];let bossKey=ch.boss;if(lv>24&&ch.k==='mains')bossKey='ledger';
  S.story={ch,ci,bossKey,stage:ch.base,base:ch.base,hs:0,items:[],fx:null,arrive:null,final:lv%3===0};S.chai=0;
  restyle();
  let s=(seed^0x9e3779b9)|0;const r=()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const Q=S.items.filter(i=>i.type==='quiz').sort((a,b)=>a.z-b.z),lane=()=>[-1.2,0,1.2][(r()*3)|0];
  const mid=i=>Q[i+1]?(Q[i].z+Q[i+1].z)/2:Q[i].z+8;
  if(Q[0])S.story.items.push({k:'chai',z:mid(0),x:lane()});
  // golden scroll goes in the longest stretch that has no arena or road split, so it never lands right next to another question
  if(Q[1]&&mode!=='daily'){const E=S.items.filter(i=>i.type==='quiz'||['shoot','boss','branch'].includes(i.type)).sort((a,b)=>a.z-b.z);let bz=null,bg=0;
    for(let i=0;i<E.length-1;i++){if(E[i].type!=='quiz')continue;const g=E[i+1].z-E[i].z;const free=g-(E[i+1].type==='quiz'||E[i+1].type==='branch'?PACE_D:0);if(free>bg){bg=free;bz=E[i].z+free/2}}
    if(bz!=null)S.story.items.push({k:'scroll',z:bz,x:lane()})}
  if(Q.length>3&&mode==='level'&&!SP().letters[ci]&&lv%3!==0)S.story.items.push({k:'letter',z:mid(2),x:r()<.5?-1.55:1.55});
  if(mode==='level')banner(ch.n,'Chapter '+(ci+1)+', level '+((lv-1)%3+1)+' of 3'+(lv%3===0?', boss level':''),2)};
// ---------- hero stage changes ----------
ST.promote=function(d,why){const s=S.story;if(!s)return;const lo=Math.max(0,s.base-1),hi=Math.min(5,s.base+2),n=Math.max(lo,Math.min(hi,s.stage+d));if(n===s.stage)return;
  s.stage=n;restyle();s.fx={t:0,up:d>0};const sp=SP();if(n>sp.best){sp.best=n;saveP()}
  if(d>0){banner('PROMOTED',STAGES[n].n,1.3);sfx.power();confetti(S.dist+1.5);vib([15,30,15])}else{ftext('Setback: '+STAGES[n].n,'#ff8a8a',S.dist+3);sfx.bad()}};
window.storyAnswer=function(ok){const s=S&&S.story;if(!s)return;if(ok){s.hs++;if(s.hs>=3){s.hs=0;ST.promote(1)}}else{s.hs=0;ST.promote(-1)}};
// ---------- chai revive ----------
window.failRun=(function(o){return function(kind){if(S&&S.story&&S.chai>0&&!S.revived&&!S.quick&&kind!=='boss'&&S.phase!=='revive'){S.chai--;S.fail=kind;S.phase='revive';closeSheet();
  setTimeout(()=>{if(S&&S.phase==='revive'){doRevive('chai');banner('CHAI BREAK','Your chai cup brought a fresh batch',1.4)}},600);return}o(kind)}})(window.failRun);
// ---------- letter card ----------
function letterCard(ci){let el=document.getElementById('storyLetter');if(!el){el=document.createElement('div');el.id='storyLetter';document.body.appendChild(el)}
  el.innerHTML=`<b>A letter from home</b><p>${esc(LETTERS[ci])}</p><span>Letters found: ${Object.keys(SP().letters).length} of 8</span>`;el.className='show';clearTimeout(letterCard.t);letterCard.t=setTimeout(()=>el.className='',3600)}
ST.letterCard=letterCard;
// ---------- golden PYQ scroll ----------
function scrollQuiz(){S.phase='scroll';const q=(S.picker.pyq&&S.picker.pyq())||S.picker.sheet();if(!q){S.phase='run';return}
  sheetQuiz({title:q.pyqx?'GOLDEN SCROLL, '+q.pyqx:'GOLDEN SCROLL',tag:'Right answer pays 3x marks',q,time:14,onDone:(ok,side)=>{if(!S)return;logA(q,side,ok);recordAnswer(q,ok);
    if(ok){S.gained+=30;ftext('PYQ 3x +30','#ffd23f',S.dist+3);sfx.yay();confetti(S.dist+2)}else ftext('Answer: '+q.ans[q.correct],'#ffffff',S.dist+3);window.storyAnswer(ok);
    setTimeout(()=>{if(S&&S.phase==='scroll'){closeSheet();S.phase='run'}},500)}})}
// ---------- per-frame ----------
window.storyUpdate=function(dt){const s=S.story;if(!s)return;
  if(s.fx){s.fx.t+=dt;if(s.fx.t>1.2)s.fx=null}
  if(S.phase==='run')for(const it of s.items){if(it.done)continue;it.bob=(it.bob||0)+dt;
    if(Math.abs(S.dist-it.z)<.9&&Math.abs(S.x-it.x)<clusterR()*S.tight+.5){it.done=true;poof(it.x,1,it.z,it.k==='chai'?'#c98a4b':'#ffd23f');
      if(it.k==='chai'){S.chai++;banner('CHAI CUP','Saved for a free revive',1.2);sfx.coin()}
      if(it.k==='letter'){SP().letters[s.ci]=1;saveP();letterCard(s.ci);sfx.yay()}
      if(it.k==='scroll'){sfx.power();scrollQuiz();return}}}
  if(S.phase==='end'&&!S.fail&&!S.quick&&!s.arrive){s.arrive={t:0,z0:S.dist};S.endT+=2.6;sfx.yay();if(s.final){SP().done[s.ci]=1;saveP()}}
  if(s.arrive){const a=s.arrive;a.t+=dt;if(a.t<2.4&&(a.n||0)<Math.floor(a.t/.45)){a.n=(a.n||0)+1;const zf=S.ladderEnd+1.6;confetti(zf,-1.2);confetti(zf,1.2);vib(10)}}};
// ---------- world draw additions ----------
function collectible(it){const p=P(it.x,.55+Math.sin((it.bob||0)*3)*.12,it.z);if(!p)return;const s=p[2];
  ctx.fillStyle='rgba(0,40,90,.18)';const g0=P(it.x,0,it.z);if(g0){ctx.beginPath();ctx.ellipse(g0[0],g0[1],s*.3,s*.08,0,0,6.283);ctx.fill()}
  if(!window.__lowQ){ctx.fillStyle='rgba(255,230,120,.35)';ctx.beginPath();ctx.arc(p[0],p[1]-s*.2,s*.5,0,6.283);ctx.fill()}blit(itemSprite(it.k),p[0],p[1]+s*.3,s,1.05)}
function itemSprite(k){return sprite('it_'+k,120,120,g=>{g.translate(60,60);
  if(k==='scroll'){const gr=g.createRadialGradient(0,0,4,0,0,58);gr.addColorStop(0,'rgba(255,230,120,.9)');gr.addColorStop(1,'rgba(255,230,120,0)');g.fillStyle=gr;g.beginPath();g.arc(0,0,58,0,6.283);g.fill();
    rrp(g,-30,-26,60,52,6);fs(g,'#ffe7a8',4);g.beginPath();g.ellipse(-30,0,9,28,0,0,6.283);fs(g,'#e8b923',4);g.beginPath();g.ellipse(30,0,9,28,0,0,6.283);fs(g,'#e8b923',4);g.fillStyle='#c0283a';g.beginPath();g.arc(8,14,8,0,6.283);g.fill();T(g,'PYQ',0,-6,17,'#8a5a00')}
  if(k==='chai'){g.fillStyle='rgba(255,255,255,.75)';for(let i=0;i<3;i++){g.beginPath();g.ellipse(-12+i*12,-40-i*4,5,10,0,0,6.283);g.fill()}
    g.beginPath();g.moveTo(-28,-20);g.lineTo(28,-20);g.lineTo(22,30);g.lineTo(-22,30);g.closePath();fs(g,'#ffffff',4);g.fillStyle='#b8733a';g.beginPath();g.ellipse(0,-20,27,7,0,0,6.283);g.fill();g.strokeStyle=INK;g.lineWidth=4;g.beginPath();g.arc(30,4,12,-1.3,1.3);g.stroke();g.beginPath();g.ellipse(0,36,40,8,0,0,6.283);fs(g,'#f4efe6',3)}
  if(k==='letter'){g.rotate(-.12);rrp(g,-38,-26,76,52,6);fs(g,'#fff6e6',4);g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.moveTo(-38,-26);g.lineTo(0,4);g.lineTo(38,-26);g.stroke();g.fillStyle='#e05a7a';g.beginPath();g.moveTo(0,8);g.bezierCurveTo(-14,-6,-6,-16,0,-8);g.bezierCurveTo(6,-16,14,-6,0,8);g.fill()}})}
ST.itemSprite=itemSprite;
function archSprite(k){return sprite('arch_'+k,520,440,g=>{g.translate(260,436);const mg=(x,y,c)=>{g.beginPath();g.arc(x,y,13,0,6.283);fs(g,c,2.5);g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(x-4,y-4,4,0,6.283);g.fill()};
  for(const sx of[-215,215]){for(let i=0;i<14;i++)mg(sx+(i%2?6:-6),-14-i*24,i%2?'#ff9f1a':'#ffd23f');rrp(g,sx-20,-6,40,8,3);fs(g,'#c0603a',2)}
  g.lineWidth=0;for(let i=0;i<=24;i++){const u=i/24,x=-215+u*430,y=-350-Math.sin(u*Math.PI)*60;mg(x,y,i%2?'#ffd23f':'#ff7a1a')}
  for(let i=0;i<18;i++){const u=(i+.5)/18,x=-200+u*400,y=-336-Math.sin(u*Math.PI)*58;g.beginPath();g.moveTo(x-9,y);g.lineTo(x,y+26);g.lineTo(x+9,y);g.closePath();fs(g,i%2?'#2f9a4a':'#3fb35a',2)}
  for(let i=0;i<8;i++){const u=(i+.5)/8,x=-200+u*400,y=-336-Math.sin(u*Math.PI)*58;g.strokeStyle='#ff9f1a';g.lineWidth=4;g.beginPath();g.moveTo(x,y);g.lineTo(x,y+60);g.stroke();mg(x,y+64,'#ffd23f')}
  const t=ARCH_TXT[k]||'WELL DONE';rrp(g,-150,-300,300,52,12);fs(g,'#c0283a',4);T(g,t,0,-273,t.length>12?26:30,'#fff')})}
function carSprite(){return sprite('car',300,170,g=>{g.translate(150,160);g.beginPath();g.moveTo(-140,-30);g.lineTo(-132,-70);g.lineTo(-70,-78);g.lineTo(-40,-120);g.lineTo(60,-120);g.lineTo(96,-78);g.lineTo(136,-70);g.lineTo(140,-30);g.closePath();fs(g,'#f7f8fa',5);
  g.beginPath();g.moveTo(-30,-112);g.lineTo(50,-112);g.lineTo(80,-80);g.lineTo(-56,-80);g.closePath();fs(g,'#39557a',3);g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.moveTo(12,-112);g.lineTo(12,-80);g.stroke();
  rrp(g,-140,-40,280,12,4);fs(g,'#d7dbe2',2);for(const x of[-84,88]){g.beginPath();g.arc(x,-28,26,0,6.283);fs(g,'#222',4);g.beginPath();g.arc(x,-28,11,0,6.283);fs(g,'#b8c0cc',2)}
  g.fillStyle='#ffe08a';rrp(g,124,-66,14,10,3);g.fill();g.strokeStyle=INK;g.lineWidth=3;g.beginPath();g.moveTo(118,-74);g.lineTo(118,-104);g.stroke();const c=['#ff9933','#ffffff','#138808'];for(let i=0;i<3;i++){g.fillStyle=c[i];g.fillRect(119,-104+i*6,22,6)}g.strokeRect(119,-104,22,18)})}
const VILL=[];function villLooks(){if(VILL.length)return VILL;for(let i=0;i<6;i++){const l=makeLookPlain();VILL.push(l)}return VILL}
function makeLookPlain(){const sk=['#c98d63','#b97a52','#d9a273','#a86d47'],sh=['#e85a5a','#2f9a4a','#2f6bff','#f2b51f','#8a5cff','#ff8a1f'];return{skin:pick(sk),shirt:pick(sh),pants:pick(['#3a3a46','#f4efe4','#1f3a7a']),bag:'#7a4a2a',hair:(Math.random()*3)|0,glasses:false,size:1,blink:Math.random()*4}}
window.storyFinish=function(){if(!S||!S.story)return false;const s=S.story,z0=S.ladderEnd+2,y0=STEPS.length*.3;if(z0-camZ>110)return true;
  // plateau
  const a=Math.max(S.ladderEnd,camZ+.5);quad(P(-3,y0,z0+9),P(3,y0,z0+9),P(3,y0,a),P(-3,y0,a),s.ch.a);quad(P(-3,y0,a),P(3,y0,a),P(3,0,a),P(-3,0,a),'rgba(0,0,0,.18)');
  if(s.stage>=5||s.ch.base>=5){const cp=P(.9,y0,z0+3);if(cp)blit(carSprite(),cp[0],cp[1],cp[2],1.5)}
  const ap=P(0,y0,z0+.6);if(ap)blit(archSprite(s.ch.k),ap[0],ap[1],ap[2],4.2);
  const arr=s.arrive,jump=k=>arr?Math.abs(Math.sin(S.t*7+k))*.18:Math.abs(Math.sin(S.t*3+k))*.05;
  const V=villLooks();V.forEach((l,i)=>{const x=(i<3?-1:1)*(2.45+(i%3)*.28),zz=z0-.1+(i%3)*.2,p=P(x,y0+jump(i),zz);if(p)guy(p[0],p[1],p[2]*.95,l,{t:S.t,ph:i,face:'front',cheer:true})});
  return true};
window.storyD=function(D){const s=S.story;if(!s)return;
  if(!window.__r3on)ST.sideProps(D);
  {const z0=S.ladderEnd+2,y0=STEPS.length*.3,arr=s.arrive;if(z0-camZ<70){const jump=k=>arr?Math.abs(Math.sin(S.t*7+k))*.2:Math.abs(Math.sin(S.t*3+k))*.05;
    [['paati',-1.95,z0-.3],['amma',-1.3,z0-.7],['appa',1.4,z0-.6]].forEach(([w,x,zz],i)=>D.push({z:zz,f:()=>{const p=P(x,y0+jump(i+3),zz);if(p)blit(ST.famSprite(w,(Math.floor(S.t*(arr?6:2))+i)%4),p[0],p[1],p[2],1.25)}}));
    if(arr){const u=Math.min(1,arr.t/1.1),hx=S.x+(-.72-S.x)*u,hz=arr.z0+(z0-.75-arr.z0)*u;D.push({z:hz-.01,f:()=>{const p=P(hx,y0*Math.min(1,u*1.4),hz);if(!p)return;
      blit(ST.heroSprite(s.stage,u<1?'back':'front',u<1?'run':'cheer',Math.floor(S.t*8)%4),p[0],p[1],p[2],1.45);if(u>=1){ctx.fillStyle='#e05a7a';const hx2=p[0]-p[2]*.25,hy=p[1]-p[2]*1.6-Math.abs(Math.sin(S.t*4))*p[2]*.15;ctx.font=Math.round(p[2]*.35)+'px sans-serif';ctx.textAlign='center';ctx.fillText('♥',hx2,hy)}}})}}}
  for(const it of s.items)if(!it.done&&it.z>camZ+.5&&it.z-camZ<45)D.push({z:it.z,f:()=>collectible(it)});
  if(S.phase==='interview'){D.push({z:S.dist+9,f:()=>{const p=P(0,0,S.dist+9);if(p)blit(ST.bossSprite('panel'),p[0],p[1],p[2],5.5)}})}
  const show=S.members.length&&!s.arrive&&['run','battle','shoot','boss','climb','scroll','mains','interview','revive'].includes(S.phase);
  if(show){const cy=(S.phase==='climb'||S.phase==='end')&&S.stepIdx>=0?(S.stepIdx+1)*.3:0,hz=S.dist-clusterR()*S.tight-.35,air=S.phase==='run'?airAt(hz):S.airY;
    D.push({z:hz,f:()=>{const p=P(S.x,cy+air,hz);if(!p)return;const k=p[2];if(!window.__r3on){ctx.fillStyle='rgba(255,210,60,.55)';ctx.beginPath();ctx.ellipse(p[0],p[1],k*.32,k*.1,0,0,6.283);ctx.fill()}
      const moving=S.phase==='run'||S.phase==='climb';if(!window.__r3on)blit(ST.heroSprite(s.stage,'back',moving?'run':'stand',moving?Math.floor(S.t*9)%4:0),p[0],p[1],k,1.4);s.hp=[p[0],p[1]-k*.6,k]}})}};
// ---------- screen overlay ----------
function bubble(text,x,y,maxW){ctx.font='700 15px system-ui,sans-serif';const L=wrapText(text,maxW-28);const h=L.length*20+20,w=Math.min(maxW,Math.max(...L.map(l=>ctx.measureText(l).width))+28);
  ctx.fillStyle='#fff';rrp(ctx,x-w/2,y,w,h,14);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=INK;ctx.stroke();ctx.beginPath();ctx.moveTo(x-10,y+h-1);ctx.lineTo(x,y+h+14);ctx.lineTo(x+10,y+h-1);ctx.fillStyle='#fff';ctx.fill();
  ctx.fillStyle=INK;ctx.textAlign='center';ctx.textBaseline='middle';L.forEach((l,i)=>ctx.fillText(l,x,y+20+i*20))}
window.storyOverlay=function(){const s=S&&S.story;if(!s)return;
  if(s.fx&&s.hp&&PL.settings.motion!==false){const u=s.fx.t,[x,y,k]=s.hp,R=Math.max(60,k*1.4)*(0.6+u);ctx.save();ctx.translate(x,y);
    if(s.fx.up){ctx.globalAlpha=Math.max(0,1-u/1.2);ctx.rotate(u*2);ctx.fillStyle='rgba(255,215,64,.55)';for(let i=0;i<12;i++){ctx.rotate(6.283/12);ctx.beginPath();ctx.moveTo(0,-R*.25);ctx.lineTo(R*.09,-R);ctx.lineTo(-R*.09,-R);ctx.closePath();ctx.fill()}
      ctx.rotate(-u*2);ctx.globalAlpha=Math.max(0,.9-u*2);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,R*.45,0,6.283);ctx.fill();
      ctx.globalAlpha=Math.max(0,1-u/1.2);for(let i=0;i<10;i++){const a=i*.628+u*3,r=R*(.4+u*.6);ctx.fillStyle=i%2?'#ffd23f':'#fff';ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,4,0,6.283);ctx.fill()}}
    else{ctx.globalAlpha=Math.max(0,.6-u);ctx.strokeStyle='#ff4d5e';ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,R*.5,0,6.283);ctx.stroke()}
    ctx.restore()}
  if(S.chai>0&&S.phase!=='done'){const hud=document.querySelector('.hud'),hb=hud?hud.getBoundingClientRect():null,cr=cv.getBoundingClientRect();
    const r=17,x=14+r,y=(hb?hb.bottom-cr.top:64)+10+r,gt=s.chaiGot==null?(s.chaiGot=S.t):s.chaiGot,pop=Math.max(0,1-(S.t-gt)*2.5),k=1+pop*.35;
    ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.globalAlpha=.94;ctx.fillStyle='#fff';ctx.strokeStyle='rgba(20,33,61,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r,0,6.283);ctx.fill();ctx.stroke();
    ctx.drawImage(itemSprite('chai'),-r+3,-r+1,2*r-6,2*r-6);
    if(S.chai>1){ctx.fillStyle='#f2601a';ctx.beginPath();ctx.arc(r*.75,-r*.75,8,0,6.283);ctx.fill();ctx.font='11px "Lilita One",sans-serif';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(S.chai,r*.75,-r*.75+.5)}
    ctx.restore()}else if(s)s.chaiGot=null;
  ST.bossHud&&ST.bossHud();
  if(s.arrive&&s.arrive.t>.9){ctx.globalAlpha=Math.min(1,(s.arrive.t-.9)*3);bubble(s.ch.line,W/2,H*.2,Math.min(W*.86,340));
    txt(s.ch.n.toUpperCase()+(s.final?': CHAPTER COMPLETE':''),W/2,H*.2-24,s.final?20:18,'#ffd23f');ctx.globalAlpha=1}};
})();

(function(){
'use strict';
const ST=window.STORY,{CH,STAGES}=ST;const URL_={};
const img=(k,c)=>URL_[k]||(URL_[k]=c().toDataURL());
const css=document.createElement('style');css.textContent=`
#storyLetter{position:fixed;left:50%;top:18%;transform:translate(-50%,-30px) rotate(-2deg);opacity:0;pointer-events:none;z-index:60;width:min(300px,82vw);background:#fff6e6;border:3px solid #14213d;border-radius:14px;box-shadow:0 6px 0 #14213d;padding:14px 16px;font:700 15px/1.35 system-ui,sans-serif;color:#14213d;transition:.35s}
#storyLetter.show{opacity:1;transform:translate(-50%,0) rotate(-2deg)}#storyLetter b{font-family:"Lilita One",sans-serif;font-weight:400;font-size:19px;color:#c0283a}#storyLetter p{margin:6px 0}#storyLetter span{font-size:12px;color:#5d6884}
.mnd .bimg{position:absolute;width:64px;height:auto;left:50%;top:-58px;transform:translateX(-50%);pointer-events:none;filter:drop-shadow(0 3px 0 rgba(20,33,61,.35))}
.mnd.lock .bimg{filter:grayscale(.85) brightness(.9);opacity:.75}
.mpin.hero{width:58px}.mpin.hero img{width:100%;display:block}
.mchip{display:inline-flex;gap:6px;align-items:center;margin:4px 6px 0 0;font:700 13px system-ui;color:#14213d}.mchip img{width:26px}
.mlet{background:#fff6e6;border:2px solid #14213d;border-radius:10px;padding:8px 10px;margin-top:8px;font:700 13px/1.35 system-ui;color:#14213d}`;
document.head.appendChild(css);
const BAND={village:['#bfe6a0','#9fd47f'],coaching:['#f3d9b5','#e6c290'],library:['#e9d6bd','#d6bb96'],exam:['#dfe6f2','#c3cfe2'],mains:['#efe4cf','#dcc9a5'],interview:['#f2d7b8','#e3b88c'],academy:['#cfe8d2','#a8d3ae'],chennai:['#bfe7f2','#f3e1b0']};
const LAND={village:'hut',coaching:'bld1',library:'shelf',exam:'examDesk',mains:'paper',interview:'chhatri',academy:'pine',chennai:'boat'};
window.openMap=function(){hideAll();const ov=$('mapov');ov.hidden=false;$('msheet').hidden=true;const SP=ST.SP();
  const OP=OPENL(),SOON=OP<CH.length*3?1:0,N=Math.max(9,Math.ceil((Math.max(level,OP)+(level>OP?4:1))/3)*3),cw=Math.min(ov.clientWidth||390,480),GAP=124,BOT=150,TOPP=260,H=BOT+(N-1)*GAP+TOPP;
  const X=l=>Math.round(cw/2+Math.sin(l*1.1+.5)*cw*.26),Y=l=>H-BOT-(l-1)*GAP;let rs=11;const r2=()=>(rs=(rs*16807)%2147483647)/2147483647;
  let bg='',dec='',top='';const nC=N/3;
  for(let c=0;c<nC;c++){const ch=CH[ST.chIdx(c*3+1)],y1=c===0?H:Y(c*3+1)+GAP/2,y0=c===nC-1?0:Y(c*3+3)-GAP/2,[a,b]=BAND[ch.k];
    bg+=`<rect x="0" y="${y0}" width="${cw}" height="${y1-y0}" fill="${a}"/>`;for(let k=0;k<10;k++)bg+=`<ellipse cx="${r2()*cw}" cy="${y0+r2()*(y1-y0)}" rx="${12+r2()*18}" ry="${4+r2()*4}" fill="${b}" opacity=".8"/>`;
    if(c>0)bg+=`<path d="M0 ${y1}h${cw}" stroke="#14213d" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" opacity=".35"/>`;
    const sy=Y(c*3+2),side=X(c*3+2)>cw/2?-1:1,sx=side<0?Math.max(70,X(c*3+2)-125):Math.min(cw-70,X(c*3+2)+125);
    dec+=signSVG(sx,sy-34,c*3<OP?'Ch '+(c+1)+': '+ch.n:'Exam Season '+(Math.floor((c*3-OP)/30)+1));
    const pk=LAND[ch.k],L=ST.propSprite&&ST.propSprite(pk);if(L)dec+=`<image href="${img('p_'+pk,()=>L)}" x="${sx-34}" y="${sy-12}" width="68" height="${68*L.height/L.width}"/>`;
    // family arch at chapter end
    const fy=Y(c*3+3)-6,fx=X(c*3+3)>cw/2?Math.max(52,X(c*3+3)-118):Math.min(cw-52,X(c*3+3)+118);
    dec+=`<image href="${img('fam',()=>ST.famSprite('amma',0))}" x="${fx-30}" y="${fy-50}" width="30" height="58"/><image href="${img('fam2',()=>ST.famSprite('appa',1))}" x="${fx}" y="${fy-50}" width="30" height="58"/>`;
    // collectibles hint
    const got=!!SP.letters[ST.chIdx(c*3+1)],ly=Y(c*3+1)-20,lx=X(c*3+1)>cw/2?28:cw-28;
    dec+=`<image href="${img('it_letter',()=>ST.itemSprite('letter'))}" x="${lx-18}" y="${ly-18}" width="36" height="36" opacity="${got?1:.35}"/>`;
    dec+=`<image href="${img('it_chai',()=>ST.itemSprite('chai'))}" x="${(lx<cw/2?cw-60:30)}" y="${Y(c*3+2)+30}" width="30" height="30"/>`;
    dec+=`<image href="${img('it_scroll',()=>ST.itemSprite('scroll'))}" x="${(lx<cw/2?cw-56:26)}" y="${Y(c*3+1)+28}" width="30" height="30"/>`}
  const pts=[[X(1),H-30]];for(let l=1;l<=N;l++)pts.push([X(l),Y(l)]);pts.push([cw/2,60]);
  const pd=a=>{let d=`M${a[0][0]} ${a[0][1]}`;for(let i=1;i<a.length;i++){const p0=a[i-1],p1=a[i],h=(p0[1]-p1[1])/2;d+=`C${p0[0]} ${p0[1]-h} ${p1[0]} ${p1[1]+h} ${p1[0]} ${p1[1]}`}return d};
  const all=pd(pts),done=pd(pts.slice(0,Math.min(level,N)+1));
  const road=`<path d="${all}" fill="none" stroke="rgba(20,33,61,.18)" stroke-width="34" stroke-linecap="round" transform="translate(0 6)"/><path d="${all}" fill="none" stroke="#14213d" stroke-width="32" stroke-linecap="round"/><path d="${all}" fill="none" stroke="#f6e7c4" stroke-width="24" stroke-linecap="round"/><path d="${done}" fill="none" stroke="#ffcf3a" stroke-width="24" stroke-linecap="round"/><path d="${all}" fill="none" stroke="#fff" stroke-width="3.5" stroke-dasharray="10 14" stroke-linecap="round" opacity=".9"/>`;
  dec+=`<g transform="translate(${X(1)-70} ${H-26})">${decoSVG('house',0,0,1.15)}</g>`+signSVG(Math.min(cw-62,X(1)+78),H-34,'Home village');
  const fogY=Y(Math.min(N,level+3))-GAP*.4;
  const fog=`<defs><linearGradient id="mfog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".97"/><stop offset=".75" stop-color="#fff" stop-opacity=".82"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect x="0" y="0" width="${cw}" height="${fogY}" fill="url(#mfog)"/>
    <g transform="translate(${cw/2} 120)"><text y="0" text-anchor="middle" font-family="Lilita One,system-ui" font-size="22" fill="#14213d">The Officer Journey</text><text y="22" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="12" fill="#4a5875">${OP/3} story chapters, then the endless Exam Season</text></g>`;
  let nodes='';const lockI='<svg class="lk" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="12" rx="3" fill="#5d6884"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="#5d6884" stroke-width="3"/></svg>';
  for(let l=1;l<=N;l++){const boss=ST.isBossLevel(l),st=PL.stars[l]||0,cls=l<level?'done':l===level?'cur':'lock',ch=ST.chOf(l),D=boss?ST.DEF[ch.boss]:null,tr=levelTier(l),sea=l>OP;
    nodes+=`<button class="mnd ${cls}${boss?' boss':''}${sea?' season':''}" data-l="${l}" style="left:${X(l)}px;top:${Y(l)}px" aria-label="${lvName(l)}">${boss?`<img class="bimg" src="${img('b_'+ch.boss,()=>ST.bossSprite(ch.boss))}" alt=""><span class="bt" style="background:${D.c}">BOSS</span>`:''}${cls==='lock'?lockI:sea?l-OP:l}${tr&&!boss?`<span class="tier t${tr}">${tr===2?'SUPER':'HARD'}</span>`:''}${l<level?`<span class="ms">${[0,1,2].map(i=>`<span class="${i<st?'on':''}">★</span>`).join('')}</span>`:''}</button>`}
  if(SOON){const nx=CH[OP/3];const mx=(X(OP)+X(OP+1))/2,sxp=mx>cw/2?Math.max(108,mx-150):Math.min(cw-108,mx+150);nodes+=`<div class="msoon" style="left:${sxp}px;top:${Y(OP)-GAP*.5}px"><b>Coming soon</b>Ch ${OP/3+1}: ${esc(nx.n)}. Exam Season is open now</div>`}
  const cl=Math.min(level,N),hs=Math.max(SP.best||0,ST.chOf(cl).base);
  nodes+=`<div class="mpin hero" style="left:${X(cl)}px;top:${Y(cl)-(ST.isBossLevel(cl)?40:30)}px"><img src="${img('hero'+hs,()=>ST.heroSprite(hs,'front','cheer',0))}" alt=""></div>`;
  $('mworld').style.width=cw+'px';$('mworld').style.height=H+'px';$('mworld').innerHTML=`<svg class="mbg" width="${cw}" height="${H}" viewBox="0 0 ${cw} ${H}" aria-hidden="true">${bg}${road}${dec}${fog}</svg>`+nodes;
  $('mapReg').textContent=level>OP?lvName(level):ST.chOf(level).n+', Level '+level;$('mapStars').textContent='★ '+totalStars();
  const due=dueIds().length;$('mapDue').hidden=!due;$('mapDue').textContent=due;
  const sc=$('mscroll');requestAnimationFrame(()=>{sc.scrollTop=Math.max(0,Y(cl)-sc.clientHeight*.62)});
  $('mworld').querySelectorAll('.mnd').forEach(b=>b.onclick=()=>mapNode(+b.dataset.l))};
window.mapNode=function(l){const m=$('msheet'),boss=ST.isBossLevel(l),ch=ST.chOf(l),ci=ST.chIdx(l),subs=subjFor(l),D=boss?ST.DEF[ch.boss]:null,st=PL.stars[l]||0,lock=l>level,SP=ST.SP();
  m.innerHTML=`<div class="mh"><h3>${l>OPENL()?esc(lvName(l)):`Chapter ${ci+1}, level ${(l-1)%3+1}`}${levelTier(l)?', '+TIER_NAME[levelTier(l)].toLowerCase():''}</h3><button class="x" id="msx">Close</button></div>
    <div class="mrow2"><span class="chip theme">${esc(ch.n)}</span>${subs.map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div>
    <div class="foe"><i style="background:${boss?D.c:'#8be36b'}"></i>${boss?'Boss: '+esc(D.n)+', answers in '+esc(D.sub==='MIX'?'all subjects':D.w):'Run, choose your road, grow as '+esc(STAGES[ch.base].n)}</div>
    <div><span class="mchip"><img src="${img('it_scroll',()=>ST.itemSprite('scroll'))}">Golden PYQ scroll, 3x marks</span><span class="mchip"><img src="${img('it_chai',()=>ST.itemSprite('chai'))}">Chai cup, free revive</span></div>
    ${SP.letters[ci]?`<div class="mlet">Letter found: ${esc(ST.LETTERS[ci])}</div>`:`<div class="mlet">A letter from home is hidden in this chapter.</div>`}
    ${lock?`<p class="note">Clear level ${l-1} to open this level.</p>`:starRow(st)}
    ${lock?'':`<button class="btn big" id="msplay">${l<level?'Play again':'Play'}</button>`}`;
  m.hidden=false;$('msx').onclick=()=>m.hidden=true;if(!lock)$('msplay').onclick=()=>start('level',{lv:l});sfx&&sfx.pop&&sfx.pop()};
})();

