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
