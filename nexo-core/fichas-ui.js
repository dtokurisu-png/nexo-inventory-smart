(function(){
if(window.__nexoFichasApp)return;window.__nexoFichasApp=true;

const ACCESS_REVISION='fichas-engine-20260929-timer-alarm-6';
const ENGINE_REVISION='workspace-timer-alarm-20260929-6';
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
const launchQuery=new URLSearchParams(location.search);
const workspaceLabel=launchQuery.get('nxoBackLabel')||'Workspace';
const workspaceTheme=launchQuery.get('nxoTheme')==='night'?'night':'day';

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
    root.style.cssText='position:fixed;inset:0;z-index:2147483500;background:#eef3fb;display:block;';
    document.body.appendChild(root);
  }
  return root;
}
function loading(text='Preparando Fichas Técnicas Dinámicas…'){
  mountRoot().innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:#eef3fb;color:#111827;font:600 14px Inter,Arial,sans-serif"><div style="text-align:center"><div style="width:34px;height:34px;border:3px solid #b9cbed;border-top-color:#2f4f93;border-radius:50%;margin:0 auto 14px;animation:nxspin .8s linear infinite"></div><strong>'+esc(text)+'</strong><style>@keyframes nxspin{to{transform:rotate(360deg)}}</style></div></div>';
}
function showError(error){
  const message=String(error?.message||error||'Error desconocido');
  mountRoot().innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:#eef3fb;color:#111827;font:14px Inter,Arial,sans-serif;padding:24px"><div style="max-width:560px;border:1px solid #b9cbed;border-radius:18px;background:#ffffff;padding:22px"><h2 style="margin:0 0 10px">No se pudo abrir Fichas Técnicas Dinámicas</h2><p style="color:#5b6780;line-height:1.55">'+esc(message)+'</p><button id="nx-engine-retry" style="border:1px solid #172755;background:#264c8f;color:#ffffff;border-radius:10px;padding:10px 14px;font-weight:800">Reintentar</button></div></div>';
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
      if(data?.error)throw new Error(data.error);
      throw accessError('HTTP_'+response.status);
    }
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
      if(u.origin===location.origin)return u.href;
    }catch(_){}
  }
  const parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean);
  const siteRoot=location.origin+(parts.length?'/'+parts[0]:'');
  return siteRoot+'/blank-8';
}
function exitToWorkspace(){
  location.assign(workspaceReturnUrl());
}
function siteBase(){
  const p=location.pathname.replace(/\/+$/,'');
  return (location.origin+p.replace(/\/blank-4$/,'')).replace(/\/$/,'');
}
function openPersonalSpace(){
  location.assign(siteBase()+'/blank-8');
}
function openDevelopmentCenter(){
  location.assign(siteBase()||location.origin);
}
function postToEngine(type,payload={}){
  try{frame?.contentWindow?.postMessage({type,payload},'*')}catch(_){}
}
async function pushEngineData(){
  if(loadingData)return;
  loadingData=true;
  try{
    const data=await api('engine.data');
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
    '#nx-import-host{position:fixed;inset:0;z-index:2147483646;background:rgba(31,35,58,.62);display:grid;place-items:center;padding:18px;font-family:Inter,Arial,sans-serif}'+
    '#nx-import-host .box{width:min(660px,calc(100vw - 36px));max-height:88vh;overflow:auto;background:#f8fbff;color:#111827;border:1px solid #172755;border-radius:20px;box-shadow:0 28px 70px rgba(23,39,85,.24)}'+
    '#nx-import-host .head{display:flex;align-items:center;justify-content:space-between;padding:15px 17px;border-bottom:1px solid #b9cbed;position:sticky;top:0;background:#dce7f7;z-index:2}'+
    '#nx-import-host .head strong{font-size:17px}#nx-import-host .close{width:36px;height:36px;border:1px solid #172755;border-radius:10px;background:#1f233a;color:#fff;font-size:22px;cursor:pointer}#nx-import-host .close:hover{background:#f1994a;color:#111827}'+
    '#nx-import-host .body{padding:17px}#nx-import-host p{color:#5b6780;line-height:1.5}'+
    '#nx-import-host input{width:100%;box-sizing:border-box;border:1px solid #b9cbed;border-radius:11px;padding:12px 13px;font:inherit;background:#fff;margin:6px 0 12px;color:#111827;outline:none}#nx-import-host input:focus{border-color:#2f4f93;box-shadow:0 0 0 3px rgba(47,79,147,.10)}'+
    '#nx-import-host .btn{border:1px solid #172755;background:#264c8f;color:#fff;border-radius:11px;padding:10px 13px;font-weight:850;cursor:pointer;transition:transform .14s ease,background .14s ease,color .14s ease,box-shadow .14s ease}'+
    '#nx-import-host .btn.primary{background:#246b36;color:#fff;border-color:#173d22}#nx-import-host .btn:hover,#nx-import-host .btn:focus-visible{background:#f1994a;color:#111827;border-color:#172755;transform:translateY(-1px);box-shadow:0 8px 16px rgba(23,39,85,.16);outline:none}#nx-import-host .btn:active{transform:translateY(0) scale(.99)}#nx-import-host .btn:disabled{opacity:.55;cursor:default;transform:none;box-shadow:none}'+
    '#nx-import-host .wide{width:100%}.nx-imp-spin{display:flex;align-items:center;gap:9px;color:#6f6a61;font-size:12px;min-height:24px;margin-bottom:10px}'+
    '.nx-imp-spin:before{content:"";width:15px;height:15px;border:2px solid #d9d1c4;border-top-color:#191713;border-radius:50%;animation:nxImpSpin .8s linear infinite}@keyframes nxImpSpin{to{transform:rotate(360deg)}}'+
    '.nx-imp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}.nx-imp-stat{background:#f7f3ec;border:1px solid #e0d9cc;border-radius:12px;padding:11px}.nx-imp-stat strong{display:block;font-size:20px}.nx-imp-stat span{font-size:10px;color:#756e63}'+
    '.nx-imp-group{display:flex;justify-content:space-between;gap:12px;padding:10px 11px;border:1px solid #e1dacf;border-radius:11px;margin:7px 0;background:#fff}.nx-imp-group span{color:#6f6a61;font-size:11px}'+
    '.nx-imp-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.nx-imp-resume{padding:10px 11px;border:1px solid #d8c589;background:#fff8da;border-radius:11px;color:#665526;font-size:11px;line-height:1.45;margin:12px 0}'+
    '.nx-imp-bar{height:10px;background:#dce7f7;border-radius:999px;overflow:hidden;margin:14px 0 5px}.nx-imp-bar span{display:block;height:100%;background:#2f4f93;border-radius:999px;transition:width .2s ease}'+
    '.nx-imp-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.nx-imp-current{border:1px solid #e0d9cc;background:#faf7f1;border-radius:11px;padding:10px 11px;margin:11px 0;font-size:12px}'+
    '.nx-imp-log{max-height:250px;overflow:auto;border:1px solid #e0d9cc;border-radius:12px;background:#fff;padding:7px}.nx-imp-row{padding:7px 8px;border-bottom:1px solid #eee8de;font-size:11px;line-height:1.4}.nx-imp-row:last-child{border-bottom:0}.nx-imp-row.ok{color:#315e3d}.nx-imp-row.err{color:#9b332c;background:#fff5f3}'+
    '.nx-imp-error{color:#9b332c;font-size:12px;line-height:1.45;margin:8px 0}.nx-imp-success{color:#315e3d;font-weight:850}'+
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
  const done=Number(preview?.alreadyCompleteCount||0);
  const itemSingular=preview?.itemLabelSingular||'elemento';
  const itemPlural=preview?.itemLabelPlural||'elementos';
  const containerSingular=preview?.containerLabelSingular||'colección';
  const containerPlural=preview?.containerLabelPlural||'colecciones';
  const rows=groups.map(g=>{
    const n=Number(g?.count||0);
    return '<div class="nx-imp-group"><strong>'+esc(g?.name||'—')+'</strong><span>'+n+' '+esc(countWord(n,g?.itemLabelSingular||itemSingular,g?.itemLabelPlural||itemPlural))+(g?.importMode==='linked'?' · vinculados':'')+'</span></div>';
  }).join('');
  const resume=done?'<div class="nx-imp-resume">↻ Se detectó progreso anterior: '+done+' de '+total+' '+esc(itemPlural)+' ya están completas. Se continuará desde ahí.</div>':'';
  body.innerHTML='<div class="nx-imp-top"><div><small>PAQUETE VERIFICADO</small><h2 style="margin:3px 0 0">'+esc(preview?.packageName||'Paquete Nexo')+'</h2></div></div>'+
    (preview?.packageDescription?'<p>'+esc(preview.packageDescription)+'</p>':'')+
    '<div class="nx-imp-stats"><div class="nx-imp-stat"><strong>'+groups.length+'</strong><span>'+esc(countWord(groups.length,containerSingular,containerPlural))+'</span></div><div class="nx-imp-stat"><strong>'+total+'</strong><span>'+esc(countWord(total,itemSingular,itemPlural))+'</span></div>'+(done?'<div class="nx-imp-stat"><strong>'+Math.max(0,total-done)+'</strong><span>pendientes</span></div>':'')+'</div>'+
    rows+resume+'<p><strong>¿Deseas continuar con la importación?</strong></p>'+
    '<div class="nx-imp-actions"><button id="nx-import-cancel" class="btn" type="button">No, cancelar</button><button id="nx-import-confirm" class="btn primary" type="button">Sí, importar</button></div>';
  body.querySelector('#nx-import-cancel').onclick=closeImportHost;
  body.querySelector('#nx-import-confirm').onclick=()=>runImportHost();
}

function pendingImportItems(limit=5){
  return (importPreview?.items||[]).filter(item=>item?.complete!==true).slice(0,limit);
}

function itemLine(item,done=false){
  const label=item?.itemLabelSingular||importPreview?.itemLabelSingular||'elemento';
  const title=item?.title||item?.titleEs||item?.titleEn||item?.id||'—';
  const container=importPreview?.containerLabelSingular||'colección';
  const group=item?.collectionName||'Sin colección';
  return (done?'✓ ':'Cargando ')+label+' «'+title+'» '+(done?'· ':'en ')+container+' «'+group+'»'+(done?'':'…');
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
    '<div class="nx-imp-bar"><span id="nx-import-bar" style="width:'+percent+'%"></span></div><div id="nx-import-count" style="text-align:right;color:#756e63;font-size:11px">'+done+' / '+total+'</div>'+
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

function handleEngineMessage(event){
  if(!frame||event.source!==frame.contentWindow)return;
  let message=event.data;
  if(typeof message==='string'){
    try{message=JSON.parse(message)}catch(_){return}
  }
  if(!message?.type)return;
  const payload=message.payload||{};
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
    postToEngine('DM_PHOTO_ERROR',{
      requestId:payload.requestId,
      error:'PHOTO_SERVER_SYNC_PENDING'
    });
    return;
  }
}
function mountEngine(){
  const root=mountRoot();
  root.innerHTML='';
  frame=document.createElement('iframe');
  frame.id='nexo-dm-engine';
  frame.src=ENGINE;
  frame.title='Fichas Técnicas Dinámicas';
  frame.allow='camera';
  frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#eef3fb;';
  frame.addEventListener('load',()=>{
    postToEngine('NEXO_WORKSPACE_CONTEXT',{workspaceMode:true,workspaceLabel,theme:workspaceTheme});
  });
  root.appendChild(frame);
  window.addEventListener('message',handleEngineMessage);
}
async function start(){
  loading();
  const bootToken=await waitBoot();
  accessStage='EXCHANGE';
  stripBoot();
  const exchange=await api('exchange',{bootToken});
  sessionToken=exchange?.sessionToken||'';
  if(!sessionToken)throw accessError('NO_SESSION_TOKEN');
  accessStage='ENGINE';
  mountEngine();
}
start().catch(showError);
})();