(function(){
if(window.__nexoMiEspacioApp)return;window.__nexoMiEspacioApp=true;
const CSS='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/mi-espacio-ui.css?v=nexo-icon-gallery-20261001-63';
const NUMA_CSS='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/numa/presence.css?v=20261001-presence-4';
const NEXO_LOGO='https://static.wixstatic.com/media/8b64a8_7bd85ca8e1854afc9ae91eab7457c405~mv2.png';
const NEXO_PENDING_PIN='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/assets/recurso-5.svg?v=night-gold-accent-system-20260930-42';
const ACCESS_REVISION='workspace-access-cleanup-20261001-4';
const freeSite=/\.(wixstudio|wixsite)\.com$/i.test(location.hostname);
const apiBase=freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'';
const API=apiBase+'/_functions/nexoMiEspacioUi';
let accessStage='WAITING_PAGE';
function accessError(code){return new Error('No se pudo completar el acceso ('+ACCESS_REVISION+' / '+accessStage+' / '+code+'). Reintenta.')}
function loginVisible(visible){const r=document.getElementById('nxo-app');if(r)r.style.display=visible?'none':'';document.body.classList.toggle('nxo-lock',!visible)}
function retryAccess(){const u=new URL(location.href);['nxm','nxme','nxms','nxav'].forEach(k=>u.searchParams.delete(k));location.replace(u.href)}
let sessionToken='',personal=null,workspace=null,workspaceTab='tools',workspaceMembers=null,workspaceRoles=null,workspaceToolConfig=null,workspaceRecipeComments=null,workspacePendingNotes=null;
let workspaceNotificationPollTimer=null,workspaceNotificationPollInFlight=false,workspaceNotificationPollWorkspaceId='',workspaceNotificationSignature='',workspaceNotificationVisibilityBound=false;
let scheduleWeekStart='',scheduleData=null,scheduleImportData=null,scheduleDebug=null,scheduleAnalysisBusy=false,scheduleDebugModal=null,scheduleOcrLoaderPromise=null;
const NEXO_THEME_KEY='nexoTheme:v1';
const NEXO_LANGUAGE_KEY='nexoLanguage:v1';
function storedTheme(){try{const v=localStorage.getItem(NEXO_THEME_KEY);return v==='night'?'night':'day'}catch(_){return'day'}}
function normalizeLanguage(value){return String(value||'').toLowerCase().startsWith('en')?'en':'es'}
function storedLanguage(){try{return normalizeLanguage(localStorage.getItem(NEXO_LANGUAGE_KEY)||'es')}catch(_){return'es'}}
function currentLanguage(){return normalizeLanguage(personal?.profile?.locale||storedLanguage())}
function ui(es,en){return currentLanguage()==='en'?en:es}
function applyLanguage(value,persist=true){
  const lang=normalizeLanguage(value);
  document.documentElement.lang=lang;
  if(persist)try{localStorage.setItem(NEXO_LANGUAGE_KEY,lang)}catch(_){}
  if(personal?.profile)personal.profile.locale=lang;
  return lang
}
async function setGlobalLanguage(value){
  const lang=applyLanguage(value,true);
  try{
    if(sessionToken)await api('profile.locale.set',{locale:lang});
    if(workspace)renderWorkspace();else if(personal)renderPersonal();
    toast(lang==='en'?'Language changed to English':'Idioma cambiado a Español')
  }catch(e){
    toast(e.message||String(e))
  }
}
function applyTheme(theme,persist=true){
  const t=theme==='night'?'night':'day';
  const r=document.getElementById('nxo-app');
  if(r)r.dataset.theme=t;
  document.documentElement.dataset.nxoTheme=t;
  if(document.body)document.body.dataset.nxoTheme=t;
  if(persist)try{localStorage.setItem(NEXO_THEME_KEY,t)}catch(_){}
  const b=document.getElementById('nxo-theme-toggle');
  if(b){
    const night=t==='night';
    if(b.classList.contains('nxo-quick-setting-row')){
      const value=b.querySelector('strong');
      if(value)value.textContent=night?ui('Oscuro','Dark'):ui('Claro','Light');
    }else{
      b.textContent=night?'☀':'☾';
    }
    const themeIcon=b.querySelector('[data-nxo-theme-icon]');if(themeIcon)themeIcon.src=iconUrl(night?'modo-oscuro':'modo-claro');
    b.setAttribute('aria-label',night?ui('Cambiar a modo diurno','Switch to light mode'):ui('Cambiar a modo nocturno','Switch to dark mode'));
    b.setAttribute('title',night?ui('Modo diurno','Light mode'):ui('Modo nocturno','Dark mode'));
    b.setAttribute('aria-pressed',night?'true':'false');
  }
  if(typeof numaSyncVisualTheme==='function')numaSyncVisualTheme();
  return t;
}
function toggleTheme(){const r=document.getElementById('nxo-app');applyTheme(r?.dataset?.theme==='night'?'day':'night',true)}
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const NEXO_ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const iconUrl=name=>NEXO_ICON_BASE+encodeURIComponent(String(name||''))+'.png';
function iconTag(name,label='',extraClass=''){return '<img class="nxo-icon-img'+(extraClass?' '+esc(extraClass):'')+'" src="'+esc(iconUrl(name))+'" alt="'+esc(label)+'" loading="lazy" decoding="async">'}
function iconLabel(name,label){return '<span class="nxo-icon-label">'+iconTag(name,'')+'<span>'+esc(label)+'</span></span>'}
function toolIconKey(t){const key=[t?.toolKey,t?.nameEs,t?.nameEn,t?.workspaceName].filter(Boolean).join(' ').toLowerCase();if(/fich|technical/.test(key))return'ficha-tecnica';if(/invent|product/.test(key))return'productos';if(/bibli|engranaje|guide/.test(key))return'guia';if(/learning|desarrollo|development/.test(key))return'desarrollo';if(/work.?center|panel/.test(key))return'panel';return'herramientas'}
const initials=v=>String(v||'N').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'N';
const mediaUrl=v=>typeof v==='string'?v:(v&&(v.url||v.image?.url||v.src)||'');
function addCss(){if(!document.getElementById('nxo-css')){const l=document.createElement('link');l.id='nxo-css';l.rel='stylesheet';l.href=CSS;document.head.appendChild(l)}if(!document.getElementById('nma-overlay-css')){const n=document.createElement('link');n.id='nma-overlay-css';n.rel='stylesheet';n.href=NUMA_CSS;document.head.appendChild(n)}}
function root(){addCss();document.body.classList.add('nxo-lock');let r=document.getElementById('nxo-app');if(!r){r=document.createElement('div');r.id='nxo-app';r.className='nxo-app';r.dataset.theme=storedTheme();document.body.appendChild(r)}else if(!r.dataset.theme){r.dataset.theme=storedTheme()}return r}
let nxoOrganicRaf=0,nxoOrganicResize=null,nxoOrganicStarted=false;
function ensureOrganicLayers(){
  const r=root();
  let c=r.querySelector('#nxo-organic-canvas');
  let film=r.querySelector('#nxo-theme-film');
  let layer=r.querySelector('#nxo-content-layer');
  if(!c){
    c=document.createElement('canvas');
    c.id='nxo-organic-canvas';
    c.setAttribute('aria-hidden','true');
    r.prepend(c);
  }
  if(!film){
    film=document.createElement('div');
    film.id='nxo-theme-film';
    film.setAttribute('aria-hidden','true');
    if(layer)r.insertBefore(film,layer);else r.appendChild(film);
  }
  if(!layer){
    layer=document.createElement('div');
    layer.id='nxo-content-layer';
    layer.className='nxo-content-layer';
    r.appendChild(layer);
  }
  return {r,c,film,layer};
}
function mountNexoOrganicBackground(){
  if(nxoOrganicStarted)return;
  nxoOrganicStarted=true;

  const {c}=ensureOrganicLayers();
  const ctx=c.getContext('2d');
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr=Math.min(window.devicePixelRatio||1,1.5);

  let W=0,H=0,lastW=0,lastH=0;
  let nodeSeq=0,lastSpawn=0,nextSpawnDelay=420,concurrentBirthLimit=4;
  const startAt=performance.now();
  const nodes=[];
  const links=[];
  const pulses=[];
  const retirementQueue=[];

  const rand=(a,b)=>Math.random()*(b-a)+a;
  const randInt=(a,b)=>Math.floor(rand(a,b+1));
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ease=t=>1-Math.pow(1-t,3);
  const smooth=t=>t*t*(3-2*t);
  const themeMode=()=>document.getElementById('nxo-app')?.dataset?.theme==='night'?'night':'day';
  const particleRgb=()=>themeMode()==='night'?'255,255,255':'38,76,143';

  function resize(){
    W=Math.max(1,window.innerWidth);
    H=Math.max(1,window.innerHeight);
    c.width=Math.floor(W*dpr);
    c.height=Math.floor(H*dpr);
    c.style.width=W+'px';
    c.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);

    if(lastW&&lastH&&nodes.length){
      const sx=W/lastW,sy=H/lastH;
      nodes.forEach(n=>{
        n.x*=sx;n.y*=sy;n.sx*=sx;n.sy*=sy;n.tx*=sx;n.ty*=sy;
        n.anchorX*=sx;n.anchorY*=sy;
        n.driftFromX*=sx;n.driftFromY*=sy;
        n.driftToX*=sx;n.driftToY*=sy;
      });
    }
    lastW=W;lastH=H;
  }

  function nodeDegree(id){
    let count=0;
    for(const l of links){
      if(!l.dead&&!l.dyingAt&&(l.a===id||l.b===id))count++;
    }
    return count;
  }

  function networkTopology(){
    const alive=nodes.filter(n=>n.state!=='dead');
    const ids=new Set(alive.map(n=>n.id));
    const adj=new Map(alive.map(n=>[n.id,[]]));

    for(const l of links){
      if(l.dead||l.dyingAt||!ids.has(l.a)||!ids.has(l.b))continue;
      adj.get(l.a).push(l.b);
      adj.get(l.b).push(l.a);
    }

    const seen=new Set();
    const components=[];
    const componentSize=new Map();

    for(const n of alive){
      if(seen.has(n.id))continue;
      const stack=[n.id],part=[];
      seen.add(n.id);

      while(stack.length){
        const id=stack.pop();
        part.push(id);
        for(const next of adj.get(id)||[]){
          if(seen.has(next))continue;
          seen.add(next);
          stack.push(next);
        }
      }

      components.push(part);
      for(const id of part)componentSize.set(id,part.length);
    }

    const smallComponents=components.filter(c=>c.length<=2);
    const smallIds=new Set(smallComponents.flat());

    return {
      aliveCount:alive.length,
      components,
      componentSize,
      smallComponents,
      smallIds,
      needsRepair:smallComponents.length>0
    };
  }

  function removalCreatesTinyFragment(nodeId){
    const alive=nodes.filter(n=>n.state!=='dead'&&n.id!==nodeId);
    if(alive.length<2)return false;

    const ids=new Set(alive.map(n=>n.id));
    const neighbors=[];
    for(const l of links){
      if(l.dead||l.dyingAt)continue;
      if(l.a===nodeId&&ids.has(l.b))neighbors.push(l.b);
      else if(l.b===nodeId&&ids.has(l.a))neighbors.push(l.a);
    }
    if(neighbors.length<2)return false;

    const adj=new Map(alive.map(n=>[n.id,[]]));
    for(const l of links){
      if(l.dead||l.dyingAt||l.a===nodeId||l.b===nodeId)continue;
      if(!ids.has(l.a)||!ids.has(l.b))continue;
      adj.get(l.a).push(l.b);
      adj.get(l.b).push(l.a);
    }

    const compByNode=new Map();
    let compIndex=0;
    const compSizes=[];

    for(const n of alive){
      if(compByNode.has(n.id))continue;
      const stack=[n.id],part=[];
      compByNode.set(n.id,compIndex);
      while(stack.length){
        const id=stack.pop();
        part.push(id);
        for(const next of adj.get(id)||[]){
          if(compByNode.has(next))continue;
          compByNode.set(next,compIndex);
          stack.push(next);
        }
      }
      compSizes[compIndex]=part.length;
      compIndex++;
    }

    const neighborComps=[...new Set(neighbors.map(id=>compByNode.get(id)).filter(v=>v!==undefined))];
    if(neighborComps.length<2)return false;
    return neighborComps.some(i=>compSizes[i]<=3);
  }

  function addNode(x,y,r,parent=null,time=performance.now()){
    const driftRadius=rand(W<700?7:9,W<700?17:24);
    const n={
      id:++nodeSeq,
      x,y,sx:x,sy:y,tx:x,ty:y,
      anchorX:x,anchorY:y,
      driftFromX:x,driftFromY:y,
      driftToX:x,driftToY:y,
      driftStartAt:time,
      driftDuration:rand(1600,3600),
      driftRadius,
      lastDriftUpdate:0,
      lastBranchAt:0,
      branchChildren:0,
      retirementScheduled:false,
      r,baseR:r,parent,
      branchCap:randInt(5,6),
      born:time,
      moveStart:time,
      moveDuration:1,
      moving:false,
      settled:true,
      phase:rand(0,Math.PI*2),
      pulseSpeed:rand(.00115,.00255),
      scaleAmp:rand(.025,.075),
      alphaBase:rand(.34,.56),
      alphaAmp:rand(.02,.07),
      auraGain:rand(.82,1.18),
      state:'active',
      deathAt:0,
      deathDuration:rand(1900,3400)
    };
    nodes.push(n);
    return n;
  }

  function getNode(id){return nodes.find(n=>n.id===id)}

  function addLink(a,b,time){
    const l={
      a:a.id,b:b.id,born:time,active:0,
      phase:rand(0,Math.PI*2),
      midWidth:rand(.72,1.18),
      nextPulseAt:time+rand(700,1700),
      minPulseGap:rand(900,1700),
      maxPulseGap:rand(1800,3400),
      dyingAt:0,
      deathDuration:rand(1500,2600),
      dead:false
    };
    links.push(l);
    return l;
  }

  function pointSegmentDistance(px,py,ax,ay,bx,by){
    const dx=bx-ax,dy=by-ay;
    const len2=dx*dx+dy*dy;
    if(!len2)return Math.hypot(px-ax,py-ay);
    let t=((px-ax)*dx+(py-ay)*dy)/len2;
    t=clamp(t,0,1);
    return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));
  }

  function orient(ax,ay,bx,by,cx,cy){
    return (bx-ax)*(cy-ay)-(by-ay)*(cx-ax);
  }

  function segmentsCross(a,b,c,d){
    const eps=.0001;
    const o1=orient(a.x,a.y,b.x,b.y,c.x,c.y);
    const o2=orient(a.x,a.y,b.x,b.y,d.x,d.y);
    const o3=orient(c.x,c.y,d.x,d.y,a.x,a.y);
    const o4=orient(c.x,c.y,d.x,d.y,b.x,b.y);
    return ((o1>eps&&o2<-eps)||(o1<-eps&&o2>eps))&&((o3>eps&&o4<-eps)||(o3<-eps&&o4>eps));
  }

  function candidateIsClean(source,target,newRadius){
    const nodeClearance=W<700?20:27;
    for(const n of nodes){
      if(n.id===source.id||n.state==='dead')continue;
      const min=nodeClearance+n.r+newRadius;
      if(Math.hypot(target.x-n.x,target.y-n.y)<min)return false;
      if(pointSegmentDistance(n.x,n.y,source.x,source.y,target.x,target.y)<n.r+nodeClearance*.70)return false;
    }

    const candidate={x:target.x,y:target.y};
    for(const l of links){
      if(l.dead||l.dyingAt||l.a===source.id||l.b===source.id)continue;
      const a=getNode(l.a),b=getNode(l.b);
      if(!a||!b||a.state==='dead'||b.state==='dead')continue;
      if(segmentsCross(source,candidate,a,b))return false;
    }
    return true;
  }

  function dynamicPositionIsClean(n,x,y){
    const margin=W<700?26:42;
    if(x<margin||x>W-margin||y<margin||y>H-margin)return false;

    const clearance=W<700?11:16;
    for(const other of nodes){
      if(other.id===n.id||other.state==='dead')continue;
      if(Math.hypot(x-other.x,y-other.y)<n.r+other.r+clearance)return false;
    }

    const incident=links.filter(l=>!l.dead&&!l.dyingAt&&(l.a===n.id||l.b===n.id));
    const proposed={x,y};

    for(const il of incident){
      const otherId=il.a===n.id?il.b:il.a;
      const neighbor=getNode(otherId);
      if(!neighbor||neighbor.state==='dead')continue;

      for(const otherNode of nodes){
        if(otherNode.id===n.id||otherNode.id===neighbor.id||otherNode.state==='dead')continue;
        if(pointSegmentDistance(otherNode.x,otherNode.y,x,y,neighbor.x,neighbor.y)<otherNode.r+clearance*.62)return false;
      }

      for(const l of links){
        if(l.dead||l.dyingAt||l===il)continue;
        if(l.a===n.id||l.b===n.id||l.a===neighbor.id||l.b===neighbor.id)continue;
        const a=getNode(l.a),b=getNode(l.b);
        if(!a||!b||a.state==='dead'||b.state==='dead')continue;
        if(segmentsCross(proposed,neighbor,a,b))return false;
      }
    }
    return true;
  }

  function targetFor(source,newRadius,repair=false){
    const minDist=repair?(W<700?62:88):(W<700?78:116);
    const maxDist=repair?(W<700?148:215):(W<700?175:275);
    const margin=W<700?32:54;
    const tries=repair?88:64;

    for(let k=0;k<tries;k++){
      const ang=rand(0,Math.PI*2);
      const d=rand(minDist,maxDist);
      const x=clamp(source.x+Math.cos(ang)*d,margin,W-margin);
      const y=clamp(source.y+Math.sin(ang)*d,margin,H-margin);
      const target={x,y};
      if(candidateIsClean(source,target,newRadius))return target;
    }
    return null;
  }

  function chooseDriftTarget(n,time){
    n.driftFromX=n.x;
    n.driftFromY=n.y;

    for(let k=0;k<16;k++){
      const ang=rand(0,Math.PI*2);
      const radius=n.driftRadius*Math.sqrt(Math.random());
      const x=n.anchorX+Math.cos(ang)*radius;
      const y=n.anchorY+Math.sin(ang)*radius;
      if(dynamicPositionIsClean(n,x,y)){
        n.driftToX=x;
        n.driftToY=y;
        n.driftStartAt=time;
        n.driftDuration=rand(1300,3900);
        return true;
      }
    }

    n.driftToX=n.x;
    n.driftToY=n.y;
    n.driftStartAt=time;
    n.driftDuration=rand(700,1500);
    return false;
  }

  function createPulse(link,time){
    if(link.dead||link.dyingAt)return;
    pulses.push({
      link,
      start:time,
      duration:rand(1400,3400),
      size:rand(1.8,4.2),
      alpha:rand(.16,.34),
      back:rand(.14,.28),
      front:rand(.05,.12),
      halo:rand(10,22),
      direction:Math.random()<.80?1:-1,
      dead:false
    });
    if(pulses.length>120)pulses.splice(0,pulses.length-120);
  }

  function parentHasMovingChild(parentId){
    return nodes.some(n=>n.state!=='dead'&&n.moving&&n.parent===parentId);
  }

  function populationLimits(){
    const center=W<700?34:50;
    return {
      center,
      retireStart:center-5,
      hardMax:center+5
    };
  }

  function scheduleRetirementAfterBirth(child,time){
    if(!child||child.retirementScheduled)return false;
    child.retirementScheduled=true;

    const {retireStart}=populationLimits();
    const aliveCount=nodes.filter(n=>n.state!=='dead').length;
    if(aliveCount<retireStart)return false;

    retirementQueue.push({
      childId:child.id,
      dueAt:time+rand(3000,5000)
    });
    retirementQueue.sort((a,b)=>a.dueAt-b.dueAt);
    return true;
  }

  function retireOldestAvailable(time){
    const eligible=nodes.filter(n=>
      n.state==='active'&&
      !n.moving&&
      !parentHasMovingChild(n.id)
    );
    if(!eligible.length)return false;

    eligible.sort((a,b)=>a.born-b.born);
    return fadeNode(eligible[0],time);
  }

  function processRetirementQueue(time){
    while(retirementQueue.length&&retirementQueue[0].dueAt<=time){
      if(!retireOldestAvailable(time))break;
      retirementQueue.shift();
    }
  }

  function spawn(time){
    if(reduce)return false;

    const {hardMax}=populationLimits();
    const aliveCount=nodes.filter(n=>n.state!=='dead').length;
    if(aliveCount>=hardMax)return false;

    const topology=networkTopology();
    const candidates=nodes.filter(n=>{
      if(!n.settled||n.state!=='active')return false;
      if((n.branchChildren||0)>=n.branchCap)return false;
      if(parentHasMovingChild(n.id))return false;
      return true;
    });
    if(!candidates.length)return false;

    function branchScore(n){
      const children=n.branchChildren||0;
      const age=Math.max(0,time-n.born);
      const componentSize=topology.componentSize.get(n.id)||1;
      let score=0;

      // Favor newer growth and nodes that still have most of their 5–6-child budget.
      score+=clamp(1-age/42000,0,1)*8;
      score+=(n.branchCap-children)*3.2;

      // Keep small detached groups capable of branching into real clusters.
      if(componentSize<=2)score+=10;
      else if(componentSize<=4)score+=5;

      // Prefer a spread of parents rather than extending one tip repeatedly.
      const deg=nodeDegree(n.id);
      if(deg<=1)score+=5;
      else if(deg===2)score+=7;
      else if(deg===3)score+=4;

      return score+Math.random()*2.5;
    }

    const ranked=candidates
      .map(n=>({n,score:branchScore(n)}))
      .sort((a,b)=>b.score-a.score);

    const pool=ranked.slice(0,Math.min(10,ranked.length)).map(x=>x.n);
    const attempts=48;

    for(let attempt=0;attempt<attempts;attempt++){
      const source=pick(attempt<36?pool:candidates);
      if(!source||parentHasMovingChild(source.id))continue;

      const radius=rand(W<700?10:12,W<700?19:24);
      const repair=(topology.componentSize.get(source.id)||1)<=2;
      const targetPoint=targetFor(source,radius,repair);
      if(!targetPoint)continue;

      const child=addNode(source.x,source.y,radius,source.id,time);
      child.sx=source.x;child.sy=source.y;
      child.tx=targetPoint.x;child.ty=targetPoint.y;
      child.anchorX=targetPoint.x;child.anchorY=targetPoint.y;
      child.driftFromX=targetPoint.x;child.driftFromY=targetPoint.y;
      child.driftToX=targetPoint.x;child.driftToY=targetPoint.y;
      child.moveStart=time;
      child.moveDuration=rand(1100,2200);
      child.moving=true;
      child.settled=false;
      child.lastBranchAt=time;

      source.lastBranchAt=time;
      source.branchChildren=(source.branchChildren||0)+1;

      addLink(source,child,time);
      return true;
    }
    return false;
  }

  function fadeNode(n,time){
    if(!n||n.state!=='active'||n.moving)return false;

    n.state='dying';
    n.deathAt=time;
    n.deathDuration=rand(1250,2150);
    return true;
  }

  function markNodeForFade(time){
    return retireOldestAvailable(time);
  }

  function cleanup(time){
    for(const n of nodes){
      if(n.state==='dying'&&time-n.deathAt>=n.deathDuration)n.state='dead';
    }

    for(const l of links){
      const a=getNode(l.a),b=getNode(l.b);
      if(!a||!b||a.state==='dead'||b.state==='dead')l.dead=true;
    }
    for(const p of pulses){
      if(p.dead||p.link.dead)p.dead=true;
    }

    for(let i=pulses.length-1;i>=0;i--)if(pulses[i].dead)pulses.splice(i,1);
    for(let i=links.length-1;i>=0;i--)if(links[i].dead)links.splice(i,1);
    for(let i=nodes.length-1;i>=0;i--)if(nodes[i].state==='dead')nodes.splice(i,1);
  }

  function init(){
    nodes.length=0;links.length=0;pulses.length=0;retirementQueue.length=0;nodeSeq=0;
    concurrentBirthLimit=randInt(3,5);
    const first=addNode(W/2,H/2,W<700?24:32,null,performance.now());
    first.born=performance.now()+200;
    first.alphaBase=rand(.40,.58);
    first.alphaAmp=rand(.02,.06);
    first.scaleAmp=.045;
    first.pulseSpeed=.00155;
    first.branchCap=randInt(5,6);
  }

  function nodeLifeAlpha(n,time){
    if(n.state!=='dying')return 1;
    return 1-clamp((time-n.deathAt)/n.deathDuration,0,1);
  }

  function nodeVisualState(n,time){
    const age=time-n.born;
    const birthRaw=n.parent
      ?clamp((time-n.moveStart)/Math.max(1,n.moveDuration),0,1)
      :clamp(age/900,0,1);
    const growth=n.parent?ease(birthRaw):smooth(birthRaw);
    const life=nodeLifeAlpha(n,time);
    const wave=Math.sin(time*n.pulseSpeed+n.phase);
    const baseAlpha=clamp(n.alphaBase+n.alphaAmp*wave,.24,.60);
    const fullR=n.r*(1+n.scaleAmp*wave);
    return {
      wave,
      pulse01:(wave+1)/2,
      growth,
      life,
      alpha:baseAlpha*growth*life,
      rr:fullR*growth,
      fullR
    };
  }

  function updateNodes(time){
    for(const n of nodes){
      if(n.moving){
        const p=clamp((time-n.moveStart)/n.moveDuration,0,1);
        const e=ease(p);
        const wobble=Math.sin(p*Math.PI)*Math.sin(n.phase)*8;
        const dx=n.tx-n.sx,dy=n.ty-n.sy;
        const len=Math.max(1,Math.hypot(dx,dy));
        const nx=-dy/len,ny=dx/len;
        n.x=n.sx+dx*e+nx*wobble;
        n.y=n.sy+dy*e+ny*wobble;

        if(p>=1){
          n.x=n.tx;n.y=n.ty;
          n.anchorX=n.tx;n.anchorY=n.ty;
          n.driftFromX=n.x;n.driftFromY=n.y;
          n.driftToX=n.x;n.driftToY=n.y;
          n.driftStartAt=time;
          n.moving=false;n.settled=true;
          chooseDriftTarget(n,time);
          if(n.parent)scheduleRetirementAfterBirth(n,time);
          concurrentBirthLimit=randInt(3,5);
        }
        continue;
      }

      if(n.state!=='active'||reduce)continue;
      if(time-n.lastDriftUpdate<34)continue;
      n.lastDriftUpdate=time;

      let p=(time-n.driftStartAt)/n.driftDuration;
      if(p>=1){
        chooseDriftTarget(n,time);
        p=0;
      }
      p=clamp(p,0,1);
      const e=smooth(p);
      const x=n.driftFromX+(n.driftToX-n.driftFromX)*e;
      const y=n.driftFromY+(n.driftToY-n.driftFromY)*e;

      if(dynamicPositionIsClean(n,x,y)){
        n.x=x;n.y=y;
      }else{
        chooseDriftTarget(n,time);
      }
    }
  }

  function drawBackground(){
    const night=themeMode()==='night';
    const g=ctx.createLinearGradient(0,0,0,H);
    if(night){
      g.addColorStop(0,'#182341');
      g.addColorStop(.5,'#11192f');
      g.addColorStop(1,'#0b1122');
    }else{
      g.addColorStop(0,'#fbfaf6');
      g.addColorStop(.52,'#f5f3ed');
      g.addColorStop(1,'#eeeae1');
    }
    ctx.fillStyle=g;
    ctx.fillRect(0,0,W,H);

    const center=ctx.createRadialGradient(W*.5,H*.46,0,W*.5,H*.46,Math.max(W,H)*.52);
    if(night){
      center.addColorStop(0,'rgba(47,79,147,.17)');
      center.addColorStop(.44,'rgba(38,76,143,.065)');
      center.addColorStop(1,'rgba(10,16,37,0)');
    }else{
      center.addColorStop(0,'rgba(220,231,247,.48)');
      center.addColorStop(.46,'rgba(185,203,237,.20)');
      center.addColorStop(1,'rgba(245,242,234,0)');
    }
    ctx.fillStyle=center;
    ctx.fillRect(0,0,W,H);
  }

  function taperedFilamentPath(a,b,endA,endB,mid,progress){
    const bx=a.x+(b.x-a.x)*progress;
    const by=a.y+(b.y-a.y)*progress;
    const dx=bx-a.x,dy=by-a.y;
    const len=Math.max(1,Math.hypot(dx,dy));
    const nx=-dy/len,ny=dx/len;
    const edgeA=clamp((endA*.5)/len,.015,.28);
    const edgeB=clamp((endB*.5)/len,.015,.28);
    const steps=28;
    const left=[],right=[];

    for(let i=0;i<=steps;i++){
      const t=i/steps;
      const x=a.x+dx*t,y=a.y+dy*t;
      let width;

      if(t<=edgeA){
        width=endA;
      }else if(t<.5){
        const u=clamp((t-edgeA)/Math.max(.001,.5-edgeA),0,1);
        const e=smooth(u);
        width=endA+(mid-endA)*e;
      }else if(t<1-edgeB){
        const u=clamp((t-.5)/Math.max(.001,.5-edgeB),0,1);
        const e=smooth(u);
        width=mid+(endB-mid)*e;
      }else{
        width=endB;
      }

      left.push({x:x+nx*width*.5,y:y+ny*width*.5});
      right.push({x:x-nx*width*.5,y:y-ny*width*.5});
    }

    ctx.beginPath();
    ctx.moveTo(left[0].x,left[0].y);
    for(let i=1;i<left.length;i++)ctx.lineTo(left[i].x,left[i].y);
    for(let i=right.length-1;i>=0;i--)ctx.lineTo(right[i].x,right[i].y);
    ctx.closePath();
  }

  function drawLink(l,time){
    const a=getNode(l.a),b=getNode(l.b);
    if(!a||!b||a.state==='dead'||b.state==='dead'){l.dead=true;return;}

    const va=nodeVisualState(a,time);
    const vb=nodeVisualState(b,time);
    const linkLen=Math.hypot(b.x-a.x,b.y-a.y);
    l.active=b.moving?vb.growth:1;
    if(linkLen<.75)return;

    const endA=va.rr*2;
    const endB=vb.rr*2;
    const mid=l.midWidth;
    const edgeA=clamp(va.rr/linkLen,.02,.28);
    const edgeB=clamp(1-(vb.rr/linkLen),.72,.98);
    const centerAlpha=clamp(((va.alpha+vb.alpha)*.5)*.70,0,.42);

    const rgb=particleRgb();
    ctx.save();
    const grad=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
    grad.addColorStop(0,'rgba('+rgb+',0)');
    grad.addColorStop(edgeA,'rgba('+rgb+',0)');
    grad.addColorStop(.32,'rgba('+rgb+','+(centerAlpha*.42)+')');
    grad.addColorStop(.50,'rgba('+rgb+','+centerAlpha+')');
    grad.addColorStop(.68,'rgba('+rgb+','+(centerAlpha*.42)+')');
    grad.addColorStop(edgeB,'rgba('+rgb+',0)');
    grad.addColorStop(1,'rgba('+rgb+',0)');
    ctx.fillStyle=grad;
    ctx.shadowColor='rgba('+rgb+','+(centerAlpha*.28)+')';
    ctx.shadowBlur=7;
    taperedFilamentPath(a,b,endA,endB,mid,1);
    ctx.fill();
    ctx.restore();

    if(!reduce&&va.life>.98&&vb.life>.98&&l.active>.98&&time>=l.nextPulseAt){
      createPulse(l,time);
      l.nextPulseAt=time+rand(l.minPulseGap,l.maxPulseGap);
    }
  }

  function drawPulse(p,time){
    const l=p.link,a=getNode(l.a),b=getNode(l.b);
    if(!a||!b||l.dead){p.dead=true;return}
    if(l.active<.98)return;

    const q=(time-p.start)/p.duration;
    if(q>=1){p.dead=true;return}
    if(q<0)return;

    const t=p.direction>0?q:1-q;
    const behind=clamp(t-p.back*p.direction,0,1);
    const ahead=clamp(t+p.front*p.direction,0,1);
    const x=a.x+(b.x-a.x)*t;
    const y=a.y+(b.y-a.y)*t;
    const x0=a.x+(b.x-a.x)*behind;
    const y0=a.y+(b.y-a.y)*behind;
    const x1=a.x+(b.x-a.x)*ahead;
    const y1=a.y+(b.y-a.y)*ahead;

    const rgb=particleRgb();
    ctx.save();
    const beam=ctx.createLinearGradient(x0,y0,x1,y1);
    beam.addColorStop(0,'rgba('+rgb+',0)');
    beam.addColorStop(.44,'rgba('+rgb+','+(p.alpha*.34)+')');
    beam.addColorStop(.54,'rgba('+rgb+','+p.alpha+')');
    beam.addColorStop(.66,'rgba('+rgb+','+(p.alpha*.34)+')');
    beam.addColorStop(1,'rgba('+rgb+',0)');
    ctx.strokeStyle=beam;
    ctx.lineWidth=p.size;
    ctx.lineCap='round';
    ctx.shadowColor='rgba('+rgb+','+(p.alpha*.72)+')';
    ctx.shadowBlur=p.halo;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();

    ctx.fillStyle='rgba('+rgb+','+(p.alpha*.78)+')';
    ctx.shadowColor='rgba('+rgb+','+p.alpha+')';
    ctx.shadowBlur=p.halo*.72;
    ctx.beginPath();ctx.arc(x,y,p.size*.72,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function drawNode(n,time){
    const age=time-n.born;
    if(age<0)return;

    const visual=nodeVisualState(n,time);
    const pulse01=visual.pulse01;
    const alpha=visual.alpha;
    const rr=visual.rr;
    if(rr<=.2||alpha<=.001)return;

    const rgb=particleRgb();
    ctx.save();

    const auraRadius=rr*(2.45+n.auraGain*.48);
    const aura=ctx.createRadialGradient(n.x,n.y,rr*.72,n.x,n.y,auraRadius);
    aura.addColorStop(0,'rgba('+rgb+','+(alpha*(.16+.06*pulse01))+')');
    aura.addColorStop(.36,'rgba('+rgb+','+(alpha*(.075+.025*pulse01))+')');
    aura.addColorStop(1,'rgba('+rgb+',0)');
    ctx.fillStyle=aura;
    ctx.beginPath();ctx.arc(n.x,n.y,auraRadius,0,Math.PI*2);ctx.fill();

    const body=ctx.createRadialGradient(
      n.x-rr*.20,n.y-rr*.22,rr*.05,
      n.x,n.y,rr
    );
    body.addColorStop(0,'rgba('+rgb+',.98)');
    body.addColorStop(.34,'rgba('+rgb+',.74)');
    body.addColorStop(.76,'rgba('+rgb+',.42)');
    body.addColorStop(1,'rgba('+rgb+',.22)');
    ctx.globalAlpha=alpha;
    ctx.fillStyle=body;
    ctx.shadowColor='rgba('+rgb+','+Math.min(.34,alpha*.52)+')';
    ctx.shadowBlur=10+7*pulse01;
    ctx.beginPath();ctx.arc(n.x,n.y,rr,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;

    const core=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,rr*.62);
    core.addColorStop(0,'rgba('+rgb+',1)');
    core.addColorStop(.26,'rgba('+rgb+',.72)');
    core.addColorStop(.66,'rgba('+rgb+',.24)');
    core.addColorStop(1,'rgba('+rgb+',0)');
    ctx.globalAlpha=alpha;
    ctx.fillStyle=core;
    ctx.shadowColor='rgba('+rgb+','+Math.min(.38,alpha*.62)+')';
    ctx.shadowBlur=12+8*pulse01;
    ctx.beginPath();ctx.arc(n.x,n.y,rr*.62,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;

    ctx.restore();
  }

  function frame(time){
    updateNodes(time);
    cleanup(time);
    processRetirementQueue(time);
    drawBackground();

    if(!reduce&&time-startAt>550&&time-lastSpawn>nextSpawnDelay){
      const {hardMax}=populationLimits();
      const aliveCount=nodes.filter(n=>n.state!=='dead').length;
      const movingCount=nodes.filter(n=>n.state!=='dead'&&n.moving).length;
      const slots=Math.max(0,Math.min(concurrentBirthLimit-movingCount,hardMax-aliveCount));

      let grew=false;
      for(let i=0;i<slots;i++){
        if(spawn(time))grew=true;
        else break;
      }

      lastSpawn=time;
      nextSpawnDelay=grew?rand(260,520):rand(520,900);
    }

    links.forEach(l=>drawLink(l,time));
    pulses.forEach(p=>drawPulse(p,time));
    nodes.forEach(n=>drawNode(n,time));

    if(!reduce)nxoOrganicRaf=requestAnimationFrame(frame);
  }

  nxoOrganicResize=()=>resize();
  window.addEventListener('resize',nxoOrganicResize,{passive:true});
  resize();
  init();
  frame(performance.now());
}

/* =========================================================
   NUMA CORE v1 · transversal assistant shell
========================================================= */
const NUMA_PRESENCE_URL='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/numa/presence-runtime.js?v=20261001-presence-4';
let numaPresence=null,numaPresenceLoadPromise=null,numaTypingTimer=0;
let numaState=null,numaContextCacheKey="",numaLoading=false,numaSending=false;
function numaVisualTheme(){return document.getElementById("nxo-app")?.dataset?.theme==="night"?"night":"day"}
function ensureNumaPresenceRuntime(){
  if(numaPresence)return Promise.resolve(numaPresence);
  if(numaPresenceLoadPromise)return numaPresenceLoadPromise;
  numaPresenceLoadPromise=new Promise((resolve,reject)=>{
    const bind=()=>{
      if(!window.NUMA_PRESENCE_RUNTIME?.create){reject(new Error('NUMA_PRESENCE_RUNTIME_UNAVAILABLE'));return}
      numaPresence=window.NUMA_PRESENCE_RUNTIME.create({
        getTheme:numaVisualTheme,
        canQa:()=>{const ctx=numaState?.context||{};return ctx.canDevelop===true||ctx.roleKey==='owner'||ctx.roleKey==='developer'},
        isSending:()=>numaSending
      });
      resolve(numaPresence);
    };
    if(window.NUMA_PRESENCE_RUNTIME?.create){bind();return}
    let script=document.getElementById('nma-presence-runtime-script');
    if(script){script.addEventListener('load',bind,{once:true});script.addEventListener('error',()=>reject(new Error('NUMA_PRESENCE_RUNTIME_LOAD_FAILED')),{once:true});return}
    script=document.createElement('script');script.id='nma-presence-runtime-script';script.src=NUMA_PRESENCE_URL;script.async=false;script.onload=bind;script.onerror=()=>reject(new Error('NUMA_PRESENCE_RUNTIME_LOAD_FAILED'));document.head.appendChild(script);
  });
  return numaPresenceLoadPromise;
}
function numaSyncVisualTheme(){numaPresence?.syncTheme()}
function numaSetExpression(kind='none'){numaPresence?.setExpression(kind)}
function numaSetVisualState(state='idle',expression='none',duration=0){numaPresence?.setState(state,expression,duration)}
function numaSpeak(text,options={}){numaPresence?.speak(text,options)}
function numaLifeFieldMarkup(){return numaPresence?.lifeFieldMarkup()||'<div class="nma-core-zone nma-core-head" aria-hidden="true"><canvas class="nma-core-canvas" data-core="head"></canvas></div><div class="nma-core-zone nma-core-belly" aria-hidden="true"><canvas class="nma-core-canvas" data-core="belly"></canvas></div>'}
function numaMountLifeParticles(){numaPresence?.mountLifeParticles()}
function numaMountLauncherParticles(){numaPresence?.mountLauncherParticles()}
function numaVisualFromResponse(data){return numaPresence?.visualFromResponse(data)||{state:'idle',expression:'speak',duration:1600}}
function numaClearVisualDemo(){numaPresence?.clearDemo()}
function numaRunVisualDemo(){numaPresence?.runDemo()}
function numaHandleVisualQaCommand(message){return numaPresence?.handleQaCommand(message)||false}
ensureNumaPresenceRuntime().catch(error=>console.warn('NUMA_PRESENCE_RUNTIME',error));

function numaContextInput(){
  const isWorkspace=!!workspace?.workspace?.id;
  return {
    workspaceId:isWorkspace?workspace.workspace.id:"",
    currentToolKey:isWorkspace?"workspace":"mi-espacio",
    currentToolLabel:isWorkspace?(ui('Espacio de trabajo','Workspace')+' · '+(workspace.workspace.name||'Nexo')):ui('Mi espacio','My space')
  };
}

function numaContextKey(){
  const x=numaContextInput();
  return [x.workspaceId||"personal",x.currentToolKey].join("|");
}

function numaTime(value){
  try{return new Date(value||Date.now()).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}catch(_){return""}
}

function numaRenderMessages(messages=[]){
  const panel=document.getElementById("nma-panel");
  if(panel?.dataset?.greetingHold==="1")return;
  const latest=[...(messages||[])].reverse().find(m=>m?.role==="assistant"&&String(m?.content||"").trim());
  numaSpeak(latest?.content||"Hola. Dime qué receta, preparación o producto buscas.");
}

function numaSetStatus(textValue,state=""){
  const x=document.getElementById("nma-status");
  if(!x)return;
  x.textContent=textValue||"";
  x.dataset.state=state;
}

function numaSyncHeader(){
  const ctx=numaState?.context;
  const title=document.getElementById("nma-context");
  if(title){
    title.textContent=ctx
      ?((ctx.workspaceName?ctx.workspaceName+" · ":"")+(ctx.currentToolLabel||"Nexo Group"))
      :"Asistente de Nexo Group";
  }
  const badge=document.getElementById("nma-role");
  if(badge){
    badge.textContent=ctx?.roleName||"";
    badge.hidden=!ctx?.roleName;
  }
}

async function numaLoad(force=false){
  if(!sessionToken||numaLoading)return;
  const key=numaContextKey();
  if(!force&&numaState&&numaContextCacheKey===key){
    numaSyncHeader();
    numaRenderMessages(numaState.messages||[]);
    return;
  }
  numaLoading=true;
  numaSetStatus("Cargando contexto…","loading");
  try{
    const data=await api("numa.bootstrap",{input:numaContextInput()});
    numaState=data||null;
    numaContextCacheKey=key;
    numaSyncHeader();
    numaRenderMessages(data?.messages||[]);
    numaSetStatus(data?.providerMode==="local_only"?"Modo local · sin consumo API":(data?.providerConfigured?"API configurada":"Navegación local activa"),"local");
  }catch(e){
    numaSetStatus(e.message||String(e),"error");
  }finally{
    numaLoading=false;
  }
}

function numaOpen(){
  const panel=document.getElementById("nma-panel");
  const launcher=document.getElementById("nma-launcher");
  if(!panel)return;
  numaSyncVisualTheme();
  panel.dataset.greetingHold="1";
  panel.classList.add("open");
  panel.setAttribute("aria-hidden","false");
  launcher?.setAttribute("aria-expanded","true");
  numaSetVisualState("success","speak",1500);
  numaSpeak("Hola. Dime qué receta, preparación o producto buscas.",{expression:"speak",duration:1500});
  numaMountLifeParticles();
  numaLoad(false);
  setTimeout(()=>{
    panel.dataset.greetingHold="0";
    if(!numaSending)numaSetVisualState("idle","none");
    document.getElementById("nma-input")?.focus();
  },1500);
}

function numaClose(){
  numaClearVisualDemo();
  const panel=document.getElementById("nma-panel");
  panel?.classList.remove("open");
  panel?.setAttribute("aria-hidden","true");
  document.getElementById("nma-launcher")?.setAttribute("aria-expanded","false");
  numaSetVisualState("idle","none");
}

function numaPerformAction(action){
  if(!action)return;
  if(action.type==="openWorkspace"){
    if(!action.workspaceId){toast(ui('Numa no recibió un espacio de trabajo válido.','Numa did not receive a valid Workspace.'));return}
    numaClose();
    openWorkspace(String(action.workspaceId));
    return;
  }
  if(action.type==="goBack"){
    numaClose();
    if(workspace?.workspace?.id){returnPersonal();return}
    if(history.length>1){history.back();return}
    location.assign(routeUrl("/blank-8"));
    return;
  }
  if(action.type==="openTechnicalSheet"){
    const route=routeUrl(action.routePath||"/blank-4");
    if(!route||!action.sheetId){toast("Numa no encontró una ficha disponible.");return}
    const currentWorkspaceId=workspace?.workspace?.id||"";
    const targetWorkspaceId=String(action.workspaceId||currentWorkspaceId||"");
    const targetWorkspaceName=String(action.workspaceName||(targetWorkspaceId===currentWorkspaceId?workspace?.workspace?.name:"")||"");
    const backLabel=currentWorkspaceId?(workspace?.workspace?.name||ui('Espacio de trabajo','Workspace')):ui('Mi espacio','My space');
    try{
      const u=new URL(launchWithBack(route,backLabel,currentWorkspaceId),location.href);
      u.searchParams.set("numaSheet",String(action.sheetId));
      if(action.title)u.searchParams.set("numaSheetTitle",String(action.title));
      if(targetWorkspaceId)u.searchParams.set("nxoWorkspace",targetWorkspaceId);
      if(targetWorkspaceName)u.searchParams.set("nxoWorkspaceName",targetWorkspaceName);
      location.assign(u.href);
    }catch(_){
      location.assign(launchWithBack(route,backLabel,currentWorkspaceId));
    }
    return;
  }
  if(action.type!=="navigate")return;
  if(action.target==="mi-espacio"){
    location.assign(routeUrl("/blank-8"));
    return;
  }
  if(action.target==="centro-desarrollo"){
    location.assign(centerDevelopmentUrl());
    return;
  }
  const route=routeUrl(action.routePath);
  if(!route){toast("Numa no encontró una ruta disponible.");return}
  const wsid=workspace?.workspace?.id||"";
  const label=wsid?(workspace?.workspace?.name||"Workspace"):"Mi espacio";
  location.assign(launchWithBack(route,label,wsid));
}

async function numaSend(){
  if(numaSending)return;
  const input=document.getElementById("nma-input");
  const button=document.getElementById("nma-send");
  const message=input?.value.trim()||"";
  if(!message)return;
  if(numaHandleVisualQaCommand(message)){if(input)input.value="";return}
  numaSending=true;
  if(input){input.value="";input.disabled=true}
  if(button)button.disabled=true;
  const optimistic=[
    ...(numaState?.messages||[]),
    {role:"user",content:message,at:new Date().toISOString()}
  ];
  numaRenderMessages(optimistic);
  numaSetStatus("Numa está procesando…","loading");
  numaSetVisualState("thinking","thinking");
  try{
    const data=await api("numa.send",{input:{...numaContextInput(),message}});
    numaState={
      ...(numaState||{}),
      context:data?.context||numaState?.context||null,
      messages:[...optimistic,(data?.message||{role:"assistant",content:"Listo.",at:new Date().toISOString()})]
    };
    numaSyncHeader();
    numaRenderMessages(numaState.messages);
    numaSetStatus(data?.provider==="openai"?"IA conectada":(data?.provider==="openai_error"?"OpenAI requiere atención":(data?.provider==="local_only"?"Modo local · sin consumo API":"Navegación local activa")),data?.provider==="openai"?"online":(data?.provider==="openai_error"?"error":"local"));
    const visual=numaVisualFromResponse(data);
    numaSetVisualState(visual.state,visual.expression,visual.duration);
    numaSpeak(data?.message?.content||"Listo.",{expression:visual.expression,duration:visual.duration||0});
    if(data?.action)setTimeout(()=>numaPerformAction(data.action),900);
  }catch(e){
    const failed=[...optimistic,{role:"assistant",content:"No pude completar esa solicitud: "+(e.message||String(e)),at:new Date().toISOString()}];
    numaState={...(numaState||{}),messages:failed};
    numaRenderMessages(failed);
    numaSetStatus("No se pudo completar la solicitud","error");
    numaSetVisualState("error","error",3000);
    numaSpeak(failed[failed.length-1]?.content||"No pude completar esa solicitud.",{expression:"error",duration:3000});
  }finally{
    numaSending=false;
    if(input){input.disabled=false;input.focus()}
    if(button)button.disabled=false;
  }
}

function mountNuma(){
  if(!sessionToken)return;
  if(!numaPresence){ensureNumaPresenceRuntime().then(()=>{numaSyncVisualTheme();numaMountLauncherParticles();numaMountLifeParticles();}).catch(error=>console.warn('NUMA_PRESENCE_RUNTIME',error));}
  const r=root();
  const contextKey=numaContextKey();
  if(numaContextCacheKey&&numaContextCacheKey!==contextKey){
    numaState=null;
    numaContextCacheKey="";
  }
  let launcher=document.getElementById("nma-launcher");
  if(!launcher){
    launcher=document.createElement("button");
    launcher.id="nma-launcher";
    launcher.className="nma-launcher";
    launcher.type="button";
    launcher.setAttribute("aria-label","Abrir Numa");
    launcher.setAttribute("aria-expanded","false");
    launcher.innerHTML='<canvas id="nma-launcher-canvas" class="nma-launcher-canvas" aria-hidden="true"></canvas><span class="nma-launch-core" aria-hidden="true"></span>';
    r.appendChild(launcher);
    launcher.addEventListener("click",()=>document.getElementById("nma-panel")?.classList.contains("open")?numaClose():numaOpen());
  }

  let panel=document.getElementById("nma-panel");
  if(!panel){
    panel=document.createElement("aside");
    panel.id="nma-panel";
    panel.className="nma-panel";
    panel.setAttribute("aria-hidden","true");
    panel.dataset.state="idle";
    panel.innerHTML=
      '<button id="nma-close" class="nma-presence-close" type="button" aria-label="Cerrar Numa">'+iconTag('cerrar')+'</button>'+
      '<div class="nma-character-stage" aria-label="Numa">'+
        '<div class="nma-character-shell" id="nma-character-shell">'+
          '<img id="nma-character-img" class="nma-character" alt="" draggable="false">'+
          numaLifeFieldMarkup()+
          '<div class="nma-expression-layer" id="nma-expression-layer" aria-hidden="true"></div>'+
        '</div>'+
      '</div>'+
      '<div class="nma-speech" id="nma-speech" role="status" aria-live="polite">Hola. Dime qué receta, preparación o producto buscas.</div>'+
      '<div class="nma-status-row"><span class="nma-status-dot"></span><span id="nma-status">Modo local · sin consumo API</span></div>'+
      '<div class="nma-compose">'+
        '<textarea id="nma-input" rows="1" maxlength="8000" placeholder="Escribe a Numa…"></textarea>'+
        '<button id="nma-send" type="button" aria-label="Enviar mensaje">➤</button>'+
      '</div>';
    r.appendChild(panel);
    panel.querySelector("#nma-close")?.addEventListener("click",numaClose);
    panel.querySelector("#nma-send")?.addEventListener("click",numaSend);
    const nmaInput=panel.querySelector("#nma-input");
    nmaInput?.addEventListener("keydown",e=>{
      if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();numaSend()}
      if(e.key==="Escape")numaClose();
    });
    nmaInput?.addEventListener("focus",()=>{
      const expression=document.getElementById("nma-expression-layer")?.dataset?.expression||"none";
      if(!numaSending&&expression==="none"&&String(nmaInput.value||"").trim()==="")numaSetVisualState("attentive","none");
    });
    nmaInput?.addEventListener("input",()=>{
      if(numaSending)return;
      if(numaTypingTimer)clearTimeout(numaTypingTimer);
      const hasText=String(nmaInput.value||"").trim().length>0;
      numaSetVisualState(hasText?"listening":"attentive",hasText?"listening":"none");
      numaTypingTimer=setTimeout(()=>{numaTypingTimer=0;if(!numaSending&&document.activeElement===nmaInput)numaSetVisualState("attentive","none")},850);
    });
    nmaInput?.addEventListener("blur",()=>{if(!numaSending)setTimeout(()=>{if(!numaSending)numaSetVisualState("idle","none")},120)});
  }
  numaSyncVisualTheme();
  numaSetVisualState("idle","none");
  numaMountLauncherParticles();
  numaMountLifeParticles();
  numaSyncHeader();
}
function html(v){
  const {layer}=ensureOrganicLayers();
  layer.innerHTML=v;
  mountNexoOrganicBackground();
  mountNuma();
}
function loading(label='Abriendo Mi espacio…'){html('<div class="nxo-loading"><div><div class="nxo-spinner"></div><strong>'+esc(label)+'</strong><p class="nxo-muted">Preparando tu contexto Nexo.</p></div></div>')}
function errorView(e){const m=String(e&&e.message?e.message:e||'Error');html('<div class="nxo-loading"><div class="nxo-error"><h2>No se pudo abrir Mi espacio</h2><p>'+esc(m)+'</p><button id="nxo-retry" class="nxo-btn nxo-btn-gold">Reintentar</button></div></div>');document.getElementById('nxo-retry')?.addEventListener('click',retryAccess)}
function toast(msg){let x=document.querySelector('.nxo-toast');if(x)x.remove();x=document.createElement('div');x.className='nxo-toast';x.textContent=msg;document.body.appendChild(x);setTimeout(()=>x.remove(),3200)}
async function api(action,payload={}){
 const h={'Content-Type':'application/json','Accept':'application/json'};
 if(sessionToken)h.Authorization='Bearer '+sessionToken;
 const controller=new AbortController(),requestTimeout=action==='recipe-change.process'?90000:(action==='schedule.import.analyze'?120000:(action==='numa.send'?65000:20000)),timer=setTimeout(()=>controller.abort(),requestTimeout);
 try{
  const r=await fetch(API,{method:'POST',cache:'no-store',signal:controller.signal,headers:h,body:JSON.stringify({action,...payload})});
  let d=null;try{d=await r.json()}catch(_){}
  if(!r.ok){
    if(d?.error)throw new Error(String(d.error));
    throw new Error('No se pudo completar '+action+' (HTTP_'+r.status+').');
  }
  if(!d)throw new Error('Respuesta inválida en '+action+'.');
  if(d.ok===false)throw new Error(d.error||'Operación no disponible');
  return d.data??d;
 }catch(e){if(e.name==='AbortError')throw accessError('REQUEST_TIMEOUT');throw e}
 finally{clearTimeout(timer)}
}
function stripBoot(){try{const u=new URL(location.href);['nxm','nxme','nxms','nxav'].forEach(k=>u.searchParams.delete(k));history.replaceState(history.state||{},'',u.pathname+u.search+u.hash)}catch(_){}}
async function waitBoot(){
 let previous='',deadline=Date.now()+30000;
 try{
  while(Date.now()<deadline){
   const q=new URLSearchParams(location.search),t=q.get('nxm'),e=q.get('nxme'),state=q.get('nxms')||'WAITING_PAGE';
   if(state!==previous){previous=state;accessStage=state;deadline=Date.now()+(state==='LOGIN'?310000:30000);loginVisible(state==='LOGIN')}
   if(e)throw accessError(e);
   if(t && (state==='READY'||state==='WAITING_PAGE'))return t;
   await new Promise(r=>setTimeout(r,100));
  }
  throw accessError('PAGE_TIMEOUT');
 }finally{loginVisible(false)}
}

function siteBase(){const p=location.pathname.replace(/\/+$/,'');return (location.origin+p.replace(/\/blank-8$/,'')).replace(/\/$/,'')}
function routeUrl(path){const p=String(path||'').trim();return p?siteBase()+(p.startsWith('/')?p:'/'+p):''}
function launchWithBack(url,label,workspaceId=''){if(!url)return'';try{const u=new URL(url,location.href);const back=new URL(siteBase()+'/blank-8');const lang=currentLanguage();if(workspaceId)back.searchParams.set('nxoWorkspace',workspaceId);back.searchParams.set('nxoLang',lang);u.searchParams.set('nxoBack',back.href);u.searchParams.set('nxoBackLabel',label||ui('Mi espacio','My space'));u.searchParams.set('nxoTheme',document.getElementById('nxo-app')?.dataset?.theme||storedTheme());u.searchParams.set('nxoLang',lang);return u.href}catch(_){return url}}
function toolLaunchUrl(t){
  const route=routeUrl(t.routePath);
  if(!route)return'';
  const wsid=workspace?.workspace?.id||'';
  const launched=launchWithBack(route,wsid?workspace.workspace.name:ui('Mi espacio','My space'),wsid);
  if(!wsid)return launched;
  try{
    const u=new URL(launched,location.href);
    const effectiveName=String(t.workspaceName||t.nameEs||t.nameEn||t.toolKey||'').trim();
    const effectiveDescription=String(t.workspaceDescription||t.descriptionEs||'').trim();
    if(effectiveName)u.searchParams.set('nxoToolName',effectiveName);
    if(effectiveDescription)u.searchParams.set('nxoToolDescription',effectiveDescription);
    return u.href
  }catch(_){return launched}
}
function centerDevelopmentUrl(){const wsid=workspace?.workspace?.id||'';const label=wsid?(workspace?.workspace?.name||ui('Espacio de trabajo','Workspace')):ui('Mi espacio','My space');return launchWithBack(siteBase(),label,wsid)}
function setWorkspaceReturnParam(id){try{const u=new URL(location.href);if(id)u.searchParams.set('nxoWorkspace',id);else u.searchParams.delete('nxoWorkspace');history.replaceState(history.state||{},'',u.pathname+u.search+u.hash)}catch(_){}}
function clearWorkspaceReturnParam(){setWorkspaceReturnParam('')}
function statusText(s){return s==='ACTIVE'?'Activo':s==='BUILDING'?'En desarrollo':s==='PLANNED'?'Próximamente':s||''}
function roleName(roleKey,role){
  if(currentLanguage()==='en')return role?.nameEn||({owner:'Owner',developer:'Developer',admin:'Administrator',manager:'Manager',collaborator:'Collaborator',viewer:'Viewer'}[roleKey]||roleKey||'Member');
  return role?.nameEs||({owner:'Propietario',developer:'Desarrollador',admin:'Administrador',manager:'Manager',collaborator:'Colaborador',viewer:'Consulta'}[roleKey]||roleKey||'Miembro')
}
function hasPerm(key){const list=workspace?.role?.permissions||workspace?.membership?.permissions||[];return Array.isArray(list)&&list.includes(key)}
function topbar(mode){
  const isWorkspace=mode==='workspace';
  const name=personal?.profile?.displayName||ui('Usuario Nexo','Nexo user');
  const email=String(personal?.profile?.email||'').trim();
  const profilePhoto=String(personal?.profile?.photoImage?.url||'').trim();
  const wsName=workspace?.workspace?.name||ui('Espacio de trabajo','Workspace');
  const role=isWorkspace?roleName(workspace?.membership?.roleKey,workspace?.role):ui('Cuenta personal','Personal account');
  const roleKey=isWorkspace?String(workspace?.membership?.roleKey||'viewer').toLowerCase():'personal';
  const perms=workspace?.role?.permissions||[];
  const canTools=isWorkspace&&perms.includes('tools.configure');
  const canAdmin=isWorkspace&&(workspace?.membership?.roleKey==='owner'||perms.some(x=>['workspace.manage','members.manage','tools.configure'].includes(x)));
  const contextLabel=isWorkspace?wsName:ui('Mi espacio','My space');
  const lang=currentLanguage();
  const theme=document.getElementById('nxo-app')?.dataset?.theme||storedTheme();

  const notification=canAdmin
    ?'<div class="nxo-notification-wrap">'+
       '<button type="button" class="nxo-notification-button" id="nxo-notification-button" aria-label="'+esc(ui('Notificaciones','Notifications'))+'" aria-expanded="false">'+
         '<span class="nxo-notification-icon" aria-hidden="true">'+iconTag('notificaciones')+'</span>'+
         '<span class="nxo-notification-badge" id="nxo-notification-badge" hidden>0</span>'+
       '</button>'+
       '<div class="nxo-notification-menu" id="nxo-notification-menu">'+
         '<div id="nxo-recipe-comment-notifications"><div class="nxo-notification-head"><strong>'+esc(ui('Notificaciones','Notifications'))+'</strong></div><div class="nxo-notification-empty">'+esc(ui('Cargando avisos…','Loading notifications…'))+'</div></div>'+
       '</div>'+
     '</div>'
    :'';

  const quickSettings=
    '<div class="nxo-quick-settings-wrap">'+
      '<button type="button" class="nxo-quick-settings-button" id="nxo-quick-settings-button" aria-label="'+esc(ui('Ajustes rápidos','Quick settings'))+'" aria-expanded="false">'+iconTag('ajustes-rapidos')+'</button>'+
      '<div class="nxo-quick-settings-menu" id="nxo-quick-settings-menu">'+
        '<div class="nxo-quick-settings-title">'+esc(ui('Ajustes rápidos','Quick settings'))+'</div>'+
        '<button type="button" id="nxo-language-toggle" class="nxo-quick-setting-row">'+iconLabel('idioma',ui('Idioma','Language'))+'<strong>'+esc(lang==='en'?'EN':'ES')+'</strong></button>'+
        '<button type="button" id="nxo-theme-toggle" class="nxo-quick-setting-row"><span class="nxo-icon-label">'+iconTag(theme==='night'?'modo-oscuro':'modo-claro','', 'nxo-theme-icon').replace('class="nxo-icon-img nxo-theme-icon"','class="nxo-icon-img nxo-theme-icon" data-nxo-theme-icon')+'<span>'+esc(ui('Apariencia','Appearance'))+'</span></span><strong>'+esc(theme==='night'?ui('Oscuro','Dark'):ui('Claro','Light'))+'</strong></button>'+
      '</div>'+
    '</div>';

  return '<header class="nxo-topbar nxo-workspace-nav">'+
    '<div class="nxo-nav-brand" id="nxo-nav-home"><span class="nxo-nav-mark"><img src="'+esc(NEXO_LOGO)+'" alt="Nexo Group"></span><span class="nxo-nav-brand-copy"><strong>Nexo Group</strong><small>'+esc(contextLabel)+'</small></span></div>'+
    '<div class="nxo-nav-collapse" id="nxo-nav-collapse">'+
      '<nav class="nxo-nav-links" aria-label="'+esc(ui('Navegación principal','Main navigation'))+'">'+
        '<button type="button" class="nxo-nav-link '+(!isWorkspace?'active':'')+'" id="nxo-personal" '+(!isWorkspace?'aria-current="page"':'')+'>'+iconLabel('home',ui('Mi espacio','My space'))+'</button>'+
        (isWorkspace?'<button type="button" class="nxo-nav-link active" aria-current="page">'+esc(wsName)+'</button>':'')+
        '<button type="button" class="nxo-nav-link" id="nxo-nav-development">'+iconLabel('desarrollo',ui('Centro de desarrollo','Development Center'))+'</button>'+
        (canTools?'<button type="button" class="nxo-nav-link nxo-mobile-settings-link" id="nxo-mobile-workspace-settings">'+iconLabel('ajustes-rapidos',ui('Configuración','Settings'))+'</button>':'')+
      '</nav>'+
    '</div>'+
    '<div class="nxo-nav-primary-utils">'+
      quickSettings+
      notification+
      '<button type="button" class="nxo-nav-account" id="nxo-nav-account" aria-expanded="false">'+
        '<span class="nxo-avatar">'+(profilePhoto?'<img src="'+esc(profilePhoto)+'" alt="'+esc(name+' '+ui('foto de perfil','profile photo'))+'">':esc(initials(name)))+'</span>'+
        '<span class="nxo-nav-account-copy">'+
          '<span class="nxo-nav-account-name-row"><strong>'+esc(name)+'</strong></span>'+
          (email?'<small class="nxo-nav-account-email">'+esc(email)+'</small>':'')+
          '<small class="nxo-nav-account-role" data-role="'+esc(roleKey)+'">'+esc(role)+'</small>'+
        '</span>'+
        '<span class="nxo-nav-caret">⌄</span>'+
      '</button>'+
      '<div class="nxo-nav-account-menu" id="nxo-nav-account-menu">'+
        '<button type="button" data-account-action="settings">'+iconLabel('perfil',ui('Ajustes de perfil','Profile settings'))+'</button>'+
        '<button type="button" data-account-action="switch">'+iconLabel('cuenta-correo',ui('Cambiar cuenta','Switch account'))+'</button>'+
        '<button type="button" class="danger" data-account-action="logout">'+iconLabel('cerrar',ui('Cerrar sesión','Sign out'))+'</button>'+
      '</div>'+
      '<input type="file" id="nxo-profile-photo-input" class="nxo-profile-photo-input" accept="image/png,image/jpeg,image/webp" hidden>'+
    '</div>'+
    '<button type="button" class="nxo-mobile-menu-button" id="nxo-mobile-menu-button" aria-label="'+esc(ui('Abrir menú','Open menu'))+'" aria-expanded="false" aria-controls="nxo-nav-collapse"><span></span><span></span><span></span></button>'+
  '</header>'
}

function bindTopbar(mode){
  const isWorkspace=mode==='workspace';
  const account=document.getElementById('nxo-nav-account');
  const menu=document.getElementById('nxo-nav-account-menu');
  const bell=document.getElementById('nxo-notification-button');
  const bellMenu=document.getElementById('nxo-notification-menu');
  const themeButton=document.getElementById('nxo-theme-toggle');
  const languageButton=document.getElementById('nxo-language-toggle');
  const quickSettingsButton=document.getElementById('nxo-quick-settings-button');
  const quickSettingsMenu=document.getElementById('nxo-quick-settings-menu');
  const mobileButton=document.getElementById('nxo-mobile-menu-button');
  const mobileMenu=document.getElementById('nxo-nav-collapse');
  const profilePhotoInput=document.getElementById('nxo-profile-photo-input');
  const closeMobileMenu=()=>{
    mobileMenu?.classList.remove('open');
    mobileButton?.setAttribute('aria-expanded','false');
    mobileButton?.setAttribute('aria-label','Abrir menú');
  };
  applyTheme(document.getElementById('nxo-app')?.dataset?.theme||storedTheme(),false);
  applyLanguage(personal?.profile?.locale||storedLanguage(),true);
  themeButton?.addEventListener('click',e=>{e.stopPropagation();toggleTheme();quickSettingsMenu?.classList.remove('open');quickSettingsButton?.setAttribute('aria-expanded','false');if(workspace)renderWorkspace();else renderPersonal()});
  languageButton?.addEventListener('click',e=>{e.stopPropagation();setGlobalLanguage(currentLanguage()==='es'?'en':'es')});
  quickSettingsButton?.addEventListener('click',e=>{
    e.stopPropagation();
    const open=quickSettingsMenu?.classList.toggle('open')===true;
    quickSettingsButton.setAttribute('aria-expanded',open?'true':'false');
    bellMenu?.classList.remove('open');bell?.setAttribute('aria-expanded','false');
    menu?.classList.remove('open');account?.setAttribute('aria-expanded','false');
    closeMobileMenu()
  });
  mobileButton?.addEventListener('click',e=>{
    e.stopPropagation();
    const open=mobileMenu?.classList.toggle('open')===true;
    mobileButton.setAttribute('aria-expanded',open?'true':'false');
    mobileButton.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
    if(open){
      bellMenu?.classList.remove('open');
      bell?.setAttribute('aria-expanded','false');
      quickSettingsMenu?.classList.remove('open');
      quickSettingsButton?.setAttribute('aria-expanded','false');
      menu?.classList.remove('open');
      account?.setAttribute('aria-expanded','false');
    }
  });

  if(isWorkspace){
    document.getElementById('nxo-personal')?.addEventListener('click',returnPersonal);
    document.getElementById('nxo-nav-home')?.addEventListener('click',returnPersonal);
  }else{
    document.getElementById('nxo-personal')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    document.getElementById('nxo-nav-home')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }
  document.getElementById('nxo-nav-development')?.addEventListener('click',()=>location.assign(centerDevelopmentUrl()));
  document.getElementById('nxo-mobile-workspace-settings')?.addEventListener('click',()=>{
    workspaceTab='settings';
    closeMobileMenu();
    renderWorkspace()
  });
  document.querySelectorAll('#nxo-personal,#nxo-nav-development,#nxo-mobile-workspace-settings').forEach(button=>button.addEventListener('click',closeMobileMenu));

  if(!window.__nexoMobileNavOutsideBound){
    window.__nexoMobileNavOutsideBound=true;
    document.addEventListener('click',e=>{
      const currentMenu=document.getElementById('nxo-nav-collapse');
      const currentButton=document.getElementById('nxo-mobile-menu-button');
      if(currentMenu?.classList.contains('open')&&!currentMenu.contains(e.target)&&!currentButton?.contains(e.target)){
        currentMenu.classList.remove('open');
        currentButton?.setAttribute('aria-expanded','false');
        currentButton?.setAttribute('aria-label','Abrir menú');
      }
    });
  }

  if(bell&&bellMenu){
    bell.addEventListener('click',e=>{
      e.stopPropagation();
      const open=bellMenu.classList.toggle('open');
      bell.setAttribute('aria-expanded',open?'true':'false');
      menu?.classList.remove('open');
      account?.setAttribute('aria-expanded','false');
      quickSettingsMenu?.classList.remove('open');
      quickSettingsButton?.setAttribute('aria-expanded','false');
    });
  }

  if(account&&menu){
    account.addEventListener('click',e=>{
      e.stopPropagation();
      const open=menu.classList.toggle('open');
      account.setAttribute('aria-expanded',open?'true':'false');
      bellMenu?.classList.remove('open');
      bell?.setAttribute('aria-expanded','false');
      quickSettingsMenu?.classList.remove('open');
      quickSettingsButton?.setAttribute('aria-expanded','false');
    });
  }

  document.addEventListener('click',e=>{
    if(menu&&account&&!menu.contains(e.target)&&!account.contains(e.target)){
      menu.classList.remove('open');
      account.setAttribute('aria-expanded','false');
    }
    if(bellMenu&&bell&&!bellMenu.contains(e.target)&&!bell.contains(e.target)){
      bellMenu.classList.remove('open');
      bell.setAttribute('aria-expanded','false');
    }
    if(quickSettingsMenu&&quickSettingsButton&&!quickSettingsMenu.contains(e.target)&&!quickSettingsButton.contains(e.target)){
      quickSettingsMenu.classList.remove('open');
      quickSettingsButton.setAttribute('aria-expanded','false');
    }
  },{once:true});

  profilePhotoInput?.addEventListener('change',()=>{
    const file=profilePhotoInput.files?.[0]||null;
    profilePhotoInput.value='';
    if(file)openProfilePhotoCropper(file,isWorkspace);
  });

  document.querySelectorAll('[data-account-action]').forEach(button=>{
    button.addEventListener('click',()=>{
      const action=button.dataset.accountAction;
      if(action==='settings'){
        menu?.classList.remove('open');
        account?.setAttribute('aria-expanded','false');
        openProfileSettings(isWorkspace);
        return;
      }
      const u=new URL(siteBase()+'/blank-8');
      u.searchParams.set('nxoAccountAction',action);
      location.assign(u.href);
    });
  });
}

function toolCard(t){const route=toolLaunchUrl(t),usable=!!route&&t.status!=='PLANNED',name=t.workspaceName||t.nameEs||t.nameEn||t.toolKey,description=t.workspaceDescription||t.descriptionEs||'';return '<article class="nxo-card '+(usable?'clickable':'')+'" '+(usable?'data-tool="'+esc(route)+'"':'')+'><div class="nxo-card-top"><div class="nxo-tool-icon">'+iconTag(toolIconKey(t),name)+'</div><span class="nxo-status '+esc(t.status||'')+'">'+esc(statusText(t.status))+'</span></div><h4>'+esc(name)+'</h4><p>'+esc(description)+'</p><div class="nxo-card-footer"><span class="nxo-role">'+(usable?ui('Abrir herramienta','Open tool'):ui('Aún no disponible','Not available yet'))+'</span><span>›</span></div></article>'}

function workspaceCard(w,archived=false){
  const logo=mediaUrl(w.logoImage);
  const manageable=w.canManageWorkspace===true;
  const editableLogo=manageable&&!archived;
  const fallbackName=ui('Espacio de trabajo','Workspace');
  const logoInner=(logo?'<img src="'+esc(logo)+'" alt="'+esc((w.name||fallbackName)+' logo')+'">':iconTag('workspace',w.name||fallbackName));
  const changeImageLabel=ui('Cambiar imagen del espacio de trabajo','Change Workspace image');
  const logoControl=editableLogo
    ?'<label class="nxo-workspace-logo nxo-workspace-logo-edit" data-workspace-logo-edit="'+esc(w.workspaceId)+'" role="button" tabindex="0" aria-label="'+esc(changeImageLabel)+'" title="'+esc(changeImageLabel)+'">'+
       logoInner+
       '<input type="file" class="nxo-workspace-logo-native-input" data-workspace-logo-file="'+esc(w.workspaceId)+'" accept="image/png,image/jpeg,image/webp,image/svg+xml" aria-label="'+esc(changeImageLabel)+'">'+
     '</label>'
    :'<div class="nxo-workspace-logo">'+logoInner+'</div>';
  const menu=manageable
    ?'<div class="nxo-workspace-actions">'+
       '<button type="button" class="nxo-workspace-menu-button" data-workspace-menu="'+esc(w.workspaceId)+'" aria-label="'+esc(ui('Opciones del espacio de trabajo','Workspace options'))+'" aria-expanded="false">'+iconTag('mas-opciones')+'</button>'+
       '<div class="nxo-workspace-menu" data-workspace-menu-panel="'+esc(w.workspaceId)+'">'+
         (archived
           ?'<button type="button" data-workspace-action="restore" data-workspace-id="'+esc(w.workspaceId)+'">'+esc(ui('Restaurar','Restore'))+'</button>'
           :'<button type="button" data-workspace-action="duplicate" data-workspace-id="'+esc(w.workspaceId)+'">'+esc(ui('Duplicar','Duplicate'))+'</button>'+
            '<button type="button" data-workspace-action="archive" data-workspace-id="'+esc(w.workspaceId)+'">'+esc(ui('Archivar','Archive'))+'</button>')+
         (w.isOwner?'<button type="button" class="danger" data-workspace-action="delete" data-workspace-id="'+esc(w.workspaceId)+'">'+esc(ui('Eliminar','Delete'))+'</button>':'')+
       '</div>'+
     '</div>'
    :'';
  return '<article class="nxo-card nxo-workspace-card '+(archived?'archived':'clickable')+'" '+(!archived?'data-workspace="'+esc(w.workspaceId)+'"':'')+'>'+
    '<div class="nxo-card-top">'+logoControl+'<div class="nxo-workspace-card-tools"><span class="nxo-status '+(archived?'ARCHIVED':'ACTIVE')+'">'+esc(archived?ui('Archivado','Archived'):ui('Activo','Active'))+'</span>'+menu+'</div></div>'+
    '<h4>'+esc(w.name)+'</h4>'+
    '<p>'+esc(w.description||ui('Espacio de trabajo Nexo','Nexo Workspace'))+'</p>'+
    '<div class="nxo-card-footer"><span class="nxo-role">'+esc(roleName(w.roleKey,w.role))+'</span><span>'+(archived?'':'›')+'</span></div>'+
  '</article>'
}

function closeWorkspaceMenus(except=''){
  document.querySelectorAll('[data-workspace-menu-panel]').forEach(panel=>{
    if(panel.dataset.workspaceMenuPanel!==except)panel.classList.remove('open')
  });
  document.querySelectorAll('[data-workspace-menu]').forEach(button=>{
    if(button.dataset.workspaceMenu!==except)button.setAttribute('aria-expanded','false')
  })
}

function bindWorkspaceCards(){
  document.querySelectorAll('[data-workspace]').forEach(card=>card.onclick=e=>{
    if(e.target.closest('[data-workspace-menu],[data-workspace-menu-panel],[data-workspace-logo-edit],[data-workspace-logo-file]'))return;
    openWorkspace(card.dataset.workspace)
  });
  document.querySelectorAll('[data-workspace-menu]').forEach(button=>button.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    const id=button.dataset.workspaceMenu;
    const panel=document.querySelector('[data-workspace-menu-panel="'+CSS.escape(id)+'"]');
    const open=!panel?.classList.contains('open');
    closeWorkspaceMenus(open?id:'');
    panel?.classList.toggle('open',open);
    button.setAttribute('aria-expanded',open?'true':'false')
  });
  document.querySelectorAll('[data-workspace-action]').forEach(button=>button.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    closeWorkspaceMenus();
    workspaceCardAction(button.dataset.workspaceId,button.dataset.workspaceAction)
  });
  document.querySelectorAll('[data-workspace-logo-edit]').forEach(control=>control.onkeydown=e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    e.preventDefault();e.stopPropagation();
    control.querySelector('[data-workspace-logo-file]')?.click()
  });
  document.querySelectorAll('[data-workspace-logo-file]').forEach(input=>input.onchange=e=>{
    e.stopPropagation();
    const file=input.files?.[0];
    input.value='';
    if(file)uploadWorkspaceCardLogo(input.dataset.workspaceLogoFile,file)
  })
}

async function workspaceCardAction(workspaceId,action){
  const item=(personal?.workspaces||[]).find(x=>x.workspaceId===workspaceId);
  const name=item?.name||ui('este espacio de trabajo','this Workspace');
  try{
    if(action==='duplicate'){
      if(!confirm('¿Duplicar '+name+'? Se copiarán nombre, descripción, logo y configuración de herramientas. No se copiarán miembros ni datos operativos.'))return;
      loading(ui('Duplicando espacio de trabajo…','Duplicating Workspace…'));
      const result=await api('workspace.duplicate',{workspaceId});
      personal=result?.personal||await api('personal.refresh');
      toast(ui('Espacio de trabajo duplicado','Workspace duplicated'));
      renderPersonal();
      return
    }
    if(action==='archive'){
      if(!confirm('¿Archivar '+name+'? Podrás restaurarlo después desde Mi espacio.'))return;
      loading(ui('Archivando espacio de trabajo…','Archiving Workspace…'));
      personal=await api('workspace.archive',{workspaceId});
      toast(ui('Espacio de trabajo archivado','Workspace archived'));
      renderPersonal();
      return
    }
    if(action==='restore'){
      loading(ui('Restaurando espacio de trabajo…','Restoring Workspace…'));
      personal=await api('workspace.restore',{workspaceId});
      toast(ui('Espacio de trabajo restaurado','Workspace restored'));
      renderPersonal();
      return
    }
    if(action==='delete'){
      if(!confirm(ui('¿Eliminar '+name+'? Se ocultará y desactivará el espacio de trabajo. Sus datos no se borrarán en cascada.','Delete '+name+'? The Workspace will be hidden and disabled. Its data will not be cascade-deleted.')))return;
      loading(ui('Eliminando espacio de trabajo…','Deleting Workspace…'));
      personal=await api('workspace.delete',{workspaceId});
      toast(ui('Espacio de trabajo eliminado','Workspace deleted'));
      renderPersonal()
    }
  }catch(e){errorView(e)}
}
function bindTools(){document.querySelectorAll('[data-tool]').forEach(x=>x.onclick=()=>location.assign(x.dataset.tool))}
async function start(){
  loading();
  const b=await waitBoot();
  accessStage='EXCHANGE';
  stripBoot();
  const ex=await api('exchange',{bootToken:b});
  sessionToken=ex.sessionToken||'';
  if(!sessionToken)throw accessError('NO_SESSION_TOKEN');
  accessStage='BOOTSTRAP';
  personal=await api('bootstrap');
  applyLanguage(personal?.profile?.locale||new URLSearchParams(location.search).get('nxoLang')||storedLanguage(),true);
  if(!String(personal?.profile?.workName||'').trim()){
    await requireWorkNameOnboarding();
  }

  const params=new URLSearchParams(location.search);
  const inviteToken=String(params.get('nxoJoin')||'').trim();
  if(inviteToken){
    try{
      loading(ui('Uniéndote al espacio de trabajo…','Joining Workspace…'));
      workspace=await api('workspace.join.link',{token:inviteToken});
      const u=new URL(location.href);
      u.searchParams.delete('nxoJoin');
      if(workspace?.workspace?.id)u.searchParams.set('nxoWorkspace',workspace.workspace.id);
      history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
      workspaceTab='tools';
      renderWorkspace();
      toast(workspace?.alreadyMember?ui('Espacio de trabajo abierto','Workspace opened'):ui('Te uniste a ','You joined ')+(workspace?.workspace?.name||ui('el espacio de trabajo','the Workspace')));
      return
    }catch(e){
      const u=new URL(location.href);
      u.searchParams.delete('nxoJoin');
      history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
      errorView(e);
      return
    }
  }

  const acquireTool=String(params.get('nxoAcquireTool')||'').trim();
  if(acquireTool){
    try{
      loading('Añadiendo herramienta a Mi espacio…');
      personal=await api('personal.tool.acquire',{toolKey:acquireTool});
      const u=new URL(location.href);
      u.searchParams.delete('nxoAcquireTool');
      history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
      renderPersonal();
      toast('Herramienta añadida a Mi espacio');
      return
    }catch(e){
      const u=new URL(location.href);
      u.searchParams.delete('nxoAcquireTool');
      history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
      errorView(e);
      return
    }
  }

  const requestedWorkspace=params.get('nxoWorkspace');
  if(requestedWorkspace){
    try{
      workspace=await api('workspace.open',{workspaceId:requestedWorkspace});
      workspaceTab='tools';
      renderWorkspace();
      return
    }catch(_){clearWorkspaceReturnParam()}
  }
  renderPersonal()
}
function renderPersonal(){
  stopWorkspaceNotificationPolling();
  workspaceNotificationSignature='';
  workspace=null;workspaceMembers=null;workspaceRoles=null;workspaceToolConfig=null;workspaceRecipeComments=null;workspacePendingNotes=null;
  const tools=personal?.tools||[],spaces=personal?.workspaces||[];
  const activeSpaces=spaces.filter(w=>String(w.status||'ACTIVE').toUpperCase()!=='ARCHIVED');
  const archivedSpaces=spaces.filter(w=>String(w.status||'').toUpperCase()==='ARCHIVED');
  const inv=personal?.invitations||[];
  let welcomeHidden=false;try{welcomeHidden=localStorage.getItem('nexoWelcomeDismissed:v1')==='1'}catch(_){}
  const welcome=welcomeHidden?'':'<section class="nxo-welcome"><button id="nxo-dismiss-welcome" class="nxo-welcome-close" aria-label="'+esc(ui('Cerrar','Close'))+'">'+iconTag('cerrar')+'</button><div class="nxo-eyebrow">'+esc(ui('Mi espacio','My space'))+'</div><h2>'+esc(ui('Hola, ','Hello, '))+esc(personal?.profile?.displayName||ui('Usuario Nexo','Nexo user'))+'</h2><p>'+esc(ui('Desde aquí administras tus herramientas personales y entras a los espacios de trabajo donde colaboras. Puedes cerrar este mensaje cuando ya no lo necesites.','Manage your personal tools here and enter the Workspaces where you collaborate. You can close this message when you no longer need it.'))+'</p></section>';
  const summary='<section class="nxo-summary-strip"><div class="nxo-summary-item"><span class="nxo-summary-icon">'+iconTag('herramientas')+'</span><strong>'+tools.length+'</strong><span>'+esc(ui('Mis herramientas','My tools'))+'</span></div><div class="nxo-summary-item"><span class="nxo-summary-icon">'+iconTag('workspace')+'</span><strong>'+spaces.length+'</strong><span>'+esc(ui('Espacios de trabajo','Workspaces'))+'</span></div><div class="nxo-summary-item"><span class="nxo-summary-icon">'+iconTag('invitaciones')+'</span><strong>'+inv.length+'</strong><span>'+esc(ui('Invitaciones','Invitations'))+'</span></div><div class="nxo-summary-item"><span class="nxo-summary-icon">'+iconTag('activo')+'</span><strong>●</strong><span>'+esc(ui('Cuenta activa','Active account'))+'</span></div></section>';
  const legacyInvites=inv.length?'<section class="nxo-section"><div class="nxo-section-head"><div><h3>'+esc(ui('Invitaciones pendientes','Pending invitations'))+'</h3><p>'+esc(ui('Invitaciones heredadas asociadas directamente a tu cuenta.','Legacy invitations linked directly to your account.'))+'</p></div></div>'+inv.map(i=>'<div class="nxo-invite"><div><strong>'+esc(i.workspaceName)+'</strong><p>'+esc(ui('Rol: ','Role: '))+esc(roleName(i.roleKey,i.role))+'</p></div><div class="nxo-invite-actions"><button class="nxo-btn" data-invite-decline="'+esc(i.id)+'">'+esc(ui('Rechazar','Decline'))+'</button><button class="nxo-btn nxo-btn-gold" data-invite-accept="'+esc(i.id)+'">'+esc(ui('Aceptar','Accept'))+'</button></div></div>').join('')+'</section>':'';
  const explore='<article class="nxo-card clickable nxo-explore-card" data-tool="'+esc(centerDevelopmentUrl())+'"><div class="nxo-card-top"><div class="nxo-tool-icon">'+iconTag('catalogo',ui('Catálogo','Catalog'))+'</div><span class="nxo-status ACTIVE">'+esc(ui('Catálogo','Catalog'))+'</span></div><h4>'+esc(ui('Explorar más herramientas','Explore more tools'))+'</h4><p>'+esc(ui('Abre el Centro de desarrollo para conocer todas las herramientas activas de Nexo y, más adelante, probarlas o añadirlas mediante un plan.','Open the Development Center to see all active Nexo tools and later try or add them through a plan.'))+'</p><div class="nxo-card-footer"><span class="nxo-role">'+esc(ui('Centro de desarrollo','Development Center'))+'</span><span>›</span></div></article>';
  const personalTools='<section class="nxo-section"><div class="nxo-section-head"><div><h3>'+esc(ui('Mis herramientas','My tools'))+'</h3><p>'+esc(ui('Aquí aparecen únicamente las herramientas disponibles para tu cuenta.','Only tools available to your account appear here.'))+'</p></div></div><div class="nxo-grid">'+tools.map(toolCard).join('')+explore+'</div></section>';
  const workspaceMobileActions='<div class="nxo-workspace-mobile-actions" aria-label="'+esc(ui('Acciones de espacios de trabajo','Workspace actions'))+'"><button id="nxo-join-workspace-mobile" class="nxo-btn">'+iconLabel('unirse-a-workspace',ui('Unirse a un espacio de trabajo','Join a Workspace'))+'</button><button id="nxo-create-workspace-mobile" class="nxo-btn nxo-btn-gold">'+iconLabel('nuevo-workspace',ui('Nuevo espacio de trabajo','New Workspace'))+'</button></div>';
  const workspaceCards='<section class="nxo-section"><div class="nxo-section-head nxo-workspace-list-head"><div><h3>'+esc(ui('Mis espacios de trabajo','My Workspaces'))+'</h3><p>'+esc(ui('Espacios de trabajo que creaste o a los que te uniste.','Workspaces you created or joined.'))+'</p></div><div class="nxo-section-actions nxo-workspace-desktop-actions"><button id="nxo-join-workspace" class="nxo-btn">'+iconLabel('unirse-a-workspace',ui('Unirse a un espacio de trabajo','Join a Workspace'))+'</button><button id="nxo-create-workspace" class="nxo-btn nxo-btn-gold">'+iconLabel('nuevo-workspace',ui('Nuevo espacio de trabajo','New Workspace'))+'</button></div></div>'+(activeSpaces.length?'<div class="nxo-grid">'+activeSpaces.map(w=>workspaceCard(w,false)).join('')+'</div>':'<div class="nxo-empty">'+esc(ui('No tienes espacios de trabajo activos.','You have no active Workspaces.'))+'</div>')+'</section>';
  const archivedCards=archivedSpaces.length?'<section class="nxo-section nxo-archived-section"><div class="nxo-section-head"><div><h3>'+esc(ui('Archivados','Archived'))+'</h3><p>'+esc(ui('Espacios de trabajo guardados fuera de la vista activa. Puedes restaurarlos cuando quieras.','Workspaces stored outside the active view. You can restore them at any time.'))+'</p></div><span class="nxo-chip">'+archivedSpaces.length+'</span></div><div class="nxo-grid">'+archivedSpaces.map(w=>workspaceCard(w,true)).join('')+'</div></section>':'';
  html('<div class="nxo-shell">'+topbar('personal')+'<main class="nxo-main">'+welcome+summary+legacyInvites+personalTools+workspaceMobileActions+workspaceCards+archivedCards+'</main></div>');
  bindTopbar('personal');bindTools();bindWorkspaceCards();
  document.getElementById('nxo-create-workspace')?.addEventListener('click',createWorkspaceModal);
  document.getElementById('nxo-join-workspace')?.addEventListener('click',joinWorkspaceModal);
  document.getElementById('nxo-create-workspace-mobile')?.addEventListener('click',createWorkspaceModal);
  document.getElementById('nxo-join-workspace-mobile')?.addEventListener('click',joinWorkspaceModal);
  document.getElementById('nxo-dismiss-welcome')?.addEventListener('click',()=>{try{localStorage.setItem('nexoWelcomeDismissed:v1','1')}catch(_){}renderPersonal()});
  document.querySelectorAll('[data-invite-accept]').forEach(b=>b.onclick=()=>respondInvite(b.dataset.inviteAccept,'accept'));
  document.querySelectorAll('[data-invite-decline]').forEach(b=>b.onclick=()=>respondInvite(b.dataset.inviteDecline,'decline'));
  setTimeout(()=>document.addEventListener('click',()=>closeWorkspaceMenus(),{once:true}),0)
}
async function refreshPersonal(){personal=await api('personal.refresh');renderPersonal()}
async function respondInvite(id,decision){try{loading(decision==='accept'?'Aceptando invitación…':'Actualizando invitación…');personal=await api('invitation.respond',{invitationId:id,decision});toast(decision==='accept'?'Invitación aceptada':'Invitación rechazada');renderPersonal()}catch(e){errorView(e)}}
function modal(title,body,onReady){const o=document.createElement('div');o.className='nxo-overlay';o.innerHTML='<div class="nxo-modal"><div class="nxo-modal-head"><strong>'+esc(title)+'</strong><button class="nxo-btn" data-close aria-label="'+esc(ui('Cerrar','Close'))+'">'+iconTag('cerrar')+'</button></div><div class="nxo-modal-body">'+body+'</div></div>';document.body.appendChild(o);o.querySelector('[data-close]').onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()};if(onReady)onReady(o);return o}
function openProfileSettings(inWorkspace=false){
  const name=personal?.profile?.displayName||ui('Usuario Nexo','Nexo user');
  const workName=personal?.profile?.workName||name;
  const photo=String(personal?.profile?.photoImage?.url||'').trim();
  const locale=String(personal?.profile?.locale||'es').toLowerCase();
  const language=locale.startsWith('en')?'English':'Español';
  const role=inWorkspace?roleName(workspace?.membership?.roleKey,workspace?.role):ui('Cuenta personal','Personal account');
  const context=inWorkspace?(workspace?.workspace?.name||ui('Espacio de trabajo','Workspace')):ui('Mi espacio','My space');
  const avatar=photo?'<img src="'+esc(photo)+'" alt="'+esc(name+' '+ui('foto de perfil','profile photo'))+'">':'<span>'+esc(initials(name))+'</span>';
  modal(ui('Ajustes de perfil','Profile settings'),
    '<div class="nxo-profile-settings">'+
      '<section class="nxo-profile-settings-hero">'+
        '<div class="nxo-profile-settings-avatar">'+avatar+'</div>'+
        '<div class="nxo-profile-settings-main">'+
          '<strong>'+esc(name)+'</strong>'+
          '<span>'+esc(role)+'</span>'+
          '<small>'+esc(context)+'</small>'+
        '</div>'+
        '<button type="button" class="nxo-btn" id="nxo-profile-settings-photo">'+esc(ui('Cambiar foto','Change photo'))+'</button>'+
      '</section>'+
      '<section class="nxo-profile-settings-section">'+
        '<div class="nxo-profile-settings-section-head"><strong>'+esc(ui('Perfil','Profile'))+'</strong><span>'+esc(ui('Información visible dentro de Nexo.','Information visible inside Nexo.'))+'</span></div>'+
        '<div class="nxo-profile-settings-form">'+
          '<label class="nxo-field nxo-profile-work-name-field">'+
            '<span>'+esc(ui('Nombre de trabajo','Work name'))+'</span>'+
            '<input id="nxo-profile-work-name" class="nxo-input" maxlength="120" value="'+esc(workName)+'" autocomplete="name">'+
            '<small>'+esc(ui('Es el nombre que mostramos al equipo y el que Nexo usará para reconocerte en automatizaciones, como la lectura de tu Schedule.','This is the name shown to your team and the identity Nexo will use for automations such as Schedule matching.'))+'</small>'+
          '</label>'+
          '<div class="nxo-profile-settings-row nxo-profile-role-row"><span>'+esc(ui('Rol actual','Current role'))+'</span><div><strong>'+esc(role)+'</strong><small>'+esc(ui('El rol se administra desde Miembros por un propietario o administrador.','Roles are managed from Members by an owner or administrator.'))+'</small></div></div>'+
          '<div class="nxo-profile-settings-actions"><button type="button" class="nxo-btn nxo-btn-gold" id="nxo-profile-settings-save">'+esc(ui('Guardar perfil','Save profile'))+'</button></div>'+
        '</div>'+
      '</section>'+
      '<section class="nxo-profile-settings-section">'+
        '<div class="nxo-profile-settings-section-head"><strong>'+esc(ui('Preferencias','Preferences'))+'</strong><span>'+esc(ui('Configuración personal de la cuenta.','Personal account settings.'))+'</span></div>'+
        '<div class="nxo-profile-settings-list">'+
          '<div class="nxo-profile-settings-row"><span>'+esc(ui('Idioma','Language'))+'</span><strong>'+esc(language)+'</strong></div>'+
        '</div>'+
      '</section>'+
    '</div>',
    o=>{
      const input=o.querySelector('#nxo-profile-work-name');
      const save=o.querySelector('#nxo-profile-settings-save');
      o.querySelector('#nxo-profile-settings-photo')?.addEventListener('click',()=>{
        o.remove();
        document.getElementById('nxo-profile-photo-input')?.click();
      });
      save?.addEventListener('click',async()=>{
        const value=String(input?.value||'').trim().replace(/\s+/g,' ');
        if(value.length<2){
          toast(ui('Escribe tu nombre de trabajo','Enter your work name'));
          input?.focus();
          return
        }
        save.disabled=true;
        save.textContent=ui('Guardando…','Saving…');
        try{
          personal=await api('profile.identity.set',{input:{workName:value}});
          o.remove();
          toast(ui('Perfil actualizado','Profile updated'));
          if(inWorkspace&&workspace)renderWorkspace();else renderPersonal()
        }catch(e){
          save.disabled=false;
          save.textContent=ui('Guardar perfil','Save profile');
          toast(e.message||String(e))
        }
      })
    }
  )
}

function requireWorkNameOnboarding(){
  return new Promise(resolve=>{
    renderPersonal();
    const o=document.createElement('div');
    o.className='nxo-overlay nxo-onboarding-overlay';
    const current=String(personal?.profile?.displayName||'').trim();
    o.innerHTML=
      '<div class="nxo-modal nxo-onboarding-modal">'+
        '<div class="nxo-modal-body">'+
          '<div class="nxo-onboarding-icon">ID</div>'+
          '<div class="nxo-eyebrow">'+esc(ui('Configura tu identidad','Set up your identity'))+'</div>'+
          '<h2>'+esc(ui('¿Cuál es tu nombre de trabajo?','What is your work name?'))+'</h2>'+
          '<p>'+esc(ui('Sirve para poder tener clara tu identidad cuando el sistema realiza ajustes automáticos, por ejemplo reconocer tu nombre al analizar un Schedule.','This helps Nexo identify you clearly when it performs automatic tasks, for example matching your name when a Schedule is analyzed.'))+'</p>'+
          '<label class="nxo-field"><span>'+esc(ui('Nombre de trabajo','Work name'))+'</span><input id="nxo-onboarding-work-name" class="nxo-input" maxlength="120" value="'+esc(current)+'" autocomplete="name"></label>'+
          '<button type="button" id="nxo-onboarding-save" class="nxo-btn nxo-btn-gold">'+esc(ui('Continuar','Continue'))+'</button>'+
        '</div>'+
      '</div>';
    document.body.appendChild(o);
    const input=o.querySelector('#nxo-onboarding-work-name');
    const save=o.querySelector('#nxo-onboarding-save');
    setTimeout(()=>input?.focus(),50);
    save?.addEventListener('click',async()=>{
      const value=String(input?.value||'').trim().replace(/\s+/g,' ');
      if(value.length<2){
        toast(ui('Escribe tu nombre de trabajo','Enter your work name'));
        input?.focus();
        return
      }
      save.disabled=true;
      save.textContent=ui('Guardando…','Saving…');
      try{
        personal=await api('profile.identity.set',{input:{workName:value}});
        o.remove();
        resolve()
      }catch(e){
        save.disabled=false;
        save.textContent=ui('Continuar','Continue');
        toast(e.message||String(e))
      }
    })
  })
}

function createWorkspaceModal(){
  modal(ui('Crear espacio de trabajo','Create Workspace'),
    '<div class="nxo-field"><label>'+esc(ui('Nombre','Name'))+'</label><input id="nxo-ws-name" class="nxo-input" placeholder="Ej. Old Hickory"></div><div class="nxo-field"><label>'+esc(ui('Descripción','Description'))+'</label><textarea id="nxo-ws-desc" class="nxo-textarea" placeholder="'+esc(ui('Describe el propósito de este espacio.','Describe the purpose of this Workspace.'))+'"></textarea></div><div class="nxo-modal-actions"><button class="nxo-btn nxo-btn-gold" id="nxo-ws-save">'+esc(ui('Crear espacio de trabajo','Create Workspace'))+'</button></div>',
    o=>{o.querySelector('#nxo-ws-save').onclick=async()=>{const name=o.querySelector('#nxo-ws-name').value.trim(),description=o.querySelector('#nxo-ws-desc').value.trim();if(!name){toast(ui('Escribe un nombre','Enter a name'));return}try{o.remove();loading(ui('Creando espacio de trabajo…','Creating Workspace…'));workspace=await api('workspace.create',{input:{name,description}});await openWorkspace(workspace.workspace.id,true)}catch(e){errorView(e)}}})
}
function joinWorkspaceModal(){
  modal(ui('Unirse a un espacio de trabajo','Join a Workspace'),
    '<div class="nxo-field"><label>'+esc(ui('Código de invitación','Invitation code'))+'</label><input id="nxo-join-code" class="nxo-input" placeholder="NEXO-ABCDE-12345" autocomplete="off" autocapitalize="characters"></div><p class="nxo-muted" style="margin:0;line-height:1.55">'+esc(ui('Pega el código que te compartió un administrador del espacio de trabajo. Los códigos son de un solo uso.','Paste the code shared by a Workspace administrator. Codes are single-use.'))+'</p><div class="nxo-modal-actions"><button id="nxo-join-submit" class="nxo-btn nxo-btn-gold">'+esc(ui('Unirme al espacio de trabajo','Join Workspace'))+'</button></div>',
    o=>{const input=o.querySelector('#nxo-join-code'),button=o.querySelector('#nxo-join-submit');input?.focus();button.onclick=async()=>{const code=input.value.trim();if(!code){toast(ui('Escribe el código de invitación','Enter the invitation code'));return}button.disabled=true;button.textContent=ui('Validando…','Validating…');try{workspace=await api('workspace.join.code',{code});o.remove();setWorkspaceReturnParam(workspace?.workspace?.id||'');workspaceTab='tools';toast(ui('Te uniste a ','You joined ')+(workspace?.workspace?.name||ui('el espacio de trabajo','the Workspace')));renderWorkspace()}catch(e){button.disabled=false;button.textContent=ui('Unirme al espacio de trabajo','Join Workspace');toast(e.message||String(e))}}})
}
async function openWorkspace(id,alreadyOpen=false){try{stopWorkspaceNotificationPolling();workspaceNotificationSignature='';loading(ui('Abriendo espacio de trabajo…','Opening Workspace…'));workspace=alreadyOpen&&workspace?workspace:await api('workspace.open',{workspaceId:id});workspaceRecipeComments=null;workspacePendingNotes=null;setWorkspaceReturnParam(workspace?.workspace?.id||id);workspaceTab='tools';renderWorkspace()}catch(e){errorView(e)}}
async function returnPersonal(){try{loading('Volviendo a Mi espacio…');personal=await api('workspace.return');clearWorkspaceReturnParam();renderPersonal()}catch(e){errorView(e)}}
function renderWorkspace(){
  const ws=workspace?.workspace||{},role=workspace?.role||{},tools=workspace?.tools||[];
  const perms=role.permissions||[];
  const canMembers=workspace?.membership?.roleKey==='owner'||perms.some(x=>['members.view','members.manage','members.invite'].includes(x));
  const canTools=perms.includes('tools.configure');
  const canSchedule=perms.includes('schedule.read.self')||perms.includes('schedule.read.workspace')||perms.includes('schedule.manage');
  const canAdmin=workspace?.membership?.roleKey==='owner'||perms.some(x=>['workspace.manage','members.manage','tools.configure'].includes(x));
  const tabs=['<button class="nxo-tab '+(workspaceTab==='tools'?'active':'')+'" data-wtab="tools">'+iconLabel('herramientas',ui('Herramientas','Tools'))+'</button>'];
  if(canSchedule)tabs.push('<button class="nxo-tab '+(workspaceTab==='schedule'?'active':'')+'" data-wtab="schedule">'+iconLabel('recordatorio',ui('Horarios','Schedule'))+'</button>');
  if(canMembers)tabs.push('<button class="nxo-tab '+(workspaceTab==='members'?'active':'')+'" data-wtab="members">'+iconLabel('perfil',ui('Miembros','Members'))+'</button>');
  tabs.push('<button class="nxo-tab '+(workspaceTab==='access'?'active':'')+'" data-wtab="access">'+iconLabel('acceso-rol',ui('Mi acceso','My access'))+'</button>');
  if(canTools)tabs.push('<button class="nxo-tab nxo-settings-tab '+(workspaceTab==='settings'?'active':'')+'" data-wtab="settings">'+iconLabel('ajustes-rapidos',ui('Configuración','Settings'))+'</button>');
  let body='';
  if(workspaceTab==='tools')body=(canAdmin?renderPendingNotesShell():'')+renderWorkspaceTools(tools);
  else if(workspaceTab==='schedule')body=renderScheduleShell();
  else if(workspaceTab==='members')body='<div id="nxo-members-zone"><div class="nxo-empty">'+esc(ui('Cargando miembros…','Loading members…'))+'</div></div>';
  else if(workspaceTab==='settings')body='<div id="nxo-settings-zone"><div class="nxo-empty">'+esc(ui('Cargando configuración…','Loading settings…'))+'</div></div>';
  else body=renderAccess(role);
  html('<div class="nxo-shell">'+topbar('workspace')+'<main class="nxo-main"><div class="nxo-workspace-header"><div><div class="nxo-eyebrow">'+esc(ui('Espacio de trabajo','Workspace'))+'</div><h2>'+esc(ws.name||ui('Espacio de trabajo','Workspace'))+'</h2><p>'+esc(ws.description||'')+'</p></div></div><div class="nxo-tabs">'+tabs.join('')+'</div>'+body+'</main></div>');
  bindTopbar('workspace');
  document.querySelectorAll('[data-wtab]').forEach(b=>b.onclick=()=>{workspaceTab=b.dataset.wtab;renderWorkspace()});
  bindTools();
  if(canAdmin){
    if(workspaceTab==='tools')refreshWorkspaceAdminPanels();else loadWorkspaceRecipeComments();
    startWorkspaceNotificationPolling()
  }else stopWorkspaceNotificationPolling();
  if(workspaceTab==='schedule')loadSchedule();
  if(workspaceTab==='members')loadMembers();
  if(workspaceTab==='settings')loadWorkspaceSettings()
}
function scheduleDateKey(d){
  const x=d instanceof Date?d:new Date(d);
  if(Number.isNaN(x.getTime()))return'';
  return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')
}
function scheduleMonday(value){
  const d=value?new Date(value+'T12:00:00'):new Date(),day=d.getDay()||7;
  d.setDate(d.getDate()-day+1);
  return scheduleDateKey(d)
}
function scheduleShiftWeek(days){
  const base=new Date((scheduleWeekStart||scheduleMonday())+'T12:00:00');
  base.setDate(base.getDate()+days);
  scheduleWeekStart=scheduleDateKey(base);
  scheduleData=null;scheduleImportData=null;scheduleDebug=null;
  loadSchedule()
}
function renderScheduleShell(){
  return '<section class="nxo-section"><div id="nxo-schedule-zone"><div class="nxo-section-head"><div><h3>'+esc(ui('Horarios','Schedule'))+'</h3><p>'+esc(ui('Cargando la semana de trabajo…','Loading work week…'))+'</p></div></div><div class="nxo-empty">'+esc(ui('Cargando horario…','Loading schedule…'))+'</div></div></section>'
}
function scheduleStatusLabel(value){
  const s=String(value||'').toUpperCase();
  return s==='PUBLISHED'?ui('Publicado','Published'):s==='DRAFT'?ui('Borrador','Draft'):s||ui('Sin horario','No schedule')
}
function scheduleTime(value){
  if(!value)return'—';
  try{return new Date(value).toLocaleTimeString(currentLanguage()==='en'?'en-US':'es-US',{hour:'numeric',minute:'2-digit'})}catch(_){return'—'}
}
function scheduleDay(value){
  try{return new Date(value+'T12:00:00').toLocaleDateString(currentLanguage()==='en'?'en-US':'es-US',{weekday:'short',month:'short',day:'numeric'})}catch(_){return value}
}
function closeScheduleDebugModal(){
  if(scheduleDebugModal){scheduleDebugModal.remove();scheduleDebugModal=null}
}
function openScheduleDebugModal(){
  if(scheduleDebugModal&&document.body.contains(scheduleDebugModal)){renderScheduleDebugPanel();return scheduleDebugModal}
  const o=document.createElement('div');
  o.className='nxo-overlay';
  o.id='nxo-schedule-debug-overlay';
  o.innerHTML='<div class="nxo-modal" style="max-width:760px"><div class="nxo-modal-head"><strong>'+esc(ui('Procesando horario','Processing schedule'))+'</strong><button class="nxo-btn" data-schedule-debug-close hidden aria-label="'+esc(ui('Cerrar','Close'))+'">'+iconTag('cerrar')+'</button></div><div class="nxo-modal-body"><div id="nxo-schedule-debug"></div></div></div>';
  document.body.appendChild(o);
  scheduleDebugModal=o;
  o.querySelector('[data-schedule-debug-close]')?.addEventListener('click',closeScheduleDebugModal);
  renderScheduleDebugPanel();
  return o
}
function setScheduleDebugClosable(value){
  const b=scheduleDebugModal?.querySelector('[data-schedule-debug-close]');
  if(b)b.hidden=!value
}
function scheduleDebugIcon(state){
  return state==='done'?'✓':state==='error'?'✕':state==='working'?'◌':'○'
}
function scheduleDebugRow(label,state,detail=''){
  return '<div style="display:grid;grid-template-columns:28px minmax(150px,220px) 1fr;gap:8px;align-items:start;padding:8px 0;border-bottom:1px solid rgba(127,127,127,.12)"><strong>'+esc(scheduleDebugIcon(state))+'</strong><strong>'+esc(label)+'</strong><span class="nxo-muted">'+esc(detail)+'</span></div>'
}
function renderScheduleDebugPanel(){
  const zone=scheduleDebugModal?.querySelector('#nxo-schedule-debug');if(!zone)return;
  const d=scheduleDebug||{},hasError=Boolean(d.error),stage=String(d.stage||'');
  const state=(name,done)=>done?'done':(hasError&&stage===name?'error':(!hasError&&scheduleAnalysisBusy&&stage===name?'working':'pending'));
  const originalKb=Math.round(Number(d.originalBytes||0)/1024),processedKb=Math.round(Number(d.processedBytes||0)/1024);
  const optimizedDetail=d.optimized
    ?(d.originalWidth+'×'+d.originalHeight+' → '+d.processedWidth+'×'+d.processedHeight+' · '+originalKb+' KB → '+processedKb+' KB')
    :ui('Preparando una versión legible y ligera.','Preparing a lightweight readable version.');
  zone.innerHTML='<div>'+
    '<div class="nxo-section-head"><div><h3 style="margin:0">'+esc(ui('Lectura del horario','Schedule reading'))+'</h3><p>'+esc(ui('La imagen se optimiza en el teléfono y el OCR lee texto y posiciones. La imagen no se divide ni se reconstruye.','The image is optimized on the phone and OCR reads text plus positions. The image is not split or reconstructed.'))+'</p></div>'+(scheduleAnalysisBusy?'<span class="nxo-chip">'+esc(ui('Procesando','Processing'))+'</span>':'')+'</div>'+
    scheduleDebugRow(ui('Optimizar imagen','Optimize image'),state('optimize',d.optimized),optimizedDetail)+
    scheduleDebugRow(ui('Preparar OCR','Prepare OCR'),state('ocr-load',d.ocrReady),d.ocrReady?ui('Motor OCR listo.','OCR engine ready.'):ui('Cargando lector de texto.','Loading text reader.'))+
    scheduleDebugRow(ui('Leer texto','Read text'),state('ocr',d.ocrCompleted),d.ocrCompleted?((d.wordsDetected||0)+' '+ui('palabras detectadas','words detected')):((d.ocrPass?ui('Pasada ','Pass ')+d.ocrPass+' · ':'')+(d.ocrProgress?Math.round(d.ocrProgress*100)+'%':ui('Esperando lectura.','Waiting to read.'))))+
    scheduleDebugRow(ui('Mapear estructura','Map structure'),state('map',d.mapped),d.mapped?ui('Días, colaboradores, horarios y roles comparados.','Days, members, hours, and roles matched.'):ui('Esperando OCR.','Waiting for OCR.'))+
    scheduleDebugRow(ui('Días / fechas','Days / dates'),d.mapped?(Number(d.daysDetected||0)>0?'done':'error'):'pending',String(d.daysDetected||0))+
    scheduleDebugRow(ui('Colaboradores','Members'),d.mapped?(Number(d.collaboratorsDetected||0)>0?'done':'error'):'pending',String(d.collaboratorsDetected||0))+
    scheduleDebugRow(ui('Roles','Roles'),d.mapped?(Number(d.positionsDetected||0)>0?'done':'error'):'pending',String(d.positionsDetected||0))+
    scheduleDebugRow(ui('Turnos / horarios','Shifts / hours'),d.mapped?(Number(d.shiftsDetected||0)>0?'done':'error'):'pending',String(d.shiftsDetected||0))+
    (hasError?'<div class="nxo-empty" style="margin-top:14px;text-align:left"><strong>'+esc(ui('Error: ','Error: '))+'</strong>'+esc(String(d.error))+'</div>':'')+
  '</div>';
  setScheduleDebugClosable(hasError||(!scheduleAnalysisBusy&&d.mapped))
}
function scheduleImageElement(file){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error(ui('No se pudo abrir la imagen seleccionada.','Could not open the selected image.')))};
    img.src=url
  })
}
function scheduleCanvasBlob(canvas,quality){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error(ui('No se pudo optimizar la imagen.','Could not optimize the image.'))),'image/jpeg',quality))
}
async function optimizeScheduleImage(file){
  let source=null,originalWidth=0,originalHeight=0;
  if(typeof createImageBitmap==='function'){
    try{source=await createImageBitmap(file,{imageOrientation:'from-image'});originalWidth=source.width;originalHeight=source.height}catch(_){}
  }
  if(!source){
    source=await scheduleImageElement(file);originalWidth=source.naturalWidth||source.width;originalHeight=source.naturalHeight||source.height
  }
  if(!originalWidth||!originalHeight)throw new Error(ui('La imagen no tiene dimensiones válidas.','The image has invalid dimensions.'));
  const maxSide=file.size>6*1024*1024?3600:(file.size>3*1024*1024?4000:4200);
  const scale=Math.min(1,maxSide/Math.max(originalWidth,originalHeight));
  const width=Math.max(1,Math.round(originalWidth*scale)),height=Math.max(1,Math.round(originalHeight*scale));
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d',{alpha:false});
  ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(source,0,0,width,height);
  try{if(source&&typeof source.close==='function')source.close()}catch(_){}
  let quality=.88,blob=await scheduleCanvasBlob(canvas,quality);
  while(blob.size>1500000&&quality>.64){quality-=.08;blob=await scheduleCanvasBlob(canvas,quality)}
  return {blob,width,height,originalWidth,originalHeight,quality}
}
async function scheduleBlobToBitmap(blob){
  if(typeof createImageBitmap==='function'){
    try{return await createImageBitmap(blob,{imageOrientation:'from-image'})}catch(_){}
  }
  return scheduleImageElement(blob)
}
function schedulePngBlob(canvas){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error(ui('No se pudo preparar la imagen OCR.','Could not prepare OCR image.'))),'image/png'))
}
async function prepareScheduleOcrVariant(blob,mode='enhanced'){
  const source=await scheduleBlobToBitmap(blob);
  const sw=source.width||source.naturalWidth,sh=source.height||source.naturalHeight;
  if(!sw||!sh)throw new Error(ui('La imagen OCR no tiene dimensiones válidas.','OCR image has invalid dimensions.'));
  const long=Math.max(sw,sh);
  const targetLong=Math.min(3200,Math.max(2600,long));
  const scale=targetLong/long;
  const width=Math.max(1,Math.round(sw*scale)),height=Math.max(1,Math.round(sh*scale));
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d',{alpha:false,willReadFrequently:true});
  ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(source,0,0,width,height);
  try{if(source&&typeof source.close==='function')source.close()}catch(_){}
  const image=ctx.getImageData(0,0,width,height),d=image.data;
  let avg=0,count=0;
  for(let i=0;i<d.length;i+=16){
    avg+=(d[i]*0.299+d[i+1]*0.587+d[i+2]*0.114);count++
  }
  avg=count?avg/count:180;
  const contrast=mode==='threshold'?1.75:1.42;
  const threshold=Math.max(138,Math.min(205,avg*0.92));
  for(let i=0;i<d.length;i+=4){
    let g=d[i]*0.299+d[i+1]*0.587+d[i+2]*0.114;
    g=(g-128)*contrast+128;
    if(mode==='threshold'){
      g=g<threshold?0:255;
    }else{
      g=Math.max(0,Math.min(255,g));
      if(g<45)g=0;
      else if(g>230)g=255;
    }
    d[i]=d[i+1]=d[i+2]=g;d[i+3]=255
  }
  ctx.putImageData(image,0,0);
  const out=await schedulePngBlob(canvas);
  canvas.width=1;canvas.height=1;
  return {blob:out,width,height,mode}
}
function scheduleOcrNormalize(value){
  return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9:+./&'-]+/g,' ').replace(/\s+/g,' ').trim()
}
function scheduleOcrSignals(words){
  const text=' '+scheduleOcrNormalize((words||[]).map(w=>w.text||'').join(' '))+' ';
  const roles=(scheduleData?.roles||[]).flatMap(r=>[r.name,...(Array.isArray(r.aliases)?r.aliases:[])]);
  const members=(scheduleData?.members||[]).flatMap(m=>[m.displayName,m.workName]).filter(Boolean);
  let roleHits=0,memberHits=0;
  for(const role of roles){
    const n=scheduleOcrNormalize(role);if(n&&text.includes(' '+n+' '))roleHits++
  }
  for(const member of members){
    const parts=scheduleOcrNormalize(member).split(' ').filter(x=>x.length>=3);
    if(parts.some(p=>text.includes(' '+p+' ')))memberHits++
  }
  const timeHits=((text.match(/\b\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?|a|p)?\s*(?:-|to)\s*\d{1,2}(?::\d{2})?/g)||[]).length);
  return {roleHits,memberHits,timeHits,total:(words||[]).length}
}
function mergeScheduleOcrWords(primary,secondary){
  const rows=[...(primary||[])];
  for(const w of (secondary||[])){
    const dup=rows.some(x=>
      scheduleOcrNormalize(x.text)===scheduleOcrNormalize(w.text)&&
      Math.abs(((x.x0+x.x1)/2)-((w.x0+w.x1)/2))<18&&
      Math.abs(((x.y0+x.y1)/2)-((w.y0+w.y1)/2))<14
    );
    if(!dup)rows.push(w)
  }
  return rows.sort((a,b)=>a.y0-b.y0||a.x0-b.x0)
}

function scheduleOcrBase(){
  return 'https://dtokurisu-png.github.io/nexo-inventory-smart/vendor/tesseract'
}
function scheduleOcrGlobal(){
  const t=(typeof globalThis!=='undefined'&&globalThis.Tesseract)||
          (typeof self!=='undefined'&&self.Tesseract)||
          (typeof window!=='undefined'&&window.Tesseract)||
          null;
  if(t&&typeof window!=='undefined'&&!window.Tesseract)window.Tesseract=t;
  return t
}
function loadScheduleOcrLibrary(){
  const ready=scheduleOcrGlobal();
  if(ready)return Promise.resolve(ready);
  if(scheduleOcrLoaderPromise)return scheduleOcrLoaderPromise;
  scheduleOcrLoaderPromise=new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-nexo-schedule-ocr]');
    const finish=()=>{
      const t=scheduleOcrGlobal();
      if(t)resolve(t);
      else reject(new Error('OCR_RUNTIME_NOT_AVAILABLE'))
    };
    if(existing){
      const now=scheduleOcrGlobal();
      if(now){resolve(now);return}
      existing.addEventListener('load',finish,{once:true});
      existing.addEventListener('error',()=>reject(new Error('OCR_RUNTIME_LOAD_FAILED')),{once:true});
      return
    }
    const s=document.createElement('script');
    s.src=scheduleOcrBase()+'/tesseract.min.js?v=20261002-3';
    s.async=true;s.dataset.nexoScheduleOcr='1';
    s.onload=finish;
    s.onerror=()=>reject(new Error(ui('No se pudo cargar el lector OCR local de Nexo.','Could not load the local Nexo OCR reader.')));
    document.head.appendChild(s)
  }).catch(error=>{scheduleOcrLoaderPromise=null;throw error});
  return scheduleOcrLoaderPromise
}
function scheduleWordsFromTesseract(data){
  if(Array.isArray(data?.words)&&data.words.length){
    return data.words.map(w=>({
      text:String(w.text||'').trim(),
      confidence:Number(w.confidence||w.conf||0),
      x0:Number(w.bbox?.x0),y0:Number(w.bbox?.y0),x1:Number(w.bbox?.x1),y1:Number(w.bbox?.y1)
    })).filter(w=>w.text&&[w.x0,w.y0,w.x1,w.y1].every(Number.isFinite))
  }
  const tsv=String(data?.tsv||'');
  if(!tsv)return[];
  return tsv.split(/\r?\n/).slice(1).map(line=>{
    const p=line.split('\t');if(p.length<12||Number(p[0])!==5)return null;
    const left=Number(p[6]),top=Number(p[7]),width=Number(p[8]),height=Number(p[9]);
    return {text:String(p.slice(11).join('\t')||'').trim(),confidence:Number(p[10]||0),x0:left,y0:top,x1:left+width,y1:top+height}
  }).filter(Boolean)
}
async function runScheduleOcr(blob,passLabel='1/1'){
  const T=await loadScheduleOcrLibrary();
  scheduleDebug={...(scheduleDebug||{}),stage:'ocr-load',ocrReady:true,ocrPass:passLabel};
  renderScheduleDebugPanel();
  const base=scheduleOcrBase();
  const worker=await T.createWorker(['eng','spa'],1,{
    workerPath:base+'/worker.min.js?v=20261002-1',
    corePath:base+'/core',
    langPath:base+'/lang',
    gzip:true,
    workerBlobURL:true,
    logger:m=>{
      if(m&&m.status==='recognizing text'){
        scheduleDebug={...(scheduleDebug||{}),stage:'ocr',ocrReady:true,ocrProgress:Number(m.progress||0),ocrPass:passLabel};
        renderScheduleDebugPanel()
      }
    },
    errorHandler:error=>{
      scheduleDebug={...(scheduleDebug||{}),stage:'ocr',error:String(error?.message||error||'OCR_WORKER_ERROR')};
      renderScheduleDebugPanel()
    }
  });
  try{
    if(typeof worker.setParameters==='function'){
      await worker.setParameters({
        tessedit_pageseg_mode:'11',
        preserve_interword_spaces:'1',
        user_defined_dpi:'300'
      })
    }
    const url=URL.createObjectURL(blob);
    try{
      const result=await worker.recognize(url);
      return scheduleWordsFromTesseract(result?.data)
    }finally{URL.revokeObjectURL(url)}
  }finally{
    try{await worker.terminate()}catch(_){}
  }
}
function renderScheduleRoles(){
  const roles=scheduleData?.roles||[],actor=scheduleData?.actor||{};
  const rows=roles.length
    ?roles.map(r=>'<span class="nxo-chip" style="display:inline-flex;gap:8px;align-items:center">'+esc(r.name)+(r.aliases?.length>1?' · '+esc(r.aliases.filter(a=>String(a).toLowerCase()!==String(r.name).toLowerCase()).join(', ')):'')+(actor.canManage?'<button class="nxo-icon-btn" data-schedule-role-remove="'+esc(r.id)+'" aria-label="'+esc(ui('Eliminar rol','Remove role'))+'">'+iconTag('eliminar')+'</button>':'')+'</span>').join(' ')
    :'<span class="nxo-muted">'+esc(ui('No hay roles creados.','No roles created.'))+'</span>';
  return '<div class="nxo-panel" style="padding:16px;margin-bottom:16px"><div class="nxo-section-head"><div><h3>'+esc(ui('Roles del horario','Schedule roles'))+'</h3><p>'+esc(ui('Define los nombres que pueden aparecer junto a las horas: Prep, Sauté, Soldador, Electricista, etc.','Define names that may appear next to hours: Prep, Sauté, Welder, Electrician, etc.'))+'</p></div>'+(actor.canManage?'<button class="nxo-btn" id="nxo-schedule-role-add">'+esc(ui('Añadir rol','Add role'))+'</button>':'')+'</div><div style="display:flex;flex-wrap:wrap;gap:8px">'+rows+'</div></div>'
}
function openScheduleRoleModal(){
  modal(ui('Añadir rol del horario','Add schedule role'),
    '<div class="nxo-field"><label>'+esc(ui('Nombre del rol','Role name'))+'</label><input id="nxo-schedule-role-name" class="nxo-input" placeholder="'+esc(ui('Ej. Prep, Sauté, Electricista','E.g. Prep, Sauté, Electrician'))+'"></div>'+
    '<div class="nxo-field"><label>'+esc(ui('Alias opcionales','Optional aliases'))+'</label><input id="nxo-schedule-role-aliases" class="nxo-input" placeholder="'+esc(ui('Ej. saute, saut','E.g. saute, saut'))+'"></div>'+
    '<div class="nxo-modal-actions"><button id="nxo-schedule-role-save" class="nxo-btn nxo-btn-gold">'+esc(ui('Guardar rol','Save role'))+'</button></div>',
    o=>{o.querySelector('#nxo-schedule-role-save').onclick=async()=>{
      const name=o.querySelector('#nxo-schedule-role-name').value.trim();
      const aliases=o.querySelector('#nxo-schedule-role-aliases').value.split(',').map(x=>x.trim()).filter(Boolean);
      if(!name){toast(ui('Escribe un nombre para el rol.','Enter a role name.'));return}
      try{await api('schedule.roles.save',{workspaceId:workspace.workspace.id,input:{name,aliases}});o.remove();toast(ui('Rol guardado','Role saved'));await loadSchedule()}catch(e){toast(e.message||String(e))}
    }}
  )
}
async function removeScheduleRoleUi(roleId){
  try{await api('schedule.roles.remove',{workspaceId:workspace.workspace.id,roleId});toast(ui('Rol eliminado','Role removed'));await loadSchedule()}catch(e){toast(e.message||String(e))}
}
function renderScheduleData(){
  const zone=document.getElementById('nxo-schedule-zone');if(!zone||!scheduleData)return;
  const d=scheduleData,s=d.schedule,actor=d.actor||{},rows=d.shifts||[],roles=d.roles||[];
  const publishReady=d.publishReady===true&&s&&rows.length>0;
  const rolesReady=roles.length>0;
  const importBox=actor.canImport
    ?'<div class="nxo-panel" style="padding:18px;margin-bottom:16px">'+
      '<div class="nxo-section-head"><div><h3>'+esc(ui('Crear horario desde imagen','Create schedule from image'))+'</h3><p>'+esc(ui('La imagen se reduce si es grande; después OCR lee texto y coordenadas y Nexo compara días, miembros y roles.','Large images are reduced first; then OCR reads text and coordinates and Nexo matches days, members, and roles.'))+'</p></div></div>'+
      (!rolesReady?'<div class="nxo-empty">'+esc(ui('Primero crea al menos un rol del horario.','Create at least one schedule role first.'))+'</div>':'')+
      '<div class="nxo-field"><label>'+esc(ui('Semana del horario','Schedule week'))+'</label><input id="nxo-schedule-import-week" class="nxo-input" type="date" value="'+esc(d.weekStart)+'" '+(scheduleAnalysisBusy?'disabled':'')+'></div>'+
      '<label class="nxo-btn nxo-btn-gold nxo-native-file-picker" style="display:inline-flex;align-items:center;gap:8px;'+((scheduleAnalysisBusy||!rolesReady)?'opacity:.55;pointer-events:none':'')+'"><span>'+esc(scheduleAnalysisBusy?ui('Leyendo…','Reading…'):ui('Seleccionar imagen','Select image'))+'</span><input id="nxo-schedule-image-input" type="file" accept="image/png,image/jpeg,image/webp" '+((scheduleAnalysisBusy||!rolesReady)?'disabled':'')+'></label>'+
     '</div>'
    :'';
  const controls='<div class="nxo-section-actions">'+
    '<button class="nxo-btn" id="nxo-schedule-prev">‹ '+esc(ui('Semana anterior','Previous week'))+'</button>'+
    '<button class="nxo-btn" id="nxo-schedule-today">'+esc(ui('Esta semana','This week'))+'</button>'+
    '<button class="nxo-btn" id="nxo-schedule-next">'+esc(ui('Semana siguiente','Next week'))+' ›</button>'+
    (actor.canPublish?'<button class="nxo-btn nxo-btn-gold" id="nxo-schedule-publish" '+(publishReady?'':'disabled')+'>'+esc(publishReady?ui('Publicar horario','Publish schedule'):ui('Publicar · bloqueado','Publish · locked'))+'</button>':'')+
  '</div>';
  const table=rows.length?'<div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:10px">'+esc(ui('Día','Day'))+'</th><th style="text-align:left;padding:10px">'+esc(ui('Colaborador','Member'))+'</th><th style="text-align:left;padding:10px">'+esc(ui('Rol','Role'))+'</th><th style="text-align:left;padding:10px">'+esc(ui('Entrada','Start'))+'</th><th style="text-align:left;padding:10px">'+esc(ui('Salida','End'))+'</th></tr></thead><tbody>'+rows.map(r=>'<tr style="border-top:1px solid rgba(127,127,127,.2)"><td style="padding:10px">'+esc(scheduleDay(r.date))+'</td><td style="padding:10px">'+esc(r.memberNameSnapshot||r.memberId)+'</td><td style="padding:10px">'+esc(r.positionLabel||'—')+'</td><td style="padding:10px">'+esc(scheduleTime(r.startAt))+'</td><td style="padding:10px">'+esc(scheduleTime(r.endAt))+'</td></tr>').join('')+'</tbody></table></div>':'<div class="nxo-empty">'+esc(ui('No hay un horario confirmado para esta semana.','There is no confirmed schedule for this week.'))+'</div>';
  zone.innerHTML='<div class="nxo-section-head"><div><h3>'+esc(ui('Horarios','Schedule'))+'</h3><p>'+esc(scheduleDay(d.weekStart))+' — '+esc(scheduleDay(d.weekEnd))+'</p></div><span class="nxo-chip">'+esc(scheduleStatusLabel(s?.status))+'</span></div>'+renderScheduleRoles()+importBox+controls+'<div id="nxo-schedule-import-preview"></div>'+table;
  document.getElementById('nxo-schedule-role-add')?.addEventListener('click',openScheduleRoleModal);
  document.querySelectorAll('[data-schedule-role-remove]').forEach(b=>b.onclick=()=>removeScheduleRoleUi(b.dataset.scheduleRoleRemove));
  document.getElementById('nxo-schedule-prev')?.addEventListener('click',()=>{if(!scheduleAnalysisBusy)scheduleShiftWeek(-7)});
  document.getElementById('nxo-schedule-next')?.addEventListener('click',()=>{if(!scheduleAnalysisBusy)scheduleShiftWeek(7)});
  document.getElementById('nxo-schedule-today')?.addEventListener('click',()=>{if(!scheduleAnalysisBusy){scheduleWeekStart=scheduleMonday();scheduleData=null;scheduleImportData=null;scheduleDebug=null;loadSchedule()}});
  if(publishReady)document.getElementById('nxo-schedule-publish')?.addEventListener('click',publishScheduleUi);
  document.getElementById('nxo-schedule-image-input')?.addEventListener('change',e=>{
    const file=e.target.files?.[0]||null;e.target.value='';
    if(file)processScheduleImage(file)
  });
  if(scheduleImportData?.rows)renderScheduleImportPreview()
}
function scheduleReviewWarningLabel(code){
  const map={
    MEMBER_UNRESOLVED:ui('Colaborador pendiente','Member pending'),
    DATE_UNRESOLVED:ui('Fecha pendiente','Date pending'),
    DATE_INFERRED:ui('Fecha inferida','Date inferred'),
    TIME_UNRESOLVED:ui('Horario pendiente','Hours pending'),
    ROLE_UNRESOLVED:ui('Rol pendiente','Role pending')
  };
  return map[code]||code
}
function scheduleMemberOptions(row,members){
  const selected=row.memberId||row.suggestedMemberId||'';
  return '<option value="">'+esc(ui('Seleccionar colaborador','Select member'))+'</option>'+
    members.map(m=>'<option value="'+esc(m.memberId)+'" '+(m.memberId===selected?'selected':'')+'>'+esc(m.displayName||m.workName||m.memberId)+(m.memberId===row.suggestedMemberId&&!row.memberId?' · '+esc(ui('sugerido','suggested')):'')+'</option>').join('')
}
function scheduleRoleOptions(row,roles){
  const selected=row.positionKey||row.suggestedRoleId||'';
  return '<option value="">'+esc(ui('Sin rol / seleccionar','No role / select'))+'</option>'+
    roles.map(r=>'<option value="'+esc(r.id)+'" '+(r.id===selected?'selected':'')+'>'+esc(r.name)+(r.id===row.suggestedRoleId&&!row.positionKey?' · '+esc(ui('sugerido','suggested')):'')+'</option>').join('')
}
function renderScheduleImportPreview(){
  const zone=document.getElementById('nxo-schedule-import-preview');if(!zone||!scheduleImportData?.rows)return;
  const rows=scheduleImportData.rows||[],members=scheduleImportData.members||[],roles=scheduleImportData.roles||scheduleData?.roles||[],dbg=scheduleImportData.debug||scheduleDebug||{};
  const unresolved=rows.filter(r=>r.mappingStatus!=='MATCHED'||(r.warnings||[]).some(w=>w!=='DATE_INFERRED'));
  const cards=rows.map((r,index)=>{
    const warnings=(r.warnings||[]).map(scheduleReviewWarningLabel);
    const status=String(r.status||'WORK').toUpperCase();
    return '<div class="nxo-panel" data-schedule-review-row="'+esc(r.id)+'" style="padding:14px;margin:10px 0">'+
      '<div class="nxo-section-head" style="margin-bottom:10px"><div><strong>'+esc(ui('Turno ','Shift ')+(index+1))+'</strong><div class="nxo-muted" style="margin-top:4px;word-break:break-word">'+esc(r.rawText||r.rawName||ui('Texto OCR','OCR text'))+'</div></div><span class="nxo-chip">'+esc(r.mappingStatus==='MATCHED'?ui('Listo','Ready'):ui('Revisar','Review'))+'</span></div>'+
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px">'+
        '<div class="nxo-field" style="margin:0"><label>'+esc(ui('Nombre leído','Read name'))+'</label><input class="nxo-input" data-schedule-field="rawName" value="'+esc(r.rawName||'')+'" placeholder="'+esc(ui('Nombre en la imagen','Name in image'))+'"></div>'+
        '<div class="nxo-field" style="margin:0"><label>'+esc(ui('Colaborador','Member'))+'</label><select class="nxo-select" data-schedule-field="memberId">'+scheduleMemberOptions(r,members)+'</select></div>'+
        '<div class="nxo-field" style="margin:0"><label>'+esc(ui('Fecha','Date'))+'</label><input class="nxo-input" type="date" data-schedule-field="date" value="'+esc(r.date||'')+'"></div>'+
        '<div class="nxo-field" style="margin:0"><label>'+esc(ui('Estado','Status'))+'</label><select class="nxo-select" data-schedule-field="status"><option value="WORK" '+(status==='WORK'?'selected':'')+'>'+esc(ui('Trabaja','Work'))+'</option><option value="OFF" '+(status==='OFF'?'selected':'')+'>'+esc(ui('Libre','Off'))+'</option><option value="ON_CALL" '+(status==='ON_CALL'?'selected':'')+'>'+esc(ui('Guardia','On call'))+'</option></select></div>'+
        '<div class="nxo-field" style="margin:0"><label>'+esc(ui('Entrada','Start'))+'</label><input class="nxo-input" type="time" data-schedule-field="start" value="'+esc(r.start||'')+'"></div>'+
        '<div class="nxo-field" style="margin:0"><label>'+esc(ui('Salida','End'))+'</label><input class="nxo-input" type="time" data-schedule-field="end" value="'+esc(r.end||'')+'"></div>'+
        '<div class="nxo-field" style="margin:0"><label>'+esc(ui('Rol','Role'))+'</label><select class="nxo-select" data-schedule-field="roleId">'+scheduleRoleOptions(r,roles)+'</select></div>'+
      '</div>'+
      (warnings.length?'<div class="nxo-muted" style="margin-top:10px">'+esc(warnings.join(' · '))+'</div>':'')+
      '<div class="nxo-modal-actions" style="margin-top:10px"><button class="nxo-btn" data-schedule-row-save="'+esc(r.id)+'">'+esc(ui('Guardar corrección','Save correction'))+'</button></div>'+
    '</div>'
  }).join('');
  const canConfirm=dbg.readyForConfirmation===true&&unresolved.length===0&&rows.length>0;
  zone.innerHTML='<div class="nxo-panel" style="padding:18px;margin-top:16px"><div class="nxo-section-head"><div><h3>'+esc(ui('Revisión del horario','Schedule review'))+'</h3><p>'+esc(ui('Nada se descarta: corrige cualquier fila dudosa y guarda los cambios.','Nothing is discarded: correct any uncertain row and save the changes.'))+'</p></div><span class="nxo-chip">'+rows.length+' '+esc(ui('turnos detectados','detected shifts'))+'</span></div>'+
    (rows.length?cards:'<div class="nxo-empty">'+esc(ui('OCR leyó texto, pero todavía no encontró un patrón de horario.','OCR read text, but no schedule pattern was found yet.'))+'</div>')+
    '<div class="nxo-modal-actions"><button id="nxo-schedule-import-confirm" class="nxo-btn nxo-btn-gold" '+(canConfirm?'':'disabled')+'>'+esc(canConfirm?ui('Confirmar y generar horario','Confirm and generate schedule'):ui('Corrige las filas pendientes','Fix pending rows'))+'</button></div></div>';
  zone.querySelectorAll('[data-schedule-row-save]').forEach(btn=>btn.onclick=()=>saveScheduleImportRowUi(btn.dataset.scheduleRowSave));
  if(canConfirm)document.getElementById('nxo-schedule-import-confirm')?.addEventListener('click',confirmScheduleImportUi)
}
async function saveScheduleImportRowUi(rowId){
  const card=document.querySelector('[data-schedule-review-row="'+CSS.escape(rowId)+'"]');if(!card||!scheduleImportData?.importId)return;
  const get=name=>card.querySelector('[data-schedule-field="'+name+'"]')?.value||'';
  const button=card.querySelector('[data-schedule-row-save]');
  if(button){button.disabled=true;button.textContent=ui('Guardando…','Saving…')}
  try{
    await api('schedule.import.row.update',{
      workspaceId:workspace.workspace.id,
      importId:scheduleImportData.importId,
      rowId,
      input:{
        rawName:get('rawName'),
        memberId:get('memberId'),
        date:get('date'),
        status:get('status'),
        start:get('start'),
        end:get('end'),
        roleId:get('roleId')
      }
    });
    const refreshed=await api('schedule.import.get',{workspaceId:workspace.workspace.id,importId:scheduleImportData.importId});
    refreshed.weekStart=scheduleImportData.weekStart||scheduleWeekStart;
    scheduleImportData=refreshed;
    scheduleDebug={...(scheduleDebug||{}),...(refreshed.debug||{}),mapped:true,stage:'done'};
    renderScheduleData();
    renderScheduleDebugPanel();
    toast(ui('Corrección guardada','Correction saved'))
  }catch(e){
    if(button){button.disabled=false;button.textContent=ui('Guardar corrección','Save correction')}
    toast(e.message||String(e))
  }
}
async function processScheduleImage(file){
  const mime=String(file.type||'').toLowerCase();
  if(!['image/png','image/jpeg','image/webp'].includes(mime)){toast(ui('Usa una imagen PNG, JPG o WEBP','Use a PNG, JPG or WEBP image'));return}
  if(!file.size||file.size>20*1024*1024){toast(ui('La imagen debe pesar menos de 20 MB.','The image must be under 20 MB.'));return}
  const week=document.getElementById('nxo-schedule-import-week')?.value||scheduleWeekStart||scheduleMonday();
  scheduleAnalysisBusy=true;scheduleImportData=null;
  scheduleDebug={stage:'optimize',originalBytes:file.size,optimized:false,ocrReady:false,ocrCompleted:false,mapped:false,error:''};
  renderScheduleData();openScheduleDebugModal();
  try{
    const optimized=await optimizeScheduleImage(file);
    scheduleDebug={...scheduleDebug,stage:'ocr-load',optimized:true,processedBytes:optimized.blob.size,originalWidth:optimized.originalWidth,originalHeight:optimized.originalHeight,processedWidth:optimized.width,processedHeight:optimized.height};
    renderScheduleDebugPanel();

    await loadScheduleOcrLibrary();
    scheduleDebug={...scheduleDebug,stage:'ocr',ocrReady:true};
    renderScheduleDebugPanel();

    const enhanced=await prepareScheduleOcrVariant(optimized.blob,'enhanced');
    let words=await runScheduleOcr(enhanced.blob,'1/2');
    words=words.filter(w=>String(w.text||'').trim()&&Number(w.confidence||0)>=12).slice(0,5000);
    let signals=scheduleOcrSignals(words);
    let ocrWidth=enhanced.width,ocrHeight=enhanced.height;
    let usedSecondPass=false;

    if(signals.memberHits===0&&signals.roleHits===0&&signals.timeHits<3){
      scheduleDebug={...scheduleDebug,stage:'ocr',ocrProgress:0,ocrPass:'2/2'};
      renderScheduleDebugPanel();
      const threshold=await prepareScheduleOcrVariant(optimized.blob,'threshold');
      let second=await runScheduleOcr(threshold.blob,'2/2');
      second=second.filter(w=>String(w.text||'').trim()&&Number(w.confidence||0)>=8).slice(0,5000);
      words=mergeScheduleOcrWords(words,second).slice(0,7000);
      signals=scheduleOcrSignals(words);
      ocrWidth=threshold.width;ocrHeight=threshold.height;usedSecondPass=true
    }

    if(!words.length)throw new Error(ui('OCR no encontró texto legible en la imagen.','OCR found no readable text in the image.'));
    scheduleDebug={...scheduleDebug,stage:'map',ocrCompleted:true,ocrProgress:1,ocrPass:usedSecondPass?'2/2':'1/2',wordsDetected:words.length,ocrMemberHits:signals.memberHits,ocrRoleHits:signals.roleHits,ocrTimeHits:signals.timeHits};
    renderScheduleDebugPanel();

    const parsed=await api('schedule.ocr.parse',{workspaceId:workspace.workspace.id,input:{
      weekStart:week,
      fileName:file.name||'schedule-image',
      mimeType:'image/png',
      imageWidth:ocrWidth,
      imageHeight:ocrHeight,
      originalBytes:file.size,
      processedBytes:optimized.blob.size,
      words
    }});
    scheduleImportData=parsed;
    scheduleDebug={...scheduleDebug,...(parsed.debug||{}),stage:'done',mapped:true,error:''};
    scheduleAnalysisBusy=false;
    renderScheduleData();renderScheduleDebugPanel();
    if(scheduleDebug.readyForConfirmation){setTimeout(closeScheduleDebugModal,900);toast(ui('Horario mapeado. Revisa el resultado.','Schedule mapped. Review the result.'))}
    else{setScheduleDebugClosable(true);toast(ui('El OCR terminó con datos pendientes de revisar.','OCR finished with data that needs review.'))}
  }catch(e){
    scheduleAnalysisBusy=false;
    scheduleDebug={...(scheduleDebug||{}),error:e.message||String(e)};
    renderScheduleData();renderScheduleDebugPanel();setScheduleDebugClosable(true);
    toast(e.message||String(e))
  }
}
async function confirmScheduleImportUi(){
  if(!scheduleImportData?.importId)return;
  const button=document.getElementById('nxo-schedule-import-confirm');if(button)button.disabled=true;
  try{
    await api('schedule.import.confirm',{workspaceId:workspace.workspace.id,importId:scheduleImportData.importId,input:{weekStart:scheduleImportData.weekStart||scheduleWeekStart}});
    scheduleImportData=null;scheduleDebug=null;
    toast(ui('Horario generado. Ya puedes publicarlo.','Schedule generated. You can now publish it.'));
    await loadSchedule()
  }catch(e){if(button)button.disabled=false;toast(e.message||String(e))}
}
async function loadSchedule(){
  const zone=document.getElementById('nxo-schedule-zone');if(!zone||!workspace?.workspace?.id)return;
  if(!scheduleWeekStart)scheduleWeekStart=scheduleMonday();
  try{
    scheduleData=await api('schedule.bootstrap',{workspaceId:workspace.workspace.id,weekStart:scheduleWeekStart});
    renderScheduleData()
  }catch(e){zone.innerHTML='<div class="nxo-empty">'+esc(e.message||String(e))+'</div>'}
}
async function publishScheduleUi(){
  try{
    await api('schedule.publish',{workspaceId:workspace.workspace.id,scheduleId:scheduleData.schedule.id});
    toast(ui('Horario publicado','Schedule published'));await loadSchedule()
  }catch(e){toast(e.message||String(e))}
}
function renderRecipeCommentNoticesShell(){return '<section class="nxo-section" style="margin-top:0"><div id="nxo-recipe-comment-notifications"><div class="nxo-section-head"><div><h3>Notificaciones</h3><p>Recomendaciones nuevas del equipo sobre las fichas técnicas.</p></div></div><div class="nxo-empty">Cargando avisos…</div></div></section>'}
function renderPendingNotesShell(){return '<section class="nxo-section"><div id="nxo-pending-notes"><div class="nxo-section-head"><div><h3>Pendientes</h3><p>Notas persistentes guardadas para revisar después.</p></div></div><div class="nxo-empty">Cargando pendientes…</div></div></section>'}
function nxoWhen(value){try{return value?new Date(value).toLocaleString('es-US',{dateStyle:'medium',timeStyle:'short'}):''}catch(_){return''}}
function stopWorkspaceNotificationPolling(){
  if(workspaceNotificationPollTimer){clearInterval(workspaceNotificationPollTimer);workspaceNotificationPollTimer=null}
  workspaceNotificationPollWorkspaceId='';
  workspaceNotificationPollInFlight=false
}
function startWorkspaceNotificationPolling(){
  stopWorkspaceNotificationPolling();
  const wsid=workspace?.workspace?.id||'';
  if(!wsid||!document.getElementById('nxo-notification-button'))return;
  workspaceNotificationPollWorkspaceId=wsid;
  const tick=async()=>{
    if(document.hidden||workspaceNotificationPollInFlight)return;
    if(!workspace?.workspace?.id||workspace.workspace.id!==workspaceNotificationPollWorkspaceId){stopWorkspaceNotificationPolling();return}
    workspaceNotificationPollInFlight=true;
    try{await loadWorkspaceRecipeComments(true)}catch(_){}
    finally{workspaceNotificationPollInFlight=false}
  };
  workspaceNotificationPollTimer=setInterval(tick,6500);
  if(!workspaceNotificationVisibilityBound){
    workspaceNotificationVisibilityBound=true;
    const refreshVisible=()=>{
      if(document.hidden||!workspaceNotificationPollWorkspaceId||!workspace?.workspace?.id)return;
      if(workspace.workspace.id!==workspaceNotificationPollWorkspaceId)return;
      loadWorkspaceRecipeComments(true).catch(()=>null)
    };
    document.addEventListener('visibilitychange',refreshVisible);
    window.addEventListener('focus',refreshVisible)
  }
}
async function refreshWorkspaceAdminPanels(){await Promise.allSettled([loadWorkspaceRecipeComments(),loadWorkspacePendingNotes()])}
async function loadWorkspaceRecipeComments(silent=false){
  const zone=document.getElementById('nxo-recipe-comment-notifications');
  const badge=document.getElementById('nxo-notification-badge');
  if(!zone||!workspace?.workspace?.id)return;
  try{
    const next=await api('workspace.recipe-comments',{workspaceId:workspace.workspace.id});
    const rows=Array.isArray(next?.comments)?next.comments:[];
    const visible=rows.slice(0,12);
    const unreadCount=rows.reduce((total,row)=>total+(row?.unread?1:0),0);
    const bell=document.getElementById('nxo-notification-button');
    const signature=rows.map(r=>[r?.id||'',r?.status||'',r?.unread?1:0,r?.changeJobId||'',r?.commentedAt||'',r?.comment||''].join('~')).join('|');
    workspaceRecipeComments=next;
    if(badge){badge.textContent=String(unreadCount);badge.hidden=unreadCount===0}
    if(bell){
      bell.classList.toggle('nxo-has-unread',unreadCount>0);
      bell.setAttribute('aria-label',unreadCount>0?ui('Notificaciones · '+unreadCount+' nueva'+(unreadCount===1?'':'s'),'Notifications · '+unreadCount+' new'):ui('Notificaciones','Notifications'))
    }
    if(silent&&signature===workspaceNotificationSignature)return;
    workspaceNotificationSignature=signature;
    zone.innerHTML=
      '<div class="nxo-notification-head"><div><strong>'+esc(ui('Notificaciones','Notifications'))+'</strong><small>'+esc(ui('Recomendaciones pendientes','Pending recommendations'))+'</small></div><span class="nxo-notification-count">'+rows.length+'</span></div>'+
      (visible.length?'<div class="nxo-notification-list">'+visible.map(r=>{
        const when=nxoWhen(r.commentedAt),working=r.status==='applying',failed=r.status==='change_failed';
        return '<article class="nxo-notification-item '+(r.unread?'nxo-notification-unread':'')+'" data-notification-id="'+esc(r.id)+'">'+
          '<div class="nxo-avatar">'+esc(initials(r.authorName))+'</div>'+
          '<div class="nxo-notification-copy"><strong>'+esc(r.recipeTitle||ui('Ficha técnica','Technical sheet'))+'</strong><span>'+esc(r.authorName||ui('Miembro Nexo','Nexo member'))+'</span><p>'+esc(r.comment||'')+'</p>'+(when?'<small>'+esc(when)+'</small>':'')+(failed?'<em>'+esc(ui('La actualización anterior no se completó.','The previous update did not complete.'))+'</em>':'')+'</div>'+
          '<div class="nxo-notification-action">'+(working&&r.changeJobId?'<button class="nxo-btn" data-job-watch="'+esc(r.changeJobId)+'">'+esc(ui('Progreso','Progress'))+'</button>':'<button class="nxo-btn nxo-btn-gold" data-comment-review="'+esc(r.id)+'">'+esc(ui('Abrir','Open'))+'</button>')+'</div>'+
        '</article>'
      }).join('')+'</div>':'<div class="nxo-notification-empty">'+esc(ui('No hay recomendaciones nuevas por revisar.','There are no new recommendations to review.'))+'</div>');
    zone.querySelectorAll('[data-comment-review]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.commentReview;
      document.getElementById('nxo-notification-menu')?.classList.remove('open');
      const row=(workspaceRecipeComments?.comments||[]).find(x=>x.id===id);
      if(row?.unread){
        row.unread=false;
        zone.querySelector('[data-notification-id="'+CSS.escape(id)+'"]')?.classList.remove('nxo-notification-unread');
        const remainingUnread=(workspaceRecipeComments?.comments||[]).filter(x=>x?.unread).length;
        const badgeNow=document.getElementById('nxo-notification-badge');
        const bellNow=document.getElementById('nxo-notification-button');
        if(badgeNow){badgeNow.textContent=String(remainingUnread);badgeNow.hidden=remainingUnread===0}
        bellNow?.classList.toggle('nxo-has-unread',remainingUnread>0);
        workspaceNotificationSignature='';
        api('comment.seen',{commentId:id}).catch(()=>{row.unread=true;loadWorkspaceRecipeComments()})
      }
      openRecipeRecommendation(id)
    });
    zone.querySelectorAll('[data-job-watch]').forEach(b=>b.onclick=()=>{document.getElementById('nxo-notification-menu')?.classList.remove('open');watchRecipeChange(b.dataset.jobWatch)})
  }catch(e){
    if(!silent){
      if(badge)badge.hidden=true;
      zone.innerHTML='<div class="nxo-notification-head"><strong>'+esc(ui('Notificaciones','Notifications'))+'</strong></div><div class="nxo-notification-empty">'+esc(e.message||e)+'</div>'
    }
  }
}
async function loadWorkspacePendingNotes(){
  const zone=document.getElementById('nxo-pending-notes');
  if(!zone||!workspace?.workspace?.id)return;
  try{
    workspacePendingNotes=await api('workspace.pending-notes',{workspaceId:workspace.workspace.id});
    const rows=Array.isArray(workspacePendingNotes?.notes)?workspacePendingNotes.notes:[];
    const validStyles=new Set(['yellow','peach','blue','mint']);
    const noteItems=rows.map(r=>{
      const style=validStyles.has(String(r.styleKey||''))?String(r.styleKey):'yellow';
      return '<button type="button" class="nxo-pinned-note style-'+esc(style)+'" data-pending-note="'+esc(r.id)+'">'+
        '<span class="nxo-note-pin" aria-hidden="true"></span>'+
        '<span class="nxo-note-label">PENDIENTE</span>'+
        '<strong>'+esc(r.title||'Pendiente')+'</strong>'+
      '</button>'
    }).join('');
    zone.innerHTML=
      '<div class="nxo-section-head">'+
        '<div><div class="nxo-pending-title-row"><h3>'+esc(ui('Pendientes','Pending'))+'</h3><span class="nxo-chip nxo-pending-count">'+rows.length+'</span></div><p>'+esc(ui('Notas que permanecen en el espacio de trabajo hasta resolverlas.','Notes that remain in the Workspace until they are resolved.'))+'</p></div>'+
      '</div>'+
      '<div class="nxo-note-board nxo-pending-flow" data-pending-count="'+rows.length+'">'+
        noteItems+
        '<div class="nxo-pending-add-slot"><button type="button" class="nxo-pending-add" id="nxo-pending-add" aria-label="Crear pendiente" title="Crear pendiente">+</button></div>'+
      '</div>';
    zone.querySelectorAll('[data-pending-note]').forEach(b=>b.onclick=()=>openPendingNote(b.dataset.pendingNote));
    document.getElementById('nxo-pending-add')?.addEventListener('click',openManualPendingModal)
  }catch(e){
    zone.innerHTML='<div class="nxo-section-head"><div><h3>Pendientes</h3></div></div><div class="nxo-empty">'+esc(e.message||e)+'</div>'
  }
}
function openManualPendingModal(){if(!workspace?.workspace?.id)return;modal('Crear pendiente','<div class="nxo-field"><label>Título</label><input id="nxo-manual-pending-title" class="nxo-input" maxlength="120" placeholder="¿Qué queda pendiente?"></div><div class="nxo-field"><label>Nota</label><textarea id="nxo-manual-pending-body" class="nxo-textarea" maxlength="4000" placeholder="Añade los detalles necesarios para retomarlo después."></textarea></div><div class="nxo-modal-actions"><button id="nxo-manual-pending-save" class="nxo-btn nxo-btn-gold">Crear pendiente</button></div>',o=>{const title=o.querySelector('#nxo-manual-pending-title'),body=o.querySelector('#nxo-manual-pending-body'),save=o.querySelector('#nxo-manual-pending-save');title?.focus();save?.addEventListener('click',async()=>{const value=title?.value.trim()||'',note=body?.value.trim()||'';if(!value){toast('Escribe un título');title?.focus();return}save.disabled=true;save.textContent='Guardando…';try{await api('workspace.pending-note.create',{workspaceId:workspace.workspace.id,input:{title:value,body:note,sourceType:'manual'}});o.remove();toast('Pendiente creado');await loadWorkspacePendingNotes()}catch(e){save.disabled=false;save.textContent='Crear pendiente';toast(e.message||String(e))}})})}
function openRecipeRecommendation(id){const r=(workspaceRecipeComments?.comments||[]).find(x=>x.id===id);if(!r)return;modal('Recomendación · '+(r.recipeTitle||'Ficha técnica'),'<div class="nxo-review-card"><div class="nxo-eyebrow">Enviada por '+esc(r.authorName||'Miembro Nexo')+'</div><p>'+esc(r.comment||'')+'</p><small>'+esc(nxoWhen(r.commentedAt))+'</small></div><p class="nxo-muted" style="line-height:1.55">Decide si la recomendación se rechaza o se acepta para darle seguimiento.</p><div class="nxo-modal-actions"><button id="nxo-review-reject" class="nxo-btn nxo-btn-danger">Rechazar</button><button id="nxo-review-accept" class="nxo-btn nxo-btn-gold">Aceptar</button></div>',o=>{o.querySelector('#nxo-review-reject').onclick=async()=>{if(!confirm('¿Rechazar esta recomendación? Se retirará de la bandeja.'))return;try{await api('comment.reject',{commentId:r.id});o.remove();toast('Recomendación rechazada');await refreshWorkspaceAdminPanels()}catch(e){toast(e.message||String(e))}};o.querySelector('#nxo-review-accept').onclick=()=>{o.remove();acceptedRecommendationOptions(r)}})}
function acceptedRecommendationOptions(r){modal('Recomendación aceptada','<p style="line-height:1.55">¿Qué deseas hacer con esta recomendación?</p><div class="nxo-choice-grid"><button id="nxo-apply-now" class="nxo-choice"><strong>Realizar el ajuste ahora</strong><span>La IA revisará la ficha actual y aplicará únicamente el cambio aprobado.</span></button><button id="nxo-keep-pending" class="nxo-choice"><strong>Mantener pendiente</strong><span>Guárdala como una nota con pin en el Workspace para retomarla después.</span></button></div>',o=>{o.querySelector('#nxo-apply-now').onclick=()=>{o.remove();startRecipeChange({commentId:r.id})};o.querySelector('#nxo-keep-pending').onclick=()=>{o.remove();pendingTitleModal(r)}})}
function pendingTitleModal(r){const suggested=('Revisar '+(r.recipeTitle||'receta')).slice(0,120);modal('Guardar como pendiente','<div class="nxo-field"><label>Título de la nota</label><input id="nxo-pending-title" class="nxo-input" maxlength="120" value="'+esc(suggested)+'"></div><p class="nxo-muted" style="line-height:1.55">La nota permanecerá visible como una hoja fijada en el Workspace hasta que un administrador la resuelva.</p><div class="nxo-modal-actions"><button id="nxo-pending-save" class="nxo-btn nxo-btn-gold">Crear pendiente</button></div>',o=>{const input=o.querySelector('#nxo-pending-title');input?.focus();input?.select();o.querySelector('#nxo-pending-save').onclick=async()=>{const title=input.value.trim();if(!title){toast('Escribe un título');return}try{await api('comment.defer',{commentId:r.id,title});o.remove();toast('Pendiente guardado');await refreshWorkspaceAdminPanels()}catch(e){toast(e.message||String(e))}}})}
function openPendingNote(id){const r=(workspacePendingNotes?.notes||[]).find(x=>x.id===id);if(!r)return;const recipe=r.recipeTitle?'<div class="nxo-chip" style="margin-bottom:10px">'+esc(r.recipeTitle)+'</div>':'';const recipeActions=r.sourceType==='recipe-recommendation'?'<button id="nxo-note-reject" class="nxo-btn nxo-btn-danger">Rechazar recomendación</button><button id="nxo-note-apply" class="nxo-btn nxo-btn-gold">Realizar ajuste ahora</button>':'<button id="nxo-note-resolve" class="nxo-btn nxo-btn-gold">Marcar resuelto</button>';modal(r.title||'Pendiente',recipe+'<p style="white-space:pre-wrap;line-height:1.6">'+esc(r.body||'')+'</p><small class="nxo-muted">'+esc(nxoWhen(r.createdAt))+'</small><div class="nxo-modal-actions">'+recipeActions+'</div>',o=>{o.querySelector('#nxo-note-apply')?.addEventListener('click',()=>{o.remove();startRecipeChange({pendingNoteId:r.id})});o.querySelector('#nxo-note-reject')?.addEventListener('click',async()=>{if(!confirm('¿Rechazar esta recomendación y retirar el pendiente?'))return;try{if(r.sourceId)await api('comment.reject',{commentId:r.sourceId});await api('workspace.pending-note.resolve',{noteId:r.id});o.remove();toast('Pendiente retirado');await refreshWorkspaceAdminPanels()}catch(e){toast(e.message||String(e))}});o.querySelector('#nxo-note-resolve')?.addEventListener('click',async()=>{try{await api('workspace.pending-note.resolve',{noteId:r.id});o.remove();toast('Pendiente resuelto');await loadWorkspacePendingNotes()}catch(e){toast(e.message||String(e))}})})}
function progressModal(title){return modal('Realizando cambios · '+title,'<div class="nxo-progress-wrap"><div class="nxo-progress-head"><strong id="nxo-change-stage">Preparando…</strong><strong id="nxo-change-percent">0%</strong></div><div class="nxo-progress-track"><span id="nxo-change-bar"></span></div><p id="nxo-change-detail" class="nxo-muted">La actualización se está procesando.</p><div id="nxo-change-result"></div></div>')}
function updateProgressModal(o,job){if(!o||!document.body.contains(o))return;const pct=Math.max(0,Math.min(100,Number(job?.progress||0)));const bar=o.querySelector('#nxo-change-bar'),percent=o.querySelector('#nxo-change-percent'),stage=o.querySelector('#nxo-change-stage'),detail=o.querySelector('#nxo-change-detail');if(bar)bar.style.width=pct+'%';if(percent)percent.textContent=Math.round(pct)+'%';if(stage)stage.textContent=job?.stage||'Procesando';if(detail)detail.textContent=job?.status==='failed'?(job?.error||'No se pudo completar el cambio.'):(job?.status==='completed'?'La receta ya fue actualizada.':'No cierres esta ventana si deseas ver el avance en tiempo real.')}
async function startRecipeChange(input){let job;try{job=await api('recipe-change.start',{input});}catch(e){toast(e.message||String(e));return}const o=progressModal(job.recipeTitle||'Ficha técnica');updateProgressModal(o,job);api('recipe-change.process',{jobId:job.id}).catch(()=>null);await pollRecipeChange(o,job.id)}
async function watchRecipeChange(jobId){const o=progressModal('actualización');await pollRecipeChange(o,jobId)}
async function pollRecipeChange(o,jobId){let job=null;for(let i=0;i<180;i++){try{job=await api('recipe-change.status',{jobId});updateProgressModal(o,job)}catch(e){if(document.body.contains(o)){const d=o.querySelector('#nxo-change-detail');if(d)d.textContent=e.message||String(e)}return}if(job?.status==='completed'||job?.status==='failed')break;await new Promise(r=>setTimeout(r,800))}if(!job)return;const result=o.querySelector('#nxo-change-result');if(job.status==='completed'){let summary='Actualización completada.';try{const parsed=JSON.parse(job.resultJson||'{}');if(parsed.summary)summary=parsed.summary}catch(_){}if(result)result.innerHTML='<div class="nxo-change-success"><strong>✓ Actualización hecha</strong><p>'+esc(summary)+'</p><button id="nxo-change-close" class="nxo-btn nxo-btn-gold">Cerrar</button></div>';o.querySelector('#nxo-change-close')?.addEventListener('click',async()=>{o.remove();await refreshWorkspaceAdminPanels()})}else if(job.status==='failed'){if(result)result.innerHTML='<div class="nxo-change-failed"><strong>No se aplicaron todos los cambios.</strong><p>'+esc(job.error||'La IA no pudo completar esta recomendación con seguridad.')+'</p><button id="nxo-change-close" class="nxo-btn">Cerrar</button></div>';o.querySelector('#nxo-change-close')?.addEventListener('click',async()=>{o.remove();await refreshWorkspaceAdminPanels()})}}
function renderWorkspaceTools(tools){return '<section class="nxo-section"><div class="nxo-section-head"><div><h3>'+esc(ui('Herramientas del espacio de trabajo','Workspace tools'))+'</h3><p>'+esc(ui('Estas herramientas trabajan con el contexto y los datos de ','These tools use the context and data from '))+esc(workspace?.workspace?.name||ui('este espacio de trabajo','this Workspace'))+'.</p></div></div>'+(tools.length?'<div class="nxo-grid">'+tools.map(toolCard).join('')+'</div>':'<div class="nxo-empty">'+esc(ui('No hay herramientas habilitadas para este espacio de trabajo.','No tools are enabled for this Workspace.'))+'</div>')+'</section>'}
function renderAccess(role){const perms=role?.permissions||[],roleKey=String(workspace?.membership?.roleKey||'viewer').toLowerCase();return '<div class="nxo-panel" style="padding:18px"><div class="nxo-section-head"><div><h3>'+esc(ui('Tu acceso en este espacio de trabajo','Your access in this Workspace'))+'</h3><p>'+esc(ui('Los permisos se aplican en backend, no solo en la interfaz.','Permissions are enforced in the backend, not only in the interface.'))+'</p></div></div><div class="nxo-role-badge" data-role="'+esc(roleKey)+'">'+esc(roleName(roleKey,role))+'</div><div class="nxo-perms">'+(perms.length?perms.map(p=>'<span class="nxo-perm">'+esc(p)+'</span>').join(''):'<span class="nxo-muted">'+esc(ui('Sin permisos adicionales.','No additional permissions.'))+'</span>')+'</div></div>'}
async function loadMembers(){const zone=document.getElementById('nxo-members-zone');if(!zone)return;try{const wsid=workspace.workspace.id;workspaceMembers=await api('workspace.members',{workspaceId:wsid});const rolePerms=workspace?.role?.permissions||[];const canInvite=rolePerms.includes('members.invite')||rolePerms.includes('members.manage');const canAssign=rolePerms.includes('roles.assign');const canRemove=rolePerms.includes('members.remove')||rolePerms.includes('members.manage');if(canAssign||canInvite){try{workspaceRoles=await api('workspace.roles',{workspaceId:wsid})}catch(_){workspaceRoles=[]}}else workspaceRoles=[];zone.innerHTML='<div class="nxo-section-head"><div><h3>Miembros</h3><p>'+workspaceMembers.members.length+' miembro'+(workspaceMembers.members.length===1?'':'s')+' activo'+(workspaceMembers.members.length===1?'':'s')+'.</p></div>'+(canInvite?'<button id="nxo-invite-member" class="nxo-btn nxo-btn-gold">'+iconLabel('invitaciones',ui('Invitar miembro','Invite member'))+'</button>':'')+'</div><div class="nxo-member-list">'+workspaceMembers.members.map(m=>memberRow(m,canAssign,canRemove)).join('')+'</div>';document.getElementById('nxo-invite-member')?.addEventListener('click',inviteModal);document.querySelectorAll('[data-member-role]').forEach(sel=>sel.onchange=()=>changeRole(sel.dataset.memberRole,sel.value));document.querySelectorAll('[data-member-remove]').forEach(btn=>btn.onclick=()=>removeMember(btn.dataset.memberRemove))}catch(e){zone.innerHTML='<div class="nxo-empty">'+esc(e.message||e)+'</div>'}}
function memberRow(m,canAssign,canRemove){const actorRank=Number(workspaceMembers?.currentRole?.rank||workspace?.role?.rank||0),targetRank=Number(m.role?.rank||0),canAct=!m.isWorkspaceOwner&&targetRank<actorRank;const options=(workspaceRoles||[]).map(r=>'<option value="'+esc(r.roleKey)+'" '+(r.roleKey===m.roleKey?'selected':'')+'>'+esc(r.nameEs||r.roleKey)+'</option>').join('');return '<div class="nxo-member"><div class="nxo-member-left"><div class="nxo-avatar">'+esc(initials(m.displayName))+'</div><div style="min-width:0"><div class="nxo-member-name">'+esc(m.displayName)+'</div><div class="nxo-member-sub">'+esc(roleName(m.roleKey,m.role))+(m.isWorkspaceOwner?ui(' · propietario del espacio de trabajo',' · Workspace owner'):'')+'</div></div></div><div class="nxo-member-actions">'+(canAct&&canAssign&&options?'<select class="nxo-select" style="width:auto;min-width:145px" data-member-role="'+esc(m.memberId)+'">'+options+'</select>':'<span class="nxo-role-badge" data-role="'+esc(String(m.roleKey||'viewer').toLowerCase())+'">'+esc(roleName(m.roleKey,m.role))+'</span>')+(canAct&&canRemove?'<button class="nxo-btn nxo-btn-danger" data-member-remove="'+esc(m.memberId)+'">'+iconLabel('eliminar',ui('Quitar','Remove'))+'</button>':'')+'</div></div>'}
async function copyInviteCode(value){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true}const t=document.createElement('textarea');t.value=value;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.focus();t.select();const ok=document.execCommand('copy');t.remove();return ok}catch(_){return false}}

function workspaceInviteUrl(token){
  const u=new URL(siteBase()+'/blank-8');
  u.searchParams.set('nxoJoin',String(token||''));
  return u.href
}

async function loadWorkspaceQrLibrary(){
  if(window.QRCode)return window.QRCode;
  if(window.__nxoQrLibraryPromise)return window.__nxoQrLibraryPromise;
  window.__nxoQrLibraryPromise=new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-nxo-qr-lib]');
    if(existing){
      existing.addEventListener('load',()=>window.QRCode?resolve(window.QRCode):reject(new Error('No se pudo iniciar el generador QR')),{once:true});
      existing.addEventListener('error',()=>reject(new Error('No se pudo cargar el generador QR')),{once:true});
      return
    }
    const script=document.createElement('script');
    script.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async=true;
    script.dataset.nxoQrLib='1';
    script.onload=()=>window.QRCode?resolve(window.QRCode):reject(new Error('No se pudo iniciar el generador QR'));
    script.onerror=()=>reject(new Error('No se pudo cargar el generador QR'));
    document.head.appendChild(script)
  });
  return window.__nxoQrLibraryPromise
}

async function renderWorkspaceInviteQr(zone,url){
  if(!zone)return false;
  zone.innerHTML='<div class="nxo-qr-loading">Generando QR…</div>';
  try{
    const QR=await loadWorkspaceQrLibrary();
    zone.innerHTML='';
    new QR(zone,{
      text:url,
      width:264,
      height:264,
      colorDark:'#111827',
      colorLight:'#ffffff',
      correctLevel:QR.CorrectLevel.M
    });
    return true
  }catch(e){
    zone.innerHTML='<div class="nxo-qr-error">No se pudo dibujar el QR. El enlace sigue disponible para copiar o compartir.</div>';
    return false
  }
}

async function shareWorkspaceInvite(invite,url){
  const title=ui('Únete a ','Join ')+(invite.workspaceName||ui('mi espacio de trabajo','my Workspace'));
  const text=ui('Únete al espacio de trabajo ','Join the Workspace ')+(invite.workspaceName||ui('de Nexo','Nexo'))+ui(' desde este enlace.',' from this link.');
  try{
    if(navigator.share){
      await navigator.share({title,text,url});
      return
    }
  }catch(e){
    if(e?.name==='AbortError')return
  }
  const ok=await copyInviteCode(url);
  toast(ok?'Enlace copiado para compartir':'No se pudo abrir el menú de compartir')
}

function safeInviteFileName(value){
  return String(value||'workspace')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/gi,'-')
    .replace(/^-+|-+$/g,'')
    .toLowerCase()
    .slice(0,60)||'workspace'
}

async function loadInviteCanvasImage(url){
  if(!url)return null;
  try{
    const response=await fetch(url,{mode:'cors'});
    if(!response.ok)return null;
    const blob=await response.blob();
    if('createImageBitmap' in window)return await createImageBitmap(blob);
    return await new Promise((resolve,reject)=>{
      const img=new Image();
      const objectUrl=URL.createObjectURL(blob);
      img.onload=()=>{URL.revokeObjectURL(objectUrl);resolve(img)};
      img.onerror=()=>{URL.revokeObjectURL(objectUrl);reject(new Error('IMAGE_LOAD_FAILED'))};
      img.src=objectUrl
    })
  }catch(_){return null}
}

function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight,maxLines=3){
  const words=String(text||'').split(/\s+/);
  let line='',lineCount=0;
  for(let i=0;i<words.length;i++){
    const test=line?line+' '+words[i]:words[i];
    if(ctx.measureText(test).width>maxWidth&&line){
      ctx.fillText(line,x,y+lineCount*lineHeight);
      lineCount++;
      if(lineCount>=maxLines)return y+lineCount*lineHeight;
      line=words[i]
    }else line=test
  }
  if(line&&lineCount<maxLines){
    ctx.fillText(line,x,y+lineCount*lineHeight);
    lineCount++
  }
  return y+lineCount*lineHeight
}

async function downloadWorkspaceInviteImage(invite,url,qrZone){
  const qrCanvas=qrZone?.querySelector('canvas');
  if(!qrCanvas){toast('Espera a que termine de generarse el QR');return}
  const canvas=document.createElement('canvas');
  canvas.width=1200;
  canvas.height=1500;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#f7f9fc';
  ctx.fillRect(0,0,1200,1500);
  ctx.fillStyle='#2f4f93';
  ctx.fillRect(0,0,1200,270);

  const logoUrl=mediaUrl(invite.workspaceLogoImage||workspace?.workspace?.logoImage);
  const logo=await loadInviteCanvasImage(logoUrl);
  if(logo){
    ctx.save();
    ctx.beginPath();
    ctx.arc(600,150,82,0,Math.PI*2);
    ctx.clip();
    ctx.fillStyle='#ffffff';
    ctx.fillRect(518,68,164,164);
    const w=logo.width||logo.naturalWidth||164,h=logo.height||logo.naturalHeight||164;
    const scale=Math.max(164/w,164/h);
    ctx.drawImage(logo,600-w*scale/2,150-h*scale/2,w*scale,h*scale);
    ctx.restore()
  }else{
    ctx.fillStyle='#ffffff';
    ctx.font='900 42px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.fillText('NEXO',600,165)
  }

  ctx.textAlign='center';
  ctx.fillStyle='#111827';
  ctx.font='900 48px Arial, sans-serif';
  wrapCanvasText(ctx,invite.workspaceName||ui('Espacio de trabajo Nexo','Nexo Workspace'),600,360,980,58,2);
  ctx.fillStyle='#5b6780';
  ctx.font='700 30px Arial, sans-serif';
  ctx.fillText(ui('Escanea para unirte al espacio de trabajo','Scan to join the Workspace'),600,480);

  ctx.fillStyle='#ffffff';
  ctx.strokeStyle='#d4deef';
  ctx.lineWidth=4;
  ctx.beginPath();
  ctx.roundRect(150,540,900,900,34);
  ctx.fill();
  ctx.stroke();

  ctx.drawImage(qrCanvas,250,620,700,700);

  ctx.fillStyle='#34405f';
  ctx.font='700 23px Arial, sans-serif';
  ctx.fillText('Inicia sesión o crea tu cuenta y entrarás automáticamente.',600,1365);
  ctx.fillStyle='#66738d';
  ctx.font='600 20px Arial, sans-serif';
  ctx.fillText(ui('Nexo Group · Invitación de espacio de trabajo','Nexo Group · Workspace invitation'),600,1415);

  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png',.95));
  if(!blob){toast('No se pudo crear la imagen');return}
  const a=document.createElement('a');
  const href=URL.createObjectURL(blob);
  a.href=href;
  a.download='invitacion-'+safeInviteFileName(invite.workspaceName)+'.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(href),1500)
}

function inviteModal(){
  const roles=workspaceRoles||[];
  const defaultRole=roles.find(r=>r.roleKey==='collaborator')?.roleKey||roles[0]?.roleKey||'collaborator';
  const opts=roles.map(r=>'<option value="'+esc(r.roleKey)+'" '+(r.roleKey===defaultRole?'selected':'')+'>'+esc(r.nameEs||r.roleKey)+'</option>').join('');

  modal(ui('Invitar al espacio de trabajo','Invite to Workspace'),
    '<div class="nxo-invite-share">'+
      '<div class="nxo-invite-share-head">'+
        '<div class="nxo-invite-share-logo" id="nxo-invite-share-logo"></div>'+
        '<div><strong>'+esc(workspace?.workspace?.name||ui('Espacio de trabajo','Workspace'))+'</strong><span>'+esc(ui('Invitación por QR y enlace','Invitation by QR and link'))+'</span></div>'+
      '</div>'+
      '<div class="nxo-field"><label>Rol que recibirán quienes entren con este QR</label><select id="nxo-invite-role" class="nxo-select">'+opts+'</select></div>'+
      '<div class="nxo-invite-qr-card">'+
        '<div id="nxo-invite-qr" class="nxo-invite-qr"><div class="nxo-qr-loading">Preparando invitación…</div></div>'+
        '<p>'+esc(ui('Escanea este QR para iniciar sesión o crear una cuenta y entrar automáticamente al espacio de trabajo.','Scan this QR to sign in or create an account and automatically enter the Workspace.'))+'</p>'+
      '</div>'+
      '<div class="nxo-invite-link-row"><input id="nxo-invite-link" class="nxo-input" readonly value=""><button id="nxo-copy-invite-link" class="nxo-btn">Copiar</button></div>'+
      '<div class="nxo-invite-share-actions">'+
        '<button id="nxo-share-invite" class="nxo-btn nxo-btn-gold">Compartir</button>'+
        '<button id="nxo-download-invite" class="nxo-btn">Descargar imagen</button>'+
        '<button id="nxo-regenerate-invite" class="nxo-btn nxo-btn-danger">Regenerar QR</button>'+
      '</div>'+
      '<details class="nxo-invite-manual"><summary>Usar código de un solo uso</summary>'+
        '<p>Respaldo para alguien que no pueda abrir el QR o el enlace.</p>'+
        '<div id="nxo-invite-manual-result"></div>'+
        '<button id="nxo-invite-generate-code" class="nxo-btn">Generar código temporal</button>'+
      '</details>'+
    '</div>',
    async o=>{
      const roleSelect=o.querySelector('#nxo-invite-role');
      const qrZone=o.querySelector('#nxo-invite-qr');
      const linkInput=o.querySelector('#nxo-invite-link');
      const logoZone=o.querySelector('#nxo-invite-share-logo');
      const shareButton=o.querySelector('#nxo-share-invite');
      const copyButton=o.querySelector('#nxo-copy-invite-link');
      const downloadButton=o.querySelector('#nxo-download-invite');
      const regenerateButton=o.querySelector('#nxo-regenerate-invite');
      const manualButton=o.querySelector('#nxo-invite-generate-code');
      const manualZone=o.querySelector('#nxo-invite-manual-result');
      let invite=null,url='';

      const paint=async nextInvite=>{
        invite=nextInvite;
        url=workspaceInviteUrl(invite.token);
        linkInput.value=url;
        const logo=mediaUrl(invite.workspaceLogoImage||workspace?.workspace?.logoImage);
        logoZone.innerHTML=logo?'<img src="'+esc(logo)+'" alt="'+esc((invite.workspaceName||ui('Espacio de trabajo','Workspace'))+' logo')+'">':'<span>⌂</span>';
        await renderWorkspaceInviteQr(qrZone,url)
      };

      try{
        invite=await api('workspace.invite.link',{
          workspaceId:workspace.workspace.id,
          input:{roleKey:roleSelect.value||defaultRole}
        });
        await paint(invite)
      }catch(e){
        qrZone.innerHTML='<div class="nxo-qr-error">'+esc(e.message||String(e))+'</div>';
        shareButton.disabled=true;
        copyButton.disabled=true;
        downloadButton.disabled=true;
        regenerateButton.disabled=true
      }

      roleSelect?.addEventListener('change',async()=>{
        try{
          roleSelect.disabled=true;
          const next=await api('workspace.invite.link',{
            workspaceId:workspace.workspace.id,
            input:{roleKey:roleSelect.value}
          });
          await paint(next);
          toast('Rol del QR actualizado')
        }catch(e){toast(e.message||String(e))}
        finally{roleSelect.disabled=false}
      });

      copyButton?.addEventListener('click',async()=>{
        const ok=await copyInviteCode(url);
        toast(ok?'Enlace copiado':'No se pudo copiar automáticamente')
      });

      shareButton?.addEventListener('click',()=>shareWorkspaceInvite(invite,url));
      downloadButton?.addEventListener('click',()=>downloadWorkspaceInviteImage(invite,url,qrZone));

      regenerateButton?.addEventListener('click',async()=>{
        if(!confirm('¿Regenerar el QR? El QR y enlace anteriores dejarán de funcionar.'))return;
        regenerateButton.disabled=true;
        regenerateButton.textContent='Regenerando…';
        try{
          const next=await api('workspace.invite.link.regenerate',{
            workspaceId:workspace.workspace.id,
            input:{roleKey:roleSelect.value}
          });
          await paint(next);
          toast('QR regenerado. El anterior quedó invalidado.')
        }catch(e){toast(e.message||String(e))}
        finally{
          regenerateButton.disabled=false;
          regenerateButton.textContent='Regenerar QR'
        }
      });

      manualButton?.addEventListener('click',async()=>{
        manualButton.disabled=true;
        manualButton.textContent='Generando…';
        try{
          const one=await api('workspace.invite.code',{
            workspaceId:workspace.workspace.id,
            input:{roleKey:roleSelect.value}
          });
          const code=one.code||'';
          const expiry=one.expiresAt?new Date(one.expiresAt).toLocaleDateString():'7 días';
          manualZone.innerHTML='<div class="nxo-invite-manual-code"><strong>'+esc(code)+'</strong><span>Válido hasta '+esc(expiry)+' · un solo uso</span><button id="nxo-copy-manual-code" class="nxo-btn">Copiar código</button></div>';
          o.querySelector('#nxo-copy-manual-code')?.addEventListener('click',async()=>{
            const ok=await copyInviteCode(code);
            toast(ok?'Código copiado':'No se pudo copiar automáticamente')
          })
        }catch(e){toast(e.message||String(e))}
        finally{
          manualButton.disabled=false;
          manualButton.textContent='Generar otro código temporal'
        }
      })
    }
  )
}

async function changeRole(memberId,roleKey){try{await api('workspace.role',{workspaceId:workspace.workspace.id,targetMemberId:memberId,roleKey});toast('Rol actualizado');await loadMembers()}catch(e){toast(e.message||String(e));await loadMembers()}}
async function removeMember(memberId){if(!confirm(ui('¿Quitar a este miembro del espacio de trabajo?','Remove this member from the Workspace?')))return;try{await api('workspace.remove',{workspaceId:workspace.workspace.id,targetMemberId:memberId});toast('Miembro removido');await loadMembers()}catch(e){toast(e.message||String(e))}}
async function loadWorkspaceSettings(){
  const zone=document.getElementById('nxo-settings-zone');
  if(!zone)return;
  try{
    workspaceToolConfig=await api('workspace.tools',{workspaceId:workspace.workspace.id});
    const ws=workspace.workspace||{},logo=mediaUrl(ws.logoImage);
    const logoAction=logo?ui('Cambiar logo','Change logo'):ui('Subir logo','Upload logo');
    zone.innerHTML=
      '<div class="nxo-panel" style="padding:18px;margin-bottom:14px">'+
        '<div class="nxo-section-head"><div><h3>'+esc(ui('Información del espacio de trabajo','Workspace information'))+'</h3><p>'+esc(ui('Nombre, descripción y logo visibles para sus miembros.','Name, description and logo visible to its members.'))+'</p></div></div>'+
        '<div class="nxo-workspace-logo-settings"><div class="nxo-workspace-logo-preview">'+(logo?'<img src="'+esc(logo)+'" alt="'+esc((ws.name||ui('Espacio de trabajo','Workspace'))+' logo')+'">':iconTag('workspace',ws.name||ui('Espacio de trabajo','Workspace')) )+'</div><div class="nxo-workspace-logo-copy"><strong>'+esc(ui('Logo del espacio de trabajo','Workspace logo'))+'</strong><p>PNG, JPG, WEBP '+esc(ui('o','or'))+' SVG · '+esc(ui('máximo','maximum'))+' 8 MB.</p><label id="nxo-workspace-logo-change" class="nxo-btn nxo-native-file-picker"><span class="nxo-native-file-picker-text">'+esc(logoAction)+'</span><input id="nxo-workspace-logo-file" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" aria-label="'+esc(logoAction)+'"></label></div></div>'+
        '<div class="nxo-field"><label>'+esc(ui('Nombre','Name'))+'</label><input id="nxo-settings-name" class="nxo-input" value="'+esc(ws.name||'')+'"></div>'+
        '<div class="nxo-field"><label>'+esc(ui('Descripción','Description'))+'</label><textarea id="nxo-settings-desc" class="nxo-textarea">'+esc(ws.description||'')+'</textarea></div>'+
        '<div class="nxo-modal-actions"><button id="nxo-settings-save" class="nxo-btn nxo-btn-gold">'+esc(ui('Guardar cambios','Save changes'))+'</button></div>'+
      '</div>'+
      '<div class="nxo-panel" style="padding:18px">'+
        '<div class="nxo-section-head"><div><h3>'+esc(ui('Herramientas del espacio de trabajo','Workspace tools'))+'</h3><p>'+esc(ui('Activa herramientas, personaliza cómo se presentan y decide quién puede verlas.','Enable tools, customize how they appear, and decide who can see them.'))+'</p></div></div>'+
        '<div class="nxo-tool-config">'+workspaceToolConfig.tools.map(t=>{
          const mode=t.accessMode==='restricted'
            ?ui('Restringido · ','Restricted · ')+(t.allowedMemberIds||[]).length+' '+ui('miembro','member')+((t.allowedMemberIds||[]).length===1?'':'s')
            :ui('Todo el espacio de trabajo','Entire Workspace');
          const displayName=t.customName||t.nameEs||t.toolKey;
          const displayDescription=t.customDescription||t.descriptionEs||'';
          return '<div class="nxo-tool-toggle">'+
            '<div><h4>'+esc(displayName)+'</h4><p>'+esc(displayDescription)+' · '+esc(statusText(t.status))+'</p><div class="nxo-access-summary">'+esc(mode)+'</div></div>'+
            '<div class="nxo-tool-actions">'+
              '<button class="nxo-btn" data-tool-identity="'+esc(t.toolKey)+'">'+iconLabel('editar',ui('Personalizar','Customize'))+'</button>'+
              '<button class="nxo-btn" data-tool-access="'+esc(t.toolKey)+'" '+(t.enabled?'':'disabled')+'>'+iconLabel('acceso-rol',ui('Parámetros de acceso','Access settings'))+'</button>'+
              '<div class="nxo-switch '+(t.enabled?'on':'')+'" data-tool-toggle="'+esc(t.toolKey)+'" data-enabled="'+(t.enabled?'1':'0')+'"><span></span></div>'+
            '</div>'+
          '</div>'
        }).join('')+'</div>'+
      '</div>';
    document.getElementById('nxo-settings-save')?.addEventListener('click',saveWorkspaceSettings);
    const logoInput=document.getElementById('nxo-workspace-logo-file');
    logoInput?.addEventListener('change',()=>{
      const file=logoInput.files?.[0];
      logoInput.value='';
      if(file)uploadWorkspaceLogo(file)
    });
    document.querySelectorAll('[data-tool-toggle]').forEach(x=>x.onclick=()=>toggleTool(x.dataset.toolToggle,x.dataset.enabled!=='1'));
    document.querySelectorAll('[data-tool-access]').forEach(x=>x.onclick=()=>toolAccessModal(x.dataset.toolAccess));
    document.querySelectorAll('[data-tool-identity]').forEach(x=>x.onclick=()=>toolIdentityModal(x.dataset.toolIdentity))
  }catch(e){
    zone.innerHTML='<div class="nxo-empty">'+esc(e.message||e)+'</div>'
  }
}
function toolIdentityModal(toolKey){
  const tool=(workspaceToolConfig?.tools||[]).find(t=>t.toolKey===toolKey);
  if(!tool)return;
  const baseName=tool.nameEs||tool.nameEn||tool.toolKey;
  const baseDescription=tool.descriptionEs||'';
  modal('Personalizar herramienta · '+baseName,
    '<div class="nxo-field"><label>'+esc(ui('Nombre en este espacio de trabajo','Name in this Workspace'))+'</label><input id="nxo-tool-custom-name" class="nxo-input" maxlength="120" value="'+esc(tool.customName||'')+'" placeholder="'+esc(baseName)+'"></div>'+
    '<div class="nxo-field"><label>Descripción general</label><textarea id="nxo-tool-custom-description" class="nxo-textarea" maxlength="600" placeholder="'+esc(baseDescription)+'">'+esc(tool.customDescription||'')+'</textarea></div>'+
    '<p class="nxo-muted" style="line-height:1.5">'+esc(ui('Si dejas un campo vacío, Nexo utilizará el nombre o descripción original de la herramienta. Este cambio solo afecta a este espacio de trabajo.','If you leave a field empty, Nexo will use the original tool name or description. This change only affects this Workspace.'))+'</p>'+
    '<div class="nxo-modal-actions"><button id="nxo-tool-identity-save" class="nxo-btn nxo-btn-gold">Guardar personalización</button></div>',
    o=>{
      const save=o.querySelector('#nxo-tool-identity-save');
      save?.addEventListener('click',async()=>{
        const name=o.querySelector('#nxo-tool-custom-name')?.value.trim()||'';
        const description=o.querySelector('#nxo-tool-custom-description')?.value.trim()||'';
        save.disabled=true;
        save.textContent='Guardando…';
        try{
          await api('workspace.tool.identity',{workspaceId:workspace.workspace.id,toolKey,input:{name,description}});
          o.remove();
          workspace=await api('workspace.open',{workspaceId:workspace.workspace.id});
          toast('Presentación de la herramienta actualizada');
          await loadWorkspaceSettings()
        }catch(e){
          save.disabled=false;
          save.textContent='Guardar personalización';
          toast(e.message||String(e))
        }
      })
    }
  )
}

async function toolAccessModal(toolKey){const tool=(workspaceToolConfig?.tools||[]).find(t=>t.toolKey===toolKey);if(!tool)return;try{if(!workspaceMembers)workspaceMembers=await api('workspace.members',{workspaceId:workspace.workspace.id});const current=new Set(tool.allowedMemberIds||[]);const members=workspaceMembers?.members||[];modal('Parámetros de acceso · '+(tool.nameEs||tool.toolKey),'<div class="nxo-field"><label>Disponibilidad</label><select id="nxo-access-mode" class="nxo-select"><option value="workspace" '+(tool.accessMode!=='restricted'?'selected':'')+'>'+esc(ui('Todo el espacio de trabajo','Entire Workspace'))+'</option><option value="restricted" '+(tool.accessMode==='restricted'?'selected':'')+'>Solo miembros seleccionados</option></select></div><div id="nxo-access-members" class="nxo-access-list">'+members.map(m=>'<label class="nxo-check"><input type="checkbox" value="'+esc(m.memberId)+'" '+(current.has(m.memberId)?'checked':'')+'><span><strong>'+esc(m.displayName)+'</strong><small>'+esc(roleName(m.roleKey,m.role))+'</small></span></label>').join('')+'</div><p class="nxo-muted" style="line-height:1.5;margin:10px 0 0">Los administradores con permiso de configurar herramientas conservan visibilidad para poder administrarlas.</p><div class="nxo-modal-actions"><button id="nxo-access-save" class="nxo-btn nxo-btn-gold">Guardar acceso</button></div>',o=>{const select=o.querySelector('#nxo-access-mode'),list=o.querySelector('#nxo-access-members'),save=o.querySelector('#nxo-access-save');const sync=()=>{list.style.display=select.value==='restricted'?'grid':'none'};select.onchange=sync;sync();save.onclick=async()=>{const mode=select.value;const allowed=mode==='restricted'?[...o.querySelectorAll('#nxo-access-members input:checked')].map(x=>x.value):[];if(mode==='restricted'&&!allowed.length){toast('Selecciona al menos un miembro');return}save.disabled=true;try{await api('workspace.tool.access',{workspaceId:workspace.workspace.id,toolKey,input:{accessMode:mode,allowedMemberIds:allowed}});o.remove();toast('Acceso actualizado');workspace=await api('workspace.open',{workspaceId:workspace.workspace.id});await loadWorkspaceSettings()}catch(e){save.disabled=false;toast(e.message||String(e))}}})}catch(e){toast(e.message||String(e))}}
function openProfilePhotoCropper(file,inWorkspace=false){
  if(!file)return;
  const allowed=['image/png','image/jpeg','image/webp'];
  const mime=String(file.type||'').toLowerCase();
  if(!allowed.includes(mime)){toast(ui('La foto debe ser PNG, JPG o WEBP','The photo must be PNG, JPG or WEBP'));return}
  if(file.size>8*1024*1024){toast(ui('La foto supera el límite de 8 MB','The photo exceeds the 8 MB limit'));return}
  const objectUrl=URL.createObjectURL(file);
  const body=
    '<div class="nxo-photo-cropper">'+
      '<p class="nxo-photo-crop-help">'+esc(ui('Arrastra la imagen para colocarla. Usa el control de zoom para agrandarla o achicarla. La cuadrícula muestra el encuadre que se guardará.','Drag the image to position it. Use the zoom control to enlarge or reduce it. The grid shows the crop that will be saved.'))+'</p>'+
      '<div class="nxo-photo-crop-stage" id="nxo-photo-crop-stage"><img id="nxo-photo-crop-image" alt="" draggable="false"><div class="nxo-photo-crop-grid" aria-hidden="true"></div><div class="nxo-photo-crop-circle" aria-hidden="true"></div></div>'+
      '<label class="nxo-photo-crop-zoom"><span>'+esc(ui('Zoom','Zoom'))+'</span><input id="nxo-photo-crop-range" type="range" min="1" max="3" value="1" step="0.01"></label>'+
      '<div class="nxo-modal-actions"><button type="button" class="nxo-btn" id="nxo-photo-crop-cancel">'+esc(ui('Cancelar','Cancel'))+'</button><button type="button" class="nxo-btn nxo-btn-gold" id="nxo-photo-crop-save">'+esc(ui('Usar esta foto','Use this photo'))+'</button></div>'+
    '</div>';
  modal(ui('Ajustar foto de perfil','Adjust profile photo'),body,o=>{
    const stage=o.querySelector('#nxo-photo-crop-stage'),image=o.querySelector('#nxo-photo-crop-image'),range=o.querySelector('#nxo-photo-crop-range'),save=o.querySelector('#nxo-photo-crop-save'),cancel=o.querySelector('#nxo-photo-crop-cancel');
    let naturalWidth=0,naturalHeight=0,baseScale=1,zoom=1,tx=0,ty=0,dragging=false,startX=0,startY=0,startTx=0,startTy=0,cleaned=false;
    const cleanup=()=>{if(cleaned)return;cleaned=true;try{URL.revokeObjectURL(objectUrl)}catch(_){}};
    const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
    const render=()=>{
      if(!naturalWidth||!naturalHeight||!stage)return;
      const size=stage.clientWidth||300,scale=baseScale*zoom,width=naturalWidth*scale,height=naturalHeight*scale;
      tx=clamp(tx,-Math.max(0,(width-size)/2),Math.max(0,(width-size)/2));
      ty=clamp(ty,-Math.max(0,(height-size)/2),Math.max(0,(height-size)/2));
      image.style.width=width+'px';image.style.height=height+'px';image.style.left=((size-width)/2+tx)+'px';image.style.top=((size-height)/2+ty)+'px'
    };
    image.addEventListener('load',()=>{naturalWidth=image.naturalWidth||1;naturalHeight=image.naturalHeight||1;const size=stage.clientWidth||300;baseScale=Math.max(size/naturalWidth,size/naturalHeight);zoom=Number(range.value||1);tx=0;ty=0;render()});
    image.src=objectUrl;
    range.addEventListener('input',()=>{zoom=Number(range.value||1);render()});
    stage.addEventListener('pointerdown',e=>{if(!naturalWidth)return;dragging=true;startX=e.clientX;startY=e.clientY;startTx=tx;startTy=ty;stage.setPointerCapture?.(e.pointerId)});
    stage.addEventListener('pointermove',e=>{if(!dragging)return;tx=startTx+(e.clientX-startX);ty=startTy+(e.clientY-startY);render()});
    const endDrag=e=>{dragging=false;try{stage.releasePointerCapture?.(e.pointerId)}catch(_){}};
    stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',endDrag);
    cancel.addEventListener('click',()=>{cleanup();o.remove()});
    o.querySelector('[data-close]')?.addEventListener('click',cleanup,{once:true});
    o.addEventListener('click',e=>{if(e.target===o)cleanup()});
    save.addEventListener('click',()=>{
      if(!naturalWidth||!naturalHeight){toast(ui('Espera a que la imagen termine de cargar','Wait for the image to finish loading'));return}
      save.disabled=true;save.textContent=ui('Preparando…','Preparing…');
      const size=stage.clientWidth||300,scale=baseScale*zoom,renderedWidth=naturalWidth*scale,renderedHeight=naturalHeight*scale,left=(size-renderedWidth)/2+tx,top=(size-renderedHeight)/2+ty;
      const sx=clamp((-left)/renderedWidth*naturalWidth,0,naturalWidth),sy=clamp((-top)/renderedHeight*naturalHeight,0,naturalHeight);
      const sw=Math.min(naturalWidth-sx,size/renderedWidth*naturalWidth),sh=Math.min(naturalHeight-sy,size/renderedHeight*naturalHeight),sourceSize=Math.min(sw,sh);
      const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const ctx=canvas.getContext('2d');
      if(!ctx){save.disabled=false;save.textContent=ui('Usar esta foto','Use this photo');toast(ui('No se pudo preparar el recorte','The crop could not be prepared'));return}
      ctx.drawImage(image,sx,sy,sourceSize,sourceSize,0,0,1024,1024);
      const outType=mime==='image/png'?'image/png':(mime==='image/webp'?'image/webp':'image/jpeg');
      canvas.toBlob(async blob=>{
        if(!blob){save.disabled=false;save.textContent=ui('Usar esta foto','Use this photo');toast(ui('No se pudo crear la foto recortada','The cropped photo could not be created'));return}
        const ext=outType==='image/png'?'png':(outType==='image/webp'?'webp':'jpg');
        const base=(String(file.name||'profile-photo').replace(/\.[^.]+$/,'').replace(/[^a-z0-9_-]+/gi,'-').slice(0,70)||'profile-photo');
        const cropped=new File([blob],base+'-crop.'+ext,{type:outType,lastModified:Date.now()});
        cleanup();o.remove();await uploadProfilePhoto(cropped,inWorkspace)
      },outType,outType==='image/png'?undefined:.92)
    })
  })
}

async function uploadProfilePhoto(file,inWorkspace=false){
  if(!file)return;
  const allowed=['image/png','image/jpeg','image/webp'];
  const mime=String(file.type||'').toLowerCase();
  if(!allowed.includes(mime)){toast('La foto debe ser PNG, JPG o WEBP');return}
  if(file.size>8*1024*1024){toast('La foto supera el límite de 8 MB');return}
  const button=document.querySelector('[data-account-action="photo"]');
  const oldText=button?.textContent||'Cambiar foto de perfil';
  if(button){button.disabled=true;button.textContent='Subiendo…'}
  try{
    const ticket=await api('profile.photo.upload-url',{
      input:{fileName:file.name||'profile-photo.jpg',mimeType:mime||'image/jpeg',sizeInBytes:file.size}
    });
    const uploadUrl=String(ticket?.uploadUrl||'');
    if(!uploadUrl)throw new Error('Wix no pudo preparar la subida de la foto');
    const response=await fetch(uploadUrl,{method:'PUT',headers:{'Content-Type':mime||'image/jpeg'},body:file});
    let body={};try{body=await response.json()}catch(_){}
    if(!response.ok)throw new Error(String(body?.message||body?.error||('UPLOAD_HTTP_'+response.status)));
    const fileId=String(body?.file?.id||body?.file?._id||body?.id||body?._id||'');
    if(!fileId)throw new Error('Wix no devolvió el ID de la foto');
    personal=await api('profile.photo.commit',{input:{fileId}});
    toast('Foto de perfil actualizada');
    if(inWorkspace)renderWorkspace();else renderPersonal();
  }catch(e){
    if(button){button.disabled=false;button.textContent=oldText}
    toast(e.message||String(e))
  }
}
async function commitWorkspaceLogoFile(workspaceId,file){
  if(!workspaceId||!file)throw new Error(ui('Falta el espacio de trabajo o la imagen','The Workspace or image is missing'));
  const allowed=['image/png','image/jpeg','image/webp','image/svg+xml'];
  const mime=String(file.type||'').toLowerCase();
  if(!allowed.includes(mime))throw new Error('El logo debe ser PNG, JPG, WEBP o SVG');
  if(file.size>8*1024*1024)throw new Error('El logo supera el límite de 8 MB');
  const ticket=await api('workspace.logo.upload-url',{
    workspaceId,
    input:{fileName:file.name||'workspace-logo.png',mimeType:mime||'image/png',sizeInBytes:file.size}
  });
  const uploadUrl=String(ticket?.uploadUrl||'');
  if(!uploadUrl)throw new Error('Wix no pudo preparar la subida del logo');
  const response=await fetch(uploadUrl,{method:'PUT',headers:{'Content-Type':mime||'image/png'},body:file});
  let body={};try{body=await response.json()}catch(_){}
  if(!response.ok)throw new Error(String(body?.message||body?.error||('UPLOAD_HTTP_'+response.status)));
  const fileId=String(body?.file?.id||body?.file?._id||body?.id||body?._id||'');
  if(!fileId)throw new Error('Wix no devolvió el ID del logo');
  return api('workspace.logo.commit',{workspaceId,input:{fileId}})
}
async function uploadWorkspaceCardLogo(workspaceId,file){
  const item=(personal?.workspaces||[]).find(x=>x.workspaceId===workspaceId);
  if(!item?.canManageWorkspace){toast(ui('No tienes permiso para cambiar esta imagen','You do not have permission to change this image'));return}
  const control=document.querySelector('[data-workspace-logo-edit="'+CSS.escape(workspaceId)+'"]');
  const input=control?.querySelector('[data-workspace-logo-file]');
  if(control){control.classList.add('uploading');control.setAttribute('aria-busy','true')}
  if(input)input.disabled=true;
  try{
    await commitWorkspaceLogoFile(workspaceId,file);
    personal=await api('personal.refresh');
    toast(ui('Imagen del espacio de trabajo actualizada','Workspace image updated'));
    renderPersonal()
  }catch(e){
    if(input)input.disabled=false;
    if(control){control.classList.remove('uploading');control.removeAttribute('aria-busy')}
    toast(e.message||String(e))
  }
}
async function uploadWorkspaceLogo(file){
  if(!file||!workspace?.workspace?.id)return;
  const picker=document.getElementById('nxo-workspace-logo-change');
  const input=document.getElementById('nxo-workspace-logo-file');
  const textNode=picker?.querySelector('.nxo-native-file-picker-text');
  const oldText=textNode?.textContent||ui('Subir logo','Upload logo');
  if(input)input.disabled=true;
  if(picker){picker.classList.add('uploading');picker.setAttribute('aria-busy','true')}
  if(textNode)textNode.textContent=ui('Subiendo…','Uploading…');
  try{
    workspace=await commitWorkspaceLogoFile(workspace.workspace.id,file);
    personal=await api('personal.refresh');
    toast(ui('Logo del espacio de trabajo actualizado','Workspace logo updated'));
    renderWorkspace()
  }catch(e){
    if(input)input.disabled=false;
    if(picker){picker.classList.remove('uploading');picker.removeAttribute('aria-busy')}
    if(textNode)textNode.textContent=oldText;
    toast(e.message||String(e))
  }
}
async function saveWorkspaceSettings(){const name=document.getElementById('nxo-settings-name')?.value.trim()||'',description=document.getElementById('nxo-settings-desc')?.value.trim()||'';if(!name){toast('El nombre es obligatorio');return}try{workspace=await api('workspace.update',{workspaceId:workspace.workspace.id,input:{name,description}});toast(ui('Espacio de trabajo actualizado','Workspace updated'));renderWorkspace()}catch(e){toast(e.message||String(e))}}
async function toggleTool(toolKey,enabled){try{await api('workspace.tool.set',{workspaceId:workspace.workspace.id,toolKey,enabled});toast(enabled?'Herramienta habilitada':'Herramienta deshabilitada');workspace=await api('workspace.open',{workspaceId:workspace.workspace.id});await loadWorkspaceSettings()}catch(e){toast(e.message||String(e))}}
start().catch(errorView);
})();
