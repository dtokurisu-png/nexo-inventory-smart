(function(){
'use strict';

const VERSION='20261019-individual-price-95';
const previousRuntime=window.__nexoDevelopmentCenterRuntime;
if(previousRuntime&&typeof previousRuntime.destroy==='function'){
  try{previousRuntime.destroy()}catch(_){}
}

const runtimeAbort=new AbortController();
const runtime={
  version:VERSION,
  destroy:null
};
window.__nexoDevelopmentCenterRuntime=runtime;
window.__nexoDevelopmentCenterStage0Version=VERSION;

const THEME_KEY='nexoTheme:v1';
const THEME_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/theme-runtime.js?v=20261001-v3-1';
const GLOBAL_HEADER_RUNTIME='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/global-header-runtime.js?v=20261018-28-global-outside-close';
const ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const NEXO_LOGO='https://static.wixstatic.com/media/8b64a8_7bd85ca8e1854afc9ae91eab7457c405~mv2.png';
const TOOL_DEFS=[
  {key:'course-english',courseSlug:'english-adaptive',learningEnvironmentKey:'learning-core',kind:'course',localOnly:true,icon:'desarrollo',title:'Inglés adaptable',status:'planned',summary:'Inglés personalizado según objetivos sociales, laborales o situaciones concretas. El enfoque se elige dentro del curso.',names:['ingles adaptable','curso de ingles'],localDetail:{nameEs:'Inglés adaptable',status:'PLANNED',scopeModes:['personal'],category:'Curso',detailDescriptionEs:'Un único curso de inglés con itinerarios adaptables al contexto de cada estudiante: conversación social, comunicación profesional o situaciones específicas. No se limita al sector de cocina.',capabilitiesEs:['Diagnóstico del nivel','Objetivos y contexto configurables','Práctica contextualizada','Progreso conservado en Learning Core'],compatibilityEs:['Se accede desde Learning Core después de adquirir el curso'],audienceEs:['Personas que desean aprender inglés para necesidades distintas'],requirementsEs:['Adquisición o habilitación válida del curso'],integrationsEs:['Learning Core: matrícula, progreso y continuidad'],documentation:[],relatedProducts:[]}},
  {key:'course-excel',courseSlug:'excel-adaptive',learningEnvironmentKey:'learning-core',kind:'course',localOnly:true,icon:'productos',title:'Excel adaptable',status:'planned',summary:'Curso de Excel con prácticas personalizadas para estudio, tareas laborales y gestión de negocios.',names:['excel adaptable','curso de excel'],localDetail:{nameEs:'Excel adaptable',status:'PLANNED',scopeModes:['personal'],category:'Curso',detailDescriptionEs:'Aprendizaje de Excel ajustado al nivel, objetivos y sector del estudiante: desde fórmulas y organización de datos hasta situaciones de trabajo, administración y negocio.',capabilitiesEs:['Diagnóstico del nivel','Ejercicios ajustados a objetivos reales','Aplicaciones sociales, laborales o académicas','Seguimiento centralizado en Learning Core'],compatibilityEs:['Se accede desde Learning Core después de adquirir el curso'],audienceEs:['Estudiantes, profesionales y emprendedores'],requirementsEs:['Adquisición o habilitación válida del curso'],integrationsEs:['Learning Core: matrícula, progreso y continuidad'],documentation:[],relatedProducts:[]}},
  {key:'library',cmsKey:'gear-library',kind:'environment',icon:'guia',title:'Biblioteca de engranaje',summary:'Recursos, conocimiento y materiales reutilizables de Nexo.',names:['biblioteca de engranaje']},
  {key:'inventory',cmsKey:'inventory-smart',kind:'environment',icon:'productos',title:'Inventario Smart',summary:'Entorno operativo de inventario, productos y materiales.',names:['inventario smart']},
  {key:'technical',cmsKey:'dynamic-specs',kind:'environment',icon:'ficha-tecnica',title:'Fichas Técnicas Dinámicas',summary:'Entorno canónico de fichas, recetas y preparaciones. Recetarios Dinámicos forma parte de este mismo producto.',names:['fichas tecnicas dinamicas','dynamic technical sheets','recetarios dinamicos','menus dinamicos','menu dinamico']},
  {key:'camino-editorial',kind:'environment',localOnly:true,routePath:'/blank-6',icon:'guia',title:'Camino Editorial',summary:'Entorno editorial completo para manuscritos, canon, análisis y producción.',names:['camino editorial'],localDetail:{
    nameEs:'Camino Editorial',status:'ACTIVE',scopeModes:['personal'],category:'Editorial',integrationMode:'independent-environment',
    detailDescriptionEs:'Entorno editorial independiente de Nexo para manuscritos, canon, análisis, dictado y flujos de producción.',
    capabilitiesEs:['Manuscritos y capítulos','Canon editorial','Análisis y asistencia editorial','Flujos propios de publicación'],
    compatibilityEs:['Arquitectura independiente dentro del ecosistema Nexo'],
    audienceEs:['Autores','Editores','Equipos editoriales'],
    requirementsEs:['Sesión Nexo para funciones privadas'],
    integrationsEs:['Agentes de Camino Editorial','María','Numa como asistente transversal'],
    documentation:[],relatedProducts:[]
  }},
  {key:'r96',kind:'environment',localOnly:true,routePath:'/blank-9',icon:'catalogo',title:'R96',summary:'Entorno independiente para publicación, desarrollo y comunidad de juegos.',names:['r96','risin96ames','rising 96 games'],localDetail:{
    nameEs:'R96',status:'ACTIVE',scopeModes:['personal'],category:'Gaming',integrationMode:'independent-environment',
    detailDescriptionEs:'Entorno independiente de Nexo para catálogo de juegos, espacio de desarrolladores, versiones y comunidad.',
    capabilitiesEs:['Catálogo de juegos','Espacio de desarrolladores','Versionado y publicación','Comunidad y reseñas'],
    compatibilityEs:['Arquitectura de sesión y autorización propia sobre identidad Nexo'],
    audienceEs:['Jugadores','Desarrolladores','Equipo Rising'],
    requirementsEs:['Sesión Nexo para funciones privadas'],
    integrationsEs:['Identidad Nexo compartida, autorización R96 separada'],
    documentation:[],relatedProducts:[]
  }},
  {key:'work',cmsKey:'work-center',kind:'environment',icon:'panel',title:'Centro de Trabajo',summary:'Entorno futuro para tareas, horarios, personal y operación colaborativa.',status:'planned',names:['centro de trabajo','work center']},

  {key:'schedules',cmsKey:'schedules',kind:'addon',parent:'Centro de Trabajo',icon:'recordatorio',title:'Horarios',summary:'Add-on operativo para jornadas y horarios semanales con carga desde imagen, análisis y publicación.',names:['horarios','schedule','schedules']},
  {key:'tasks',cmsKey:'task-lists',kind:'addon',parent:'Centro de Trabajo',icon:'checklist',title:'Listas de tareas',summary:'Add-on para listas de tareas, checklists y prep lists en uso personal o Workspace.',status:'planned',names:['listas de tareas','checklist','prep list','prep lists']},
  {key:'multichannel-notifications',cmsKey:'multichannel-notifications',kind:'addon',parent:'Ecosistema Nexo',icon:'notificaciones',title:'Notificaciones multicanal',summary:'Add-on transversal para centralizar avisos y entregarlos por varios canales.',status:'planned',names:['notificaciones multicanal','multichannel notifications']},
  {key:'numa',cmsKey:'numa-assistant',kind:'addon',parent:'Ecosistema Nexo',icon:'ayuda',title:'Numa',summary:'Asistente transversal que amplía Mi Espacio, Workspaces y entornos compatibles.',status:'planned',names:['numa','asistente numa']},
  {key:'maria',cmsKey:'maria-editorial',kind:'addon',parent:'Camino Editorial',icon:'guia',title:'María',summary:'Add-on editorial de lectura, transcripción y apoyo para Camino Editorial.',status:'planned',names:['maria','maría','asistente maria','asistente maría']},
  {key:'camino-agents',cmsKey:'camino-editorial-agents',kind:'addon',parent:'Camino Editorial',icon:'comentarios',title:'Agentes de Camino Editorial',summary:'Add-ons editoriales especializados que se definirán y comercializarán individualmente.',status:'planned',names:['agentes de camino editorial','agentes editoriales','camino editorial agents']}
]
const PLAN_MEMBERSHIP=Object.freeze({
  'course-english':['learning'],'course-excel':['learning'],library:['business'],inventory:['business'],technical:['business'],
  'camino-editorial':['learning'],r96:['business'],work:['business'],
  schedules:['business'],tasks:['business'],'multichannel-notifications':['business','learning'],
  numa:['business','learning'],maria:['learning'],'camino-agents':['learning']
});
const PLAN_INFO=Object.freeze({
  business:{label:'Business',image:'https://static.wixstatic.com/media/8b64a8_42dfdc35ea464cc58b4e281dd03c5c03~mv2.png'},
  learning:{label:'Learning',image:'https://static.wixstatic.com/media/8b64a8_b7f0f3db134e4a7f9ac418e3763b71bb~mv2.png'},
  complete:{label:'Completo',image:'https://static.wixstatic.com/media/8b64a8_728c309f3c8f44fb997498c4c51c3cd3~mv2.png'}
});
function toolPlanIcons(tool){
  const primary=PLAN_MEMBERSHIP[tool.key]||[];
  const plans=[...primary,'complete'];
  return '<span class="nxo-dev-plan-icons" role="group" aria-label="Planes incluidos: '+plans.map(k=>PLAN_INFO[k].label).join(', ')+'">'+
    plans.map(k=>'<span class="nxo-dev-plan-icon nxo-dev-plan-'+k+'" title="Incluido en '+PLAN_INFO[k].label+'" aria-label="'+PLAN_INFO[k].label+'">'+'<img src="'+PLAN_INFO[k].image+'" alt="" loading="lazy" decoding="async" />'+'</span>').join('')+
    '</span>'
}
let scheduled=false,observer=null;
let quickMenuOutsideHandler=null;
let developmentSessionToken='';
let developmentSession=null;
let developmentView='catalog';

function norm(v){
  return String(v||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ').trim().toLowerCase()
}
function iconUrl(name){return ICON_BASE+encodeURIComponent(name)+'.png'}
function escapeHtml(value){
  return String(value??'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;')
}
function statusLabel(value){
  const status=String(value||'').trim().toUpperCase();
  if(status==='ACTIVE')return 'Disponible';
  if(status==='BUILDING')return 'En desarrollo';
  if(status==='PLANNED')return 'Próximamente';
  if(status==='LEGACY')return 'Integración heredada';
  return status||'Información'
}
function scopeLabel(value){
  const scope=String(value||'').trim().toLowerCase();
  if(scope==='personal')return 'Personal';
  if(scope==='workspace')return 'Workspace';
  return value||''
}

function theme(){
  return window.NEXO_THEME_RUNTIME?.getTheme?.()||
    (document.documentElement.dataset.nxoTheme==='night'?'night':'day')
}
function goBack(){
  try{
    const u=new URL(location.href);
    const back=u.searchParams.get('nxoBack');
    if(back){location.assign(back);return}
  }catch(_){}
  if(history.length>1){history.back();return}
  location.assign('/my-site-1/blank-8')
}
function goMySpace(){location.assign('/my-site-1/blank-8')}

function ensureGlobalHeaderRuntime(){
  const expected='20261018-28-global-outside-close';
  if(window.NEXO_GLOBAL_HEADER?.version===expected)return Promise.resolve(window.NEXO_GLOBAL_HEADER);

  try{window.__nexoNativeHeaderCleanup?.()}catch(_){}
  try{window.NEXO_GLOBAL_HEADER?.unmount?.()}catch(_){}
  const stale=document.getElementById('nexo-global-header-runtime-script');
  if(stale)stale.remove();
  try{delete window.NEXO_GLOBAL_HEADER}catch(_){window.NEXO_GLOBAL_HEADER=null}

  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.id='nexo-global-header-runtime-script';
    script.src=GLOBAL_HEADER_RUNTIME;
    script.defer=true;
    script.onload=()=>{
      if(window.NEXO_GLOBAL_HEADER?.version!==expected){
        reject(new Error('GLOBAL_HEADER_VERSION_MISMATCH'));
        return
      }
      resolve(window.NEXO_GLOBAL_HEADER)
    };
    script.onerror=reject;
    document.head.appendChild(script)
  })
}

function developmentLanguage(){
  try{
    const stored=localStorage.getItem('nexoLanguage:v1');
    if(String(stored||'').toLowerCase().startsWith('en'))return'en'
  }catch(_){}
  return String(developmentSession?.profile?.locale||'es').toLowerCase().startsWith('en')?'en':'es'
}

function stripDevelopmentBoot(){
  try{
    const u=new URL(location.href);
    ['nxd','nxds'].forEach(key=>u.searchParams.delete(key));
    history.replaceState(history.state||{},'',u.pathname+u.search+u.hash)
  }catch(_){}
}

async function waitDevelopmentBoot(){
  const deadline=Date.now()+15000;
  while(Date.now()<deadline){
    const q=new URLSearchParams(location.search);
    const token=String(q.get('nxd')||'').trim();
    const state=String(q.get('nxds')||'').trim().toUpperCase();
    if(token)return token;
    if(state==='FAILED')throw new Error('AUTH_REQUIRED');
    await new Promise(resolve=>setTimeout(resolve,120))
  }
  throw new Error('DEVELOPMENT_BOOT_TIMEOUT')
}

async function developmentUiApi(action,payload={}){
  const headers={'Content-Type':'application/json','Accept':'application/json'};
  if(developmentSessionToken)headers.Authorization='Bearer '+developmentSessionToken;
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentUi'),{
    method:'POST',
    cache:'no-store',
    headers,
    body:JSON.stringify({action,...payload})
  });
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.ok){
    const error=new Error(data?.error||'No se pudo cargar la sesión del Centro.');
    error.code=data?.error||'DEVELOPMENT_UI_FAILED';
    throw error
  }
  return data?.data??data
}

async function loadDevelopmentSession(){
  const bootToken=await waitDevelopmentBoot();
  const exchange=await developmentUiApi('exchange',{bootToken});
  developmentSessionToken=String(exchange?.sessionToken||'');
  stripDevelopmentBoot();
  if(!developmentSessionToken)throw new Error('NO_SESSION_TOKEN');
  developmentSession=await developmentUiApi('bootstrap');
  return developmentSession
}

function developmentAccountAction(action){
  const base=developmentBaseUrl();
  const u=new URL(base+'/blank-8');
  if(action==='settings')u.searchParams.set('nxoProfile','settings');
  else u.searchParams.set('nxoAccountAction',action);
  u.searchParams.set('nxoTheme',theme());
  u.searchParams.set('nxoLang',developmentLanguage());
  location.assign(u.href)
}

function mountDevelopmentHeader(){
  const profile=developmentSession?.profile||{displayName:'Usuario Nexo',email:'',photoImage:null};
  const roleKey=developmentSession?.roleKey||(developmentSession?.isWonder?'wonder':'member');
  const roleLabel=developmentSession?.roleLabel||(developmentSession?.isWonder?'Wonder':'Miembro');
  window.NEXO_GLOBAL_HEADER?.mount?.(document.body,{
    active:'development',
    theme:theme(),
    language:developmentLanguage(),
    contextLabel:'Centro de desarrollo',
    navigation:developmentSession?.navigation||{},
    profile,
    roleKey,
    roleLabel,
    onHome:()=>{location.assign(developmentBaseUrl()+'/blank-8');return false},
    onPersonal:()=>{location.assign(developmentBaseUrl()+'/blank-8');return false},
    onWorkspace:(target)=>{
      if(!target?.workspaceId)return false;
      const u=new URL(developmentBaseUrl()+'/blank-8');
      u.searchParams.set('nxoWorkspace',target.workspaceId);
      location.assign(u.href);return false
    },
    onDevelopment:()=>false,
    onTheme:()=>{
      window.NEXO_THEME_RUNTIME?.toggleTheme?.({persist:true,notify:true});
      requestAnimationFrame(mountDevelopmentHeader)
    },
    onLanguage:()=>{
      const next=developmentLanguage()==='en'?'es':'en';
      try{localStorage.setItem('nexoLanguage:v1',next)}catch(_){}
      if(developmentSession?.profile)developmentSession.profile.locale=next;
      mountDevelopmentHeader()
    },
    onProfileSettings:()=>developmentAccountAction('settings'),
    onSwitchAccount:()=>developmentAccountAction('switch'),
    onLogout:()=>developmentAccountAction('logout')
  })
}


let nxoOrganicRaf=0,nxoOrganicResize=null,nxoOrganicStarted=false;
function ensureOrganicLayers(){
  let root=document.getElementById('nxo-dev-background-root');
  if(!root){
    root=document.createElement('div');
    root.id='nxo-dev-background-root';
    root.setAttribute('aria-hidden','true');
    document.body.prepend(root)
  }
  let c=root.querySelector('#nxo-organic-canvas');
  let film=root.querySelector('#nxo-theme-film');
  if(!c){
    c=document.createElement('canvas');
    c.id='nxo-organic-canvas';
    c.setAttribute('aria-hidden','true');
    root.appendChild(c)
  }
  if(!film){
    film=document.createElement('div');
    film.id='nxo-theme-film';
    film.setAttribute('aria-hidden','true');
    root.appendChild(film)
  }
  return {r:root,c,film,layer:null}
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
  const themeMode=()=>theme()==='night'?'night':'day';
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
function showDevelopmentLoading(label='Abriendo Centro de desarrollo…'){
  ensureOrganicLayers();
  mountNexoOrganicBackground();
  let loading=document.getElementById('nxo-dev-loading');
  if(!loading){
    loading=document.createElement('div');
    loading.id='nxo-dev-loading';
    loading.className='nxo-loading';
    document.body.appendChild(loading)
  }
  loading.innerHTML='<div><div class="nxo-spinner"></div><strong>'+escapeHtml(label)+'</strong><p class="nxo-muted">Preparando tu contexto Nexo.</p></div>';
  loading.hidden=false
}
function hideDevelopmentLoading(){
  document.getElementById('nxo-dev-loading')?.remove()
}

function ensureThemeRuntime(){
  if(window.NEXO_THEME_RUNTIME)return Promise.resolve(window.NEXO_THEME_RUNTIME.ready);
  return new Promise((resolve,reject)=>{
    let script=document.getElementById('nxo-theme-runtime');
    if(!script){
      script=document.createElement('script');
      script.id='nxo-theme-runtime';
      script.src=THEME_RUNTIME;
      script.defer=true;
      script.onload=()=>resolve(window.NEXO_THEME_RUNTIME?.ready);
      script.onerror=reject;
      document.head.appendChild(script)
    }else{
      script.addEventListener('load',()=>resolve(window.NEXO_THEME_RUNTIME?.ready),{once:true});
      script.addEventListener('error',reject,{once:true})
    }
  })
}

function ensureStyle(){
  if(document.getElementById('nxo-dev-center-css'))return;
  const style=document.createElement('style');
  style.id='nxo-dev-center-css';
  style.textContent=`
#nxo-dev-header,#nxo-shared-header{display:none!important}

#nxo-dev-background-root{position:fixed;inset:0;z-index:2147482000;pointer-events:none;overflow:hidden;background:#0c1224}
#nxo-dev-background-root #nxo-organic-canvas{position:fixed;inset:0;width:100vw;height:100vh;display:block;pointer-events:none;z-index:1}
#nxo-dev-background-root #nxo-theme-film{position:fixed;inset:0;z-index:2;pointer-events:none;transition:background .22s ease}
html[data-nxo-theme="day"] #nxo-dev-background-root #nxo-theme-film{background:rgba(248,246,239,.42);-webkit-backdrop-filter:blur(.35px);backdrop-filter:blur(.35px)}
html[data-nxo-theme="night"] #nxo-dev-background-root #nxo-theme-film{background:rgba(5,8,14,.30)}
#nxo-dev-loading{position:fixed;inset:0;z-index:2147483100;min-height:100dvh;display:grid;place-items:center;padding:22px;text-align:center;color:var(--nxo-text-primary);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:transparent}
#nxo-dev-loading[hidden]{display:none!important}
#nxo-dev-loading .nxo-spinner{width:42px;height:42px;border:3px solid rgba(184,197,216,.18);border-top-color:var(--nxo-accent);border-radius:50%;animation:nxodevspin .78s linear infinite;margin:0 auto 13px}
#nxo-dev-loading strong{display:block;font-size:14px}
#nxo-dev-loading .nxo-muted{margin:7px 0 0;color:var(--nxo-text-secondary);font-size:12px}
@keyframes nxodevspin{to{transform:rotate(360deg)}}

/* DEVELOPMENT CENTER · Canonical visual contract
   Values come only from Nexo theme-runtime semantic variables. */
#nxo-dev-header{
  position:sticky;top:0;z-index:2147483200;
  min-height:64px;padding:0 22px;
  display:flex;align-items:center;gap:22px;
  color:var(--nxo-header-text);
  background:var(--nxo-header-background);
  border-bottom:1px solid var(--nxo-header-border);
  box-shadow:0 10px 28px var(--nxo-shadow);
  -webkit-backdrop-filter:blur(18px) saturate(120%);
  backdrop-filter:blur(18px) saturate(120%);
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif
}
.nxo-dev-brand{
  display:flex;align-items:center;gap:10px;min-width:190px;
  color:var(--nxo-header-text);text-decoration:none;cursor:pointer
}
.nxo-dev-mark{
  width:38px;height:38px;flex:0 0 38px;
  display:grid;place-items:center;border-radius:11px;
  background:var(--nxo-accent);
  border:1px solid color-mix(in srgb,var(--nxo-header-text) 24%,transparent);
  box-shadow:0 8px 22px var(--nxo-shadow),inset 0 1px 0 color-mix(in srgb,var(--nxo-header-text) 16%,transparent);
  overflow:hidden
}
.nxo-dev-mark img{display:block;width:31px;height:31px;object-fit:contain}
html[data-nxo-theme="night"] #nxo-dev-header .nxo-dev-mark{
  background:#0A0D12;
  border-color:rgba(255,255,255,.10);
  box-shadow:0 8px 22px var(--nxo-shadow),inset 0 1px 0 rgba(255,255,255,.06)
}
.nxo-dev-brand-copy{display:grid;min-width:0}
.nxo-dev-brand-copy strong{font-size:13px;line-height:1.1;color:var(--nxo-header-text)}
.nxo-dev-brand-copy small{
  margin-top:3px;color:var(--nxo-header-muted);font-size:10px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px
}
.nxo-dev-nav{
  align-self:stretch;display:flex;align-items:stretch;gap:18px;flex:1;min-width:0
}
.nxo-dev-nav-button{
  position:relative;appearance:none;border:0;background:transparent;
  color:var(--nxo-header-muted);padding:0 2px;
  font:760 12px/1 Inter,system-ui,sans-serif;cursor:pointer;white-space:nowrap
}
.nxo-dev-nav-button::after{
  content:"";position:absolute;left:0;right:0;bottom:0;height:3px;
  border-radius:3px 3px 0 0;background:transparent
}
.nxo-dev-nav-button:hover,.nxo-dev-nav-button:focus-visible{
  color:var(--nxo-header-text);outline:none
}
.nxo-dev-nav-button:hover::after,.nxo-dev-nav-button:focus-visible::after{
  background:var(--nxo-interaction)
}
.nxo-dev-nav-button.active{color:var(--nxo-header-active);font-weight:900}
.nxo-dev-nav-button.active::after{background:var(--nxo-header-active)}
.nxo-dev-utils{position:relative;display:flex;align-items:center;gap:8px;margin-left:auto}
.nxo-dev-quick-wrap{position:relative;display:flex;align-items:center}
.nxo-dev-quick-button{
  appearance:none;width:38px;height:38px;padding:0;display:grid;place-items:center;
  border:1px solid color-mix(in srgb,var(--nxo-header-text) 12%,transparent);
  border-radius:11px;background:color-mix(in srgb,var(--nxo-header-text) 7%,transparent);
  color:var(--nxo-header-text);cursor:pointer
}
.nxo-dev-quick-button img{display:block;width:18px;height:18px;object-fit:contain}
.nxo-dev-quick-button:hover,.nxo-dev-quick-button:focus-visible,.nxo-dev-quick-button[aria-expanded="true"]{
  outline:none;background:var(--nxo-interaction);border-color:var(--nxo-interaction);color:var(--nxo-interaction-contrast)
}
.nxo-dev-quick-menu{
  display:none;position:absolute;right:0;top:calc(100% + 8px);z-index:30;
  width:230px;overflow:hidden;border:1px solid var(--nxo-border);
  border-radius:14px;background:var(--nxo-surface-raised);
  color:var(--nxo-text-primary);box-shadow:var(--nxo-modal-shadow)
}
.nxo-dev-quick-menu.open{display:block}
.nxo-dev-quick-title{
  padding:10px 12px 7px;color:var(--nxo-text-muted);
  font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase
}
.nxo-dev-quick-row{
  appearance:none;width:100%;min-height:42px;padding:0 12px;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  border:0;border-top:1px solid var(--nxo-border);
  background:transparent;color:var(--nxo-text-primary);
  font:760 11px/1 Inter,system-ui,sans-serif;cursor:pointer
}
.nxo-dev-quick-label{display:flex;align-items:center;gap:8px}
.nxo-dev-quick-label img{width:17px;height:17px;display:block;object-fit:contain}
.nxo-dev-quick-row strong{
  min-width:42px;padding:3px 7px;border:1px solid var(--nxo-border);
  border-radius:999px;color:var(--nxo-text-secondary);
  background:var(--nxo-accent-soft);font-size:9px;text-align:center
}
html[data-nxo-theme="day"] .nxo-dev-quick-row:hover,
html[data-nxo-theme="day"] .nxo-dev-quick-row:focus-visible{
  outline:none;color:var(--nxo-text-primary);background:var(--nxo-interaction)
}
html[data-nxo-theme="night"] .nxo-dev-quick-row:hover,
html[data-nxo-theme="night"] .nxo-dev-quick-row:focus-visible{
  outline:none;color:var(--nxo-accent-contrast);background:var(--nxo-interaction)
}
html[data-nxo-theme="night"] .nxo-dev-quick-row:hover strong,
html[data-nxo-theme="night"] .nxo-dev-quick-row:focus-visible strong{
  color:var(--nxo-accent-contrast);
  border-color:color-mix(in srgb,var(--nxo-accent-contrast) 28%,transparent);
  background:color-mix(in srgb,var(--nxo-accent-contrast) 8%,transparent)
}

/* Canonical owned Development Center shell.
   Geometry restored from the previously approved Development Center layout. */
#PAGES_CONTAINER{
  display:none!important
}
#nxo-dev-app{
  position:relative!important;
  z-index:2147482001!important;
  min-height:calc(100vh - var(--nexo-global-header-height,68px))!important;
  width:100%!important;
  box-sizing:border-box!important;
  color:var(--nxo-text-primary)!important;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important
}
html[data-nxo-theme="day"] #nxo-dev-app,
html[data-nxo-theme="night"] #nxo-dev-app{
  background:transparent!important
}
#nxo-dev-app .nxo-dev-owned-shell[hidden]{display:none!important}
.nxo-dev-owned-shell{
  width:min(1120px,100%);
  height:calc(100vh - var(--nexo-global-header-height,68px));
  height:calc(100dvh - var(--nexo-global-header-height,68px));
  margin:auto;
  padding:42px 20px 60px;
  box-sizing:border-box;
  display:flex;
  flex-direction:column;
  overflow:hidden
}
.nxo-dev-owned-hero{
  flex:0 0 auto;
  margin-bottom:28px
}
.nxo-dev-owned-catalog-frame{
  position:relative;
  flex:1 1 auto;
  min-height:0
}
@media(min-width:900px){
  .nxo-dev-owned-shell{
    overflow:visible
  }
  .nxo-dev-owned-catalog-frame{
    width:calc(100vw - 414px);
    max-width:none;
    left:calc(50% - 50vw + 24px);
    margin-right:auto
  }
  .nxo-dev-owned-grid{
    column-gap:8px;
    row-gap:16px
  }
}
.nxo-dev-owned-catalog-scroll{
  width:100%;
  height:100%;
  min-height:0;
  overflow-y:auto;
  overflow-x:hidden;
  overscroll-behavior:contain;
  scrollbar-width:none;
  -ms-overflow-style:none
}
.nxo-dev-owned-catalog-scroll::-webkit-scrollbar{
  width:0!important;
  height:0!important;
  display:none!important
}
.nxo-dev-scroll-arrow{
  position:absolute;
  right:3px;
  z-index:6;
  width:28px;
  height:28px;
  display:grid;
  place-items:center;
  padding:0;
  border:0;
  background:transparent;
  color:var(--nxo-accent);
  font:900 18px/1 Arial,sans-serif;
  cursor:pointer;
  opacity:.92;
  text-shadow:0 0 7px color-mix(in srgb,var(--nxo-accent) 78%,transparent);
  filter:drop-shadow(0 0 5px color-mix(in srgb,var(--nxo-accent) 52%,transparent));
  transition:opacity .15s ease,filter .15s ease,transform .15s ease
}
.nxo-dev-scroll-arrow:hover:not(:disabled),
.nxo-dev-scroll-arrow:focus-visible:not(:disabled){
  opacity:1;
  transform:scale(1.12);
  outline:none;
  filter:drop-shadow(0 0 9px color-mix(in srgb,var(--nxo-accent) 88%,transparent))
}
.nxo-dev-scroll-arrow:disabled{
  opacity:.16;
  cursor:default;
  filter:none;
  text-shadow:none;
  transform:none
}
.nxo-dev-scroll-arrow.up{top:1px}
.nxo-dev-scroll-arrow.down{bottom:1px}
.nxo-dev-owned-eyebrow{
  font-size:11px;
  font-weight:800;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--nxo-accent)
}
.nxo-dev-owned-hero h1{
  font-size:clamp(30px,5vw,48px);
  margin:6px 0 10px;
  letter-spacing:-.03em;
  color:var(--nxo-text-primary)
}
.nxo-dev-owned-hero p{
  max-width:760px;
  color:var(--nxo-text-secondary);
  font-size:14px;
  line-height:1.65;
  margin:0
}
.nxo-dev-owned-grid{
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:16px
}
.nxo-dev-owned-slot{
  width:100%;
  min-width:0;
  background:transparent
}

/* Exact compact marketplace geometry restored from the approved runtime. */
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"]{
  width:75%!important;
  max-width:75%!important;
  box-sizing:border-box!important;
  margin-right:auto!important;
  min-height:0!important;
  padding:14px 14px!important;
  display:flex!important;
  flex-direction:column!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row{
  display:flex!important;
  align-items:center!important;
  justify-content:flex-start!important;
  gap:10px!important;
  width:100%!important;
  margin:0 0 8px!important;
  padding:0!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-icon-slot="1"]{
  flex:0 0 46px!important;
  width:46px!important;
  height:46px!important;
  min-width:46px!important;
  min-height:46px!important;
  margin:0!important;
  display:block!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-product-icon{
  display:block!important;
  width:46px!important;
  height:46px!important;
  min-width:46px!important;
  min-height:46px!important;
  max-width:46px!important;
  max-height:46px!important;
  margin:0!important;
  object-fit:contain!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-tool-title]{
  flex:1 1 auto!important;
  min-width:0!important;
  margin:4px 0 8px!important;
  padding:0!important;
  font-size:20px!important;
  line-height:1.2!important;
  color:var(--nxo-text-primary)!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] [data-nxo-dev-description="1"],
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] [data-nxo-dev-tag="1"]{
  display:none!important
}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-action{
  margin-top:8px!important;
  align-self:flex-start!important;
  padding:9px 13px!important;
  font-weight:700!important;
  font-size:11px!important;
  line-height:1.2!important
}
@media(max-width:760px){
  .nxo-dev-owned-shell{
    height:calc(100vh - 58px);
    height:calc(100dvh - 58px);
    padding:28px 14px 44px
  }
  .nxo-dev-owned-grid{grid-template-columns:1fr}
  html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"]{
    width:100%!important;
    max-width:100%!important;
    padding:11px 12px!important
  }
  html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-icon-slot="1"],
  html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-product-icon{
    flex-basis:42px!important;
    width:42px!important;
    height:42px!important;
    min-width:42px!important;
    min-height:42px!important;
    max-width:42px!important;
    max-height:42px!important
  }
}

/* Stage 2 · individual tool detail view. */
#nxo-dev-tool-detail[hidden]{display:none!important}
#nxo-dev-tool-detail{
  width:min(1120px,100%);
  height:calc(100vh - 64px);
  height:calc(100dvh - 64px);
  margin:0 auto;
  padding:28px 20px 38px;
  box-sizing:border-box;
  color:var(--nxo-text-primary)
}
#nxo-dev-tool-detail .nxo-dev-detail-return-bar{display:flex!important;align-items:center;justify-content:flex-start;position:relative;z-index:20;padding:4px 4px 10px}
#nxo-dev-tool-detail .nxo-dev-detail-return-bar .nxo-dev-detail-back{display:inline-flex!important;visibility:visible!important;opacity:1!important;position:relative!important;align-items:center;justify-content:center;gap:10px;width:auto!important;min-width:178px;height:42px;padding:0 14px!important;border:1px solid #284886;border-radius:10px;background:#284886;color:#fff;font:800 13px system-ui,sans-serif;cursor:pointer}
#nxo-dev-tool-detail .nxo-dev-detail-return-bar .nxo-dev-detail-back span{font-size:22px;line-height:1}
.nxo-dev-detail-scroll{
  height:100%;
  overflow-y:auto;
  overflow-x:hidden;
  scrollbar-width:none;
  -ms-overflow-style:none;
  padding:2px 4px 28px
}
.nxo-dev-detail-scroll::-webkit-scrollbar{display:none;width:0;height:0}
.nxo-dev-detail-back{
  appearance:none;
  width:38px;height:38px;padding:0;
  display:grid;place-items:center;
  border:1px solid color-mix(in srgb,var(--nxo-text-primary) 12%,var(--nxo-border));
  border-radius:11px;
  background:var(--nxo-surface-glass);
  color:var(--nxo-text-primary);
  cursor:pointer;
  box-shadow:0 7px 18px var(--nxo-shadow)
}
.nxo-dev-detail-back img{
  display:block;width:18px;height:18px;object-fit:contain
}
.nxo-dev-detail-back:hover,.nxo-dev-detail-back:focus-visible{
  outline:none;
  background:var(--nxo-interaction);
  border-color:var(--nxo-interaction);
  color:var(--nxo-interaction-contrast);
  transform:translateY(-1px)
}
.nxo-dev-detail-hero{
  display:flex;
  align-items:center;
  gap:16px;
  margin:24px 0 20px
}
.nxo-dev-detail-icon-wrap{
  width:70px;height:70px;flex:0 0 70px;
  display:grid;place-items:center;
  border:1px solid var(--nxo-border);
  border-radius:20px;
  background:var(--nxo-surface-glass);
  box-shadow:0 12px 28px var(--nxo-shadow)
}
.nxo-dev-detail-icon{width:52px;height:52px;display:block;object-fit:contain}
.nxo-dev-detail-heading{min-width:0}
.nxo-dev-detail-eyebrow{
  margin-bottom:5px;
  font-size:10px;
  font-weight:850;
  letter-spacing:.11em;
  text-transform:uppercase;
  color:var(--nxo-accent)
}
.nxo-dev-plan-icons{display:inline-flex;gap:5px;align-items:center;flex-wrap:wrap;max-width:100%}
.nxo-dev-plan-icon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;flex:0 0 44px;background:transparent;border:0;border-radius:0;box-shadow:none;padding:0;line-height:1}\n.nxo-dev-plan-icon img{display:block;width:100%;height:100%;object-fit:contain;border:0;background:transparent}\n.nxo-dev-plan-card{margin:0 0 5px;align-self:flex-start}

/* Plan PNG badges: only compact in the catalog title row; detail unchanged. */
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-plan-card{display:inline-flex!important;position:static!important;align-items:center!important;align-self:center!important;flex:0 0 auto!important;width:auto!important;margin:0 0 0 2px!important;padding:0!important}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-plan-icons{display:inline-flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:3px!important}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-plan-icon{width:24px!important;height:24px!important;min-width:24px!important;min-height:24px!important;flex:0 0 24px!important;border:0!important;background:transparent!important;box-shadow:none!important}
html[data-nxo-theme] #nxo-dev-app [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-plan-icon img{display:block!important;width:24px!important;height:24px!important;object-fit:contain!important}
.nxo-dev-detail-title-line{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.nxo-dev-detail-title-line .nxo-dev-plan-icons{flex-shrink:0}
.nxo-dev-detail-title{
  margin:0;
  font-size:clamp(26px,4vw,40px);
  line-height:1.08;
  letter-spacing:-.025em;
  color:var(--nxo-text-primary)
}
.nxo-dev-detail-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
.nxo-dev-detail-chip{
  display:inline-flex;align-items:center;min-height:25px;
  padding:4px 9px;border:1px solid var(--nxo-border);border-radius:999px;
  background:var(--nxo-surface-glass);color:var(--nxo-text-secondary);
  font-size:10px;font-weight:760
}
.nxo-dev-detail-chip.status{
  color:var(--nxo-accent);
  border-color:color-mix(in srgb,var(--nxo-accent) 34%,var(--nxo-border))
}
.nxo-dev-detail-description{
  max-width:880px;margin:0 0 22px;color:var(--nxo-text-secondary);
  font-size:14px;line-height:1.7
}
.nxo-dev-detail-grid{
  display:grid;
  grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);
  gap:14px;align-items:start
}
.nxo-dev-detail-card{
  border:1px solid var(--nxo-border);border-radius:18px;
  background:var(--nxo-surface-glass);box-shadow:0 12px 32px var(--nxo-shadow);
  padding:17px
}
.nxo-dev-detail-card + .nxo-dev-detail-card{margin-top:14px}
.nxo-dev-detail-card h3{margin:0 0 11px;color:var(--nxo-text-primary);font-size:13px;line-height:1.2}
.nxo-dev-detail-list{margin:0;padding:0;list-style:none;display:grid;gap:8px}
.nxo-dev-detail-list li{
  position:relative;padding-left:16px;color:var(--nxo-text-secondary);
  font-size:12px;line-height:1.5
}
.nxo-dev-detail-list li::before{
  content:'';position:absolute;left:1px;top:.58em;width:6px;height:6px;
  border-radius:50%;background:var(--nxo-accent);
  box-shadow:0 0 8px color-mix(in srgb,var(--nxo-accent) 46%,transparent)
}
.nxo-dev-detail-empty{color:var(--nxo-text-muted);font-size:12px;line-height:1.5}
.nxo-dev-reviews{margin-top:14px}
.nxo-dev-reviews-summary{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.nxo-dev-reviews-score{font-size:24px;font-weight:900;color:var(--nxo-text-primary)}
.nxo-dev-stars{letter-spacing:2px;color:var(--nxo-accent);font-size:16px}
.nxo-dev-review-list{display:grid;gap:9px}
.nxo-dev-review-item{padding:12px;border:1px solid var(--nxo-border);border-radius:14px;background:var(--nxo-surface-glass)}
.nxo-dev-review-item-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:6px}
.nxo-dev-review-item strong{font-size:11px;color:var(--nxo-text-primary)}
.nxo-dev-review-item p{margin:0;color:var(--nxo-text-secondary);font-size:12px;line-height:1.5;white-space:pre-wrap}
.nxo-dev-review-form{display:grid;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid var(--nxo-border)}
.nxo-dev-review-picker{display:flex;gap:5px}
.nxo-dev-review-star{appearance:none;border:0;background:transparent;color:var(--nxo-text-muted);font-size:25px;line-height:1;cursor:pointer;padding:2px}
.nxo-dev-review-star.selected{color:var(--nxo-accent)}
.nxo-dev-review-text{width:100%;min-height:88px;resize:vertical;box-sizing:border-box;border:1px solid var(--nxo-border);border-radius:12px;background:var(--nxo-surface-glass);color:var(--nxo-text-primary);padding:10px;font:500 12px/1.5 Inter,system-ui,sans-serif}
.nxo-dev-review-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.nxo-dev-review-save,.nxo-dev-review-remove{appearance:none;border:1px solid var(--nxo-border);border-radius:11px;padding:9px 12px;background:var(--nxo-surface-glass);color:var(--nxo-text-primary);font:760 11px/1 Inter,system-ui,sans-serif;cursor:pointer}
.nxo-dev-review-save{background:var(--nxo-accent);color:var(--nxo-accent-contrast);border-color:var(--nxo-accent)}
.nxo-dev-review-note{font-size:10px;color:var(--nxo-text-muted)}
.nxo-dev-detail-loading,.nxo-dev-detail-error{
  margin-top:28px;padding:18px;border:1px solid var(--nxo-border);
  border-radius:16px;background:var(--nxo-surface-glass);
  color:var(--nxo-text-secondary);font-size:13px
}
.nxo-dev-detail-error{color:var(--nxo-danger)}
.nxo-dev-install-card{
  margin:0 0 18px;
  padding:16px;
  border:1px solid var(--nxo-border);
  border-radius:18px;
  background:var(--nxo-surface-glass);
  box-shadow:0 12px 30px var(--nxo-shadow)
}
.nxo-dev-install-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom:12px
}
.nxo-dev-install-head h3{
  margin:0 0 4px;
  font-size:14px;
  color:var(--nxo-text-primary)
}
.nxo-dev-install-head p{
  margin:0;
  color:var(--nxo-text-muted);
  font-size:11px;
  line-height:1.45
}
.nxo-dev-install-state{
  min-height:24px;
  display:inline-flex;
  align-items:center;
  padding:4px 9px;
  border:1px solid var(--nxo-border);
  border-radius:999px;
  color:var(--nxo-text-secondary);
  background:var(--nxo-accent-soft);
  font-size:9px;
  font-weight:800;
  white-space:nowrap
}
.nxo-dev-install-destinations{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(210px,1fr));
  gap:8px;
  margin:12px 0
}
.nxo-dev-install-destination{
  appearance:none;
  min-height:58px;
  padding:10px 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  text-align:left;
  border:1px solid var(--nxo-border);
  border-radius:13px;
  background:var(--nxo-surface-raised);
  color:var(--nxo-text-primary);
  cursor:pointer;
  transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease
}
.nxo-dev-install-destination:hover:not(:disabled),
.nxo-dev-install-destination:focus-visible:not(:disabled){
  outline:none;
  transform:translateY(-1px);
  border-color:var(--nxo-interaction);
  box-shadow:0 0 0 2px var(--nxo-focus-ring)
}
.nxo-dev-install-destination.selected{
  border-color:var(--nxo-accent);
  box-shadow:0 0 0 2px var(--nxo-focus-ring)
}
.nxo-dev-install-destination:disabled{
  cursor:not-allowed;
  opacity:.46
}
.nxo-dev-install-destination strong{
  display:block;
  font-size:11px;
  line-height:1.25
}
.nxo-dev-install-destination small{
  display:block;
  margin-top:3px;
  color:var(--nxo-text-muted);
  font-size:9px;
  line-height:1.3
}
.nxo-dev-install-badge{
  flex:0 0 auto;
  font-size:8px;
  font-weight:850;
  text-transform:uppercase;
  letter-spacing:.05em;
  color:var(--nxo-accent)
}
.nxo-dev-install-actions{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:8px;
  margin-top:12px
}
.nxo-dev-install-primary,
.nxo-dev-install-open{
  appearance:none;
  min-height:36px;
  padding:0 14px;
  border:1px solid var(--nxo-header-border);
  border-radius:10px;
  background:var(--nxo-header-background);
  color:var(--nxo-header-text);
  font:800 11px/1 Inter,system-ui,sans-serif;
  cursor:pointer
}
.nxo-dev-install-primary:hover:not(:disabled),
.nxo-dev-install-primary:focus-visible:not(:disabled),
.nxo-dev-install-open:hover,
.nxo-dev-install-open:focus-visible{
  outline:none;
  background:var(--nxo-interaction);
  border-color:var(--nxo-interaction);
  color:var(--nxo-interaction-contrast)
}
.nxo-dev-install-primary:disabled{
  cursor:wait;
  opacity:.58
}
.nxo-dev-install-message{
  color:var(--nxo-text-secondary);
  font-size:10px;
  line-height:1.45
}
.nxo-dev-install-message.success{color:var(--nxo-positive)}
.nxo-dev-install-message.error{color:var(--nxo-danger)}
.nxo-dev-install-unavailable{
  color:var(--nxo-text-muted);
  font-size:11px;
  line-height:1.5
}

@media(max-width:760px){
  #nxo-dev-tool-detail{
    height:calc(100vh - 58px);
    height:calc(100dvh - 58px);
    padding:20px 14px 30px
  }
  .nxo-dev-detail-hero{align-items:flex-start;gap:12px}
  .nxo-dev-detail-icon-wrap{width:58px;height:58px;flex-basis:58px;border-radius:16px}
  .nxo-dev-detail-icon{width:44px;height:44px}
  .nxo-dev-detail-grid{grid-template-columns:1fr}
}

/* Tool cards use the same semantic glass contract as Mi Espacio. */
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]{
  position:relative!important;overflow:hidden!important;
  color:var(--nxo-text-primary)!important;
  border:1px solid var(--nxo-border)!important;
  border-radius:18px!important;
  background:var(--nxo-surface-glass)!important;
  -webkit-backdrop-filter:blur(16px) saturate(118%)!important;
  backdrop-filter:blur(16px) saturate(118%)!important;
  box-shadow:0 14px 34px var(--nxo-shadow),inset 0 1px 0 color-mix(in srgb,var(--nxo-text-primary) 5%,transparent)!important;
  transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease,background .16s ease!important
}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]::before{
  content:"";position:absolute;inset:0 auto auto 0;width:100%;height:2px;
  background:linear-gradient(90deg,var(--nxo-accent),var(--nxo-interaction),var(--nxo-positive));
  opacity:.66;pointer-events:none
}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]:hover,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]:focus-within{
  transform:translateY(-3px)!important;
  border-color:var(--nxo-interaction)!important;
  background:var(--nxo-surface-glass-hover)!important;
  box-shadow:0 18px 38px var(--nxo-shadow),0 0 0 2px var(--nxo-focus-ring)!important
}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] h1,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] h2,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] h3,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] h4,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] strong{color:var(--nxo-text-primary)!important}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] p,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"] small{color:var(--nxo-text-muted)!important}

/* Real CTA controls inside tool cards. The runtime marks the actual Wix surface. */
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) .nxo-dev-action,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) .nxo-dev-action-surface{
  color:var(--nxo-header-text)!important;
  background:var(--nxo-header-background)!important;
  border-color:var(--nxo-header-border)!important;
  border-style:solid!important;
  border-width:1px!important;
  border-radius:10px!important;
  box-shadow:none!important;
  transition:background .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease!important
}
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) .nxo-dev-action *,
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) .nxo-dev-action-surface *{
  color:inherit!important
}
html[data-nxo-theme="day"] .nxo-dev-action:hover,
html[data-nxo-theme="day"] .nxo-dev-action:focus-visible,
html[data-nxo-theme="day"] .nxo-dev-action:hover .nxo-dev-action-surface,
html[data-nxo-theme="day"] .nxo-dev-action:focus-visible .nxo-dev-action-surface{
  color:var(--nxo-interaction-contrast)!important;
  background:var(--nxo-interaction)!important;
  border-color:var(--nxo-border-strong)!important;
  box-shadow:0 10px 20px var(--nxo-shadow),0 0 0 3px var(--nxo-focus-ring)!important;
  outline:none!important
}
html[data-nxo-theme="night"] .nxo-dev-action:hover,
html[data-nxo-theme="night"] .nxo-dev-action:focus-visible,
html[data-nxo-theme="night"] .nxo-dev-action:hover .nxo-dev-action-surface,
html[data-nxo-theme="night"] .nxo-dev-action:focus-visible .nxo-dev-action-surface{
  color:var(--nxo-interaction-contrast)!important;
  background:var(--nxo-interaction)!important;
  border-color:var(--nxo-interaction)!important;
  box-shadow:0 0 0 3px var(--nxo-focus-ring)!important;
  outline:none!important
}
html[data-nxo-theme] .nxo-dev-action:active{transform:translateY(0) scale(.99)!important}
html[data-nxo-theme] .nxo-dev-action[disabled]{
  cursor:not-allowed!important;
  opacity:.62!important;
  transform:none!important
}
html[data-nxo-theme] .nxo-dev-action[disabled]:hover,
html[data-nxo-theme] .nxo-dev-action[disabled]:focus-visible{
  color:var(--nxo-header-text)!important;
  background:var(--nxo-header-background)!important;
  border-color:var(--nxo-header-border)!important;
  box-shadow:none!important
}
/* Stage 1 preparation · compact marketplace geometry */
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]{
  width:75%!important;
  max-width:75%!important;
  box-sizing:border-box!important;
  margin-right:auto!important;
  padding:12px 14px!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row{
  display:flex!important;
  align-items:center!important;
  justify-content:flex-start!important;
  gap:10px!important;
  width:100%!important;
  margin:0 0 8px!important;
  padding:0!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-icon-slot="1"]{
  flex:0 0 46px!important;
  width:46px!important;
  height:46px!important;
  min-width:46px!important;
  min-height:46px!important;
  margin:0!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-product-icon{
  width:46px!important;
  height:46px!important;
  min-width:46px!important;
  min-height:46px!important;
  max-width:46px!important;
  max-height:46px!important;
  margin:0!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-tool-title]{
  flex:1 1 auto!important;
  min-width:0!important;
  margin:0!important;
  padding:0!important
}
@media(max-width:760px){
  html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]{
    width:100%!important;
    max-width:100%!important;
    padding:11px 12px!important
  }
  html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row [data-nxo-dev-icon-slot="1"],
  html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-title-row .nxo-dev-product-icon{
    flex-basis:42px!important;
    width:42px!important;
    height:42px!important;
    min-width:42px!important;
    min-height:42px!important;
    max-width:42px!important;
    max-height:42px!important
  }
}

/* Stage 1 preparation · compact marketplace cards */
html[data-nxo-theme] :is(#PAGES_CONTAINER,#nxo-dev-app) [data-nxo-dev-card="1"]{
  min-height:0!important;
  padding-top:14px!important;
  padding-bottom:14px!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] [data-nxo-dev-description="1"],
html[data-nxo-theme] [data-nxo-dev-card="1"] [data-nxo-dev-tag="1"]{
  display:none!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] [data-nxo-dev-tool-title]{
  margin-top:4px!important;
  margin-bottom:8px!important
}
html[data-nxo-theme] [data-nxo-dev-card="1"] .nxo-dev-action{
  margin-top:8px!important
}

/* Marketplace preview rail */
#nxo-dev-preview{
  position:fixed!important;
  top:var(--nexo-global-header-height,68px)!important;
  right:0!important;
  bottom:0!important;
  left:auto!important;
  z-index:2147483600!important;
  display:block!important;
  visibility:visible!important;
  width:min(360px,88vw)!important;
  box-sizing:border-box!important;
  padding:18px!important;
  color:var(--nxo-text-primary)!important;
  background:var(--nxo-surface-raised)!important;
  border-left:1px solid var(--nxo-border)!important;
  box-shadow:-18px 0 44px var(--nxo-shadow)!important;
  -webkit-backdrop-filter:blur(18px) saturate(118%)!important;
  backdrop-filter:blur(18px) saturate(118%)!important;
  transform:translate3d(102%,0,0)!important;
  opacity:.99!important;
  pointer-events:none!important;
  transition:transform .24s ease!important;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important
}
#nxo-dev-preview.open{
  transform:translate3d(0,0,0)!important;
  pointer-events:auto!important
}
#nxo-dev-preview-handle{
  position:fixed!important;
  right:0!important;
  top:50%!important;
  z-index:2147483599!important;
  width:28px!important;
  height:72px!important;
  display:grid!important;
  place-items:center!important;
  transform:translateY(-50%)!important;
  border:1px solid var(--nxo-header-border)!important;
  border-right:0!important;
  border-radius:12px 0 0 12px!important;
  color:var(--nxo-header-text)!important;
  background:var(--nxo-header-background)!important;
  box-shadow:-8px 0 24px var(--nxo-shadow)!important;
  cursor:pointer!important;
  font:900 20px/1 Inter,system-ui,sans-serif!important;
  transition:background .16s ease,color .16s ease,transform .16s ease!important
}
#nxo-dev-preview-handle:hover,
#nxo-dev-preview-handle:focus-visible{
  outline:none!important;
  color:var(--nxo-interaction-contrast)!important;
  background:var(--nxo-interaction)!important
}
#nxo-dev-preview.open + #nxo-dev-preview-handle{
  transform:translateY(-50%) translateX(100%)!important
}
.nxo-dev-preview-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:18px
}
.nxo-dev-preview-eyebrow{
  color:var(--nxo-text-muted);
  font-size:9px;
  font-weight:850;
  letter-spacing:.08em;
  text-transform:uppercase
}
.nxo-dev-preview-close{
  appearance:none;
  width:34px;height:34px;
  display:grid;place-items:center;
  border:1px solid var(--nxo-border);
  border-radius:10px;
  color:var(--nxo-button-secondary-text);
  background:var(--nxo-button-secondary-bg);
  cursor:pointer
}
.nxo-dev-preview-close:hover,.nxo-dev-preview-close:focus-visible{
  outline:none;
  color:var(--nxo-interaction-contrast);
  background:var(--nxo-interaction);
  border-color:var(--nxo-interaction)
}
.nxo-dev-preview-identity{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:16px
}
.nxo-dev-preview-icon{
  width:54px;height:54px;flex:0 0 54px;
  object-fit:contain;
  filter:drop-shadow(0 6px 10px var(--nxo-shadow))
}
.nxo-dev-preview-title{
  margin:0;
  color:var(--nxo-text-primary);
  font-size:18px;
  line-height:1.2
}
.nxo-dev-preview-copy{
  margin:0;
  color:var(--nxo-text-secondary);
  font-size:13px;
  line-height:1.6
}
[data-nxo-dev-card="1"].nxo-dev-preview-source{
  border-color:var(--nxo-interaction)!important;
  box-shadow:0 18px 38px var(--nxo-shadow),0 0 0 2px var(--nxo-focus-ring)!important
}
@media(max-width:760px){
  #nxo-dev-preview{top:58px!important;width:min(340px,92vw)!important;padding:16px!important}
  #nxo-dev-preview-handle{height:62px!important;width:26px!important}
}

/* Product icon replacement occupies the original icon slot. */
[data-nxo-dev-icon-slot="1"]{
  display:grid!important;place-items:center!important;
  background:transparent!important;color:transparent!important;
  line-height:0!important;overflow:visible!important
}
.nxo-dev-product-icon{
  display:block!important;width:100%!important;height:100%!important;
  max-width:72px!important;max-height:72px!important;min-width:34px!important;min-height:34px!important;
  object-fit:contain!important;object-position:center!important;margin:auto!important;
  filter:drop-shadow(0 6px 10px var(--nxo-shadow))
}

/* White silhouette halo for official icons placed on Nexo blue surfaces. */
html[data-nxo-theme="day"] #nxo-dev-header .nxo-dev-quick-button img,
html[data-nxo-theme="day"] .nxo-dev-action img,
html[data-nxo-theme="day"] .nxo-dev-action-surface img{
  filter:
    drop-shadow(1px 0 0 rgba(255,255,255,.96))
    drop-shadow(-1px 0 0 rgba(255,255,255,.96))
    drop-shadow(0 1px 0 rgba(255,255,255,.96))
    drop-shadow(0 -1px 0 rgba(255,255,255,.96))
    drop-shadow(0 0 4px rgba(255,255,255,.78))!important
}
@media(max-width:760px){
  #nxo-dev-header{min-height:58px;padding:0 12px;gap:10px}
  .nxo-dev-brand{min-width:0}.nxo-dev-brand-copy small{display:none}
  .nxo-dev-nav{gap:10px;overflow:auto;scrollbar-width:none}
  .nxo-dev-nav::-webkit-scrollbar{display:none}
  .nxo-dev-nav-button{font-size:11px}
  .nxo-dev-mark{width:36px;height:36px;flex-basis:36px}
  .nxo-dev-mark img{width:29px;height:29px}
  .nxo-dev-product-icon{max-width:58px!important;max-height:58px!important}
}
/* Centro: el viewport empieza en el borde INFERIOR medido del header. */
#nxo-dev-app{position:fixed!important;top:var(--nxo-dev-header-bottom,68px)!important;right:0!important;bottom:0!important;left:0!important;width:100%!important;height:auto!important;min-height:0!important;overflow:hidden!important;z-index:2147482001!important}
#nxo-dev-app .nxo-dev-owned-shell{height:100%!important;max-height:100%!important;min-height:0!important;padding-bottom:12px!important;overflow:hidden!important}
#nxo-dev-app .nxo-dev-owned-catalog-frame{position:relative!important;left:auto!important;right:auto!important;width:100%!important;max-width:100%!important;min-height:0!important;flex:1 1 auto!important;margin:0!important}
#nxo-dev-app .nxo-dev-owned-catalog-scroll{width:100%!important;height:100%!important;min-height:0!important}
#nxo-dev-app #nxo-dev-tool-detail{height:100%!important;max-height:100%!important;min-height:0!important;display:flex;flex-direction:column;overflow:hidden;padding-top:12px!important;padding-bottom:12px!important}
#nxo-dev-app #nxo-dev-tool-detail[hidden]{display:none!important}
#nxo-dev-app #nxo-dev-tool-detail .nxo-dev-detail-return-bar{flex:0 0 auto;z-index:2}
#nxo-dev-app #nxo-dev-tool-detail .nxo-dev-detail-scroll{flex:1 1 auto;height:auto!important;min-height:0;overflow-y:auto}

/* Centro — ficha emergente independiente y catálogo visible detrás. */
#nxo-dev-app #nxo-dev-tool-detail{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;z-index:100!important;background:rgba(13,26,56,.40)!important;backdrop-filter:blur(12px) saturate(115%)!important;-webkit-backdrop-filter:blur(12px) saturate(115%)!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:18px!important;box-sizing:border-box!important;overflow:hidden!important}
#nxo-dev-app #nxo-dev-tool-detail[hidden]{display:none!important}
#nxo-dev-app #nxo-dev-tool-detail .nxo-dev-detail-modal-panel{position:relative;display:flex;flex-direction:column;min-height:0;width:min(1050px,100%);max-height:100%;overflow:hidden;border:1px solid rgba(255,255,255,.65);border-radius:20px;background:color-mix(in srgb,var(--nxo-background) 84%,transparent);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:0 24px 65px rgba(8,22,48,.30);padding:50px 18px 18px;box-sizing:border-box}
#nxo-dev-app #nxo-dev-tool-detail .nxo-dev-detail-modal-close{position:absolute;z-index:5;top:10px;right:12px;width:38px;height:38px;border-radius:10px;background:#314d87;color:#fff;border:1px solid rgba(255,255,255,.65);font-size:30px;line-height:1;cursor:pointer}
#nxo-dev-app #nxo-dev-tool-detail .nxo-dev-detail-scroll{flex:1 1 auto;min-height:0;height:auto!important;overflow-y:auto;padding:0 5px 18px}
@media(max-width:760px){#nxo-dev-app #nxo-dev-tool-detail{padding:10px!important}#nxo-dev-app #nxo-dev-tool-detail .nxo-dev-detail-modal-panel{padding:50px 10px 10px;border-radius:14px}}
`;
  document.head.appendChild(style)
}

function syncQuickTheme(){
  const current=theme();
  const image=document.querySelector('#nxo-dev-theme-row img');
  const value=document.querySelector('#nxo-dev-theme-row strong');
  if(image)image.src=iconUrl(current==='night'?'modo-oscuro':'modo-claro');
  if(value)value.textContent=current==='night'?'Oscuro':'Claro'
}

function ensureDevelopmentTaxonomyStyle(){
  if(document.getElementById('nxo-dev-taxonomy-css'))return;
  const style=document.createElement('style');
  style.id='nxo-dev-taxonomy-css';
  style.textContent=".nxo-dev-catalog-group{margin-bottom:28px}\n.nxo-dev-catalog-group:last-child{margin-bottom:0}\n.nxo-dev-group-head{display:flex;align-items:end;justify-content:space-between;gap:12px;margin:0 0 12px}\n.nxo-dev-group-head h2{margin:0;color:var(--nxo-text-primary);font-size:15px}\n.nxo-dev-group-head p{margin:4px 0 0;color:var(--nxo-text-muted);font-size:10px;line-height:1.45}\n.nxo-dev-kind-badge{\n  width:max-content;margin:0 0 8px;padding:4px 7px;border:1px solid var(--nxo-border);\n  border-radius:999px;background:var(--nxo-accent-soft);color:var(--nxo-text-secondary);\n  font-size:8px;font-weight:900;letter-spacing:.055em;text-transform:uppercase\n}\n.nxo-dev-kind-badge.environment{color:var(--nxo-accent)}\n.nxo-dev-kind-badge.addon{color:var(--nxo-positive)}\n.nxo-dev-tree-button{\n  margin-top:15px;padding:9px 12px;border:1px solid var(--nxo-border-strong);border-radius:11px;\n  background:var(--nxo-accent-soft);color:var(--nxo-text-primary);font:800 11px/1 Inter,system-ui,sans-serif;cursor:pointer\n}\n.nxo-dev-tree-button:hover,.nxo-dev-tree-button:focus-visible{outline:none;background:var(--nxo-interaction);color:var(--nxo-interaction-contrast)}\n.nxo-dev-tree-view[hidden],.nxo-dev-catalog-view[hidden]{display:none!important}\n.nxo-dev-tree-view{height:100%;overflow:auto;padding:2px 4px 30px}\n.nxo-dev-tree-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}\n.nxo-dev-tree-toolbar h2{margin:0;color:var(--nxo-text-primary);font-size:18px}\n.nxo-dev-tree-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.nxo-dev-tree-branch{border:1px solid var(--nxo-border);border-radius:15px;background:var(--nxo-surface-glass);padding:14px}\n.nxo-dev-tree-branch h3{margin:0 0 8px;color:var(--nxo-text-primary);font-size:13px}\n.nxo-dev-tree-branch p{margin:0 0 9px;color:var(--nxo-text-muted);font-size:10px;line-height:1.45}\n.nxo-dev-tree-branch ul{margin:0;padding-left:17px;color:var(--nxo-text-secondary);font-size:10px;line-height:1.65}\n.nxo-dev-tree-branch strong{color:var(--nxo-text-primary)}\n@media(max-width:760px){.nxo-dev-tree-grid{grid-template-columns:1fr}.nxo-dev-group-head{align-items:start;flex-direction:column}}\n\n";
  document.head.appendChild(style)
}

let previewCloseTimer=null;
let previewPinned=false;

function toolForCard(card){
  if(!card)return null;
  return TOOL_DEFS.find(tool=>tool.key===card.dataset.nxoDevTool)||null
}
function ensurePreviewPanel(){
  let panel=document.getElementById('nxo-dev-preview');
  let handle=document.getElementById('nxo-dev-preview-handle');

  if(!panel){
    panel=document.createElement('aside');
    panel.id='nxo-dev-preview';
    panel.setAttribute('aria-hidden','true');
    panel.innerHTML=
      '<div class="nxo-dev-preview-head">'+
        '<div class="nxo-dev-preview-eyebrow">Resumen de la herramienta</div>'+
        '<button type="button" class="nxo-dev-preview-close" aria-label="Cerrar">×</button>'+
      '</div>'+
      '<div class="nxo-dev-preview-identity">'+
        '<img class="nxo-dev-preview-icon" alt="">'+
        '<h3 class="nxo-dev-preview-title">Selecciona una herramienta</h3>'+
      '</div>'+
      '<p class="nxo-dev-preview-copy">Pasa el cursor sobre una herramienta para ver un resumen rápido.</p>';
    document.body.appendChild(panel);

    panel.querySelector('.nxo-dev-preview-close')?.addEventListener('click',()=>{
      previewPinned=false;
      closePreview(true)
    });
    panel.addEventListener('pointerenter',()=>clearTimeout(previewCloseTimer));
    panel.addEventListener('pointerleave',()=>{
      if(!previewPinned)schedulePreviewClose()
    })
  }

  if(!handle){
    handle=document.createElement('button');
    handle.id='nxo-dev-preview-handle';
    handle.type='button';
    handle.setAttribute('aria-label','Abrir resumen de herramienta');
    handle.textContent='‹';
    document.body.appendChild(handle);
    handle.addEventListener('click',()=>{
      const current=TOOL_DEFS.find(tool=>tool.key===panel.dataset.toolKey)||null;
      if(panel.classList.contains('open')){
        previewPinned=false;
        closePreview(true);
        return
      }
      if(current){
        previewPinned=true;
        openPreview(current,document.querySelector('[data-nxo-dev-tool="'+CSS.escape(current.key)+'"]'),{pinned:true})
      }else{
        panel.classList.add('open');
        panel.setAttribute('aria-hidden','false')
      }
    })
  }

  return panel
}

function openPreview(tool,card,{pinned=false}={}){
  if(!tool)return;
  clearTimeout(previewCloseTimer);
  previewPinned=pinned===true;

  const panel=ensurePreviewPanel();
  panel.querySelector('.nxo-dev-preview-icon').src=iconUrl(tool.icon);
  panel.querySelector('.nxo-dev-preview-title').textContent=tool.title;
  panel.querySelector('.nxo-dev-preview-copy').textContent=tool.summary;
  panel.dataset.toolKey=tool.key;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');

  document.querySelectorAll('[data-nxo-dev-card="1"].nxo-dev-preview-source')
    .forEach(el=>el.classList.remove('nxo-dev-preview-source'));
  card?.classList.add('nxo-dev-preview-source')
}
function closePreview(force=false){
  if(previewPinned&&!force)return;
  const panel=document.getElementById('nxo-dev-preview');
  if(panel){
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true')
  }
  document.querySelectorAll('[data-nxo-dev-card="1"].nxo-dev-preview-source')
    .forEach(el=>el.classList.remove('nxo-dev-preview-source'))
}
function schedulePreviewClose(){
  clearTimeout(previewCloseTimer);
  previewCloseTimer=setTimeout(()=>closePreview(false),150)
}
function bindPreviewDelegation(){
  if(window.__nexoDevPreviewOverHandler){
    document.removeEventListener('pointerover',window.__nexoDevPreviewOverHandler,true)
  }
  if(window.__nexoDevPreviewOutHandler){
    document.removeEventListener('pointerout',window.__nexoDevPreviewOutHandler,true)
  }

  window.__nexoDevPreviewOverHandler=function(event){
    // Hover preview is a mouse-only interaction. Touch/pen pointerover fires
    // before the browser knows whether the gesture is a tap or a scroll.
    if(event.pointerType&&event.pointerType!=='mouse')return;
    const card=event.target?.closest?.('[data-nxo-dev-card="1"]');
    if(!card)return;
    if(event.relatedTarget&&card.contains(event.relatedTarget))return;
    const tool=toolForCard(card);
    if(!tool)return;
    previewPinned=false;
    openPreview(tool,card,{pinned:false})
  };

  window.__nexoDevPreviewOutHandler=function(event){
    if(event.pointerType&&event.pointerType!=='mouse')return;
    const card=event.target?.closest?.('[data-nxo-dev-card="1"]');
    if(!card)return;
    if(event.relatedTarget&&card.contains(event.relatedTarget))return;
    const next=event.relatedTarget;
    if(next?.closest?.('#nxo-dev-preview,#nxo-dev-preview-handle'))return;
    if(!previewPinned)schedulePreviewClose()
  };

  document.addEventListener('pointerover',window.__nexoDevPreviewOverHandler,true);
  document.addEventListener('pointerout',window.__nexoDevPreviewOutHandler,true)
}

function bindFeatureInterception(){
  if(window.__nexoDevFeatureClickHandler){
    document.removeEventListener('click',window.__nexoDevFeatureClickHandler,true)
  }
  if(window.__nexoDevFeatureKeyHandler){
    document.removeEventListener('keydown',window.__nexoDevFeatureKeyHandler)
  }
  if(window.__nexoDevDetailPopstateHandler){
    window.removeEventListener('popstate',window.__nexoDevDetailPopstateHandler)
  }

  window.__nexoDevFeatureClickHandler=function(event){
    const card=event.target?.closest?.('[data-nxo-dev-card="1"]');
    if(!card)return;
    if(event.target?.closest?.('#nexo-global-header-runtime-host,#nxo-dev-preview'))return;

    const tool=toolForCard(card);
    if(!tool)return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if(event.target?.closest?.('.nxo-dev-quick-plans')){closePreview(true);showPlanComparison();return}

    const action=event.target?.closest?.('.nxo-dev-action');
    if(action&&!action.disabled){
      openToolDetail(tool,action);
      return
    }

    openPreview(tool,card,{pinned:true})
  };

  window.__nexoDevFeatureKeyHandler=function(event){
    if(event.key==='Escape'){
      if(toolDetailIsOpen()){
        closeToolDetail();
        return
      }
      previewPinned=false;
      closePreview(true)
    }
  };

  window.__nexoDevDetailPopstateHandler=function(){
    if(toolDetailIsOpen()){
      closeToolDetail({fromHistory:true})
    }
  };

  document.addEventListener('click',window.__nexoDevFeatureClickHandler,true);
  document.addEventListener('keydown',window.__nexoDevFeatureKeyHandler);
  window.addEventListener('popstate',window.__nexoDevDetailPopstateHandler)
}

let detailRequestId=0;
let lastDetailTrigger=null;
let installState=null;
let installBusy=false;
let detailHistoryArmed=false;
let detailCatalogScrollTop=0;
let detailPreviousScrollRestoration=null;

function resetDevelopmentDocumentScroll(){
  try{window.scrollTo({left:0,top:0,behavior:'auto'})}
  catch(_){try{window.scrollTo(0,0)}catch(__){}}
  try{document.documentElement.scrollTop=0}catch(_){}
  try{document.body.scrollTop=0}catch(_){}
}

function captureDevelopmentCatalogScroll(){
  const scroller=document.getElementById('nxo-dev-owned-catalog-scroll');
  detailCatalogScrollTop=Number(scroller?.scrollTop||0)
}

function restoreDevelopmentCatalogScroll(){
  const scroller=document.getElementById('nxo-dev-owned-catalog-scroll');
  if(scroller)scroller.scrollTop=detailCatalogScrollTop
}

function beginDetailScrollIsolation(){
  captureDevelopmentCatalogScroll();
  if('scrollRestoration' in history){
    detailPreviousScrollRestoration=history.scrollRestoration;
    history.scrollRestoration='manual'
  }
  resetDevelopmentDocumentScroll()
}

function endDetailScrollIsolation(){
  if('scrollRestoration' in history&&detailPreviousScrollRestoration){
    history.scrollRestoration=detailPreviousScrollRestoration
  }
  detailPreviousScrollRestoration=null
}

function armToolDetailHistory(){
  if(detailHistoryArmed)return;
  beginDetailScrollIsolation();
  const current=history.state&&typeof history.state==='object'?history.state:{};
  history.pushState({...current,nxoDevDetail:true},'',location.href);
  detailHistoryArmed=true
}

function ensureToolDetailView(){
  const app=ensureDevelopmentApp();
  let view=document.getElementById('nxo-dev-tool-detail');
  if(view)return view;

  view=document.createElement('section');
  view.id='nxo-dev-tool-detail';
  view.hidden=true;
  view.setAttribute('role','dialog');
  view.setAttribute('aria-modal','true');
  view.setAttribute('aria-label','Características de la herramienta');
  view.innerHTML=
    '<div class="nxo-dev-detail-modal-panel">'+
      '<button type="button" class="nxo-dev-detail-modal-close" id="nxo-dev-detail-close" aria-label="Cerrar características" title="Cerrar">×</button>'+
      '<div class="nxo-dev-detail-scroll"><div id="nxo-dev-detail-content"></div></div>'+
    '</div>';
  app.appendChild(view);
  view.querySelector('#nxo-dev-detail-close')?.addEventListener('click',()=>closeToolDetail(),{signal:runtimeAbort.signal});
  view.addEventListener('click',e=>{if(e.target===view)closeToolDetail()},{signal:runtimeAbort.signal});
  view.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeToolDetail()}},{signal:runtimeAbort.signal});
  return view
}

function detailList(title,items){
  const values=Array.isArray(items)?items.filter(Boolean):[];
  if(!values.length)return'';
  return '<section class="nxo-dev-detail-card">'+
    '<h3>'+escapeHtml(title)+'</h3>'+
    '<ul class="nxo-dev-detail-list">'+values.map(item=>'<li>'+escapeHtml(item)+'</li>').join('')+'</ul>'+
  '</section>'
}
function detailSafeUrl(value){
  const raw=String(value||'').trim();
  if(!raw)return'';
  try{
    const url=new URL(raw);
    return ['http:','https:'].includes(url.protocol)?url.href:''
  }catch(_){return''}
}
function detailLinks(title,items){
  const values=(Array.isArray(items)?items:[]).map(item=>({
    label:String(item?.label||'').trim(),
    url:detailSafeUrl(item?.url)
  })).filter(item=>item.label&&item.url);
  if(!values.length)return'';
  return '<section class="nxo-dev-detail-card">'+
    '<h3>'+escapeHtml(title)+'</h3>'+
    '<ul class="nxo-dev-detail-list">'+values.map(item=>
      '<li><a href="'+escapeHtml(item.url)+'" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;text-underline-offset:2px">'+escapeHtml(item.label)+'</a></li>'
    ).join('')+'</ul>'+
  '</section>'
}
function detailOfferPrice(offer){
  const type=String(offer?.offerType||'').toUpperCase();
  const currency=String(offer?.currency||'USD').toUpperCase();
  const money=minor=>{
    const value=Number(minor);
    if(!Number.isInteger(value)||value<0)return'';
    try{return new Intl.NumberFormat('es-US',{style:'currency',currency}).format(value/100)}
    catch(_){return (value/100).toFixed(2)+' '+currency}
  };
  if(type==='FREE')return'Gratis';
  if(type==='FIXED_PRICE'){
    const amount=money(offer?.baseAmountMinor);
    return amount?amount+' · pago único':''
  }
  if(type==='SUBSCRIPTION'){
    const amount=money(offer?.baseAmountMinor);
    const interval=String(offer?.billingInterval||'').toUpperCase();
    const count=Number(offer?.billingIntervalCount||1);
    const names={DAY:'día',WEEK:'semana',MONTH:'mes',YEAR:'año'};
    if(!amount||!names[interval])return'';
    return amount+' / '+(count>1?count+' '+names[interval]+'s':names[interval])
  }
  if(type==='USAGE'){
    const amount=money(offer?.unitAmountMinor);
    const unit=String(offer?.usageUnit||'').trim();
    return amount&&unit?amount+' / '+unit:''
  }
  return''
}
function detailPlanPrice(plan){
  const currency=String(plan?.currency||'USD').toUpperCase();
  const amount=Number(plan?.amountMinor);
  if(!Number.isInteger(amount)||amount<0)return'';
  let money='';
  try{money=new Intl.NumberFormat('es-US',{style:'currency',currency}).format(amount/100)}
  catch(_){money=(amount/100).toFixed(2)+' '+currency}
  const interval=String(plan?.billingInterval||'').toUpperCase();
  const count=Number(plan?.billingIntervalCount||1);
  const names={DAY:'día',WEEK:'semana',MONTH:'mes',YEAR:'año'};
  if(!names[interval])return money;
  return money+' / '+(count>1?count+' '+names[interval]+'s':names[interval])
}
function detailPackagePrice(pkg){
  const model=String(pkg?.pricingModel||'').toUpperCase();
  if(model==='FREE')return'Gratis';
  const currency=String(pkg?.currency||'USD').toUpperCase();
  const amount=Number(pkg?.amountMinor);
  if(!Number.isInteger(amount)||amount<0)return'';
  let money='';
  try{money=new Intl.NumberFormat('es-US',{style:'currency',currency}).format(amount/100)}
  catch(_){money=(amount/100).toFixed(2)+' '+currency}
  if(model!=='SUBSCRIPTION')return money;
  const interval=String(pkg?.billingInterval||'').toUpperCase();
  const count=Number(pkg?.billingIntervalCount||1);
  const names={DAY:'día',WEEK:'semana',MONTH:'mes',YEAR:'año'};
  if(!names[interval])return money;
  return money+' / '+(count>1?count+' '+names[interval]+'s':names[interval])
}
function detailPromotionBenefit(promo){
  const type=String(promo?.benefitType||'').toUpperCase();
  if(type==='TEMP_ACCESS')return 'Acceso temporal · '+String(Number(promo?.accessDurationDays||0))+' días';
  if(type==='TRIAL')return 'Prueba · '+String(Number(promo?.accessDurationDays||0))+' días';
  if(type==='PERCENT_DISCOUNT'){
    const bps=Number(promo?.discountBasisPoints||0);
    return Number.isInteger(bps)&&bps>0?(bps/100).toFixed(bps%100===0?0:2)+'% de descuento':''
  }
  if(type==='FIXED_DISCOUNT'){
    const amount=Number(promo?.discountAmountMinor||0);
    const currency=String(promo?.currency||'USD').toUpperCase();
    if(!Number.isInteger(amount)||amount<1)return'';
    try{return new Intl.NumberFormat('es-US',{style:'currency',currency}).format(amount/100)+' de descuento'}
    catch(_){return (amount/100).toFixed(2)+' '+currency+' de descuento'}
  }
  return''
}
function detailCommercial(commercial){
  const offers=Array.isArray(commercial?.offers)?commercial.offers:[];
  const plans=Array.isArray(commercial?.plans)?commercial.plans:[];
  const packages=Array.isArray(commercial?.packages)?commercial.packages:[];
  const trials=Array.isArray(commercial?.trials)?commercial.trials:[];
  const promotions=Array.isArray(commercial?.promotions)?commercial.promotions:[];
  if(!offers.length&&!plans.length&&!packages.length&&!trials.length&&!promotions.length)return'';

  const offersHtml=offers.length
    ? '<section class="nxo-dev-detail-card">'+
        '<h3>Formas de acceso</h3>'+
        '<div style="display:grid;gap:9px">'+
          offers.map(offer=>{
            const price=detailOfferPrice(offer);
            const label=String(offer?.publicLabelEs||'').trim()||({
              FREE:'Gratis',FIXED_PRICE:'Compra única',SUBSCRIPTION:'Suscripción',USAGE:'Uso medido'
            }[String(offer?.offerType||'').toUpperCase()]||'Oferta');
            return '<div style="padding:10px 0;border-bottom:1px solid var(--nxo-border)">'+
              '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">'+
                '<strong style="font-size:12px">'+escapeHtml(label)+'</strong>'+
                (price?'<strong style="font-size:12px;color:var(--nxo-accent)">'+escapeHtml(price)+'</strong>':'')+
              '</div>'+
              (offer?.publicDescriptionEs?'<p style="margin:6px 0 0;color:var(--nxo-text-secondary);font-size:11px;line-height:1.45">'+escapeHtml(offer.publicDescriptionEs)+'</p>':'')+
            '</div>'
          }).join('')+
        '</div>'+
      '</section>'
    : '';

  const plansHtml=plans.length
    ? '<section class="nxo-dev-detail-card">'+
        '<h3>Incluido en planes</h3>'+
        '<div style="display:grid;gap:9px">'+
          plans.map(plan=>{
            const price=detailPlanPrice(plan);
            return '<div style="padding:10px 0;border-bottom:1px solid var(--nxo-border)">'+
              '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">'+
                '<strong style="font-size:12px">'+escapeHtml(plan?.nameEs||plan?.planKey||'Plan Nexo')+'</strong>'+
                (price?'<strong style="font-size:12px;color:var(--nxo-accent)">'+escapeHtml(price)+'</strong>':'')+
              '</div>'+
              (plan?.descriptionEs?'<p style="margin:6px 0 0;color:var(--nxo-text-secondary);font-size:11px;line-height:1.45">'+escapeHtml(plan.descriptionEs)+'</p>':'')+
            '</div>'
          }).join('')+
        '</div>'+
      '</section>'
    : '';

  const packagesHtml=packages.length
    ? '<section class="nxo-dev-detail-card">'+
        '<h3>Disponible en paquetes</h3>'+
        '<div style="display:grid;gap:9px">'+
          packages.map(pkg=>{
            const price=detailPackagePrice(pkg);
            const type=String(pkg?.packageType||'').toUpperCase();
            const typeLabel=type==='FLEXIBLE'?'Flexible':type==='CURATED'?'Curado':'Fijo';
            const capacity=type==='FLEXIBLE'&&Number(pkg?.capacityUnits)>0
              ? ' · '+String(pkg.capacityUnits)+' '+escapeHtml(pkg?.allocationUnit||'unidades')
              : '';
            return '<div style="padding:10px 0;border-bottom:1px solid var(--nxo-border)">'+
              '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">'+
                '<strong style="font-size:12px">'+escapeHtml(pkg?.nameEs||pkg?.packageKey||'Paquete Nexo')+'</strong>'+
                (price?'<strong style="font-size:12px;color:var(--nxo-accent)">'+escapeHtml(price)+'</strong>':'')+
              '</div>'+
              '<p style="margin:6px 0 0;color:var(--nxo-text-muted);font-size:10px">'+escapeHtml(typeLabel+capacity)+'</p>'+
              (pkg?.descriptionEs?'<p style="margin:6px 0 0;color:var(--nxo-text-secondary);font-size:11px;line-height:1.45">'+escapeHtml(pkg.descriptionEs)+'</p>':'')+
            '</div>'
          }).join('')+
        '</div>'+
      '</section>'
    : '';

  const trialsHtml=trials.length
    ? '<section class="nxo-dev-detail-card">'+
        '<h3>Pruebas disponibles</h3>'+
        '<div style="display:grid;gap:9px">'+
          trials.map(trial=>{
            const days=Number(trial?.durationDays||0);
            const payment=trial?.requiresPaymentMethod===true?' · requiere método de pago':'';
            return '<div style="padding:10px 0;border-bottom:1px solid var(--nxo-border)">'+
              '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">'+
                '<strong style="font-size:12px">'+escapeHtml(trial?.nameEs||trial?.trialKey||'Prueba')+'</strong>'+
                (days>0?'<strong style="font-size:12px;color:var(--nxo-accent)">'+escapeHtml(String(days)+' días')+'</strong>':'')+
              '</div>'+
              (trial?.descriptionEs?'<p style="margin:6px 0 0;color:var(--nxo-text-secondary);font-size:11px;line-height:1.45">'+escapeHtml(trial.descriptionEs)+'</p>':'')+
              (payment?'<p style="margin:6px 0 0;color:var(--nxo-text-muted);font-size:10px">'+escapeHtml(payment.replace(/^ · /,''))+'</p>':'')+
            '</div>'
          }).join('')+
        '</div>'+
      '</section>'
    : '';

  const promotionsHtml=promotions.length
    ? '<section class="nxo-dev-detail-card">'+
        '<h3>Promociones disponibles</h3>'+
        '<div style="display:grid;gap:9px">'+
          promotions.map(promo=>{
            const benefit=detailPromotionBenefit(promo);
            return '<div style="padding:10px 0;border-bottom:1px solid var(--nxo-border)">'+
              '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">'+
                '<strong style="font-size:12px">'+escapeHtml(promo?.nameEs||promo?.promotionKey||'Promoción')+'</strong>'+
                (benefit?'<strong style="font-size:12px;color:var(--nxo-accent)">'+escapeHtml(benefit)+'</strong>':'')+
              '</div>'+
              (promo?.descriptionEs?'<p style="margin:6px 0 0;color:var(--nxo-text-secondary);font-size:11px;line-height:1.45">'+escapeHtml(promo.descriptionEs)+'</p>':'')+
            '</div>'
          }).join('')+
        '</div>'+
      '</section>'
    : '';

  return offersHtml+plansHtml+packagesHtml+trialsHtml+promotionsHtml
}

function detailRelated(items){
  const values=(Array.isArray(items)?items:[]).filter(item=>item?.nameEs);
  if(!values.length)return'';
  return '<section class="nxo-dev-detail-card">'+
    '<h3>Productos relacionados</h3>'+
    '<ul class="nxo-dev-detail-list">'+values.map(item=>
      '<li>'+escapeHtml(item.nameEs)+' · '+escapeHtml(statusLabel(item.status))+'</li>'
    ).join('')+'</ul>'+
  '</section>'
}
function detailMedia(items){
  const values=(Array.isArray(items)?items:[]).map(item=>({
    type:String(item?.type||'').toLowerCase(),
    url:detailSafeUrl(item?.url),
    title:String(item?.title||'').trim(),
    alt:String(item?.alt||'').trim()
  })).filter(item=>item.url&&['image','video'].includes(item.type));
  if(!values.length)return'';
  return '<section class="nxo-dev-detail-card" style="margin-bottom:14px">'+
    '<h3>Multimedia</h3>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px">'+
      values.map(item=>{
        const label=item.title||item.alt||'Multimedia del producto';
        if(item.type==='video'){
          return '<figure style="margin:0;display:grid;gap:7px">'+
            '<video controls preload="metadata" src="'+escapeHtml(item.url)+'" style="display:block;width:100%;max-height:320px;border-radius:12px;background:var(--nxo-surface)"></video>'+
            (label?'<figcaption style="font-size:11px;color:var(--nxo-text-muted)">'+escapeHtml(label)+'</figcaption>':'')+
          '</figure>'
        }
        return '<figure style="margin:0;display:grid;gap:7px">'+
          '<img src="'+escapeHtml(item.url)+'" alt="'+escapeHtml(item.alt||item.title)+'" loading="lazy" decoding="async" style="display:block;width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;border:1px solid var(--nxo-border);background:var(--nxo-surface)">'+
          (label?'<figcaption style="font-size:11px;color:var(--nxo-text-muted)">'+escapeHtml(label)+'</figcaption>':'')+
        '</figure>'
      }).join('')+
    '</div>'+
  '</section>'
}

function developmentFunctionUrl(functionName){
  const name=String(functionName||'').replace(/^\/+|\/+$/g,'');
  const freeSite=/\.(wixstudio|wixsite)\.com$/i.test(location.hostname);
  const firstSegment=location.pathname.split('/').filter(Boolean)[0]||'';
  const basePath=freeSite&&firstSegment?'/'+firstSegment:'';
  return basePath+'/_functions/'+name
}

async function fetchToolDetail(tool){
  if(tool?.localOnly&&tool?.localDetail)return tool.localDetail;
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentToolDetail'),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({toolKey:tool.cmsKey||tool.key}),
    credentials:'same-origin'
  });
  const payload=await response.json().catch(()=>null);
  if(!response.ok||!payload?.ok||!payload?.data){
    throw new Error(payload?.error||'No se pudo cargar la ficha.')
  }
  return payload.data
}

function developmentBaseUrl(){
  const pathname=location.pathname.replace(/\/+$/,'');
  return location.origin+pathname.replace(/\/blank-[^/]+$/,'')
}
function requestedWorkspaceId(){
  try{
    const q=new URLSearchParams(location.search);
    return q.get('nxoTargetWorkspace')||q.get('nxoWorkspace')||''
  }catch(_){return''}
}
async function developmentReviewsApi(action,toolKey,input={}){
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentReviews'),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    body:JSON.stringify({action,toolKey,input})
  });
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.ok){
    const error=new Error(data?.error||'No se pudo completar la reseña.');
    error.code=data?.error||'REVIEW_FAILED';
    throw error
  }
  return data.data
}

async function developmentInstallApi(action,payload={}){
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentInstall'),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    body:JSON.stringify({action,...payload})
  });
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.ok){
    const error=new Error(data?.error||'No se pudo completar la instalación.');
    error.code=data?.error||'INSTALL_FAILED';
    throw error
  }
  return data.data
}
async function hydrateDevelopmentHeaderNavigation(){
  if(!developmentSession)return;
  const current=developmentSession.navigation||{};
  const currentSpaces=Array.isArray(current.workspaces)?current.workspaces:[];
  if(currentSpaces.length)return;

  const defs=TOOL_DEFS.filter(tool=>tool?.cmsKey);
  const results=await Promise.allSettled(defs.map(async tool=>{
    const options=await developmentInstallApi('options',{toolKey:tool.cmsKey});
    return {tool,options}
  }));

  const workspaces=new Map();
  const personalTools=[];
  const personalSeen=new Set();

  for(const result of results){
    if(result.status!=='fulfilled')continue;
    const {tool,options}=result.value||{};
    if(!tool||!options)continue;
    const routePath=String(options.routePath||tool.routePath||'').trim();
    const destinations=Array.isArray(options.destinations)?options.destinations:[];

    for(const destination of destinations){
      const type=String(destination?.type||'').toLowerCase();
      if(type==='workspace'){
        const id=String(destination?.id||'').trim();
        if(!id)continue;
        if(!workspaces.has(id)){
          workspaces.set(id,{
            workspaceId:id,
            name:String(destination?.name||'Workspace'),
            description:'',
            logoImage:null,
            roleKey:'',
            tools:[]
          })
        }
        if(destination?.canOpen===true&&routePath){
          const ws=workspaces.get(id);
          if(!ws.tools.some(x=>String(x.toolKey)===String(tool.cmsKey))){
            ws.tools.push({
              toolKey:tool.cmsKey,
              name:tool.title||options.nameEs||tool.cmsKey,
              nameEs:tool.title||options.nameEs||tool.cmsKey,
              descriptionEs:tool.summary||'',
              routePath,
              status:'ACTIVE'
            })
          }
        }
      }else if(type==='personal'&&destination?.canOpen===true&&routePath){
        if(!personalSeen.has(tool.cmsKey)){
          personalSeen.add(tool.cmsKey);
          personalTools.push({
            toolKey:tool.cmsKey,
            name:tool.title||options.nameEs||tool.cmsKey,
            nameEs:tool.title||options.nameEs||tool.cmsKey,
            descriptionEs:tool.summary||'',
            routePath,
            status:'ACTIVE'
          })
        }
      }
    }
  }

  const recoveredSpaces=[...workspaces.values()].sort((a,b)=>
    String(a.name||'').localeCompare(String(b.name||''),'es',{sensitivity:'base'})
  );

  if(!recoveredSpaces.length&&!personalTools.length)return;

  developmentSession.navigation={
    personal:{
      ...(current.personal||{}),
      tools:Array.isArray(current.personal?.tools)&&current.personal.tools.length
        ? current.personal.tools
        : personalTools
    },
    workspaces:recoveredSpaces
  };
  developmentSession.navigationRecoveredFromInstallOptions=true
}
async function developmentAcquisitionApi(action,input={}){
  const response=await fetch(developmentFunctionUrl('nexoDevelopmentAcquisition'),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    body:JSON.stringify({action,input})
  });
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.ok){
    const error=new Error(data?.error||'No se pudo completar el acceso.');
    error.code=data?.error||'ACQUISITION_FAILED';
    throw error
  }
  return data.data
}
function destinationKey(destination){
  return String(destination?.type||'')+':'+String(destination?.id||'')
}
function preferredDestination(options){
  const destinations=Array.isArray(options?.destinations)?options.destinations:[];
  const requested=requestedWorkspaceId();
  return destinations.find(x=>x.type==='workspace'&&x.id===requested)||
    destinations.find(x=>x.installed)||
    destinations.find(x=>x.canInstall)||
    destinations[0]||
    null
}
function developmentToolOpenUrl(routePath,destination){
  const path=String(routePath||'').trim();
  if(!path)return'';
  try{
    const base=developmentBaseUrl();
    const target=new URL(base+(path.startsWith('/')?path:'/'+path));
    const back=new URL(base+'/blank-8');
    const workspaceId=destination?.type==='workspace'?String(destination.id||''):'';

    if(workspaceId){
      target.searchParams.set('nxoWorkspace',workspaceId);
      back.searchParams.set('nxoWorkspace',workspaceId)
    }
    target.searchParams.set('nxoBack',back.href);
    target.searchParams.set('nxoBackLabel',String(destination?.name||'Mi Espacio'));
    target.searchParams.set('nxoTheme',theme());
    target.searchParams.set('nxoLang','es');
    return target.href
  }catch(_){return path}
}
function localEnvironmentUrl(tool){
  const path=String(tool?.routePath||'').trim();
  if(!path)return'';
  try{
    const base=developmentBaseUrl();
    const target=new URL(base+(path.startsWith('/')?path:'/'+path));
    target.searchParams.set('nxoTheme',theme());
    target.searchParams.set('nxoLang',developmentLanguage());
    target.searchParams.set('nxoBack',location.href);
    target.searchParams.set('nxoBackLabel','Centro de desarrollo');
    return target.href
  }catch(_){return path}
}

function renderInstallZone(tool,options,selectedKey='',message='',messageType=''){
  const zone=document.getElementById('nxo-dev-install-zone');
  if(!zone)return;

  if(!options?.installable){
    zone.innerHTML=
      '<section class="nxo-dev-install-card">'+
        '<div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>Esta herramienta todavía no está disponible para instalar.</p></div>'+
        '<span class="nxo-dev-install-state">No disponible</span></div>'+
      '</section>';
    return
  }

  const destinations=Array.isArray(options.destinations)?options.destinations:[];
  if(!destinations.length){
    zone.innerHTML=
      '<section class="nxo-dev-install-card">'+
        '<div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>No hay destinos disponibles para esta herramienta.</p></div></div>'+
      '</section>';
    return
  }

  let selected=destinations.find(x=>destinationKey(x)===selectedKey)||preferredDestination(options);
  if(!selected)selected=destinations[0];
  installState={tool,options,selectedKey:destinationKey(selected)};

  const accessLabel=destination=>{
    if(destination?.entitled)return 'Acceso activo';
    if(destination?.freeAvailable)return 'Gratis disponible';
    if(destination?.accessStatus==='TRIAL_AVAILABLE')return 'Prueba disponible';
    if(destination?.accessStatus==='PROMOTION_AVAILABLE')return 'Promoción disponible';
    if(destination?.accessStatus==='CHECKOUT_REQUIRED')return 'Compra requerida';
    if(destination?.accessStatus==='ACQUISITION_OPTION_AVAILABLE')return 'Opción de acceso disponible';
    if(destination?.reason==='NO_TOOLS_CONFIGURE_PERMISSION')return 'Sin permiso';
    if(destination?.reason==='ACQUISITION_REQUIRED')return 'Acceso requerido';
    return ''
  };
  const destinationHtml=destinations.map(destination=>{
    const key=destinationKey(destination);
    const isSelected=key===installState.selectedKey;
    const unavailable=!destination.canOpen&&!destination.canInstall&&!destination.canAcquire;
    const access=accessLabel(destination);
    const subtitle=destination.installed
      ? (destination.entitled?'Instalada · acceso activo':'Instalada · '+(access||'acceso pendiente'))
      : destination.entitled
        ? 'Acceso disponible'
        : destination.freeAvailable
          ? 'Oferta gratuita disponible'
          : destination.reason==='NO_TOOLS_CONFIGURE_PERMISSION'
            ? 'Sin permiso para configurar herramientas'
            : destination.reason==='ACQUISITION_REQUIRED'
              ? (access||'Necesitas una forma de acceso')
              : destination.type==='workspace'?'Workspace':'Espacio personal';
    return '<button type="button" class="nxo-dev-install-destination'+(isSelected?' selected':'')+'" data-install-destination="'+escapeHtml(key)+'" '+(unavailable?'disabled':'')+'>'+
      '<span><strong>'+escapeHtml(destination.name)+'</strong><small>'+escapeHtml(subtitle)+'</small></span>'+
      (destination.installed?'<span class="nxo-dev-install-badge">Instalada</span>':(destination.entitled?'<span class="nxo-dev-install-badge">Con acceso</span>':''))+
    '</button>'
  }).join('');

  let action='';
  if(selected.canOpen){
    action='<button type="button" class="nxo-dev-install-open" id="nxo-dev-install-open">Abrir herramienta</button>'
  }else if(selected.canInstall){
    const freeActivation=selected.installed&&selected.freeAvailable&&!selected.entitled;
    action='<button type="button" class="nxo-dev-install-primary" id="nxo-dev-install-primary" '+(installBusy?'disabled':'')+'>'+
      (installBusy?'Activando…':(freeActivation?'Activar acceso gratis':'Instalar aquí'))+
    '</button>'
  }

  const acquisitionOptions=Array.isArray(selected?.acquisitionOptions)?selected.acquisitionOptions:[];
  const explicitOptions=acquisitionOptions.filter(option=>
    option?.actionable===true&&['TRIAL','PROMOTION'].includes(String(option?.sourceType||'').toUpperCase())
  );
  const acquisitionActions=(!selected.entitled&&explicitOptions.length)
    ? explicitOptions.map(option=>{
        const type=String(option.sourceType||'').toUpperCase();
        const label=type==='TRIAL'
          ? ('Iniciar prueba'+(Number(option.durationDays)>0?' · '+String(option.durationDays)+' días':''))
          : 'Activar promoción';
        return '<button type="button" class="nxo-dev-install-primary" data-nxo-acquire-source="'+escapeHtml(type)+'" data-nxo-acquire-id="'+escapeHtml(option.sourceId||'')+'" '+(installBusy?'disabled':'')+'>'+escapeHtml(label)+'</button>'
      }).join('')
    : '';

  const unavailableNote=(!selected.entitled&&!selected.canInstall&&!explicitOptions.length)
    ? selected.accessStatus==='CHECKOUT_REQUIRED'
      ? '<span class="nxo-dev-install-message">Esta forma de acceso requiere checkout.</span>'
      : selected.accessStatus==='ACQUISITION_OPTION_AVAILABLE'
        ? '<span class="nxo-dev-install-message">Hay una forma de acceso disponible, pero todavía requiere aprovisionamiento comercial.</span>'
        : ''
    : '';

  const stateLabel=selected.canOpen
    ? 'Acceso activo'
    : selected.freeAvailable
      ? 'Gratis disponible'
      : selected.entitled
        ? 'Acceso activo'
        : selected.accessStatus==='TRIAL_AVAILABLE'
          ? 'Prueba disponible'
          : selected.accessStatus==='PROMOTION_AVAILABLE'
            ? 'Promoción disponible'
            : selected.accessStatus==='CHECKOUT_REQUIRED'
              ? 'Compra requerida'
              : selected.reason==='ACQUISITION_REQUIRED'
                ? 'Acceso requerido'
                : selected.installed?'Instalada':'Pendiente';

  zone.innerHTML=
    '<section class="nxo-dev-install-card">'+
      '<div class="nxo-dev-install-head">'+
        '<div><h3>Instalación y acceso</h3><p>Elige el destino. El derecho de acceso y la instalación se validan por separado.</p></div>'+
        '<span class="nxo-dev-install-state">'+escapeHtml(stateLabel)+'</span>'+
      '</div>'+
      '<div class="nxo-dev-install-destinations">'+destinationHtml+'</div>'+
      '<div class="nxo-dev-install-actions">'+
        action+
        acquisitionActions+
        unavailableNote+
        (message?'<span class="nxo-dev-install-message '+escapeHtml(messageType)+'">'+escapeHtml(message)+'</span>':'')+
      '</div>'+
    '</section>';

  zone.querySelectorAll('[data-install-destination]').forEach(button=>{
    button.addEventListener('click',()=>{
      if(installBusy)return;
      renderInstallZone(tool,options,button.dataset.installDestination||'',message,messageType)
    },{signal:runtimeAbort.signal})
  });

  zone.querySelector('#nxo-dev-install-primary')?.addEventListener('click',async()=>{
    if(installBusy||!installState)return;
    const destination=destinations.find(x=>destinationKey(x)===installState.selectedKey);
    if(!destination||!destination.canInstall||destination.canOpen)return;

    installBusy=true;
    renderInstallZone(tool,options,installState.selectedKey,'','');
    try{
      await developmentInstallApi('install',{
        input:{
          toolKey:tool.cmsKey||tool.key,
          targetType:destination.type,
          targetId:destination.id,
          workspaceId:destination.type==='workspace'?destination.id:''
        }
      });
      const refreshed=await developmentInstallApi('options',{toolKey:tool.cmsKey||tool.key});
      installBusy=false;
      renderInstallZone(tool,refreshed,destinationKey(destination),'Herramienta instalada correctamente.','success')
    }catch(error){
      installBusy=false;
      const errorMessage=error?.code==='AUTH_REQUIRED'
        ? 'Inicia sesión para instalar esta herramienta.'
        : error?.code==='ACQUISITION_REQUIRED'
          ? 'Elige y activa una forma de acceso válida antes de instalar esta herramienta.'
          : (error?.message||'No se pudo instalar.');
      renderInstallZone(tool,options,destinationKey(destination),errorMessage,'error')
    }
  },{signal:runtimeAbort.signal});

  zone.querySelectorAll('[data-nxo-acquire-source]').forEach(button=>{
    button.addEventListener('click',async()=>{
      if(installBusy||!installState)return;
      const destination=destinations.find(x=>destinationKey(x)===installState.selectedKey);
      if(!destination)return;
      const sourceType=String(button.dataset.nxoAcquireSource||'').toUpperCase();
      const sourceId=String(button.dataset.nxoAcquireId||'');
      installBusy=true;
      renderInstallZone(tool,options,installState.selectedKey,'','');
      try{
        await developmentAcquisitionApi('acquire',{
          productKey:tool.cmsKey||tool.key,
          targetType:destination.type,
          targetId:destination.id,
          workspaceId:destination.type==='workspace'?destination.id:'',
          sourceType,
          sourceId
        });
        const refreshed=await developmentInstallApi('options',{toolKey:tool.cmsKey||tool.key});
        installBusy=false;
        renderInstallZone(tool,refreshed,destinationKey(destination),'Acceso activado. Ya puedes instalar la herramienta.','success')
      }catch(error){
        installBusy=false;
        const messages={
          TRIAL_LIMIT_REACHED:'Ya utilizaste el máximo de pruebas permitido para esta opción.',
          PAYMENT_METHOD_REQUIRED:'Esta prueba requiere un método de pago y se habilitará con checkout.',
          PROMOTION_LIMIT_REACHED:'Esta promoción alcanzó su límite de usos.',
          PROMOTION_OWNER_LIMIT_REACHED:'Ya utilizaste el máximo permitido de esta promoción.',
          ACQUISITION_NOT_ALLOWED:'No tienes permiso para adquirir acceso en este destino.'
        };
        renderInstallZone(tool,options,destinationKey(destination),messages[error?.code]||(error?.message||'No se pudo activar el acceso.'),'error')
      }
    },{signal:runtimeAbort.signal})
  });

  zone.querySelector('#nxo-dev-install-open')?.addEventListener('click',()=>{
    const destination=destinations.find(x=>destinationKey(x)===installState?.selectedKey);
    const url=developmentToolOpenUrl(options.routePath,destination);
    if(url)location.assign(url)
  },{signal:runtimeAbort.signal})
}
async function loadInstallOptions(tool,requestId){
  const zone=document.getElementById('nxo-dev-install-zone');
  if(!zone)return;

  zone.innerHTML=
    '<section class="nxo-dev-install-card">'+
      '<div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>Comprobando destinos disponibles…</p></div>'+
      '<span class="nxo-dev-install-state">Cargando</span></div>'+
    '</section>';

  try{
    const options=await developmentInstallApi('options',{toolKey:tool.cmsKey||tool.key});
    if(requestId!==detailRequestId||!toolDetailIsOpen())return;
    installBusy=false;
    renderInstallZone(tool,options)
  }catch(error){
    if(requestId!==detailRequestId||!toolDetailIsOpen())return;
    installBusy=false;
    zone.innerHTML=
      '<section class="nxo-dev-install-card">'+
        '<div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>'+
          escapeHtml(error?.code==='AUTH_REQUIRED'?'Inicia sesión para consultar los destinos de instalación.':(error?.message||'No se pudieron cargar los destinos.'))+
        '</p></div><span class="nxo-dev-install-state">Pendiente</span></div>'+
      '</section>'
  }
}

function reviewStars(value){
  const rating=Math.max(0,Math.min(5,Number(value)||0));
  return '★★★★★'.split('').map((star,index)=>index<Math.round(rating)?star:'☆').join('')
}
function renderReviewsZone(tool,data){
  const zone=document.getElementById('nxo-dev-reviews-zone');
  if(!zone)return;
  const summary=data?.summary||{average:0,count:0};
  const reviews=Array.isArray(data?.reviews)?data.reviews:[];
  const mine=data?.myReview||null;
  const currentRating=Number(mine?.rating||0);
  const listHtml=reviews.length?reviews.map(review=>
    '<article class="nxo-dev-review-item">'+
      '<div class="nxo-dev-review-item-head"><strong>'+escapeHtml(review.authorName||'Usuario Nexo')+'</strong><span class="nxo-dev-stars">'+escapeHtml(reviewStars(review.rating))+'</span></div>'+
      (review.body?'<p>'+escapeHtml(review.body)+'</p>':'')+
    '</article>'
  ).join(''):'<div class="nxo-dev-detail-empty">Todavía no hay reseñas publicadas.</div>';
  const form=data?.canReview
    ? '<div class="nxo-dev-review-form">'+
        '<strong style="font-size:12px">'+(mine?'Tu valoración':'Valora este producto')+'</strong>'+
        '<div class="nxo-dev-review-picker" data-review-rating="'+currentRating+'">'+
          [1,2,3,4,5].map(value=>'<button type="button" class="nxo-dev-review-star'+(value<=currentRating?' selected':'')+'" data-review-star="'+value+'" aria-label="'+value+' estrellas">★</button>').join('')+
        '</div>'+
        '<textarea class="nxo-dev-review-text" id="nxo-dev-review-text" maxlength="1200" placeholder="Escribe una reseña opcional…">'+escapeHtml(mine?.body||'')+'</textarea>'+
        '<div class="nxo-dev-review-actions">'+
          '<button type="button" class="nxo-dev-review-save" id="nxo-dev-review-save">'+(mine?'Actualizar reseña':'Publicar reseña')+'</button>'+
          (mine?'<button type="button" class="nxo-dev-review-remove" id="nxo-dev-review-remove">Eliminar mi reseña</button>':'')+
          '<span class="nxo-dev-review-note" id="nxo-dev-review-note"></span>'+
        '</div>'+
      '</div>'
    : '<div class="nxo-dev-review-note" style="margin-top:12px">'+(data?.authenticated?'Este producto todavía no admite reseñas.':'Inicia sesión para valorar este producto.')+'</div>';

  zone.innerHTML=
    '<section class="nxo-dev-detail-card nxo-dev-reviews">'+
      '<h3>Reseñas y valoración</h3>'+
      '<div class="nxo-dev-reviews-summary">'+
        '<span class="nxo-dev-reviews-score">'+(summary.count?escapeHtml(Number(summary.average).toFixed(1)):'—')+'</span>'+
        '<span class="nxo-dev-stars">'+escapeHtml(reviewStars(summary.average))+'</span>'+
        '<span class="nxo-dev-review-note">'+escapeHtml(summary.count+' reseña'+(summary.count===1?'':'s'))+'</span>'+
      '</div>'+
      '<div class="nxo-dev-review-list">'+listHtml+'</div>'+
      form+
    '</section>';

  let selectedRating=currentRating;
  zone.querySelectorAll('[data-review-star]').forEach(button=>{
    button.addEventListener('click',()=>{
      selectedRating=Number(button.dataset.reviewStar||0);
      zone.querySelectorAll('[data-review-star]').forEach(star=>star.classList.toggle('selected',Number(star.dataset.reviewStar)<=selectedRating))
    },{signal:runtimeAbort.signal})
  });
  zone.querySelector('#nxo-dev-review-save')?.addEventListener('click',async()=>{
    const note=zone.querySelector('#nxo-dev-review-note');
    if(!selectedRating){if(note)note.textContent='Selecciona de 1 a 5 estrellas.';return}
    try{
      if(note)note.textContent='Guardando…';
      const refreshed=await developmentReviewsApi('save',tool.cmsKey||tool.key,{
        rating:selectedRating,
        body:zone.querySelector('#nxo-dev-review-text')?.value||''
      });
      renderReviewsZone(tool,refreshed)
    }catch(error){
      if(note)note.textContent=error?.code==='REVIEW_TOO_LONG'?'La reseña supera 1200 caracteres.':(error?.message||'No se pudo guardar.')
    }
  },{signal:runtimeAbort.signal});
  zone.querySelector('#nxo-dev-review-remove')?.addEventListener('click',async()=>{
    const note=zone.querySelector('#nxo-dev-review-note');
    try{
      if(note)note.textContent='Eliminando…';
      const refreshed=await developmentReviewsApi('remove',tool.cmsKey||tool.key);
      renderReviewsZone(tool,refreshed)
    }catch(error){
      if(note)note.textContent=error?.message||'No se pudo eliminar.'
    }
  },{signal:runtimeAbort.signal})
}
async function loadReviewsZone(tool,requestId){
  const zone=document.getElementById('nxo-dev-reviews-zone');
  if(!zone)return;
  zone.innerHTML='<section class="nxo-dev-detail-card nxo-dev-reviews"><h3>Reseñas y valoración</h3><div class="nxo-dev-detail-empty">Cargando reseñas…</div></section>';
  try{
    const data=await developmentReviewsApi('bootstrap',tool.cmsKey||tool.key);
    if(requestId!==detailRequestId||!toolDetailIsOpen())return;
    renderReviewsZone(tool,data)
  }catch(error){
    if(requestId!==detailRequestId||!toolDetailIsOpen())return;
    zone.innerHTML='<section class="nxo-dev-detail-card nxo-dev-reviews"><h3>Reseñas y valoración</h3><div class="nxo-dev-detail-error">'+escapeHtml(error?.message||'No se pudieron cargar las reseñas.')+'</div></section>'
  }
}

function detailInstallDescription(tool,data){
  const scopes=Array.isArray(data?.scopeModes)?data.scopeModes.map(x=>String(x).toLowerCase()):[];
  if(tool.kind==='course')return 'Este curso se adquiere individualmente en el Centro de Desarrollo y aparece dentro de Learning Core en Mi espacio. Los cursos no generan aplicaciones adicionales.';
  if(scopes.includes('workspace')&&!scopes.includes('personal'))return 'Se instala en un Workspace existente de Mi espacio, para que el equipo tenga acceso fácil a la herramienta desde ese espacio de trabajo.';
  if(scopes.includes('personal')&&!scopes.includes('workspace'))return 'Se instala en Mi espacio para acceder fácilmente a la herramienta desde tu entorno personal.';
  if(scopes.includes('workspace')&&scopes.includes('personal'))return 'Puedes instalarla en Mi espacio o en un Workspace existente, según cómo vayas a utilizarla.';
  return 'Podrás elegir dónde instalarla cuando la herramienta esté disponible para tu cuenta.';
}
function showPlanComparison(){
 const existing=document.getElementById('nxo-plans-window');
 if(existing)existing.remove();
 const d=document.createElement('div');d.id='nxo-plans-window';document.body.appendChild(d);
 const styles=document.getElementById('nxo-plans-window-styles')||document.createElement('style');
 styles.id='nxo-plans-window-styles';
 styles.textContent=[
 '#nxo-plans-window{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:15px;background:rgba(7,12,32,.78);backdrop-filter:blur(14px);color:#16203e;box-sizing:border-box}',
 '#nxo-plans-window .nxo-pw-panel{width:min(1080px,100%);max-height:94vh;overflow:auto;box-sizing:border-box;border-radius:25px;padding:26px;background:linear-gradient(145deg,#f9f7ff,#eaefff);box-shadow:0 28px 90px #03091b88}',
 '#nxo-plans-window .nxo-pw-heading{display:flex;justify-content:space-between;gap:15px;align-items:start}',
 '#nxo-plans-window .nxo-pw-heading h2{font-size:26px;margin:5px 0}',
 '#nxo-plans-window .nxo-pw-heading p{font-size:12px;margin:0;color:#59647d}',
 '#nxo-plans-window .nxo-pw-close{background:#314d87;color:white;border:0;border-radius:10px;padding:10px 14px;cursor:pointer}',
 '#nxo-plans-window .nxo-pw-switch{margin:22px auto;display:flex;width:fit-content;gap:2px;padding:5px;border-radius:24px;background:#d4d9eb;border:1px solid #c0c8dc}',
 '#nxo-plans-window .nxo-pw-switch button{min-width:115px;border:0;border-radius:20px;padding:11px 18px;background:transparent;font-weight:700;color:#40506a;cursor:pointer}',
 '#nxo-plans-window .nxo-pw-switch button[aria-pressed=true]{background:#314d87;color:#fff;box-shadow:0 3px 13px #24396944}',
 '#nxo-plans-window .nxo-pw-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;perspective:1200px}',
 '#nxo-plans-window .nxo-pw-grid.has-owner{grid-template-columns:repeat(4,minmax(0,1fr))}',
 '#nxo-plans-window .nxo-pw-card{position:relative;min-width:0;display:flex;flex-direction:column;padding:19px 17px;border-radius:19px;border:1px solid #a8bcdd;background:linear-gradient(150deg,#e1efff,#f8fbff);box-shadow:0 12px 30px #101c3820;transition:transform .52s,box-shadow .35s;transform-style:preserve-3d}',
 '#nxo-plans-window .nxo-pw-card.learning{border-color:#b99ee4;background:linear-gradient(150deg,#f0e4ff,#fcfaff)}',
 '#nxo-plans-window .nxo-pw-card.complete{border:2px solid #c992e7;background:linear-gradient(125deg,#f5ddff,#fff6e2,#e6e6ff,#fff0fa);box-shadow:0 0 25px #af5aff65,0 14px 42px #101c382d;overflow:hidden}',
 '#nxo-plans-window .nxo-pw-card.complete:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 0%,#fff9 17%,#fbd4ff88 24%,transparent 35%,transparent 100%);background-size:340% 100%;background-position:150% 0;animation:nxoFoil 4.6s linear infinite;pointer-events:none;z-index:1}',
 '#nxo-plans-window .nxo-pw-card.complete:after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(120deg,#fffd8b25,transparent 30%,#9feeff30 52%,transparent 75%,#f7aaff44);background-size:240% 240%;animation:nxoIridescent 7s ease-in-out infinite alternate;pointer-events:none;z-index:0}',
 '@keyframes nxoFoil{0%{background-position:150% 0}100%{background-position:-150% 0}}',
 '@keyframes nxoIridescent{0%{background-position:0% 0%}100%{background-position:100% 100%}}',
 '#nxo-plans-window .nxo-pw-card.flipping{transform:rotateY(90deg)}',
 '#nxo-plans-window .nxo-pw-card>*{position:relative;z-index:2}',
 '#nxo-plans-window .nxo-pw-card.owner{border:2px solid #c99d59;background:linear-gradient(145deg,#fff8e5,#e8dcff,#edf6ff);box-shadow:0 14px 35px #94754033}',
 '#nxo-plans-window .nxo-pw-owner-symbol{display:grid;place-items:center;width:58px;height:58px;border-radius:17px;background:linear-gradient(135deg,#cda05d,#f9e8a8,#b286ce);font-size:29px;color:#46345b}',
 '#nxo-plans-window .nxo-pw-card img{width:58px;height:58px;object-fit:contain}',
 '#nxo-plans-window .nxo-pw-card h3{margin:9px 0 5px;font-size:21px}',
 '#nxo-plans-window .nxo-pw-card .nxo-pw-desc{font-size:12px;line-height:1.5;color:#465373;min-height:54px;margin:0}',
 '#nxo-plans-window .nxo-pw-price{font-size:27px;font-weight:850;margin:9px 0 0}',
 '#nxo-plans-window .nxo-pw-period{font-size:12px;font-weight:500}',
 '#nxo-plans-window .nxo-pw-bill{font-size:11px;color:#566078;min-height:32px;margin:3px 0 9px}',
 '#nxo-plans-window .nxo-pw-card ul{padding:0;list-style:none;display:grid;gap:9px;margin:0 0 18px;flex:1}',
 '#nxo-plans-window .nxo-pw-card li{font-size:12px;line-height:1.4;padding-left:18px;position:relative}',
 '#nxo-plans-window .nxo-pw-card li:before{content:"✓";position:absolute;left:0;color:#7556ba;font-weight:800}',
 '#nxo-plans-window .nxo-pw-card .nxo-pw-action{padding:11px;border:1px solid #b5bad2;border-radius:11px;background:#ffffff96;color:#4d5474;font-size:12px}',
 '#nxo-plans-window .nxo-pw-owner{display:grid;gap:8px;margin-top:17px;padding:15px;border:1px solid #aa77d4;border-radius:15px;background:linear-gradient(120deg,#f2e2ff,#e8f2ff)}',
 '#nxo-plans-window .nxo-pw-owner[hidden]{display:none!important}',
 '#nxo-plans-window .nxo-pw-note{margin:16px 0 0;text-align:center;color:#657086;font-size:11px}',
 '@media(max-width:1060px){#nxo-plans-window .nxo-pw-grid.has-owner{grid-template-columns:repeat(2,minmax(0,1fr))}}',
 '@media(max-width:740px){#nxo-plans-window{padding:8px}#nxo-plans-window .nxo-pw-panel{padding:20px 12px}#nxo-plans-window .nxo-pw-grid,#nxo-plans-window .nxo-pw-grid.has-owner{grid-template-columns:minmax(0,1fr)}#nxo-plans-window .nxo-pw-card .nxo-pw-desc{min-height:0}}',
 '@media(prefers-reduced-motion:reduce){#nxo-plans-window .nxo-pw-card{transition:none}#nxo-plans-window .nxo-pw-card.complete:before,#nxo-plans-window .nxo-pw-card.complete:after{animation:none}}'
 ].join(' ');
 if(!styles.isConnected)document.head.appendChild(styles);
 const wonder=developmentSession?.isWonder===true||developmentSession?.roleKey==='wonder';
 const plans=[
 {key:'business',name:'Business',month:'19.99',year:'192',description:'Administración y operación para negocios y equipos.',benefits:['Herramientas Business incluidas en el catálogo','Instalación personal o en Workspace según herramienta','Integraciones Business disponibles','Actualizaciones de herramientas incluidas','Soporte técnico estándar','Add-ons premium sujetos a contratación adicional']},
 {key:'learning',name:'Learning',month:'19.99',year:'192',description:'Aprendizaje personalizado para objetivos reales.',benefits:['Herramientas Learning incluidas en el catálogo','Learning Core como biblioteca de cursos','Cursos y rutas incluidos según habilitación','Progreso y evaluaciones por alumno','Actualizaciones de contenidos incluidos','Soporte técnico estándar']},
 {key:'complete',name:'Completo',month:'29.99',year:'288',description:'Business y Learning reunidos en un ecosistema.',benefits:['Todas las herramientas base Business y Learning','Acceso a Learning Core y cursos habilitados','Integraciones incluidas de ambos ecosistemas','Mi espacio y Workspaces compatibles','Actualizaciones de herramientas incluidas','Soporte técnico estándar','Add-ons premium separados según uso']}
 ];
 d.innerHTML='<section class="nxo-pw-panel"><div class="nxo-pw-heading"><div><small>NEXO GROUP</small><h2>Planes para crear, aprender y crecer</h2><p>Elige tu modalidad de facturación.</p></div><button type="button" class="nxo-pw-close">Cerrar ×</button></div>'+
 '<div class="nxo-pw-switch" role="group" aria-label="Modalidad de pago"><button data-mode="month" aria-pressed="true">Mensual</button><button data-mode="year" aria-pressed="false">Anual</button></div>'+
 '<div class="nxo-pw-grid'+(wonder?' has-owner':'')+'">'+plans.map(p=>'<article class="nxo-pw-card '+p.key+'" data-plan="'+p.key+'"><img src="'+PLAN_INFO[p.key].image+'" alt="Icono '+p.name+'"><h3>'+p.name+'</h3><p class="nxo-pw-desc">'+p.description+'</p><div class="nxo-pw-price" data-price="'+p.key+'">$'+p.month+' <span class="nxo-pw-period">/ mes</span></div><div class="nxo-pw-bill" data-bill="'+p.key+'">Facturación mensual</div><ul>'+p.benefits.map(v=>'<li>'+v+'</li>').join('')+'</ul><button type="button" class="nxo-pw-action" disabled>Contratación próximamente</button></article>').join('')+(wonder?'<article class="nxo-pw-card owner" data-plan="owner"><span class="nxo-pw-owner-symbol" aria-hidden="true">✦</span><h3>Wonder / Owner</h3><p class="nxo-pw-desc">Plan privado para probar Nexo Group sin facturación.</p><div class="nxo-pw-price">$0 <span class="nxo-pw-period">/ siempre</span></div><div class="nxo-pw-bill">Acceso de prueba activo · sin cobros</div><ul><li>Herramientas Business y Learning habilitadas para pruebas</li><li>Learning Core y cursos de prueba</li><li>Integraciones y complementos disponibles en desarrollo</li><li>Mi espacio y Workspaces según permisos</li><li>Pruebas de flujos de adquisición sin pago</li><li>Acceso exclusivo del propietario verificado</li></ul><button type="button" class="nxo-pw-action" disabled>Plan de pruebas activo</button></article>':'')+'</div>'+

 '<p class="nxo-pw-note">Precios comerciales propuestos en USD. La contratación aún requiere activar los planes reales de Wix Pricing Plans. Los complementos de pago no se incluyen automáticamente.</p></section>';
 d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
 d.onclick=event=>{if(event.target===d||event.target.closest('.nxo-pw-close'))d.remove()};
 d.onkeydown=event=>{if(event.key==='Escape')d.remove()};
 let mode='month';let changing=false;
 d.querySelectorAll('[data-mode]').forEach(btn=>btn.onclick=()=>{
  if(changing||mode===btn.dataset.mode)return;changing=true;mode=btn.dataset.mode;
  d.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.mode===mode)));
  const cards=[...d.querySelectorAll('.nxo-pw-card')];cards.forEach(x=>x.classList.add('flipping'));
  const update=()=>{plans.forEach(p=>{d.querySelector('[data-price="'+p.key+'"]').innerHTML=mode==='year'?'$'+p.year+' <span class="nxo-pw-period">/ año</span>':'$'+p.month+' <span class="nxo-pw-period">/ mes</span>';d.querySelector('[data-bill="'+p.key+'"]').textContent=mode==='year'?'Pago único anual · equivalente a $'+(Number(p.year)/12).toFixed(2)+'/mes':'Facturación mensual'});cards.forEach(x=>x.classList.remove('flipping'));changing=false};
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){update()}else{setTimeout(update,260)}
 });
 // Role is issued by the authenticated Centro backend, not inferred from a Workspace role.
 d.querySelector('.nxo-pw-close').focus({preventScroll:true});
}

function individualPriceLabel(tool){return tool.key==='gear-library'?'Gratis':'Precio individual por definir'}
function detailAcquisitionCard(tool){
  const included=PLAN_MEMBERSHIP[tool.key]||[];
  const planLabels=[...included,'complete'].map(k=>PLAN_INFO[k]?.label).filter(Boolean);
  const planText=planLabels.length?planLabels.join(' o '):'un plan compatible';
  return '<section class="nxo-dev-detail-card" id="nxo-dev-acquisition-card">'+
    '<h3>Cómo adquirirlo</h3>'+
    '<p style="margin:8px 0;color:var(--nxo-text-secondary);font-size:12px;line-height:1.55">Acceso individual: <strong>'+escapeHtml(individualPriceLabel(tool))+'</strong>. Compara este acceso con Business, Learning y Completo, disponibles en modalidad mensual o anual, para escoger la forma más económica de utilizar varias herramientas. Los complementos premium pueden tener costos adicionales.</p>'+
    '<div class="nxo-dev-install-actions" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">'+
      '<button type="button" class="nxo-dev-install-open" id="nxo-dev-detail-plans-button">Ver planes</button>'+
      '<button type="button" class="nxo-dev-install-open" id="nxo-dev-detail-individual-button">Acceso individual</button>'+
      '<button type="button" class="nxo-dev-install-open" id="nxo-dev-detail-destinations-button">Consultar mi instalación</button>'+
    '</div>'+
    '<div id="nxo-dev-acquisition-response" aria-live="polite" style="margin-top:10px"></div>'+
  '</section>';
}
function renderToolDetail(tool,data){
  const content=document.getElementById('nxo-dev-detail-content');
  if(!content)return;
  const scopes=Array.isArray(data?.scopeModes)?data.scopeModes:[];
  const chips=['<span class="nxo-dev-detail-chip status">'+escapeHtml(statusLabel(data?.status))+'</span>',...scopes.map(scope=>'<span class="nxo-dev-detail-chip">'+escapeHtml(scopeLabel(scope))+'</span>')].join('');
  const compatibility=(Array.isArray(data?.compatibilityEs)?data.compatibilityEs:[]).filter(item=>!/^(workspace|espacio de trabajo)( de nexo)?\.?$/i.test(String(item).trim()));
  const leftHtml=detailList('Capacidades',data?.capabilitiesEs)+detailList('Compatibilidad',compatibility)+detailList('Público recomendado',data?.audienceEs);
  const rightHtml=detailList('Requisitos',data?.requirementsEs)+detailList('Integraciones',data?.integrationsEs)+detailLinks('Documentación',data?.documentation)+detailRelated(data?.relatedProducts);
  if(!document.getElementById('nxo-dev-detail-layout-fix')){
    const layout=document.createElement('style');
    layout.id='nxo-dev-detail-layout-fix';
    layout.textContent=[
      '#nxo-dev-app #nxo-dev-detail-content{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;align-content:start;min-width:0}',
      '#nxo-dev-app #nxo-dev-detail-content>*{min-width:0;box-sizing:border-box;margin-top:0;margin-bottom:0}',
      '#nxo-dev-app #nxo-dev-detail-content .nxo-dev-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:stretch;grid-auto-flow:row;min-width:0}',
      '#nxo-dev-app #nxo-dev-detail-content .nxo-dev-detail-grid>.nxo-dev-detail-card{margin:0!important;height:100%;min-width:0;box-sizing:border-box;display:flex;flex-direction:column;align-items:stretch}',
      '#nxo-dev-app #nxo-dev-detail-content .nxo-dev-detail-grid>.nxo-dev-detail-card h3{min-height:18px}',
      '#nxo-dev-app #nxo-dev-detail-content .nxo-dev-detail-grid>.nxo-dev-detail-card ul{align-content:start}',
      '#nxo-dev-app #nxo-dev-detail-content .nxo-dev-install-card,#nxo-dev-app #nxo-dev-detail-content #nxo-dev-acquisition-card{margin:0;min-width:0;box-sizing:border-box}',
      '#nxo-dev-app #nxo-dev-detail-content .nxo-dev-install-head{margin-bottom:0}',
      '#nxo-dev-app #nxo-dev-detail-content #nxo-dev-install-zone[hidden]{display:none!important}',
      '#nxo-dev-app #nxo-dev-detail-content .nxo-dev-install-actions{align-items:stretch}',
      '#nxo-dev-app #nxo-dev-detail-content .nxo-dev-install-actions button{flex:1 1 170px;min-height:40px}',
      '@media(max-width:720px){#nxo-dev-app #nxo-dev-detail-content .nxo-dev-detail-grid{grid-template-columns:minmax(0,1fr)}#nxo-dev-app #nxo-dev-detail-content{gap:11px}}'
    ].join('\\n');
    document.head.appendChild(layout);
  }
  content.innerHTML=
    '<div class="nxo-dev-detail-hero"><div class="nxo-dev-detail-icon-wrap"><img class="nxo-dev-detail-icon" src="'+iconUrl(tool.icon)+'" alt=""></div>'+
      '<div class="nxo-dev-detail-heading"><div class="nxo-dev-detail-eyebrow">Ficha de producto</div>'+
        '<div class="nxo-dev-detail-title-line"><h2 class="nxo-dev-detail-title">'+escapeHtml(tool.title||data?.nameEs)+'</h2>'+toolPlanIcons(tool)+'</div>'+
        '<div class="nxo-dev-detail-meta">'+chips+'</div></div></div>'+
    '<p class="nxo-dev-detail-description">'+escapeHtml(data?.detailDescriptionEs||data?.descriptionEs||tool.summary)+'</p>'+
    detailMedia(data?.media)+
    '<section class="nxo-dev-install-card"><div class="nxo-dev-install-head"><div><h3>Instalación</h3><p>'+escapeHtml(detailInstallDescription(tool,data))+'</p></div></div></section>'+
    detailAcquisitionCard(tool)+
    '<div id="nxo-dev-install-zone" hidden></div>'+
    '<div class="nxo-dev-detail-grid">'+leftHtml+rightHtml+'</div>'+
    '<div id="nxo-dev-reviews-zone"></div>';
  const response=content.querySelector('#nxo-dev-acquisition-response');
  content.querySelector('#nxo-dev-detail-plans-button')?.addEventListener('click',()=>{
    const labels=[...(PLAN_MEMBERSHIP[tool.key]||[]),'complete'].map(k=>PLAN_INFO[k]?.label).filter(Boolean);
    showPlanComparison();
  },{signal:runtimeAbort.signal});
  content.querySelector('#nxo-dev-detail-individual-button')?.addEventListener('click',()=>{
    response.textContent='Acceso individual a '+tool.title+': oferta pendiente de habilitación. No se realizará ningún cobro desde esta ficha.';
  },{signal:runtimeAbort.signal});
  content.querySelector('#nxo-dev-detail-destinations-button')?.addEventListener('click',()=>{
    const zone=content.querySelector('#nxo-dev-install-zone');
    if(!zone)return;
    zone.hidden=false;
    if(tool.localOnly){
      zone.textContent='La instalación de este entorno se habilitará cuando esté disponible su paquete de acceso.';
    }else{
      loadInstallOptions(tool,detailRequestId);
    }
  },{signal:runtimeAbort.signal});
}

async function openToolDetail(tool,trigger){
  if(!tool||tool.status==='planned')return;
  const requestId=++detailRequestId;
  lastDetailTrigger=trigger||document.activeElement;

  previewPinned=false;
  closePreview(true);

  const app=ensureDevelopmentApp();
  const shell=app.querySelector('.nxo-dev-owned-shell');
  const view=ensureToolDetailView();
  const content=view.querySelector('#nxo-dev-detail-content');

  captureDevelopmentCatalogScroll();
  view.hidden=false;
  view.querySelector('#nxo-dev-detail-close')?.focus({preventScroll:true});
  content.innerHTML='<div class="nxo-dev-detail-loading">Cargando ficha de herramienta…</div>';
  view.querySelector('.nxo-dev-detail-scroll')?.scrollTo({top:0,behavior:'auto'});

  try{
    const data=await fetchToolDetail(tool);
    if(requestId!==detailRequestId||view.hidden)return;
    renderToolDetail(tool,data);
    if(tool.localOnly){
      const reviewsZone=document.getElementById('nxo-dev-reviews-zone');
      if(reviewsZone)reviewsZone.innerHTML='';
    }else{
      loadReviewsZone(tool,requestId)
    }
  }catch(error){
    if(requestId!==detailRequestId||view.hidden)return;
    content.innerHTML='<div class="nxo-dev-detail-error">'+escapeHtml(error?.message||'No se pudo cargar la ficha.')+'</div>'
  }
}

function closeToolDetail(){
  detailHistoryArmed=false;
  installState=null;
  installBusy=false;
  const app=document.getElementById('nxo-dev-app');
  const view=document.getElementById('nxo-dev-tool-detail');
  const shell=app?.querySelector('.nxo-dev-owned-shell');
  detailRequestId++;

  if(view)view.hidden=true;
  if(shell)shell.hidden=false;
  requestAnimationFrame(()=>{
    restoreDevelopmentCatalogScroll();
    resetDevelopmentDocumentScroll();
    syncCatalogScrollControls();
    try{lastDetailTrigger?.focus?.({preventScroll:true})}catch(_){}
    requestAnimationFrame(()=>{
      restoreDevelopmentCatalogScroll();
      resetDevelopmentDocumentScroll();
      endDetailScrollIsolation()
    })
  })
}

function toolDetailIsOpen(){
  const view=document.getElementById('nxo-dev-tool-detail');
  return !!view&&!view.hidden
}

function developmentTreeHtml(){
  return '<div class="nxo-dev-tree-toolbar"><div><div class="nxo-dev-owned-eyebrow">Vista Wonder</div><h2>Árbol de desarrollo</h2></div><button type="button" class="nxo-dev-tree-button" id="nxo-dev-tree-close">Volver al catálogo</button></div>'+
    '<div class="nxo-dev-tree-grid">'+
      '<section class="nxo-dev-tree-branch"><h3>Núcleo Nexo</h3><p>Shell y navegación compartida.</p><ul><li><strong>Mi Espacio</strong> · identidad, Workspaces y herramientas</li><li><strong>Centro de desarrollo</strong> · catálogo, comercial y acceso</li><li><strong>Header Nexo compartido</strong> · Mi Espacio + Centro + Fichas</li></ul></section>'+
      '<section class="nxo-dev-tree-branch"><h3>Entornos completos</h3><p>Productos con environment propio.</p><ul><li>Fichas Técnicas Dinámicas</li><li>Inventario Smart</li><li>Biblioteca de engranaje</li><li>Nexo Learning Core</li><li>Camino Editorial</li><li>R96</li><li>Centro de Trabajo · planificado</li></ul></section>'+
      '<section class="nxo-dev-tree-branch"><h3>Add-ons</h3><p>Extienden un entorno existente; no son environments duplicados.</p><ul><li>Horarios → Centro de Trabajo</li><li>Listas de tareas / Prep Lists → Centro de Trabajo</li><li>María → Camino Editorial</li><li>Agentes editoriales → Camino Editorial</li><li>Numa → transversal</li><li>Notificaciones multicanal → transversal</li><li>Nexo Evaluación → reservado, clave canónica pendiente</li></ul></section>'+
      '<section class="nxo-dev-tree-branch"><h3>Comercial</h3><p>Wix procesa dinero; Nexo gobierna acceso.</p><ul><li>Etapa 9 · resolver unificado</li><li>Etapa 10 · instalación final <strong>diferida</strong> hasta empaquetado</li><li>Etapa 11 · Wix Pricing Plans + checkout + órdenes</li><li>Etapa 12 · lifecycle e historial</li><li>NexoEntitlements · autoridad efectiva de acceso</li></ul></section>'+
      '<section class="nxo-dev-tree-branch"><h3>Empaquetado</h3><p>Cada environment debe tener launcher/acceso canónico antes de cerrar instalación.</p><ul><li>Fichas · referencia funcional actual</li><li>Inventario / Learning / Biblioteca / Camino / R96 · revisar empaquetado individual</li><li>No crear instalaciones falsas mientras el launcher no esté listo</li></ul></section>'+
      '<section class="nxo-dev-tree-branch"><h3>Nexo App Lab</h3><p>Rama futura para productos exportables al Wix App Market.</p><ul><li>Wix Blocks / App Market</li><li>Candidatos: Fichas, Prep Lists, analizador de horarios, componentes de Inventario</li><li>Separar producto universal de funciones internas de Nexo</li></ul></section>'+
    '</div>'
}

function setDevelopmentView(view){
  developmentView=view==='tree'&&developmentSession?.isWonder===true?'tree':'catalog';
  const catalog=document.getElementById('nxo-dev-catalog-view');
  const tree=document.getElementById('nxo-dev-tree-view');
  if(catalog)catalog.hidden=developmentView!=='catalog';
  if(tree)tree.hidden=developmentView!=='tree';
  if(developmentView==='catalog')requestAnimationFrame(syncCatalogScrollControls)
}

function applyRequestedDevelopmentView(){
  let requested='';
  try{requested=new URLSearchParams(location.search).get('nxoView')||''}catch(_){}
  if(requested==='tree'&&developmentSession?.isWonder===true)setDevelopmentView('tree');
  else setDevelopmentView('catalog');
  if(requested){
    try{
      const u=new URL(location.href);
      u.searchParams.delete('nxoView');
      history.replaceState(history.state||{},'',u.pathname+u.search+u.hash)
    }catch(_){}
  }
}

function bindDevelopmentTree(){
  document.getElementById('nxo-dev-tree-open')?.addEventListener('click',()=>setDevelopmentView('tree'),{signal:runtimeAbort.signal});
  document.getElementById('nxo-dev-tree-close')?.addEventListener('click',()=>setDevelopmentView('catalog'),{signal:runtimeAbort.signal})
}

function ensureDevelopmentApp(){
  let app=document.getElementById('nxo-dev-app');
  if(app)return app;

  app=document.createElement('main');
  app.id='nxo-dev-app';
  const wonderTree=developmentSession?.isWonder===true
    ? '<button type="button" class="nxo-dev-tree-button" id="nxo-dev-tree-open">Árbol de desarrollo</button>'
    : '';

  app.innerHTML=
    '<div class="nxo-dev-owned-shell">'+
      '<section class="nxo-dev-owned-hero">'+
        '<div class="nxo-dev-owned-eyebrow">Herramientas de desarrollo</div>'+
        '<h1>Centro de desarrollo</h1>'+
        '<p>Entornos completos y add-ons conectados al ecosistema Nexo. Cada tarjeta indica si abre un environment propio o amplía otro entorno.</p>'+
        wonderTree+
      '</section>'+
      '<div class="nxo-dev-owned-catalog-frame">'+
        '<div class="nxo-dev-owned-catalog-scroll" id="nxo-dev-owned-catalog-scroll">'+
          '<div class="nxo-dev-catalog-view" id="nxo-dev-catalog-view">'+
            '<section class="nxo-dev-catalog-group"><div class="nxo-dev-group-head"><div><h2>Cursos personalizables</h2><p>Adquiere cada curso en el Centro de Desarrollo; estúdialo y consulta tu progreso dentro de Learning Core en Mi espacio.</p></div></div><section class="nxo-dev-owned-grid" id="nxo-dev-courses-grid"></section></section>'+ 
            '<section class="nxo-dev-catalog-group"><div class="nxo-dev-group-head"><div><h2>Entornos completos</h2><p>Aplicaciones con página, navegación y contexto propios.</p></div></div><section class="nxo-dev-owned-grid" id="nxo-dev-environments-grid"></section></section>'+
            '<section class="nxo-dev-catalog-group"><div class="nxo-dev-group-head"><div><h2>Add-ons</h2><p>Funciones que amplían un entorno existente o trabajan de forma transversal.</p></div></div><section class="nxo-dev-owned-grid" id="nxo-dev-addons-grid"></section></section>'+
          '</div>'+
          '<section class="nxo-dev-tree-view" id="nxo-dev-tree-view" hidden>'+developmentTreeHtml()+'</section>'+
        '</div>'+
        '<button type="button" class="nxo-dev-scroll-arrow up" id="nxo-dev-scroll-up" aria-label="Desplazar hacia arriba">▲</button>'+
        '<button type="button" class="nxo-dev-scroll-arrow down" id="nxo-dev-scroll-down" aria-label="Desplazar hacia abajo">▼</button>'+
      '</div>'+
    '</div>';

  const courseGrid=app.querySelector('#nxo-dev-courses-grid');
  // Owner test plan is returned only after server-side authentication.
  const ownerPlanSlot=document.createElement('section');
  ownerPlanSlot.id='nxo-dev-owner-plan';
  ownerPlanSlot.hidden=true;
  ownerPlanSlot.style.cssText='margin:8px 0 16px;padding:14px 18px;border:1px solid rgba(140,130,190,.28);border-radius:16px;background:rgba(140,130,190,.11);';
  const catalogView=app.querySelector('#nxo-dev-catalog-view');
  if(catalogView)catalogView.prepend(ownerPlanSlot);
  fetch(developmentFunctionUrl('nexoLearningAccess'),{
    method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:'{}'
  }).then(r=>r.ok?r.json():null).then(payload=>{
    if(!payload?.ok||payload?.data?.isOwner!==true||!ownerPlanSlot.isConnected)return;
    const courses=Array.isArray(payload.data.courses)?payload.data.courses:[];
    ownerPlanSlot.hidden=false;
    ownerPlanSlot.innerHTML='<strong>Plan Nexo Owner · $0</strong>'+
      '<p style="margin:6px 0 0">Acceso interno de pruebas para el propietario. Business, Learning, Completo, cursos y complementos compatibles; sin facturación.</p>'+
      '<p style="margin:6px 0 0;font-size:12px">Cursos habilitados: '+escapeHtml(courses.length?courses.join(', '):'ninguno')+'. Learning Core se encuentra en Mi espacio.</p>';
  }).catch(()=>{});
  const environmentGrid=app.querySelector('#nxo-dev-environments-grid');
  const addonGrid=app.querySelector('#nxo-dev-addons-grid');

  TOOL_DEFS.forEach(tool=>{
    const grid=tool.kind==='course'?courseGrid:tool.kind==='addon'?addonGrid:environmentGrid;
    if(!grid)return;
    const slot=document.createElement('div');
    slot.className='nxo-dev-owned-slot';

    const card=document.createElement('article');
    card.dataset.nxoDevCard='1';
    card.dataset.nxoDevTool=tool.key;
    const kindLabel=tool.kind==='course'?'Curso · Learning Core':tool.kind==='addon'?'Add-on'+(tool.parent?' · '+tool.parent:''):'Entorno completo';
    card.innerHTML=
      '<div class="nxo-dev-kind-badge '+escapeHtml(tool.kind||'environment')+'">'+escapeHtml(kindLabel)+'</div>'+
      '<div class="nxo-dev-title-row">'+
        '<span data-nxo-dev-icon-slot="1"><img class="nxo-dev-product-icon" src="'+iconUrl(tool.icon)+'" alt="" aria-hidden="true"></span>'+
        '<h2 data-nxo-dev-tool-title="'+tool.key+'">'+escapeHtml(tool.title)+'</h2>'+
        '<div class="nxo-dev-plan-card">'+toolPlanIcons(tool)+'</div>'+
      '</div>'+
      '<p data-nxo-dev-description="1">'+escapeHtml(tool.summary)+'</p>'+ 
      '<div class="nxo-dev-individual-price" style="font-size:12px;font-weight:700;margin:7px 0;color:var(--nxo-text-primary)">Acceso individual · '+escapeHtml(individualPriceLabel(tool))+'</div>'+ 
      '<button type="button" class="nxo-dev-quick-plans" style="border:1px solid var(--nxo-border);background:var(--nxo-accent-soft);color:var(--nxo-text-primary);border-radius:9px;padding:8px 12px;margin-bottom:8px;cursor:pointer">Ver planes</button>'+
      (tool.status==='planned'
        ? '<button type="button" class="nxo-dev-action nxo-dev-action-surface" disabled aria-disabled="true">Próximamente</button>'
        : '<button type="button" class="nxo-dev-action nxo-dev-action-surface">Ver características</button>');

    slot.appendChild(card);
    grid.appendChild(slot)
  });

  document.body.prepend(app)

  bindDevelopmentTree();
  return app
}
function syncCatalogScrollControls(){
  const scroller=document.getElementById('nxo-dev-owned-catalog-scroll');
  const up=document.getElementById('nxo-dev-scroll-up');
  const down=document.getElementById('nxo-dev-scroll-down');
  if(!scroller||!up||!down)return;

  const max=Math.max(0,scroller.scrollHeight-scroller.clientHeight);
  const atTop=scroller.scrollTop<=2;
  const atBottom=scroller.scrollTop>=max-2;

  up.disabled=atTop||max<=2;
  down.disabled=atBottom||max<=2
}

function bindCatalogScrollControls(){
  const scroller=document.getElementById('nxo-dev-owned-catalog-scroll');
  const up=document.getElementById('nxo-dev-scroll-up');
  const down=document.getElementById('nxo-dev-scroll-down');
  if(!scroller||!up||!down||scroller.dataset.nxoScrollBound==='1')return;

  scroller.dataset.nxoScrollBound='1';

  const move=direction=>{
    const amount=Math.max(160,Math.round(scroller.clientHeight*.72));
    scroller.scrollBy({top:direction*amount,behavior:'smooth'})
  };

  up.addEventListener('click',()=>move(-1),{signal:runtimeAbort.signal});
  down.addEventListener('click',()=>move(1),{signal:runtimeAbort.signal});
  scroller.addEventListener('scroll',syncCatalogScrollControls,{passive:true,signal:runtimeAbort.signal});
  window.addEventListener('resize',syncCatalogScrollControls,{passive:true,signal:runtimeAbort.signal});

  requestAnimationFrame(syncCatalogScrollControls)
}

function syncDevelopmentViewport(){
  const header=document.getElementById('nexo-global-header-runtime-host');
  const rect=header?.getBoundingClientRect();
  const bottom=rect&&rect.height>0?Math.max(0,Math.round(rect.bottom)):Math.max(0,parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nexo-global-header-height'))||68);
  const value=bottom+'px';
  if(document.documentElement.style.getPropertyValue('--nxo-dev-header-bottom')!==value)
    document.documentElement.style.setProperty('--nxo-dev-header-bottom',value);
}
function refresh(){
  syncDevelopmentViewport();
  ensureDevelopmentApp();
  bindCatalogScrollControls();
  syncCatalogScrollControls();
  syncQuickTheme()
}
function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;refresh()})
}

function destroy(){
  try{observer?.disconnect()}catch(_){}
  observer=null;
  scheduled=false;
  clearTimeout(previewCloseTimer);
  detailRequestId++;
  lastDetailTrigger=null;
  installState=null;
  installBusy=false;
  endDetailScrollIsolation();

  try{runtimeAbort.abort()}catch(_){}

  if(window.__nexoDevPreviewOverHandler){
    document.removeEventListener('pointerover',window.__nexoDevPreviewOverHandler,true);
    window.__nexoDevPreviewOverHandler=null
  }
  if(window.__nexoDevPreviewOutHandler){
    document.removeEventListener('pointerout',window.__nexoDevPreviewOutHandler,true);
    window.__nexoDevPreviewOutHandler=null
  }
  if(window.__nexoDevFeatureClickHandler){
    document.removeEventListener('click',window.__nexoDevFeatureClickHandler,true);
    window.__nexoDevFeatureClickHandler=null
  }
  if(window.__nexoDevFeatureKeyHandler){
    document.removeEventListener('keydown',window.__nexoDevFeatureKeyHandler);
    window.__nexoDevFeatureKeyHandler=null
  }

  if(nxoOrganicRaf){cancelAnimationFrame(nxoOrganicRaf);nxoOrganicRaf=0}
  if(nxoOrganicResize){window.removeEventListener('resize',nxoOrganicResize);nxoOrganicResize=null}
  nxoOrganicStarted=false;

  [
    'nxo-dev-center-css',
    'nxo-dev-taxonomy-css',
    'nxo-dev-preview',
    'nxo-dev-preview-handle',
    'nxo-dev-loading',
    'nxo-dev-background-root',
    'nxo-dev-app'
  ].forEach(id=>document.getElementById(id)?.remove());

  if(window.__nexoDevelopmentCenterRuntime===runtime){
    delete window.__nexoDevelopmentCenterRuntime
  }
  if(window.__nexoDevelopmentCenterStage0Version===VERSION){
    window.__nexoDevelopmentCenterStage0Version=''
  }
}

runtime.destroy=destroy;

async function start(){
  if(window.__nexoDevelopmentCenterRuntime!==runtime)return;
  ensureStyle();
  ensureDevelopmentTaxonomyStyle();
  showDevelopmentLoading();
  try{
    await Promise.all([ensureThemeRuntime(),ensureGlobalHeaderRuntime()]);
    if(window.__nexoDevelopmentCenterRuntime!==runtime)return;
    await window.NEXO_THEME_RUNTIME?.ready;
    if(window.__nexoDevelopmentCenterRuntime!==runtime)return;

    try{await loadDevelopmentSession()}catch(_){developmentSession=null}
    if(window.__nexoDevelopmentCenterRuntime!==runtime)return;
    try{await hydrateDevelopmentHeaderNavigation()}catch(_){}
    if(window.__nexoDevelopmentCenterRuntime!==runtime)return;
    mountDevelopmentHeader();
    syncDevelopmentViewport();
    ensureDevelopmentApp();
    applyRequestedDevelopmentView();
    ensurePreviewPanel();
    bindPreviewDelegation();
    bindFeatureInterception();
    refresh();
    hideDevelopmentLoading();

    window.addEventListener('resize',syncDevelopmentViewport,{signal:runtimeAbort.signal});
    window.addEventListener('nexo-theme-change',()=>{mountDevelopmentHeader();syncQuickTheme();schedule()},{signal:runtimeAbort.signal});
    window.addEventListener('nexo-theme-ready',()=>{syncQuickTheme();schedule()},{signal:runtimeAbort.signal});

    observer=new MutationObserver(schedule);
    const target=document.getElementById('nxo-dev-app')||document.body;
    observer.observe(target,{subtree:true,childList:true,characterData:true})
  }catch(error){
    const loading=document.getElementById('nxo-dev-loading');
    if(loading){
      loading.innerHTML='<div><strong>No se pudo abrir Centro de desarrollo</strong><p class="nxo-muted">'+escapeHtml(error?.message||String(error))+'</p></div>'
    }
    throw error
  }
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',start,{once:true,signal:runtimeAbort.signal})
}else{
  start()
}
})();