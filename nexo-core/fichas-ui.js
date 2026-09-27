(function(){
if(window.__nexoFichasApp)return;window.__nexoFichasApp=true;

const ACCESS_REVISION='fichas-engine-20260927-3';
const ENGINE_REVISION='workspace-library-20260927-2';
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
    root.style.cssText='position:fixed;inset:0;z-index:2147483500;background:#f4f1ea;display:block;';
    document.body.appendChild(root);
  }
  return root;
}
function loading(text='Preparando Fichas Técnicas Dinámicas…'){
  mountRoot().innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:#0d121a;color:#f4f6f8;font:600 14px Inter,Arial,sans-serif"><div style="text-align:center"><div style="width:34px;height:34px;border:3px solid #3a4656;border-top-color:#d9b45b;border-radius:50%;margin:0 auto 14px;animation:nxspin .8s linear infinite"></div><strong>'+esc(text)+'</strong><style>@keyframes nxspin{to{transform:rotate(360deg)}}</style></div></div>';
}
function showError(error){
  const message=String(error?.message||error||'Error desconocido');
  mountRoot().innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:#0d121a;color:#f4f6f8;font:14px Inter,Arial,sans-serif;padding:24px"><div style="max-width:560px;border:1px solid #344156;border-radius:18px;background:#111927;padding:22px"><h2 style="margin:0 0 10px">No se pudo abrir Fichas Técnicas Dinámicas</h2><p style="color:#aeb9c9;line-height:1.55">'+esc(message)+'</p><button id="nx-engine-retry" style="border:1px solid #d9b45b;background:#d9b45b;color:#17130b;border-radius:10px;padding:10px 14px;font-weight:800">Reintentar</button></div></div>';
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
async function previewPackage(code){
  const normalized=String(code||'').trim();
  if(!normalized)throw new Error('Escribe el código de importación.');
  const preview=await api('import.preview',{code:normalized});
  importPreview=preview;
  importCode=normalized;
  postToEngine('NEXO_DM_IMPORT_PREVIEW',preview);
  return preview;
}

function pendingPreviewItem(preview){
  return (preview?.items||[]).find(item=>item?.complete!==true)||null;
}

async function importPackage(code){
  if(importing)return;
  importing=true;
  let currentItem=null;
  try{
    const normalized=String(code||importCode||'').trim();
    let preview=(importPreview&&importCode===normalized)?importPreview:await api('import.preview',{code:normalized});
    importPreview=preview;
    importCode=normalized;

    postToEngine('NEXO_DM_IMPORT_BEGIN',{
      packageName:preview?.packageName||'Paquete Nexo',
      processedCount:Number(preview?.alreadyCompleteCount||0),
      totalCount:Number(preview?.totalCount||0)
    });

    let result=null;
    let lastProcessed=Number(preview?.alreadyCompleteCount||0);
    let stagnantRounds=0;

    for(let step=0;step<120;step++){
      currentItem=pendingPreviewItem(preview);
      if(currentItem){
        postToEngine('NEXO_DM_IMPORT_ITEM_START',{
          ...currentItem,
          processedCount:lastProcessed,
          totalCount:Number(preview?.totalCount||0)
        });
      }

      result=await api('import.code',{code:normalized});
      const processed=Number(result?.processedCount||0);
      const total=Number(result?.totalCount||preview?.totalCount||0);
      const items=Array.isArray(result?.processedItems)?result.processedItems:[];

      for(const item of items){
        const match=(preview?.items||[]).find(row=>row?.id===item?.id);
        if(match)match.complete=true;
        postToEngine('NEXO_DM_IMPORT_ITEM_DONE',{
          ...item,
          processedCount:processed,
          totalCount:total
        });
      }

      postToEngine('NEXO_DM_IMPORT_PROGRESS',{
        processedCount:processed,
        totalCount:total,
        remainingCount:Number(result?.remainingCount||0),
        percent:total?Math.round((processed/total)*100):0,
        complete:result?.complete===true
      });

      if(result?.complete===true)break;

      if(processed===lastProcessed)stagnantRounds+=1;
      else stagnantRounds=0;
      lastProcessed=processed;

      if(stagnantRounds>=3){
        throw new Error('La importación no está avanzando. El código sigue disponible; revisa el elemento indicado antes de continuar.');
      }

      await new Promise(resolve=>setTimeout(resolve,450));
    }

    if(result?.complete!==true){
      throw new Error('La importación quedó incompleta. Puedes continuar con el mismo código.');
    }

    await pushEngineData();
    postToEngine('NEXO_DM_IMPORT_DONE',result);
    importPreview=null;
    importCode='';
  }catch(error){
    postToEngine('NEXO_DM_IMPORT_ERROR',{
      message:String(error?.message||error||'No se pudo importar el paquete.'),
      item:currentItem||null
    });
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
  if(message.type==='NEXO_DM_IMPORT_PREVIEW_CODE'){
    previewPackage(String(payload.code||'').trim()).catch(error=>{
      postToEngine('NEXO_DM_IMPORT_PREVIEW_ERROR',{
        message:String(error?.message||error||'No se pudo validar el paquete.')
      });
    });
    return;
  }
  if(message.type==='NEXO_DM_IMPORT_CONFIRM'){
    importPackage(String(payload.code||importCode||'').trim());
    return;
  }
  if(message.type==='NEXO_DM_IMPORT_CODE'){
    previewPackage(String(payload.code||'').trim()).catch(error=>{
      postToEngine('NEXO_DM_IMPORT_PREVIEW_ERROR',{
        message:String(error?.message||error||'No se pudo validar el paquete.')
      });
    });
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
  frame.style.cssText='display:block;width:100%;height:100%;border:0;background:#f4f1ea;';
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