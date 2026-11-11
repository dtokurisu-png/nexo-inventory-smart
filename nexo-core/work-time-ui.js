/* Nexo Group · Control de horas
   Módulo Wix único: carga mediante el Embed compartido de Nexo.
   Fuente canónica: apps/personal/work-time; espejo público: nexo-core/work-time-ui.js.
   Prototipo: persistencia local por dispositivo; sin sincronización por miembro.
*/
(function(){
'use strict';
const APP_VERSION="20261111-canonical-1";
const ROOT_ID='nxo-work-time-app';
if(!decodeURIComponent(location.pathname).replace(/\/+$/,'').endsWith('/blank-2'))return;
if(window.__nexoWorkTimeApp&&window.__nexoWorkTimeVersion===APP_VERSION&&document.getElementById(ROOT_ID))return;
const prior=document.getElementById(ROOT_ID);
if(prior)prior.remove();
const host=document.createElement('section');
host.id=ROOT_ID;
host.setAttribute('aria-label','Control de horas · Nexo Group');
host.style.cssText='position:fixed;inset:0;width:100%;height:100dvh;z-index:2147483100;overflow-y:auto;overscroll-behavior:contain;background:#071819;color:#e9f6f5;isolation:isolate';
const uiRoot=host.attachShadow({mode:'open'});
const style=document.createElement('style');
style.textContent="\n:host{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#e9f6f5;background:#071819;color-scheme:dark;--accent:#00ffdf}\n*{box-sizing:border-box}main{max-width:1080px;margin:auto;padding:24px 15px 70px}h1{margin:5px 0;font-size:clamp(25px,5vw,38px)}h2{font-size:19px;margin:0 0 15px}p,.muted{color:#a9c3c1}header{margin-bottom:26px}.tag{color:var(--accent);font-size:12px;letter-spacing:.15em;text-transform:uppercase}\n.panel{background:#102729;border:1px solid #285051;border-radius:16px;padding:18px;margin:14px 0} .layout{display:grid;grid-template-columns:1fr 1fr;gap:14px}.wide{grid-column:1/-1}\nlabel{font-size:13px;color:#bcd9d5;display:grid;gap:5px}input,select,button{font:inherit;border-radius:9px;min-height:42px}input,select{width:100%;background:#081a1c;border:1px solid #376062;color:white;padding:9px}button{border:1px solid #41716e;background:#173c3d;color:#f1fffd;padding:9px 14px;cursor:pointer}button.primary{background:#00cdb3;color:#05231e;font-weight:700;border-color:#00cdb3}button.danger{border-color:#a85e60;color:#ffc5c5;background:#4a2528}button:disabled{opacity:.4;cursor:default}\n.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.metric{padding:14px;border:1px solid #315354;border-radius:12px}.metric strong{display:block;font-size:22px;margin-top:5px;color:#fff}\n.calendar-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin-top:12px}.weekday{text-align:center;color:#a2bdb9;font-size:12px;padding:6px 0}.day{min-height:64px;padding:8px 3px;display:flex;align-items:center;flex-direction:column;justify-content:center;gap:5px}.day small{color:#6ff9df;font-size:10px}.day.selected{outline:2px solid var(--accent)}.day.outside{opacity:.25}\n.shift{display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #305053;padding:12px 0}.shift:last-child{border:0}.shift small{display:block;color:#b9d0cd;margin-top:4px}.empty{padding:18px 0;color:#a3bdba}#message{padding:9px 0;min-height:30px;color:#84ffe0}\n@media(max-width:680px){.layout,.grid,.fields{grid-template-columns:1fr}.day{min-height:54px;font-size:13px}main{padding-top:18px}.panel{padding:14px}}\n";
const screen=document.createElement('div');
screen.innerHTML="<main><header><div class=\"tag\">Nexo Group · Mi Espacio</div><h1>Control de horas</h1><p>Tu registro personal de jornadas y ganancias estimadas.</p><div id=\"message\" role=\"status\" aria-live=\"polite\"></div></header>\n<section class=\"layout\">\n<div class=\"panel\"><h2>Lugares de trabajo</h2><label>Perfil laboral<select id=\"profile\"></select></label><div class=\"actions\"><button id=\"show-profile\">+ Agregar lugar</button></div><form id=\"profile-form\" hidden><div class=\"fields\">\n<label>Nombre del perfil<input name=\"name\" required placeholder=\"Trabajo principal\"></label><label>Lugar o empresa<input name=\"place\" required placeholder=\"Hotel / restaurante\"></label>\n<label>Tarifa por hora ($)<input name=\"hourlyRate\" type=\"number\" min=\"0\" step=\".01\" required></label><label>Retención estimada (%)<input name=\"taxPercent\" type=\"number\" min=\"0\" max=\"100\" step=\".01\" value=\"0\"></label>\n<label>Límite semanal (horas)<input name=\"overtimeAfterHours\" type=\"number\" min=\"1\" max=\"168\" value=\"40\" required></label><label>Multiplicador de extras<input name=\"overtimeMultiplier\" type=\"number\" min=\"1\" max=\"10\" step=\".1\" value=\"1.5\" required></label>\n</div><div class=\"actions\"><button class=\"primary\" type=\"submit\">Guardar lugar</button><button type=\"button\" id=\"cancel-profile\">Cancelar</button></div></form></div>\n<div class=\"panel\"><h2>Turno actual</h2><div id=\"active-info\" class=\"muted\">No hay un turno activo.</div><div class=\"actions\"><button class=\"primary\" id=\"clock-in\">Iniciar turno</button><button id=\"break-start\">Iniciar descanso</button><button id=\"break-end\">Terminar descanso</button><button id=\"clock-out\">Finalizar turno</button></div></div>\n<div class=\"panel wide\"><h2>Resumen del perfil</h2><div class=\"grid\"><div class=\"metric\">Horas de la semana<strong id=\"weekly-hours\">0 h</strong></div><div class=\"metric\">Ganancia estimada de la semana<strong id=\"weekly-pay\">$0.00</strong></div><div class=\"metric\">Horas históricas<strong id=\"total-hours\">0 h</strong></div><div class=\"metric\">Ganancia histórica neta estimada<strong id=\"total-pay\">$0.00</strong></div></div><p class=\"muted\">Los pagos, horas extra y retenciones son estimaciones; no reemplazan la nómina oficial.</p></div>\n<div class=\"panel\"><div class=\"calendar-head\"><button id=\"prev-month\" aria-label=\"Mes anterior\">‹</button><h2 id=\"month-label\"></h2><button id=\"next-month\" aria-label=\"Mes siguiente\">›</button></div><div class=\"calendar\" id=\"calendar\"></div></div>\n<div class=\"panel\"><h2 id=\"selected-label\">Jornadas del día</h2><div id=\"shift-list\"></div><div class=\"actions\"><button class=\"primary\" id=\"new-shift\">+ Añadir jornada anterior</button></div><form id=\"shift-form\" hidden><input type=\"hidden\" name=\"id\"><div class=\"fields\"><label>Entrada<input name=\"startedAt\" type=\"datetime-local\" required></label><label>Salida<input name=\"closedAt\" type=\"datetime-local\" required></label><label>Descanso total (minutos)<input name=\"breakMinutes\" type=\"number\" min=\"0\" step=\"1\" value=\"0\" required></label></div><div class=\"actions\"><button class=\"primary\" type=\"submit\">Guardar jornada</button><button type=\"button\" id=\"cancel-shift\">Cancelar</button></div></form></div>\n</section><p class=\"muted\">Versión de desarrollo: los registros se guardan únicamente en este navegador y dispositivo. Aún no hay sincronización con tu cuenta Nexo.</p></main>\n";
uiRoot.append(style,screen);
document.body.appendChild(host);
try {
/* Control de horas — motor puro, sin acceso a autenticación/Wix.
   Persistencia: el host proporciona un adapter load/save con identidad aislada. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NexoWorkTime=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const STATES=Object.freeze({IDLE:'IDLE',WORKING:'WORKING',BREAK:'BREAK'});
const TYPES=Object.freeze({START:'START',BREAK_START:'BREAK_START',BREAK_END:'BREAK_END',END:'END'});
function error(msg){throw new Error(msg)}
function requireText(v,label){const s=String(v??'').trim();if(!s)error(label+' requerido');return s}
function moneyCents(v){const n=Number(v);if(!Number.isFinite(n)||n<0)error('Importe inválido');return Math.round((n+Number.EPSILON)*100)}
function percentBasis(v){const n=Number(v??0);if(!Number.isFinite(n)||n<0||n>100)error('Porcentaje inválido');return Math.round(n*100)}
function stamp(v){const n=typeof v==='number'?v:Date.parse(v);if(!Number.isFinite(n))error('Fecha inválida');return n}
function id(){if(typeof crypto!=='undefined'&&crypto.randomUUID)return crypto.randomUUID();return 'wt-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}
function blank(){return {schemaVersion:1,profiles:[],shifts:[]}}
function active(state){return state.shifts.find(s=>s.closedAt===null)||null}
function stateOf(shift){if(!shift)return STATES.IDLE;return shift.breakStartedAt===null?STATES.WORKING:STATES.BREAK}
function duration(shift,now){const end=shift.closedAt??stamp(now);if(end<shift.startedAt)error('Fin anterior a inicio');let paused=shift.breaks.reduce((n,b)=>n+(b.endAt-b.startAt),0);if(shift.breakStartedAt!==null)paused+=Math.max(0,end-shift.breakStartedAt);return Math.max(0,end-shift.startedAt-paused)}
function summary(shift,now){const ms=duration(shift,now);const gross=Math.round(ms*shift.rateCents/3600000);const tax=Math.round(gross*shift.taxBasisPoints/10000);return {state:stateOf(shift),workedMilliseconds:ms,workedHours:ms/3600000,grossCents:gross,taxCents:tax,netCents:gross-tax}}
function validate(state){if(!state||state.schemaVersion!==1||!Array.isArray(state.profiles)||!Array.isArray(state.shifts))error('Datos incompatibles');if(state.shifts.filter(s=>s.closedAt===null).length>1)error('Hay más de un turno activo');return state}
function addProfile(state,input){validate(state);const name=requireText(input.name,'Nombre');const place=requireText(input.place,'Lugar');const threshold=Number(input.overtimeAfterHours??40),multiplier=Number(input.overtimeMultiplier??1.5),weekStart=Number(input.weekStartDay??1);
if(!Number.isFinite(threshold)||threshold<=0||threshold>168)error('Límite semanal inválido');
if(!Number.isFinite(multiplier)||multiplier<1||multiplier>10)error('Multiplicador de overtime inválido');
if(!Number.isInteger(weekStart)||weekStart<0||weekStart>6)error('Inicio de semana inválido');
const timeZone=requireText(input.timeZone??Intl.DateTimeFormat().resolvedOptions().timeZone,'Zona horaria');
try{new Intl.DateTimeFormat('en-US',{timeZone}).format(0)}catch(_){error('Zona horaria inválida')}
const p={id:id(),name,place,rateCents:moneyCents(input.hourlyRate),taxBasisPoints:input.taxEnabled?percentBasis(input.taxPercent):0,
overtimeAfterMilliseconds:threshold*3600000,overtimeMultiplierBasisPoints:Math.round(multiplier*10000),weekStartDay:weekStart,timeZone,createdAt:Date.now()};return {...state,profiles:[...state.profiles,p]}}
function start(state,profileId,at=Date.now()){validate(state);if(active(state))error('Cierra el turno actual antes de abrir otro');const p=state.profiles.find(p=>p.id===profileId);if(!p)error('Perfil no encontrado');const t=stamp(at);const shift={id:id(),profileId:p.id,profileName:p.name,place:p.place,rateCents:p.rateCents,taxBasisPoints:p.taxBasisPoints,overtimeAfterMilliseconds:p.overtimeAfterMilliseconds,overtimeMultiplierBasisPoints:p.overtimeMultiplierBasisPoints,weekStartDay:p.weekStartDay,timeZone:p.timeZone,startedAt:t,closedAt:null,breakStartedAt:null,breaks:[]};return {...state,shifts:[...state.shifts,shift]}}
function transition(state,type,at=Date.now()){validate(state);const s=active(state);if(!s)error('No hay turno activo');const t=stamp(at),last=s.breakStartedAt??(s.breaks.length?s.breaks[s.breaks.length-1].endAt:s.startedAt);if(t<last)error('La marca no puede ser anterior a la última');let updated={...s,breaks:s.breaks.slice()};if(type===TYPES.BREAK_START){if(s.breakStartedAt!==null)error('El descanso ya comenzó');updated.breakStartedAt=t}else if(type===TYPES.BREAK_END){if(s.breakStartedAt===null)error('No hay descanso activo');updated.breaks.push({startAt:s.breakStartedAt,endAt:t});updated.breakStartedAt=null}else if(type===TYPES.END){if(s.breakStartedAt!==null){updated.breaks.push({startAt:s.breakStartedAt,endAt:t});updated.breakStartedAt=null}updated.closedAt=t}else error('Marca inválida');return {...state,shifts:state.shifts.map(x=>x.id===s.id?updated:x)}}
function createStore(adapter){if(!adapter||typeof adapter.load!=='function'||typeof adapter.save!=='function')error('Adapter requerido');return {async read(){return validate((await adapter.load())??blank())},async mutate(fn){const s=await this.read();const next=validate(fn(s));await adapter.save(next);return next}}}
return Object.freeze({STATES,TYPES,blank,active,stateOf,summary,addProfile,start,transition,createStore});
});

/* Deterministic weekly payroll projection. Group by profile ID (one workplace per profile).
   Timestamps are UTC epoch milliseconds; week boundaries are in each profile time zone. */
(function(root,factory){const a=factory();if(typeof module==='object'&&module.exports)module.exports=a;else root.NexoWorkTimePayroll=a;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const HOUR=3600000,DAY=86400000;
function localDay(t,z){const parts=new Intl.DateTimeFormat('en-US',{timeZone:z,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(t);const o=Object.fromEntries(parts.map(x=>[x.type,x.value]));return [Number(o.year),Number(o.month),Number(o.day)]}
function weekKey(t,z,start){const [y,m,d]=localDay(t,z);const date=new Date(Date.UTC(y,m-1,d));const days=(date.getUTCDay()-start+7)%7;date.setUTCDate(date.getUTCDate()-days);return date.toISOString().slice(0,10)}
function intervals(s,now){const end=s.closedAt??now;if(end<s.startedAt)throw Error('Turno con tiempo invertido');const breaks=[...(s.breaks||[])];if(s.breakStartedAt!==null)breaks.push({startAt:s.breakStartedAt,endAt:end});breaks.sort((a,b)=>a.startAt-b.startAt);let cursor=s.startedAt;const out=[];for(const b of breaks){if(b.startAt<cursor||b.endAt<b.startAt||b.endAt>end)throw Error('Descansos inválidos');if(b.startAt>cursor)out.push([cursor,b.startAt]);cursor=b.endAt}if(cursor<end)out.push([cursor,end]);return out}
function nextWeekBoundary(t,z,start,limit){const key=weekKey(t,z,start);let lo=t,hi=Math.min(t+8*DAY,limit);if(weekKey(hi-1,z,start)===key)return limit;while(hi-lo>1){const mid=Math.floor((hi+lo)/2);if(weekKey(mid,z,start)===key)lo=mid;else hi=mid}return hi}
function project(state,now=Date.now()){const groups=new Map(),totals=[];for(const s of [...state.shifts].sort((a,b)=>a.startedAt-b.startedAt)){const z=s.timeZone||'UTC',start=Number.isInteger(s.weekStartDay)?s.weekStartDay:1,threshold=s.overtimeAfterMilliseconds??40*HOUR,mult=s.overtimeMultiplierBasisPoints??15000,rate=s.rateCents;const owner=s.profileId;if(!owner)throw Error('Turno sin perfil');for(const [a,b] of intervals(s,now)){let from=a;while(from<b){const to=nextWeekBoundary(from,z,start,b);const key=owner+'|'+z+'|'+start+'|'+weekKey(from,z,start);const used=groups.get(key)||0;const length=to-from,regular=Math.min(length,Math.max(0,threshold-used)),overtime=length-regular;groups.set(key,used+length);totals.push({shiftId:s.id,profileId:owner,weekStart:weekKey(from,z,start),startAt:from,endAt:to,regularMilliseconds:regular,overtimeMilliseconds:overtime,regularPayCentsUnrounded:regular*rate/HOUR,overtimePayCentsUnrounded:overtime*rate*mult/(HOUR*10000),taxBasisPoints:s.taxBasisPoints??0});from=to}}}
const shiftIds=[...new Set(state.shifts.map(s=>s.id))];const byShift=shiftIds.map(id=>{const segments=totals.filter(v=>v.shiftId===id);const regularMilliseconds=segments.reduce((n,v)=>n+v.regularMilliseconds,0),overtimeMilliseconds=segments.reduce((n,v)=>n+v.overtimeMilliseconds,0),regularPayCents=Math.round(segments.reduce((n,v)=>n+v.regularPayCentsUnrounded,0)),overtimePayCents=Math.round(segments.reduce((n,v)=>n+v.overtimePayCentsUnrounded,0));const grossCents=regularPayCents+overtimePayCents,rate=segments[0]?.taxBasisPoints??0,taxCents=Math.round(grossCents*rate/10000);return {shiftId:id,regularMilliseconds,overtimeMilliseconds,regularPayCents,overtimePayCents,grossCents,taxCents,netCents:grossCents-taxCents}});
return {shifts:byShift,groups:[...groups].map(([key,workedMilliseconds])=>({key,workedMilliseconds}))}}
return Object.freeze({weekKey,project});
});

/* Control de horas — local prototype UI; no auth or Wix integration. */
(() => {
'use strict';
const E=window.NexoWorkTime,P=window.NexoWorkTimePayroll;
const KEY='nexo.personal-work-time.prototype.v1';
const $=id=>uiRoot.getElementById(id);
let state,selectedProfile='',selectedDay=localDate(new Date()),month=selectedDay.slice(0,7);
function localDate(v){const d=new Date(v);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function asInput(t){const d=new Date(t);return localDate(d)+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function fmt(t){return new Date(t).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})}
function hours(ms){return (ms/3600000).toFixed(2)+' h'}
function money(cents){return '$'+(cents/100).toFixed(2)}
function message(msg,bad=false){$('message').textContent=msg;$('message').style.color=bad?'#ffaeae':'#84ffe0'}
function save(next){state=next;localStorage.setItem(KEY,JSON.stringify(state));render()}
function profile(){return state.profiles.find(p=>p.id===selectedProfile)}
function payroll(){return P.project(state)}
function validDate(v){const n=new Date(v).getTime();if(!Number.isFinite(n))throw Error('Fecha u hora inválida');return n}
function duration(s){let pause=s.breaks.reduce((n,b)=>n+(b.endAt-b.startAt),0);if(s.breakStartedAt!==null)pause+=Math.max(0,(s.closedAt??Date.now())-s.breakStartedAt);return Math.max(0,(s.closedAt??Date.now())-s.startedAt-pause)}
function profileSnapshot(p){return {profileId:p.id,profileName:p.name,place:p.place,rateCents:p.rateCents,taxBasisPoints:p.taxBasisPoints,overtimeAfterMilliseconds:p.overtimeAfterMilliseconds,overtimeMultiplierBasisPoints:p.overtimeMultiplierBasisPoints,weekStartDay:p.weekStartDay,timeZone:p.timeZone}}
function selectedShifts(){return state.shifts.filter(s=>s.profileId===selectedProfile&&localDate(s.startedAt)===selectedDay).sort((a,b)=>a.startedAt-b.startedAt)}
function render(){
const p=profile();const a=E.active(state);
$('profile').replaceChildren();
for(const item of state.profiles){const o=document.createElement('option');o.value=item.id;o.textContent=item.name+' · '+item.place;$('profile').append(o)}
$('profile').value=selectedProfile;
$('clock-in').disabled=!p||!!a;$('break-start').disabled=!a||a.breakStartedAt!==null;$('break-end').disabled=!a||a.breakStartedAt===null;$('clock-out').disabled=!a;
$('active-info').textContent=a?('En '+a.place+' · '+(a.breakStartedAt===null?'Trabajando':'En descanso')+' · Inicio '+new Date(a.startedAt).toLocaleString('es')):'No hay un turno activo.';
const calc=payroll(),sum=new Map(calc.shifts.map(x=>[x.shiftId,x]));
const all=state.shifts.filter(s=>s.profileId===selectedProfile),today=Date.now();
const currentWeek=p?P.weekKey(today,p.timeZone,p.weekStartDay):'';
const weekly=all.filter(s=>p&&P.weekKey(s.startedAt,p.timeZone,p.weekStartDay)===currentWeek);
const aggregate=items=>items.reduce((o,s)=>{const pay=sum.get(s.id);o.ms+=duration(s);o.net+=pay?.netCents||0;return o},{ms:0,net:0});
const w=aggregate(weekly),total=aggregate(all);
$('weekly-hours').textContent=hours(w.ms);$('weekly-pay').textContent=money(w.net);$('total-hours').textContent=hours(total.ms);$('total-pay').textContent=money(total.net);
renderCalendar();renderList(sum);
}
function renderCalendar(){
const [year,mo]=month.split('-').map(Number),first=new Date(year,mo-1,1),offset=(first.getDay()+6)%7,days=new Date(year,mo,0).getDate();
$('month-label').textContent=first.toLocaleDateString('es',{month:'long',year:'numeric'});
const box=$('calendar');box.replaceChildren();
for(const label of ['L','M','X','J','V','S','D']){const e=document.createElement('span');e.className='weekday';e.textContent=label;box.append(e)}
for(let k=0;k<offset;k++){const e=document.createElement('span');e.className='day outside';box.append(e)}
for(let n=1;n<=days;n++){const date=month+'-'+String(n).padStart(2,'0'),records=state.shifts.filter(s=>s.profileId===selectedProfile&&localDate(s.startedAt)===date);
const b=document.createElement('button');b.className='day'+(date===selectedDay?' selected':'');b.type='button';
const label=document.createElement('span');label.textContent=n;b.append(label);
if(records.length){const small=document.createElement('small');small.textContent=hours(records.reduce((v,s)=>v+duration(s),0));b.append(small)}
b.onclick=()=>{selectedDay=date;$('shift-form').hidden=true;render()};box.append(b)}
}
function renderList(sums){
$('selected-label').textContent='Jornadas · '+new Date(selectedDay+'T12:00:00').toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'});
const box=$('shift-list');box.replaceChildren();const rows=selectedShifts();
if(!rows.length){const d=document.createElement('div');d.className='empty';d.textContent='No hay jornadas registradas este día.';box.append(d)}
for(const s of rows){const row=document.createElement('div');row.className='shift';const info=document.createElement('div');
const strong=document.createElement('strong');strong.textContent=fmt(s.startedAt)+' – '+(s.closedAt===null?'En curso':fmt(s.closedAt));info.append(strong);
const small=document.createElement('small');small.textContent=hours(duration(s))+' · Neto estimado '+money(sums.get(s.id)?.netCents??0);info.append(small);row.append(info);
const actions=document.createElement('div');actions.className='actions';
if(s.closedAt!==null){const edit=document.createElement('button');edit.textContent='Editar';edit.onclick=()=>editShift(s);actions.append(edit);const del=document.createElement('button');del.className='danger';del.textContent='Eliminar';del.onclick=()=>{if(confirm('¿Eliminar esta jornada?')){save({...state,shifts:state.shifts.filter(x=>x.id!==s.id)});message('Jornada eliminada.')}};actions.append(del)}
row.append(actions);box.append(row)}
}
function editShift(s){const f=$('shift-form');f.hidden=false;f.elements.id.value=s.id;f.elements.startedAt.value=asInput(s.startedAt);f.elements.closedAt.value=asInput(s.closedAt);f.elements.breakMinutes.value=s.breaks.reduce((n,b)=>n+(b.endAt-b.startAt),0)/60000;f.scrollIntoView({behavior:'smooth',block:'nearest'})}
function guard(fn){try{fn();message('Cambios guardados.')}catch(e){message(e.message||'No se pudo guardar',true)}}
$('show-profile').onclick=()=>{$('profile-form').hidden=false};
$('cancel-profile').onclick=()=>{$('profile-form').hidden=true};
$('profile-form').onsubmit=e=>{e.preventDefault();guard(()=>{const f=e.currentTarget,fd=new FormData(f);const next=E.addProfile(state,{name:fd.get('name'),place:fd.get('place'),hourlyRate:fd.get('hourlyRate'),taxEnabled:Number(fd.get('taxPercent'))>0,taxPercent:fd.get('taxPercent'),overtimeAfterHours:fd.get('overtimeAfterHours'),overtimeMultiplier:fd.get('overtimeMultiplier')});selectedProfile=next.profiles[next.profiles.length-1].id;save(next);f.reset();f.hidden=true})};
$('profile').onchange=e=>{selectedProfile=e.target.value;render()};
$('clock-in').onclick=()=>guard(()=>save(E.start(state,selectedProfile)));
$('break-start').onclick=()=>guard(()=>save(E.transition(state,E.TYPES.BREAK_START)));
$('break-end').onclick=()=>guard(()=>save(E.transition(state,E.TYPES.BREAK_END)));
$('clock-out').onclick=()=>guard(()=>save(E.transition(state,E.TYPES.END)));
$('prev-month').onclick=()=>changeMonth(-1);$('next-month').onclick=()=>changeMonth(1);
function changeMonth(step){const [y,m]=month.split('-').map(Number);const d=new Date(y,m-1+step,1);month=localDate(d).slice(0,7);selectedDay=month+'-01';render()}
$('new-shift').onclick=()=>{if(!profile()){message('Primero agrega un lugar de trabajo',true);return}const f=$('shift-form');f.reset();f.hidden=false;f.elements.id.value='';f.elements.startedAt.value=selectedDay+'T09:00';f.elements.closedAt.value=selectedDay+'T17:00';f.elements.breakMinutes.value=0;f.scrollIntoView({behavior:'smooth',block:'nearest'})};
$('cancel-shift').onclick=()=>{$('shift-form').hidden=true};
$('shift-form').onsubmit=e=>{e.preventDefault();guard(()=>{const f=e.currentTarget,p=profile();if(!p)throw Error('Selecciona un perfil');const start=validDate(f.elements.startedAt.value),end=validDate(f.elements.closedAt.value),mins=Number(f.elements.breakMinutes.value);if(end<=start)throw Error('La salida debe ser posterior a la entrada');if(!Number.isInteger(mins)||mins<0||mins*60000>=end-start)throw Error('Descanso inválido');const existingId=f.elements.id.value,old=state.shifts.find(s=>s.id===existingId);if(existingId&&!old)throw Error('La jornada ya no existe');if(old&&old.closedAt===null)throw Error('Finaliza el turno antes de editarlo');const shift={...(old||profileSnapshot(p)),id:old?.id||('manual-'+Date.now()+'-'+Math.random().toString(36).slice(2)),startedAt:start,closedAt:end,breakStartedAt:null,breaks:mins?[{startAt:end-mins*60000,endAt:end}]:[]};const next={...state,shifts:existingId?state.shifts.map(s=>s.id===existingId?shift:s):[...state.shifts,shift]};if(next.shifts.filter(s=>s.closedAt===null).length>1)throw Error('Solo puede haber un turno activo');save(next);f.hidden=true;selectedDay=localDate(start);month=selectedDay.slice(0,7);render()})};
try{state=JSON.parse(localStorage.getItem(KEY)||'null')||E.blank();if(state.schemaVersion!==1||!Array.isArray(state.profiles)||!Array.isArray(state.shifts))throw Error('Formato inválido');selectedProfile=state.profiles[0]?.id||'';render()}
catch(err){state=E.blank();render();message('No se pudieron cargar los datos locales: '+err.message,true)}
})();
window.__nexoWorkTimeApp=true;
window.__nexoWorkTimeVersion=APP_VERSION;
} catch(error) {
window.__nexoWorkTimeApp=false;
const status=uiRoot.getElementById('message');
if(status){status.textContent='No se pudo iniciar el registro de horas: '+(error?.message||String(error));status.style.color='#ffaeae';}
}
})();
