(function(global){
'use strict';
if(global.NUMA_PRESENCE_RUNTIME)return;
const VERSION='2026-10-01-unified-v1';
function create(options={}){
  const getTheme=()=>options.getTheme?.()==='night'?'night':'day';
  const canQa=()=>Boolean(options.canQa?.());
  const isSending=()=>Boolean(options.isSending?.());
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
const NUMA_CORE_LAYOUTS={
  idle:{head:[50,34,38,27],belly:[50,60,30,23]},
  attentive:{head:[50,34,38,27],belly:[50,60,30,23]},
  listening:{head:[50,34,38,27],belly:[50,60,30,23]},
  thinking:{head:[50,32,36,25],belly:[50,60,29,22]},
  success:{head:[50,34,38,27],belly:[50,60,30,23]},
  error:{head:[50,35,39,28],belly:[50,61,30,23]}
};
let numaVisualRequestedState="idle";
let numaVisualTimer=0,numaLauncherRaf=0,numaLifeRaf=0,numaSwapToken=0;
let numaVisualDemoTimers=[];

function numaVisualAsset(state="idle"){
  const theme=getTheme(),effective=NUMA_VISUAL_RUNTIME_STATES.has(state)?state:"idle";
  return NUMA_VISUAL_ASSETS[theme]?.[effective]||NUMA_VISUAL_ASSETS.day.idle;
}
function numaPreloadVisuals(){
  const theme=getTheme();
  Object.values(NUMA_VISUAL_ASSETS[theme]||{}).forEach(src=>{const im=new Image();im.decoding="async";im.src=src});
}
function numaSwapCharacter(state="idle",immediate=false){
  const img=document.getElementById("nma-character-img"),src=numaVisualAsset(state);
  numaApplyCoreLayout(state);
  if(!img||img.dataset.nmaSrc===src)return;
  const token=++numaSwapToken;
  const apply=()=>{if(token!==numaSwapToken)return;img.src=src;img.dataset.nmaSrc=src;requestAnimationFrame(()=>img.classList.remove("changing"))};
  if(immediate){img.classList.remove("changing");apply();return}
  img.classList.add("changing");setTimeout(apply,70);
}
function numaSyncVisualTheme(){
  const theme=getTheme(),launcher=document.getElementById("nma-launcher"),panel=document.getElementById("nma-panel");
  if(launcher)launcher.dataset.theme=theme;if(panel)panel.dataset.theme=theme;
  numaPreloadVisuals();numaSwapCharacter(numaVisualRequestedState,true);
}
function numaSetExpression(kind="none"){
  const layer=document.getElementById("nma-expression-layer");if(!layer)return;
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
  if(panel){panel.dataset.state=numaVisualRequestedState;panel.dataset.requestedState=numaVisualRequestedState}
  numaSwapCharacter(numaVisualRequestedState,false);numaSetExpression(expression);
  if(duration>0)numaVisualTimer=setTimeout(()=>{numaVisualTimer=0;if(!isSending())numaSetVisualState("idle","none")},duration);
}
function numaSpeak(text,{expression="speak",duration=0}={}){
  const bubble=document.getElementById("nma-speech");if(!bubble)return;
  const value=String(text||"").trim()||"Hola. Dime qué receta, preparación o producto buscas.";
  bubble.textContent=value;bubble.classList.remove("speaking");void bubble.offsetWidth;bubble.classList.add("speaking");
  if(expression&&expression!=="none")numaSetExpression(expression);
  const ms=duration||Math.max(1100,Math.min(3200,650+value.length*18));
  setTimeout(()=>bubble?.classList.remove("speaking"),ms);
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
function numaLifeRgb(){return getTheme()==="night"?{r:255,g:190,b:56}:{r:92,g:218,b:255}}
function numaLauncherRgb(){
  return getTheme()==="night"?{r:255,g:190,b:56}:{r:57,g:169,b:255};
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
  const reply=String(data?.message?.content||"");
  if(data?.provider==="openai_error")return{state:"error",expression:"error",duration:2600};
  if(/no pude (?:interpretar|relacionar|entender)/i.test(reply))return{state:"attentive",expression:"confused",duration:3200};
  if(data?.dialogue?.awaiting)return{state:"attentive",expression:"question",duration:0};
  if(data?.action)return{state:"success",expression:"success",duration:1800};
  return{state:"idle",expression:"speak",duration:Math.max(1300,Math.min(3200,700+reply.length*18))};
}
function numaClearVisualDemo(){numaVisualDemoTimers.forEach(id=>clearTimeout(id));numaVisualDemoTimers=[]}
function numaCanVisualQa(){return canQa()}
function numaRunVisualDemo(){
  numaClearVisualDemo();
  const scenes=[[0,"success","speak","Hola. Dime qué receta, preparación o producto buscas."],[1900,"attentive","question","¿En qué puedo ayudarte?"],[3800,"listening","listening","Te estoy escuchando."],[5700,"thinking","thinking","Déjame pensar…"],[7600,"success","success","Listo. Todo salió bien."],[9500,"attentive","confused","No entendí eso del todo."],[11400,"error","error","Aquí verías mi estado de error."],[13300,"idle","none","Prueba visual terminada."]];
  scenes.forEach(([delay,state,expression,text])=>numaVisualDemoTimers.push(setTimeout(()=>{numaSetVisualState(state,expression,0);numaSpeak(text,{expression,duration:0})},delay)));
}
function numaHandleVisualQaCommand(message){
  const cmd=String(message||"").trim().toLowerCase();if(!cmd.startsWith("/numa"))return false;
  if(!numaCanVisualQa()){numaSetVisualState("attentive","question",2400);numaSpeak("El modo de prueba visual está reservado al propietario o desarrollador.",{expression:"question",duration:2400});return true}
  if(/^\/numa\s+(demo|prueba|test)$/.test(cmd)){numaRunVisualDemo();return true}
  const map={idle:["idle","none"],reposo:["idle","none"],atento:["attentive","question"],attentive:["attentive","question"],escuchando:["listening","listening"],listening:["listening","listening"],pensando:["thinking","thinking"],thinking:["thinking","thinking"],exito:["success","success"],"éxito":["success","success"],success:["success","success"],confundida:["attentive","confused"],confusion:["attentive","confused"],"confusión":["attentive","confused"],error:["error","error"]};
  const key=cmd.replace(/^\/numa\s+/,""),target=map[key];
  if(target){numaClearVisualDemo();numaSetVisualState(target[0],target[1],0);numaSpeak("Prueba visual: "+key+".",{expression:target[1],duration:0})}
  else{numaSetVisualState("attentive","question",3000);numaSpeak("Usa /numa demo o /numa idle, atento, escuchando, pensando, exito, confusion o error.",{expression:"question",duration:3000})}
  return true;
}


  return Object.freeze({
    version:VERSION,
    syncTheme:numaSyncVisualTheme,
    setExpression:numaSetExpression,
    setState:numaSetVisualState,
    speak:numaSpeak,
    lifeFieldMarkup:numaLifeFieldMarkup,
    mountLifeParticles:numaMountLifeParticles,
    mountLauncherParticles:numaMountLauncherParticles,
    visualFromResponse:numaVisualFromResponse,
    clearDemo:numaClearVisualDemo,
    runDemo:numaRunVisualDemo,
    handleQaCommand:numaHandleVisualQaCommand
  });
}
global.NUMA_PRESENCE_RUNTIME=Object.freeze({version:VERSION,create});
})(window);
