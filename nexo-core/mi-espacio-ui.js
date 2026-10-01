(function(){
if(window.__nexoMiEspacioApp)return;window.__nexoMiEspacioApp=true;
const CSS='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/mi-espacio-ui.css?v=welcome-close-20261001-56';
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
    b.setAttribute('aria-label',night?ui('Cambiar a modo diurno','Switch to light mode'):ui('Cambiar a modo nocturno','Switch to dark mode'));
    b.setAttribute('title',night?ui('Modo diurno','Light mode'):ui('Modo nocturno','Dark mode'));
    b.setAttribute('aria-pressed',night?'true':'false');
  }
  if(typeof numaSyncVisualTheme==='function')numaSyncVisualTheme();
  return t;
}
function toggleTheme(){const r=document.getElementById('nxo-app');applyTheme(r?.dataset?.theme==='night'?'day':'night',true)}
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const initials=v=>String(v||'N').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'N';
const mediaUrl=v=>typeof v==='string'?v:(v&&(v.url||v.image?.url||v.src)||'');
function addCss(){if(document.getElementById('nxo-css'))return;const l=document.createElement('link');l.id='nxo-css';l.rel='stylesheet';l.href=CSS;document.head.appendChild(l)}
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
const NUMA_VISUAL_ASSETS={
  day:{
    idle:"https://static.wixstatic.com/media/8b64a8_0ea89ddfe6f9485cb51cc818bbc28587~mv2.png",
    attentive:"https://static.wixstatic.com/media/8b64a8_664b5ce8535143ae83d866ef22339f26~mv2.png",
    listening:"https://static.wixstatic.com/media/8b64a8_431c1faecd1d40518baba43f648de9dc~mv2.png",
    thinking:"https://static.wixstatic.com/media/8b64a8_05317e113b054caead2a8672f59167af~mv2.png",
    success:"https://static.wixstatic.com/media/8b64a8_b673e3b346d845ffa38e21c660eea254~mv2.png",
    error:"https://static.wixstatic.com/media/8b64a8_0f51f83f717a4cf88888da0ffa3485c9~mv2.png"
  },
  night:{
    idle:"https://static.wixstatic.com/media/8b64a8_1afdaa040eae4947951ca6233fb4b979~mv2.png",
    attentive:"https://static.wixstatic.com/media/8b64a8_c6cc56b0eb584dbd8d4858ce7418e7d3~mv2.png",
    listening:"https://static.wixstatic.com/media/8b64a8_ce4b32fa64324cdf8b2a03adccfe5252~mv2.png",
    thinking:"https://static.wixstatic.com/media/8b64a8_fe4d5fa2ddf840e5b5ae1840138fd915~mv2.png",
    success:"https://static.wixstatic.com/media/8b64a8_fe372358c9964067b096b3a0b775ecca~mv2.png",
    error:"https://static.wixstatic.com/media/8b64a8_d1c9c01f021d4b2c8dd0c2975f3c7342~mv2.png"
  }
};
const NUMA_VISUAL_RUNTIME_STATES=new Set(["idle","attentive","listening","thinking","success","error"]);
let numaVisualRequestedState="idle";
let numaVisualTimer=0,numaTypingTimer=0,numaLauncherRaf=0,numaLifeRaf=0;
let numaState=null,numaContextCacheKey="",numaLoading=false,numaSending=false;

function numaVisualTheme(){
  return document.getElementById("nxo-app")?.dataset?.theme==="night"?"night":"day";
}
function numaVisualAsset(state="idle"){
  const theme=numaVisualTheme();
  const effective=NUMA_VISUAL_RUNTIME_STATES.has(state)?state:"idle";
  return NUMA_VISUAL_ASSETS[theme]?.[effective]||NUMA_VISUAL_ASSETS.day.idle;
}
function numaSyncVisualTheme(){
  const theme=numaVisualTheme();
  const launcher=document.getElementById("nma-launcher");
  const panel=document.getElementById("nma-panel");
  if(launcher)launcher.dataset.theme=theme;
  if(panel)panel.dataset.theme=theme;
  const img=document.getElementById("nma-character-img");
  const src=numaVisualAsset(numaVisualRequestedState);
  if(img&&img.src!==src)img.src=src;
  const life=document.getElementById("nma-life-field");
  if(life)life.style.setProperty("--nma-mask",'url("'+src+'")');
}
function numaSetExpression(kind="none"){
  const layer=document.getElementById("nma-expression-layer");
  if(!layer)return;
  layer.dataset.expression=kind||"none";
  const markup={
    speak:'<span class="nma-symbol nma-symbol-speak">!</span>',
    question:'<span class="nma-symbol nma-symbol-question">?</span>',
    listening:'<span class="nma-ellipsis"><i></i><i></i><i></i></span>',
    thinking:'<span class="nma-think-mark">?</span><span class="nma-ellipsis nma-ellipsis-think"><i></i><i></i><i></i></span>',
    confused:'<span class="nma-confused"><i>?</i><i>?</i><i>?</i></span>',
    success:'<span class="nma-sparkles">'+Array.from({length:7},(_,i)=>'<i style="--i:'+i+'">✦</i>').join("")+'</span>',
    error:'<span class="nma-error-orbit">'+Array.from({length:5},(_,i)=>'<i style="--i:'+i+'">✦</i>').join("")+'</span>'
  };
  layer.innerHTML=markup[kind]||"";
}
function numaSetVisualState(state="idle",expression="none",duration=0){
  if(numaVisualTimer){clearTimeout(numaVisualTimer);numaVisualTimer=0}
  numaVisualRequestedState=NUMA_VISUAL_RUNTIME_STATES.has(state)?state:"idle";
  const panel=document.getElementById("nma-panel");
  if(panel){
    panel.dataset.state=numaVisualRequestedState;
    panel.dataset.requestedState=numaVisualRequestedState;
  }
  const img=document.getElementById("nma-character-img");
  const src=numaVisualAsset(numaVisualRequestedState);
  if(img&&img.src!==src)img.src=src;
  const life=document.getElementById("nma-life-field");
  if(life)life.style.setProperty("--nma-mask",'url("'+src+'")');
  numaSetExpression(expression);
  if(duration>0){
    numaVisualTimer=setTimeout(()=>{
      numaVisualTimer=0;
      if(!numaSending)numaSetVisualState("idle","none");
    },duration);
  }
}
function numaSpeak(text,{expression="speak",duration=0}={}){
  const bubble=document.getElementById("nma-speech");
  if(!bubble)return;
  const value=String(text||"").trim()||"Hola, ¿en qué puedo ayudarte?";
  bubble.textContent=value;
  bubble.classList.remove("speaking");
  void bubble.offsetWidth;
  bubble.classList.add("speaking");
  if(expression&&expression!=="none")numaSetExpression(expression);
  const ms=duration||Math.max(1100,Math.min(3200,650+value.length*18));
  setTimeout(()=>bubble?.classList.remove("speaking"),ms);
}
function numaLifeFieldMarkup(){
  return '<div class="nma-life-field" id="nma-life-field" aria-hidden="true"><canvas id="nma-life-canvas"></canvas></div>';
}
function numaRgb(){
  return numaVisualTheme()==="night"?{r:255,g:190,b:56}:{r:45,g:161,b:255};
}
function numaMountLifeParticles(){
  const canvas=document.getElementById("nma-life-canvas");
  const stage=document.querySelector(".nma-character-stage");
  if(!canvas||!stage||canvas.dataset.mounted==="1")return;
  canvas.dataset.mounted="1";
  const ctx=canvas.getContext("2d");
  const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const nodes=Array.from({length:13},(_,i)=>{
    const head=i<8;
    return {
      zone:head?"head":"body",
      ax:head?.5:.51,
      ay:head?.37:.61,
      rx:head?.19:.14,
      ry:head?.14:.13,
      phase:Math.random()*Math.PI*2,
      speed:.00018+Math.random()*.00015,
      amp:.012+Math.random()*.018,
      size:.65+Math.random()*1.15
    };
  });
  function resize(){
    const rect=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.max(1,Math.round(rect.width*dpr));
    canvas.height=Math.max(1,Math.round(rect.height*dpr));
    canvas.style.width=rect.width+"px";canvas.style.height=rect.height+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return {w:rect.width,h:rect.height};
  }
  let size=resize();
  const ro=typeof ResizeObserver!=="undefined"?new ResizeObserver(()=>{size=resize()}):null;
  ro?.observe(stage);
  function frame(t){
    if(!document.body.contains(canvas)){ro?.disconnect();return}
    const {w,h}=size;
    ctx.clearRect(0,0,w,h);
    const rgb=numaRgb();
    const points=nodes.map((n,i)=>{
      const a=n.phase+t*n.speed;
      const x=(n.ax+Math.cos(a*(1+(i%3)*.08))*n.rx*n.amp/.03)*w;
      const y=(n.ay+Math.sin(a*.83+(i%2)*.7)*n.ry*n.amp/.03)*h;
      return {x,y,size:n.size};
    });
    ctx.lineWidth=.65;
    for(let i=0;i<points.length;i++){
      let linked=0;
      for(let j=i+1;j<points.length&&linked<2;j++){
        const a=points[i],b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<Math.min(w*.24,68)){
          const alpha=(1-d/Math.min(w*.24,68))*.15;
          ctx.strokeStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+alpha+")";
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();linked++;
        }
      }
    }
    points.forEach((p,i)=>{
      const pulse=.58+.42*Math.sin(t*.0024+i);
      ctx.fillStyle="rgba(255,255,255,"+(.18+pulse*.26)+")";
      ctx.shadowBlur=7;ctx.shadowColor="rgba("+rgb.r+","+rgb.g+","+rgb.b+",.45)";
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*(.72+pulse*.28),0,Math.PI*2);ctx.fill();
    });
    ctx.shadowBlur=0;
    if(!reduce)numaLifeRaf=requestAnimationFrame(frame);
  }
  frame(performance.now());
}
function numaMountLauncherParticles(){
  const canvas=document.getElementById("nma-launcher-canvas");
  if(!canvas||canvas.dataset.mounted==="1")return;
  canvas.dataset.mounted="1";
  const ctx=canvas.getContext("2d"),reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const dpr=Math.min(devicePixelRatio||1,1.5),W=112,H=150;
  canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+"px";canvas.style.height=H+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  let last=0;const particles=[];
  function spawn(t){
    particles.push({
      born:t,x:W*.5+(Math.random()-.5)*9,
      sway:(Math.random()-.5)*16,
      speed:16+Math.random()*8,
      life:3100+Math.random()*900,
      r:2.6+Math.random()*2.1
    });
  }
  function frame(t){
    if(!document.body.contains(canvas))return;
    if(t-last>470&&particles.length<8){spawn(t);last=t}
    ctx.clearRect(0,0,W,H);
    const rgb=numaRgb(),alive=[];
    const pts=[];
    for(const p of particles){
      const age=t-p.born,k=age/p.life;
      if(k>=1)continue;
      const y=H-24-k*112;
      const x=p.x+Math.sin(k*Math.PI*1.6)*p.sway;
      const r=p.r*(1-k*.7);
      pts.push({x,y,r,k});
      alive.push(p);
    }
    particles.splice(0,particles.length,...alive);
    const origin={x:W*.5,y:H-18,r:5,k:0};
    const all=[origin,...pts];
    for(let i=0;i<all.length;i++){
      let best=-1,bestD=999;
      for(let j=i+1;j<all.length;j++){
        const d=Math.hypot(all[i].x-all[j].x,all[i].y-all[j].y);
        if(d<bestD&&d<34){best=j;bestD=d}
      }
      if(best>=0){
        const alpha=.22*(1-Math.max(all[i].k,all[best].k));
        ctx.strokeStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+alpha+")";
        ctx.lineWidth=.7;
        ctx.beginPath();ctx.moveTo(all[i].x,all[i].y);ctx.lineTo(all[best].x,all[best].y);ctx.stroke();
      }
    }
    pts.forEach(p=>{
      const alpha=.48*(1-p.k);
      ctx.shadowBlur=8;ctx.shadowColor="rgba("+rgb.r+","+rgb.g+","+rgb.b+",.35)";
      ctx.fillStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+alpha+")";
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    });
    ctx.shadowBlur=0;
    if(!reduce)numaLauncherRaf=requestAnimationFrame(frame);
  }
  if(reduce){spawn(performance.now());frame(performance.now()+600)}
  else frame(performance.now());
}
function numaVisualFromResponse(data){
  const reply=String(data?.message?.content||"");
  if(data?.provider==="openai_error")return {state:"error",expression:"error",duration:2600};
  if(/no pude (?:interpretar|relacionar|entender)/i.test(reply))return {state:"attentive",expression:"confused",duration:3200};
  if(data?.dialogue?.awaiting)return {state:"attentive",expression:"question",duration:0};
  if(data?.action)return {state:"success",expression:"success",duration:1800};
  return {state:"idle",expression:"speak",duration:Math.max(1300,Math.min(3200,700+reply.length*18))};
}

function numaContextInput(){
  const isWorkspace=!!workspace?.workspace?.id;
  return {
    workspaceId:isWorkspace?workspace.workspace.id:"",
    currentToolKey:isWorkspace?"workspace":"mi-espacio",
    currentToolLabel:isWorkspace?("Workspace · "+(workspace.workspace.name||"Nexo")):"Mi espacio"
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
  numaSpeak(latest?.content||"Hola, ¿en qué puedo ayudarte?");
}

function numaSetStatus(textValue,state=""){
  const x=document.getElementById("nma-status");
  if(x){
    x.textContent=textValue||"";
    x.dataset.state=state;
  }
  if(state==="loading")numaSetVisualState("thinking");
  else if(state==="error")numaSetVisualState("error");
  else numaSetVisualState("idle");
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
  numaSetVisualState("idle");
  panel.dataset.greetingHold="1";
  numaSpeak("Hola, ¿en qué puedo ayudarte?");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden","false");
  launcher?.setAttribute("aria-expanded","true");
  numaLoad(false);
  setTimeout(()=>{
    panel.dataset.greetingHold="0";
    document.getElementById("nma-input")?.focus();
  },900);
}

function numaClose(){
  const panel=document.getElementById("nma-panel");
  panel?.classList.remove("open");
  panel?.setAttribute("aria-hidden","true");
  document.getElementById("nma-launcher")?.setAttribute("aria-expanded","false");
}

function numaPerformAction(action){
  if(!action)return;
  if(action.type==="openWorkspace"){
    if(!action.workspaceId){toast("Numa no recibió un Workspace válido.");return}
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
    const wsid=workspace?.workspace?.id||"";
    const label=wsid?(workspace?.workspace?.name||"Workspace"):"Mi espacio";
    try{
      const u=new URL(launchWithBack(route,label,wsid),location.href);
      u.searchParams.set("numaSheet",String(action.sheetId));
      if(action.title)u.searchParams.set("numaSheetTitle",String(action.title));
      location.assign(u.href);
    }catch(_){
      location.assign(launchWithBack(route,label,wsid));
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
  numaSending=true;
  if(input){input.value="";input.disabled=true}
  if(button)button.disabled=true;
  const optimistic=[
    ...(numaState?.messages||[]),
    {role:"user",content:message,at:new Date().toISOString()}
  ];
  numaRenderMessages(optimistic);
  numaSetStatus("Numa está procesando…","loading");
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
    if(data?.action)setTimeout(()=>numaPerformAction(data.action),450);
  }catch(e){
    const failed=[...optimistic,{role:"assistant",content:"No pude completar esa solicitud: "+(e.message||String(e)),at:new Date().toISOString()}];
    numaState={...(numaState||{}),messages:failed};
    numaRenderMessages(failed);
    numaSetStatus("No se pudo completar la solicitud","error");
  }finally{
    numaSending=false;
    if(input){input.disabled=false;input.focus()}
    if(button)button.disabled=false;
  }
}

function mountNuma(){
  if(!sessionToken)return;
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
    launcher.innerHTML='<span class="nma-launch-stream" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="nma-launch-core" aria-hidden="true"></span>';
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
      '<button id="nma-close" class="nma-presence-close" type="button" aria-label="Cerrar Numa">✕</button>'+
      '<div class="nma-character-stage" aria-label="Numa">'+
        '<img id="nma-character-img" class="nma-character" alt="" draggable="false">'+
        numaLifeFieldMarkup()+
        '<div class="nma-expression-layer" id="nma-expression-layer" aria-hidden="true"></div>'+
      '</div>'+
      '<div class="nma-speech" id="nma-speech" role="status" aria-live="polite">Hola, ¿en qué puedo ayudarte?</div>'+
      '<div class="nma-status-row"><span class="nma-status-dot"></span><span id="nma-status">Modo local · sin consumo API</span></div>'+
      '<div class="nma-compose">'+
        '<textarea id="nma-input" rows="1" maxlength="8000" placeholder="Escribe a Numa…"></textarea>'+
        '<button id="nma-send" type="button" aria-label="Enviar mensaje">➤</button>'+
      '</div>';
    r.appendChild(panel);
    panel.querySelector("#nma-close")?.addEventListener("click",numaClose);
    panel.querySelector("#nma-send")?.addEventListener("click",numaSend);
    panel.querySelector("#nma-input")?.addEventListener("keydown",e=>{
      if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();numaSend()}
      if(e.key==="Escape")numaClose();
    });
  }
  numaSyncVisualTheme();
  numaSetVisualState("idle");
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
 const controller=new AbortController(),requestTimeout=action==='recipe-change.process'?90000:(action==='numa.send'?65000:20000),timer=setTimeout(()=>controller.abort(),requestTimeout);
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
function centerDevelopmentUrl(){const wsid=workspace?.workspace?.id||'';const label=wsid?(workspace?.workspace?.name||ui('Workspace','Workspace')):ui('Mi espacio','My space');return launchWithBack(siteBase(),label,wsid)}
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
  const wsName=workspace?.workspace?.name||'Workspace';
  const role=isWorkspace?roleName(workspace?.membership?.roleKey,workspace?.role):ui('Cuenta personal','Personal account');
  const roleKey=isWorkspace?String(workspace?.membership?.roleKey||'viewer').toLowerCase():'personal';
  const perms=workspace?.role?.permissions||[];
  const canTools=isWorkspace&&perms.includes('tools.configure');
  const canAdmin=isWorkspace&&(workspace?.membership?.roleKey==='owner'||perms.some(x=>['workspace.manage','members.manage','tools.configure'].includes(x)));
  const contextLabel=isWorkspace?wsName:ui('Mi espacio','My space');
  const lang=currentLanguage();
  const theme=document.getElementById('nxo-app')?.dataset?.theme||storedTheme();

  const workspaceQuickActions=!isWorkspace
    ?'<div class="nxo-header-workspace-actions">'+
       '<button type="button" class="nxo-header-action" id="nxo-join-workspace-mobile">'+esc(ui('Unirse a un Workspace','Join a Workspace'))+'</button>'+
       '<button type="button" class="nxo-header-action primary" id="nxo-create-workspace-mobile">'+esc(ui('Nuevo Workspace','New Workspace'))+'</button>'+
     '</div>'
    :'';

  const notification=canAdmin
    ?'<div class="nxo-notification-wrap">'+
       '<button type="button" class="nxo-notification-button" id="nxo-notification-button" aria-label="'+esc(ui('Notificaciones','Notifications'))+'" aria-expanded="false">'+
         '<span class="nxo-notification-icon" aria-hidden="true">🔔</span>'+
         '<span class="nxo-notification-badge" id="nxo-notification-badge" hidden>0</span>'+
       '</button>'+
       '<div class="nxo-notification-menu" id="nxo-notification-menu">'+
         '<div id="nxo-recipe-comment-notifications"><div class="nxo-notification-head"><strong>'+esc(ui('Notificaciones','Notifications'))+'</strong></div><div class="nxo-notification-empty">'+esc(ui('Cargando avisos…','Loading notifications…'))+'</div></div>'+
       '</div>'+
     '</div>'
    :'';

  const quickSettings=
    '<div class="nxo-quick-settings-wrap">'+
      '<button type="button" class="nxo-quick-settings-button" id="nxo-quick-settings-button" aria-label="'+esc(ui('Ajustes rápidos','Quick settings'))+'" aria-expanded="false">⚙</button>'+
      '<div class="nxo-quick-settings-menu" id="nxo-quick-settings-menu">'+
        '<div class="nxo-quick-settings-title">'+esc(ui('Ajustes rápidos','Quick settings'))+'</div>'+
        '<button type="button" id="nxo-language-toggle" class="nxo-quick-setting-row"><span>'+esc(ui('Idioma','Language'))+'</span><strong>'+esc(lang==='en'?'EN':'ES')+'</strong></button>'+
        '<button type="button" id="nxo-theme-toggle" class="nxo-quick-setting-row"><span>'+esc(ui('Apariencia','Appearance'))+'</span><strong>'+esc(theme==='night'?ui('Oscuro','Dark'):ui('Claro','Light'))+'</strong></button>'+
      '</div>'+
    '</div>';

  return '<header class="nxo-topbar nxo-workspace-nav">'+
    '<div class="nxo-nav-brand" id="nxo-nav-home"><span class="nxo-nav-mark"><img src="'+esc(NEXO_LOGO)+'" alt="Nexo Group"></span><span class="nxo-nav-brand-copy"><strong>Nexo Group</strong><small>'+esc(contextLabel)+'</small></span></div>'+
    '<div class="nxo-nav-collapse" id="nxo-nav-collapse">'+
      '<nav class="nxo-nav-links" aria-label="'+esc(ui('Navegación principal','Main navigation'))+'">'+
        '<button type="button" class="nxo-nav-link '+(!isWorkspace?'active':'')+'" id="nxo-personal" '+(!isWorkspace?'aria-current="page"':'')+'>'+esc(ui('Mi espacio','My space'))+'</button>'+
        (isWorkspace?'<button type="button" class="nxo-nav-link active" aria-current="page">'+esc(wsName)+'</button>':'')+
        '<button type="button" class="nxo-nav-link" id="nxo-nav-development">'+esc(ui('Centro de desarrollo','Development Center'))+'</button>'+
        (canTools?'<button type="button" class="nxo-nav-link nxo-mobile-settings-link" id="nxo-mobile-workspace-settings">'+esc(ui('Configuración','Settings'))+'</button>':'')+
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
        '<button type="button" data-account-action="settings">'+esc(ui('Ajustes de perfil','Profile settings'))+'</button>'+
        '<button type="button" data-account-action="switch">'+esc(ui('Cambiar cuenta','Switch account'))+'</button>'+
        '<button type="button" class="danger" data-account-action="logout">'+esc(ui('Cerrar sesión','Sign out'))+'</button>'+
      '</div>'+
      '<input type="file" id="nxo-profile-photo-input" class="nxo-profile-photo-input" accept="image/png,image/jpeg,image/webp" hidden>'+
    '</div>'+
    '<button type="button" class="nxo-mobile-menu-button" id="nxo-mobile-menu-button" aria-label="'+esc(ui('Abrir menú','Open menu'))+'" aria-expanded="false" aria-controls="nxo-nav-collapse"><span></span><span></span><span></span></button>'+
    workspaceQuickActions+
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
      quickSettingsMenu?.classList.remove('open');
      quickSettingsButton?.setAttribute('aria-expanded','false');
      quickSettingsMenu?.classList.remove('open');
      quickSettingsButton?.setAttribute('aria-expanded','false');
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
    });
  }

  if(account&&menu){
    account.addEventListener('click',e=>{
      e.stopPropagation();
      const open=menu.classList.toggle('open');
      account.setAttribute('aria-expanded',open?'true':'false');
      bellMenu?.classList.remove('open');
      bell?.setAttribute('aria-expanded','false');
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
    if(file)uploadProfilePhoto(file,isWorkspace);
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

function toolCard(t){const route=toolLaunchUrl(t),usable=!!route&&t.status!=='PLANNED',name=t.workspaceName||t.nameEs||t.nameEn||t.toolKey,description=t.workspaceDescription||t.descriptionEs||'';return '<article class="nxo-card '+(usable?'clickable':'')+'" '+(usable?'data-tool="'+esc(route)+'"':'')+'><div class="nxo-card-top"><div class="nxo-tool-icon">'+esc(t.icon||'◈')+'</div><span class="nxo-status '+esc(t.status||'')+'">'+esc(statusText(t.status))+'</span></div><h4>'+esc(name)+'</h4><p>'+esc(description)+'</p><div class="nxo-card-footer"><span class="nxo-role">'+(usable?ui('Abrir herramienta','Open tool'):ui('Aún no disponible','Not available yet'))+'</span><span>›</span></div></article>'}

function workspaceCard(w,archived=false){
  const logo=mediaUrl(w.logoImage);
  const manageable=w.canManageWorkspace===true;
  const menu=manageable
    ?'<div class="nxo-workspace-actions">'+
       '<button type="button" class="nxo-workspace-menu-button" data-workspace-menu="'+esc(w.workspaceId)+'" aria-label="Opciones del Workspace" aria-expanded="false">☰</button>'+
       '<div class="nxo-workspace-menu" data-workspace-menu-panel="'+esc(w.workspaceId)+'">'+
         (archived
           ?'<button type="button" data-workspace-action="restore" data-workspace-id="'+esc(w.workspaceId)+'">Restaurar</button>'
           :'<button type="button" data-workspace-action="duplicate" data-workspace-id="'+esc(w.workspaceId)+'">Duplicar</button>'+
            '<button type="button" data-workspace-action="archive" data-workspace-id="'+esc(w.workspaceId)+'">Archivar</button>')+
         (w.isOwner?'<button type="button" class="danger" data-workspace-action="delete" data-workspace-id="'+esc(w.workspaceId)+'">Eliminar</button>':'')+
       '</div>'+
     '</div>'
    :'';
  return '<article class="nxo-card nxo-workspace-card '+(archived?'archived':'clickable')+'" '+(!archived?'data-workspace="'+esc(w.workspaceId)+'"':'')+'>'+
    '<div class="nxo-card-top"><div class="nxo-workspace-logo">'+
      (logo?'<img src="'+esc(logo)+'" alt="'+esc((w.name||'Workspace')+' logo')+'">':'<span>⌂</span>')+
    '</div><div class="nxo-workspace-card-tools"><span class="nxo-status '+(archived?'ARCHIVED':'ACTIVE')+'">'+(archived?'Archivado':'Activo')+'</span>'+menu+'</div></div>'+
    '<h4>'+esc(w.name)+'</h4>'+
    '<p>'+esc(w.description||'Espacio de trabajo Nexo')+'</p>'+
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
    if(e.target.closest('[data-workspace-menu],[data-workspace-menu-panel]'))return;
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
  })
}

async function workspaceCardAction(workspaceId,action){
  const item=(personal?.workspaces||[]).find(x=>x.workspaceId===workspaceId);
  const name=item?.name||'este Workspace';
  try{
    if(action==='duplicate'){
      if(!confirm('¿Duplicar '+name+'? Se copiarán nombre, descripción, logo y configuración de herramientas. No se copiarán miembros ni datos operativos.'))return;
      loading('Duplicando Workspace…');
      const result=await api('workspace.duplicate',{workspaceId});
      personal=result?.personal||await api('personal.refresh');
      toast('Workspace duplicado');
      renderPersonal();
      return
    }
    if(action==='archive'){
      if(!confirm('¿Archivar '+name+'? Podrás restaurarlo después desde Mi espacio.'))return;
      loading('Archivando Workspace…');
      personal=await api('workspace.archive',{workspaceId});
      toast('Workspace archivado');
      renderPersonal();
      return
    }
    if(action==='restore'){
      loading('Restaurando Workspace…');
      personal=await api('workspace.restore',{workspaceId});
      toast('Workspace restaurado');
      renderPersonal();
      return
    }
    if(action==='delete'){
      if(!confirm('¿Eliminar '+name+'? Se ocultará y desactivará el Workspace. Sus datos no se borrarán en cascada.'))return;
      loading('Eliminando Workspace…');
      personal=await api('workspace.delete',{workspaceId});
      toast('Workspace eliminado');
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
      loading('Uniéndote al Workspace…');
      workspace=await api('workspace.join.link',{token:inviteToken});
      const u=new URL(location.href);
      u.searchParams.delete('nxoJoin');
      if(workspace?.workspace?.id)u.searchParams.set('nxoWorkspace',workspace.workspace.id);
      history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
      workspaceTab='tools';
      renderWorkspace();
      toast(workspace?.alreadyMember?'Workspace abierto':'Te uniste a '+(workspace?.workspace?.name||'Workspace'));
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
function renderPersonal(){workspace=null;workspaceMembers=null;workspaceRoles=null;workspaceToolConfig=null;workspaceRecipeComments=null;workspacePendingNotes=null;const tools=personal?.tools||[],spaces=personal?.workspaces||[],activeSpaces=spaces.filter(w=>String(w.status||'ACTIVE').toUpperCase()!=='ARCHIVED'),archivedSpaces=spaces.filter(w=>String(w.status||'').toUpperCase()==='ARCHIVED'),inv=personal?.invitations||[];let welcomeHidden=false;try{welcomeHidden=localStorage.getItem('nexoWelcomeDismissed:v1')==='1'}catch(_){}
const welcome=welcomeHidden?'':'<section class="nxo-welcome"><button id="nxo-dismiss-welcome" class="nxo-welcome-close" aria-label="Cerrar">✕</button><div class="nxo-eyebrow">Mi espacio</div><h2>Hola, '+esc(personal?.profile?.displayName||'Usuario Nexo')+'</h2><p>Desde aquí administras tus herramientas personales y entras a los Workspaces donde colaboras. Puedes cerrar este mensaje cuando ya no lo necesites.</p></section>';
const summary='<section class="nxo-summary-strip"><div class="nxo-summary-item"><strong>'+tools.length+'</strong><span>Mis herramientas</span></div><div class="nxo-summary-item"><strong>'+spaces.length+'</strong><span>Workspaces</span></div><div class="nxo-summary-item"><strong>'+inv.length+'</strong><span>Invitaciones</span></div><div class="nxo-summary-item"><strong>●</strong><span>Cuenta activa</span></div></section>';
const legacyInvites=inv.length?'<section class="nxo-section"><div class="nxo-section-head"><div><h3>Invitaciones pendientes</h3><p>Invitaciones heredadas asociadas directamente a tu cuenta.</p></div></div>'+inv.map(i=>'<div class="nxo-invite"><div><strong>'+esc(i.workspaceName)+'</strong><p>Rol: '+esc(roleName(i.roleKey,i.role))+'</p></div><div class="nxo-invite-actions"><button class="nxo-btn" data-invite-decline="'+esc(i.id)+'">Rechazar</button><button class="nxo-btn nxo-btn-gold" data-invite-accept="'+esc(i.id)+'">Aceptar</button></div></div>').join('')+'</section>':'';
const explore='<article class="nxo-card clickable nxo-explore-card" data-tool="'+esc(centerDevelopmentUrl())+'"><div class="nxo-card-top"><div class="nxo-tool-icon">＋</div><span class="nxo-status ACTIVE">Catálogo</span></div><h4>Explorar más herramientas</h4><p>Abre el Centro de desarrollo para conocer todas las herramientas activas de Nexo y, más adelante, probarlas o añadirlas mediante un plan.</p><div class="nxo-card-footer"><span class="nxo-role">Centro de desarrollo</span><span>›</span></div></article>';
const personalTools='<section class="nxo-section"><div class="nxo-section-head"><div><h3>Mis herramientas</h3><p>Aquí aparecen únicamente las herramientas disponibles para tu cuenta.</p></div></div><div class="nxo-grid">'+tools.map(toolCard).join('')+explore+'</div></section>';
const workspaceCards='<section class="nxo-section"><div class="nxo-section-head nxo-workspace-list-head"><div><h3>Mis Workspaces</h3><p>Espacios que creaste o a los que te uniste.</p></div><div class="nxo-section-actions nxo-workspace-desktop-actions"><button id="nxo-join-workspace" class="nxo-btn">Unirse a un Workspace</button><button id="nxo-create-workspace" class="nxo-btn nxo-btn-gold">Nuevo Workspace</button></div></div>'+(activeSpaces.length?'<div class="nxo-grid">'+activeSpaces.map(w=>workspaceCard(w,false)).join('')+'</div>':'<div class="nxo-empty">No tienes Workspaces activos.</div>')+'</section>';
const archivedCards=archivedSpaces.length?'<section class="nxo-section nxo-archived-section"><div class="nxo-section-head"><div><h3>Archivados</h3><p>Workspaces guardados fuera de la vista activa. Puedes restaurarlos cuando quieras.</p></div><span class="nxo-chip">'+archivedSpaces.length+'</span></div><div class="nxo-grid">'+archivedSpaces.map(w=>workspaceCard(w,true)).join('')+'</div></section>':'';

html('<div class="nxo-shell">'+topbar('personal')+'<main class="nxo-main">'+welcome+summary+legacyInvites+personalTools+workspaceCards+archivedCards+'</main></div>');bindTopbar('personal');bindTools();bindWorkspaceCards();document.getElementById('nxo-create-workspace')?.addEventListener('click',createWorkspaceModal);document.getElementById('nxo-join-workspace')?.addEventListener('click',joinWorkspaceModal);document.getElementById('nxo-create-workspace-mobile')?.addEventListener('click',createWorkspaceModal);document.getElementById('nxo-join-workspace-mobile')?.addEventListener('click',joinWorkspaceModal);document.getElementById('nxo-dismiss-welcome')?.addEventListener('click',()=>{try{localStorage.setItem('nexoWelcomeDismissed:v1','1')}catch(_){}renderPersonal()});document.querySelectorAll('[data-invite-accept]').forEach(b=>b.onclick=()=>respondInvite(b.dataset.inviteAccept,'accept'));document.querySelectorAll('[data-invite-decline]').forEach(b=>b.onclick=()=>respondInvite(b.dataset.inviteDecline,'decline'))};setTimeout(()=>document.addEventListener('click',()=>closeWorkspaceMenus(),{once:true}),0)
async function refreshPersonal(){personal=await api('personal.refresh');renderPersonal()}
async function respondInvite(id,decision){try{loading(decision==='accept'?'Aceptando invitación…':'Actualizando invitación…');personal=await api('invitation.respond',{invitationId:id,decision});toast(decision==='accept'?'Invitación aceptada':'Invitación rechazada');renderPersonal()}catch(e){errorView(e)}}
function modal(title,body,onReady){const o=document.createElement('div');o.className='nxo-overlay';o.innerHTML='<div class="nxo-modal"><div class="nxo-modal-head"><strong>'+esc(title)+'</strong><button class="nxo-btn" data-close>✕</button></div><div class="nxo-modal-body">'+body+'</div></div>';document.body.appendChild(o);o.querySelector('[data-close]').onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()};if(onReady)onReady(o);return o}
function openProfileSettings(inWorkspace=false){
  const name=personal?.profile?.displayName||ui('Usuario Nexo','Nexo user');
  const workName=personal?.profile?.workName||name;
  const photo=String(personal?.profile?.photoImage?.url||'').trim();
  const locale=String(personal?.profile?.locale||'es').toLowerCase();
  const language=locale.startsWith('en')?'English':'Español';
  const role=inWorkspace?roleName(workspace?.membership?.roleKey,workspace?.role):ui('Cuenta personal','Personal account');
  const context=inWorkspace?(workspace?.workspace?.name||'Workspace'):ui('Mi espacio','My space');
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

function createWorkspaceModal(){modal('Crear Workspace','<div class="nxo-field"><label>Nombre</label><input id="nxo-ws-name" class="nxo-input" placeholder="Ej. Old Hickory"></div><div class="nxo-field"><label>Descripción</label><textarea id="nxo-ws-desc" class="nxo-textarea" placeholder="Describe el propósito de este espacio."></textarea></div><div class="nxo-modal-actions"><button class="nxo-btn nxo-btn-gold" id="nxo-ws-save">Crear Workspace</button></div>',o=>{o.querySelector('#nxo-ws-save').onclick=async()=>{const name=o.querySelector('#nxo-ws-name').value.trim(),description=o.querySelector('#nxo-ws-desc').value.trim();if(!name){toast('Escribe un nombre');return}try{o.remove();loading('Creando Workspace…');workspace=await api('workspace.create',{input:{name,description}});await openWorkspace(workspace.workspace.id,true)}catch(e){errorView(e)}}})}
function joinWorkspaceModal(){modal('Unirse a un Workspace','<div class="nxo-field"><label>Código de invitación</label><input id="nxo-join-code" class="nxo-input" placeholder="NEXO-ABCDE-12345" autocomplete="off" autocapitalize="characters"></div><p class="nxo-muted" style="margin:0;line-height:1.55">Pega el código que te compartió un administrador del Workspace. Los códigos son de un solo uso.</p><div class="nxo-modal-actions"><button id="nxo-join-submit" class="nxo-btn nxo-btn-gold">Unirme al Workspace</button></div>',o=>{const input=o.querySelector('#nxo-join-code'),button=o.querySelector('#nxo-join-submit');input?.focus();button.onclick=async()=>{const code=input.value.trim();if(!code){toast('Escribe el código de invitación');return}button.disabled=true;button.textContent='Validando…';try{workspace=await api('workspace.join.code',{code});o.remove();setWorkspaceReturnParam(workspace?.workspace?.id||'');workspaceTab='tools';toast('Te uniste a '+(workspace?.workspace?.name||'Workspace'));renderWorkspace()}catch(e){button.disabled=false;button.textContent='Unirme al Workspace';toast(e.message||String(e))}}})}
async function openWorkspace(id,alreadyOpen=false){try{loading('Abriendo Workspace…');workspace=alreadyOpen&&workspace?workspace:await api('workspace.open',{workspaceId:id});workspaceRecipeComments=null;workspacePendingNotes=null;setWorkspaceReturnParam(workspace?.workspace?.id||id);workspaceTab='tools';renderWorkspace()}catch(e){errorView(e)}}
async function returnPersonal(){try{loading('Volviendo a Mi espacio…');personal=await api('workspace.return');clearWorkspaceReturnParam();renderPersonal()}catch(e){errorView(e)}}
function renderWorkspace(){const ws=workspace?.workspace||{},role=workspace?.role||{},tools=workspace?.tools||[];const perms=role.permissions||[];const canMembers=workspace?.membership?.roleKey==='owner'||perms.some(x=>['members.view','members.manage','members.invite'].includes(x));const canTools=perms.includes('tools.configure');const canAdmin=workspace?.membership?.roleKey==='owner'||perms.some(x=>['workspace.manage','members.manage','tools.configure'].includes(x));const tabs=['<button class="nxo-tab '+(workspaceTab==='tools'?'active':'')+'" data-wtab="tools">Herramientas</button>'];if(canMembers)tabs.push('<button class="nxo-tab '+(workspaceTab==='members'?'active':'')+'" data-wtab="members">Miembros</button>');tabs.push('<button class="nxo-tab '+(workspaceTab==='access'?'active':'')+'" data-wtab="access">Mi acceso</button>');if(canTools)tabs.push('<button class="nxo-tab nxo-settings-tab '+(workspaceTab==='settings'?'active':'')+'" data-wtab="settings">'+esc(ui('Configuración','Settings'))+'</button>');let body='';if(workspaceTab==='tools')body=(canAdmin?renderPendingNotesShell():'')+renderWorkspaceTools(tools);else if(workspaceTab==='members')body='<div id="nxo-members-zone"><div class="nxo-empty">Cargando miembros…</div></div>';else if(workspaceTab==='settings')body='<div id="nxo-settings-zone"><div class="nxo-empty">Cargando configuración…</div></div>';else body=renderAccess(role);html('<div class="nxo-shell">'+topbar('workspace')+'<main class="nxo-main"><div class="nxo-workspace-header"><div><div class="nxo-eyebrow">Workspace</div><h2>'+esc(ws.name||'Workspace')+'</h2><p>'+esc(ws.description||'')+'</p></div></div><div class="nxo-tabs">'+tabs.join('')+'</div>'+body+'</main></div>');bindTopbar('workspace');document.querySelectorAll('[data-wtab]').forEach(b=>b.onclick=()=>{workspaceTab=b.dataset.wtab;renderWorkspace()});bindTools();if(workspaceTab==='tools'&&canAdmin)refreshWorkspaceAdminPanels();if(workspaceTab==='members')loadMembers();if(workspaceTab==='settings')loadWorkspaceSettings()}
function renderRecipeCommentNoticesShell(){return '<section class="nxo-section" style="margin-top:0"><div id="nxo-recipe-comment-notifications"><div class="nxo-section-head"><div><h3>Notificaciones</h3><p>Recomendaciones nuevas del equipo sobre las fichas técnicas.</p></div></div><div class="nxo-empty">Cargando avisos…</div></div></section>'}
function renderPendingNotesShell(){return '<section class="nxo-section"><div id="nxo-pending-notes"><div class="nxo-section-head"><div><h3>Pendientes</h3><p>Notas persistentes guardadas para revisar después.</p></div></div><div class="nxo-empty">Cargando pendientes…</div></div></section>'}
function nxoWhen(value){try{return value?new Date(value).toLocaleString('es-US',{dateStyle:'medium',timeStyle:'short'}):''}catch(_){return''}}
async function refreshWorkspaceAdminPanels(){await Promise.allSettled([loadWorkspaceRecipeComments(),loadWorkspacePendingNotes()])}
async function loadWorkspaceRecipeComments(){
  const zone=document.getElementById('nxo-recipe-comment-notifications');
  const badge=document.getElementById('nxo-notification-badge');
  if(!zone||!workspace?.workspace?.id)return;
  try{
    workspaceRecipeComments=await api('workspace.recipe-comments',{workspaceId:workspace.workspace.id});
    const rows=Array.isArray(workspaceRecipeComments?.comments)?workspaceRecipeComments.comments:[];
    const visible=rows.slice(0,12);

    if(badge){
      badge.textContent=String(rows.length);
      badge.hidden=rows.length===0;
    }

    zone.innerHTML=
      '<div class="nxo-notification-head"><div><strong>Notificaciones</strong><small>Recomendaciones pendientes</small></div><span class="nxo-notification-count">'+rows.length+'</span></div>'+
      (visible.length
        ?'<div class="nxo-notification-list">'+visible.map(r=>{
          const when=nxoWhen(r.commentedAt),working=r.status==='applying',failed=r.status==='change_failed';
          return '<article class="nxo-notification-item '+(r.unread?'nxo-notification-unread':'')+'" data-notification-id="'+esc(r.id)+'">'+
            '<div class="nxo-avatar">'+esc(initials(r.authorName))+'</div>'+
            '<div class="nxo-notification-copy"><strong>'+esc(r.recipeTitle||'Ficha técnica')+'</strong><span>'+esc(r.authorName||'Miembro Nexo')+'</span><p>'+esc(r.comment||'')+'</p>'+(when?'<small>'+esc(when)+'</small>':'')+(failed?'<em>La actualización anterior no se completó.</em>':'')+'</div>'+
            '<div class="nxo-notification-action">'+(working&&r.changeJobId?'<button class="nxo-btn" data-job-watch="'+esc(r.changeJobId)+'">Progreso</button>':'<button class="nxo-btn nxo-btn-gold" data-comment-review="'+esc(r.id)+'">Abrir</button>')+'</div>'+
          '</article>'
        }).join('')+'</div>'
        :'<div class="nxo-notification-empty">No hay recomendaciones nuevas por revisar.</div>');

    zone.querySelectorAll('[data-comment-review]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.commentReview;
      document.getElementById('nxo-notification-menu')?.classList.remove('open');
      const row=(workspaceRecipeComments?.comments||[]).find(x=>x.id===id);
      if(row?.unread){
        row.unread=false;
        zone.querySelector('[data-notification-id="'+CSS.escape(id)+'"]')?.classList.remove('nxo-notification-unread');
        api('comment.seen',{commentId:id}).catch(()=>{row.unread=true});
      }
      openRecipeRecommendation(id);
    });
    zone.querySelectorAll('[data-job-watch]').forEach(b=>b.onclick=()=>{
      document.getElementById('nxo-notification-menu')?.classList.remove('open');
      watchRecipeChange(b.dataset.jobWatch);
    });
  }catch(e){
    if(badge)badge.hidden=true;
    zone.innerHTML='<div class="nxo-notification-head"><strong>Notificaciones</strong></div><div class="nxo-notification-empty">'+esc(e.message||e)+'</div>';
  }
}
async function loadWorkspacePendingNotes(){
  const zone=document.getElementById('nxo-pending-notes');
  if(!zone||!workspace?.workspace?.id)return;
  try{
    workspacePendingNotes=await api('workspace.pending-notes',{workspaceId:workspace.workspace.id});
    const rows=Array.isArray(workspacePendingNotes?.notes)?workspacePendingNotes.notes:[];
    const validStyles=new Set(['yellow','peach','blue','mint']);
    const noteBoard=rows.length
      ?'<div class="nxo-note-board">'+rows.map(r=>{
        const style=validStyles.has(String(r.styleKey||''))?String(r.styleKey):'yellow';
        return '<button type="button" class="nxo-pinned-note style-'+esc(style)+'" data-pending-note="'+esc(r.id)+'">'+
          '<span class="nxo-note-pin" aria-hidden="true"></span>'+
          '<span class="nxo-note-label">PENDIENTE</span>'+
          '<strong>'+esc(r.title||'Pendiente')+'</strong>'+
        '</button>'
      }).join('')+'</div>'
      :'<div class="nxo-empty nxo-pending-empty">No hay notas pendientes.</div>';
    zone.innerHTML=
      '<div class="nxo-section-head">'+
        '<div><div class="nxo-pending-title-row"><h3>Pendientes</h3><span class="nxo-chip nxo-pending-count">'+rows.length+'</span></div><p>Notas que permanecen en el Workspace hasta resolverlas.</p></div>'+
      '</div>'+
      '<div class="nxo-pending-board-layout">'+
        noteBoard+
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
function renderWorkspaceTools(tools){return '<section class="nxo-section"><div class="nxo-section-head"><div><h3>Herramientas del Workspace</h3><p>Estas herramientas trabajan con el contexto y los datos de '+esc(workspace?.workspace?.name||'este Workspace')+'.</p></div></div>'+(tools.length?'<div class="nxo-grid">'+tools.map(toolCard).join('')+'</div>':'<div class="nxo-empty">No hay herramientas habilitadas para este Workspace.</div>')+'</section>'}
function renderAccess(role){const perms=role?.permissions||[],roleKey=String(workspace?.membership?.roleKey||'viewer').toLowerCase();return '<div class="nxo-panel" style="padding:18px"><div class="nxo-section-head"><div><h3>Tu acceso en este Workspace</h3><p>Los permisos se aplican en backend, no solo en la interfaz.</p></div></div><div class="nxo-role-badge" data-role="'+esc(roleKey)+'">'+esc(roleName(roleKey,role))+'</div><div class="nxo-perms">'+(perms.length?perms.map(p=>'<span class="nxo-perm">'+esc(p)+'</span>').join(''):'<span class="nxo-muted">Sin permisos adicionales.</span>')+'</div></div>'}
async function loadMembers(){const zone=document.getElementById('nxo-members-zone');if(!zone)return;try{const wsid=workspace.workspace.id;workspaceMembers=await api('workspace.members',{workspaceId:wsid});const rolePerms=workspace?.role?.permissions||[];const canInvite=rolePerms.includes('members.invite')||rolePerms.includes('members.manage');const canAssign=rolePerms.includes('roles.assign');const canRemove=rolePerms.includes('members.remove')||rolePerms.includes('members.manage');if(canAssign||canInvite){try{workspaceRoles=await api('workspace.roles',{workspaceId:wsid})}catch(_){workspaceRoles=[]}}else workspaceRoles=[];zone.innerHTML='<div class="nxo-section-head"><div><h3>Miembros</h3><p>'+workspaceMembers.members.length+' miembro'+(workspaceMembers.members.length===1?'':'s')+' activo'+(workspaceMembers.members.length===1?'':'s')+'.</p></div>'+(canInvite?'<button id="nxo-invite-member" class="nxo-btn nxo-btn-gold">Invitar miembro</button>':'')+'</div><div class="nxo-member-list">'+workspaceMembers.members.map(m=>memberRow(m,canAssign,canRemove)).join('')+'</div>';document.getElementById('nxo-invite-member')?.addEventListener('click',inviteModal);document.querySelectorAll('[data-member-role]').forEach(sel=>sel.onchange=()=>changeRole(sel.dataset.memberRole,sel.value));document.querySelectorAll('[data-member-remove]').forEach(btn=>btn.onclick=()=>removeMember(btn.dataset.memberRemove))}catch(e){zone.innerHTML='<div class="nxo-empty">'+esc(e.message||e)+'</div>'}}
function memberRow(m,canAssign,canRemove){const actorRank=Number(workspaceMembers?.currentRole?.rank||workspace?.role?.rank||0),targetRank=Number(m.role?.rank||0),canAct=!m.isWorkspaceOwner&&targetRank<actorRank;const options=(workspaceRoles||[]).map(r=>'<option value="'+esc(r.roleKey)+'" '+(r.roleKey===m.roleKey?'selected':'')+'>'+esc(r.nameEs||r.roleKey)+'</option>').join('');return '<div class="nxo-member"><div class="nxo-member-left"><div class="nxo-avatar">'+esc(initials(m.displayName))+'</div><div style="min-width:0"><div class="nxo-member-name">'+esc(m.displayName)+'</div><div class="nxo-member-sub">'+esc(roleName(m.roleKey,m.role))+(m.isWorkspaceOwner?' · propietario del Workspace':'')+'</div></div></div><div class="nxo-member-actions">'+(canAct&&canAssign&&options?'<select class="nxo-select" style="width:auto;min-width:145px" data-member-role="'+esc(m.memberId)+'">'+options+'</select>':'<span class="nxo-role-badge" data-role="'+esc(String(m.roleKey||'viewer').toLowerCase())+'">'+esc(roleName(m.roleKey,m.role))+'</span>')+(canAct&&canRemove?'<button class="nxo-btn nxo-btn-danger" data-member-remove="'+esc(m.memberId)+'">Quitar</button>':'')+'</div></div>'}
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
  const title='Únete a '+(invite.workspaceName||'mi Workspace');
  const text='Únete al Workspace '+(invite.workspaceName||'de Nexo')+' desde este enlace.';
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
  wrapCanvasText(ctx,invite.workspaceName||'Workspace Nexo',600,360,980,58,2);
  ctx.fillStyle='#5b6780';
  ctx.font='700 30px Arial, sans-serif';
  ctx.fillText('Escanea para unirte al Workspace',600,480);

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
  ctx.fillText('Nexo Group · Invitación de Workspace',600,1415);

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

  modal('Invitar al Workspace',
    '<div class="nxo-invite-share">'+
      '<div class="nxo-invite-share-head">'+
        '<div class="nxo-invite-share-logo" id="nxo-invite-share-logo"></div>'+
        '<div><strong>'+esc(workspace?.workspace?.name||'Workspace')+'</strong><span>Invitación por QR y enlace</span></div>'+
      '</div>'+
      '<div class="nxo-field"><label>Rol que recibirán quienes entren con este QR</label><select id="nxo-invite-role" class="nxo-select">'+opts+'</select></div>'+
      '<div class="nxo-invite-qr-card">'+
        '<div id="nxo-invite-qr" class="nxo-invite-qr"><div class="nxo-qr-loading">Preparando invitación…</div></div>'+
        '<p>Escanea este QR para iniciar sesión o crear una cuenta y entrar automáticamente al Workspace.</p>'+
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
        logoZone.innerHTML=logo?'<img src="'+esc(logo)+'" alt="'+esc((invite.workspaceName||'Workspace')+' logo')+'">':'<span>⌂</span>';
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
async function removeMember(memberId){if(!confirm('¿Quitar a este miembro del Workspace?'))return;try{await api('workspace.remove',{workspaceId:workspace.workspace.id,targetMemberId:memberId});toast('Miembro removido');await loadMembers()}catch(e){toast(e.message||String(e))}}
async function loadWorkspaceSettings(){
  const zone=document.getElementById('nxo-settings-zone');
  if(!zone)return;
  try{
    workspaceToolConfig=await api('workspace.tools',{workspaceId:workspace.workspace.id});
    const ws=workspace.workspace||{},logo=mediaUrl(ws.logoImage);
    zone.innerHTML=
      '<div class="nxo-panel" style="padding:18px;margin-bottom:14px">'+
        '<div class="nxo-section-head"><div><h3>Información del Workspace</h3><p>Nombre, descripción y logo visibles para sus miembros.</p></div></div>'+
        '<div class="nxo-workspace-logo-settings"><div class="nxo-workspace-logo-preview">'+(logo?'<img src="'+esc(logo)+'" alt="'+esc((ws.name||'Workspace')+' logo')+'">':'<span>⌂</span>')+'</div><div class="nxo-workspace-logo-copy"><strong>Logo del Workspace</strong><p>PNG, JPG, WEBP o SVG · máximo 8 MB.</p><input id="nxo-workspace-logo-file" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden><button id="nxo-workspace-logo-change" class="nxo-btn" type="button">'+(logo?'Cambiar logo':'Subir logo')+'</button></div></div>'+
        '<div class="nxo-field"><label>Nombre</label><input id="nxo-settings-name" class="nxo-input" value="'+esc(ws.name||'')+'"></div>'+
        '<div class="nxo-field"><label>Descripción</label><textarea id="nxo-settings-desc" class="nxo-textarea">'+esc(ws.description||'')+'</textarea></div>'+
        '<div class="nxo-modal-actions"><button id="nxo-settings-save" class="nxo-btn nxo-btn-gold">Guardar cambios</button></div>'+
      '</div>'+
      '<div class="nxo-panel" style="padding:18px">'+
        '<div class="nxo-section-head"><div><h3>Herramientas del Workspace</h3><p>Activa herramientas, personaliza cómo se presentan y decide quién puede verlas.</p></div></div>'+
        '<div class="nxo-tool-config">'+workspaceToolConfig.tools.map(t=>{
          const mode=t.accessMode==='restricted'?'Restringido · '+(t.allowedMemberIds||[]).length+' miembro'+((t.allowedMemberIds||[]).length===1?'':'s'):'Todo el Workspace';
          const displayName=t.customName||t.nameEs||t.toolKey;
          const displayDescription=t.customDescription||t.descriptionEs||'';
          return '<div class="nxo-tool-toggle">'+
            '<div><h4>'+esc(displayName)+'</h4><p>'+esc(displayDescription)+' · '+esc(statusText(t.status))+'</p><div class="nxo-access-summary">'+esc(mode)+'</div></div>'+
            '<div class="nxo-tool-actions">'+
              '<button class="nxo-btn" data-tool-identity="'+esc(t.toolKey)+'">Personalizar</button>'+
              '<button class="nxo-btn" data-tool-access="'+esc(t.toolKey)+'" '+(t.enabled?'':'disabled')+'>Parámetros de acceso</button>'+
              '<div class="nxo-switch '+(t.enabled?'on':'')+'" data-tool-toggle="'+esc(t.toolKey)+'" data-enabled="'+(t.enabled?'1':'0')+'"><span></span></div>'+
            '</div>'+
          '</div>'
        }).join('')+'</div>'+
      '</div>';
    document.getElementById('nxo-settings-save')?.addEventListener('click',saveWorkspaceSettings);
    const logoInput=document.getElementById('nxo-workspace-logo-file');
    document.getElementById('nxo-workspace-logo-change')?.addEventListener('click',()=>logoInput?.click());
    logoInput?.addEventListener('change',()=>{const file=logoInput.files?.[0];if(file)uploadWorkspaceLogo(file)});
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
    '<div class="nxo-field"><label>Nombre en este Workspace</label><input id="nxo-tool-custom-name" class="nxo-input" maxlength="120" value="'+esc(tool.customName||'')+'" placeholder="'+esc(baseName)+'"></div>'+
    '<div class="nxo-field"><label>Descripción general</label><textarea id="nxo-tool-custom-description" class="nxo-textarea" maxlength="600" placeholder="'+esc(baseDescription)+'">'+esc(tool.customDescription||'')+'</textarea></div>'+
    '<p class="nxo-muted" style="line-height:1.5">Si dejas un campo vacío, Nexo utilizará el nombre o descripción original de la herramienta. Este cambio solo afecta a este Workspace.</p>'+
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

async function toolAccessModal(toolKey){const tool=(workspaceToolConfig?.tools||[]).find(t=>t.toolKey===toolKey);if(!tool)return;try{if(!workspaceMembers)workspaceMembers=await api('workspace.members',{workspaceId:workspace.workspace.id});const current=new Set(tool.allowedMemberIds||[]);const members=workspaceMembers?.members||[];modal('Parámetros de acceso · '+(tool.nameEs||tool.toolKey),'<div class="nxo-field"><label>Disponibilidad</label><select id="nxo-access-mode" class="nxo-select"><option value="workspace" '+(tool.accessMode!=='restricted'?'selected':'')+'>Todo el Workspace</option><option value="restricted" '+(tool.accessMode==='restricted'?'selected':'')+'>Solo miembros seleccionados</option></select></div><div id="nxo-access-members" class="nxo-access-list">'+members.map(m=>'<label class="nxo-check"><input type="checkbox" value="'+esc(m.memberId)+'" '+(current.has(m.memberId)?'checked':'')+'><span><strong>'+esc(m.displayName)+'</strong><small>'+esc(roleName(m.roleKey,m.role))+'</small></span></label>').join('')+'</div><p class="nxo-muted" style="line-height:1.5;margin:10px 0 0">Los administradores con permiso de configurar herramientas conservan visibilidad para poder administrarlas.</p><div class="nxo-modal-actions"><button id="nxo-access-save" class="nxo-btn nxo-btn-gold">Guardar acceso</button></div>',o=>{const select=o.querySelector('#nxo-access-mode'),list=o.querySelector('#nxo-access-members'),save=o.querySelector('#nxo-access-save');const sync=()=>{list.style.display=select.value==='restricted'?'grid':'none'};select.onchange=sync;sync();save.onclick=async()=>{const mode=select.value;const allowed=mode==='restricted'?[...o.querySelectorAll('#nxo-access-members input:checked')].map(x=>x.value):[];if(mode==='restricted'&&!allowed.length){toast('Selecciona al menos un miembro');return}save.disabled=true;try{await api('workspace.tool.access',{workspaceId:workspace.workspace.id,toolKey,input:{accessMode:mode,allowedMemberIds:allowed}});o.remove();toast('Acceso actualizado');workspace=await api('workspace.open',{workspaceId:workspace.workspace.id});await loadWorkspaceSettings()}catch(e){save.disabled=false;toast(e.message||String(e))}}})}catch(e){toast(e.message||String(e))}}
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
async function uploadWorkspaceLogo(file){
  if(!file||!workspace?.workspace?.id)return;
  const button=document.getElementById('nxo-workspace-logo-change');
  const allowed=['image/png','image/jpeg','image/webp','image/svg+xml'];
  if(!allowed.includes(String(file.type||'').toLowerCase())){toast('El logo debe ser PNG, JPG, WEBP o SVG');return}
  if(file.size>8*1024*1024){toast('El logo supera el límite de 8 MB');return}
  const oldText=button?.textContent||'Subir logo';
  if(button){button.disabled=true;button.textContent='Subiendo…'}
  try{
    const ticket=await api('workspace.logo.upload-url',{
      workspaceId:workspace.workspace.id,
      input:{fileName:file.name||'workspace-logo.png',mimeType:file.type||'image/png',sizeInBytes:file.size}
    });
    const uploadUrl=String(ticket?.uploadUrl||'');
    if(!uploadUrl)throw new Error('Wix no pudo preparar la subida del logo');
    const response=await fetch(uploadUrl,{method:'PUT',headers:{'Content-Type':file.type||'image/png'},body:file});
    let body={};try{body=await response.json()}catch(_){}
    if(!response.ok)throw new Error(String(body?.message||body?.error||('UPLOAD_HTTP_'+response.status)));
    const fileId=String(body?.file?.id||body?.file?._id||body?.id||body?._id||'');
    if(!fileId)throw new Error('Wix no devolvió el ID del logo');
    workspace=await api('workspace.logo.commit',{workspaceId:workspace.workspace.id,input:{fileId}});
    personal=await api('personal.refresh');
    toast('Logo del Workspace actualizado');
    renderWorkspace();
  }catch(e){
    if(button){button.disabled=false;button.textContent=oldText}
    toast(e.message||String(e))
  }
}
async function saveWorkspaceSettings(){const name=document.getElementById('nxo-settings-name')?.value.trim()||'',description=document.getElementById('nxo-settings-desc')?.value.trim()||'';if(!name){toast('El nombre es obligatorio');return}try{workspace=await api('workspace.update',{workspaceId:workspace.workspace.id,input:{name,description}});toast('Workspace actualizado');renderWorkspace()}catch(e){toast(e.message||String(e))}}
async function toggleTool(toolKey,enabled){try{await api('workspace.tool.set',{workspaceId:workspace.workspace.id,toolKey,enabled});toast(enabled?'Herramienta habilitada':'Herramienta deshabilitada');workspace=await api('workspace.open',{workspaceId:workspace.workspace.id});await loadWorkspaceSettings()}catch(e){toast(e.message||String(e))}}
start().catch(errorView);
})();
