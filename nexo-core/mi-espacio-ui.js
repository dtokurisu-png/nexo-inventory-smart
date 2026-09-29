(function(){
if(window.__nexoMiEspacioApp)return;window.__nexoMiEspacioApp=true;
const CSS='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/mi-espacio-ui.css?v=workspace-nexo-organic-20260929-10';
const ACCESS_REVISION='workspace-access-20260927-3';
const freeSite=/\.(wixstudio|wixsite)\.com$/i.test(location.hostname);
const apiBase=freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'';
const API=apiBase+'/_functions/nexoMiEspacioUi';
let accessStage='WAITING_PAGE';
function accessError(code){return new Error('No se pudo completar el acceso ('+ACCESS_REVISION+' / '+accessStage+' / '+code+'). Reintenta.')}
function loginVisible(visible){const r=document.getElementById('nxo-app');if(r)r.style.display=visible?'none':'';document.body.classList.toggle('nxo-lock',!visible)}
function retryAccess(){const u=new URL(location.href);['nxm','nxme','nxms','nxav'].forEach(k=>u.searchParams.delete(k));location.replace(u.href)}
let sessionToken='',personal=null,workspace=null,workspaceTab='tools',workspaceMembers=null,workspaceRoles=null,workspaceToolConfig=null,workspaceRecipeComments=null,workspacePendingNotes=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const initials=v=>String(v||'N').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'N';
function addCss(){if(document.getElementById('nxo-css'))return;const l=document.createElement('link');l.id='nxo-css';l.rel='stylesheet';l.href=CSS;document.head.appendChild(l)}
function root(){addCss();document.body.classList.add('nxo-lock');let r=document.getElementById('nxo-app');if(!r){r=document.createElement('div');r.id='nxo-app';r.className='nxo-app';document.body.appendChild(r)}return r}
let nxoOrganicRaf=0,nxoOrganicResize=null,nxoOrganicStarted=false;
function ensureOrganicLayers(){
  const r=root();
  let c=r.querySelector('#nxo-organic-canvas');
  let layer=r.querySelector('#nxo-content-layer');
  if(!c){
    c=document.createElement('canvas');
    c.id='nxo-organic-canvas';
    c.setAttribute('aria-hidden','true');
    r.prepend(c);
  }
  if(!layer){
    layer=document.createElement('div');
    layer.id='nxo-content-layer';
    layer.className='nxo-content-layer';
    r.appendChild(layer);
  }
  return {r,c,layer};
}
function mountNexoOrganicBackground(){
  if(nxoOrganicStarted)return;
  nxoOrganicStarted=true;

  const {c}=ensureOrganicLayers();
  const ctx=c.getContext('2d');
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr=Math.min(window.devicePixelRatio||1,1.5);

  let W=0,H=0,lastW=0,lastH=0;
  let nodeSeq=0,lastSpawn=0,nextSpawnDelay=520,lastCull=0,nextCullDelay=1500,coreCullAt=0,coreCulled=false;
  const startAt=performance.now();
  const nodes=[];
  const links=[];
  const pulses=[];
  const coreColors=['47,79,147','248,143,91','36,107,54'];

  const rand=(a,b)=>Math.random()*(b-a)+a;
  const randInt=(a,b)=>Math.floor(rand(a,b+1));
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ease=t=>1-Math.pow(1-t,3);
  const smooth=t=>t*t*(3-2*t);

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

  function addNode(x,y,r,color,parent=null,time=performance.now()){
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
      r,baseR:r,color,parent,
      branchCap:randInt(6,10),
      born:time,
      moveStart:time,
      moveDuration:1,
      moving:false,
      settled:true,
      phase:rand(0,Math.PI*2),
      pulseSpeed:rand(.00115,.00255),
      scaleAmp:rand(.025,.075),
      alphaBase:rand(.68,.96),
      alphaAmp:rand(.04,.16),
      auraGain:rand(.78,1.24),
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
      energyColor:pick(coreColors),
      filamentAlpha:rand(.72,1),
      midWidth:rand(.75,1.35),
      nextPulseAt:time+rand(500,1500),
      minPulseGap:rand(680,1450),
      maxPulseGap:rand(1500,3150),
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
      duration:rand(1250,3650),
      color:Math.random()<.58?link.energyColor:pick(coreColors),
      size:rand(2.4,5.5),
      alpha:rand(.36,.56),
      back:rand(.15,.31),
      front:rand(.055,.145),
      halo:rand(15,29),
      direction:Math.random()<.80?1:-1,
      dead:false
    });
    if(pulses.length>120)pulses.splice(0,pulses.length-120);
  }

  function spawn(time){
    if(reduce)return false;

    const topology=networkTopology();
    const target=W<700?34:50;
    const repairMax=W<700?48:66;
    const repairing=topology.needsRepair;

    if(topology.aliveCount>=target&&!repairing)return false;
    if(repairing&&topology.aliveCount>=repairMax)return false;

    const candidates=nodes.filter(n=>
      n.settled&&n.state==='active'&&nodeDegree(n.id)<n.branchCap
    );
    if(!candidates.length)return false;

    const repairCandidates=candidates.filter(n=>
      topology.smallIds.has(n.id)||nodeDegree(n.id)<=1
    );
    const lowDegree=candidates.filter(n=>
      nodeDegree(n.id)<=Math.max(2,Math.floor(n.branchCap*.55))
    );
    const pool=repairing&&repairCandidates.length
      ?repairCandidates
      :(lowDegree.length?lowDegree:candidates);

    const attempts=repairing?52:36;
    for(let attempt=0;attempt<attempts;attempt++){
      const source=pick(attempt<Math.floor(attempts*.72)?pool:candidates);
      if(!source)continue;

      const sourceRepair=repairing&&(topology.smallIds.has(source.id)||nodeDegree(source.id)<=1);
      const radius=rand(W<700?10:12,W<700?19:24);
      const targetPoint=targetFor(source,radius,sourceRepair);
      if(!targetPoint)continue;

      const child=addNode(source.x,source.y,radius,pick(coreColors),source.id,time);
      child.sx=source.x;child.sy=source.y;
      child.tx=targetPoint.x;child.ty=targetPoint.y;
      child.anchorX=targetPoint.x;child.anchorY=targetPoint.y;
      child.driftFromX=targetPoint.x;child.driftFromY=targetPoint.y;
      child.driftToX=targetPoint.x;child.driftToY=targetPoint.y;
      child.moveStart=time;
      child.moveDuration=rand(1100,2200);
      child.moving=true;
      child.settled=false;
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

  function markNodeForFade(time,forceCore=false){
    const alive=nodes.filter(n=>
      n.state==='active'&&!n.moving&&time-n.born>8500
    );
    if(!alive.length)return false;

    if(forceCore){
      const core=alive.find(n=>n.id===1);
      if(core)return fadeNode(core,time);
      return false;
    }

    if(alive.length<(W<700?18:28))return false;

    const topology=networkTopology();
    let eligible=alive.filter(n=>(topology.componentSize.get(n.id)||1)>2);
    if(!eligible.length)return false;

    const structurallySafe=eligible.filter(n=>!removalCreatesTinyFragment(n.id));
    if(structurallySafe.length)eligible=structurallySafe;

    const leaves=eligible.filter(n=>nodeDegree(n.id)<=1);
    const internal=eligible.filter(n=>nodeDegree(n.id)>=2);
    let n;

    if(internal.length&&Math.random()<.24)n=pick(internal);
    else if(leaves.length)n=pick(leaves);
    else n=pick(eligible);

    return fadeNode(n,time);
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
    nodes.length=0;links.length=0;pulses.length=0;nodeSeq=0;
    const first=addNode(W/2,H/2,W<700?24:32,'47,79,147',null,performance.now());
    first.born=performance.now()+200;
    first.alphaBase=rand(.68,.96);
    first.alphaAmp=rand(.04,.16);
    first.scaleAmp=.045;
    first.pulseSpeed=.00155;
    first.branchCap=randInt(7,11);
    coreCullAt=performance.now()+rand(13000,18000);
    coreCulled=false;
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
    const baseAlpha=clamp(n.alphaBase+n.alphaAmp*wave,.58,.99);
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
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#182341');
    g.addColorStop(.5,'#11192f');
    g.addColorStop(1,'#0b1122');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,W,H);

    const center=ctx.createRadialGradient(W*.5,H*.46,0,W*.5,H*.46,Math.max(W,H)*.52);
    center.addColorStop(0,'rgba(47,79,147,.17)');
    center.addColorStop(.44,'rgba(38,76,143,.065)');
    center.addColorStop(1,'rgba(10,16,37,0)');
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
    if(l.dyingAt&&!l.dead)l.dyingAt=0;
    if(!a||!b||a.state==='dead'||b.state==='dead'){l.dead=true;return;}

    const va=nodeVisualState(a,time);
    const vb=nodeVisualState(b,time);
    const linkLife=Math.min(va.life,vb.life);
    const linkLen=Math.hypot(b.x-a.x,b.y-a.y);
    l.active=b.moving?vb.growth:1;
    if(linkLen<.75||(va.life<=.001&&vb.life<=.001))return;

    const endA=va.rr*2;
    const endB=vb.rr*2;
    const mid=l.midWidth;
    const edgeStopA=clamp(va.rr/linkLen,.015,.32);
    const edgeStopB=clamp(1-(vb.rr/linkLen),.68,.985);

    // Each half keeps the exact node hue. Opacity is identical to the node
    // through its visible boundary, then tapers only after leaving the circle.
    const aEdgeAlpha=va.alpha;
    const bEdgeAlpha=vb.alpha;
    const centerAlphaA=aEdgeAlpha*.13;
    const centerAlphaB=bEdgeAlpha*.13;

    ctx.save();
    const grad=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
    grad.addColorStop(0,'rgba('+a.color+','+aEdgeAlpha+')');
    grad.addColorStop(edgeStopA,'rgba('+a.color+','+aEdgeAlpha+')');
    grad.addColorStop(.499,'rgba('+a.color+','+centerAlphaA+')');
    grad.addColorStop(.501,'rgba('+b.color+','+centerAlphaB+')');
    grad.addColorStop(edgeStopB,'rgba('+b.color+','+bEdgeAlpha+')');
    grad.addColorStop(1,'rgba('+b.color+','+bEdgeAlpha+')');
    ctx.fillStyle=grad;
    ctx.shadowColor='rgba('+a.color+','+Math.min(.28,aEdgeAlpha*.32)+')';
    ctx.shadowBlur=8;
    taperedFilamentPath(a,b,endA,endB,mid,1);
    ctx.fill();
    ctx.restore();

    if(!reduce&&linkLife>.98&&l.active>.98&&time>=l.nextPulseAt){
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

    ctx.save();
    const beam=ctx.createLinearGradient(x0,y0,x1,y1);
    beam.addColorStop(0,'rgba('+p.color+',0)');
    beam.addColorStop(.38,'rgba('+p.color+','+(p.alpha*.32)+')');
    beam.addColorStop(.53,'rgba('+p.color+','+(p.alpha*.92)+')');
    beam.addColorStop(.70,'rgba('+p.color+','+(p.alpha*.42)+')');
    beam.addColorStop(1,'rgba('+p.color+',0)');
    ctx.strokeStyle=beam;
    ctx.lineWidth=p.size*1.15;
    ctx.lineCap='round';
    ctx.shadowColor='rgba('+p.color+','+(p.alpha*.95)+')';
    ctx.shadowBlur=p.halo;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();

    const aura=ctx.createRadialGradient(x,y,0,x,y,p.size*4.2);
    aura.addColorStop(0,'rgba(255,255,255,'+(p.alpha*.48)+')');
    aura.addColorStop(.18,'rgba('+p.color+','+(p.alpha*.55)+')');
    aura.addColorStop(1,'rgba('+p.color+',0)');
    ctx.fillStyle=aura;
    ctx.beginPath();ctx.arc(x,y,p.size*4.2,0,Math.PI*2);ctx.fill();

    ctx.fillStyle='rgba(255,255,255,'+(p.alpha*.52)+')';
    ctx.shadowColor='rgba('+p.color+','+p.alpha+')';
    ctx.shadowBlur=p.halo*.72;
    ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function drawNode(n,time){
    const age=time-n.born;
    if(age<0)return;

    const visual=nodeVisualState(n,time);
    const wave=visual.wave;
    const pulse01=visual.pulse01;
    const alpha=visual.alpha;
    const rr=visual.rr;

    ctx.save();
    const aura=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,rr*(2.8+n.auraGain*.6));
    aura.addColorStop(0,'rgba('+n.color+','+(alpha*(.22+.08*pulse01))+')');
    aura.addColorStop(.38,'rgba('+n.color+','+(alpha*(.08+.04*pulse01))+')');
    aura.addColorStop(1,'rgba('+n.color+',0)');
    ctx.fillStyle=aura;
    ctx.beginPath();ctx.arc(n.x,n.y,rr*(2.8+n.auraGain*.6),0,Math.PI*2);ctx.fill();

    ctx.globalAlpha=alpha;
    ctx.fillStyle='rgb('+n.color+')';
    ctx.shadowColor='rgba('+n.color+','+Math.min(.74,alpha*.82)+')';
    ctx.shadowBlur=11+8*pulse01;
    ctx.beginPath();ctx.arc(n.x,n.y,rr,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;

    // Inner energy stays in the same hue family and never changes the outer-edge alpha.
    const core=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,rr*.56);
    core.addColorStop(0,'rgba('+n.color+',.72)');
    core.addColorStop(.48,'rgba('+n.color+',.30)');
    core.addColorStop(1,'rgba('+n.color+',0)');
    ctx.globalAlpha=alpha;
    ctx.fillStyle=core;
    ctx.shadowColor='rgba('+n.color+','+Math.min(.84,alpha)+')';
    ctx.shadowBlur=12+9*pulse01;
    ctx.beginPath();ctx.arc(n.x,n.y,rr*.56,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
    ctx.restore();
  }

  function frame(time){
    updateNodes(time);
    cleanup(time);
    drawBackground();

    const aliveCount=nodes.filter(n=>n.state!=='dead').length;
    const target=W<700?34:50;
    const repairMax=W<700?48:66;

    if(!reduce&&time-startAt>550&&time-lastSpawn>nextSpawnDelay){
      const topology=networkTopology();
      const canGrow=aliveCount<target||(topology.needsRepair&&aliveCount<repairMax);

      if(canGrow&&spawn(time)){
        lastSpawn=time;
        nextSpawnDelay=topology.needsRepair?rand(300,620):rand(420,820);
      }else{
        lastSpawn=time;
        nextSpawnDelay=topology.needsRepair?rand(420,820):rand(680,1180);
      }
    }

    if(!reduce&&!coreCulled&&time>=coreCullAt){
      coreCulled=markNodeForFade(time,true)||!nodes.some(n=>n.id===1&&n.state==='active');
      if(coreCulled){
        lastCull=time;
        nextCullDelay=rand(2800,4200);
      }
    }

    if(!reduce&&time-startAt>11000&&time-lastCull>nextCullDelay){
      const topology=networkTopology();
      const repairing=topology.needsRepair&&aliveCount<repairMax;

      if(repairing){
        lastCull=time;
        nextCullDelay=rand(1800,3000);
      }else{
        const changed=markNodeForFade(time);
        lastCull=time;
        nextCullDelay=changed?rand(2800,5200):rand(2200,3800);
      }
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
function html(v){
  const {layer}=ensureOrganicLayers();
  layer.innerHTML=v;
  mountNexoOrganicBackground();
}
function loading(label='Abriendo Mi espacio…'){html('<div class="nxo-loading"><div><div class="nxo-spinner"></div><strong>'+esc(label)+'</strong><p class="nxo-muted">Preparando tu contexto Nexo.</p></div></div>')}
function errorView(e){const m=String(e&&e.message?e.message:e||'Error');html('<div class="nxo-loading"><div class="nxo-error"><h2>No se pudo abrir Mi espacio</h2><p>'+esc(m)+'</p><button id="nxo-retry" class="nxo-btn nxo-btn-gold">Reintentar</button></div></div>');document.getElementById('nxo-retry')?.addEventListener('click',retryAccess)}
function toast(msg){let x=document.querySelector('.nxo-toast');if(x)x.remove();x=document.createElement('div');x.className='nxo-toast';x.textContent=msg;document.body.appendChild(x);setTimeout(()=>x.remove(),3200)}
async function api(action,payload={}){
 const h={'Content-Type':'application/json','Accept':'application/json'};
 if(sessionToken)h.Authorization='Bearer '+sessionToken;
 const controller=new AbortController(),requestTimeout=action==='recipe-change.process'?90000:20000,timer=setTimeout(()=>controller.abort(),requestTimeout);
 try{
  const r=await fetch(API,{method:'POST',cache:'no-store',signal:controller.signal,headers:h,body:JSON.stringify({action,...payload})});
  if(!r.ok)throw accessError('HTTP_'+r.status);
  let d;try{d=await r.json()}catch(_){throw accessError('INVALID_RESPONSE')}
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
function launchWithBack(url,label,workspaceId=''){if(!url)return'';try{const u=new URL(url,location.href);const back=new URL(siteBase()+'/blank-8');if(workspaceId)back.searchParams.set('nxoWorkspace',workspaceId);u.searchParams.set('nxoBack',back.href);u.searchParams.set('nxoBackLabel',label||'Mi espacio');return u.href}catch(_){return url}}
function toolLaunchUrl(t){const route=routeUrl(t.routePath);if(!route)return'';const wsid=workspace?.workspace?.id||'';return launchWithBack(route,wsid?workspace.workspace.name:'Mi espacio',wsid)}
function centerDevelopmentUrl(){return launchWithBack(siteBase(),'Mi espacio','')}
function setWorkspaceReturnParam(id){try{const u=new URL(location.href);if(id)u.searchParams.set('nxoWorkspace',id);else u.searchParams.delete('nxoWorkspace');history.replaceState(history.state||{},'',u.pathname+u.search+u.hash)}catch(_){}}
function clearWorkspaceReturnParam(){setWorkspaceReturnParam('')}
function statusText(s){return s==='ACTIVE'?'Activo':s==='BUILDING'?'En desarrollo':s==='PLANNED'?'Próximamente':s||''}
function roleName(roleKey,role){return role?.nameEs||({owner:'Propietario',admin:'Administrador',manager:'Manager',collaborator:'Colaborador',viewer:'Consulta'}[roleKey]||roleKey||'Miembro')}
function hasPerm(key){const list=workspace?.role?.permissions||workspace?.membership?.permissions||[];return Array.isArray(list)&&list.includes(key)}
function topbar(mode){
  if(mode!=='workspace')return'';
  const name=personal?.profile?.displayName||'Usuario Nexo';
  const wsName=workspace?.workspace?.name||'Workspace';
  const role=roleName(workspace?.membership?.roleKey,workspace?.role);
  return '<header class="nxo-topbar nxo-workspace-nav">'+
    '<div class="nxo-nav-brand" id="nxo-nav-home"><span class="nxo-nav-mark">N</span><span class="nxo-nav-brand-copy"><strong>Nexo Group</strong><small>'+esc(wsName)+'</small></span></div>'+
    '<nav class="nxo-nav-links" aria-label="Navegación del Workspace">'+
      '<button type="button" class="nxo-nav-link" id="nxo-personal">Mi espacio</button>'+
      '<button type="button" class="nxo-nav-link active" aria-current="page">'+esc(wsName)+'</button>'+
      '<button type="button" class="nxo-nav-link" id="nxo-nav-development">Centro de desarrollo</button>'+
    '</nav>'+
    '<div class="nxo-nav-account-wrap">'+
      '<button type="button" class="nxo-nav-account" id="nxo-nav-account" aria-expanded="false">'+
        '<span class="nxo-avatar">'+esc(initials(name))+'</span>'+
        '<span class="nxo-nav-account-copy"><strong>'+esc(name)+'</strong><small>'+esc(role)+'</small></span>'+
        '<span class="nxo-nav-caret">⌄</span>'+
      '</button>'+
      '<div class="nxo-nav-account-menu" id="nxo-nav-account-menu">'+
        '<button type="button" data-account-action="switch">Cambiar cuenta</button>'+
        '<button type="button" class="danger" data-account-action="logout">Cerrar sesión</button>'+
      '</div>'+
    '</div>'+
  '</header>'
}

function bindWorkspaceTopbar(){
  const account=document.getElementById('nxo-nav-account');
  const menu=document.getElementById('nxo-nav-account-menu');
  document.getElementById('nxo-personal')?.addEventListener('click',returnPersonal);
  document.getElementById('nxo-nav-home')?.addEventListener('click',returnPersonal);
  document.getElementById('nxo-nav-development')?.addEventListener('click',()=>location.assign(centerDevelopmentUrl()));
  if(account&&menu){
    account.addEventListener('click',e=>{
      e.stopPropagation();
      const open=menu.classList.toggle('open');
      account.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('click',e=>{
      if(!menu.contains(e.target)&&e.target!==account){
        menu.classList.remove('open');
        account.setAttribute('aria-expanded','false');
      }
    },{once:true});
  }
  document.querySelectorAll('[data-account-action]').forEach(button=>{
    button.addEventListener('click',()=>{
      const action=button.dataset.accountAction;
      const u=new URL(siteBase()+'/blank-8');
      u.searchParams.set('nxoAccountAction',action);
      location.assign(u.href);
    });
  });
}

function toolCard(t){const route=toolLaunchUrl(t);const usable=!!route&&t.status!=='PLANNED';return '<article class="nxo-card '+(usable?'clickable':'')+'" '+(usable?'data-tool="'+esc(route)+'"':'')+'><div class="nxo-card-top"><div class="nxo-tool-icon">'+esc(t.icon||'◈')+'</div><span class="nxo-status '+esc(t.status||'')+'">'+esc(statusText(t.status))+'</span></div><h4>'+esc(t.nameEs||t.nameEn||t.toolKey)+'</h4><p>'+esc(t.descriptionEs||'')+'</p><div class="nxo-card-footer"><span class="nxo-role">'+(usable?'Abrir herramienta':'Aún no disponible')+'</span><span>›</span></div></article>'}
function bindTools(){document.querySelectorAll('[data-tool]').forEach(x=>x.onclick=()=>location.assign(x.dataset.tool))}
async function start(){loading();const b=await waitBoot();accessStage='EXCHANGE';stripBoot();const ex=await api('exchange',{bootToken:b});sessionToken=ex.sessionToken||'';if(!sessionToken)throw accessError('NO_SESSION_TOKEN');accessStage='BOOTSTRAP';personal=await api('bootstrap');const requestedWorkspace=new URLSearchParams(location.search).get('nxoWorkspace');if(requestedWorkspace){try{workspace=await api('workspace.open',{workspaceId:requestedWorkspace});workspaceTab='tools';renderWorkspace();return}catch(_){clearWorkspaceReturnParam()}}renderPersonal()}
function renderPersonal(){workspace=null;workspaceMembers=null;workspaceRoles=null;workspaceToolConfig=null;workspaceRecipeComments=null;workspacePendingNotes=null;const tools=personal?.tools||[],spaces=personal?.workspaces||[],inv=personal?.invitations||[];let welcomeHidden=false;try{welcomeHidden=localStorage.getItem('nexoWelcomeDismissed:v1')==='1'}catch(_){}
const welcome=welcomeHidden?'':'<section class="nxo-welcome"><button id="nxo-dismiss-welcome" class="nxo-welcome-close" aria-label="Cerrar">✕</button><div class="nxo-eyebrow">Mi espacio</div><h2>Hola, '+esc(personal?.profile?.displayName||'Usuario Nexo')+'</h2><p>Desde aquí administras tus herramientas personales y entras a los Workspaces donde colaboras. Puedes cerrar este mensaje cuando ya no lo necesites.</p></section>';
const summary='<section class="nxo-summary-strip"><div class="nxo-summary-item"><strong>'+tools.length+'</strong><span>Mis herramientas</span></div><div class="nxo-summary-item"><strong>'+spaces.length+'</strong><span>Workspaces</span></div><div class="nxo-summary-item"><strong>'+inv.length+'</strong><span>Invitaciones</span></div><div class="nxo-summary-item"><strong>●</strong><span>Cuenta activa</span></div></section>';
const legacyInvites=inv.length?'<section class="nxo-section"><div class="nxo-section-head"><div><h3>Invitaciones pendientes</h3><p>Invitaciones heredadas asociadas directamente a tu cuenta.</p></div></div>'+inv.map(i=>'<div class="nxo-invite"><div><strong>'+esc(i.workspaceName)+'</strong><p>Rol: '+esc(roleName(i.roleKey,i.role))+'</p></div><div class="nxo-invite-actions"><button class="nxo-btn" data-invite-decline="'+esc(i.id)+'">Rechazar</button><button class="nxo-btn nxo-btn-gold" data-invite-accept="'+esc(i.id)+'">Aceptar</button></div></div>').join('')+'</section>':'';
const explore='<article class="nxo-card clickable nxo-explore-card" data-tool="'+esc(centerDevelopmentUrl())+'"><div class="nxo-card-top"><div class="nxo-tool-icon">＋</div><span class="nxo-status ACTIVE">Catálogo</span></div><h4>Explorar más herramientas</h4><p>Abre el Centro de desarrollo para conocer todas las herramientas activas de Nexo y, más adelante, probarlas o añadirlas mediante un plan.</p><div class="nxo-card-footer"><span class="nxo-role">Centro de desarrollo</span><span>›</span></div></article>';
const personalTools='<section class="nxo-section"><div class="nxo-section-head"><div><h3>Mis herramientas</h3><p>Aquí aparecen únicamente las herramientas disponibles para tu cuenta.</p></div></div><div class="nxo-grid">'+tools.map(toolCard).join('')+explore+'</div></section>';
const workspaceCards='<section class="nxo-section"><div class="nxo-section-head"><div><h3>Mis Workspaces</h3><p>Espacios que creaste o a los que te uniste.</p></div><div class="nxo-section-actions"><button id="nxo-join-workspace" class="nxo-btn">Unirse a un Workspace</button><button id="nxo-create-workspace" class="nxo-btn nxo-btn-gold">Nuevo Workspace</button></div></div>'+(spaces.length?'<div class="nxo-grid">'+spaces.map(w=>'<article class="nxo-card clickable" data-workspace="'+esc(w.workspaceId)+'"><div class="nxo-card-top"><div class="nxo-tool-icon">⌂</div><span class="nxo-status ACTIVE">Activo</span></div><h4>'+esc(w.name)+'</h4><p>'+esc(w.description||'Espacio de trabajo Nexo')+'</p><div class="nxo-card-footer"><span class="nxo-role">'+esc(roleName(w.roleKey,w.role))+'</span><span>›</span></div></article>').join('')+'</div>':'<div class="nxo-empty">Todavía no perteneces a ningún Workspace.</div>')+'</section>';
html('<div class="nxo-shell"><main class="nxo-main">'+welcome+summary+legacyInvites+personalTools+workspaceCards+'</main></div>');bindTools();document.querySelectorAll('[data-workspace]').forEach(x=>x.onclick=()=>openWorkspace(x.dataset.workspace));document.getElementById('nxo-create-workspace')?.addEventListener('click',createWorkspaceModal);document.getElementById('nxo-join-workspace')?.addEventListener('click',joinWorkspaceModal);document.getElementById('nxo-dismiss-welcome')?.addEventListener('click',()=>{try{localStorage.setItem('nexoWelcomeDismissed:v1','1')}catch(_){}renderPersonal()});document.querySelectorAll('[data-invite-accept]').forEach(b=>b.onclick=()=>respondInvite(b.dataset.inviteAccept,'accept'));document.querySelectorAll('[data-invite-decline]').forEach(b=>b.onclick=()=>respondInvite(b.dataset.inviteDecline,'decline'))}
async function refreshPersonal(){personal=await api('personal.refresh');renderPersonal()}
async function respondInvite(id,decision){try{loading(decision==='accept'?'Aceptando invitación…':'Actualizando invitación…');personal=await api('invitation.respond',{invitationId:id,decision});toast(decision==='accept'?'Invitación aceptada':'Invitación rechazada');renderPersonal()}catch(e){errorView(e)}}
function modal(title,body,onReady){const o=document.createElement('div');o.className='nxo-overlay';o.innerHTML='<div class="nxo-modal"><div class="nxo-modal-head"><strong>'+esc(title)+'</strong><button class="nxo-btn" data-close>✕</button></div><div class="nxo-modal-body">'+body+'</div></div>';document.body.appendChild(o);o.querySelector('[data-close]').onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()};if(onReady)onReady(o);return o}
function createWorkspaceModal(){modal('Crear Workspace','<div class="nxo-field"><label>Nombre</label><input id="nxo-ws-name" class="nxo-input" placeholder="Ej. Old Hickory"></div><div class="nxo-field"><label>Descripción</label><textarea id="nxo-ws-desc" class="nxo-textarea" placeholder="Describe el propósito de este espacio."></textarea></div><div class="nxo-modal-actions"><button class="nxo-btn nxo-btn-gold" id="nxo-ws-save">Crear Workspace</button></div>',o=>{o.querySelector('#nxo-ws-save').onclick=async()=>{const name=o.querySelector('#nxo-ws-name').value.trim(),description=o.querySelector('#nxo-ws-desc').value.trim();if(!name){toast('Escribe un nombre');return}try{o.remove();loading('Creando Workspace…');workspace=await api('workspace.create',{input:{name,description}});await openWorkspace(workspace.workspace.id,true)}catch(e){errorView(e)}}})}
function joinWorkspaceModal(){modal('Unirse a un Workspace','<div class="nxo-field"><label>Código de invitación</label><input id="nxo-join-code" class="nxo-input" placeholder="NEXO-ABCDE-12345" autocomplete="off" autocapitalize="characters"></div><p class="nxo-muted" style="margin:0;line-height:1.55">Pega el código que te compartió un administrador del Workspace. Los códigos son de un solo uso.</p><div class="nxo-modal-actions"><button id="nxo-join-submit" class="nxo-btn nxo-btn-gold">Unirme al Workspace</button></div>',o=>{const input=o.querySelector('#nxo-join-code'),button=o.querySelector('#nxo-join-submit');input?.focus();button.onclick=async()=>{const code=input.value.trim();if(!code){toast('Escribe el código de invitación');return}button.disabled=true;button.textContent='Validando…';try{workspace=await api('workspace.join.code',{code});o.remove();setWorkspaceReturnParam(workspace?.workspace?.id||'');workspaceTab='tools';toast('Te uniste a '+(workspace?.workspace?.name||'Workspace'));renderWorkspace()}catch(e){button.disabled=false;button.textContent='Unirme al Workspace';toast(e.message||String(e))}}})}
async function openWorkspace(id,alreadyOpen=false){try{loading('Abriendo Workspace…');workspace=alreadyOpen&&workspace?workspace:await api('workspace.open',{workspaceId:id});workspaceRecipeComments=null;workspacePendingNotes=null;setWorkspaceReturnParam(workspace?.workspace?.id||id);workspaceTab='tools';renderWorkspace()}catch(e){errorView(e)}}
async function returnPersonal(){try{loading('Volviendo a Mi espacio…');personal=await api('workspace.return');clearWorkspaceReturnParam();renderPersonal()}catch(e){errorView(e)}}
function renderWorkspace(){const ws=workspace?.workspace||{},role=workspace?.role||{},tools=workspace?.tools||[];const perms=role.permissions||[];const canMembers=workspace?.membership?.roleKey==='owner'||perms.some(x=>['members.view','members.manage','members.invite'].includes(x));const canTools=perms.includes('tools.configure');const canAdmin=workspace?.membership?.roleKey==='owner'||perms.some(x=>['workspace.manage','members.manage','tools.configure'].includes(x));const tabs=['<button class="nxo-tab '+(workspaceTab==='tools'?'active':'')+'" data-wtab="tools">Herramientas</button>'];if(canMembers)tabs.push('<button class="nxo-tab '+(workspaceTab==='members'?'active':'')+'" data-wtab="members">Miembros</button>');tabs.push('<button class="nxo-tab '+(workspaceTab==='access'?'active':'')+'" data-wtab="access">Mi acceso</button>');if(canTools)tabs.push('<button class="nxo-tab '+(workspaceTab==='settings'?'active':'')+'" data-wtab="settings">Configuración</button>');let body='';if(workspaceTab==='tools')body=(canAdmin?renderRecipeCommentNoticesShell()+renderPendingNotesShell():'')+renderWorkspaceTools(tools);else if(workspaceTab==='members')body='<div id="nxo-members-zone"><div class="nxo-empty">Cargando miembros…</div></div>';else if(workspaceTab==='settings')body='<div id="nxo-settings-zone"><div class="nxo-empty">Cargando configuración…</div></div>';else body=renderAccess(role);html('<div class="nxo-shell">'+topbar('workspace')+'<main class="nxo-main"><div class="nxo-workspace-header"><div><div class="nxo-eyebrow">Workspace</div><h2>'+esc(ws.name||'Workspace')+'</h2><p>'+esc(ws.description||'')+'</p></div><div class="nxo-top-actions"><span class="nxo-chip">'+esc(roleName(workspace?.membership?.roleKey,role))+'</span></div></div><div class="nxo-tabs">'+tabs.join('')+'</div>'+body+'</main></div>');bindWorkspaceTopbar();document.querySelectorAll('[data-wtab]').forEach(b=>b.onclick=()=>{workspaceTab=b.dataset.wtab;renderWorkspace()});bindTools();if(workspaceTab==='tools'&&canAdmin)refreshWorkspaceAdminPanels();if(workspaceTab==='members')loadMembers();if(workspaceTab==='settings')loadWorkspaceSettings()}
function renderRecipeCommentNoticesShell(){return '<section class="nxo-section" style="margin-top:0"><div id="nxo-recipe-comment-notifications"><div class="nxo-section-head"><div><h3>Notificaciones</h3><p>Recomendaciones nuevas del equipo sobre las fichas técnicas.</p></div></div><div class="nxo-empty">Cargando avisos…</div></div></section>'}
function renderPendingNotesShell(){return '<section class="nxo-section"><div id="nxo-pending-notes"><div class="nxo-section-head"><div><h3>Pendientes</h3><p>Notas persistentes guardadas para revisar después.</p></div></div><div class="nxo-empty">Cargando pendientes…</div></div></section>'}
function nxoWhen(value){try{return value?new Date(value).toLocaleString('es-US',{dateStyle:'medium',timeStyle:'short'}):''}catch(_){return''}}
async function refreshWorkspaceAdminPanels(){await Promise.allSettled([loadWorkspaceRecipeComments(),loadWorkspacePendingNotes()])}
async function loadWorkspaceRecipeComments(){const zone=document.getElementById('nxo-recipe-comment-notifications');if(!zone||!workspace?.workspace?.id)return;try{workspaceRecipeComments=await api('workspace.recipe-comments',{workspaceId:workspace.workspace.id});const rows=Array.isArray(workspaceRecipeComments?.comments)?workspaceRecipeComments.comments:[];const visible=rows.slice(0,12);zone.innerHTML='<div class="nxo-section-head"><div><h3>Notificaciones</h3><p>Recomendaciones del equipo pendientes de decisión.</p></div><span class="nxo-chip">'+rows.length+'</span></div>'+(visible.length?'<div class="nxo-notice-list">'+visible.map(r=>{const when=nxoWhen(r.commentedAt),working=r.status==='applying',failed=r.status==='change_failed';return '<article class="nxo-panel nxo-notice"><div class="nxo-notice-main"><div class="nxo-avatar">'+esc(initials(r.authorName))+'</div><div class="nxo-notice-copy"><div><strong>'+esc(r.authorName||'Miembro Nexo')+'</strong> recomendó un cambio en <strong>'+esc(r.recipeTitle||'Ficha técnica')+'</strong></div><p>'+esc(r.comment||'')+'</p>'+(when?'<small>'+esc(when)+'</small>':'')+(failed?'<div class="nxo-notice-error">La actualización anterior no se completó. Puedes revisarla otra vez.</div>':'')+'</div></div><div class="nxo-notice-actions">'+(working&&r.changeJobId?'<button class="nxo-btn" data-job-watch="'+esc(r.changeJobId)+'">Ver progreso</button>':'<button class="nxo-btn nxo-btn-gold" data-comment-review="'+esc(r.id)+'">Abrir</button>')+'</div></article>'}).join('')+'</div>':'<div class="nxo-empty">No hay recomendaciones nuevas por revisar.</div>');zone.querySelectorAll('[data-comment-review]').forEach(b=>b.onclick=()=>openRecipeRecommendation(b.dataset.commentReview));zone.querySelectorAll('[data-job-watch]').forEach(b=>b.onclick=()=>watchRecipeChange(b.dataset.jobWatch))}catch(e){zone.innerHTML='<div class="nxo-section-head"><div><h3>Notificaciones</h3></div></div><div class="nxo-empty">'+esc(e.message||e)+'</div>'}}
async function loadWorkspacePendingNotes(){const zone=document.getElementById('nxo-pending-notes');if(!zone||!workspace?.workspace?.id)return;try{workspacePendingNotes=await api('workspace.pending-notes',{workspaceId:workspace.workspace.id});const rows=Array.isArray(workspacePendingNotes?.notes)?workspacePendingNotes.notes:[];zone.innerHTML='<div class="nxo-section-head"><div><h3>Pendientes</h3><p>Notas que permanecen en el Workspace hasta resolverlas.</p></div><span class="nxo-chip">'+rows.length+'</span></div>'+(rows.length?'<div class="nxo-note-board">'+rows.map((r,i)=>'<button type="button" class="nxo-pinned-note n'+(i%3)+'" data-pending-note="'+esc(r.id)+'"><span class="nxo-note-pin"></span><span class="nxo-note-label">PENDIENTE</span><strong>'+esc(r.title||'Pendiente')+'</strong></button>').join('')+'</div>':'<div class="nxo-empty">No hay notas pendientes.</div>');zone.querySelectorAll('[data-pending-note]').forEach(b=>b.onclick=()=>openPendingNote(b.dataset.pendingNote))}catch(e){zone.innerHTML='<div class="nxo-section-head"><div><h3>Pendientes</h3></div></div><div class="nxo-empty">'+esc(e.message||e)+'</div>'}}
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
function renderAccess(role){const perms=role?.permissions||[];return '<div class="nxo-panel" style="padding:18px"><div class="nxo-section-head"><div><h3>Tu acceso en este Workspace</h3><p>Los permisos se aplican en backend, no solo en la interfaz.</p></div></div><div class="nxo-chip">'+esc(roleName(workspace?.membership?.roleKey,role))+'</div><div class="nxo-perms">'+(perms.length?perms.map(p=>'<span class="nxo-perm">'+esc(p)+'</span>').join(''):'<span class="nxo-muted">Sin permisos adicionales.</span>')+'</div></div>'}
async function loadMembers(){const zone=document.getElementById('nxo-members-zone');if(!zone)return;try{const wsid=workspace.workspace.id;workspaceMembers=await api('workspace.members',{workspaceId:wsid});const rolePerms=workspace?.role?.permissions||[];const canInvite=rolePerms.includes('members.invite')||rolePerms.includes('members.manage');const canAssign=rolePerms.includes('roles.assign');const canRemove=rolePerms.includes('members.remove')||rolePerms.includes('members.manage');if(canAssign||canInvite){try{workspaceRoles=await api('workspace.roles',{workspaceId:wsid})}catch(_){workspaceRoles=[]}}else workspaceRoles=[];zone.innerHTML='<div class="nxo-section-head"><div><h3>Miembros</h3><p>'+workspaceMembers.members.length+' miembro'+(workspaceMembers.members.length===1?'':'s')+' activo'+(workspaceMembers.members.length===1?'':'s')+'.</p></div>'+(canInvite?'<button id="nxo-invite-member" class="nxo-btn nxo-btn-gold">Invitar miembro</button>':'')+'</div><div class="nxo-member-list">'+workspaceMembers.members.map(m=>memberRow(m,canAssign,canRemove)).join('')+'</div>';document.getElementById('nxo-invite-member')?.addEventListener('click',inviteModal);document.querySelectorAll('[data-member-role]').forEach(sel=>sel.onchange=()=>changeRole(sel.dataset.memberRole,sel.value));document.querySelectorAll('[data-member-remove]').forEach(btn=>btn.onclick=()=>removeMember(btn.dataset.memberRemove))}catch(e){zone.innerHTML='<div class="nxo-empty">'+esc(e.message||e)+'</div>'}}
function memberRow(m,canAssign,canRemove){const actorRank=Number(workspaceMembers?.currentRole?.rank||workspace?.role?.rank||0),targetRank=Number(m.role?.rank||0),canAct=!m.isWorkspaceOwner&&targetRank<actorRank;const options=(workspaceRoles||[]).map(r=>'<option value="'+esc(r.roleKey)+'" '+(r.roleKey===m.roleKey?'selected':'')+'>'+esc(r.nameEs||r.roleKey)+'</option>').join('');return '<div class="nxo-member"><div class="nxo-member-left"><div class="nxo-avatar">'+esc(initials(m.displayName))+'</div><div style="min-width:0"><div class="nxo-member-name">'+esc(m.displayName)+'</div><div class="nxo-member-sub">'+esc(roleName(m.roleKey,m.role))+(m.isWorkspaceOwner?' · propietario del Workspace':'')+'</div></div></div><div class="nxo-member-actions">'+(canAct&&canAssign&&options?'<select class="nxo-select" style="width:auto;min-width:145px" data-member-role="'+esc(m.memberId)+'">'+options+'</select>':'<span class="nxo-chip">'+esc(roleName(m.roleKey,m.role))+'</span>')+(canAct&&canRemove?'<button class="nxo-btn nxo-btn-danger" data-member-remove="'+esc(m.memberId)+'">Quitar</button>':'')+'</div></div>'}
async function copyInviteCode(value){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true}const t=document.createElement('textarea');t.value=value;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.focus();t.select();const ok=document.execCommand('copy');t.remove();return ok}catch(_){return false}}
function inviteModal(){const opts=(workspaceRoles||[]).map(r=>'<option value="'+esc(r.roleKey)+'">'+esc(r.nameEs||r.roleKey)+'</option>').join('');modal('Invitar miembro','<p class="nxo-muted" style="margin:0 0 14px;line-height:1.55">Genera un código de un solo uso y compártelo por el medio que prefieras. No necesitas conocer el correo de la otra persona.</p><div class="nxo-field"><label>Rol que recibirá al unirse</label><select id="nxo-invite-role" class="nxo-select">'+opts+'</select></div><div id="nxo-invite-result"></div><div class="nxo-modal-actions"><button id="nxo-invite-generate" class="nxo-btn nxo-btn-gold">Generar código</button></div>',o=>{const button=o.querySelector('#nxo-invite-generate'),zone=o.querySelector('#nxo-invite-result');button.onclick=async()=>{const roleKey=o.querySelector('#nxo-invite-role').value;button.disabled=true;button.textContent='Generando…';try{const invite=await api('workspace.invite.code',{workspaceId:workspace.workspace.id,input:{roleKey}});const code=invite.code||'';const expiry=invite.expiresAt?new Date(invite.expiresAt).toLocaleDateString():'7 días';zone.innerHTML='<div class="nxo-panel" style="padding:16px;margin-top:14px"><div class="nxo-eyebrow">Código de invitación</div><div style="font-size:25px;font-weight:950;letter-spacing:.08em;margin:9px 0 6px;word-break:break-all">'+esc(code)+'</div><p class="nxo-muted" style="margin:0 0 12px;line-height:1.5">Rol: '+esc(roleName(invite.roleKey,invite.role))+' · válido hasta '+esc(expiry)+' · un solo uso.</p><button id="nxo-copy-invite" class="nxo-btn">Copiar código</button></div>';button.textContent='Generar otro código';document.getElementById('nxo-copy-invite')?.addEventListener('click',async()=>{const ok=await copyInviteCode(code);toast(ok?'Código copiado':'No se pudo copiar automáticamente. Mantén pulsado el código para copiarlo.')})}catch(e){toast(e.message||String(e));button.textContent='Generar código'}finally{button.disabled=false}}})}
async function changeRole(memberId,roleKey){try{await api('workspace.role',{workspaceId:workspace.workspace.id,targetMemberId:memberId,roleKey});toast('Rol actualizado');await loadMembers()}catch(e){toast(e.message||String(e));await loadMembers()}}
async function removeMember(memberId){if(!confirm('¿Quitar a este miembro del Workspace?'))return;try{await api('workspace.remove',{workspaceId:workspace.workspace.id,targetMemberId:memberId});toast('Miembro removido');await loadMembers()}catch(e){toast(e.message||String(e))}}
async function loadWorkspaceSettings(){const zone=document.getElementById('nxo-settings-zone');if(!zone)return;try{workspaceToolConfig=await api('workspace.tools',{workspaceId:workspace.workspace.id});const ws=workspace.workspace||{};zone.innerHTML='<div class="nxo-panel" style="padding:18px;margin-bottom:14px"><div class="nxo-section-head"><div><h3>Información del Workspace</h3><p>Nombre y descripción visibles para sus miembros.</p></div></div><div class="nxo-field"><label>Nombre</label><input id="nxo-settings-name" class="nxo-input" value="'+esc(ws.name||'')+'"></div><div class="nxo-field"><label>Descripción</label><textarea id="nxo-settings-desc" class="nxo-textarea">'+esc(ws.description||'')+'</textarea></div><div class="nxo-modal-actions"><button id="nxo-settings-save" class="nxo-btn nxo-btn-gold">Guardar cambios</button></div></div><div class="nxo-panel" style="padding:18px"><div class="nxo-section-head"><div><h3>Herramientas del Workspace</h3><p>Activa herramientas y decide si todos los miembros o solo personas concretas pueden verlas.</p></div></div><div class="nxo-tool-config">'+workspaceToolConfig.tools.map(t=>{const mode=t.accessMode==='restricted'?'Restringido · '+(t.allowedMemberIds||[]).length+' miembro'+((t.allowedMemberIds||[]).length===1?'':'s'):'Todo el Workspace';return '<div class="nxo-tool-toggle"><div><h4>'+esc(t.nameEs||t.toolKey)+'</h4><p>'+esc(t.descriptionEs||'')+' · '+esc(statusText(t.status))+'</p><div class="nxo-access-summary">'+esc(mode)+'</div></div><div class="nxo-tool-actions"><button class="nxo-btn" data-tool-access="'+esc(t.toolKey)+'" '+(t.enabled?'':'disabled')+'>Parámetros de acceso</button><div class="nxo-switch '+(t.enabled?'on':'')+'" data-tool-toggle="'+esc(t.toolKey)+'" data-enabled="'+(t.enabled?'1':'0')+'"><span></span></div></div></div>'}).join('')+'</div></div>';document.getElementById('nxo-settings-save')?.addEventListener('click',saveWorkspaceSettings);document.querySelectorAll('[data-tool-toggle]').forEach(x=>x.onclick=()=>toggleTool(x.dataset.toolToggle,x.dataset.enabled!=='1'));document.querySelectorAll('[data-tool-access]').forEach(x=>x.onclick=()=>toolAccessModal(x.dataset.toolAccess))}catch(e){zone.innerHTML='<div class="nxo-empty">'+esc(e.message||e)+'</div>'}}
async function toolAccessModal(toolKey){const tool=(workspaceToolConfig?.tools||[]).find(t=>t.toolKey===toolKey);if(!tool)return;try{if(!workspaceMembers)workspaceMembers=await api('workspace.members',{workspaceId:workspace.workspace.id});const current=new Set(tool.allowedMemberIds||[]);const members=workspaceMembers?.members||[];modal('Parámetros de acceso · '+(tool.nameEs||tool.toolKey),'<div class="nxo-field"><label>Disponibilidad</label><select id="nxo-access-mode" class="nxo-select"><option value="workspace" '+(tool.accessMode!=='restricted'?'selected':'')+'>Todo el Workspace</option><option value="restricted" '+(tool.accessMode==='restricted'?'selected':'')+'>Solo miembros seleccionados</option></select></div><div id="nxo-access-members" class="nxo-access-list">'+members.map(m=>'<label class="nxo-check"><input type="checkbox" value="'+esc(m.memberId)+'" '+(current.has(m.memberId)?'checked':'')+'><span><strong>'+esc(m.displayName)+'</strong><small>'+esc(roleName(m.roleKey,m.role))+'</small></span></label>').join('')+'</div><p class="nxo-muted" style="line-height:1.5;margin:10px 0 0">Los administradores con permiso de configurar herramientas conservan visibilidad para poder administrarlas.</p><div class="nxo-modal-actions"><button id="nxo-access-save" class="nxo-btn nxo-btn-gold">Guardar acceso</button></div>',o=>{const select=o.querySelector('#nxo-access-mode'),list=o.querySelector('#nxo-access-members'),save=o.querySelector('#nxo-access-save');const sync=()=>{list.style.display=select.value==='restricted'?'grid':'none'};select.onchange=sync;sync();save.onclick=async()=>{const mode=select.value;const allowed=mode==='restricted'?[...o.querySelectorAll('#nxo-access-members input:checked')].map(x=>x.value):[];if(mode==='restricted'&&!allowed.length){toast('Selecciona al menos un miembro');return}save.disabled=true;try{await api('workspace.tool.access',{workspaceId:workspace.workspace.id,toolKey,input:{accessMode:mode,allowedMemberIds:allowed}});o.remove();toast('Acceso actualizado');workspace=await api('workspace.open',{workspaceId:workspace.workspace.id});await loadWorkspaceSettings()}catch(e){save.disabled=false;toast(e.message||String(e))}}})}catch(e){toast(e.message||String(e))}}
async function saveWorkspaceSettings(){const name=document.getElementById('nxo-settings-name')?.value.trim()||'',description=document.getElementById('nxo-settings-desc')?.value.trim()||'';if(!name){toast('El nombre es obligatorio');return}try{workspace=await api('workspace.update',{workspaceId:workspace.workspace.id,input:{name,description}});toast('Workspace actualizado');renderWorkspace()}catch(e){toast(e.message||String(e))}}
async function toggleTool(toolKey,enabled){try{await api('workspace.tool.set',{workspaceId:workspace.workspace.id,toolKey,enabled});toast(enabled?'Herramienta habilitada':'Herramienta deshabilitada');workspace=await api('workspace.open',{workspaceId:workspace.workspace.id});await loadWorkspaceSettings()}catch(e){toast(e.message||String(e))}}
start().catch(errorView);
})();
