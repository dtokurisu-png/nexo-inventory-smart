(()=>{'use strict';
if(window.__NEXO_PHOTO_SYSTEM_V1__)return;window.__NEXO_PHOTO_SYSTEM_V1__=true;

const DB_NAME='nexo-recetario-photos-v2';
const STORE='photos';
const OLD_DB='nexo-recetario-media-v1';
const MAX_BYTES=10*1024*1024;
const objectUrls=new Map();
const pendingRemote=new Map();
let stream=null;
let current=null;
let syncingPending=false;
let pendingRetryTimer=null;

const es=()=>document.documentElement.lang!=='en';
const tr=(a,b)=>es()?a:b;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const data=()=>window.__NEXO_DM_DATA__||{recipes:[],ingredients:[],preparations:[]};
const photoScopeId=()=>String(data()?.context?.photoScopeId||'').trim();
const canClaimLegacy=()=>data()?.capabilities?.canShare===true;

const style=document.createElement('style');
style.id='nexo-photo-system-v1-style';
style.textContent=`
#nexoPhotoLayer{position:fixed;z-index:2147483644;inset:0;background:var(--nxo-overlay);display:flex;align-items:center;justify-content:center;padding:18px}
.nexoPhotoPanel{width:min(580px,calc(100vw - 36px));max-height:86dvh;overflow:auto;background:var(--nxo-surface-raised);color:var(--nxo-text-primary);border:1px solid var(--nxo-border-strong);border-radius:24px;padding:18px;box-shadow:0 28px 90px var(--nxo-shadow)}
.nexoPhotoPanel h3{margin:0 0 7px;font-size:24px;line-height:1.15}.nexoPhotoPanel p{margin:0 0 15px;color:var(--nxo-text-muted);line-height:1.45}.nexoPhotoGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nexoPhotoChoice,.nexoPhotoPrimary,.nexoPhotoSecondary,.nexoPhotoCancel,.nexoPhotoDone{border-radius:14px;font-weight:900}.nexoPhotoChoice{min-height:68px;border:1px solid var(--nxo-button-secondary-border);background:var(--nxo-button-secondary-bg);color:var(--nxo-button-secondary-text);font-size:17px}.nexoPhotoPrimary{min-height:56px;border:1px solid var(--nxo-positive);background:var(--nxo-positive);color:var(--nxo-positive-contrast);font-size:17px}.nexoPhotoSecondary{min-height:56px;border:1px solid var(--nxo-button-secondary-border);background:var(--nxo-button-secondary-bg);color:var(--nxo-button-secondary-text);font-size:17px}.nexoPhotoFooter{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.nexoPhotoCancel,.nexoPhotoDone{width:100%;min-height:49px;border:1px solid var(--nxo-button-secondary-border);font-size:16px}.nexoPhotoCancel{background:var(--nxo-button-secondary-bg);color:var(--nxo-button-secondary-text)}.nexoPhotoDone{background:var(--nxo-positive);border-color:var(--nxo-positive);color:var(--nxo-positive-contrast)}.nexoPhotoChoice:hover,.nexoPhotoChoice:focus-visible,.nexoPhotoPrimary:hover,.nexoPhotoPrimary:focus-visible,.nexoPhotoSecondary:hover,.nexoPhotoSecondary:focus-visible,.nexoPhotoCancel:hover,.nexoPhotoCancel:focus-visible,.nexoPhotoDone:hover,.nexoPhotoDone:focus-visible{background:var(--nxo-interaction);border-color:var(--nxo-interaction);color:var(--nxo-interaction-contrast);outline:none}.nexoPhotoPreview,.nexoPhotoVideo{display:block;width:100%;aspect-ratio:1/1;max-height:58dvh;border-radius:16px;background:var(--nxo-media-background)}.nexoPhotoPreview{object-fit:contain}.nexoPhotoVideo{object-fit:cover}.nexoPhotoActions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.nexoPhotoHint{margin-top:11px!important;padding:10px 11px;border-radius:11px;background:var(--nxo-positive-soft);color:var(--nxo-positive)!important;font-size:13px;font-weight:800}
#nexoPhotoSyncBar{position:fixed;z-index:2147483642;left:50%;bottom:18px;transform:translateX(-50%);width:min(560px,calc(100vw - 24px));display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border:1px solid var(--nxo-border);border-radius:14px;background:var(--nxo-surface-raised);box-shadow:0 12px 34px var(--nxo-shadow);color:var(--nxo-positive);font-size:12px;font-weight:800}
#nexoPhotoSyncBar[hidden]{display:none}
#nexoPhotoSyncBar button{flex:0 0 auto;border:0;border-radius:10px;background:var(--nxo-positive);color:var(--nxo-positive-contrast);padding:9px 11px;font-weight:900}
#nexoPhotoSyncBar button:disabled{opacity:.55}
@media(max-width:720px){#nexoPhotoLayer{padding:6px}.nexoPhotoPanel{width:calc(100vw - 12px);border-radius:10px;padding:7px}.nexoPhotoPanel h3{font-size:12px}.nexoPhotoPanel p{font-size:10px;margin-bottom:7px}.nexoPhotoGrid{gap:5px}.nexoPhotoChoice,.nexoPhotoPrimary,.nexoPhotoSecondary,.nexoPhotoCancel,.nexoPhotoDone{font-size:10px;border-radius:6px}.nexoPhotoChoice{min-height:33px}.nexoPhotoPrimary,.nexoPhotoSecondary{min-height:27px}.nexoPhotoCancel,.nexoPhotoDone{min-height:23px}.nexoPhotoFooter{gap:5px;margin-top:5px}.nexoPhotoActions{gap:5px;margin-top:5px}.nexoPhotoHint{margin-top:5px!important;padding:5px!important;border-radius:5px!important;font-size:9px!important}}
`
document.head.appendChild(style);
const syncBar=document.createElement('div');
syncBar.id='nexoPhotoSyncBar';
syncBar.hidden=true;
syncBar.innerHTML='<span id="nexoPhotoSyncText"></span><button id="nexoPhotoSyncNow" type="button"></button>';
document.body.appendChild(syncBar);
const syncBarText=syncBar.querySelector('#nexoPhotoSyncText');
const syncBarButton=syncBar.querySelector('#nexoPhotoSyncNow');

function toast(text,ms=2600){const s=document.getElementById('status');if(!s)return;s.textContent=text;s.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>s.classList.add('hidden'),ms)}
function keyOf(type,id){return `${type}:${id}`}
function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}
function closeLayer(){const layer=document.getElementById('nexoPhotoLayer');if(layer)layer.remove();stopCamera();if(current?.preview)URL.revokeObjectURL(current.preview);current=null}
function makeLayer(html){closeLayer();const layer=document.createElement('div');layer.id='nexoPhotoLayer';layer.innerHTML=`<div class="nexoPhotoPanel">${html}</div>`;document.body.appendChild(layer);layer.addEventListener('click',e=>{if(e.target===layer)closeLayer()});return layer}

function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'key'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function putRecord(rec){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(rec);tx.oncomplete=()=>{db.close();resolve(rec)};tx.onerror=()=>{db.close();reject(tx.error)}})}
async function getRecords(){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),q=tx.objectStore(STORE).getAll();q.onsuccess=()=>resolve(q.result||[]);q.onerror=()=>reject(q.error);tx.oncomplete=()=>db.close()})}
async function deleteRecord(key){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key);tx.oncomplete=()=>{db.close();resolve(true)};tx.onerror=()=>{db.close();reject(tx.error)}})}
async function hasNewRecords(){try{return (await getRecords()).length>0}catch(_){return false}}
async function migrateLegacy(){try{if(await hasNewRecords())return;if(typeof indexedDB.databases!=='function')return;const dbs=await indexedDB.databases();if(!dbs.some(x=>x.name===OLD_DB))return;const old=await new Promise((resolve,reject)=>{const r=indexedDB.open(OLD_DB);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});if(!old.objectStoreNames.contains('media')){old.close();return}const rows=await new Promise((resolve,reject)=>{const tx=old.transaction('media','readonly'),q=tx.objectStore('media').getAll();q.onsuccess=()=>resolve(q.result||[]);q.onerror=()=>reject(q.error);tx.oncomplete=()=>old.close()});for(const row of rows){if(!row?.type||!row?.id||!row?.blob)continue;await putRecord({key:keyOf(row.type,row.id),entityType:row.type,entityId:row.id,blob:row.blob,name:row.name||'photo.jpg',mime:row.mime||row.blob.type||'image/jpeg',size:row.size||row.blob.size||0,updatedAt:row.updatedAt||Date.now(),synced:false,scopeId:'',legacy:true})}}catch(_){}}

function objectUrl(rec){const old=objectUrls.get(rec.key);if(old&&old.updatedAt===rec.updatedAt)return old.url;if(old)URL.revokeObjectURL(old.url);const url=URL.createObjectURL(rec.blob);objectUrls.set(rec.key,{updatedAt:rec.updatedAt,url});return url}
function applyToData(type,id,image){const d=data();if(type==='recipe'){const r=(d.recipes||[]).find(x=>x._id===id);if(r)r.heroImage=image}else if(type==='ingredient'){const i=(d.ingredients||[]).find(x=>x._id===id);if(i)i.baseImage=image}else if(type==='preparation'){const p=(d.preparations||[]).find(x=>x._id===id);if(p)p.image=image}}
function publishPhoto(type,id,value,source='local'){const image=typeof value==='string'?{url:value,src:value,source}:{...(value||{}),src:value?.src||value?.url||'',source};applyToData(type,id,image);window.dispatchEvent(new CustomEvent('NEXO_PHOTO_CHANGED',{detail:{entityType:type,entityId:id,image,source}}))}
function requestHostSave(rec){const requestId='photo_'+Date.now()+'_'+Math.random().toString(36).slice(2,9),file=rec.blob||rec.file;return new Promise((resolve,reject)=>{if(!file){reject(new Error('PHOTO_FILE_MISSING'));return}const timer=setTimeout(()=>{pendingRemote.delete(requestId);reject(new Error('PHOTO_SAVE_TIMEOUT'))},90000);pendingRemote.set(requestId,{resolve,reject,timer});parent.postMessage({source:'nexo-dm-photo',type:'DM_SAVE_PHOTO_FILE',payload:{requestId,entityType:rec.entityType,entityId:rec.entityId,fileName:rec.name||'photo.jpg',mimeType:rec.mime||file.type||'image/jpeg',sizeInBytes:rec.size||file.size||0,file}},'*')})}
async function saveRecordCentral(rec){
  const saved=await requestHostSave(rec),image=saved?.image;
  if(!image?.id||!image?.url)throw new Error('INVALID_SAVED_IMAGE');
  const targetType=saved?.entityType||rec.entityType,targetId=saved?.entityId||rec.entityId;
  await deleteRecord(rec.key);
  publishPhoto(targetType,targetId,image,'server');
  return image
}
async function scopedPendingRows(){
  const rows=await getRecords(),scope=photoScopeId();
  if(!scope)return[];
  const mine=[],legacy=[];
  for(const rec of rows){
    if(rec?.synced===true){try{await deleteRecord(rec.key)}catch(_){}continue}
    if(!rec?.blob)continue;
    if(rec.scopeId===scope)mine.push(rec);
    else if(!rec.scopeId&&rec.synced!==true&&canClaimLegacy())legacy.push(rec)
  }
  if(legacy.length){
    for(const rec of legacy){
      rec.scopeId=scope;
      rec.legacyClaimedAt=Date.now();
      await putRecord(rec);
      mine.push(rec)
    }
  }
  return mine
}
async function hydrate(){try{const rows=await scopedPendingRows();for(const rec of rows){if(rec.blob)publishPhoto(rec.entityType,rec.entityId,objectUrl(rec),'local-pending')}}catch(_){}}
async function pendingPhotoRecords(){try{return await scopedPendingRows()}catch(_){return[]}}
async function refreshPendingBar(lastError=''){
  const rows=await pendingPhotoRecords(),n=rows.length;
  if(!n){syncBar.hidden=true;syncBarButton.disabled=false;return 0}
  syncBar.hidden=false;
  syncBarText.textContent=(es()?n+' foto'+(n===1?'':'s')+' pendiente'+(n===1?'':'s')+' de sincronizar':n+' photo'+(n===1?'':'s')+' waiting to sync')+(lastError?' · '+lastError:'');
  syncBarButton.textContent=es()?'Sincronizar ahora':'Sync now';
  syncBarButton.disabled=syncingPending;
  if(n&&navigator.onLine)schedulePendingRetry();
  return n
}
function schedulePendingRetry(delay=60000){
  clearTimeout(pendingRetryTimer);
  pendingRetryTimer=setTimeout(()=>syncPendingRecords(),delay)
}
async function syncPendingRecords({interactive=false}={}){
  if(syncingPending)return;
  if(!navigator.onLine){await refreshPendingBar(es()?'Sin conexión':'Offline');if(interactive)toast(tr('Sin conexión. La foto seguirá pendiente.','Offline. The photo will remain pending.'),4000);return}
  syncingPending=true;syncBarButton.disabled=true;
  let synced=0,failed=0,lastError='';
  try{
    const rows=await pendingPhotoRecords();
    let cursor=0;
    const worker=async()=>{
      while(cursor<rows.length){
        const rec=rows[cursor++];
        try{await saveRecordCentral(rec);synced++}
        catch(err){failed++;lastError=String(err?.message||err||'PHOTO_SAVE_FAILED')}
      }
    };
    await Promise.all(Array.from({length:Math.min(3,rows.length||1)},()=>worker()));
  }catch(err){failed++;lastError=String(err?.message||err)}
  finally{
    syncingPending=false;
    await refreshPendingBar(failed?(es()?'Error: ':'Error: ')+lastError:'');
  }
  if(interactive){
    if(failed)toast(tr('No se pudieron sincronizar todas las fotos. Revisa el aviso y vuelve a intentar.','Not all photos could be synced. Check the notice and try again.'),5200);
    else if(synced)toast(tr('✓ Fotos sincronizadas con Wix.','✓ Photos synced with Wix.'),3200);
    else toast(tr('No hay fotos pendientes.','No photos are pending.'),2600)
  }
  return{synced,failed,lastError}
}

async function squareImageFile(file,{crop=false}={}){if(!file)return file;let bitmap=null,url='';try{let source,w,h;if('createImageBitmap'in window){bitmap=await createImageBitmap(file);source=bitmap;w=bitmap.width;h=bitmap.height}else{url=URL.createObjectURL(file);const im=new Image();await new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=reject;im.src=url});source=im;w=im.naturalWidth;h=im.naturalHeight}if(!w||!h)return file;const maxSide=Math.min(Math.max(w,h),2048),canvas=document.createElement('canvas');canvas.width=maxSide;canvas.height=maxSide;const ctx=canvas.getContext('2d');ctx.fillStyle='#111';ctx.fillRect(0,0,maxSide,maxSide);if(crop){const srcSide=Math.min(w,h),sx=(w-srcSide)/2,sy=(h-srcSide)/2;ctx.drawImage(source,sx,sy,srcSide,srcSide,0,0,maxSide,maxSide)}else{const scale=Math.min(maxSide/w,maxSide/h),dw=Math.round(w*scale),dh=Math.round(h*scale),dx=Math.round((maxSide-dw)/2),dy=Math.round((maxSide-dh)/2);ctx.drawImage(source,0,0,w,h,dx,dy,dw,dh)}const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.9));if(!blob)return file;return new File([blob],file.name?.replace(/\.[^.]+$/,'')+'.jpg'||`photo-${Date.now()}.jpg`,{type:'image/jpeg',lastModified:Date.now()})}catch(_){return file}finally{try{bitmap?.close?.()}catch(_){}if(url)URL.revokeObjectURL(url)}}
function validateFile(file){if(!file)return false;if(!String(file.type||'').startsWith('image/')){toast(tr('Selecciona una imagen válida.','Choose a valid image.'),3200);return false}if(file.size>MAX_BYTES){toast(tr('La imagen supera 10 MB.','The image exceeds 10 MB.'),3200);return false}return true}
function targetFromButton(el){if(el.matches('[data-product-photo]'))return{entityType:'ingredient',entityId:el.dataset.productPhoto};if(el.matches('[data-photo-target]'))return{entityType:el.dataset.photoType,entityId:el.dataset.photoId};return null}
function openChooser(target){if(!target?.entityType||!target?.entityId)return;const layer=makeLayer(`<h3>${esc(tr('Tomar o elegir foto','Take or choose photo'))}</h3><p>${esc(tr('Primero elige de dónde sale la imagen. Después podrás revisarla antes de guardarla.','Choose the image source first. You will review it before saving.'))}</p><div class="nexoPhotoGrid"><button id="nexoUseCamera" class="nexoPhotoChoice">📷 ${esc(tr('Cámara','Camera'))}</button><button id="nexoUseGallery" class="nexoPhotoChoice">▣ ${esc(tr('Galería','Gallery'))}</button></div><button id="nexoPhotoCancel" class="nexoPhotoCancel">${esc(tr('Cancelar','Cancel'))}</button>`);layer.querySelector('#nexoPhotoCancel').onclick=closeLayer;layer.querySelector('#nexoUseGallery').onclick=()=>pickGallery(target);layer.querySelector('#nexoUseCamera').onclick=()=>openCamera(target)}
function pickGallery(target){const input=document.createElement('input');input.type='file';input.accept='image/*';input.onchange=async()=>{const file=input.files?.[0];if(validateFile(file))review(target,await squareImageFile(file,{crop:false}))};closeLayer();input.click()}
function cameraFallback(target){const input=document.createElement('input');input.type='file';input.accept='image/*';input.setAttribute('capture','environment');input.onchange=async()=>{const file=input.files?.[0];if(validateFile(file))review(target,await squareImageFile(file,{crop:false}))};closeLayer();input.click()}
async function openCamera(target){if(!navigator.mediaDevices?.getUserMedia){cameraFallback(target);return}try{const layer=makeLayer(`<h3>${esc(tr('Cámara','Camera'))}</h3><p>${esc(tr('Alinea la imagen y toca Tomar foto.','Frame the image and tap Take photo.'))}</p><video id="nexoPhotoVideo" class="nexoPhotoVideo" autoplay playsinline muted></video><div class="nexoPhotoActions"><button id="nexoCapture" class="nexoPhotoPrimary">📷 ${esc(tr('Tomar foto','Take photo'))}</button><button id="nexoCameraCancel" class="nexoPhotoSecondary">${esc(tr('Cancelar','Cancel'))}</button></div>`);stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},aspectRatio:{ideal:1},width:{ideal:1600},height:{ideal:1600}},audio:false});const video=layer.querySelector('#nexoPhotoVideo');video.srcObject=stream;layer.querySelector('#nexoCameraCancel').onclick=closeLayer;layer.querySelector('#nexoCapture').onclick=()=>capture(target,video)}catch(_){cameraFallback(target)}}
function capture(target,video){const w=video.videoWidth||1280,h=video.videoHeight||720,src=Math.min(w,h),sx=(w-src)/2,sy=(h-src)/2,out=Math.min(src,2048),canvas=document.createElement('canvas');canvas.width=out;canvas.height=out;canvas.getContext('2d').drawImage(video,sx,sy,src,src,0,0,out,out);canvas.toBlob(blob=>{if(!blob)return;const file=new File([blob],`photo-${Date.now()}.jpg`,{type:'image/jpeg'});if(validateFile(file))review(target,file)},'image/jpeg',.9)}
function review(target,file){stopCamera();const layer=makeLayer(`<h3>${esc(tr('Revisar foto','Review photo'))}</h3><p>${esc(tr('Si esta es la imagen correcta, toca Guardar foto o Listo.','If this is the correct image, tap Save photo or Done.'))}</p><img class="nexoPhotoPreview" alt=""><div class="nexoPhotoActions"><button id="nexoSavePhoto" class="nexoPhotoPrimary">✓ ${esc(tr('Guardar foto','Save photo'))}</button><button id="nexoChangePhoto" class="nexoPhotoSecondary">↻ ${esc(tr('Cambiar','Change'))}</button></div><div class="nexoPhotoFooter"><button id="nexoReviewCancel" class="nexoPhotoCancel">${esc(tr('Cancelar','Cancel'))}</button><button id="nexoReviewDone" class="nexoPhotoDone">✓ ${esc(tr('Listo','Done'))}</button></div><p class="nexoPhotoHint">${esc(tr('La foto se guardará en el sistema y quedará disponible en los demás dispositivos. También se conservará una copia local para uso sin conexión.','The photo will be saved to the system and become available on other devices. A local offline copy will also be kept.'))}</p>`);const preview=URL.createObjectURL(file);current={target,file,preview,saving:false};const image=layer.querySelector('.nexoPhotoPreview');if(image)image.src=preview;layer.querySelector('#nexoSavePhoto').onclick=()=>saveCurrent();layer.querySelector('#nexoChangePhoto').onclick=()=>{if(current?.saving)return;const t=current?.target;if(current?.preview)URL.revokeObjectURL(current.preview);current=null;openChooser(t)};layer.querySelector('#nexoReviewCancel').onclick=()=>{if(current?.saving)return;closeLayer()};layer.querySelector('#nexoReviewDone').onclick=()=>{if(current?.saving){closeLayer();return}saveCurrent({dismissAfterLocal:true})}}
async function saveCurrent({dismissAfterLocal=false}={}){const c=current;if(!c||c.saving)return;c.saving=true;const button=document.getElementById('nexoSavePhoto'),change=document.getElementById('nexoChangePhoto'),cancel=document.getElementById('nexoReviewCancel'),done=document.getElementById('nexoReviewDone');if(button){button.disabled=true;button.textContent=tr('Guardando en el sistema…','Saving to system…')}if(change)change.disabled=true;if(cancel)cancel.disabled=true;if(done){done.disabled=false;done.textContent='✓ '+tr('Listo','Done')}const rec={key:keyOf(c.target.entityType,c.target.entityId),entityType:c.target.entityType,entityId:c.target.entityId,blob:c.file,name:c.file.name||'photo.jpg',mime:c.file.type||'image/jpeg',size:c.file.size,updatedAt:Date.now(),synced:false,scopeId:photoScopeId(),workspaceId:String(data()?.context?.workspaceId||''),remoteImage:null};try{await putRecord(rec);publishPhoto(rec.entityType,rec.entityId,objectUrl(rec),'local-pending');if(dismissAfterLocal&&current===c)closeLayer();await saveRecordCentral(rec);await refreshPendingBar();toast(tr('✓ Foto guardada en Wix y disponible en otros dispositivos','✓ Photo saved to Wix and available on other devices'),3200);if(!dismissAfterLocal&&current===c)closeLayer()}catch(err){console.error('[NEXO/PHOTO]',err);try{await putRecord(rec)}catch(_){}publishPhoto(rec.entityType,rec.entityId,objectUrl(rec),'local-pending');await refreshPendingBar(String(err?.message||err||''));toast(tr('Foto guardada temporalmente. Usa “Sincronizar ahora” cuando estés conectado.','Photo saved temporarily. Use “Sync now” when online.'),5200);if(current===c)closeLayer()}}

document.addEventListener('click',e=>{const control=e.target.closest?.('[data-product-photo],[data-photo-target]');if(!control)return;const target=targetFromButton(control);if(!target)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openChooser(target)},true);
syncBarButton.onclick=()=>syncPendingRecords({interactive:true});
addEventListener('message',e=>{let m=e.data;if(typeof m==='string')try{m=JSON.parse(m)}catch{return}if(!m?.type)return;const p=m.payload||{};if(m.type==='DM_PHOTO_SAVED'){const wait=pendingRemote.get(p.requestId);if(wait){clearTimeout(wait.timer);pendingRemote.delete(p.requestId);wait.resolve(p)}return}if(m.type==='DM_PHOTO_ERROR'){const wait=pendingRemote.get(p.requestId);if(wait){clearTimeout(wait.timer);pendingRemote.delete(p.requestId);wait.reject(new Error(p.error||'PHOTO_SAVE_FAILED'))}return}if(m.type==='MENU_DATA_LOADED'){clearTimeout(pendingRetryTimer);setTimeout(async()=>{await hydrate();await refreshPendingBar();await syncPendingRecords()},0)}});
addEventListener('online',()=>setTimeout(()=>syncPendingRecords(),300));
addEventListener('beforeunload',()=>{clearTimeout(pendingRetryTimer);stopCamera();for(const item of objectUrls.values())URL.revokeObjectURL(item.url)});
window.NEXO_PHOTO_API={syncPending:()=>syncPendingRecords({interactive:true}),pending:pendingPhotoRecords,refresh:refreshPendingBar};
(async()=>{await migrateLegacy();await hydrate();await refreshPendingBar();if(navigator.onLine)setTimeout(()=>syncPendingRecords(),600)})();
})();