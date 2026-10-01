(function(){
if(window.__nexoFichasApp)return;window.__nexoFichasApp=true;

const ACCESS_REVISION='fichas-theme-contract-20261001-30';
const ENGINE_REVISION='image-crop-20261001-28';
const NUMA_CSS='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/numa-overlay.css?v=numa-anchored-cores-20261001-6';
const THEME_RUNTIME_URL='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/theme-runtime.js?v=20261001-theme-runtime-2';
const freeSite=/\.(wixstudio|wixsite)\.com$/i.test(location.hostname);
const apiBase=freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'';
const API=apiBase+'/_functions/nexoFichasUi';
const ENGINE='https://dtokurisu-png.github.io/nexo-inventory-smart/menu-dinamico/live.html?nexo=1&v='+encodeURIComponent(ENGINE_REVISION);

let accessStage='WAITING_PAGE';
let sessionToken='';
let frame=null;
let loadingData=false;
let importing=false;
let importPreview=null;
let importCode='';
let numaState=null;
let numaContextKey='';
let numaLoading=false;
let numaSending=false;
let requestedSheetOpened=false;
let engineDataCache=null;
const NUMA_VISUAL_ASSETS={
  day:{
    idle:'https://static.wixstatic.com/media/8b64a8_0ea89ddfe6f9485cb51cc818bbc28587~mv2.png',
    attentive:'https://static.wixstatic.com/media/8b64a8_664b5ce8535143ae83d866ef22339f26~mv2.png',
    listening:'https://static.wixstatic.com/media/8b64a8_431c1faecd1d40518baba43f648de9dc~mv2.png',
    thinking:'https://static.wixstatic.com/media/8b64a8_05317e113b054caead2a8672f59167af~mv2.png',
    success:'https://static.wixstatic.com/media/8b64a8_b673e3b346d845ffa38e21c660eea254~mv2.png',
    error:'https://static.wixstatic.com/media/8b64a8_0f51f83f717a4cf88888da0ffa3485c9~mv2.png'
  },
  night:{
    idle:'https://static.wixstatic.com/media/8b64a8_1afdaa040eae4947951ca6233fb4b979~mv2.png',
    attentive:'https://static.wixstatic.com/media/8b64a8_c6cc56b0eb584dbd8d4858ce7418e7d3~mv2.png',
    listening:'https://static.wixstatic.com/media/8b64a8_ce4b32fa64324cdf8b2a03adccfe5252~mv2.png',
    thinking:'https://static.wixstatic.com/media/8b64a8_fe4d5fa2ddf840e5b5ae1840138fd915~mv2.png',
    success:'https://static.wixstatic.com/media/8b64a8_fe372358c9964067b096b3a0b775ecca~mv2.png',
    error:'https://static.wixstatic.com/media/8b64a8_d1c9c01f021d4b2c8dd0c2975f3c7342~mv2.png'
  }
};
const NUMA_VISUAL_RUNTIME_STATES=new Set(['idle','attentive','listening','thinking','success','error']);
const NUMA_CORE_LAYOUTS={
  idle:{head:[50,34,38,27],belly:[50,60,30,23]},
  attentive:{head:[50,34,38,27],belly:[50,60,30,23]},
  listening:{head:[50,34,38,27],belly:[50,60,30,23]},
  thinking:{head:[50,32,36,25],belly:[50,60,29,22]},
  success:{head:[50,34,38,27],belly:[50,60,30,23]},
  error:{head:[50,35,39,28],belly:[50,61,30,23]}
};
let numaVisualRequestedState='idle';
let numaVisualTimer=0,numaTypingTimer=0,numaLauncherRaf=0,numaLifeRaf=0,numaSwapToken=0;
let numaVisualDemoTimers=[];
const launchQuery=new URLSearchParams(location.search);
const workspaceLabel=launchQuery.get('nxoBackLabel')||'Workspace';
const workspaceToolName=String(launchQuery.get('nxoToolName')||'Fichas Técnicas Dinámicas').trim()||'Fichas Técnicas Dinámicas';
const workspaceToolDescription=String(launchQuery.get('nxoToolDescription')||'').trim();
let workspaceTheme=launchQuery.get('nxoTheme')==='night'?'night':launchQuery.get('nxoTheme')==='day'?'day':(()=>{try{return localStorage.getItem('nexoTheme:v1')==='night'?'night':'day'}catch(_){return'day'}})();
let UI_THEME=null;

function ensureThemeRuntime(){
  const ready=()=>window.NEXO_THEME_RUNTIME?.ready?.then(()=>{
    window.NEXO_THEME_RUNTIME.setTheme(workspaceTheme,{persist:false,notify:false});
    UI_THEME=window.NEXO_THEME_RUNTIME.getThemeTokens();
    if(!UI_THEME)throw new Error('NEXO_THEME_TOKENS_UNAVAILABLE');
    return UI_THEME;
  });
  if(window.NEXO_THEME_RUNTIME)return ready();
  return new Promise((resolve,reject)=>{
    let script=document.getElementById('nexo-theme-runtime-script');
    if(script){
      script.addEventListener('load',()=>ready().then(resolve,reject),{once:true});
      script.addEventListener('error',()=>reject(new Error('NEXO_THEME_RUNTIME_LOAD_FAILED')),{once:true});
      return;
    }
    script=document.createElement('script');
    script.id='nexo-theme-runtime-script';
    script.src=THEME_RUNTIME_URL;
    script.async=false;
    script.onload=()=>ready().then(resolve,reject);
    script.onerror=()=>reject(new Error('NEXO_THEME_RUNTIME_LOAD_FAILED'));
    document.head.appendChild(script);
  });
}
function applyImportThemeVars(host=document.getElementById('nx-import-host')){
  if(!host||!UI_THEME)return;
  const vars={
    '--nx-bg':UI_THEME.background,'--nx-surface':UI_THEME.surface,'--nx-raised':UI_THEME.surfaceRaised,
    '--nx-border':UI_THEME.border,'--nx-border-strong':UI_THEME.borderStrong,'--nx-text':UI_THEME.textPrimary,
    '--nx-soft':UI_THEME.textSecondary,'--nx-muted':UI_THEME.textMuted,'--nx-accent':UI_THEME.accent,
    '--nx-accent-soft':UI_THEME.accentSoft,'--nx-accent-contrast':UI_THEME.accentContrast,'--nx-positive':UI_THEME.positive,
    '--nx-positive-contrast':UI_THEME.positiveContrast,'--nx-interaction':UI_THEME.interaction,
    '--nx-interaction-contrast':UI_THEME.interactionContrast,'--nx-danger':UI_THEME.danger,'--nx-overlay':UI_THEME.overlay,'--nx-shadow':UI_THEME.shadow,
    '--nx-btn-bg':UI_THEME.buttonSecondaryBg,'--nx-btn-text':UI_THEME.buttonSecondaryText,'--nx-btn-border':UI_THEME.buttonSecondaryBorder
  };
  Object.entries(vars).forEach(([key,value])=>host.style.setProperty(key,value));
}
function applyWorkspaceTheme(theme,{persist=true,notifyEngine=true}={}){
  workspaceTheme=theme==='night'?'night':'day';
  if(window.NEXO_THEME_RUNTIME){
    window.NEXO_THEME_RUNTIME.setTheme(workspaceTheme,{persist,notify:false});
    UI_THEME=window.NEXO_THEME_RUNTIME.getThemeTokens()||UI_THEME;
  }
  const root=document.getElementById('nx-fichas-app');
  if(root&&UI_THEME){root.style.background=UI_THEME.background;root.style.color=UI_THEME.textPrimary}
  if(frame&&UI_THEME)frame.style.background=UI_THEME.background;
  const launcher=document.getElementById('nma-launcher'),panel=document.getElementById('nma-panel');
  if(launcher)launcher.dataset.theme=workspaceTheme;
  if(panel)panel.dataset.theme=workspaceTheme;
  numaSyncVisualTheme();
  applyImportThemeVars();
  try{
    const u=new URL(location.href);
    u.searchParams.set('nxoTheme',workspaceTheme);
    history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
  }catch(_){}
  if(notifyEngine)postToEngine('NEXO_WORKSPACE_CONTEXT',{workspaceMode:true,workspaceLabel,toolName:workspaceToolName,toolDescription:workspaceToolDescription,theme:workspaceTheme,language:workspaceLanguage});
}
let workspaceLanguage=launchQuery.get('nxoLang')==='en'?'en':'es';
const requestedSheetId=launchQuery.get('numaSheet')||'';
const requestedSheetTitle=launchQuery.get('numaSheetTitle')||'';

function ensureNumaCss(){
  if(document.getElementById('nma-overlay-css'))return;
  const link=document.createElement('link');
  link.id='nma-overlay-css';
  link.rel='stylesheet';
  link.href=NUMA_CSS;
  document.head.appendChild(link);
}
function numaVisualAsset(state='idle'){
  const effective=NUMA_VISUAL_RUNTIME_STATES.has(state)?state:'idle';
  return NUMA_VISUAL_ASSETS[workspaceTheme]?.[effective]||NUMA_VISUAL_ASSETS.day.idle;
}
function numaPreloadVisuals(){
  Object.values(NUMA_VISUAL_ASSETS[workspaceTheme]||{}).forEach(src=>{const im=new Image();im.decoding='async';im.src=src});
}
function numaSwapCharacter(state='idle',immediate=false){
  const img=document.getElementById('nma-character-img'),src=numaVisualAsset(state);
  numaApplyCoreLayout(state);
  if(!img||img.dataset.nmaSrc===src)return;
  const token=++numaSwapToken;
  const apply=()=>{if(token!==numaSwapToken)return;img.src=src;img.dataset.nmaSrc=src;requestAnimationFrame(()=>img.classList.remove('changing'))};
  if(immediate){img.classList.remove('changing');apply();return}
  img.classList.add('changing');setTimeout(apply,70);
}
function numaSyncVisualTheme(){
  const launcher=document.getElementById('nma-launcher'),panel=document.getElementById('nma-panel');
  if(launcher)launcher.dataset.theme=workspaceTheme;
  if(panel)panel.dataset.theme=workspaceTheme;
  numaPreloadVisuals();numaSwapCharacter(numaVisualRequestedState,true);
}
function numaSetExpression(kind='none'){
  const layer=document.getElementById('nma-expression-layer');
  if(!layer)return;
  layer.dataset.expression=kind||'none';
  const markup={
    speak:'<span class="nma-symbol nma-symbol-speak">!</span>',
    question:'<span class="nma-symbol nma-symbol-question">?</span>',
    listening:'<span class="nma-ellipsis"><i></i><i></i><i></i></span>',
    thinking:'<span class="nma-think-mark">?</span><span class="nma-ellipsis nma-ellipsis-think"><i></i><i></i><i></i></span>',
    confused:'<span class="nma-confused"><i>?</i><i>?</i><i>?</i></span>',
    success:'<span class="nma-sparkles">'+Array.from({length:7},(_,i)=>'<i style="--i:'+i+'">✦</i>').join('')+'</span>',
    error:'<span class="nma-error-orbit">'+Array.from({length:5},(_,i)=>'<i style="--i:'+i+'">✦</i>').join('')+'</span>'
  };
  layer.innerHTML=markup[kind]||'';
}
function numaSetVisualState(state='idle',expression='none',duration=0){
  if(numaVisualTimer){clearTimeout(numaVisualTimer);numaVisualTimer=0}
  numaVisualRequestedState=NUMA_VISUAL_RUNTIME_STATES.has(state)?state:'idle';
  const panel=document.getElementById('nma-panel');
  if(panel){
    panel.dataset.state=numaVisualRequestedState;
    panel.dataset.requestedState=numaVisualRequestedState;
  }
  numaSwapCharacter(numaVisualRequestedState,false);
  numaSetExpression(expression);
  if(duration>0){
    numaVisualTimer=setTimeout(()=>{
      numaVisualTimer=0;
      if(!numaSending)numaSetVisualState('idle','none');
    },duration);
  }
}
function numaSpeak(value,{expression='speak',duration=0}={}){
  const bubble=document.getElementById('nma-speech');
  if(!bubble)return;
  const text=String(value||'').trim()||'Hola. Dime qué receta, preparación o producto buscas.';
  bubble.textContent=text;
  bubble.classList.remove('speaking');
  void bubble.offsetWidth;
  bubble.classList.add('speaking');
  if(expression&&expression!=='none')numaSetExpression(expression);
  const ms=duration||Math.max(1100,Math.min(3200,650+text.length*18));
  setTimeout(()=>bubble?.classList.remove('speaking'),ms);
}
function numaLifeFieldMarkup(){
  return '<div class="nma-core-zone nma-core-head" aria-hidden="true"><canvas class="nma-core-canvas" data-core="head"></canvas></div>'+
    '<div class="nma-core-zone nma-core-belly" aria-hidden="true"><canvas class="nma-core-canvas" data-core="belly"></canvas></div>';
}
function numaApplyCoreLayout(state="idle"){
  const shell=document.getElementById("nma-character-shell");
  if(!shell)return;
  const layout=NUMA_CORE_LAYOUTS[state]||NUMA_CORE_LAYOUTS.idle;
  const head=layout.head||NUMA_CORE_LAYOUTS.idle.head;
  const belly=layout.belly||NUMA_CORE_LAYOUTS.idle.belly;
  shell.style.setProperty("--nma-head-x",head[0]+"%");
  shell.style.setProperty("--nma-head-y",head[1]+"%");
  shell.style.setProperty("--nma-head-w",head[2]+"%");
  shell.style.setProperty("--nma-head-h",head[3]+"%");
  shell.style.setProperty("--nma-belly-x",belly[0]+"%");
  shell.style.setProperty("--nma-belly-y",belly[1]+"%");
  shell.style.setProperty("--nma-belly-w",belly[2]+"%");
  shell.style.setProperty("--nma-belly-h",belly[3]+"%");
}
function numaLifeRgb(){
  return numaVisualTheme()==="night"?{r:255,g:190,b:56}:{r:38,g:76,b:143};
}
function numaLauncherRgb(){
  return numaVisualTheme()==="night"?{r:255,g:190,b:56}:{r:57,g:169,b:255};
}
function numaMountLifeParticles(){
  const canvases=[...document.querySelectorAll(".nma-core-canvas")];
  if(!canvases.length)return;
  const reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const rand=(a,b)=>Math.random()*(b-a)+a;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ease=t=>1-Math.pow(1-clamp(t,0,1),3);

  function mountCore(canvas){
    if(canvas.dataset.mounted==="1")return;
    canvas.dataset.mounted="1";
    const kind=canvas.dataset.core==="head"?"head":"belly";
    const zone=canvas.parentElement;
    const ctx=canvas.getContext("2d");
    let size={w:1,h:1},lastSpawn=0,nextSpawn=kind==="head"?720:980,seq=0;
    const groups=[],nodes=[],links=[];

    function resize(){
      const rect=zone.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
      size={w:Math.max(1,rect.width),h:Math.max(1,rect.height)};
      canvas.width=Math.max(1,Math.round(size.w*dpr));
      canvas.height=Math.max(1,Math.round(size.h*dpr));
      canvas.style.width=size.w+"px";
      canvas.style.height=size.h+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    const ro=typeof ResizeObserver!=="undefined"?new ResizeObserver(resize):null;
    ro?.observe(zone);

    function inside(x,y){
      const cx=size.w*.5,cy=size.h*.5,rx=size.w*.46,ry=size.h*.44;
      const dx=(x-cx)/Math.max(1,rx),dy=(y-cy)/Math.max(1,ry);
      return dx*dx+dy*dy<=.9;
    }
    function addNode(group,parent,tx,ty,generation,t){
      const sx=parent?parent.x:size.w*.5+rand(-size.w*.05,size.w*.05);
      const sy=parent?parent.y:size.h*.5+rand(-size.h*.05,size.h*.05);
      const n={
        id:group.id+"-"+(++seq),groupId:group.id,generation,
        sx,sy,tx,ty,x:sx,y:sy,born:t,
        grow:rand(380,680),
        r:kind==="head"?rand(generation?2.0:2.6,generation?3.2:3.9):rand(generation?2.2:2.9,generation?3.5:4.4),
        branchAt:t+rand(300,620),branched:false,phase:rand(0,Math.PI*2)
      };
      nodes.push(n);
      if(parent)links.push({groupId:group.id,a:parent.id,b:n.id,phase:rand(0,1)});
      return n;
    }
    function spawnGroup(t){
      const limit=kind==="head"?2:2;
      if(groups.length>=limit)return;
      const group={id:kind+"-"+(++seq),born:t,life:rand(kind==="head"?4300:5000,kind==="head"?6200:7000)};
      groups.push(group);
      const root=addNode(group,null,size.w*.5+rand(-size.w*.08,size.w*.08),size.h*.5+rand(-size.h*.08,size.h*.08),0,t);
      root.x=root.sx;root.y=root.sy;
    }
    function byId(id){return nodes.find(n=>n.id===id)}
    function branch(n,t){
      if(n.branched||n.generation>=3)return;
      n.branched=true;
      const group=groups.find(g=>g.id===n.groupId);
      if(!group)return;
      const count=n.generation===0?2:(Math.random()<.58?2:1);
      for(let i=0;i<count;i++){
        let target=null;
        for(let tries=0;tries<18;tries++){
          const angle=rand(0,Math.PI*2);
          const dist=rand(kind==="head"?11:12,kind==="head"?22:24)*(1-n.generation*.08);
          const tx=n.x+Math.cos(angle)*dist;
          const ty=n.y+Math.sin(angle)*dist*.78;
          if(inside(tx,ty)){target={x:tx,y:ty};break}
        }
        if(target)addNode(group,n,target.x,target.y,n.generation+1,t+rand(0,110));
      }
    }
    function alpha(group,t){
      const age=t-group.born;
      if(age<0||age>group.life)return 0;
      return Math.min(clamp(age/620,0,1),clamp((group.life-age)/1300,0,1));
    }
    function cleanup(t){
      const dead=new Set(groups.filter(g=>t-g.born>g.life).map(g=>g.id));
      for(let i=groups.length-1;i>=0;i--)if(dead.has(groups[i].id))groups.splice(i,1);
      for(let i=nodes.length-1;i>=0;i--)if(dead.has(nodes[i].groupId))nodes.splice(i,1);
      for(let i=links.length-1;i>=0;i--)if(dead.has(links[i].groupId))links.splice(i,1);
    }
    function frame(t){
      if(!document.body.contains(canvas)){ro?.disconnect();return}
      if(!reduce&&t-lastSpawn>nextSpawn){
        spawnGroup(t);
        lastSpawn=t;
        nextSpawn=rand(kind==="head"?900:1200,kind==="head"?1450:1750);
      }
      cleanup(t);
      ctx.clearRect(0,0,size.w,size.h);
      const rgb=numaLifeRgb();

      links.forEach(link=>{
        const a=byId(link.a),b=byId(link.b),group=groups.find(g=>g.id===link.groupId);
        if(!a||!b||!group)return;
        const ga=alpha(group,t),growth=ease((t-b.born)/b.grow);
        if(ga<=0||growth<=0)return;
        const bx=a.x+(b.x-a.x)*growth,by=a.y+(b.y-a.y)*growth;
        const grad=ctx.createLinearGradient(a.x,a.y,bx,by);
        grad.addColorStop(0,"rgba("+rgb.r+","+rgb.g+","+rgb.b+",0)");
        grad.addColorStop(.32,"rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(ga*.30)+")");
        grad.addColorStop(.68,"rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(ga*.48)+")");
        grad.addColorStop(1,"rgba("+rgb.r+","+rgb.g+","+rgb.b+",0)");
        ctx.strokeStyle=grad;ctx.lineWidth=kind==="head"?.9:1.0;ctx.lineCap="round";
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(bx,by);ctx.stroke();
        if(growth>.96){
          const q=(t*.00024+link.phase)%1;
          const px=a.x+(b.x-a.x)*q,py=a.y+(b.y-a.y)*q;
          ctx.fillStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(ga*.64)+")";
          ctx.beginPath();ctx.arc(px,py,1.15,0,Math.PI*2);ctx.fill();
        }
      });

      nodes.forEach(n=>{
        const group=groups.find(g=>g.id===n.groupId);
        if(!group)return;
        const ga=alpha(group,t),growth=ease((t-n.born)/n.grow);
        if(ga<=0||growth<=0)return;
        n.x=n.sx+(n.tx-n.sx)*growth;
        n.y=n.sy+(n.ty-n.sy)*growth;
        if(!n.branched&&growth>.9&&t>=n.branchAt)branch(n,t);
        const pulse=.86+.14*Math.sin(t*.0022+n.phase);
        const rr=n.r*growth*pulse;
        const aura=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,rr*3.0);
        aura.addColorStop(0,"rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(ga*.30)+")");
        aura.addColorStop(1,"rgba("+rgb.r+","+rgb.g+","+rgb.b+",0)");
        ctx.fillStyle=aura;
        ctx.beginPath();ctx.arc(n.x,n.y,rr*3,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=7;ctx.shadowColor="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(ga*.34)+")";
        ctx.fillStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(ga*.82)+")";
        ctx.beginPath();ctx.arc(n.x,n.y,rr,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;
      });

      if(!reduce)requestAnimationFrame(frame);
    }

    if(reduce){spawnGroup(performance.now());frame(performance.now()+900)}
    else requestAnimationFrame(frame);
  }

  canvases.forEach(mountCore);
}
function numaMountLauncherParticles(){
  const canvas=document.getElementById("nma-launcher-canvas");
  if(!canvas||canvas.dataset.mounted==="1")return;
  canvas.dataset.mounted="1";
  const ctx=canvas.getContext("2d"),reduce=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const dpr=Math.min(devicePixelRatio||1,1.5),W=112,H=150;
  canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+"px";canvas.style.height=H+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const rand=(a,b)=>Math.random()*(b-a)+a,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>1-Math.pow(1-clamp(t,0,1),3);
  let seq=0,lastSprout=0,nextSprout=520;
  const sprouts=[],nodes=[],links=[];
  function nodeById(id){return nodes.find(n=>n.id===id)}
  function addNode(sprout,parent,tx,ty,generation,t){
    const sx=parent?parent.x:W*.5,sy=parent?parent.y:H-19;
    const n={id:"s"+sprout.id+"-"+(++seq),sproutId:sprout.id,parentId:parent?.id||"",generation,sx,sy,tx,ty,x:sx,y:sy,born:t,grow:rand(330,580),r:Math.max(1.05,3.05-generation*.52),branchAt:t+rand(260,480),branched:false,phase:rand(0,Math.PI*2)};
    nodes.push(n);if(parent)links.push({sproutId:sprout.id,a:parent.id,b:n.id,phase:rand(0,1)});return n;
  }
  function spawnSprout(t){
    if(sprouts.length>=3)return;
    const s={id:++seq,born:t,life:rand(3000,4100)};
    sprouts.push(s);
    const root=addNode(s,null,W*.5+rand(-4,4),H-31,0,t);
    root.x=root.sx;root.y=root.sy;
  }
  function branch(n,t){
    if(n.branched||n.generation>=3)return;
    n.branched=true;
    const s=sprouts.find(x=>x.id===n.sproutId);if(!s)return;
    const count=n.generation===0?2:(Math.random()<.52?2:1);
    for(let i=0;i<count;i++){
      const spread=(i-(count-1)/2)*rand(.34,.58)+rand(-.32,.32);
      const angle=-Math.PI/2+spread,dist=rand(15,25);
      const tx=clamp(n.x+Math.cos(angle)*dist,18,W-18),ty=clamp(n.y+Math.sin(angle)*dist,8,H-28);
      addNode(s,n,tx,ty,n.generation+1,t+rand(0,120));
    }
  }
  function alpha(s,t){const age=t-s.born;if(age<0||age>s.life)return 0;return Math.min(clamp(age/480,0,1),clamp((s.life-age)/900,0,1))}
  function cleanup(t){
    const dead=new Set(sprouts.filter(s=>t-s.born>s.life).map(s=>s.id));
    for(let i=sprouts.length-1;i>=0;i--)if(dead.has(sprouts[i].id))sprouts.splice(i,1);
    for(let i=nodes.length-1;i>=0;i--)if(dead.has(nodes[i].sproutId))nodes.splice(i,1);
    for(let i=links.length-1;i>=0;i--)if(dead.has(links[i].sproutId))links.splice(i,1);
  }
  function frame(t){
    if(!document.body.contains(canvas))return;
    if(!reduce&&t-lastSprout>nextSprout){spawnSprout(t);lastSprout=t;nextSprout=rand(720,1080)}
    cleanup(t);ctx.clearRect(0,0,W,H);const rgb=numaLauncherRgb();
    links.forEach(l=>{
      const a=nodeById(l.a),b=nodeById(l.b),s=sprouts.find(x=>x.id===l.sproutId);if(!a||!b||!s)return;
      const sa=alpha(s,t),g=ease((t-b.born)/b.grow);if(sa<=0||g<=0)return;
      const bx=a.x+(b.x-a.x)*g,by=a.y+(b.y-a.y)*g;
      ctx.strokeStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sa*.28)+")";ctx.lineWidth=.75;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(bx,by);ctx.stroke();
      if(g>.98){
        const q=(t*.00028+l.phase)%1,px=a.x+(b.x-a.x)*q,py=a.y+(b.y-a.y)*q;
        ctx.fillStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sa*.52)+")";ctx.beginPath();ctx.arc(px,py,.9,0,Math.PI*2);ctx.fill();
      }
    });
    nodes.forEach(n=>{
      const s=sprouts.find(x=>x.id===n.sproutId);if(!s)return;
      const sa=alpha(s,t),g=ease((t-n.born)/n.grow);if(sa<=0||g<=0)return;
      n.x=n.sx+(n.tx-n.sx)*g;n.y=n.sy+(n.ty-n.sy)*g;
      if(!n.branched&&g>.92&&t>=n.branchAt)branch(n,t);
      const rr=n.r*g*(.88+.12*Math.sin(t*.0024+n.phase))*(1-n.generation*.08);
      ctx.shadowBlur=7;ctx.shadowColor="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sa*.34)+")";
      ctx.fillStyle="rgba("+rgb.r+","+rgb.g+","+rgb.b+","+(sa*.58)+")";
      ctx.beginPath();ctx.arc(n.x,n.y,rr,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    });
    if(!reduce)numaLauncherRaf=requestAnimationFrame(frame);
  }
  if(reduce){spawnSprout(performance.now());frame(performance.now()+900)}
  else numaLauncherRaf=requestAnimationFrame(frame);
}
function numaVisualFromResponse(data){
  const reply=String(data?.message?.content||'');
  if(data?.provider==='openai_error')return {state:'error',expression:'error',duration:2600};
  if(/no pude (?:interpretar|relacionar|entender)/i.test(reply))return {state:'attentive',expression:'confused',duration:3200};
  if(data?.dialogue?.awaiting)return {state:'attentive',expression:'question',duration:0};
  if(data?.action)return {state:'success',expression:'success',duration:1800};
  return {state:'idle',expression:'speak',duration:Math.max(1300,Math.min(3200,700+reply.length*18))};
}

function numaClearVisualDemo(){numaVisualDemoTimers.forEach(id=>clearTimeout(id));numaVisualDemoTimers=[]}
function numaCanVisualQa(){const ctx=numaState?.context||{};return ctx.canDevelop===true||ctx.roleKey==='owner'||ctx.roleKey==='developer'}
function numaRunVisualDemo(){
  numaClearVisualDemo();
  const scenes=[[0,'success','speak','Hola. Dime qué receta, preparación o producto buscas.'],[1900,'attentive','question','¿En qué puedo ayudarte?'],[3800,'listening','listening','Te estoy escuchando.'],[5700,'thinking','thinking','Déjame pensar…'],[7600,'success','success','Listo. Todo salió bien.'],[9500,'attentive','confused','No entendí eso del todo.'],[11400,'error','error','Aquí verías mi estado de error.'],[13300,'idle','none','Prueba visual terminada.']];
  scenes.forEach(([delay,state,expression,text])=>numaVisualDemoTimers.push(setTimeout(()=>{numaSetVisualState(state,expression,0);numaSpeak(text,{expression,duration:0})},delay)));
}
function numaHandleVisualQaCommand(message){
  const cmd=String(message||'').trim().toLowerCase();if(!cmd.startsWith('/numa'))return false;
  if(!numaCanVisualQa()){numaSetVisualState('attentive','question',2400);numaSpeak('El modo de prueba visual está reservado al propietario o desarrollador.',{expression:'question',duration:2400});return true}
  if(/^\/numa\s+(demo|prueba|test)$/.test(cmd)){numaRunVisualDemo();return true}
  const map={idle:['idle','none'],reposo:['idle','none'],atento:['attentive','question'],attentive:['attentive','question'],escuchando:['listening','listening'],listening:['listening','listening'],pensando:['thinking','thinking'],thinking:['thinking','thinking'],exito:['success','success'],'éxito':['success','success'],success:['success','success'],confundida:['attentive','confused'],confusion:['attentive','confused'],'confusión':['attentive','confused'],error:['error','error']};
  const key=cmd.replace(/^\/numa\s+/,'');const target=map[key];
  if(target){numaClearVisualDemo();numaSetVisualState(target[0],target[1],0);numaSpeak('Prueba visual: '+key+'.',{expression:target[1],duration:0})}
  else{numaSetVisualState('attentive','question',3000);numaSpeak('Usa /numa demo o /numa idle, atento, escuchando, pensando, exito, confusion o error.',{expression:'question',duration:3000})}
  return true;
}

function numaContextInput(){
  return {
    currentToolKey:'dynamic-specs',
    currentToolLabel:workspaceToolName
  };
}
function numaSearchNorm(value){
  try{
    return String(value??'')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,' ')
      .trim();
  }catch(_){return String(value??'').toLowerCase().trim()}
}
function numaExtractSheetQuery(message){
  let q=String(message||'').trim();
  const related=q.match(/(?:fichas?|recetas?).*?(?:relacionad[oa]s?\s+con|sobre|que\s+tengan?)\s+(.+)$/i);
  if(related?.[1])q=related[1];
  else{
    q=q.replace(/^.*?\b(?:abre|abrir|busca|buscar|encuentra|encontrar|muestra|mostrar|ve\s+a|ir\s+a)\b\s*/i,'');
    q=q.replace(/^(?:la|el|los|las|una|un)\s+/i,'');
    q=q.replace(/^(?:ficha(?:\s+t[eé]cnica)?|receta|plato|preparaci[oó]n)\s*(?:de|llamada?|que\s+se\s+llama)?\s*/i,'');
  }
  q=q.replace(/\s+(?:en\s+)?(?:fichas(?:\s+t[eé]cnicas)?|recetario)\s*$/i,'');
  q=q.replace(/\s+(?:o\s+no|por\s+favor|porfa|si\s+puedes|si\s+puede)\s*[?!.]*$/i,'');
  q=q.replace(/^[¿?¡!.,;:\s]+|[¿?¡!.,;:\s]+$/g,'');
  return q.slice(0,300);
}
function numaLocalSheetContext(message){
  const data=engineDataCache;
  const recipes=Array.isArray(data?.recipes)?data.recipes:[];
  const query=numaExtractSheetQuery(message);
  const sample=recipes.slice(0,10).map(row=>row?.titleEs||row?.titleEn||row?._id).filter(Boolean);
  if(!query)return {query:'',matches:[],total:recipes.length,sample};

  const sectionsByRecipe=new Map();
  for(const section of Array.isArray(data?.sections)?data.sections:[]){
    const recipeId=String(section?.recipeId||'');
    if(!recipeId)continue;
    if(!sectionsByRecipe.has(recipeId))sectionsByRecipe.set(recipeId,[]);
    sectionsByRecipe.get(recipeId).push(section);
  }
  const ingredients=new Map((Array.isArray(data?.ingredients)?data.ingredients:[]).map(row=>[String(row?._id||''),row]));
  const preparations=new Map((Array.isArray(data?.preparations)?data.preparations:[]).map(row=>[String(row?._id||''),row]));
  const recipesById=new Map(recipes.map(row=>[String(row?._id||''),row]));
  const q=numaSearchNorm(query);
  const tokens=q.split(' ').filter(Boolean);
  const matches=[];

  for(const recipe of recipes){
    const id=String(recipe?._id||'');
    if(!id)continue;
    const titleEs=numaSearchNorm(recipe?.titleEs);
    const titleEn=numaSearchNorm(recipe?.titleEn);
    const sections=sectionsByRecipe.get(id)||[];
    const sectionIds=new Set(sections.map(section=>String(section?._id||'')).filter(Boolean));
    const corpus=[
      recipe?.titleEs,recipe?.titleEn,recipe?.category,recipe?.recipeType,
      recipe?.notesEs,recipe?.notesEn,recipe?.methodEs,recipe?.methodEn
    ];
    for(const section of sections)corpus.push(section?.titleEs,section?.titleEn,section?.sectionType);
    for(const component of Array.isArray(data?.components)?data.components:[]){
      if(String(component?.recipeId||'')!==id&&!sectionIds.has(String(component?.sectionId||'')))continue;
      corpus.push(component?.displayEs,component?.displayEn,component?.noteEs,component?.noteEn);
      const ingredient=ingredients.get(String(component?.targetIngredientId||''));
      if(ingredient)corpus.push(ingredient?.nameEs,ingredient?.nameEn,ingredient?.descriptionEs,ingredient?.descriptionEn);
      const preparation=preparations.get(String(component?.targetPreparationId||''));
      if(preparation)corpus.push(preparation?.nameEs,preparation?.nameEn,preparation?.descriptionEs,preparation?.descriptionEn);
      const subRecipe=recipesById.get(String(component?.targetRecipeId||''));
      if(subRecipe)corpus.push(subRecipe?.titleEs,subRecipe?.titleEn);
    }

    let score=0;
    if(titleEs===q||titleEn===q)score+=120;
    else if(titleEs.startsWith(q)||titleEn.startsWith(q))score+=90;
    else if(titleEs.includes(q)||titleEn.includes(q))score+=75;

    const hay=numaSearchNorm(corpus.filter(Boolean).join(' '));
    const matched=tokens.filter(token=>hay.includes(token)).length;
    if(tokens.length&&matched===tokens.length)score+=45;
    else score+=matched*8;
    if(numaSearchNorm(recipe?.category).includes(q))score+=12;
    if(score<=0)continue;

    matches.push({
      id,
      title:recipe?.titleEs||recipe?.titleEn||id,
      titleEs:recipe?.titleEs||'',
      titleEn:recipe?.titleEn||'',
      score,
      exact:titleEs===q||titleEn===q
    });
  }

  matches.sort((a,b)=>
    Number(b.exact)-Number(a.exact)||
    Number(b.score)-Number(a.score)||
    String(a.title).localeCompare(String(b.title),'es')
  );
  return {query,matches:matches.slice(0,8),total:recipes.length,sample};
}
function numaTime(value){
  try{return new Date(value||Date.now()).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}catch(_){return''}
}
function numaRenderMessages(messages=[]){
  const panel=document.getElementById('nma-panel');
  if(panel?.dataset?.greetingHold==='1')return;
  const latest=[...(messages||[])].reverse().find(m=>m?.role==='assistant'&&String(m?.content||'').trim());
  numaSpeak(latest?.content||'Hola. Dime qué receta, preparación o producto buscas.');
}
function numaSetStatus(value,state=''){
  const el=document.getElementById('nma-status');
  if(!el)return;
  el.textContent=value||'';
  el.dataset.state=state;
}
function numaSyncHeader(){
  const ctx=numaState?.context;
  const title=document.getElementById('nma-context');
  if(title){
    title.textContent=ctx
      ?((ctx.workspaceName?ctx.workspaceName+' · ':'')+workspaceToolName)
      :workspaceToolName;
  }
  const role=document.getElementById('nma-role');
  if(role){
    role.textContent=ctx?.roleName||'';
    role.hidden=!ctx?.roleName;
  }
}
async function numaLoad(force=false){
  if(!sessionToken||numaLoading)return;
  const key='dynamic-specs|'+workspaceLabel;
  if(!force&&numaState&&numaContextKey===key){
    numaSyncHeader();
    numaRenderMessages(numaState.messages||[]);
    return;
  }
  numaLoading=true;
  numaSetStatus('Cargando contexto…','loading');
  try{
    const data=await api('numa.bootstrap',{input:numaContextInput()});
    numaState=data||null;
    numaContextKey=key;
    numaSyncHeader();
    numaRenderMessages(data?.messages||[]);
    numaSetStatus(data?.providerMode==='local_only'?'Modo local · sin consumo API':(data?.providerConfigured?'API configurada':'Búsqueda local activa'),'local');
  }catch(error){
    numaSetStatus(error?.message||String(error),'error');
  }finally{
    numaLoading=false;
  }
}
function numaOpen(){
  const panel=document.getElementById('nma-panel');
  if(!panel)return;
  numaSyncVisualTheme();
  panel.dataset.greetingHold='1';
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');
  document.getElementById('nma-launcher')?.setAttribute('aria-expanded','true');
  numaSetVisualState('success','speak',1500);
  numaSpeak('Hola. Dime qué receta, preparación o producto buscas.',{expression:'speak',duration:1500});
  numaMountLifeParticles();
  numaLoad(false);
  setTimeout(()=>{
    panel.dataset.greetingHold='0';
    if(!numaSending)numaSetVisualState('idle','none');
    document.getElementById('nma-input')?.focus();
  },1500);
}
function numaClose(){
  numaClearVisualDemo();
  document.getElementById('nma-panel')?.classList.remove('open');
  document.getElementById('nma-panel')?.setAttribute('aria-hidden','true');
  document.getElementById('nma-launcher')?.setAttribute('aria-expanded','false');
  numaSetVisualState('idle','none');
}
function toolUrl(routePath){
  const route=String(routePath||'').trim();
  if(!route)return'';
  try{
    const u=new URL(siteBase()+(route.startsWith('/')?route:'/'+route),location.href);
    u.searchParams.set('nxoBack',location.href);
    u.searchParams.set('nxoBackLabel',workspaceToolName);
    u.searchParams.set('nxoTheme',workspaceTheme);
    return u.href;
  }catch(_){return''}
}
function numaPerformAction(action){
  if(!action)return;
  if(action.type==='openWorkspace'){
    if(!action.workspaceId){numaSetStatus('Numa no recibió un Workspace válido.','error');return}
    numaClose();
    try{
      const u=new URL(siteBase()+'/blank-8',location.href);
      u.searchParams.set('nxoWorkspace',String(action.workspaceId));
      u.searchParams.set('nxoTheme',workspaceTheme);
      location.assign(u.href);
    }catch(_){openPersonalSpace()}
    return;
  }
  if(action.type==='goBack'){
    numaClose();
    if(history.length>1){history.back();return}
    openPersonalSpace();
    return;
  }
  if(action.type==='openTechnicalSheet'){
    if(!action.sheetId){numaSetStatus('La ficha no tiene un identificador válido.','error');return}
    postToEngine('NUMA_OPEN_RECIPE',{sheetId:String(action.sheetId),title:String(action.title||'')});
    numaSetStatus('Ficha abierta','local');
    numaClose();
    return;
  }
  if(action.type!=='navigate')return;
  if(action.target==='mi-espacio'){openPersonalSpace();return}
  if(action.target==='centro-desarrollo'){openDevelopmentCenter();return}
  const url=toolUrl(action.routePath);
  if(url)location.assign(url);
}
async function numaSend(){
  if(numaSending)return;
  const input=document.getElementById('nma-input');
  const button=document.getElementById('nma-send');
  const message=String(input?.value||'').trim();
  if(!message)return;
  if(numaHandleVisualQaCommand(message)){if(input)input.value='';return}
  numaSending=true;
  if(input){input.value='';input.disabled=true}
  if(button)button.disabled=true;
  const optimistic=[
    ...(numaState?.messages||[]),
    {role:'user',content:message,at:new Date().toISOString()}
  ];
  numaRenderMessages(optimistic);
  numaSetStatus('Numa está buscando…','loading');
  numaSetVisualState('thinking','thinking');
  try{
    const localSheetContext=numaLocalSheetContext(message);
    const data=await api('numa.send',{input:{...numaContextInput(),message,localSheetContext}});
    numaState={
      ...(numaState||{}),
      context:data?.context||numaState?.context||null,
      messages:[...optimistic,(data?.message||{role:'assistant',content:'Listo.',at:new Date().toISOString()})]
    };
    numaSyncHeader();
    numaRenderMessages(numaState.messages);
    numaSetStatus(data?.provider==='openai'?'IA conectada':(data?.provider==='openai_error'?'OpenAI requiere atención':(data?.provider==='local_only'?'Modo local · sin consumo API':'Búsqueda local activa')),data?.provider==='openai'?'online':(data?.provider==='openai_error'?'error':'local'));
    const visual=numaVisualFromResponse(data);
    numaSetVisualState(visual.state,visual.expression,visual.duration);
    numaSpeak(data?.message?.content||'Listo.',{expression:visual.expression,duration:visual.duration||0});
    if(data?.action)setTimeout(()=>numaPerformAction(data.action),900);
  }catch(error){
    const failed=[...optimistic,{role:'assistant',content:'No pude completar esa solicitud: '+(error?.message||String(error)),at:new Date().toISOString()}];
    numaState={...(numaState||{}),messages:failed};
    numaRenderMessages(failed);
    numaSetStatus('No se pudo completar la solicitud','error');
    numaSetVisualState('error','error',3000);
    numaSpeak(failed[failed.length-1]?.content||'No pude completar esa solicitud.',{expression:'error',duration:3000});
  }finally{
    numaSending=false;
    if(input){input.disabled=false;input.focus()}
    if(button)button.disabled=false;
  }
}
function mountNuma(){
  if(!sessionToken)return;
  ensureNumaCss();
  let launcher=document.getElementById('nma-launcher');
  if(!launcher){
    launcher=document.createElement('button');
    launcher.id='nma-launcher';
    launcher.className='nma-launcher';
    launcher.dataset.theme=workspaceTheme;
    launcher.type='button';
    launcher.setAttribute('aria-label','Abrir Numa');
    launcher.setAttribute('aria-expanded','false');
    launcher.innerHTML='<canvas id="nma-launcher-canvas" class="nma-launcher-canvas" aria-hidden="true"></canvas><span class="nma-launch-core" aria-hidden="true"></span>';
    document.body.appendChild(launcher);
    launcher.onclick=()=>document.getElementById('nma-panel')?.classList.contains('open')?numaClose():numaOpen();
  }
  let panel=document.getElementById('nma-panel');
  if(!panel){
    panel=document.createElement('aside');
    panel.id='nma-panel';
    panel.className='nma-panel';
    panel.dataset.theme=workspaceTheme;
    panel.dataset.state='idle';
    panel.setAttribute('aria-hidden','true');
    panel.innerHTML=
      '<button id="nma-close" class="nma-presence-close" type="button" aria-label="Cerrar Numa">✕</button>'+
      '<div class="nma-character-stage" aria-label="Numa">'+
        '<div class="nma-character-shell" id="nma-character-shell">'+
          '<img id="nma-character-img" class="nma-character" alt="" draggable="false">'+
          numaLifeFieldMarkup()+
          '<div class="nma-expression-layer" id="nma-expression-layer" aria-hidden="true"></div>'+
        '</div>'+
      '</div>'+
      '<div class="nma-speech" id="nma-speech" role="status" aria-live="polite">Hola. Dime qué receta, preparación o producto buscas.</div>'+
      '<div class="nma-status-row"><span class="nma-status-dot"></span><span id="nma-status">Modo local · sin consumo API</span></div>'+
      '<div class="nma-compose"><textarea id="nma-input" rows="1" maxlength="8000" placeholder="Escribe a Numa…"></textarea><button id="nma-send" type="button" aria-label="Enviar mensaje">➤</button></div>';
    document.body.appendChild(panel);
    panel.querySelector('#nma-close').onclick=numaClose;
    panel.querySelector('#nma-send').onclick=numaSend;
    const nmaInput=panel.querySelector('#nma-input');
    nmaInput.addEventListener('keydown',event=>{
      if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();numaSend()}
      if(event.key==='Escape')numaClose();
    });
    nmaInput.addEventListener('focus',()=>{
      const expression=document.getElementById('nma-expression-layer')?.dataset?.expression||'none';
      if(!numaSending&&expression==='none'&&String(nmaInput.value||'').trim()==='')numaSetVisualState('attentive','none');
    });
    nmaInput.addEventListener('input',()=>{
      if(numaSending)return;
      if(numaTypingTimer)clearTimeout(numaTypingTimer);
      const hasText=String(nmaInput.value||'').trim().length>0;
      numaSetVisualState(hasText?'listening':'attentive',hasText?'listening':'none');
      numaTypingTimer=setTimeout(()=>{
        numaTypingTimer=0;
        if(!numaSending&&document.activeElement===nmaInput)numaSetVisualState('attentive','none');
      },850);
    });
    nmaInput.addEventListener('blur',()=>{
      if(!numaSending)setTimeout(()=>{if(!numaSending)numaSetVisualState('idle','none')},120);
    });
  }
  numaSyncVisualTheme();
  numaSetVisualState('idle','none');
  numaMountLauncherParticles();
  numaMountLifeParticles();
  numaSyncHeader();
}
function clearRequestedSheetParams(){
  try{
    const u=new URL(location.href);
    u.searchParams.delete('numaSheet');
    u.searchParams.delete('numaSheetTitle');
    history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
  }catch(_){}
}
function openRequestedSheet(){
  if(requestedSheetOpened||!requestedSheetId)return;
  postToEngine('NUMA_OPEN_RECIPE',{sheetId:requestedSheetId,title:requestedSheetTitle});
}
function accessError(code){
  return new Error('No se pudo completar el acceso ('+ACCESS_REVISION+' / '+accessStage+' / '+code+'). Reintenta.');
}
function esc(v){
  return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function mountRoot(){
  document.body.style.overflow='hidden';
  let root=document.getElementById('nx-fichas-app');
  if(!root){
    root=document.createElement('div');
    root.id='nx-fichas-app';
    root.style.cssText='position:fixed;inset:0;z-index:2147483500;background:'+UI_THEME.background+';color:'+UI_THEME.textPrimary+';display:block;';
    document.body.appendChild(root);
  }
  return root;
}
function loading(text='Preparando '+workspaceToolName+'…'){
  mountRoot().innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:'+UI_THEME.background+';color:'+UI_THEME.textPrimary+';font:600 14px Inter,Arial,sans-serif"><div style="text-align:center"><div style="width:34px;height:34px;border:3px solid '+UI_THEME.border+';border-top-color:'+UI_THEME.accent+';border-radius:50%;margin:0 auto 14px;animation:nxspin .8s linear infinite"></div><strong>'+esc(text)+'</strong><style>@keyframes nxspin{to{transform:rotate(360deg)}}</style></div></div>';
}
function showError(error){
  const message=String(error?.message||error||'Error desconocido');
  mountRoot().innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:'+UI_THEME.background+';color:'+UI_THEME.textPrimary+';font:14px Inter,Arial,sans-serif;padding:24px"><div style="max-width:560px;border:1px solid '+UI_THEME.border+';border-radius:18px;background:'+UI_THEME.surfaceRaised+';padding:22px"><h2 style="margin:0 0 10px">No se pudo abrir '+esc(workspaceToolName)+'</h2><p style="color:'+UI_THEME.textMuted+';line-height:1.55">'+esc(message)+'</p><button id="nx-engine-retry" style="border:1px solid '+UI_THEME.borderStrong+';background:'+UI_THEME.accent+';color:'+UI_THEME.accentContrast+';border-radius:10px;padding:10px 14px;font-weight:800">Reintentar</button></div></div>';
  document.getElementById('nx-engine-retry')?.addEventListener('click',retryAccess);
}
function loginVisible(visible){
  const root=document.getElementById('nx-fichas-app');
  if(root)root.style.display=visible?'none':'block';
}
function retryAccess(){
  const u=new URL(location.href);
  ['nxb','nxbe','nxbs','nxav'].forEach(k=>u.searchParams.delete(k));
  location.replace(u.href);
}
async function api(action,payload={}){
  const headers={'Content-Type':'application/json','Accept':'application/json'};
  if(sessionToken)headers.Authorization='Bearer '+sessionToken;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),30000);
  try{
    const response=await fetch(API,{
      method:'POST',
      cache:'no-store',
      signal:controller.signal,
      headers,
      body:JSON.stringify({action,...payload})
    });
    let data=null;
    try{data=await response.json()}catch(_){}
    if(!response.ok){
      if(data?.error)throw new Error(String(data.error));
      throw new Error('No se pudo completar '+action+' (HTTP_'+response.status+').');
    }
    if(!data)throw new Error('Respuesta inválida en '+action+'.');
    if(data?.ok===false)throw new Error(data.error||'Operación no disponible');
    return data?.data??data;
  }catch(error){
    if(error?.name==='AbortError')throw accessError('REQUEST_TIMEOUT');
    throw error;
  }finally{
    clearTimeout(timer);
  }
}
function stripBoot(){
  try{
    const u=new URL(location.href);
    ['nxb','nxbe','nxbs','nxav'].forEach(k=>u.searchParams.delete(k));
    history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
  }catch(_){}
}
async function waitBoot(){
  let previous='',deadline=Date.now()+30000;
  try{
    while(Date.now()<deadline){
      const q=new URLSearchParams(location.search);
      const token=q.get('nxb');
      const error=q.get('nxbe');
      const state=q.get('nxbs')||'WAITING_PAGE';
      if(state!==previous){
        previous=state;
        accessStage=state;
        deadline=Date.now()+(state==='LOGIN'?310000:30000);
        loginVisible(state==='LOGIN');
      }
      if(error)throw accessError(error);
      if(token&&(state==='READY'||state==='WAITING_PAGE'))return token;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw accessError('PAGE_TIMEOUT');
  }finally{
    loginVisible(false);
  }
}
function workspaceReturnUrl(){
  const q=new URLSearchParams(location.search);
  const raw=q.get('nxoBack')||'';
  if(raw){
    try{
      const u=new URL(raw,location.href);
      if(u.origin===location.origin){
        u.searchParams.set('nxoLang',workspaceLanguage);
        u.searchParams.set('nxoTheme',workspaceTheme);
        return u.href
      }
    }catch(_){}
  }
  const parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean);
  const siteRoot=location.origin+(parts.length?'/'+parts[0]:'');
  const u=new URL(siteRoot+'/blank-8');
  u.searchParams.set('nxoLang',workspaceLanguage);
  u.searchParams.set('nxoTheme',workspaceTheme);
  return u.href;
}
function exitToWorkspace(){
  location.assign(workspaceReturnUrl());
}
function siteBase(){
  const p=location.pathname.replace(/\/+$/,'');
  return (location.origin+p.replace(/\/blank-4$/,'')).replace(/\/$/,'');
}
function openPersonalSpace(){
  const u=new URL(siteBase()+'/blank-8',location.href);
  u.searchParams.set('nxoLang',workspaceLanguage);
  u.searchParams.set('nxoTheme',workspaceTheme);
  location.assign(u.href);
}
function openDevelopmentCenter(){
  const u=new URL(siteBase()||location.origin,location.href);
  u.searchParams.set('nxoLang',workspaceLanguage);
  u.searchParams.set('nxoTheme',workspaceTheme);
  location.assign(u.href);
}
function postToEngine(type,payload={}){
  try{frame?.contentWindow?.postMessage({type,payload},'*')}catch(_){}
}
async function pushEngineData(){
  if(loadingData)return;
  loadingData=true;
  try{
    const data=await api('engine.data');
    engineDataCache=data||null;
    postToEngine('DM_MENU_DATA',{ok:true,...data});
  }catch(error){
    postToEngine('DM_MENU_DATA',{ok:false,error:String(error?.message||error)});
    throw error;
  }finally{
    loadingData=false;
  }
}
function ensureImportHostStyles(){
  if(document.getElementById('nx-import-host-style'))return;
  const style=document.createElement('style');
  style.id='nx-import-host-style';
  style.textContent=
    '#nx-import-host{position:fixed;inset:0;z-index:2147483646;background:var(--nx-overlay);display:grid;place-items:center;padding:18px;font-family:Inter,Arial,sans-serif;color:var(--nx-text)}'+
    '#nx-import-host .box{width:min(660px,calc(100vw - 36px));max-height:88vh;overflow:auto;background:var(--nx-raised);color:var(--nx-text);border:1px solid var(--nx-border-strong);border-radius:20px;box-shadow:0 28px 70px var(--nx-shadow)}'+
    '#nx-import-host .head{display:flex;align-items:center;justify-content:space-between;padding:15px 17px;border-bottom:1px solid var(--nx-border);position:sticky;top:0;background:var(--nx-surface);z-index:2}'+
    '#nx-import-host .head strong{font-size:17px}#nx-import-host .close{width:36px;height:36px;border:1px solid var(--nx-btn-border);border-radius:10px;background:var(--nx-btn-bg);color:var(--nx-btn-text);font-size:22px;cursor:pointer}#nx-import-host .close:hover{background:var(--nx-interaction);color:var(--nx-interaction-contrast);border-color:var(--nx-interaction)}'+
    '#nx-import-host .body{padding:17px}#nx-import-host p{color:var(--nx-muted);line-height:1.5}'+
    '#nx-import-host input{width:100%;box-sizing:border-box;border:1px solid var(--nx-border);border-radius:11px;padding:12px 13px;font:inherit;background:var(--nx-surface);margin:6px 0 12px;color:var(--nx-text);outline:none}#nx-import-host input::placeholder{color:var(--nx-muted)}#nx-import-host input:focus{border-color:var(--nx-interaction);box-shadow:0 0 0 3px var(--nx-accent-soft)}'+
    '#nx-import-host .btn{border:1px solid var(--nx-btn-border);background:var(--nx-btn-bg);color:var(--nx-btn-text);border-radius:11px;padding:10px 13px;font-weight:850;cursor:pointer;transition:transform .14s ease,background .14s ease,color .14s ease,box-shadow .14s ease}'+
    '#nx-import-host .btn.primary{background:var(--nx-positive);color:var(--nx-positive-contrast);border-color:var(--nx-positive)}#nx-import-host .btn:hover,#nx-import-host .btn:focus-visible{background:var(--nx-interaction);color:var(--nx-interaction-contrast);border-color:var(--nx-interaction);transform:translateY(-1px);box-shadow:0 8px 16px var(--nx-shadow);outline:none}#nx-import-host .btn:active{transform:translateY(0) scale(.99)}#nx-import-host .btn:disabled{opacity:.55;cursor:default;transform:none;box-shadow:none}'+
    '#nx-import-host .wide{width:100%}.nx-imp-spin{display:flex;align-items:center;gap:9px;color:var(--nx-muted);font-size:12px;min-height:24px;margin-bottom:10px}'+
    '.nx-imp-spin:before{content:"";width:15px;height:15px;border:2px solid var(--nx-border);border-top-color:var(--nx-accent);border-radius:50%;animation:nxImpSpin .8s linear infinite}@keyframes nxImpSpin{to{transform:rotate(360deg)}}'+
    '.nx-imp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}.nx-imp-stat{background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:12px;padding:11px}.nx-imp-stat strong{display:block;font-size:20px}.nx-imp-stat span{font-size:10px;color:var(--nx-muted)}'+
    '.nx-imp-group{display:flex;justify-content:space-between;gap:12px;padding:10px 11px;border:1px solid var(--nx-border);border-radius:11px;margin:7px 0;background:var(--nx-surface)}.nx-imp-group span{color:var(--nx-muted);font-size:11px}'+
    '.nx-imp-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.nx-imp-resume{padding:10px 11px;border:1px solid var(--nx-border);background:var(--nx-accent-soft);border-radius:11px;color:var(--nx-soft);font-size:11px;line-height:1.45;margin:12px 0}'+
    '.nx-imp-bar{height:10px;background:var(--nx-accent-soft);border-radius:999px;overflow:hidden;margin:14px 0 5px}.nx-imp-bar span{display:block;height:100%;background:var(--nx-accent);border-radius:999px;transition:width .2s ease}'+
    '.nx-imp-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.nx-imp-current{border:1px solid var(--nx-border);background:var(--nx-surface);border-radius:11px;padding:10px 11px;margin:11px 0;font-size:12px}'+
    '.nx-imp-log{max-height:250px;overflow:auto;border:1px solid var(--nx-border);border-radius:12px;background:var(--nx-surface);padding:7px}.nx-imp-row{padding:7px 8px;border-bottom:1px solid var(--nx-border);font-size:11px;line-height:1.4}.nx-imp-row:last-child{border-bottom:0}.nx-imp-row.ok{color:var(--nx-positive)}.nx-imp-row.err{color:var(--nx-danger);background:var(--nx-accent-soft)}'+
    '.nx-imp-error{color:var(--nx-danger);font-size:12px;line-height:1.45;margin:8px 0}.nx-imp-success{color:var(--nx-positive);font-weight:850}'+
    '@media(max-width:560px){.nx-imp-stats{grid-template-columns:1fr 1fr}.nx-imp-actions{display:grid;grid-template-columns:1fr 1fr}.nx-imp-actions .btn{width:100%}}';
  document.head.appendChild(style);
}

function closeImportHost(){
  document.getElementById('nx-import-host')?.remove();
}

function importHostShell(){
  ensureImportHostStyles();
  closeImportHost();
  const host=document.createElement('div');
  host.id='nx-import-host';
  applyImportThemeVars(host);
  host.innerHTML='<div class="box"><div class="head"><strong>Importar paquete</strong><button class="close" type="button">×</button></div><div class="body"></div></div>';
  host.querySelector('.close').onclick=closeImportHost;
  host.onclick=e=>{if(e.target===host)closeImportHost()};
  document.body.appendChild(host);
  return host.querySelector('.body');
}

function countWord(n,singular,plural){return Number(n)===1?singular:plural}

function renderImportCodeStage(){
  const body=importHostShell();
  body.innerHTML='<p>Ingresa el código entregado por Nexo Group. Primero revisaremos el paquete; no se modificará ningún dato hasta que confirmes.</p>'+
    '<input id="nx-import-code-input" placeholder="NEXO-…" autocomplete="off" autocapitalize="characters">'+
    '<div id="nx-import-host-status"></div>'+
    '<button id="nx-import-review" class="btn primary wide" type="button">Revisar paquete</button>';
  const input=body.querySelector('#nx-import-code-input');
  const button=body.querySelector('#nx-import-review');
  input.focus();
  button.onclick=async()=>{
    const code=String(input.value||'').trim();
    if(!code)return;
    importCode=code;
    button.disabled=true;
    const status=body.querySelector('#nx-import-host-status');
    status.innerHTML='<div class="nx-imp-spin">Validando código y cargando resumen…</div>';
    try{
      const preview=await Promise.race([
        api('import.preview',{code}),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('La validación tardó demasiado. No se modificaron datos.')),15000))
      ]);
      importPreview=preview;
      renderImportPreviewStage(preview);
    }catch(error){
      status.innerHTML='<div class="nx-imp-error">⚠ '+esc(error?.message||error)+'</div>';
      button.disabled=false;
      button.textContent='Revisar paquete';
    }
  };
}

function renderImportPreviewStage(preview){
  const body=document.querySelector('#nx-import-host .body');
  if(!body)return;
  const groups=Array.isArray(preview?.collections)?preview.collections:[];
  const total=Number(preview?.totalCount||0);
  const current=Number(preview?.alreadyCurrentCount??preview?.alreadyCompleteCount??0);
  const updates=Number(preview?.updateCount||0);
  const creates=Number(preview?.createCount||0);
  const pending=Number(preview?.pendingCount??Math.max(0,total-current));
  const itemSingular=preview?.itemLabelSingular||'elemento';
  const itemPlural=preview?.itemLabelPlural||'elementos';
  const containerSingular=preview?.containerLabelSingular||'colección';
  const containerPlural=preview?.containerLabelPlural||'colecciones';
  const rows=groups.map(g=>{
    const n=Number(g?.count||0);
    return '<div class="nx-imp-group"><strong>'+esc(g?.name||'—')+'</strong><span>'+n+' '+esc(countWord(n,g?.itemLabelSingular||itemSingular,g?.itemLabelPlural||itemPlural))+(g?.importMode==='linked'?' · vinculados':'')+'</span></div>';
  }).join('');
  const resume=current
    ? '<div class="nx-imp-resume">✓ '+current+' de '+total+' '+esc(itemPlural)+' ya están al día en la versión '+Number(preview?.version||0)+'.</div>'
    :'';
  const changes=pending
    ? '<div class="nx-imp-resume">↻ Esta sincronización actualizará '+updates+' y creará '+creates+' '+esc(itemPlural)+'. No se crearán duplicados de fichas existentes.</div>'
    : '<div class="nx-imp-resume">✓ Este paquete ya está completamente actualizado.</div>';
  const actionLabel=updates>0?'Sí, actualizar':(creates>0?'Sí, importar':'Cerrar');
  body.innerHTML='<div class="nx-imp-top"><div><small>PAQUETE VERIFICADO</small><h2 style="margin:3px 0 0">'+esc(preview?.packageName||'Paquete Nexo')+'</h2></div></div>'+
    (preview?.packageDescription?'<p>'+esc(preview.packageDescription)+'</p>':'')+
    '<div class="nx-imp-stats">'+
      '<div class="nx-imp-stat"><strong>'+total+'</strong><span>'+esc(countWord(total,itemSingular,itemPlural))+'</span></div>'+
      '<div class="nx-imp-stat"><strong>'+current+'</strong><span>al día</span></div>'+
      '<div class="nx-imp-stat"><strong>'+updates+'</strong><span>por actualizar</span></div>'+
      '<div class="nx-imp-stat"><strong>'+creates+'</strong><span>por crear</span></div>'+
    '</div>'+
    rows+resume+changes+
    (pending?'<p><strong>¿Deseas sincronizar el paquete con este Workspace?</strong></p>':'')+
    '<div class="nx-imp-actions"><button id="nx-import-cancel" class="btn" type="button">'+(pending?'No, cancelar':'Cerrar')+'</button>'+
    (pending?'<button id="nx-import-confirm" class="btn primary" type="button">'+actionLabel+'</button>':'')+'</div>';
  body.querySelector('#nx-import-cancel').onclick=closeImportHost;
  const confirm=body.querySelector('#nx-import-confirm');
  if(confirm)confirm.onclick=()=>runImportHost();
}

function pendingImportItems(limit=5){
  return (importPreview?.items||[]).filter(item=>item?.complete!==true).slice(0,limit);
}

function itemLine(item,done=false){
  const label=item?.itemLabelSingular||importPreview?.itemLabelSingular||'elemento';
  const title=item?.title||item?.titleEs||item?.titleEn||item?.id||'—';
  const container=importPreview?.containerLabelSingular||'colección';
  const group=item?.collectionName||'Sin colección';
  const action=String(item?.action||'create');
  const verb=action==='update'?(done?'Actualizada':'Actualizando'):(done?'Importada':'Importando');
  return (done?'✓ ':'')+verb+' '+label+' «'+title+'» '+(done?'· ':'en ')+container+' «'+group+'»'+(done?'':'…');
}

async function runImportHost(){
  if(importing)return;
  importing=true;
  const body=document.querySelector('#nx-import-host .body');
  if(!body){importing=false;return}
  const total=Number(importPreview?.totalCount||0);
  let done=Number(importPreview?.alreadyCompleteCount||0);
  let percent=total?Math.round((done/total)*100):0;
  body.innerHTML='<div class="nx-imp-top"><div><small>IMPORTANDO PAQUETE</small><h2 style="margin:3px 0 0">'+esc(importPreview?.packageName||'')+'</h2></div><strong id="nx-import-pct">'+percent+'%</strong></div>'+
    '<div class="nx-imp-bar"><span id="nx-import-bar" style="width:'+percent+'%"></span></div><div id="nx-import-count" style="text-align:right;color:var(--nx-muted);font-size:11px">'+done+' / '+total+'</div>'+
    '<div id="nx-import-current" class="nx-imp-current"><div class="nx-imp-spin">Preparando importación…</div></div>'+
    '<div id="nx-import-log" class="nx-imp-log"></div><div id="nx-import-footer" class="nx-imp-actions"></div>';
  const current=body.querySelector('#nx-import-current');
  const log=body.querySelector('#nx-import-log');
  const bar=body.querySelector('#nx-import-bar');
  const pct=body.querySelector('#nx-import-pct');
  const count=body.querySelector('#nx-import-count');
  const footer=body.querySelector('#nx-import-footer');
  let stagnant=0,lastDone=done;
  try{
    let result=null;
    for(let step=0;step<120;step++){
      const batch=pendingImportItems(5);
      if(batch.length){
        const batchText=batch.map(item=>{
          const label=item?.itemLabelSingular||importPreview?.itemLabelSingular||'elemento';
          const title=item?.title||item?.titleEs||item?.titleEn||item?.id||'—';
          const group=item?.collectionName||'Sin colección';
          return label+' «'+title+'» → «'+group+'»';
        }).join(' · ');
        current.innerHTML='<div class="nx-imp-spin">Procesando lote de '+batch.length+': '+esc(batchText)+'</div>';
      }
      result=await api('import.code',{code:importCode});
      done=Number(result?.processedCount||0);
      percent=total?Math.round((done/total)*100):0;
      bar.style.width=percent+'%';pct.textContent=percent+'%';count.textContent=done+' / '+total;
      const processed=Array.isArray(result?.processedItems)?result.processedItems:[];
      for(const finished of processed){
        const match=(importPreview?.items||[]).find(x=>x?.id===finished?.id);
        if(match)match.complete=true;
        const row=document.createElement('div');
        row.className='nx-imp-row ok';
        row.textContent=itemLine(finished,true);
        log.appendChild(row);log.scrollTop=log.scrollHeight;
      }
      if(result?.complete===true){
        current.innerHTML='<div class="nx-imp-success">✓ Importación completada. Actualizando biblioteca…</div>';
        await pushEngineData();
        setTimeout(closeImportHost,1200);
        importPreview=null;importCode='';
        break;
      }
      stagnant=done===lastDone?stagnant+1:0;
      lastDone=done;
      if(stagnant>=3)throw new Error('La importación no está avanzando. Se conservó el progreso y el código sigue disponible.');
      await new Promise(resolve=>setTimeout(resolve,450));
    }
  }catch(error){
    current.innerHTML='<div class="nx-imp-error">⚠ '+esc(error?.message||error)+'</div>';
    const batch=pendingImportItems(5);
    if(batch.length){
      const row=document.createElement('div');row.className='nx-imp-row err';
      row.textContent='✕ Lote detenido ('+batch.map(item=>item?.title||item?.titleEs||item?.titleEn||item?.id||'—').join(', ')+') — '+String(error?.message||error);
      log.appendChild(row);
    }
    footer.innerHTML='<button id="nx-import-close" class="btn" type="button">Cerrar</button><button id="nx-import-resume" class="btn primary" type="button">Continuar importación</button>';
    footer.querySelector('#nx-import-close').onclick=closeImportHost;
    footer.querySelector('#nx-import-resume').onclick=()=>{importing=false;runImportHost()};
  }finally{
    importing=false;
  }
}

async function savePhotoFromEngine(payload={}){
  const requestId=String(payload.requestId||'');
  const file=payload.file;
  const entityType=String(payload.entityType||'');
  const entityId=String(payload.entityId||'');
  const fileName=String(payload.fileName||file?.name||'foto.jpg');
  const mimeType=String(payload.mimeType||file?.type||'image/jpeg');
  const sizeInBytes=Number(payload.sizeInBytes||file?.size||0);

  if(!file||typeof file.arrayBuffer!=='function'){
    throw new Error('PHOTO_FILE_MISSING');
  }

  const ticket=await api('photo.upload-url',{
    input:{entityType,entityId,fileName,mimeType,sizeInBytes}
  });
  const uploadUrl=String(ticket?.uploadUrl||'');
  if(!uploadUrl)throw new Error('PHOTO_UPLOAD_URL_MISSING');

  const uploadResponse=await fetch(uploadUrl,{
    method:'PUT',
    headers:{'Content-Type':mimeType},
    body:file
  });
  let uploadBody={};
  try{uploadBody=await uploadResponse.json()}catch(_){}
  if(!uploadResponse.ok){
    throw new Error(
      String(uploadBody?.message||uploadBody?.error||('PHOTO_UPLOAD_HTTP_'+uploadResponse.status))
    );
  }

  const fileId=String(
    uploadBody?.file?.id||
    uploadBody?.file?._id||
    uploadBody?.id||
    uploadBody?._id||
    ''
  );
  if(!fileId)throw new Error('PHOTO_UPLOAD_FILE_ID_MISSING');

  const saved=await api('photo.commit',{
    input:{
      entityType:ticket?.entityType||entityType,
      entityId:ticket?.entityId||entityId,
      fileId
    }
  });
  const image=saved?.image;
  if(!image?.id||!image?.url)throw new Error('PHOTO_COMMIT_INVALID_IMAGE');

  postToEngine('DM_PHOTO_SAVED',{
    ok:true,
    requestId,
    entityType:saved?.entityType||ticket?.entityType||entityType,
    entityId:saved?.entityId||ticket?.entityId||entityId,
    image
  });
  pushEngineData().catch(()=>{});
  return image;
}

function handleEngineMessage(event){
  if(!frame||event.source!==frame.contentWindow)return;
  let message=event.data;
  if(typeof message==='string'){
    try{message=JSON.parse(message)}catch(_){return}
  }
  if(!message?.type)return;
  const payload=message.payload||{};
  if(message.type==='NUMA_RECIPE_OPENED'){
    const openedId=String(payload.sheetId||payload.recipeId||'');
    if(!requestedSheetId||openedId===String(requestedSheetId)){
      requestedSheetOpened=true;
      clearRequestedSheetParams();
      numaSetStatus('Ficha abierta','local');
    }
    return;
  }
  if(message.type==='NUMA_RECIPE_OPEN_FAILED'){
    numaSetStatus(payload.error||'No se pudo abrir la ficha solicitada.','error');
    return;
  }
  if(message.type==='NEXO_THEME_CHANGED'){
    applyWorkspaceTheme(payload.theme==='night'?'night':'day',{persist:true,notifyEngine:true});
    return;
  }
  if(message.type==='NEXO_LANGUAGE_CHANGED'){
    workspaceLanguage=String(payload.language||payload.lang||'').toLowerCase()==='en'?'en':'es';
    api('profile.locale.set',{locale:workspaceLanguage}).catch(()=>{});
    return;
  }
  if(message.type==='DM_LOAD_MENU_DATA'){
    pushEngineData().catch(showError);
    return;
  }
  if(message.type==='NEXO_DM_OPEN_IMPORT'){
    renderImportCodeStage();
    return;
  }
  if(message.type==='NEXO_DM_RECIPE_COMMENT'){
    const requestId=String(payload.requestId||'');
    api('comment.create',{
      input:{
        technicalSheetId:payload.technicalSheetId,
        recipeTitle:payload.recipeTitle,
        comment:payload.comment
      }
    }).then(data=>{
      postToEngine('NEXO_DM_RECIPE_COMMENT_RESULT',{
        ok:true,
        requestId,
        comment:data
      });
    }).catch(error=>{
      postToEngine('NEXO_DM_RECIPE_COMMENT_RESULT',{
        ok:false,
        requestId,
        error:String(error?.message||error)
      });
    });
    return;
  }
  if(message.type==='NEXO_APP_EXIT_TO_WORKSPACE'){
    exitToWorkspace();
    return;
  }
  if(message.type==='NEXO_APP_OPEN_PERSONAL'){
    openPersonalSpace();
    return;
  }
  if(message.type==='NEXO_APP_OPEN_DEVELOPMENT'){
    openDevelopmentCenter();
    return;
  }
  if(message.type==='DM_SAVE_PHOTO_FILE'){
    savePhotoFromEngine(payload).catch(error=>{
      postToEngine('DM_PHOTO_ERROR',{
        requestId:payload.requestId,
        error:String(error?.message||error||'PHOTO_SAVE_FAILED')
      });
    });
    return;
  }
}
function mountEngine(){
  const root=mountRoot();
  root.innerHTML='';
  frame=document.createElement('iframe');
  frame.id='nexo-dm-engine';
  frame.src=ENGINE+'&nxoLang='+encodeURIComponent(workspaceLanguage)+'&nxoTheme='+encodeURIComponent(workspaceTheme);
  frame.title=workspaceToolName;
  frame.allow='camera; notifications';
  frame.style.cssText='display:block;width:100%;height:100%;border:0;background:'+UI_THEME.background+';';
  frame.addEventListener('load',()=>{
    postToEngine('NEXO_WORKSPACE_CONTEXT',{workspaceMode:true,workspaceLabel,toolName:workspaceToolName,toolDescription:workspaceToolDescription,theme:workspaceTheme,language:workspaceLanguage});
    setTimeout(openRequestedSheet,180);
  });
  root.appendChild(frame);
  window.addEventListener('message',handleEngineMessage);
}
async function start(){
  await ensureThemeRuntime();
  applyWorkspaceTheme(workspaceTheme,{persist:false,notifyEngine:false});
  loading();
  const bootToken=await waitBoot();
  accessStage='EXCHANGE';
  stripBoot();
  const exchange=await api('exchange',{bootToken});
  sessionToken=exchange?.sessionToken||'';
  if(!sessionToken)throw accessError('NO_SESSION_TOKEN');
  accessStage='ENGINE';
  mountEngine();
  mountNuma();
}
start().catch(showError);
})();