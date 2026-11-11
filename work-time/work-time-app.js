/* Control de horas — local prototype UI; no auth or Wix integration. */
(() => {
'use strict';
const E=window.NexoWorkTime,P=window.NexoWorkTimePayroll;
const KEY='nexo.personal-work-time.prototype.v1';
const $=id=>document.getElementById(id);
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