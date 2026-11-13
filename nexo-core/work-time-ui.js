/* Nexo Group · Horas de trabajo · Fase 2: sugerencias de marcación
   Usa los motores existentes y la misma clave local. Sin cambios de autenticación.
*/
(function(){
'use strict';
const APP_VERSION="20261113-phase2-1";
const ROOT_ID='nxo-work-time-app';
if(!decodeURIComponent(location.pathname).replace(/\/+$/,'').endsWith('/blank-2'))return;
if(window.__nexoWorkTimeApp&&window.__nexoWorkTimeVersion===APP_VERSION&&document.getElementById(ROOT_ID))return;
const prior=document.getElementById(ROOT_ID);
if(prior)prior.remove();
const host=document.createElement('section');
host.id=ROOT_ID;
host.setAttribute('aria-label','Horas de trabajo · Nexo Group');
host.style.cssText='position:fixed;inset:0;width:100%;height:100dvh;z-index:2147483100;overflow-y:auto;overscroll-behavior:contain;background:#121316;color:#f7f8fb;isolation:isolate';
const uiRoot=host.attachShadow({mode:'open'});
const style=document.createElement('style');
style.textContent="\n:host{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#f7f8fb;color-scheme:dark;--line:rgba(235,240,247,.42)}\n*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;background:#121316}\n.wt-app{min-height:100dvh;position:relative;isolation:isolate;overflow:hidden;background:radial-gradient(ellipse at 58% 112%,#75767d3b,transparent 63%),linear-gradient(150deg,#08090b 1%,#202124 58%,#37383d 100%);color:#f7f8fb}\n.ambient{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;mask-image:linear-gradient(to top,#000 18%,#000 53%,#0005 98%)}\n.bubble{position:absolute;left:var(--x);bottom:-18%;width:var(--dim);height:var(--dim);border-radius:50%;background:radial-gradient(circle at 35% 28%,#edf1f64d,#b7bec41d 51%,#c4ccd00a 78%);border:1px solid #ffffff1b;box-shadow:0 0 28px #ffffff0e;animation:float-up var(--speed) linear var(--delay) infinite}\n@keyframes float-up{0%{opacity:0;transform:translate3d(0,18vh,0) scale(.7)}12%{opacity:.55}66%{opacity:.3}100%{opacity:.09;transform:translate3d(var(--drift),-125vh,0) scale(1.3)}}\n.shell{max-width:880px;margin:auto;padding:24px clamp(16px,4vw,42px) 70px;position:relative;z-index:1}\n.topbar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:17px;border-bottom:1px solid #ffffff44}\n.brand{border:0;background:transparent;color:#f9f9fa;display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.17em;font-weight:600;cursor:pointer;padding:8px 0}\n.brand-dot{width:9px;height:9px;border-radius:50%;background:#e4e7eb;box-shadow:0 0 16px #edf5ff6b}\n.nav{display:flex;gap:5px}.nav-btn,.back{border:0;background:transparent;color:#f4f5f7;cursor:pointer;min-width:40px;height:40px;border-radius:8px;display:grid;place-items:center}\n.nav-btn:hover,.nav-btn[aria-current=\"page\"],.back:hover{background:#ffffff21}\nsvg{width:21px;height:21px}\n#message{font-size:13px;text-align:center;min-height:24px;padding:10px 2px;color:#e7eaed}\n.view{animation:appear .2s ease}@keyframes appear{from{opacity:.4;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}\n.home{text-align:center;max-width:610px;margin:auto;padding:clamp(30px,8vh,90px) 0 0}\n.eyebrow{font-size:11px;color:#d6d8dd;letter-spacing:.2em;font-weight:600}.dim{color:#b7bcc5}\n.today-date{margin:16px 0 3px;color:#cbd0d8;font-size:clamp(14px,3.5vw,17px);text-transform:capitalize}\n.clock{font-size:clamp(64px,13vw,112px);font-variant-numeric:tabular-nums;letter-spacing:-.065em;line-height:1.19;font-weight:200;text-shadow:0 12px 45px #0009}.seconds{font-size:.27em;color:#b7bcc3;letter-spacing:0;margin-left:8px}\n.last-card{margin:40px auto 22px;text-align:left;max-width:480px;padding:20px 22px;border-top:1px solid var(--line);border-left:1px solid var(--line);border-radius:12px 0 0 0;background:linear-gradient(150deg,#ffffff0b,transparent)}\n.last-line{display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-top:12px}\n.last-line strong{font-size:clamp(23px,6vw,33px);font-weight:350;font-variant-numeric:tabular-nums}\n.last-line span{font-size:14px;color:#e1e4e8;text-align:right}\n.home-status,.hint{font-size:12px;color:#bfc4cd}.home-status{min-height:22px}\n.plus{width:82px;height:82px;border-radius:50%;border:1px solid #ffffffb8;background:#ffffff10;display:grid;place-items:center;margin:37px auto 11px;color:white;cursor:pointer;box-shadow:0 18px 55px #0009;transition:transform .2s,background .2s}\n.plus svg{width:34px;height:34px;stroke-width:1.3}.plus:hover{transform:scale(1.07);background:#ffffff26}.hint{letter-spacing:.14em}\n.section-title{display:flex;align-items:center;gap:12px;margin:27px 0 20px}.section-title h1{font-weight:350;font-size:clamp(24px,5vw,34px);margin:0;letter-spacing:-.04em}\n.panel{padding:18px 20px;margin:15px 0;border-left:1px solid var(--line);border-top:1px solid var(--line);border-radius:12px 0 0 0;background:linear-gradient(140deg,#ffffff0b,#0000000d)}\n.panel h2{font-size:17px;margin:0 0 15px;font-weight:500}.subtle{color:#b8bec6;font-size:13px;line-height:1.65}\nlabel{display:grid;gap:7px;color:#d0d4db;font-size:13px}\ninput,select{font:inherit;width:100%;color:white;background:#222328;border:1px solid #ffffff55;border-radius:6px;padding:9px 11px;min-height:42px}\nbutton{font:inherit}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}\n.btn{cursor:pointer;color:white;border:1px solid #ffffff66;background:#ffffff15;border-radius:7px;padding:9px 13px;min-height:42px}\n.btn:hover{background:#ffffff29}.btn.primary{background:#e6e8ec;color:#101114;border-color:#e6e8ec;font-weight:650}\n.btn.danger{color:#ffdadd;border-color:#e5adb3b0;background:#7b33332e}\nbutton:disabled{opacity:.31;cursor:not-allowed}\n.mark-grid,.fields,.metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.mark-grid{margin:25px 0}.mark{padding:17px;text-align:left;min-height:110px;cursor:pointer;color:white;background:#ffffff0d;border:0;border-top:1px solid #ffffff9a;border-left:1px solid #ffffff9a;border-radius:12px 0 0 0}\n.mark span{display:block;color:#afb6bf;font-size:21px;margin-bottom:22px}.mark:hover:not(:disabled){background:#ffffff23}\n.fields{margin:17px 0}.metrics .metric{padding:16px;border-top:1px solid #ffffff61;border-left:1px solid #ffffff61;border-radius:10px 0 0 0;color:#b7bec7;font-size:12px}\n.metric strong{display:block;color:white;font-weight:400;font-size:24px;margin-top:8px}\n.calendar-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.calendar-head h2{margin:0;text-transform:capitalize}\n.calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin-top:15px}.weekday{text-align:center;color:#bfc4cd;font-size:12px;padding:8px 0}\n.day{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:62px;color:white;border:1px solid #ffffff33;border-radius:5px;background:#ffffff08;cursor:pointer}\n.day small{font-size:10px;color:#c2d2d1}.day.outside{opacity:.2;border:0}.day.selected{border-color:#fff;background:#ffffff26}\n.shift{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid #ffffff32}.shift:last-child{border:0}.shift small{display:block;color:#b8c0ca;margin-top:5px}.empty{padding:17px 0;color:#b5bbc3}\n.table-scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:10px 8px;text-align:left;border-bottom:1px solid #ffffff27;white-space:nowrap}th{color:#bcc2ca;font-weight:500}\nfooter{font-size:11px;text-align:center;color:#969da8;line-height:1.6;padding-top:40px}\n:focus-visible{outline:2px solid #e0e5ed;outline-offset:3px}\n@media(max-width:580px){.shell{padding:15px 16px 60px}.fields,.metrics{grid-template-columns:1fr}.panel{padding:14px}.mark{min-height:98px;padding:13px}.last-card{margin-top:30px}.clock{font-size:clamp(61px,15vw,85px)}.day{min-height:48px}.day small{font-size:8px}.shift{align-items:start;flex-direction:column}}\n@media(prefers-reduced-motion:reduce){.bubble,.view{animation:none}.plus{transition:none}}\n\n/* Fase 2: confirmación contextual sin convertir una visita en una marca obligatoria */\n.mark-stamp{font-size:13px;line-height:1.7;color:#b9bec6;margin:8px 0 0;letter-spacing:.015em}\n.suggest-backdrop{position:fixed;inset:0;z-index:30;background:rgba(6,7,9,.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(9px)}\n.suggest-dialog{width:min(100%,480px);max-height:min(90vh,620px);overflow-y:auto;border-left:1px solid #eff1f3a8;border-top:1px solid #eff1f3a8;border-radius:16px 2px 2px 2px;padding:clamp(22px,5vw,36px);box-shadow:0 26px 90px #000c;background:linear-gradient(145deg,#292a2e,#151618 72%)}\n.suggest-kicker{font-size:11px;letter-spacing:.19em;color:#bfc5cc;font-weight:650}\n.suggest-dialog h2{font-size:clamp(22px,5vw,30px);font-weight:380;line-height:1.27;letter-spacing:-.04em;margin:17px 0 12px;color:#fff}\n.suggest-dialog p{color:#c0c4cb;font-size:14px;line-height:1.6;margin:0}\n.suggest-time{font-size:clamp(38px,11vw,55px);font-variant-numeric:tabular-nums;letter-spacing:-.055em;font-weight:250;margin:23px 0 27px}\n.suggest-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}\n.suggest-actions button{min-width:0;min-height:44px}\n.suggest-actions .primary{grid-column:1/-1;grid-row:1}\n@media(max-width:400px){.suggest-backdrop{padding:12px}.suggest-dialog{padding:23px 18px}.suggest-actions{gap:6px}}\n";
const screen=document.createElement('div');
screen.innerHTML="<div class=\"wt-app\"><div class=\"ambient\" aria-hidden=\"true\"><i class=\"bubble\" style=\"--x:9%;--dim:28px;--speed:22s;--delay:0s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:36%;--dim:45px;--speed:29s;--delay:-11s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:63%;--dim:62px;--speed:36s;--delay:-22s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:90%;--dim:79px;--speed:43s;--delay:-33s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:17%;--dim:31px;--speed:27s;--delay:0s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:44%;--dim:48px;--speed:34s;--delay:-11s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:71%;--dim:65px;--speed:41s;--delay:-22s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:98%;--dim:82px;--speed:25s;--delay:-33s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:25%;--dim:34px;--speed:32s;--delay:0s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:52%;--dim:51px;--speed:39s;--delay:-11s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:79%;--dim:68px;--speed:23s;--delay:-22s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:6%;--dim:85px;--speed:30s;--delay:-33s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:33%;--dim:37px;--speed:37s;--delay:0s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:60%;--dim:54px;--speed:44s;--delay:-11s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:87%;--dim:71px;--speed:28s;--delay:-22s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:14%;--dim:88px;--speed:35s;--delay:-33s;--drift:-12vw\"></i></div>\n<main class=\"shell\">\n<header class=\"topbar\"><button class=\"brand\" type=\"button\" data-nav=\"home\"><span class=\"brand-dot\"></span>NEXO / HORAS</button><nav class=\"nav\" aria-label=\"Secciones\"><button class=\"nav-btn\" type=\"button\" data-nav=\"week\" title=\"Resumen semanal\" aria-label=\"Resumen semanal\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 6h12M9 12h12M9 18h12M3 6h2M3 12h2M3 18h2\"/></svg></button><button class=\"nav-btn\" type=\"button\" data-nav=\"calendar\" title=\"Calendario\" aria-label=\"Calendario\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 3v4M17 3v4M3 10h18\"/></svg></button><button class=\"nav-btn\" type=\"button\" data-nav=\"settings\" title=\"Ajustes\" aria-label=\"Ajustes\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"m10 2-.5 2.2-2 1-2.1-.7-2 3.4L5 9.5v2.5l-1.6 1.5 2 3.4 2.1-.7 2 1L10 20h4l.5-2.8 2-1 2.1.7 2-3.4L19 12V9.5l1.6-1.6-2-3.4-2.1.7-2-1L14 2z\"/></svg></button></nav></header>\n<div id=\"message\" role=\"status\" aria-live=\"polite\"></div>\n<section id=\"view-home\" class=\"view home\">\n<div class=\"eyebrow\">MI JORNADA</div><div id=\"today-date\" class=\"today-date\">—</div><div class=\"clock\"><span id=\"clock-time\">--:--</span><span class=\"seconds\" id=\"clock-seconds\">--</span></div>\n<div class=\"last-card\"><div class=\"eyebrow dim\">ÚLTIMA MARCA</div><div class=\"last-line\"><strong id=\"last-time\">—</strong><span id=\"last-type\">Sin registros</span></div></div>\n<p id=\"home-status\" class=\"home-status\">Sin turno activo</p>\n<button type=\"button\" id=\"open-mark\" class=\"plus\" aria-label=\"Agregar marca\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3v18M3 12h18\"/></svg></button><div class=\"hint\">AGREGAR MARCA</div>\n</section>\n<section class=\"view\" id=\"view-mark\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Nueva marca</h1></div><p class=\"subtle\">Seleccioná el tipo de marca. La hora se registra al confirmar.</p>\n<p id=\"mark-captured-at\" class=\"mark-stamp\" aria-live=\"polite\">Hora de la marca: --:--</p><div class=\"mark-grid\"><button class=\"mark\" type=\"button\" id=\"clock-in\"><span>01</span>Entrada al trabajo</button><button class=\"mark\" type=\"button\" id=\"break-start\"><span>02</span>Inicio de descanso</button><button class=\"mark\" type=\"button\" id=\"break-end\"><span>03</span>Fin de descanso</button><button class=\"mark\" type=\"button\" id=\"clock-out\"><span>04</span>Salida del trabajo</button></div>\n<div class=\"panel\"><p id=\"active-info\" class=\"subtle\">No hay un turno activo.</p></div></section>\n<section class=\"view\" id=\"view-settings\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Ajustes</h1></div><div class=\"panel\"><h2>Lugares de trabajo</h2>\n<label>Perfil laboral<select id=\"profile\"></select></label><div class=\"actions\"><button class=\"btn\" id=\"show-profile\" type=\"button\">+ Agregar lugar</button></div>\n<form id=\"profile-form\" hidden><div class=\"fields\">\n<label>Nombre del perfil<input name=\"name\" required placeholder=\"Trabajo principal\"></label><label>Lugar o empresa<input name=\"place\" required placeholder=\"Hotel / restaurante\"></label>\n<label>Tarifa por hora ($)<input name=\"hourlyRate\" type=\"number\" min=\"0\" step=\".01\" required></label><label>Retención estimada (%)<input name=\"taxPercent\" type=\"number\" min=\"0\" max=\"100\" step=\".01\" value=\"0\"></label>\n<label>Límite semanal (horas)<input name=\"overtimeAfterHours\" type=\"number\" min=\"1\" max=\"168\" value=\"40\" required></label><label>Multiplicador de extras<input name=\"overtimeMultiplier\" type=\"number\" min=\"1\" max=\"10\" step=\".1\" value=\"1.5\" required></label></div>\n<div class=\"actions\"><button class=\"btn primary\" type=\"submit\">Guardar lugar</button><button class=\"btn\" type=\"button\" id=\"cancel-profile\">Cancelar</button></div></form></div>\n<div class=\"panel\"><h2>Resumen del perfil</h2><div class=\"metrics\"><div class=\"metric\">Horas de la semana<strong id=\"weekly-hours\">0 h</strong></div><div class=\"metric\">Ganancia semanal estimada<strong id=\"weekly-pay\">$0.00</strong></div><div class=\"metric\">Horas históricas<strong id=\"total-hours\">0 h</strong></div><div class=\"metric\">Ganancia histórica estimada<strong id=\"total-pay\">$0.00</strong></div></div><p class=\"subtle\">Las ganancias y retenciones son estimaciones; no sustituyen la nómina oficial.</p></div></section>\n<section class=\"view\" id=\"view-calendar\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Calendario</h1></div><div class=\"panel\"><div class=\"calendar-head\"><button class=\"btn\" id=\"prev-month\" type=\"button\" aria-label=\"Mes anterior\">‹</button><h2 id=\"month-label\"></h2><button class=\"btn\" id=\"next-month\" type=\"button\" aria-label=\"Mes siguiente\">›</button></div><div class=\"calendar\" id=\"calendar\"></div></div>\n<div class=\"panel\"><h2 id=\"selected-label\">Jornadas del día</h2><div id=\"shift-list\"></div><div class=\"actions\"><button class=\"btn primary\" id=\"new-shift\" type=\"button\">+ Añadir jornada anterior</button></div>\n<form id=\"shift-form\" hidden><input type=\"hidden\" name=\"id\"><div class=\"fields\"><label>Entrada<input name=\"startedAt\" type=\"datetime-local\" required></label><label>Salida<input name=\"closedAt\" type=\"datetime-local\" required></label><label>Descanso total (minutos)<input name=\"breakMinutes\" type=\"number\" min=\"0\" step=\"1\" value=\"0\" required></label></div><div class=\"actions\"><button class=\"btn primary\" type=\"submit\">Guardar jornada</button><button class=\"btn\" id=\"cancel-shift\" type=\"button\">Cancelar</button></div></form></div></section>\n<section class=\"view\" id=\"view-week\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Marcas de la semana</h1></div><p class=\"subtle\">Resumen preliminar de jornadas. La tabla ampliada para capturas se implementará en la fase 4.</p><div class=\"panel table-scroll\"><table><thead><tr><th>Día</th><th>Entrada</th><th>Salida</th><th>Horas</th></tr></thead><tbody id=\"week-rows\"></tbody></table><p id=\"week-total\" class=\"subtle\"></p></div></section>\n\n<div id=\"suggest-backdrop\" class=\"suggest-backdrop\" hidden>\n  <section class=\"suggest-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"suggest-title\" aria-describedby=\"suggest-description\">\n    <div class=\"suggest-kicker\">SUGERENCIA DE MARCA</div>\n    <h2 id=\"suggest-title\">¿Registrar tu siguiente marca?</h2>\n    <p id=\"suggest-description\">Podés confirmar o continuar sin registrar nada.</p>\n    <div class=\"suggest-time\" id=\"suggest-time\">--:--</div>\n    <div class=\"suggest-actions\">\n      <button class=\"btn\" id=\"suggest-no\" type=\"button\">Ahora no</button>\n      <button class=\"btn\" id=\"suggest-other\" type=\"button\">Otra marca</button>\n      <button class=\"btn primary\" id=\"suggest-yes\" type=\"button\">Sí, registrar</button>\n    </div>\n  </section>\n</div>\n<footer>Versión de desarrollo: los registros permanecen en este navegador y dispositivo. Aún no existe sincronización por cuenta.</footer>\n</main></div>";
uiRoot.append(style,screen);
document.body.appendChild(host);
try{
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
const $$=query=>uiRoot.querySelectorAll(query);
let state,selectedProfile='',selectedDay=localDate(new Date()),month=selectedDay.slice(0,7);
let capturedMarkAt=null,pendingSuggestion=null,currentView='home',lastHiddenAt=null;
const CAPTURE_WINDOW_MS=5*60*1000;
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
renderCalendar();renderList(sum);renderDashboard();renderWeek();
}

function updateClock(){
 const now=new Date();
 $('today-date').textContent=now.toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 $('clock-time').textContent=now.toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit',hour12:false});
 $('clock-seconds').textContent=String(now.getSeconds()).padStart(2,'0')
}
function renderDashboard(){
 const ev=[];
 for(const shift of state.shifts.filter(x=>x.profileId===selectedProfile)){
   ev.push({time:shift.startedAt,type:'Entrada'});
   for(const b of shift.breaks||[]){ev.push({time:b.startAt,type:'Inicio de descanso'});ev.push({time:b.endAt,type:'Fin de descanso'})}
   if(shift.breakStartedAt!==null)ev.push({time:shift.breakStartedAt,type:'Inicio de descanso'});
   if(shift.closedAt!==null)ev.push({time:shift.closedAt,type:'Salida'});
 }
 ev.sort((a,b)=>b.time-a.time);
 $('last-time').textContent=ev.length?fmt(ev[0].time):'—';
 $('last-type').textContent=ev.length?ev[0].type:'Sin registros';
 const active=E.active(state);
 $('home-status').textContent=active?(active.breakStartedAt===null?'Turno en curso':'En descanso')+' · '+active.place:(state.profiles.length?'Sin turno activo':'Configurá un lugar de trabajo en ajustes');
 updateClock()
}
function renderWeek(){
 const box=$('week-rows');box.replaceChildren();
 const p=profile(),now=Date.now();
 const monday=new Date();monday.setHours(12,0,0,0);monday.setDate(monday.getDate()-(monday.getDay()+6)%7);
 let total=0;
 for(let i=0;i<7;i++){
   const date=new Date(monday);date.setDate(monday.getDate()+i);
   const day=localDate(date);
   const shifts=state.shifts.filter(s=>p&&s.profileId===p.id&&localDate(s.startedAt)===day&&P.weekKey(s.startedAt,p.timeZone,p.weekStartDay)===P.weekKey(now,p.timeZone,p.weekStartDay));
   const ms=shifts.reduce((n,s)=>n+duration(s),0);total+=ms;
   const row=document.createElement('tr');
   const fields=[date.toLocaleDateString('es',{weekday:'short',day:'numeric'}),shifts.length?fmt(Math.min(...shifts.map(s=>s.startedAt))):'—',shifts.length?(shifts.some(s=>s.closedAt===null)?'En curso':fmt(Math.max(...shifts.map(s=>s.closedAt)))):'—',shifts.length?hours(ms):'—'];
   for(const value of fields){const td=document.createElement('td');td.textContent=value;row.append(td)}
   box.append(row);
 }
 $('week-total').textContent='Total de la semana: '+hours(total)
}
function showView(view){
 currentView=view;
 for(const name of ['home','mark','settings','calendar','week'])$('view-'+name).hidden=name!==view;
 for(const button of $$('[data-nav]'))button.setAttribute('aria-current',button.dataset.nav===view?'page':'false')
}


function suggestNextMark(snapshot,profileId,at=Date.now()){
 if(!snapshot.profiles.some(p=>p.id===profileId))return null;
 const active=E.active(snapshot);
 if(active){
  if(active.profileId!==profileId||at<active.startedAt||at-active.startedAt>24*3600000)return null;
  if(active.breakStartedAt!==null)return {type:E.TYPES.BREAK_END,title:'¿Terminaste tu descanso?',detail:'Registraremos el regreso al trabajo.'};
  if((active.breaks||[]).length)return {type:E.TYPES.END,title:'¿Terminaste tu jornada?',detail:'Registraremos la salida del trabajo.'};
  return {type:E.TYPES.BREAK_START,title:'¿Vas a iniciar tu descanso?',detail:'Registraremos el comienzo de tu break.'};
 }
 if(snapshot.shifts.some(s=>s.profileId===profileId&&localDate(s.startedAt)===localDate(at)))return null;
 return {type:E.TYPES.START,title:'¿Registrar tu entrada al trabajo?',detail:'Es tu primera marca de esta jornada.'};
}
function closeSuggestion(focus=true){
 pendingSuggestion=null;
 $('suggest-backdrop').hidden=true;
 if(focus&&currentView==='home')$('open-mark').focus()
}
function proposeNextMark(){
 if(currentView!=='home'||!$('suggest-backdrop').hidden)return;
 const at=Date.now(),next=suggestNextMark(state,selectedProfile,at);
 if(!next)return;
 pendingSuggestion={...next,at,profileId:selectedProfile,activeId:E.active(state)?.id??null};
 $('suggest-title').textContent=next.title;
 $('suggest-description').textContent=next.detail+' Podés confirmar o dejarlo para después.';
 $('suggest-time').textContent=fmt(at);
 $('suggest-backdrop').hidden=false;
 $('suggest-yes').focus()
}
function freshState(){
 const raw=localStorage.getItem(KEY);
 if(!raw)throw Error('No se encontraron los datos locales de esta jornada');
 const next=JSON.parse(raw);
 if(next?.schemaVersion!==1||!Array.isArray(next.profiles)||!Array.isArray(next.shifts))throw Error('Los datos locales no tienen el formato esperado');
 state=next;
 const active=E.active(state);
 if(active)selectedProfile=active.profileId;
 else if(!state.profiles.some(p=>p.id===selectedProfile))selectedProfile=state.profiles[0]?.id||''
}
function markAt(type,at){
 freshState();
 const now=Date.now();
 const capturedIsCurrent=Number.isFinite(at)&&at<=now&&now-at<=CAPTURE_WINDOW_MS;
 const when=capturedIsCurrent?at:now;
 const next=type===E.TYPES.START?E.start(state,selectedProfile,when):E.transition(state,type,when);
 save(next);
 capturedMarkAt=null;
 closeSuggestion(false);
 showView('home');
 message((capturedIsCurrent?'Marca registrada a las ':'La hora anterior ya expiró. Registrada al confirmar: ')+fmt(when)+'.')
}
function confirmProposedMark(){
 const proposal=pendingSuggestion;
 if(!proposal)return;
 try{
  freshState();
  const current=suggestNextMark(state,selectedProfile),activeId=E.active(state)?.id??null;
  if(!current||current.type!==proposal.type||activeId!==proposal.activeId||selectedProfile!==proposal.profileId){
   closeSuggestion(false);render();message('La jornada cambió. Revisá la última marca antes de registrar otra.',true);return;
  }
  markAt(proposal.type,proposal.at);
 }catch(e){closeSuggestion(false);render();message(e.message||'No se pudo registrar la sugerencia',true)}
}
function onStorageUpdate(event){
 if(event.key!==KEY)return;
 try{
  if(event.newValue)freshState();
  else {state=E.blank();selectedProfile=''}
  closeSuggestion(false);render();showView('home');message('Jornada actualizada desde otra pestaña.');
 }catch(e){message('No se pudieron leer los cambios de otra pestaña',true)}
}
function onReturnToApp(){
 if(document.visibilityState==='hidden'){lastHiddenAt=Date.now();return}
 if(lastHiddenAt&&Date.now()-lastHiddenAt>=120000&&currentView==='home'&&$('suggest-backdrop').hidden){
  lastHiddenAt=null;
  try{freshState();render();proposeNextMark()}catch(e){message('No se pudo comprobar la siguiente marca',true)}
 }
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
function commitManualMark(type){
 try{markAt(type,capturedMarkAt)}catch(e){render();message(e.message||'No se pudo registrar la marca',true)}
}
$('clock-in').onclick=()=>commitManualMark(E.TYPES.START);
$('break-start').onclick=()=>commitManualMark(E.TYPES.BREAK_START);
$('break-end').onclick=()=>commitManualMark(E.TYPES.BREAK_END);
$('clock-out').onclick=()=>commitManualMark(E.TYPES.END);
$('open-mark').onclick=()=>{
 if(!profile()){showView('settings');$('profile-form').hidden=false;message('Primero agregá un lugar de trabajo.');return}
 capturedMarkAt=Date.now();
 $('mark-captured-at').textContent='Hora capturada: '+fmt(capturedMarkAt);
 message('');showView('mark')
};
$('suggest-yes').onclick=confirmProposedMark;
$('suggest-no').onclick=()=>closeSuggestion();
$('suggest-other').onclick=()=>{
 const at=pendingSuggestion?.at??Date.now();
 closeSuggestion(false);capturedMarkAt=at;
 $('mark-captured-at').textContent='Hora capturada: '+fmt(at);
 message('');showView('mark')
};
for(const button of $$('[data-nav]'))button.onclick=()=>{closeSuggestion(false);message('');showView(button.dataset.nav)};
window.addEventListener('storage',onStorageUpdate);
document.addEventListener('visibilitychange',onReturnToApp);

$('prev-month').onclick=()=>changeMonth(-1);$('next-month').onclick=()=>changeMonth(1);
function changeMonth(step){const [y,m]=month.split('-').map(Number);const d=new Date(y,m-1+step,1);month=localDate(d).slice(0,7);selectedDay=month+'-01';render()}
$('new-shift').onclick=()=>{if(!profile()){message('Primero agrega un lugar de trabajo',true);return}const f=$('shift-form');f.reset();f.hidden=false;f.elements.id.value='';f.elements.startedAt.value=selectedDay+'T09:00';f.elements.closedAt.value=selectedDay+'T17:00';f.elements.breakMinutes.value=0;f.scrollIntoView({behavior:'smooth',block:'nearest'})};
$('cancel-shift').onclick=()=>{$('shift-form').hidden=true};
$('shift-form').onsubmit=e=>{e.preventDefault();guard(()=>{const f=e.currentTarget,p=profile();if(!p)throw Error('Selecciona un perfil');const start=validDate(f.elements.startedAt.value),end=validDate(f.elements.closedAt.value),mins=Number(f.elements.breakMinutes.value);if(end<=start)throw Error('La salida debe ser posterior a la entrada');if(!Number.isInteger(mins)||mins<0||mins*60000>=end-start)throw Error('Descanso inválido');const existingId=f.elements.id.value,old=state.shifts.find(s=>s.id===existingId);if(existingId&&!old)throw Error('La jornada ya no existe');if(old&&old.closedAt===null)throw Error('Finaliza el turno antes de editarlo');const shift={...(old||profileSnapshot(p)),id:old?.id||('manual-'+Date.now()+'-'+Math.random().toString(36).slice(2)),startedAt:start,closedAt:end,breakStartedAt:null,breaks:mins?[{startAt:end-mins*60000,endAt:end}]:[]};const next={...state,shifts:existingId?state.shifts.map(s=>s.id===existingId?shift:s):[...state.shifts,shift]};if(next.shifts.filter(s=>s.closedAt===null).length>1)throw Error('Solo puede haber un turno activo');save(next);f.hidden=true;selectedDay=localDate(start);month=selectedDay.slice(0,7);render()})};
try{state=JSON.parse(localStorage.getItem(KEY)||'null')||E.blank();if(state.schemaVersion!==1||!Array.isArray(state.profiles)||!Array.isArray(state.shifts))throw Error('Formato inválido');selectedProfile=E.active(state)?.profileId||state.profiles[0]?.id||'';render();showView('home');proposeNextMark()}
catch(err){state=E.blank();render();showView('home');message('No se pudieron cargar los datos locales: '+err.message,true)}
const clockTimer=setInterval(()=>{
 if(typeof uiRoot!=='undefined'&&!uiRoot.host?.isConnected){
  clearInterval(clockTimer);
  window.removeEventListener('storage',onStorageUpdate);
  document.removeEventListener('visibilitychange',onReturnToApp);
  return
 }
 updateClock()
},1000);
})();
window.__nexoWorkTimeApp=true;
window.__nexoWorkTimeVersion=APP_VERSION;
}catch(error){
window.__nexoWorkTimeApp=false;
const status=uiRoot.getElementById('message');
if(status){status.textContent='No se pudo iniciar Horas de trabajo: '+(error?.message||String(error));status.style.color='#ffbfc5'}
}
})();