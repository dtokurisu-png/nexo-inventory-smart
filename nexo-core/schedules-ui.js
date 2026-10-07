(function(){
if(window.__nexoSchedulesApp)return;window.__nexoSchedulesApp=true;
const CSS='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/mi-espacio-ui.css?v=workspace-tools-split-20261007-90';
const NEXO_LOGO='https://static.wixstatic.com/media/8b64a8_7bd85ca8e1854afc9ae91eab7457c405~mv2.png';
const NEXO_ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const freeSite=/\.(wixstudio|wixsite)\.com$/i.test(location.hostname);
const apiBase=freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'';
const API=apiBase+'/_functions/nexoMiEspacioUi';
let accessStage='WAITING_PAGE',sessionToken='',workspace=null;
let workspaceTodaySchedule=null,scheduleWeekStart='',scheduleWeekStartsOn='saturday',scheduleData=null,scheduleImportData=null,scheduleDebug=null,scheduleAnalysisBusy=false,scheduleDebugModal=null,scheduleResumeImportId='';
const lang=String(new URLSearchParams(location.search).get('nxoLang')||'es').toLowerCase().startsWith('en')?'en':'es';
function currentLanguage(){return lang}
function ui(es,en){return lang==='en'?en:es}
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const iconUrl=name=>NEXO_ICON_BASE+encodeURIComponent(String(name||''))+'.png';
function iconTag(name,label='',extraClass=''){return '<img class="nxo-icon-img'+(extraClass?' '+esc(extraClass):'')+'" src="'+esc(iconUrl(name))+'" alt="'+esc(label)+'" loading="lazy" decoding="async">'}
function addCss(){if(document.getElementById('nxo-css'))return;const l=document.createElement('link');l.id='nxo-css';l.rel='stylesheet';l.href=CSS;document.head.appendChild(l)}
function root(){addCss();document.body.classList.add('nxo-lock');let r=document.getElementById('nxo-app');if(!r){r=document.createElement('div');r.id='nxo-app';r.className='nxo-app';r.dataset.theme=(new URLSearchParams(location.search).get('nxoTheme')==='night'?'night':'day');document.body.appendChild(r)}return r}
function html(v){root().innerHTML=v}
function accessError(code){return new Error('No se pudo abrir Horarios ('+accessStage+' / '+code+').')}
function retryAccess(){const u=new URL(location.href);['nxm','nxme','nxms','nxav'].forEach(k=>u.searchParams.delete(k));location.replace(u.href)}
function loading(label=ui('Abriendo Horarios…','Opening Schedule…')){html('<div class="nxo-loading"><div><div class="nxo-spinner"></div><strong>'+esc(label)+'</strong><p class="nxo-muted">'+esc(ui('Preparando el espacio de trabajo.','Preparing the Workspace.'))+'</p></div></div>')}
function errorView(e){const m=String(e&&e.message?e.message:e||'Error');html('<div class="nxo-loading"><div class="nxo-error"><h2>'+esc(ui('No se pudo abrir Horarios','Could not open Schedule'))+'</h2><p>'+esc(m)+'</p><button id="nxo-retry" class="nxo-btn nxo-btn-gold">'+esc(ui('Reintentar','Retry'))+'</button></div></div>');document.getElementById('nxo-retry')?.addEventListener('click',retryAccess)}
function toast(msg){let x=document.querySelector('.nxo-toast');if(x)x.remove();x=document.createElement('div');x.className='nxo-toast';x.textContent=msg;document.body.appendChild(x);setTimeout(()=>x.remove(),3200)}
function modal(title,body,onReady){const o=document.createElement('div');o.className='nxo-overlay';o.innerHTML='<div class="nxo-modal"><div class="nxo-modal-head"><strong>'+esc(title)+'</strong><button class="nxo-btn" data-close aria-label="'+esc(ui('Cerrar','Close'))+'">'+iconTag('cerrar')+'</button></div><div class="nxo-modal-body">'+body+'</div></div>';document.body.appendChild(o);o.querySelector('[data-close]').onclick=()=>o.remove();o.onclick=e=>{if(e.target===o)o.remove()};if(onReady)onReady(o);return o}
async function api(action,payload={}){
 const h={'Content-Type':'application/json','Accept':'application/json'};if(sessionToken)h.Authorization='Bearer '+sessionToken;
 const controller=new AbortController(),requestTimeout=action==='schedule.gpt.analyze'||action==='schedule.import.get'?45000:20000,timer=setTimeout(()=>controller.abort(),requestTimeout);
 try{const r=await fetch(API,{method:'POST',cache:'no-store',signal:controller.signal,headers:h,body:JSON.stringify({action,...payload})});let d=null;try{d=await r.json()}catch(_){}if(!r.ok){if(d?.error)throw new Error(String(d.error));throw new Error('No se pudo completar '+action+' (HTTP_'+r.status+').')}if(!d)throw new Error('Respuesta inválida en '+action+'.');if(d.ok===false)throw new Error(d.error||'Operación no disponible');return d.data??d}
 catch(e){if(e.name==='AbortError')throw accessError('REQUEST_TIMEOUT');throw e}finally{clearTimeout(timer)}
}
function stripBoot(){try{const u=new URL(location.href);['nxm','nxme','nxms','nxav'].forEach(k=>u.searchParams.delete(k));history.replaceState(history.state||{},'',u.pathname+u.search+u.hash)}catch(_){}}
async function waitBoot(){let previous='',deadline=Date.now()+30000;while(Date.now()<deadline){const q=new URLSearchParams(location.search),t=q.get('nxm'),e=q.get('nxme'),state=q.get('nxms')||'WAITING_PAGE';if(state!==previous){previous=state;accessStage=state;deadline=Date.now()+(state==='LOGIN'?310000:30000)}if(e)throw accessError(e);if(t&&(state==='READY'||state==='WAITING_PAGE'))return t;await new Promise(r=>setTimeout(r,100))}throw accessError('PAGE_TIMEOUT')}
function backTarget(){try{const u=new URL(location.href),raw=u.searchParams.get('nxoBack')||'';if(raw){const b=new URL(raw,location.href);if(b.origin===location.origin)return b.href}}catch(_){}const base=freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'';return location.origin+base+'/blank-8'}
function renderAppShell(){const ws=workspace?.workspace||{};html('<div class="nxo-shell"><header class="nxo-topbar nxo-workspace-nav"><div class="nxo-nav-brand"><span class="nxo-nav-mark"><img src="'+esc(NEXO_LOGO)+'" alt="Nexo Group"></span><span class="nxo-nav-brand-copy"><strong>Nexo Group</strong><small>'+esc(ui('Horarios','Schedule'))+'</small></span></div><div class="nxo-nav-primary-utils"><button type="button" class="nxo-btn" id="nxo-schedule-back">← '+esc(ui('Volver','Back'))+'</button></div></header><main class="nxo-main"><div class="nxo-workspace-header"><div><div class="nxo-eyebrow">'+esc(ui('Herramienta del espacio de trabajo','Workspace tool'))+'</div><h2>'+esc(ui('Horarios','Schedule'))+'</h2><p>'+esc(ws.name||ui('Espacio de trabajo','Workspace'))+'</p></div></div>'+renderTodayScheduleShell()+renderScheduleShell()+'</main></div>');document.getElementById('nxo-schedule-back')?.addEventListener('click',()=>location.assign(backTarget()));loadTodaySchedule();loadSchedule()}
function renderTodayScheduleShell(){
  return '<section class="nxo-section nxo-today-shift-section"><div id="nxo-today-shift-zone"><div class="nxo-today-shift-card is-loading"><div><span class="nxo-today-shift-eyebrow">'+esc(ui('Jornada de hoy','Today\'s shift'))+'</span><strong>'+esc(ui('Cargando tu jornada…','Loading your shift…'))+'</strong></div></div></div></section>'
}
function todayShiftText(row){
  if(!row)return'';
  const status=String(row.status||'UNKNOWN').toUpperCase();
  if(status==='OFF'||status==='REC_OFF')return scheduleStatusLabel(status);
  const time=scheduleGridText(row);
  return time||scheduleStatusLabel(status)
}
function renderTodayScheduleCard(data){
  const zone=document.getElementById('nxo-today-shift-zone');if(!zone)return;
  if(!data){
    zone.innerHTML='<div class="nxo-today-shift-card"><div><span class="nxo-today-shift-eyebrow">'+esc(ui('Jornada de hoy','Today\'s shift'))+'</span><strong>'+esc(ui('No se pudo cargar la jornada.','Could not load today\'s shift.'))+'</strong></div></div>';return
  }
  const shifts=Array.isArray(data.shifts)?data.shifts:[];
  const status=String(data.schedule?.status||'').toUpperCase();
  const statusChip=status?'<span class="nxo-chip">'+esc(scheduleStatusLabel(status))+'</span>':'';
  const dateLabel=data.date?scheduleDay(data.date):ui('Hoy','Today');
  let content='';
  if(!shifts.length){
    content='<div class="nxo-today-shift-main"><strong>'+esc(ui('Sin jornada asignada para hoy','No shift assigned today'))+'</strong><span>'+esc(dateLabel)+'</span></div>'
  }else{
    content='<div class="nxo-today-shift-main"><strong>'+esc(todayShiftText(shifts[0]))+'</strong><span>'+esc(dateLabel)+'</span></div>'+
      (shifts.length>1?'<div class="nxo-today-shift-segments">'+shifts.slice(1).map(row=>'<span>'+esc(todayShiftText(row))+'</span>').join('')+'</div>':'')
  }
  zone.innerHTML='<div class="nxo-today-shift-card"><div class="nxo-today-shift-head"><span class="nxo-today-shift-eyebrow">'+esc(ui('Jornada de hoy','Today\'s shift'))+'</span>'+statusChip+'</div>'+content+'</div>'
}
async function loadTodaySchedule(){
  const zone=document.getElementById('nxo-today-shift-zone');if(!zone||!workspace?.workspace?.id)return;
  try{
    workspaceTodaySchedule=await api('schedule.today',{workspaceId:workspace.workspace.id});
    renderTodayScheduleCard(workspaceTodaySchedule)
  }catch(e){
    zone.innerHTML='<div class="nxo-today-shift-card"><div><span class="nxo-today-shift-eyebrow">'+esc(ui('Jornada de hoy','Today\'s shift'))+'</span><strong>'+esc(e.message||String(e))+'</strong></div></div>'
  }
}
function scheduleDateKey(d){
  const x=d instanceof Date?d:new Date(d);
  if(Number.isNaN(x.getTime()))return'';
  return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')
}
function scheduleWeekStartKey(value,weekStartsOn=scheduleWeekStartsOn){
  const d=value?new Date(value+'T12:00:00'):new Date();
  const map={sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6};
  const target=Object.prototype.hasOwnProperty.call(map,String(weekStartsOn||'').toLowerCase())?map[String(weekStartsOn||'').toLowerCase()]:6;
  const delta=(d.getDay()-target+7)%7;
  d.setDate(d.getDate()-delta);
  return scheduleDateKey(d)
}
function scheduleShiftWeek(days){
  const base=new Date((scheduleWeekStart||scheduleWeekStartKey())+'T12:00:00');
  base.setDate(base.getDate()+days);
  scheduleWeekStart=scheduleDateKey(base);
  scheduleData=null;scheduleImportData=null;scheduleDebug=null;
  loadSchedule()
}
function renderScheduleShell(){
  return '<section class="nxo-section"><div id="nxo-schedule-zone"><div class="nxo-section-head"><div><h3>'+esc(ui('Horarios','Schedule'))+'</h3><p>'+esc(ui('Cargando…','Loading…'))+'</p></div></div></div></section>'
}
function scheduleStatusLabel(value){
  const s=String(value||'').toUpperCase();
  const map={PUBLISHED:ui('Publicado','Published'),DRAFT:ui('Borrador','Draft'),WORK:ui('Trabajo','Work'),OFF:'OFF',REC_OFF:'REC OFF',TRAINING:ui('Capacitación','Training'),ON_CALL:ui('Guardia','On call'),UNKNOWN:ui('Revisar','Review')};
  return map[s]||s||ui('Sin horario','No schedule')
}
function scheduleTime(value){
  if(!value)return'';
  try{return new Date(value).toLocaleTimeString(currentLanguage()==='en'?'en-US':'es-US',{hour:'numeric',minute:'2-digit'})}catch(_){return''}
}
function scheduleDay(value){
  try{return new Date(value+'T12:00:00').toLocaleDateString(currentLanguage()==='en'?'en-US':'es-US',{weekday:'short',month:'short',day:'numeric'})}catch(_){return value}
}
function closeScheduleDebugModal(){if(scheduleDebugModal){scheduleDebugModal.remove();scheduleDebugModal=null}}
function openScheduleDebugModal(){
  if(scheduleDebugModal&&document.body.contains(scheduleDebugModal)){renderScheduleDebugPanel();return}
  const o=document.createElement('div');o.className='nxo-overlay';o.id='nxo-schedule-debug-overlay';
  o.innerHTML='<div class="nxo-modal" style="max-width:720px"><div class="nxo-modal-head"><strong>'+esc(ui('Analizando horario','Analyzing schedule'))+'</strong><button class="nxo-btn" data-schedule-debug-close hidden>'+iconTag('cerrar')+'</button></div><div class="nxo-modal-body"><div id="nxo-schedule-debug"></div></div></div>';
  document.body.appendChild(o);scheduleDebugModal=o;
  o.querySelector('[data-schedule-debug-close]')?.addEventListener('click',closeScheduleDebugModal);
  renderScheduleDebugPanel()
}
function scheduleDebugRow(label,state,detail=''){
  const icon=state==='done'?'✓':state==='error'?'✕':state==='working'?'◌':'○';
  return '<div style="display:grid;grid-template-columns:28px minmax(150px,220px) 1fr;gap:8px;align-items:start;padding:9px 0;border-bottom:1px solid rgba(127,127,127,.12)"><strong>'+esc(icon)+'</strong><strong>'+esc(label)+'</strong><span class="nxo-muted">'+esc(detail)+'</span></div>'
}
function renderScheduleDebugPanel(){
  const zone=scheduleDebugModal?.querySelector('#nxo-schedule-debug');if(!zone)return;
  const d=scheduleDebug||{},err=Boolean(d.error),stage=String(d.stage||'');
  const st=(name,done)=>done?'done':(err&&stage===name?'error':(!err&&scheduleAnalysisBusy&&stage===name?'working':'pending'));
  zone.innerHTML=
    '<p class="nxo-muted">'+esc(ui('GPT analiza la imagen completa y devuelve un horario estructurado.','GPT analyzes the complete image and returns a structured schedule.'))+'</p>'+
    scheduleDebugRow(ui('Preparar imagen','Prepare image'),st('image',d.imageReady),d.imageReady?((d.width||'')+'×'+(d.height||'')+' · '+Math.round((d.bytes||0)/1024)+' KB'):ui('Optimizando imagen.','Optimizing image.'))+
    scheduleDebugRow(ui('Enviar a GPT','Send to GPT'),st('send',d.sent),d.sent?ui('Imagen enviada.','Image sent.'):ui('Esperando imagen.','Waiting for image.'))+
    scheduleDebugRow(ui('GPT analizando','GPT analyzing'),st('gpt',d.aiCompleted),d.aiCompleted?ui('Análisis completado.','Analysis complete.'):(String(d.providerStatus||'').toLowerCase()==='reconnecting'?ui('Reconectando con el análisis… intento ','Reconnecting to analysis… attempt ')+String(d.networkRetries||1):(String(d.providerStatus||'').toLowerCase()==='queued'?ui('Solicitud en cola de GPT.','GPT request queued.'):ui('Leyendo colaboradores, roles y siete días.','Reading members, roles and seven days.'))))+
    scheduleDebugRow(ui('Colaboradores','Members'),d.aiCompleted?'done':'pending',String(d.collaboratorsDetected||0))+
    scheduleDebugRow(ui('Roles','Roles'),d.aiCompleted?'done':'pending',String(d.rolesDetected||0))+
    scheduleDebugRow(ui('Días','Days'),d.aiCompleted?'done':'pending',String(d.daysDetected||0))+
    scheduleDebugRow(ui('Horario creado','Schedule created'),d.scheduleCreated?'done':(d.aiCompleted?'working':'pending'),d.scheduleCreated?ui('Borrador generado automáticamente.','Draft generated automatically.'):ui('Preparando la cuadrícula.','Preparing schedule grid.'))+
    scheduleDebugRow(ui('Colaboradores por vincular','Members to link'),d.aiCompleted?(Number(d.unresolvedCollaborators||0)?'pending':'done'):'pending',String(d.unresolvedCollaborators??0))+
    (err?'<div class="nxo-empty" style="margin-top:14px;text-align:left"><strong>'+esc(ui('Error: ','Error: '))+'</strong>'+esc(String(d.error))+'</div>':'');
  const b=scheduleDebugModal?.querySelector('[data-schedule-debug-close]');if(b)b.hidden=!(err||d.aiCompleted)
}
function scheduleImageElement(file){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error(ui('No se pudo abrir la imagen.','Could not open image.')))};
    img.src=url
  })
}
function scheduleCanvasBlob(canvas,quality){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error(ui('No se pudo preparar la imagen.','Could not prepare image.'))),'image/jpeg',quality))
}
async function optimizeScheduleImage(file){
  const source=await scheduleImageElement(file);
  const ow=source.naturalWidth||source.width,oh=source.naturalHeight||source.height;
  if(!ow||!oh)throw new Error(ui('La imagen no tiene dimensiones válidas.','The image has invalid dimensions.'));
  const maxSide=2600,scale=Math.min(1,maxSide/Math.max(ow,oh));
  const width=Math.max(1,Math.round(ow*scale)),height=Math.max(1,Math.round(oh*scale));
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(source,0,0,width,height);
  let quality=.9,blob=await scheduleCanvasBlob(canvas,quality);
  while(blob.size>1800000&&quality>.64){quality-=.08;blob=await scheduleCanvasBlob(canvas,quality)}
  canvas.width=1;canvas.height=1;
  return{blob,width,height}
}
async function scheduleBlobBase64(blob){
  const bytes=new Uint8Array(await blob.arrayBuffer()),chunk=0x8000;let binary='';
  for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
  return btoa(binary)
}
function renderScheduleRoles(){
  const roles=scheduleData?.roles||[],actor=scheduleData?.actor||{};
  const chips=roles.length?roles.map(r=>'<button type="button" class="nxo-chip" data-schedule-role-edit="'+esc(r.id)+'" style="cursor:'+(actor.canManage?'pointer':'default')+'">'+esc(r.name)+'</button>').join(' '):'<span class="nxo-muted">'+esc(ui('GPT todavía no ha detectado roles para esta compañía.','GPT has not detected company roles yet.'))+'</span>';
  return '<div class="nxo-panel" style="padding:14px;margin-bottom:14px"><div class="nxo-section-head"><div><h3>'+esc(ui('Roles de la compañía','Company roles'))+'</h3><p>'+esc(ui('GPT los crea automáticamente cuando aparecen en un horario. Después puedes renombrarlos y reutilizarlos.','GPT creates them automatically when they appear in a schedule. You can rename and reuse them later.'))+'</p></div></div><div style="display:flex;flex-wrap:wrap;gap:8px">'+chips+'</div></div>'
}
function openScheduleRoleEdit(roleId){
  const role=(scheduleData?.roles||[]).find(r=>r.id===roleId);if(!role||!scheduleData?.actor?.canManage)return;
  modal(ui('Editar rol','Edit role'),
    '<div class="nxo-field"><label>'+esc(ui('Nombre','Name'))+'</label><input id="nxo-role-edit-name" class="nxo-input" value="'+esc(role.name||'')+'"></div>'+
    '<div class="nxo-field"><label>'+esc(ui('Alias','Aliases'))+'</label><input id="nxo-role-edit-aliases" class="nxo-input" value="'+esc((role.aliases||[]).filter(a=>String(a).toLowerCase()!==String(role.name||'').toLowerCase()).join(', '))+'"></div>'+
    '<div class="nxo-modal-actions"><button id="nxo-role-edit-save" class="nxo-btn nxo-btn-gold">'+esc(ui('Guardar','Save'))+'</button></div>',
    o=>{o.querySelector('#nxo-role-edit-save').onclick=async()=>{
      const name=o.querySelector('#nxo-role-edit-name').value.trim();
      const aliases=o.querySelector('#nxo-role-edit-aliases').value.split(',').map(x=>x.trim()).filter(Boolean);
      if(!name)return;
      try{await api('schedule.roles.save',{workspaceId:workspace.workspace.id,input:{id:role.id,name,aliases}});o.remove();await loadSchedule();toast(ui('Rol actualizado','Role updated'))}catch(e){toast(e.message||String(e))}
    }}
  )
}
function scheduleGroupRows(rows){
  const map=new Map();
  for(const r of rows||[]){
    const key=r.memberId||r.identityKey||r.rawName||r.memberNameSnapshot||'unknown';
    if(!map.has(key))map.set(key,{key,name:r.suggestedMemberName||r.memberName||r.memberNameSnapshot||r.rawName||ui('Sin vincular','Unmatched'),role:r.position||r.positionLabel||'',rows:[]});
    const g=map.get(key);if(!g.role&&(r.position||r.positionLabel))g.role=r.position||r.positionLabel;g.rows.push(r)
  }
  return[...map.values()]
}
function scheduleDayCard(row,editable=false){
  const today=scheduleDateKey(new Date())===row.date;
  const status=String(row.status||'UNKNOWN').toUpperCase();
  const start=row.start||scheduleTime(row.startAt)||'',end=row.end||scheduleTime(row.endAt)||'';
  let text=scheduleStatusLabel(status);
  if(status==='WORK'){
    text=start&&end?start+' – '+end:(start?ui('Entrada ','Start ')+start:(end?ui('Salida ','End ')+end:ui('Trabaja','Works')))
  }else if(status==='TRAINING'||status==='ON_CALL'){
    const base=scheduleStatusLabel(status);
    text=start&&end?base+' · '+start+' – '+end:(start?base+' · '+ui('Entrada ','Start ')+start:(end?base+' · '+ui('Salida ','End ')+end:base))
  }
  const bg=today?'background:linear-gradient(135deg,rgba(225,189,105,.32),rgba(47,79,147,.12));box-shadow:0 0 0 2px rgba(225,189,105,.45) inset;':'';
  return '<div class="nxo-panel" style="padding:10px;min-width:112px;'+bg+'"><div class="nxo-muted" style="font-size:.82em">'+esc(scheduleDay(row.date))+(today?' · '+esc(ui('Hoy','Today')):'')+'</div><strong style="display:block;margin-top:4px">'+esc(text||'—')+'</strong>'+(editable?'<button type="button" class="nxo-icon-btn" data-schedule-row-edit="'+esc(row.id)+'" style="margin-top:8px" aria-label="'+esc(ui('Editar turno','Edit shift'))+'">'+iconTag('editar')+'</button>':'')+'</div>'
}
function scheduleMemberOptions(row,members){
  return '<option value="">'+esc(ui('Seleccionar colaborador','Select member'))+'</option>'+
    members.map(m=>'<option value="'+esc(m.memberId)+'" '+(m.memberId===row.memberId?'selected':'')+'>'+esc(m.displayName||m.workName||m.memberId)+'</option>').join('')
}
function scheduleRoleOptions(row,roles){
  return '<option value="">'+esc(ui('Sin rol','No role'))+'</option>'+
    roles.map(r=>'<option value="'+esc(r.id)+'" '+(r.id===row.positionKey?'selected':'')+'>'+esc(r.name)+'</option>').join('')
}
function openScheduleRowEdit(rowId){
  const row=(scheduleImportData?.rows||[]).find(r=>r.id===rowId);if(!row)return;
  const members=scheduleImportData?.members||[],roles=scheduleImportData?.roles||[];
  modal(ui('Editar día','Edit day'),
    '<div class="nxo-field"><label>'+esc(ui('Nombre leído','Read name'))+'</label><input id="nxo-row-name" class="nxo-input" value="'+esc(row.rawName||'')+'"></div>'+
    '<div class="nxo-field"><label>'+esc(ui('Colaborador','Member'))+'</label><select id="nxo-row-member" class="nxo-select">'+scheduleMemberOptions(row,members)+'</select></div>'+
    '<div class="nxo-field"><label>'+esc(ui('Rol','Role'))+'</label><select id="nxo-row-role" class="nxo-select">'+scheduleRoleOptions(row,roles)+'</select></div>'+
    '<div class="nxo-field"><label>'+esc(ui('Fecha','Date'))+'</label><input id="nxo-row-date" class="nxo-input" type="date" value="'+esc(row.date||'')+'"></div>'+
    '<div class="nxo-field"><label>'+esc(ui('Estado','Status'))+'</label><select id="nxo-row-status" class="nxo-select">'+['WORK','OFF','REC_OFF','TRAINING','ON_CALL','UNKNOWN'].map(s=>'<option value="'+s+'" '+(s===String(row.status||'UNKNOWN').toUpperCase()?'selected':'')+'>'+esc(scheduleStatusLabel(s))+'</option>').join('')+'</select></div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="nxo-field"><label>'+esc(ui('Entrada','Start'))+'</label><input id="nxo-row-start" class="nxo-input" type="time" value="'+esc(row.start||'')+'"></div><div class="nxo-field"><label>'+esc(ui('Salida','End'))+'</label><input id="nxo-row-end" class="nxo-input" type="time" value="'+esc(row.end||'')+'"></div></div>'+
    '<div class="nxo-modal-actions"><button id="nxo-row-save" class="nxo-btn nxo-btn-gold">'+esc(ui('Guardar corrección','Save correction'))+'</button></div>',
    o=>{o.querySelector('#nxo-row-save').onclick=async()=>{
      const input={rawName:o.querySelector('#nxo-row-name').value.trim(),memberId:o.querySelector('#nxo-row-member').value,roleId:o.querySelector('#nxo-row-role').value,date:o.querySelector('#nxo-row-date').value,status:o.querySelector('#nxo-row-status').value,start:o.querySelector('#nxo-row-start').value,end:o.querySelector('#nxo-row-end').value};
      try{
        await api('schedule.import.row.update',{workspaceId:workspace.workspace.id,importId:scheduleImportData.importId,rowId:row.id,input});
        const refreshed=await api('schedule.import.get',{workspaceId:workspace.workspace.id,importId:scheduleImportData.importId});
        refreshed.weekStart=scheduleImportData.weekStart||scheduleWeekStart;scheduleImportData=refreshed;
        o.remove();renderScheduleData();toast(ui('Corrección guardada','Correction saved'))
      }catch(e){toast(e.message||String(e))}
    }}
  )
}
function scheduleGridText(row){
  if(!row)return'—';
  const status=String(row.status||'UNKNOWN').toUpperCase();
  const imported=Boolean(row.sourceImportId);
  const start=row.startTimeLocal||row.start||(imported?'':scheduleTime(row.startAt))||'';
  const end=row.endTimeLocal||row.end||(imported?'':scheduleTime(row.endAt))||'';
  const station=String(row.stationLabel||'').trim();
  let text='';
  if(status==='WORK')text=start&&end?start+' – '+end:(start?start:(end?ui('Salida ','End ')+end:ui('Trabaja','Works')));
  else if(status==='TRAINING'||status==='ON_CALL'){
    const base=scheduleStatusLabel(status);
    text=start&&end?base+' · '+start+' – '+end:(start?base+' · '+start:(end?base+' · '+ui('Salida ','End ')+end:base))
  }else text=scheduleStatusLabel(status);
  if(station&&status!=='OFF'&&status!=='REC_OFF')text+=(text?' · ':'')+station;
  return text
}
function scheduleWeekDates(weekStart){
  const base=new Date(String(weekStart||'')+'T12:00:00');
  if(Number.isNaN(base.getTime()))return[];
  return Array.from({length:7},(_,i)=>{
    const d=new Date(base);d.setDate(base.getDate()+i);return scheduleDateKey(d)
  })
}
function scheduleGridDayCell(row,date){
  const status=String(row?.status||'UNKNOWN').toUpperCase();
  const today=scheduleDateKey(new Date())===date;
  const cls='nxo-schedule-day nxo-schedule-status-'+status.toLowerCase().replace(/_/g,'-')+(today?' is-today':'');
  return '<div class="'+cls+'" data-date="'+esc(date)+'"><strong>'+esc(scheduleGridText(row))+'</strong></div>'
}
function renderScheduleGrid(rows,weekStart){
  const groups=scheduleGroupRows(rows||[]),dates=scheduleWeekDates(weekStart);
  if(!groups.length)return'<div class="nxo-empty">'+esc(ui('Todavía no hay un horario para esta semana.','There is no schedule for this week yet.'))+'</div>';
  const lang=currentLanguage()==='en'?'en-US':'es-US';
  const head='<div class="nxo-schedule-grid-head"><div>'+esc(ui('Colaborador + puesto','Member + role'))+'</div>'+dates.map(date=>'<div>'+esc(new Date(date+'T12:00:00').toLocaleDateString(lang,{weekday:'short',day:'numeric'}))+'</div>').join('')+'</div>';
  const body=groups.map(g=>{
    const byDate=new Map(g.rows.map(r=>[String(r.date||scheduleDateKey(r.startAt)||''),r]));
    const pending=g.rows.some(r=>!r.memberId||String(r.identityStatus||'').toUpperCase()==='PENDING');
    return '<div class="nxo-schedule-grid-row"><div class="nxo-schedule-person"><strong>'+esc(g.name)+'</strong><span>'+esc(g.role||ui('Sin puesto','No role'))+'</span>'+(pending?'<em>'+esc(ui('Pendiente de identidad','Identity pending'))+'</em>':'')+'</div>'+dates.map(date=>scheduleGridDayCell(byDate.get(date),date)).join('')+'</div>'
  }).join('');
  return '<div class="nxo-schedule-grid-wrap"><div class="nxo-schedule-grid">'+head+body+'</div></div>'
}

async function waitForScheduleAnalysis(importId,weekStart){
  const deadline=Date.now()+900000;
  let transientFailures=0;
  while(Date.now()<deadline){
    await new Promise(r=>setTimeout(r,2200));
    try{
      const state=await api('schedule.import.get',{workspaceId:workspace.workspace.id,importId,weekStart});
      transientFailures=0;
      scheduleImportData=state;
      scheduleDebug={...(scheduleDebug||{}),...(state.debug||{}),stage:state?.debug?.aiCompleted?'done':'gpt',sent:true,providerStatus:state.providerStatus||'',networkRetries:0,error:''};
      renderScheduleDebugPanel();
      if(state?.debug?.aiCompleted===true)return state;
      if(String(state?.status||'').toUpperCase()==='ERROR')throw new Error(ui('El análisis GPT no pudo completarse.','GPT analysis could not be completed.'))
    }catch(e){
      const msg=String(e?.message||e||'');
      const transient=/HTTP_502|HTTP_503|HTTP_504|REQUEST_TIMEOUT|Failed to fetch|NetworkError|Load failed|ERR_NETWORK|ERR_CONNECTION/i.test(msg);
      if(!transient)throw e;
      transientFailures+=1;
      scheduleDebug={...(scheduleDebug||{}),stage:'gpt',sent:true,providerStatus:'reconnecting',networkRetries:transientFailures,error:''};
      renderScheduleDebugPanel();
      await new Promise(r=>setTimeout(r,Math.min(8000,1200+transientFailures*900)));
    }
  }
  throw new Error(ui('El análisis sigue activo, pero esta pantalla superó el tiempo de espera. Cierra y vuelve a abrir Horarios para reanudarlo sin subir la imagen otra vez.','The analysis is still active, but this screen exceeded its wait time. Close and reopen Schedule to resume it without uploading the image again.'))
}

async function finishScheduleImportPolling(importId,weekStart){
  const parsed=await waitForScheduleAnalysis(importId,weekStart);
  scheduleWeekStart=parsed.weekStart||weekStart;
  scheduleDebug={...scheduleDebug,...(parsed.debug||{}),stage:'done',providerStatus:'completed',aiCompleted:true,scheduleCreated:Boolean(parsed.schedule?.id||parsed.debug?.scheduleCreated),error:''};
  scheduleData=await api('schedule.bootstrap',{workspaceId:workspace.workspace.id,weekStart:scheduleWeekStart});
  scheduleWeekStart=scheduleData?.weekStart||scheduleWeekStart;
  scheduleImportData=null;
  renderScheduleData();renderScheduleDebugPanel();
  const pending=Number(scheduleData?.pendingIdentityCount||0);
  toast(pending?ui('Horario creado. '+pending+' colaborador(es) quedarán vinculados cuando existan en el Workspace.','Schedule created. '+pending+' member(s) will link when they exist in the Workspace.'):ui('Horario creado automáticamente.','Schedule created automatically.'));
  setTimeout(closeScheduleDebugModal,1100);
  return parsed
}

async function resumeScheduleImport(importId,weekStart){
  if(!importId||scheduleResumeImportId===importId)return;
  scheduleResumeImportId=importId;
  scheduleAnalysisBusy=true;
  scheduleDebug={stage:'gpt',imageReady:true,sent:true,aiCompleted:false,scheduleCreated:false,providerStatus:'resuming',networkRetries:0,error:''};
  openScheduleDebugModal();renderScheduleData();renderScheduleDebugPanel();
  try{
    await finishScheduleImportPolling(importId,weekStart||scheduleWeekStart||scheduleWeekStartKey())
  }catch(e){
    scheduleDebug={...(scheduleDebug||{}),error:e.message||String(e)};
    renderScheduleDebugPanel();toast(e.message||String(e))
  }finally{
    scheduleAnalysisBusy=false;
    scheduleResumeImportId='';
    renderScheduleData()
  }
}

async function processScheduleImage(file){
  const mime=String(file.type||'').toLowerCase();
  if(!['image/png','image/jpeg','image/webp'].includes(mime)){toast(ui('Usa una imagen PNG, JPG o WEBP','Use a PNG, JPG or WEBP image'));return}
  if(!file.size||file.size>20*1024*1024){toast(ui('La imagen debe pesar menos de 20 MB.','The image must be under 20 MB.'));return}
  const week=document.getElementById('nxo-schedule-import-week')?.value||scheduleWeekStart||scheduleWeekStartKey();
  scheduleAnalysisBusy=true;scheduleImportData=null;scheduleDebug={stage:'image',imageReady:false,sent:false,aiCompleted:false,scheduleCreated:false,providerStatus:'',networkRetries:0,error:''};
  renderScheduleData();openScheduleDebugModal();
  try{
    const optimized=await optimizeScheduleImage(file);
    scheduleDebug={...scheduleDebug,stage:'send',imageReady:true,width:optimized.width,height:optimized.height,bytes:optimized.blob.size};renderScheduleDebugPanel();
    const imageBase64=await scheduleBlobBase64(optimized.blob);
    const started=await api('schedule.gpt.analyze',{workspaceId:workspace.workspace.id,input:{weekStart:week,fileName:file.name||'schedule-image',mimeType:'image/jpeg',imageBase64}});
    scheduleImportData=started;scheduleWeekStart=started.weekStart||week;scheduleResumeImportId=started.importId;
    scheduleDebug={...scheduleDebug,...(started.debug||{}),stage:'gpt',sent:true,providerStatus:started.providerStatus||'queued',aiCompleted:false,error:''};renderScheduleDebugPanel();
    await finishScheduleImportPolling(started.importId,week)
  }catch(e){
    scheduleDebug={...(scheduleDebug||{}),error:e.message||String(e)};
    renderScheduleDebugPanel();toast(e.message||String(e))
  }finally{
    scheduleAnalysisBusy=false;
    scheduleResumeImportId='';
    renderScheduleData()
  }
}
function renderScheduleData(){
  const zone=document.getElementById('nxo-schedule-zone');if(!zone||!scheduleData)return;
  const d=scheduleData,s=d.schedule,actor=d.actor||{},publishReady=d.publishReady===true&&s,pending=Number(d.pendingIdentityCount||0);
  const pendingNotice=pending?'<div class="nxo-schedule-identity-note"><strong>'+pending+' '+esc(ui('colaborador(es) por vincular','member(s) to link'))+'</strong><span>'+esc(ui('El horario ya está creado. Cuando esos colaboradores existan en el Workspace, Nexo intentará asociarlos automáticamente.','The schedule is already created. When those members exist in the Workspace, Nexo will try to link them automatically.'))+'</span></div>':'';
  zone.innerHTML='<div class="nxo-section-head"><div><h3>'+esc(ui('Horarios','Schedule'))+'</h3><p>'+esc(scheduleDay(d.weekStart))+' — '+esc(scheduleDay(d.weekEnd))+'</p></div><span class="nxo-chip">'+esc(scheduleStatusLabel(s?.status))+'</span></div>'+
    (actor.canImport?'<div class="nxo-panel" style="padding:16px;margin-bottom:14px"><div class="nxo-section-head"><div><h3>'+esc(ui('Cargar horario desde imagen','Load schedule from image'))+'</h3><p>'+esc(ui('Sube la hoja completa. GPT la interpreta, aprende su estructura y crea el borrador automáticamente, incluso si algunos colaboradores todavía no existen.','Upload the complete sheet. GPT interprets it, learns its structure, and creates the draft automatically even if some members do not exist yet.'))+'</p></div></div><div class="nxo-field"><label>'+esc(ui('Semana aproximada','Approximate week'))+'</label><input id="nxo-schedule-import-week" class="nxo-input" type="date" value="'+esc(d.weekStart)+'"></div><label class="nxo-btn nxo-btn-gold nxo-native-file-picker"><span>'+esc(scheduleAnalysisBusy?ui('Analizando…','Analyzing…'):ui('Seleccionar imagen','Select image'))+'</span><input id="nxo-schedule-image-input" type="file" accept="image/png,image/jpeg,image/webp" '+(scheduleAnalysisBusy?'disabled':'')+'></label></div>':'')+
    '<div class="nxo-section-actions"><button class="nxo-btn" id="nxo-schedule-prev">‹ '+esc(ui('Semana anterior','Previous week'))+'</button><button class="nxo-btn" id="nxo-schedule-today">'+esc(ui('Esta semana','This week'))+'</button><button class="nxo-btn" id="nxo-schedule-next">'+esc(ui('Semana siguiente','Next week'))+' ›</button>'+(actor.canPublish?'<button class="nxo-btn nxo-btn-gold" id="nxo-schedule-publish" '+(publishReady?'':'disabled')+'>'+esc(publishReady?ui('Publicar horario','Publish schedule'):ui('Publicar · bloqueado','Publish · locked'))+'</button>':'')+'</div>'+
    pendingNotice+renderScheduleGrid(d.shifts||[],d.weekStart);
  document.getElementById('nxo-schedule-prev')?.addEventListener('click',()=>scheduleShiftWeek(-7));
  document.getElementById('nxo-schedule-next')?.addEventListener('click',()=>scheduleShiftWeek(7));
  document.getElementById('nxo-schedule-today')?.addEventListener('click',()=>{scheduleWeekStart=scheduleWeekStartKey(undefined,scheduleWeekStartsOn);scheduleData=null;scheduleImportData=null;loadSchedule()});
  document.getElementById('nxo-schedule-image-input')?.addEventListener('change',e=>{const file=e.target.files?.[0];e.target.value='';if(file)processScheduleImage(file)});
  if(publishReady)document.getElementById('nxo-schedule-publish')?.addEventListener('click',publishScheduleUi)
}
async function loadSchedule(){
  const zone=document.getElementById('nxo-schedule-zone');if(!zone||!workspace?.workspace?.id)return;
  if(!scheduleWeekStart)scheduleWeekStart=scheduleWeekStartKey(undefined,scheduleWeekStartsOn);
  try{
    scheduleData=await api('schedule.bootstrap',{workspaceId:workspace.workspace.id,weekStart:scheduleWeekStart});
    scheduleWeekStartsOn=String(scheduleData?.settings?.weekStartsOn||'saturday').toLowerCase();
    scheduleWeekStart=scheduleData?.weekStart||scheduleWeekStartKey(scheduleWeekStart||undefined,scheduleWeekStartsOn);
    renderScheduleData();
    const pending=scheduleData?.pendingImport;
    if(pending?.importId&&!scheduleAnalysisBusy){
      const resumeWeek=pending.requestedWeekStart||scheduleWeekStart||scheduleWeekStartKey();
      setTimeout(()=>resumeScheduleImport(pending.importId,resumeWeek),250)
    }
  }
  catch(e){zone.innerHTML='<div class="nxo-empty">'+esc(e.message||String(e))+'</div>'}
}
async function publishScheduleUi(){
  try{await api('schedule.publish',{workspaceId:workspace.workspace.id,scheduleId:scheduleData.schedule.id});toast(ui('Horario publicado','Schedule published'));await loadSchedule()}
  catch(e){toast(e.message||String(e))}
}

async function start(){
 try{
  loading();
  const params=new URLSearchParams(location.search),workspaceId=String(params.get('nxoWorkspace')||'').trim();
  if(!workspaceId)throw new Error(ui('No se indicó el espacio de trabajo.','Workspace was not specified.'));
  const boot=await waitBoot();accessStage='EXCHANGE';stripBoot();
  const ex=await api('exchange',{bootToken:boot});sessionToken=ex.sessionToken||'';if(!sessionToken)throw accessError('NO_SESSION_TOKEN');
  accessStage='WORKSPACE';workspace=await api('workspace.open',{workspaceId});
  const tool=(workspace?.tools||[]).find(t=>String(t.toolKey||'')==='schedules');
  if(!tool)throw new Error(ui('Horarios no está instalado o no tienes acceso a esta herramienta en este espacio de trabajo.','Schedule is not installed or you do not have access to this tool in this Workspace.'));
  document.title=ui('Horarios · Nexo','Schedule · Nexo');
  renderAppShell()
 }catch(e){errorView(e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();