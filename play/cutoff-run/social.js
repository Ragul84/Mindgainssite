// ===================== Cut-Off Run: social layer (Daily Paper, All-India Mock, groups, Bharat Board, sharing) =====================
// Loaded after story.js. Shares the main script's globals (PL, ROUND, REMOTE, CONFIG, DEV, $, esc, miga, start, openMenu ...).
// Server side: worker/game-social.js.
(function(){
'use strict';
const STATES={AN:'Andaman and Nicobar',AP:'Andhra Pradesh',AR:'Arunachal Pradesh',AS:'Assam',BR:'Bihar',CH:'Chandigarh',CT:'Chhattisgarh',DH:'Dadra, Nagar Haveli, Daman and Diu',DL:'Delhi',GA:'Goa',GJ:'Gujarat',HR:'Haryana',HP:'Himachal Pradesh',JK:'Jammu and Kashmir',JH:'Jharkhand',KA:'Karnataka',KL:'Kerala',LA:'Ladakh',LD:'Lakshadweep',MP:'Madhya Pradesh',MH:'Maharashtra',MN:'Manipur',ML:'Meghalaya',MZ:'Mizoram',NL:'Nagaland',OR:'Odisha',PY:'Puducherry',PB:'Punjab',RJ:'Rajasthan',SK:'Sikkim',TN:'Tamil Nadu',TG:'Telangana',TR:'Tripura',UP:'Uttar Pradesh',UK:'Uttarakhand',WB:'West Bengal'};
window.STATE_NAME=c=>STATES[c]||'';
const KIND_NAME={friends:'Study group',coaching:'Coaching centre',college:'College',creator:'Creator board'};
const HOME=location.origin+location.pathname.replace(/[^/]*$/,'');
const online=()=>!!CONFIG.gameApi;
const nf=n=>Number(n||0).toLocaleString('en-IN');
// Percentiles mean little on a tiny field, so they show from 10 players up.
const rankTxt=ev=>ev.rank===1?`#1 in India of ${nf(ev.total)}`:`All-India rank ${nf(ev.rank)} of ${nf(ev.total)}`+(ev.total>=10?` (top ${ev.top_pct}%)`:'');
async function api(path,body){const q=path.includes('?')?'&':'?';
  const r=await fetch(gameUrl(path+(body?'':q+'device='+DEV)),body?{method:'POST',credentials:'same-origin',headers:Object.assign({'content-type':'application/json'},authH()),body:JSON.stringify(Object.assign({device:DEV},body))}:{credentials:'same-origin',headers:authH()});
  const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Network error, try again');return j}
function sheet(html,back){hideAll();$('pcard').innerHTML=html;$('pop').hidden=false;$('pcard').scrollTop=0;const b=$('sbBack');if(b)b.onclick=back||(()=>{$('pop').hidden=true;openMenu()})}
const hdr=t=>`<div class="hdr"><h2>${t}</h2><button class="x" id="sbBack">Back</button></div>`;
const say=(t,m)=>`<div class="stage"><div class="bubble r">${esc(t)}</div>${miga(m||'point')}</div>`;
function needOnline(){sheet(hdr('Needs internet')+say('This one runs live with players across India. Connect to the internet and try again.','think'))}

// ---------- sharing: WhatsApp first, native share sheet second ----------
window.shareRow=small=>`<div class="bgrid"><button class="btn sm" id="shWa" style="background:linear-gradient(#4ee07a,#1fa855)">WhatsApp</button><button class="btn blue sm" id="shNat">${small?'Share link':'Share card'}</button></div>`;
window.shareBind=(canvas,text,code,extra)=>{const link=HOME+(extra||(code?'?c='+encodeURIComponent(code):''));const full=text+'\n'+link;
  if($('shWa'))$('shWa').onclick=()=>{track('share',{to:'wa'});open('https://wa.me/?text='+encodeURIComponent(full),'_blank','noopener')};
  if($('shNat'))$('shNat').onclick=async()=>{track('share',{to:'native'});
    try{if(canvas&&navigator.canShare){const blob=await new Promise(res=>canvas.toBlob(res,'image/png'));const file=new File([blob],'cutoff-run.png',{type:'image/png'});
      if(navigator.canShare({files:[file]})){await navigator.share({files:[file],text:full});return}}
      if(navigator.share){await navigator.share({text,url:link});return}}catch(e){if(e&&e.name==='AbortError')return}
    copyText(full,$('shNat'))}};

// ---------- Daily Paper + All-India Mock ----------
let PAPER_CACHE=null;
async function startEvent(kind){if(!online())return needOnline();
  if(!PL.state)return openProfile(()=>startEvent(kind));
  sheet(hdr(kind==='mock'?'All-India Mock':'Daily Paper')+say('Fetching the paper. Same questions for every aspirant in India...','think'));
  const tk=kind==='paper'&&(PL.exam==='neet'||PL.exam==='jee')?PL.exam:'';
  let j;try{j=await api(kind==='mock'?'/mock':'/paper'+(tk?'?exam='+tk:''))}catch(e){return sheet(hdr('Not now')+say(e.message,'sad'))}
  if(kind==='mock'&&!j.live)return openMock(j);
  if(j.mine)return showEventResult(kind,j.ev,j.mine,j.no);
  const rows=(j.items||[]).map(mapRemoteRow).filter(Boolean);if(rows.length<5)return sheet(hdr('Not now')+say('The paper is not ready. Try again in a minute.','sad'));
  mergeRemote(rows);ROUND={token:j.token,ids:new Set(rows.map(x=>x.id)),at:Date.now(),spent:false,paper:true};
  window.PAPER={kind,ev:j.ev,no:j.no,ids:rows.map(x=>x.id),secs:j.secs||150,title:kind==='mock'?'All-India Mock':(tk?tk.toUpperCase()+' ':'Daily ')+'Paper #'+j.no};
  track('event_start',{kind});$('pop').hidden=true;start('paper')}
const gridEmoji=g=>String(g||'').split('').map(c=>c==='G'?'🟩':c==='R'?'🟥':'⬜').join('');
function eventText(kind,no,grid,ev){const c=(grid.match(/G/g)||[]).length;
  return `${kind==='mock'?'MindGains All-India Mock':'MindGains '+(window.PAPER&&PAPER.title||'Daily Paper #'+no)} ${c}/${grid.length}\n${gridEmoji(grid)}${ev?'\n'+rankTxt(ev):''}${PL.state?' · '+STATE_NAME(PL.state):''}`}
window.paperBlock=r=>{if(r.mode!=='paper'||!window.PAPER)return'';const g=r.log.map(l=>l.skipped?'S':l.ok?'G':'R').join(''),ev=r.league&&r.league.event;
  return`<div class="r2note" style="font-size:22px;letter-spacing:2px">${gridEmoji(g)}</div><div class="r2note">${ev?`<b>${rankTxt(ev)}</b>`:PL.consent?'Getting your all-India rank...':'Allow the privacy setting to get your all-India rank'}</div>${shareRow(true)}<button class="r2sec" id="evBoard">See today's toppers</button>`};
window.paperBind=r=>{if(r.mode!=='paper'||!window.PAPER)return;const P=PAPER,g=r.log.map(l=>l.skipped?'S':l.ok?'G':'R').join('');
  // The first-ever run asks for consent after the result shows; submit the paper once it is given.
  if(PL.consent&&ROUND&&ROUND.paper&&!ROUND.spent&&!r.subm){r.subm=true;Remote.submitRun(r).then(j=>{if(j&&lastRes===r){r.league=j;renderResult('','rev')}})}
  shareBind(null,eventText(P.kind,P.no,g,r.league&&r.league.event),null,P.kind==='mock'?'?mock=1':'?paper=1');
  if($('evBoard'))$('evBoard').onclick=()=>openEventBoard(P.ev,P.kind);
  if($('again')){$('again').textContent='Play level '+level;$('again').onclick=()=>start('level',{lv:level})}};
function showEventResult(kind,ev,mine,no){
  sheet(hdr(kind==='mock'?'All-India Mock':'Daily Paper #'+no)+say(kind==='mock'?'You already sat this mock. Here is how you did.':'You already sat today\'s paper. A new one comes at midnight.',mine.top_pct<=10?'cheer':'happy')+
    `<div class="codebox" style="font-size:26px;letter-spacing:3px">${gridEmoji(mine.grid)}</div><p class="note ctr"><b>${rankTxt(mine)}</b><br>${mine.correct} right, ${mine.wrong} wrong, ${mine.skipped} skipped</p>${shareRow(true)}<button class="btn blue sm" id="evB">See the toppers</button>`);
  shareBind(null,eventText(kind,no,mine.grid,mine),null,kind==='mock'?'?mock=1':'?paper=1');$('evB').onclick=()=>openEventBoard(ev,kind)}
async function openEventBoard(ev,kind){let j;try{j=await api('/event?ev='+encodeURIComponent(ev)+(PL.state?'':''))}catch(e){j={rows:[]}}
  const st=PL.state;let js=null;if(st){try{js=await api('/event?ev='+encodeURIComponent(ev)+'&state='+st)}catch(e){}}
  const list=rows=>rows.length?`<ul class="lg">${rows.map(x=>`<li class="${x.me?'me':''}"><span>#${x.rank}</span><span>${esc(x.name)} <small>${esc(STATE_NAME(x.state))}</small></span><span>${x.correct} ✓</span></li>`).join('')}</ul>`:'<p class="note ctr">No one yet. Be the first!</p>';
  sheet(hdr(kind==='mock'?'Mock toppers':'Today\'s toppers')+`<div class="eyebrow">All India</div>${list(j.rows||[])}${js?`<div class="eyebrow" style="margin-top:12px">${esc(STATE_NAME(st))}</div>${list(js.rows||[])}`:''}`)}
function fmtWhen(ms){const d=new Date(ms);return d.toLocaleString('en-IN',{weekday:'long',hour:'numeric',minute:'2-digit',timeZone:'Asia/Kolkata'})+' IST'}
function openMock(j){const left=Math.max(0,j.starts_at-Date.now()),h=Math.floor(left/36e5),m=Math.floor(left%36e5/6e4);
  sheet(hdr('All-India Mock')+say('Every Sunday, 8 PM. One hour. The same 20 questions for every aspirant in India. Then a real all-India rank.','wow')+
    `<div class="codebox" style="font-size:22px">${h>=24?Math.floor(h/24)+'d '+(h%24)+'h':h+'h '+m+'m'}</div><p class="note ctr">Next mock: ${fmtWhen(j.starts_at)}${j.finished?`<br>${nf(j.finished)} aspirants sat the last one`:''}</p>${j.mine?`<button class="btn blue sm" id="mkLast">My last mock result</button>`:''}${shareRow(true)}`);
  shareBind(null,'Join me for the MindGains All-India Mock, Sunday 8 PM. Same 20 questions for all of India, real all-India rank 👇',null,'?mock=1');
  if($('mkLast'))$('mkLast').onclick=()=>showEventResult('mock',j.ev,j.mine)}

// ---------- profile: state (for the Bharat Board) ----------
function openProfile(then){const opts=Object.keys(STATES).sort((a,b)=>STATES[a].localeCompare(STATES[b])).map(k=>`<option value="${k}"${PL.state===k?' selected':''}>${esc(STATES[k])}</option>`).join('');
  const EX={'':'Mixed (general studies)',upsc:'UPSC',tnpsc:'TNPSC',ssc:'SSC',rrb:'RRB',banking:'Banking',neet:'NEET',jee:'JEE'};
  const sel='style="text-transform:none;font-size:18px;margin-bottom:8px"';
  sheet(hdr('Your state and exam')+say('Your marks count for your state on the Bharat Board. Your exam decides the questions.','happy')+`<select class="inp" id="stIn" ${sel}><option value="">Choose your state</option>${opts}</select><select class="inp" id="exIn" ${sel}>${Object.keys(EX).map(k=>`<option value="${k}"${(PL.exam||'')===k?' selected':''}>${EX[k]}</option>`).join('')}</select><div class="err" id="stErr"></div><button class="btn" id="stGo">Save</button>`);
  $('stGo').onclick=()=>{const v=$('stIn').value,ex=$('exIn').value;if(!v){$('stErr').textContent='Choose your state first.';return}
    const exCh=(PL.exam||'')!==ex;PL.state=v;PL.exam=ex;saveP();track('state_set',{s:v,ex});if(exCh)try{Remote.loadQuestions(subjFor(level),{})}catch(e){}
    then?then():openBharat()}}
window.openProfile=openProfile;

// ---------- groups: study groups, coaching centres, colleges, creators ----------
async function openGroups(tab){if(!online())return needOnline();tab=tab||'';
  let j;try{j=await api('/groups'+(tab?'?kind='+tab:''))}catch(e){return sheet(hdr('Groups')+say(e.message,'sad'))}
  const tabs=['','friends','coaching','college','creator'].map(k=>`<button class="r2link" data-k="${k}" style="${k===tab?'text-decoration:underline;font-weight:900':''}">${k?KIND_NAME[k]+'s':'All'}</button>`).join(' ');
  const mine=(j.mine||[]).map(g=>`<li data-g="${g.code}"><span>${esc(KIND_NAME[g.kind]||'')[0]}</span><span>${esc(g.name)} <small>${g.code}</small></span><span>Open</span></li>`).join('');
  const top=(j.rows||[]).map(g=>`<li data-g="${g.code}"><span>#${g.rank}</span><span>${esc(g.name)} <small>${esc(KIND_NAME[g.kind])}, ${g.members}</small></span><span>${nf(g.total)}</span></li>`).join('');
  sheet(hdr('Groups')+say('Race as a team. Your study group, coaching centre or college against the rest of India.','cheer')+
    (mine?`<div class="eyebrow">My groups</div><ul class="lg">${mine}</ul>`:'')+
    `<div class="bgrid" style="margin:10px 0"><button class="btn sm" id="gNew">Start a group</button><button class="btn blue sm" id="gJoin">Join with code</button></div>
    <div class="eyebrow">Group league this week</div><div style="margin:4px 0 6px">${tabs}</div>${top?`<ul class="lg">${top}</ul>`:'<p class="note ctr">No group has 3 members yet. Start one and invite 2 friends!</p>'}`);
  $('pcard').querySelectorAll('[data-g]').forEach(li=>{li.style.cursor='pointer';li.onclick=()=>openGroup(li.dataset.g)});
  $('pcard').querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>openGroups(b.dataset.k));
  $('gNew').onclick=newGroup;$('gJoin').onclick=()=>joinGroup('')}
window.openGroups=openGroups;
function newGroup(){sheet(hdr('Start a group')+say('Name it, send the link on WhatsApp, and climb the group league together.','happy')+
  `<input class="inp" id="gName" maxlength="32" placeholder="Group name" style="text-transform:none"><select class="inp" id="gKind" style="text-transform:none;font-size:18px;margin-top:8px">${Object.keys(KIND_NAME).map(k=>`<option value="${k}">${KIND_NAME[k]}</option>`).join('')}</select><p class="note">Creator boards are for teachers, YouTubers and Telegram channels: share the link and your followers race on your board.</p><div class="err" id="gErr"></div><button class="btn" id="gGo">Create</button>`,()=>openGroups());
  $('gGo').onclick=async()=>{$('gGo').disabled=true;try{const j=await api('/group/create',{name:$('gName').value,kind:$('gKind').value});track('group_create',{kind:j.kind});openGroup(j.code,true)}catch(e){$('gErr').textContent=e.message;$('gGo').disabled=false}}}
function joinGroup(code){sheet(hdr('Join a group')+say('Got a group code from a friend? Type it here.','wow')+`<input class="inp" id="gCode" maxlength="6" placeholder="ABC123" value="${esc(code)}"><div class="err" id="gErr"></div><button class="btn" id="gGo">Join</button>`,()=>openGroups());
  $('gGo').onclick=async()=>{$('gGo').disabled=true;try{const j=await api('/group/join',{code:$('gCode').value});track('group_join',{kind:j.kind});openGroup(j.code)}catch(e){$('gErr').textContent=e.message;$('gGo').disabled=false}}}
async function openGroup(code,fresh){let j;try{j=await api('/group?code='+encodeURIComponent(code))}catch(e){return sheet(hdr('Group')+say(e.message,'sad'),()=>openGroups())}
  const rows=j.rows.map(x=>`<li class="${x.me?'me':''}"><span>#${x.rank}</span><span>${esc(x.name)}</span><span>${nf(x.score)}</span></li>`).join('');
  sheet(hdr(esc(j.name))+say(fresh?'Group ready! Send the invite link to your batch.':`${KIND_NAME[j.kind]}, ${j.members} member${j.members>1?'s':''}, ${nf(j.total)} marks this week.`,fresh?'cheer':'point')+
    `<div class="codebox">${j.code}</div>${shareRow(true)}${j.member?'':'<button class="btn" id="gJn">Join this group</button>'}<div class="eyebrow" style="margin-top:10px">This week</div><ul class="lg">${rows}</ul>${j.member?'<button class="r2link" id="gLv" style="margin-top:10px;align-self:center">Leave group</button>':''}`,()=>openGroups());
  shareBind(null,`Join "${j.name}" on Cut-Off Run. We race the UPSC cut-off as a team every week 👇`,null,'?g='+j.code);
  if($('gJn'))$('gJn').onclick=async()=>{try{await api('/group/join',{code:j.code});openGroup(j.code)}catch(e){alert(e.message)}};
  if($('gLv'))$('gLv').onclick=async()=>{if(!confirm('Leave '+j.name+'?'))return;try{await api('/group/leave',{code:j.code})}catch(e){}openGroups()}}

// ---------- Bharat Board ----------
// Tile map: one square per state or UT, placed roughly where it sits. Not to scale and no borders drawn,
// so it never misstates a boundary. [col,row] on a 9 x 8 grid.
const TILE={JK:[2,0],LA:[3,0],CH:[1,1],PB:[2,1],HP:[3,1],UK:[4,1],SK:[6,1],AR:[8,1],RJ:[1,2],HR:[2,2],DL:[3,2],UP:[4,2],BR:[5,2],WB:[6,2],AS:[7,2],NL:[8,2],
  GJ:[1,3],MP:[2,3],CT:[3,3],JH:[4,3],ML:[7,3],MN:[8,3],DH:[0,4],MH:[1,4],TG:[2,4],OR:[3,4],TR:[7,4],MZ:[8,4],GA:[1,5],KA:[2,5],AP:[3,5],
  LD:[0,6],KL:[2,6],TN:[3,6],PY:[4,6],AN:[6,6]};
function tileMap(st,max){const by={};st.forEach((s,i)=>by[s.code]=Object.assign({rank:i+1},s));const Z=38,G=4;
  const cells=Object.keys(TILE).map(k=>{const [c,r]=TILE[k],d=by[k],f=d?.25+.75*Math.sqrt(d.total/max):0,me=k===PL.state;
    const fill=d?`rgba(255,${Math.round(153-50*f)},${Math.round(51*(1-f))},${(.35+.65*f).toFixed(2)})`:'#e9eef6';
    return`<g data-st="${k}" style="cursor:pointer"><rect x="${c*(Z+G)}" y="${r*(Z+G)}" width="${Z}" height="${Z}" rx="7" fill="${fill}" stroke="${me?'#14213d':'#c9d3e6'}" stroke-width="${me?3:1.5}"/><text x="${c*(Z+G)+Z/2}" y="${r*(Z+G)+Z/2+(d?-2:4)}" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="12" fill="#14213d">${k}</text>${d?`<text x="${c*(Z+G)+Z/2}" y="${r*(Z+G)+Z/2+11}" text-anchor="middle" font-family="system-ui" font-weight="800" font-size="9" fill="#14213d">#${d.rank}</text>`:''}<title>${esc(STATES[k])}${d?`: #${d.rank}, ${nf(d.players)} playing`:''}</title></g>`}).join('');
  return`<svg viewBox="-2 -2 ${9*(Z+G)} ${7*(Z+G)}" width="100%" role="img" aria-label="Tile map of Indian states, coloured by marks this week" style="display:block;margin:4px 0">${cells}</svg><p class="note ctr" id="bTip" style="margin:0">Tap a state. Tile map, not to scale.</p>`}
async function openBharat(){if(!online())return needOnline();let j;try{j=await api('/bharat')}catch(e){return sheet(hdr('Bharat Board')+say(e.message,'sad'))}
  const st=j.states||[],max=Math.max(1,...st.map(s=>s.total)),my=st.findIndex(s=>s.code===PL.state);
  const rows=st.map((s,i)=>`<div class="mrow" style="${s.code===PL.state?'font-weight:900;background:#fff3c4;border-radius:8px':''}"><span>#${i+1} ${esc(s.name)}</span><i class="mbar"><b style="width:${Math.round(s.total/max*100)}%;background:linear-gradient(90deg,#ff9933,#138808)"></b></i><small>${nf(s.players)} playing${s.paper?`, paper ${s.paper_avg}/10`:''}</small></div>`).join('');
  sheet(hdr('Bharat Board')+say(PL.state?(my>=0?`${STATE_NAME(PL.state)} is #${my+1} in India this week!`:`${STATE_NAME(PL.state)} is not on the board yet. Your next run puts it there!`):'Which state has the sharpest aspirants? Pick yours and play for it.',my===0?'cheer':'point')+
    `<div class="eyebrow">India this week</div>${tileMap(st,max)}<div class="eyebrow" style="margin-top:10px">States ranked</div><div class="mast">${rows||'<p class="note ctr">The board fills up as India plays.</p>'}</div><button class="btn blue sm" id="bSt">${PL.state?'Change my state':'Pick my state'}</button>${PL.state&&my>=0?shareRow(true):''}`);
  $('pcard').querySelectorAll('[data-st]').forEach(g=>g.onclick=()=>{const k=g.dataset.st,i=st.findIndex(x=>x.code===k),d=st[i];$('bTip').textContent=d?`${STATES[k]}: #${i+1}, ${nf(d.players)} playing, ${nf(d.total)} marks`:`${STATES[k]}: no runs yet this week`});
  $('bSt').onclick=()=>openProfile();if(PL.state&&my>=0)shareBind(null,`${STATE_NAME(PL.state)} is #${my+1} on the MindGains Bharat Board this week. Play for our state 👇`)}
window.openBharat=openBharat;

// ---------- menu: paper/mock buttons, exam countdown ----------
const _openMenu=openMenu;
openMenu=function(){_openMenu();
  const pb=$('paperBtn'),mb=$('mockBtn');if(pb)pb.onclick=()=>startEvent('paper');if(mb)mb.onclick=()=>startEvent('mock');
  const ex=(CONFIG.examDates||[]).map(e=>({n:e.name,d:Math.ceil((new Date(e.date+'T00:00:00+05:30')-Date.now())/864e5)})).filter(e=>e.d>=0).sort((a,b)=>a.d-b.d)[0];
  if(ex&&$('mchips'))$('mchips').insertAdjacentHTML('beforeend',`<span class="chip">⏳ ${esc(ex.n)} in ${ex.d} day${ex.d===1?'':'s'}</span>`);
  if(online()&&mb)fetch(gameUrl('/mock?status=1&device='+DEV)).then(r=>r.json()).then(j=>{if(j.live){mb.classList.add('live');($('mockSub')||mb).textContent='LIVE now · tap to join'}}).catch(()=>{})};

// ---------- deep links: ?c=challenge  ?g=group  ?paper=1  ?mock=1 ----------
function deepLink(){const p=new URLSearchParams(location.search);if(![...p.keys()].length)return;
  history.replaceState(null,'',location.pathname);track('deeplink',{k:[...p.keys()].join(',')});
  if(p.get('g'))return joinGroup(p.get('g').toUpperCase().slice(0,6));
  if(p.get('paper'))return startEvent('paper');
  if(p.get('mock'))return startEvent('mock');
  if(p.get('c')){openCode();const i=$('codeIn');if(i){i.value=p.get('c').toUpperCase().slice(0,40);setTimeout(()=>$('kgo')&&$('kgo').click(),50)}}}
openMenu();deepLink();

// ---------- installable: register the site service worker (push only, no offline cache) ----------
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('/sw.js').catch(()=>{});
})();
