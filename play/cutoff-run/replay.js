// ===================== Cut-Off Run: run replays (a short portrait clip to post on WhatsApp Status, Reels or Shorts) =====================
// Loaded after social.js. Records the game canvas plus the question card into a 540 x 960 clip while a run plays.
// Two recorders overlap by SEG ms, so at the end there is always one that holds the last 8 to 16 seconds.
// Off on slow devices (__lowQ) and when PL.settings.replay === false. No upload: the clip stays on the phone until shared.
(function(){
'use strict';
const OK=!!(window.MediaRecorder&&HTMLCanvasElement.prototype.captureStream);
const MIME=OK?['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(m=>{try{return MediaRecorder.isTypeSupported(m)}catch(e){return false}}):null;
const W=540,H=960,SEG=8000;
let comp=null,cx=null,stream=null,recs=[],raf=0,rot=0,frame=0,clip=null;
const on=()=>!!(MIME&&!window.__lowQ&&PL.settings.replay!==false);

function wrapText(t,x,y,maxW,lh,maxLines){const words=String(t).replace(/\s+/g,' ').trim().split(' '),lines=[];let line='';
  for(const w of words){const test=line?line+' '+w:w;if(line&&cx.measureText(test).width>maxW){lines.push(line);line=w}else line=test}
  if(line)lines.push(line);const out=lines.slice(0,maxLines);if(lines.length>maxLines)out[maxLines-1]=out[maxLines-1].replace(/\s*\S*$/,'')+'...';
  out.forEach((l,k)=>cx.fillText(l,x,y+k*lh));return out.length}
function paint(){raf=requestAnimationFrame(paint);if((frame++)&1)return; // about 30 fps
  const c=document.getElementById('c');if(!c||!c.width)return;
  const k=Math.max(W/c.width,H/c.height),dw=c.width*k,dh=c.height*k;
  cx.fillStyle='#14213d';cx.fillRect(0,0,W,H);cx.drawImage(c,(W-dw)/2,(H-dh)/2,dw,dh);
  const q=$('q');
  if(q&&!q.hidden){cx.fillStyle='rgba(255,255,255,.95)';cx.beginPath();cx.roundRect?cx.roundRect(18,18,W-36,236,22):cx.rect(18,18,W-36,236);cx.fill();
    cx.fillStyle='#d6336c';cx.font='800 18px Nunito,system-ui,sans-serif';cx.textAlign='left';cx.textBaseline='top';cx.fillText(($('qno').textContent+'  '+$('qsub').textContent).toUpperCase(),38,34);
    cx.fillStyle='#14213d';cx.font='900 25px Nunito,system-ui,sans-serif';const n=wrapText($('qt').textContent,38,62,W-76,31,3);
    cx.font='800 19px Nunito,system-ui,sans-serif';cx.fillStyle='#2f3d5c';
    [...$('opts').children].slice(0,4).forEach((o,i)=>cx.fillText('ABCD'[i]+'  '+o.textContent.replace(/\s+/g,' ').trim().replace(/^[A-D]\s*/,'').slice(0,22),38+(i%2)*(W-76)/2,72+n*31+Math.floor(i/2)*28))}
  const b=$('banner'),bt=b&&(b.firstChild&&b.firstChild.nodeType===3?b.firstChild.textContent:b.textContent).trim();if(bt&&b.classList.contains('show')){cx.font='400 46px "Lilita One","Arial Black",sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.lineWidth=9;cx.strokeStyle='#14213d';cx.strokeText(bt.slice(0,22),W/2,H*.42);cx.fillStyle='#ffd23f';cx.fillText(bt.slice(0,22),W/2,H*.42)}
  cx.fillStyle='rgba(20,33,61,.88)';cx.fillRect(0,H-74,W,74);cx.textAlign='center';cx.textBaseline='middle';
  cx.font='400 30px "Lilita One","Arial Black",sans-serif';cx.fillStyle='#ff8a1f';cx.fillText('CUT-OFF RUN',W/2,H-48);
  cx.font='800 17px Nunito,system-ui,sans-serif';cx.fillStyle='#fff';cx.fillText(($('lvl').textContent||'')+'  ·  mindgains.ai/play/cutoff-run',W/2,H-20)}
function newRec(){const r={chunks:[],at:Date.now(),mr:new MediaRecorder(stream,{mimeType:MIME,videoBitsPerSecond:1500000})};
  r.mr.ondataavailable=e=>{if(e.data&&e.data.size)r.chunks.push(e.data)};r.mr.start(1000);recs.push(r);
  while(recs.length>2){const old=recs.shift();try{old.mr.stop()}catch(e){}}}
function halt(){clearInterval(rot);rot=0;cancelAnimationFrame(raf);raf=0}
window.replayStart=()=>{window.replayAbort();if(!on())return;
  try{if(!comp){comp=document.createElement('canvas');comp.width=W;comp.height=H;cx=comp.getContext('2d');stream=comp.captureStream(30)}
    frame=0;paint();newRec();rot=setInterval(newRec,SEG)}catch(e){halt();track('replay_error',{m:String(e).slice(0,80)})}};
window.replayAbort=()=>{halt();for(const r of recs){try{r.mr.stop()}catch(e){}}recs=[]};
// Keep the recorder that started first (8 to 16 s of footage), drop the other.
window.replayStop=()=>{if(!recs.length)return;halt();const keep=recs[0],drop=recs.slice(1);recs=[];
  for(const r of drop){try{r.mr.stop()}catch(e){}}
  if(Date.now()-keep.at<2500){try{keep.mr.stop()}catch(e){}return}
  // Called at the top of showResult, so lastRes is still the previous run here. The recorder's onstop fires
  // after showResult has set the new lastRes, so the clip is tied to the run then.
  keep.mr.onstop=()=>{const blob=new Blob(keep.chunks,{type:MIME.split(';')[0]}),run=lastRes;if(blob.size<20000||!run)return;
    clip={blob,ext:MIME.includes('mp4')?'mp4':'webm',run};if(!$('result').hidden&&window.renderResult)renderResult('',run.sheet||'')};
  try{keep.mr.stop()}catch(e){}};
window.replayBlock=r=>clip&&clip.run===r?`<button class="r2sec" id="rpShare">🎬 Share replay</button>`:'';
window.replayBind=r=>{const b=$('rpShare');if(!b||!clip)return;
  b.onclick=async()=>{track('replay_share',{ext:clip.ext});const file=new File([clip.blob],'cutoff-run.'+clip.ext,{type:clip.blob.type});
    const text=r.win&&!r.quick?`I cleared it in Cut-Off Run 🔥 Can you? ${location.origin}/play/cutoff-run/`:`Cut-Off Run, ${location.origin}/play/cutoff-run/`;
    try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text});return}}catch(e){if(e&&e.name==='AbortError')return}
    // No file sharing (most desktops): save it, then the player posts it themselves.
    const a=document.createElement('a');a.href=URL.createObjectURL(clip.blob);a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),5000);
    b.textContent='Saved. Post it on WhatsApp Status or Reels!'}};
const _om=openMenu;openMenu=function(){window.replayAbort();_om()};
})();
