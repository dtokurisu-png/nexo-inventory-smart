/* Nexo Group / Horas - map picker v3, manual opt-in geo naming via Photon demo */
(function(){
'use strict';
const APP_VERSION="20261113-phase5-map-9";
const ROOT_ID='nxo-work-time-app';
if(!decodeURIComponent(location.pathname).replace(/\/+$/,'').endsWith('/blank-2'))return;
if(window.__nexoWorkTimeApp&&window.__nexoWorkTimeVersion===APP_VERSION&&document.getElementById(ROOT_ID))return;
const prior=document.getElementById(ROOT_ID);if(prior)prior.remove();
const host=document.createElement('section');host.id=ROOT_ID;
host.setAttribute('aria-label','Horas de trabajo · Nexo Group');
host.style.cssText='position:fixed;inset:0;width:100%;height:100dvh;z-index:2147483100;overflow-y:auto;overscroll-behavior:contain;background:#121316;color:#f7f8fb;isolation:isolate';
const uiRoot=host.attachShadow({mode:'open'}),style=document.createElement('style');
style.textContent="\n:host{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#f7f8fb;color-scheme:dark;--line:rgba(235,240,247,.42)}\n*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;background:#121316}\n.wt-app{min-height:100dvh;position:relative;isolation:isolate;overflow:hidden;background:radial-gradient(ellipse at 58% 112%,#75767d3b,transparent 63%),linear-gradient(150deg,#08090b 1%,#202124 58%,#37383d 100%);color:#f7f8fb}\n.ambient{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;mask-image:linear-gradient(to top,#000 18%,#000 53%,#0005 98%)}\n.bubble{position:absolute;left:var(--x);bottom:-18%;width:var(--dim);height:var(--dim);border-radius:50%;background:radial-gradient(circle at 35% 28%,#edf1f64d,#b7bec41d 51%,#c4ccd00a 78%);border:1px solid #ffffff1b;box-shadow:0 0 28px #ffffff0e;animation:float-up var(--speed) linear var(--delay) infinite}\n@keyframes float-up{0%{opacity:0;transform:translate3d(0,18vh,0) scale(.7)}12%{opacity:.55}66%{opacity:.3}100%{opacity:.09;transform:translate3d(var(--drift),-125vh,0) scale(1.3)}}\n.shell{max-width:880px;margin:auto;padding:24px clamp(16px,4vw,42px) 70px;position:relative;z-index:1}\n.topbar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:17px;border-bottom:1px solid #ffffff44}\n.brand{border:0;background:transparent;color:#f9f9fa;display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.17em;font-weight:600;cursor:pointer;padding:8px 0}\n.brand-dot{width:9px;height:9px;border-radius:50%;background:#e4e7eb;box-shadow:0 0 16px #edf5ff6b}\n.nav{display:flex;gap:5px}.nav-btn,.back{border:0;background:transparent;color:#f4f5f7;cursor:pointer;min-width:40px;height:40px;border-radius:8px;display:grid;place-items:center}\n.nav-btn:hover,.nav-btn[aria-current=\"page\"],.back:hover{background:#ffffff21}\nsvg{width:21px;height:21px}\n#message{font-size:13px;text-align:center;min-height:24px;padding:10px 2px;color:#e7eaed}\n.view{animation:appear .2s ease}@keyframes appear{from{opacity:.4;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}\n.home{text-align:center;max-width:610px;margin:auto;padding:clamp(30px,8vh,90px) 0 0}\n.eyebrow{font-size:11px;color:#d6d8dd;letter-spacing:.2em;font-weight:600}.dim{color:#b7bcc5}\n.week-close-banner{margin:10px auto 2px;padding:0;max-width:480px;background:transparent;border:0;color:#f7f8fb;text-align:center}\n.week-close-banner strong{display:block;font-size:11px;letter-spacing:.14em;font-weight:600}\n\n.profile-week-close-controls{display:flex;gap:8px;align-items:end;flex-wrap:wrap;margin-top:12px}\n.profile-week-close-controls label{flex:1 1 190px}.profile-week-close-controls button{flex:0 1 auto}\n.profile-week-close-note{margin:9px 0 0;color:#aeb9c1;font-size:12px;line-height:1.5}\n.today-date{margin:16px 0 3px;color:#cbd0d8;font-size:clamp(14px,3.5vw,17px);text-transform:capitalize}\n.clock{font-size:clamp(64px,13vw,112px);font-variant-numeric:tabular-nums;letter-spacing:-.065em;line-height:1.19;font-weight:200;text-shadow:0 12px 45px #0009}.seconds{font-size:.27em;color:#b7bcc3;letter-spacing:0;margin-left:8px}\n.last-card{margin:40px auto 11px;text-align:left;max-width:480px;padding:20px 22px;border-top:1px solid var(--line);border-left:1px solid var(--line);border-radius:12px 0 0 0;background:linear-gradient(150deg,#ffffff0b,transparent)}\n.last-line{display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-top:12px}\n.last-line strong{font-size:clamp(23px,6vw,33px);font-weight:350;font-variant-numeric:tabular-nums}\n.last-line span{font-size:14px;color:#e1e4e8;text-align:right}\n.home-status,.hint{font-size:12px;color:#bfc4cd}.home-status{min-height:22px}\n.plus{width:82px;height:82px;border-radius:50%;border:1px solid #ffffffb8;background:#ffffff10;display:grid;place-items:center;margin:37px auto 11px;color:white;cursor:pointer;box-shadow:0 18px 55px #0009;transition:transform .2s,background .2s}\n.plus svg{width:34px;height:34px;stroke-width:1.3}.plus:hover{transform:scale(1.07);background:#ffffff26}.hint{letter-spacing:.14em}\n.home-pay-inline{max-width:480px;margin:0 auto 13px;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:0 4px;color:#d1d4db;font-size:13px;font-variant-numeric:tabular-nums}\n.home-pay-inline span{display:inline-flex;align-items:baseline;gap:8px;white-space:nowrap}\n.home-pay-inline strong{color:#fff;font-size:16px;font-weight:500}\n.section-title{display:flex;align-items:center;gap:12px;margin:27px 0 20px}.section-title h1{font-weight:350;font-size:clamp(24px,5vw,34px);margin:0;letter-spacing:-.04em}\n.panel{padding:18px 20px;margin:15px 0;border-left:1px solid var(--line);border-top:1px solid var(--line);border-radius:12px 0 0 0;background:linear-gradient(140deg,#ffffff0b,#0000000d)}\n.panel h2{font-size:17px;margin:0 0 15px;font-weight:500}.subtle{color:#b8bec6;font-size:13px;line-height:1.65}\nlabel{display:grid;gap:7px;color:#d0d4db;font-size:13px}\ninput,select{font:inherit;width:100%;color:white;background:#222328;border:1px solid #ffffff55;border-radius:6px;padding:9px 11px;min-height:42px}\nbutton{font:inherit}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}\n.btn{cursor:pointer;color:white;border:1px solid #ffffff66;background:#ffffff15;border-radius:7px;padding:9px 13px;min-height:42px}\n.btn:hover{background:#ffffff29}.btn.primary{background:#e6e8ec;color:#101114;border-color:#e6e8ec;font-weight:650}\n.btn.danger{color:#ffdadd;border-color:#e5adb3b0;background:#7b33332e}\nbutton:disabled{opacity:.31;cursor:not-allowed}\n.mark-grid,.fields,.metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.mark-grid{margin:25px 0}.mark{padding:17px;text-align:left;min-height:110px;cursor:pointer;color:white;background:#ffffff0d;border:0;border-top:1px solid #ffffff9a;border-left:1px solid #ffffff9a;border-radius:12px 0 0 0}\n.mark span{display:block;color:#afb6bf;font-size:21px;margin-bottom:22px}.mark:hover:not(:disabled){background:#ffffff23}\n.fields{margin:17px 0}.metrics .metric{padding:16px;border-top:1px solid #ffffff61;border-left:1px solid #ffffff61;border-radius:10px 0 0 0;color:#b7bec7;font-size:12px}\n.metric strong{display:block;color:white;font-weight:400;font-size:24px;margin-top:8px}\n.calendar-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.calendar-head h2{margin:0;text-transform:capitalize}\n.calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin-top:15px}.weekday{text-align:center;color:#bfc4cd;font-size:12px;padding:8px 0}\n.day{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:62px;color:white;border:1px solid #ffffff33;border-radius:5px;background:#ffffff08;cursor:pointer}\n.day small{font-size:10px;color:#c2d2d1}.day.outside{opacity:.2;border:0}.day.selected{border-color:#fff;background:#ffffff26}\n.shift{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid #ffffff32}.shift:last-child{border:0}.shift small{display:block;color:#b8c0ca;margin-top:5px}.empty{padding:17px 0;color:#b5bbc3}\n.table-scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:10px 8px;text-align:left;border-bottom:1px solid #ffffff27;white-space:nowrap}th{color:#bcc2ca;font-weight:500}\nfooter{font-size:11px;text-align:center;color:#969da8;line-height:1.6;padding-top:40px}\n:focus-visible{outline:2px solid #e0e5ed;outline-offset:3px}\n@media(max-width:580px){.shell{padding:15px 16px 60px}.fields,.metrics{grid-template-columns:1fr}.panel{padding:14px}.mark{min-height:98px;padding:13px}.last-card{margin-top:30px}.clock{font-size:clamp(61px,15vw,85px)}.day{min-height:48px}.day small{font-size:8px}.shift{align-items:start;flex-direction:column}}\n@media(prefers-reduced-motion:reduce){.bubble,.view{animation:none}.plus{transition:none}}\n\n/* Fase 2: confirmación contextual sin convertir una visita en una marca obligatoria */\n.mark-stamp{font-size:13px;line-height:1.7;color:#b9bec6;margin:8px 0 0;letter-spacing:.015em}\n.suggest-backdrop{position:fixed;inset:0;z-index:30;background:rgba(6,7,9,.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(9px)}\n.suggest-dialog{width:min(100%,480px);max-height:min(90vh,620px);overflow-y:auto;border-left:1px solid #eff1f3a8;border-top:1px solid #eff1f3a8;border-radius:16px 2px 2px 2px;padding:clamp(22px,5vw,36px);box-shadow:0 26px 90px #000c;background:linear-gradient(145deg,#292a2e,#151618 72%)}\n.suggest-kicker{font-size:11px;letter-spacing:.19em;color:#bfc5cc;font-weight:650}\n.suggest-dialog h2{font-size:clamp(22px,5vw,30px);font-weight:380;line-height:1.27;letter-spacing:-.04em;margin:17px 0 12px;color:#fff}\n.suggest-dialog p{color:#c0c4cb;font-size:14px;line-height:1.6;margin:0}\n.suggest-time{font-size:clamp(38px,11vw,55px);font-variant-numeric:tabular-nums;letter-spacing:-.055em;font-weight:250;margin:23px 0 27px}\n.suggest-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}\n.suggest-actions button{min-width:0;min-height:44px}\n.suggest-actions .primary{grid-column:1/-1;grid-row:1}\n@media(max-width:400px){.suggest-backdrop{padding:12px}.suggest-dialog{padding:23px 18px}.suggest-actions{gap:6px}}\n\n/* Fase 3 · estimaciones de regreso del descanso, verificables y reversibles */\n.break-settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}\n.break-toggle{display:flex;gap:10px;align-items:flex-start;line-height:1.55;color:#eceef0}\n.break-toggle input{width:19px;min-height:19px;height:19px;flex:0 0 19px;accent-color:#f1f2f4;margin-top:2px}\n.break-toggle span{font-size:13px}\n.break-explainer{font-size:12px;line-height:1.65;color:#adb3be}\n.provisional-panel{text-align:left;max-width:530px;margin:23px auto 0;border-top:1px solid #e6e9efaa;border-left:1px solid #e6e9efaa;border-radius:13px 0 0;padding:16px;background:#ffffff10}\n.provisional-panel h2{font-size:14px;color:#f4f5f7;font-weight:550;letter-spacing:.02em;margin:0 0 8px}\n.provisional-panel .provisional-warning{color:#e0d2bb;font-size:12px;line-height:1.6}\n.provisional-panel .provisional-time{font-size:23px;font-weight:350;margin:11px 0 5px;font-variant-numeric:tabular-nums}\n.provisional-controls{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px}\n.provisional-controls .btn{min-height:39px;font-size:12px}\n.provisional-edit{display:grid;gap:10px;margin:13px 0 0}\n.provisional-edit .btn{width:fit-content}\n#break-settings-note{min-height:15px}\n@media(max-width:580px){.break-settings-grid{grid-template-columns:1fr}.provisional-controls .btn{flex:1}}\n\n/* Fase 4 · resumen semanal capturable, legible en pantalla móvil */\n.report-view{max-width:940px;margin:0 auto}\n.report-toolbar{display:flex;justify-content:space-between;gap:12px;align-items:end;margin:0 0 17px}\n.report-profile-label{width:min(100%,330px);font-size:12px}\n.report-profile-label select{min-width:0}\n.report-week-navigation{display:flex;gap:6px;align-items:center;white-space:nowrap}\n.report-week-navigation .report-nav{font-size:25px;width:43px;padding:3px 8px}\n.report-current{font-size:12px}\n.report-paper{border-top:1px solid #f3f4f5a8;border-left:1px solid #f3f4f5a8;border-radius:13px 0 0 0;background:linear-gradient(150deg,#ffffff0e,#111215c5);padding:20px 18px 16px}\n.report-header h2{font-size:clamp(20px,4.7vw,28px);margin:10px 0 12px;font-weight:360;letter-spacing:-.035em}\n.report-overline{letter-spacing:.15em;font-size:10px;color:#b6bcc5;font-weight:650}\n.report-overline span{color:#f1f2f5}\n.report-header-bottom{display:flex;justify-content:space-between;gap:9px;font-size:12px;color:#cfd2d7;line-height:1.5;margin-bottom:17px}\n.report-header-bottom span:first-child{font-weight:600;color:#fff}\n.report-scroll{overflow-x:auto}\n.report-table{border-collapse:collapse;width:100%;min-width:0;table-layout:fixed}\n.report-table th,.report-table td{border-bottom:1px solid #e3e6eb29;padding:12px 5px;font-size:clamp(10px,1.4vw,12px);text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums;vertical-align:middle}\n.report-table th:first-child,.report-table td:first-child{text-align:left;width:14%}\n.report-table th:nth-child(2),.report-table th:nth-child(3),.report-table th:nth-child(4),.report-table th:nth-child(5){width:13%}\n.report-table th:nth-child(6){width:14%}\n.report-table th:nth-child(7){width:20%}\n.report-table thead th{font-weight:550;color:#d0d4dc;border-bottom:1px solid #ffffff6a}\n.report-table tbody tr:nth-child(even){background:#ffffff07}\n.report-table tbody tr.current-day{background:#ffffff18}\n.report-table .week-day-button{padding:3px 0;background:transparent;border:0;color:inherit;text-align:left;cursor:pointer;font:inherit;text-decoration:underline;text-decoration-color:#ffffff4c;text-underline-offset:3px;white-space:nowrap}\n.report-table .week-day-button:hover{color:#fff;text-decoration-color:#fff}\n.report-table .report-empty{color:#7e858f}\n.report-table .report-estimated{color:#f1d2a8}\n.report-table .report-more{color:#cad1db;font-size:10px;margin-left:1px}\n.report-table tfoot th,.report-table tfoot td{border-bottom:0;border-top:1px solid #ffffffa8;font-weight:700;font-size:clamp(11px,1.6vw,13px);color:#f9fafb;padding-top:16px}\n.report-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;padding:16px 0 4px;border-top:1px solid #ffffff2b}\n.report-metrics>div{display:grid;gap:6px}\n.report-metrics span{color:#b1b6c0;font-size:11px}\n.report-metrics strong{font-size:clamp(14px,2.2vw,17px);font-weight:500;font-variant-numeric:tabular-nums}\n.report-caption,.report-legend{color:#b9bec8;font-size:11px;line-height:1.5;margin:10px 0 0}\n.report-legend{color:#a2a9b3}\n.report-estimated-key{color:#f1d2a8;font-weight:700}\n.report-actions{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 0}\n.report-help{font-size:12px;line-height:1.6;color:#aeb4be}\n.wt-app.report-capture-mode .topbar,.wt-app.report-capture-mode #message,.wt-app.report-capture-mode footer,.wt-app.report-capture-mode .report-title,.wt-app.report-capture-mode .report-toolbar,.wt-app.report-capture-mode #report-open-calendar,.wt-app.report-capture-mode .report-help{display:none}\n.wt-app.report-capture-mode .shell{max-width:980px;padding-top:11px}\n.wt-app.report-capture-mode .report-paper{padding-top:22px}\n.wt-app.report-capture-mode .report-actions{justify-content:flex-end}\n@media(max-width:660px){\n .report-toolbar{align-items:stretch;flex-direction:column}\n .report-profile-label{width:100%}\n .report-week-navigation{justify-content:space-between}\n .report-paper{padding:15px 7px 12px}\n .report-table th,.report-table td{padding:10px 2px;font-size:10px;letter-spacing:-.035em}\n .report-table th:first-child,.report-table td:first-child{width:13%}\n .report-table th:nth-child(2),.report-table th:nth-child(3),.report-table th:nth-child(4),.report-table th:nth-child(5){width:13%}\n .report-table th:nth-child(6){width:15%}\n .report-table th:nth-child(7){width:20%}\n .report-header{padding:0 5px}\n .report-header-bottom{font-size:11px;display:grid;gap:2px}\n .report-metrics{padding-left:4px;padding-right:4px}\n .report-metrics strong{font-size:14px}\n .wt-app.report-capture-mode .shell{padding:8px 6px 45px}\n}\n@media(max-width:360px){.report-table th,.report-table td{font-size:9px;padding:9px 1px}.report-paper{padding:13px 4px 11px}.report-metrics strong{font-size:12px}.report-legend{font-size:10px}}\n@media print{\n .wt-app{background:#18191c!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}\n .topbar,#message,footer,.report-title,.report-toolbar,.report-actions,.report-help{display:none!important}\n .shell{width:100%;max-width:none;padding:0}\n .report-paper{padding:15px}\n .report-scroll{overflow:visible}\n .view:not(#view-week){display:none!important}\n}\n\n/* GPS foreground opt-in. No map or third-party trackers. */\n.geo-panel{position:relative}\n.geo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:13px 0}\n.geo-grid label{min-width:0}\n.geo-info{color:#bec4cc;font-size:12px;line-height:1.65}\n.geo-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}\n.geo-actions .btn{min-height:42px}\n.geo-status{font-size:12px;color:#c5ced8;line-height:1.6;margin:12px 0}\n.geo-pending{margin:15px auto 20px;max-width:530px;padding:18px;border-top:1px solid #bce1f4a8;border-left:1px solid #bce1f4a8;border-radius:12px 0 0;background:#c0d9ef11;text-align:left}\n.geo-pending strong{font-weight:530}\n.geo-pending-time{display:block;font-size:26px;margin:9px 0;color:#f4f7f9;font-variant-numeric:tabular-nums}\n.geo-pending p{color:#c7d0d9;line-height:1.55;font-size:12px}\n.geo-pending .actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px}\n.geo-pending .actions .btn{font-size:12px}\n.geo-home-monitor{color:#c2cbd5;font-size:12px;line-height:1.5;margin:10px auto}\n@media(max-width:520px){.geo-grid{grid-template-columns:1fr}.geo-pending{padding:14px}.geo-pending .actions .btn{flex:1}}\n\n/* Nexo: map selection dialog and place recommendation, mobile-first */\n.geo-map-launch{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin:10px 0}\n.geo-map-launch .btn{flex:1 1 180px}\n.geo-map-backdrop{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.82);padding:12px;backdrop-filter:blur(8px)}\n.geo-map-dialog{width:min(100%,750px);max-height:94dvh;display:flex;flex-direction:column;overflow:hidden;border:1px solid #ffffff7a;border-radius:13px;background:#1b1d20;box-shadow:0 30px 80px #000b}\n.geo-map-heading{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:16px 16px 9px}\n.geo-map-heading h2{font-size:19px;font-weight:500;letter-spacing:-.02em;margin:0}\n.geo-map-heading button{border:0;background:transparent;color:#fff;border-radius:7px;padding:5px 9px;font-size:22px}\n.geo-map-info{padding:0 16px 9px;color:#c0c6cf;font-size:12px;line-height:1.55}\n.geo-map-viewport{position:relative;flex:0 0 auto;width:100%;height:min(54dvh,490px);min-height:235px;isolation:isolate;background:#30343a;overflow:hidden}\n.geo-map-stage{display:block;width:100%;height:100%;min-height:100%;background:#30343a;position:relative;z-index:1;touch-action:pan-x pan-y}\n.geo-map-diagnostic{padding:5px 12px;min-height:28px;flex:0 0 auto;font-size:11px;color:#c7d1d9;background:#24272b;overflow-wrap:anywhere}\n.geo-map-stage .leaflet-container{font-family:system-ui,Arial,sans-serif}\n.geo-map-loader{position:absolute;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;background:#262b32ed;color:#f9fcff;padding:20px;text-align:center;pointer-events:none}\n.geo-map-loader strong{font-size:15px;font-weight:600}.geo-map-loader small{font-size:12px;color:#cbd7e0;line-height:1.5;max-width:320px}\n.geo-map-loader-track{height:9px;width:min(84%,310px);border-radius:9px;overflow:hidden;background:#59616b}\n.geo-map-loader-fill{height:100%;width:30%;background:#f7f8fb;border-radius:9px;transition:width .2s ease}\n.geo-map-loader:not([data-determinate=\"true\"]) .geo-map-loader-fill{animation:geo-map-pulse 1.4s ease-in-out infinite}\n@keyframes geo-map-pulse{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}\n@media(prefers-reduced-motion:reduce){.geo-map-loader-fill{animation:none!important;transition:none!important}}\n.geo-map-stage .leaflet-control-attribution{font-size:10px!important;color:#212121!important}\n.geo-map-stage .leaflet-control-attribution a{color:#074a73!important}\n.geo-map-stage .leaflet-control-zoom a{color:#171b23!important}\n.geo-map-result{padding:13px 16px 4px;font-size:13px;min-height:57px;line-height:1.4}\n.geo-map-result strong{display:block;color:#fff;font-weight:600}\n.geo-map-result span{color:#bdc5cf;display:block;margin-top:3px;font-size:12px}\n.geo-map-actions{display:flex;flex-wrap:wrap;gap:7px;padding:10px 16px 16px}\n.geo-map-actions .btn{flex:1;min-width:108px}\n.geo-map-preview{display:flex;gap:10px;margin:7px 0 0;align-items:start;color:#c4cbd3;font-size:12px;line-height:1.5}\n.geo-map-preview .geo-dot{width:8px;height:8px;flex:0 0 auto;border-radius:50%;background:#8ee3c5;margin-top:5px}\n.geo-map-hint{color:#afb6c2;font-size:12px;margin:9px 0}\n.geo-timezone-note{font-size:12px;color:#bfc7d3}\n@media(max-width:550px){.geo-map-backdrop{padding:6px}.geo-map-dialog{max-height:98dvh}.geo-map-heading{padding:12px 12px 8px}.geo-map-viewport{height:49dvh;min-height:220px}.geo-map-info,.geo-map-result{padding-left:12px;padding-right:12px}.geo-map-actions{padding:9px 12px 13px}.geo-map-actions .btn{font-size:12px;padding:9px 5px}}\n";
const screen=document.createElement('div');screen.innerHTML="<div class=\"wt-app\"><div class=\"ambient\" aria-hidden=\"true\"><i class=\"bubble\" style=\"--x:9%;--dim:28px;--speed:22s;--delay:0s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:36%;--dim:45px;--speed:29s;--delay:-11s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:63%;--dim:62px;--speed:36s;--delay:-22s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:90%;--dim:79px;--speed:43s;--delay:-33s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:17%;--dim:31px;--speed:27s;--delay:0s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:44%;--dim:48px;--speed:34s;--delay:-11s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:71%;--dim:65px;--speed:41s;--delay:-22s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:98%;--dim:82px;--speed:25s;--delay:-33s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:25%;--dim:34px;--speed:32s;--delay:0s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:52%;--dim:51px;--speed:39s;--delay:-11s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:79%;--dim:68px;--speed:23s;--delay:-22s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:6%;--dim:85px;--speed:30s;--delay:-33s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:33%;--dim:37px;--speed:37s;--delay:0s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:60%;--dim:54px;--speed:44s;--delay:-11s;--drift:-12vw\"></i><i class=\"bubble\" style=\"--x:87%;--dim:71px;--speed:28s;--delay:-22s;--drift:9vw\"></i><i class=\"bubble\" style=\"--x:14%;--dim:88px;--speed:35s;--delay:-33s;--drift:-12vw\"></i></div>\n<main class=\"shell\">\n<header class=\"topbar\"><button class=\"brand\" type=\"button\" data-nav=\"home\"><span class=\"brand-dot\"></span>NEXO / HORAS</button><nav class=\"nav\" aria-label=\"Secciones\"><button class=\"nav-btn\" type=\"button\" data-nav=\"week\" title=\"Resumen semanal\" aria-label=\"Resumen semanal\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 6h12M9 12h12M9 18h12M3 6h2M3 12h2M3 18h2\"/></svg></button><button class=\"nav-btn\" type=\"button\" data-nav=\"calendar\" title=\"Calendario\" aria-label=\"Calendario\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 3v4M17 3v4M3 10h18\"/></svg></button><button class=\"nav-btn\" type=\"button\" data-nav=\"settings\" title=\"Ajustes\" aria-label=\"Ajustes\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"m10 2-.5 2.2-2 1-2.1-.7-2 3.4L5 9.5v2.5l-1.6 1.5 2 3.4 2.1-.7 2 1L10 20h4l.5-2.8 2-1 2.1.7 2-3.4L19 12V9.5l1.6-1.6-2-3.4-2.1.7-2-1L14 2z\"/></svg></button></nav></header>\n<div id=\"message\" role=\"status\" aria-live=\"polite\"></div>\n<section id=\"view-home\" class=\"view home\">\n<div class=\"eyebrow\">MI JORNADA</div><div id=\"week-close-banner\" class=\"week-close-banner\" hidden role=\"status\" aria-live=\"polite\"><strong>DÍA DE CIERRE</strong></div><div id=\"today-date\" class=\"today-date\">—</div><div class=\"clock\"><span id=\"clock-time\">--:--</span><span class=\"seconds\" id=\"clock-seconds\">--</span></div>\n<div class=\"last-card\"><div class=\"eyebrow dim\">ÚLTIMA MARCA</div><div class=\"last-line\"><strong id=\"last-time\">—</strong><span id=\"last-type\">Sin registros</span></div></div>\n<div class=\"home-pay-inline\" aria-label=\"Ganancias estimadas\"><span>Hoy <strong id=\"home-pay-today\">$0.00</strong></span><span>Semana <strong id=\"home-pay-week\">$0.00</strong></span></div>\n<p id=\"home-status\" class=\"home-status\">Sin turno activo</p>\n<div class=\"geo-pending\" id=\"geo-pending\" hidden>\n <div class=\"eyebrow dim\">UBICACIÓN · MARCA PROVISIONAL</div>\n <strong id=\"geo-pending-label\">Marca estimada</strong>\n <span class=\"geo-pending-time\" id=\"geo-pending-time\">--:--</span>\n <p id=\"geo-pending-info\">Nexo calculó una hora aproximada usando tu ubicación. No afecta la nómina hasta confirmarla.</p>\n <div class=\"actions\">\n  <button type=\"button\" class=\"btn primary\" id=\"geo-confirm\">Confirmar</button>\n  <button type=\"button\" class=\"btn\" id=\"geo-edit\">Corregir hora</button>\n  <button type=\"button\" class=\"btn\" id=\"geo-discard\">Descartar</button>\n </div>\n <form id=\"geo-edit-form\" hidden>\n  <label>Hora real <input type=\"datetime-local\" id=\"geo-edit-time\" required></label>\n  <div class=\"actions\"><button type=\"submit\" class=\"btn primary\">Guardar corrección</button><button type=\"button\" class=\"btn\" id=\"geo-edit-cancel\">Cancelar</button></div>\n </form>\n</div>\n<div class=\"geo-home-monitor\" id=\"geo-home-monitor\" hidden>Reconocimiento GPS activo durante esta sesión.</div>\n<div class=\"provisional-panel\" id=\"provisional-panel\" hidden>\n <h2>Regreso del descanso · provisional</h2>\n <div class=\"provisional-warning\">Nexo estimó esta hora a partir del margen configurado. No es una marca manual confirmada.</div>\n <div id=\"provisional-time\" class=\"provisional-time\">—</div>\n <p id=\"provisional-detail\" class=\"subtle\"></p>\n <div class=\"provisional-controls\">\n  <button class=\"btn primary\" type=\"button\" id=\"confirm-provisional\">Confirmar</button>\n  <button class=\"btn\" type=\"button\" id=\"edit-provisional\">Corregir hora</button>\n  <button class=\"btn\" type=\"button\" id=\"undo-provisional\">Descartar</button>\n </div>\n <form id=\"provisional-edit-form\" class=\"provisional-edit\" hidden>\n  <label>Hora real de regreso <input type=\"datetime-local\" id=\"provisional-end-at\" required></label>\n  <div class=\"actions\"><button type=\"submit\" class=\"btn primary\">Guardar corrección</button><button type=\"button\" class=\"btn\" id=\"cancel-provisional-edit\">Cancelar</button></div>\n </form>\n</div>\n<button type=\"button\" id=\"open-mark\" class=\"plus\" aria-label=\"Agregar marca\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3v18M3 12h18\"/></svg></button><div class=\"hint\">AGREGAR MARCA</div>\n\n</section>\n<section class=\"view\" id=\"view-mark\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Nueva marca</h1></div><p class=\"subtle\">Seleccioná el tipo de marca. La hora se registra al confirmar.</p>\n<p id=\"mark-captured-at\" class=\"mark-stamp\" aria-live=\"polite\">Hora de la marca: --:--</p><div class=\"mark-grid\"><button class=\"mark\" type=\"button\" id=\"clock-in\"><span>01</span>Entrada al trabajo</button><button class=\"mark\" type=\"button\" id=\"break-start\"><span>02</span>Inicio de descanso</button><button class=\"mark\" type=\"button\" id=\"break-end\"><span>03</span>Fin de descanso</button><button class=\"mark\" type=\"button\" id=\"clock-out\"><span>04</span>Salida del trabajo</button></div>\n<div class=\"panel\"><p id=\"active-info\" class=\"subtle\">No hay un turno activo.</p></div></section>\n<section class=\"view\" id=\"view-settings\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Ajustes</h1></div><div class=\"panel\"><h2>Lugares de trabajo</h2>\n<label>Perfil laboral<select id=\"profile\"></select></label>\n<div class=\"profile-week-close-controls\"><label>Día de cierre de la semana\n<select id=\"profile-week-close\">\n<option value=\"0\">Domingo</option><option value=\"1\">Lunes</option><option value=\"2\">Martes</option><option value=\"3\">Miércoles</option><option value=\"4\">Jueves</option><option value=\"5\">Viernes</option><option value=\"6\">Sábado</option>\n</select></label><button class=\"btn\" id=\"save-profile-week-close\" type=\"button\">Guardar cierre</button></div>\n<p class=\"profile-week-close-note\">El cierre se configura por lugar. Si lo cambiás, se recalcularán las semanas y las horas extra de ese lugar, sin borrar tus marcas.</p>\n<div class=\"actions\"><button class=\"btn\" id=\"show-profile\" type=\"button\">+ Agregar lugar</button></div>\n<form id=\"profile-form\" hidden><div class=\"fields\">\n<label>Nombre del perfil<input name=\"name\" required placeholder=\"Trabajo principal\"></label><label>Lugar o empresa<input name=\"place\" required placeholder=\"Hotel / restaurante\"></label>\n<label>Tarifa por hora ($)<input name=\"hourlyRate\" type=\"number\" min=\"0\" step=\".01\" required></label><label>Retención estimada (%)<input name=\"taxPercent\" type=\"number\" min=\"0\" max=\"100\" step=\".01\" value=\"0\"></label>\n<label>Día de cierre de la semana<select name=\"weekCloseDay\"><option value=\"0\" selected>Domingo</option><option value=\"1\">Lunes</option><option value=\"2\">Martes</option><option value=\"3\">Miércoles</option><option value=\"4\">Jueves</option><option value=\"5\">Viernes</option><option value=\"6\">Sábado</option></select></label>\n<label>Límite semanal (horas)<input name=\"overtimeAfterHours\" type=\"number\" min=\"1\" max=\"168\" value=\"40\" required></label><label>Multiplicador de extras<input name=\"overtimeMultiplier\" type=\"number\" min=\"1\" max=\"10\" step=\".1\" value=\"1.5\" required></label></div>\n<div class=\"actions\"><button class=\"btn primary\" type=\"submit\">Guardar lugar</button><button class=\"btn\" type=\"button\" id=\"cancel-profile\">Cancelar</button></div></form></div>\n<div class=\"panel geo-panel\">\n <h2>Ubicación del lugar de trabajo</h2>\n <p class=\"geo-info\">Marca el punto GPS de este trabajo y define su zona. Este modo de prueba funciona solo con la página activa y el permiso de ubicación del navegador. No detecta movimientos con el teléfono bloqueado.</p>\n <form id=\"geo-form\">\n  <label class=\"break-toggle\"><input type=\"checkbox\" id=\"geo-enabled\" name=\"enabled\"><span>Permitir propuestas provisionales por ubicación para este lugar</span></label>\n  <div class=\"geo-grid\">\n   <label>Latitud<input type=\"number\" id=\"geo-lat\" name=\"lat\" min=\"-90\" max=\"90\" step=\"any\" placeholder=\"Establecer ubicación\" required></label>\n   <label>Longitud<input type=\"number\" id=\"geo-lon\" name=\"lon\" min=\"-180\" max=\"180\" step=\"any\" placeholder=\"Establecer ubicación\" required></label>\n   <label>Radio de reconocimiento\n    <select id=\"geo-radius\" name=\"radius\">\n     <option value=\"200\">200 metros</option>\n     <option value=\"805\" selected>Media milla</option>\n     <option value=\"1609\">Una milla</option>\n    </select>\n   </label>\n   <label>Tiempo dentro antes de proponer entrada (min)\n    <input id=\"geo-arrival\" name=\"arrival\" type=\"number\" min=\"0\" max=\"120\" step=\"1\" value=\"20\" required>\n   </label>\n   <label>Restar a la primera salida detectada (min)\n    <input id=\"geo-exit\" name=\"exit\" type=\"number\" min=\"0\" max=\"120\" step=\"1\" value=\"20\" required>\n   </label>\n  </div>\n  <div class=\"geo-map-launch\">\n   <button id=\"geo-use-current\" type=\"button\" class=\"btn\">Detectar mi ubicación</button>\n   <button id=\"geo-open-map\" type=\"button\" class=\"btn\">Elegir en el mapa</button>\n  </div>\n  <div class=\"geo-map-preview\" id=\"geo-choice-preview\">\n    <span class=\"geo-dot\" aria-hidden=\"true\"></span>\n    <span id=\"geo-choice-label\">Elegí un punto en el mapa o detectá tu ubicación. No se guardará sin tu confirmación.</span>\n  </div>\n  <div class=\"geo-grid\">\n    <label>Nombre del lugar (opcional)<input type=\"text\" id=\"geo-place-label\" name=\"placeLabel\" maxlength=\"100\" placeholder=\"Nombre del hotel, edificio o comercio\"></label>\n    <label>Zona horaria del perfil (detectada del dispositivo)<input type=\"text\" id=\"geo-profile-timezone\" readonly aria-label=\"Zona horaria detectada para este perfil\"></label>\n  </div>\n  <div class=\"geo-actions\"><button type=\"submit\" class=\"btn primary\">Guardar zona y configuración</button></div>\n </form>\n <div class=\"geo-actions\">\n  <button id=\"geo-start\" type=\"button\" class=\"btn primary\">Iniciar reconocimiento</button>\n  <button id=\"geo-stop\" type=\"button\" class=\"btn\" disabled>Detener</button>\n </div>\n <p class=\"geo-status\" id=\"geo-status\" role=\"status\" aria-live=\"polite\">GPS desactivado. No se está consultando tu ubicación.</p>\n <p class=\"geo-info\">Privacidad: guardamos únicamente el centro del trabajo y la hora propuesta, no tu recorrido. Las marcas GPS requieren confirmación manual; si el GPS es impreciso no proponemos registros.</p>\n</div>\n<div class=\"panel\" id=\"break-settings-panel\">\n <h2>Descanso automático provisional</h2>\n <p class=\"break-explainer\">Configura la duración y tolerancia para este lugar. Si olvidás marcar el regreso, Nexo estimará una hora al superar el margen. Funciona con la página abierta y recupera el cálculo al volver a abrirla.</p>\n <form id=\"break-settings-form\">\n  <label class=\"break-toggle\"><input name=\"enabled\" id=\"break-auto-enabled\" type=\"checkbox\"><span>Habilitar estimaciones automáticas para este lugar de trabajo</span></label>\n  <div class=\"break-settings-grid\">\n   <label>Duración habitual del descanso (minutos)<input name=\"duration\" id=\"break-duration\" type=\"number\" min=\"1\" max=\"240\" step=\"1\" value=\"30\" required></label>\n   <label>Tolerancia adicional (minutos)<input name=\"tolerance\" id=\"break-tolerance\" type=\"number\" min=\"0\" max=\"120\" step=\"1\" value=\"5\" required></label>\n  </div>\n  <div id=\"break-settings-note\" class=\"break-explainer\">Ejemplo: descanso 30 min + margen 5 min = regreso estimado después de 35 min.</div>\n  <div class=\"actions\"><button class=\"btn primary\" type=\"submit\" id=\"save-break-settings\">Guardar configuración</button></div>\n </form>\n <p class=\"break-explainer\">Las estimaciones pendientes de confirmar aparecerán en el inicio, donde podrás corregirlas. No se generan marcas si esta función está desactivada.</p>\n </div>\n<div class=\"panel\"><h2>Resumen del perfil</h2><div class=\"metrics\"><div class=\"metric\">Horas de la semana<strong id=\"weekly-hours\">0 h</strong></div><div class=\"metric\">Ganancia semanal estimada<strong id=\"weekly-pay\">$0.00</strong></div><div class=\"metric\">Horas históricas<strong id=\"total-hours\">0 h</strong></div><div class=\"metric\">Ganancia histórica estimada<strong id=\"total-pay\">$0.00</strong></div></div><p class=\"subtle\">Las ganancias y retenciones son estimaciones; no sustituyen la nómina oficial.</p></div></section>\n<section class=\"view\" id=\"view-calendar\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Calendario</h1></div><div class=\"panel\"><div class=\"calendar-head\"><button class=\"btn\" id=\"prev-month\" type=\"button\" aria-label=\"Mes anterior\">‹</button><h2 id=\"month-label\"></h2><button class=\"btn\" id=\"next-month\" type=\"button\" aria-label=\"Mes siguiente\">›</button></div><div class=\"calendar\" id=\"calendar\"></div></div>\n<div class=\"panel\"><h2 id=\"selected-label\">Jornadas del día</h2><div id=\"shift-list\"></div><div class=\"actions\"><button class=\"btn primary\" id=\"new-shift\" type=\"button\">+ Añadir jornada anterior</button></div>\n<form id=\"shift-form\" hidden><input type=\"hidden\" name=\"id\"><div class=\"fields\"><label>Entrada<input name=\"startedAt\" type=\"datetime-local\" required></label><label>Salida<input name=\"closedAt\" type=\"datetime-local\" required></label><label>Descanso total (minutos)<input name=\"breakMinutes\" type=\"number\" min=\"0\" step=\"1\" value=\"0\" required></label></div><div class=\"actions\"><button class=\"btn primary\" type=\"submit\">Guardar jornada</button><button class=\"btn\" id=\"cancel-shift\" type=\"button\">Cancelar</button></div></form></div></section>\n<section class=\"view report-view\" id=\"view-week\" hidden>\n  <div class=\"section-title report-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Resumen semanal</h1></div>\n  <div class=\"report-toolbar\" id=\"report-toolbar\">\n    <label class=\"report-profile-label\">Lugar de trabajo\n      <select id=\"report-profile\" aria-label=\"Lugar de trabajo para el resumen semanal\"></select>\n    </label>\n    <div class=\"report-week-navigation\" role=\"group\" aria-label=\"Elegir semana\">\n      <button class=\"btn report-nav\" type=\"button\" id=\"report-prev-week\" aria-label=\"Semana anterior\">‹</button>\n      <button class=\"btn report-current\" type=\"button\" id=\"report-current-week\">Esta semana</button>\n      <button class=\"btn report-nav\" type=\"button\" id=\"report-next-week\" aria-label=\"Semana siguiente\">›</button>\n    </div>\n  </div>\n  <div class=\"report-paper\" id=\"report-paper\">\n    <div class=\"report-header\">\n      <div class=\"report-overline\">NEXO GROUP <span>·</span> REGISTRO DE HORAS</div>\n      <h2>Resumen de la semana</h2>\n      <div class=\"report-header-bottom\">\n        <span id=\"report-place\">Sin lugar seleccionado</span>\n        <span id=\"report-dates\">—</span>\n      </div>\n    </div>\n    <div class=\"report-scroll\">\n      <table class=\"report-table\" aria-label=\"Jornadas de lunes a domingo, descansos, horas e ingresos estimados\">\n        <thead><tr><th scope=\"col\">Día</th><th scope=\"col\">Entr.</th><th scope=\"col\">Break</th><th scope=\"col\">Reg.</th><th scope=\"col\">Salida</th><th scope=\"col\">Horas</th><th scope=\"col\">Neto*</th></tr></thead>\n        <tbody id=\"week-rows\"></tbody>\n        <tfoot><tr><th scope=\"row\">Total</th><td colspan=\"4\"></td><td id=\"week-total-hours\">0h</td><td id=\"week-total-net\">$0.00</td></tr></tfoot>\n      </table>\n    </div>\n    <div class=\"report-metrics\">\n      <div><span>Bruto</span><strong id=\"week-total-gross\">$0.00</strong></div>\n      <div><span>Retención</span><strong id=\"week-total-tax\">$0.00</strong></div>\n      <div><span>Horas extra</span><strong id=\"week-total-overtime\">0h</strong></div>\n    </div>\n    <p id=\"week-total\" class=\"report-caption\" aria-live=\"polite\">Los pagos son estimaciones.</p>\n    <p class=\"report-legend\">* Neto estimado tras retenciones. <span class=\"report-estimated-key\">~</span> marca provisional pendiente. <strong>+</strong> más marcas ese día; tocá el día para consultar o editar. Turnos nocturnos se muestran en el día de entrada.</p>\n  </div>\n  <div class=\"report-actions\">\n    <button class=\"btn\" id=\"report-capture\" type=\"button\" aria-pressed=\"false\">Vista para captura</button>\n    <button class=\"btn\" id=\"report-open-calendar\" type=\"button\">Editar marcas en calendario</button>\n  </div>\n  <p class=\"report-help\">La vista de captura oculta los controles para que puedas tomar una foto de pantalla y enviarla desde tu celular. No modifica ninguna marca.</p>\n</section>\n\n<div class=\"geo-map-backdrop\" id=\"geo-map-backdrop\" hidden>\n <section class=\"geo-map-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"geo-map-title\" aria-describedby=\"geo-map-description\">\n  <div class=\"geo-map-heading\"><h2 id=\"geo-map-title\">Elegir ubicación de trabajo <span style=\"display:block;margin-top:4px;font-size:11px;color:#e8e8e8;letter-spacing:.03em;font-weight:500\">Mapa v0.2.7 · Wix sincronizado</span></h2><button id=\"geo-map-close\" type=\"button\" aria-label=\"Cerrar mapa\">×</button></div>\n  <p class=\"geo-map-info\" id=\"geo-map-description\">Tocá el mapa para mover el punto. El círculo muestra el radio. Al identificar un lugar, sus coordenadas se consultan una sola vez mediante Photon/komoot y OpenStreetMap, servicios externos. Confirmá antes de guardar.</p>\n  <div class=\"geo-map-viewport\"><div id=\"geo-map-stage\" class=\"geo-map-stage\" aria-label=\"Mapa para escoger el lugar de trabajo\"></div><div class=\"geo-map-loader\" id=\"geo-map-loader\" role=\"status\" aria-live=\"polite\"><strong id=\"geo-map-load-label\">Preparando el mapa…</strong><div class=\"geo-map-loader-track\" role=\"progressbar\" id=\"geo-map-progress\" aria-label=\"Carga de las calles\"><div class=\"geo-map-loader-fill\" id=\"geo-map-progress-fill\"></div></div><small id=\"geo-map-load-detail\">Conectando con el servicio cartográfico</small></div></div><div id=\"geo-map-diagnostic\" class=\"geo-map-diagnostic\" aria-live=\"polite\">Mapa v0.2.5 · Visor listo para iniciar</div>\n  \n  <div class=\"geo-map-result\" aria-live=\"polite\"><strong id=\"geo-map-place\">Punto por seleccionar</strong><span id=\"geo-map-address\">Detectá tu posición o tocá el mapa para elegir.</span></div>\n  <div class=\"geo-map-actions\">\n   <button class=\"btn\" type=\"button\" id=\"geo-map-detect\">Mi ubicación</button>\n   <button class=\"btn\" type=\"button\" id=\"geo-map-identify\">Identificar lugar</button>\n   <button class=\"btn primary\" type=\"button\" id=\"geo-map-save\" disabled>Guardar este punto</button>\n   <button class=\"btn\" type=\"button\" id=\"geo-map-cancel\">Cancelar</button>\n  </div>\n </section>\n</div>\n\n<div id=\"suggest-backdrop\" class=\"suggest-backdrop\" hidden>\n  <section class=\"suggest-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"suggest-title\" aria-describedby=\"suggest-description\">\n    <div class=\"suggest-kicker\">SUGERENCIA DE MARCA</div>\n    <h2 id=\"suggest-title\">¿Registrar tu siguiente marca?</h2>\n    <p id=\"suggest-description\">Podés confirmar o continuar sin registrar nada.</p>\n    <div class=\"suggest-time\" id=\"suggest-time\">--:--</div>\n    <div class=\"suggest-actions\">\n      <button class=\"btn\" id=\"suggest-no\" type=\"button\">Ahora no</button>\n      <button class=\"btn\" id=\"suggest-other\" type=\"button\">Otra marca</button>\n      <button class=\"btn primary\" id=\"suggest-yes\" type=\"button\">Sí, registrar</button>\n    </div>\n  </section>\n</div>\n<footer>Versión de desarrollo: los registros permanecen en este navegador y dispositivo. Aún no existe sincronización por cuenta.</footer>\n</main></div>";
uiRoot.append(style,screen);document.body.appendChild(host);
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
return {shifts:byShift,segments:totals,groups:[...groups].map(([key,workedMilliseconds])=>({key,workedMilliseconds}))}}
return Object.freeze({weekKey,project});
});

/* Nexo Hours · deterministic geofence transitions (foreground/browser only).
   No network, no location history or storage. A monitoring session is in-memory only. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NexoWorkTimeGeo=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const R=6371008.8;
function distanceMeters(a,b,c,d){
 const rad=Math.PI/180,p1=a*rad,p2=c*rad,dp=(c-a)*rad,dl=(d-b)*rad;
 const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
 return 2*R*Math.asin(Math.min(1,Math.sqrt(h)))
}
function validZone(z){
 return !!z&&Number.isFinite(z.lat)&&Math.abs(z.lat)<=90&&Number.isFinite(z.lon)&&Math.abs(z.lon)<=180&&
 Number.isFinite(z.radiusMeters)&&z.radiusMeters>=100&&z.radiusMeters<=5000&&
 Number.isInteger(z.arrivalMinutes)&&z.arrivalMinutes>=0&&z.arrivalMinutes<=120&&
 Number.isInteger(z.exitMinutes)&&z.exitMinutes>=0&&z.exitMinutes<=120
}
function emptySession(){return {mode:'unknown',enteredAt:null,exitStartedAt:null,outsideSamples:0,everInside:false,entryEmitted:false,exitEmitted:false}}
function observe(previous,zone,point,now){
 if(!validZone(zone)||!point||!Number.isFinite(point.lat)||!Number.isFinite(point.lon)||
 !Number.isFinite(point.accuracy)||point.accuracy<0||point.accuracy>Math.min(200,zone.radiusMeters/2)||
 !Number.isFinite(now))return {session:previous,event:null,quality:'imprecisa'};
 const meters=distanceMeters(zone.lat,zone.lon,point.lat,point.lon),accuracy=point.accuracy;
 const inside=meters+accuracy<=zone.radiusMeters;
 const outside=meters-accuracy>=zone.radiusMeters+80;
 if(!inside&&!outside)return {session:previous,event:null,quality:'límite'};
 let s={...previous},event=null;
 if(inside){
  if(s.mode!=='inside'){s.mode='inside';s.enteredAt=now;s.exitStartedAt=null;s.outsideSamples=0;s.exitEmitted=false}
  s.everInside=true;
  if(!s.entryEmitted&&now-s.enteredAt>=zone.arrivalMinutes*60000){
   s.entryEmitted=true;event={kind:'entry',estimatedAt:s.enteredAt+zone.arrivalMinutes*60000,observedAt:now}
  }
 }else{
  if(s.mode!=='outside'){
   s.mode='outside';s.exitStartedAt=s.everInside?now:null;s.outsideSamples=1;s.entryEmitted=false
  }else if(s.exitStartedAt!==null)s.outsideSamples++;
  if(s.everInside&&!s.exitEmitted&&s.exitStartedAt!==null&&s.outsideSamples>=2&&now-s.exitStartedAt>=120000){
   s.exitEmitted=true;
   event={kind:'exit',estimatedAt:s.exitStartedAt-zone.exitMinutes*60000,observedAt:now,firstOutsideAt:s.exitStartedAt}
  }
 }
 return {session:s,event,quality:inside?'dentro':'fuera',distanceMeters:Math.round(meters),accuracyMeters:accuracy}
}
return Object.freeze({distanceMeters,validZone,emptySession,observe})
});

/* Nexo Hours: on-demand interactive map and one-shot reverse lookup.
   Leaflet 1.9.4 + standard OSM tiles. Map data loads ONLY on explicit user action.
   Photon public demo reverse geocoding only on explicit GPS/Identify click.
   Public demonstration server is limited/no SLA; contract a provider for scale. No history of GPS movements is stored here. */
(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.NexoWorkTimeMap=api;})(typeof globalThis!=='undefined'?globalThis:this,function(root){
'use strict';
// An ES module avoids Wix/RequireJS capturing Leaflet's UMD exports.
const LEAFLET_MODULES=[
 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet-src.esm.js',
 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js'
];
const CSS='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';
const CSS_BACKUP='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const CSS_HASH='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
let libraryPromise=null,leafletLib=null;
function coordsValid(lat,lon){return Number.isFinite(lat)&&Math.abs(lat)<=90&&Number.isFinite(lon)&&Math.abs(lon)<=180}
function coordinateLabel(lat,lon){return lat.toFixed(5)+', '+lon.toFixed(5)}
function safeString(v){return String(v||'').trim().slice(0,160)}
function nameFromReverse(v){
 const a=v?.features?.[0]?.properties||{},hasData=Object.keys(a).length>0;
 const main=safeString(a.name||a.street||a.locality||a.city||a.district);
 const address=safeString([a.housenumber,a.street,a.city||a.locality||a.district,a.state,a.country].filter(Boolean).join(', '));
 return {name:hasData?(main||'Lugar cercano'):'Ubicación aproximada',address}
}
function usableLeaflet(module){
 if(module&&typeof module.map==='function'&&typeof module.tileLayer==='function'&&typeof module.circle==='function')return module;
 const fallback=module?.default;
 if(fallback&&typeof fallback.map==='function'&&typeof fallback.tileLayer==='function'&&typeof fallback.circle==='function')return fallback;
 return null
}
function loadLeaflet(doc,container){
 installStyles(doc,container);
 if(leafletLib)return Promise.resolve(leafletLib);
 if(!libraryPromise){
  libraryPromise=(async()=>{
   for(const src of LEAFLET_MODULES){
    try{
     const exports=await import(src);
     const api=usableLeaflet(exports);
     if(!api)throw Error('El módulo de mapas no exportó sus funciones.');
     leafletLib=api;
     return api
    }catch(error){
     // The next pinned ESM source is attempted only when the primary fails.
    }
   }
   throw Error('No se pudo cargar la biblioteca de mapas. Revisá la conexión e intentá nuevamente.')
  })().catch(error=>{libraryPromise=null;throw error})
 }
 return libraryPromise
}
function installStyles(doc,rootNode){
 const host=rootNode?.nodeType===11?rootNode:doc.head;
 if(host.querySelector('link[data-nexo-leaflet]'))return;
 const link=doc.createElement('link');link.rel='stylesheet';link.href=CSS;link.crossOrigin='anonymous';
 link.integrity=CSS_HASH;link.setAttribute('data-nexo-leaflet','');
 link.onerror=()=>{if(host.querySelector('link[data-nexo-leaflet-backup]'))return;const backup=doc.createElement('link');backup.rel='stylesheet';backup.href=CSS_BACKUP;backup.crossOrigin='anonymous';backup.integrity=CSS_HASH;backup.setAttribute('data-nexo-leaflet-backup','');host.append(backup)};
 host.append(link)
}
function createMapPicker(config){
 const doc=config.document||document,rootNode=config.root||doc,byId=id=>rootNode.getElementById(id);
 const panel=byId('geo-map-backdrop'),stage=byId('geo-map-stage');
 if(!panel||!stage)throw Error('Contenedor del mapa no encontrado');
 let map=null,marker=null,circle=null,point=null,radius=805,requestId=0,lastQuery=0,lookupCache=new Map(),openVersion=0,tileProvider='osm',tileFailures=0,tileSuccess=0,tiles=null;
 const title=byId('geo-map-place'),address=byId('geo-map-address'),save=byId('geo-map-save');
 const loader=byId('geo-map-loader'),loadLabel=byId('geo-map-load-label'),loadDetail=byId('geo-map-load-detail'),progress=byId('geo-map-progress'),fill=byId('geo-map-progress-fill'),diagnostic=byId('geo-map-diagnostic');
 let tileRequested=0,tileFinished=0,loadingGeneration=0,loadTimeout=null;
 function loading(label,detail,percentage){
  loader.hidden=false;loadLabel.textContent=label;loadDetail.textContent=detail;
  diagnostic.textContent=label+' · '+detail;
  const measurable=Number.isFinite(percentage);
  loader.dataset.determinate=String(measurable);
  if(measurable){const value=Math.max(0,Math.min(100,Math.round(percentage)));fill.style.width=value+'%';progress.setAttribute('aria-valuenow',String(value));progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax','100')}
  else{fill.style.width='30%';progress.removeAttribute('aria-valuenow');progress.removeAttribute('aria-valuemin');progress.removeAttribute('aria-valuemax')}
 }
 function loadingDone(){if(loadTimeout){clearTimeout(loadTimeout);loadTimeout=null}loader.hidden=true;diagnostic.textContent='Mapa cargado · '+tileSuccess+' imágenes recibidas'}
 function loadingTimer(generation){
  if(loadTimeout)clearTimeout(loadTimeout);
  loadTimeout=setTimeout(()=>{
   if(panel.hidden||generation!==loadingGeneration||loader.hidden)return;
   loading('La carga está tardando','Revisá tu conexión. Si las calles no aparecen, podés cerrar y volver a intentar.',null)
  },12000)
 }

 const setInfo=(heading,detail)=>{title.textContent=heading;address.textContent=detail};
 function refreshMap(seq){
  if(!map||panel.hidden||seq!==openVersion)return;
  map.invalidateSize({pan:false});
  const rect=stage.getBoundingClientRect();
  if(rect.width<10||rect.height<10){loading('El contenedor no tiene espacio','Dimensiones: '+Math.round(rect.width)+' × '+Math.round(rect.height)+' px',null)}
  if(point)map.panTo([point.lat,point.lon],{animate:false});
 }
 function startTiles(L,provider){
  if(tiles)map.removeLayer(tiles);
  const generation=++loadingGeneration;
  tileProvider=provider;tileFailures=0;tileSuccess=0;tileRequested=0;tileFinished=0;
  loading(provider==='osm'?'Cargando calles…':'Probando otro servidor de mapas…','Descargando las imágenes del mapa',null);
  loadingTimer(generation);
  const osm=provider==='osm';
  const layer=L.tileLayer(osm?'https://tile.openstreetmap.org/{z}/{x}/{y}.png':'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
   minZoom:2,maxZoom:19,maxNativeZoom:19,attribution:osm?'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>':'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> · © <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
  });
  tiles=layer;
  layer.on('tileloadstart',()=>{if(generation!==loadingGeneration)return;tileRequested++;loading('Cargando calles…','Se están descargando las imágenes visibles',tileRequested?tileFinished/tileRequested*100:null)});
  layer.on('tileload',()=>{if(generation!==loadingGeneration)return;tileSuccess++;tileFinished++;loading('Cargando calles…','Imágenes recibidas: '+tileFinished+' de '+tileRequested,tileRequested?tileFinished/tileRequested*100:null)});
  layer.on('tileerror',()=>{
   if(generation!==loadingGeneration)return;
   tileFailures++;tileFinished++;
   if(tileFailures>=3&&tileSuccess===0){
    if(tileProvider==='osm')startTiles(L,'carto');
    else{
     ++loadingGeneration;
     loading('No se pudieron mostrar las calles','Revisá la conexión. Podés volver a abrir el mapa o guardar las coordenadas.',null);
     if(loadTimeout){clearTimeout(loadTimeout);loadTimeout=null}
    }
   }else loading('Cargando calles…','Algunas imágenes no respondieron; reintentando otras',tileRequested?tileFinished/tileRequested*100:null)
  });
  layer.on('load',()=>{if(generation!==loadingGeneration)return;if(tileSuccess)loadingDone()});
  layer.addTo(map)
 }
 function setPoint(lat,lon,center=true){
  lat=Number(lat);lon=Number(lon);
  if(!coordsValid(lat,lon))return false;
  point={lat,lon,label:'',address:''};requestId++;save.disabled=false;
  if(map){
   if(!marker){
    marker=leafletLib.circleMarker([lat,lon],{radius:9,color:'#fff',weight:3,fillColor:'#275973',fillOpacity:1}).addTo(map)
   }else marker.setLatLng([lat,lon]);
   if(!circle)circle=leafletLib.circle([lat,lon],{radius,color:'#1a768a',weight:2,fillColor:'#378f9c',fillOpacity:.13}).addTo(map);
   else circle.setLatLng([lat,lon]).setRadius(radius);
   if(center)map.setView([lat,lon],16)
  }
  setInfo('Punto seleccionado',coordinateLabel(lat,lon)+' · tocá Identificar lugar para sugerir nombre');
  return true
 }
 async function lookupPoint(){
  if(!point)return;
  const now=Date.now();
  if(now-lastQuery<1250){
   setInfo(point.label||'Punto seleccionado','Esperá un momento antes de consultar otro lugar.');
   return
  }
  lastQuery=now;
  const current={lat:point.lat,lon:point.lon},key=current.lat.toFixed(4)+'|'+current.lon.toFixed(4),token=++requestId;
  setInfo('Identificando ubicación…',coordinateLabel(current.lat,current.lon));
  try{
   let found=lookupCache.get(key);
   if(!found){
    const u=new URL('https://photon.komoot.io/reverse');
    u.searchParams.set('lat',String(current.lat));u.searchParams.set('lon',String(current.lon));
    u.searchParams.set('limit','1');u.searchParams.set('lang','es');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),9000);
    let response;
    try{response=await fetch(u.toString(),{headers:{Accept:'application/json'},signal:controller.signal,referrerPolicy:'strict-origin-when-cross-origin'})}
    finally{clearTimeout(timeout)}
    if(!response.ok)throw Error('No se pudo consultar el nombre del lugar ('+response.status+').');
    found=nameFromReverse(await response.json());
    lookupCache.set(key,found)
   }
   if(token!==requestId||!point)return;
   point.label=found.name;point.address=found.address;
   setInfo('¿Guardar «'+found.name+'» como zona de trabajo?',found.address||coordinateLabel(current.lat,current.lon));
  }catch(e){
   if(token!==requestId||!point)return;
   setInfo('Punto seleccionado',coordinateLabel(current.lat,current.lon)+' · no se pudo consultar el nombre; podés guardarlo igualmente.')
  }
 }
 async function open(options={}){
  if(!panel.hidden)return;
  const seq=++openVersion;radius=options.radiusMeters||805;point=null;save.disabled=true;
  setInfo('Preparando mapa…','Abrí el mapa con conexión para ver las calles.');
  panel.hidden=false;
  loading('Preparando el visor…','Conectando con el servicio cartográfico',null);
  try{
   const L=await loadLeaflet(doc,rootNode);if(seq!==openVersion||panel.hidden)return;
   if(!map){
    map=L.map(stage,{zoomControl:true,scrollWheelZoom:false,preferCanvas:true});
    map.on('click',e=>{setPoint(e.latlng.lat,e.latlng.lng,false)});
   }
   startTiles(L,'osm');
   if(point&&coordsValid(point.lat,point.lon))setPoint(point.lat,point.lon,true);
   else if(coordsValid(options.lat,options.lon))setPoint(options.lat,options.lon,true);
   else{
    if(marker){map.removeLayer(marker);marker=null}
    if(circle){map.removeLayer(circle);circle=null}
    map.setView([20,0],2);setInfo('Tocá el mapa o pulsá «Mi ubicación»','Todavía no hay un punto seleccionado.')
   }
   // Embedded mobile views often animate the dialog and report a stale map size initially.
   requestAnimationFrame(()=>refreshMap(seq));
   setTimeout(()=>refreshMap(seq),120);
   setTimeout(()=>refreshMap(seq),450);
   setTimeout(()=>refreshMap(seq),1000);

  }catch(e){if(seq!==openVersion)return;loading('No se pudo iniciar el mapa',e.message,null);setInfo('Mapa no disponible',e.message+' Podés cerrar y usar las coordenadas.')}
 }
 function close(){
  ++openVersion;++requestId;++loadingGeneration;panel.hidden=true;
  loadingDone();
  if(config.onClose)config.onClose()
 }
 function detect(){
  if(!navigator.geolocation){setInfo('GPS no disponible','Este navegador no admite ubicación. Elegí un punto en el mapa.');return}
  if(!window.isSecureContext){setInfo('Ubicación bloqueada','El navegador exige HTTPS para pedir permiso de ubicación. Abrí la versión segura de la aplicación.');return}
  if(doc.permissionsPolicy?.allowsFeature&&!doc.permissionsPolicy.allowsFeature('geolocation')){
   setInfo('Permiso bloqueado por el sitio','El contenedor que muestra la aplicación no permite solicitar ubicación. Abrí la aplicación en una pestaña independiente.');return
  }
  setInfo('Solicitando permiso de ubicación…','Si es la primera vez, aceptá la solicitud del navegador. No se guardará el punto sin tu confirmación.');
  navigator.geolocation.getCurrentPosition(pos=>{
   const c=pos.coords;
   if(!setPoint(c.latitude,c.longitude,true))return;
   setInfo('Punto detectado · precisión ±'+Math.round(c.accuracy)+' m','Consultando un nombre cercano (puede no coincidir con el comercio)…');
   lookupPoint()
  },e=>{
   if(e.code===1){
    const blocked=doc.permissionsPolicy?.allowsFeature&&!doc.permissionsPolicy.allowsFeature('geolocation');
    setInfo('No se concedió acceso a la ubicación',blocked?'El sitio que contiene la aplicación bloqueó el GPS. Abrí la aplicación directamente en el navegador.':'Si rechazaste el permiso, pulsá «Mi ubicación» para intentarlo otra vez. Si el navegador lo bloqueó de forma permanente, solo sus ajustes pueden volver a habilitarlo.');
   }else setInfo('No se pudo obtener tu ubicación',e.code===2?'No hay señal de ubicación disponible. Podés escoger el punto manualmente.':'La solicitud tardó demasiado. Intentá de nuevo o seleccioná el punto manualmente.');
  },
  {enableHighAccuracy:true,maximumAge:0,timeout:20000})
 }
 function confirm(){
  if(!point)return;
  const selected={...point};
  if(config.onConfirm)config.onConfirm(selected);
  close()
 }
 return {open,close,detect,identify:lookupPoint,confirm,setPoint,
  setRadius(m){radius=Number(m)||805;if(circle)circle.setRadius(radius)},
  getSelected:()=>point?{...point}:null}
}
return Object.freeze({createMapPicker,coordsValid,coordinateLabel,nameFromReverse})
});

/* Control de horas — local prototype UI; no auth or Wix integration. */
(() => {
'use strict';
const E=window.NexoWorkTime,P=window.NexoWorkTimePayroll,G=window.NexoWorkTimeGeo,M=window.NexoWorkTimeMap;
const KEY='nexo.personal-work-time.prototype.v1';
const BREAK_SETTINGS_KEY='nexo.personal-work-time.break-settings.v1';
const GEO_SETTINGS_KEY='nexo.personal-work-time.geo-settings.v1';
const GEO_PENDING_KEY='nexo.personal-work-time.geo-pending.v1';
const MAX_AUTO_AGE_MS=86400000;
const $=id=>uiRoot.getElementById(id);
const $$=query=>uiRoot.querySelectorAll(query);
let state,selectedProfile='',selectedDay=localDate(new Date()),month=selectedDay.slice(0,7);
let reportWeekOffset=0,reportCapture=false,lastReportRefreshMinute=-1,lastEarningsRefreshMinute=-1;
let capturedMarkAt=null,pendingSuggestion=null,currentView='home',lastHiddenAt=null;
const CAPTURE_WINDOW_MS=5*60*1000;
let breakPreferences=readBreakPreferences();
let geoSettings=readLocalObject(GEO_SETTINGS_KEY),geoPending=readLocalObject(GEO_PENDING_KEY);
let geoMonitor=null,geoFormProfile=null,workplaceMap=null;
function localDate(v){const d=new Date(v);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function asInput(t){const d=new Date(t);return localDate(d)+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function fmt(t){return new Date(t).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})}
function hours(ms){return (ms/3600000).toFixed(2)+' h'}
function money(cents){return '$'+(cents/100).toFixed(2)}
function message(msg,bad=false){$('message').textContent=msg;$('message').style.color=bad?'#ffaeae':'#84ffe0'}
function save(next){state=next;localStorage.setItem(KEY,JSON.stringify(state));render()}
function profile(){return state.profiles.find(p=>p.id===selectedProfile)}
function payroll(){return P.project(state)}
const WEEKDAY_NAMES=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
function closeDay(profileItem){
 const start=Number(profileItem?.weekStartDay);
 return Number.isInteger(start)&&start>=0&&start<=6?(start+6)%7:0
}
function weekStartKeyFor(profileItem,now){
 const start=Number.isInteger(profileItem?.weekStartDay)?profileItem.weekStartDay:1;
 const d=new Date(now);d.setHours(12,0,0,0);
 d.setDate(d.getDate()-(d.getDay()-start+7)%7);
 return localDate(d)
}
function renderWeekClose(now=Date.now()){
 const p=profile(),banner=$('week-close-banner');
 const day=p?new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:p.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone}).format(now):'';
 const current=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(day);
 const closing=!!p&&current===closeDay(p);
 banner.hidden=!closing;
}
function validDate(v){const n=new Date(v).getTime();if(!Number.isFinite(n))throw Error('Fecha u hora inválida');return n}
function duration(s){let pause=s.breaks.reduce((n,b)=>n+(b.endAt-b.startAt),0);if(s.breakStartedAt!==null)pause+=Math.max(0,(s.closedAt??Date.now())-s.breakStartedAt);return Math.max(0,(s.closedAt??Date.now())-s.startedAt-pause)}
function profileSnapshot(p){return {profileId:p.id,profileName:p.name,place:p.place,rateCents:p.rateCents,taxBasisPoints:p.taxBasisPoints,overtimeAfterMilliseconds:p.overtimeAfterMilliseconds,overtimeMultiplierBasisPoints:p.overtimeMultiplierBasisPoints,weekStartDay:p.weekStartDay,timeZone:p.timeZone}}
function selectedShifts(){return state.shifts.filter(s=>s.profileId===selectedProfile&&localDate(s.startedAt)===selectedDay).sort((a,b)=>a.startedAt-b.startedAt)}
function renderHomeEarnings(projection,now=Date.now()){
 // Allocate each projected paid interval to calendar days. This preserves the
 // payroll engine's overtime/tax result and correctly handles overnight shifts.
 const portions=new Map();
 function allocate(id,from,to,unroundedCents){
  if(to<=from)return;
  let cursor=from;
  while(cursor<to){
   const date=new Date(cursor);
   const nextDay=new Date(date.getFullYear(),date.getMonth(),date.getDate()+1).getTime();
   const until=Math.min(to,nextDay);
   if(until<=cursor)break;
   const day=localDate(cursor);
   let entries=portions.get(id);
   if(!entries){entries=new Map();portions.set(id,entries)}
   const part=entries.get(day)||{weight:0,ms:0};
   part.weight+=unroundedCents*(until-cursor)/(to-from);
   part.ms+=until-cursor;
   entries.set(day,part);
   cursor=until
  }
 }
 for(const seg of projection.segments||[]){
  const regularEnd=seg.startAt+seg.regularMilliseconds;
  allocate(seg.shiftId,seg.startAt,regularEnd,seg.regularPayCentsUnrounded);
  allocate(seg.shiftId,regularEnd,seg.endAt,seg.overtimePayCentsUnrounded)
 }
 const days=new Map();
 const shiftProfiles=new Map(state.shifts.map(item=>[item.id,item.profileId]));
 const addDay=(key,cents,ms)=>{
  const value=days.get(key)||{cents:0,ms:0};
  value.cents+=cents;value.ms+=ms;days.set(key,value)
 };
 for(const pay of projection.shifts){
  const chunks=[...(portions.get(pay.shiftId)||new Map())].sort((a,b)=>a[0].localeCompare(b[0]));
  if(!chunks.length)continue;
  const totalWeight=chunks.reduce((n,[,v])=>n+v.weight,0);
  const totalDuration=chunks.reduce((n,[,v])=>n+v.ms,0);
  const shares=chunks.map(([key,v],i)=>{
   const fraction=totalWeight>0?v.weight/totalWeight:(totalDuration>0?v.ms/totalDuration:0);
   const exact=pay.netCents*fraction;
   const base=Math.floor(exact);
   return {key,ms:v.ms,cents:base,remainder:exact-base,index:i}
  });
  let remainder=pay.netCents-shares.reduce((n,v)=>n+v.cents,0);
  const ranked=[...shares].sort((a,b)=>b.remainder-a.remainder||a.index-b.index);
  for(let i=0;i<remainder;i++)ranked[i%ranked.length].cents++;
  for(const share of shares)addDay((shiftProfiles.get(pay.shiftId)||'')+'|'+share.key,share.cents,share.ms)
 }
 const todayKey=localDate(now),today={cents:0,ms:0},week={cents:0,ms:0};
 const weekStarts=new Map(state.profiles.map(p=>[p.id,weekStartKeyFor(p,now)]));
 for(const [compound,value] of days){
  const separator=compound.lastIndexOf('|');
  const profileId=compound.slice(0,separator),day=compound.slice(separator+1);
  if(day===todayKey){today.cents+=value.cents;today.ms+=value.ms}
  const begin=weekStarts.get(profileId);
  if(begin&&day>=begin&&day<=todayKey){week.cents+=value.cents;week.ms+=value.ms}
 }
 renderWeekClose(now);
 $('home-pay-today').textContent=money(today.cents);
 $('home-pay-week').textContent=money(week.cents);
 return days
}

function render(){
const p=profile();const a=E.active(state);
$('profile').replaceChildren();
for(const item of state.profiles){const o=document.createElement('option');o.value=item.id;o.textContent=item.name+' · '+item.place;$('profile').append(o)}
$('profile').value=selectedProfile;
$('profile-week-close').disabled=!p;$('save-profile-week-close').disabled=!p;$('profile-week-close').value=String(closeDay(p));
$('clock-in').disabled=!p||!!a;$('break-start').disabled=!a||a.breakStartedAt!==null;$('break-end').disabled=!a||a.breakStartedAt===null;$('clock-out').disabled=!a;
$('active-info').textContent=a?('En '+a.place+' · '+(a.breakStartedAt===null?'Trabajando':'En descanso')+' · Inicio '+new Date(a.startedAt).toLocaleString('es')):'No hay un turno activo.';
const calc=payroll(),sum=new Map(calc.shifts.map(x=>[x.shiftId,x]));
const all=state.shifts.filter(s=>s.profileId===selectedProfile),today=Date.now();
const currentWeek=p?P.weekKey(today,p.timeZone,p.weekStartDay):'';
const aggregate=items=>items.reduce((o,s)=>{const pay=sum.get(s.id);o.ms+=duration(s);o.net+=pay?.netCents||0;return o},{ms:0,net:0});
const total=aggregate(all),byDay=renderHomeEarnings(calc,today);
const begin=p?weekStartKeyFor(p,today):'';
const w={ms:0,net:0};
for(const [key,value] of byDay){
 if(!p||!key.startsWith(p.id+'|'))continue;
 const day=key.slice(p.id.length+1);
 if(day>=begin&&day<=localDate(today)){w.ms+=value.ms;w.net+=value.cents}
}
$('weekly-hours').textContent=hours(w.ms);$('weekly-pay').textContent=money(w.net);$('total-hours').textContent=hours(total.ms);$('total-pay').textContent=money(total.net);
renderCalendar();renderList(sum);renderDashboard();renderWeek();renderBreakSettings();renderProvisional();renderGeo();
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
   for(const b of shift.breaks||[]){ev.push({time:b.startAt,type:'Inicio de descanso'});ev.push({time:b.endAt,type:b.provisional?'Fin de descanso (provisional)':'Fin de descanso'})}
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

function weekClock(value){return value==null?'—':new Date(value).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit',hour12:false})}
function detailedHours(milliseconds){
 const minutes=Math.round(Math.max(0,milliseconds)/60000);
 return Math.floor(minutes/60)+'h'+(minutes%60?String(minutes%60).padStart(2,'0'):'')
}
function buildWeekReport(snapshot,profileId,offset=0,now=Date.now()){
 const profile=snapshot.profiles.find(x=>x.id===profileId)||null;
 const start=new Date(now),weekStart=Number.isInteger(profile?.weekStartDay)?profile.weekStartDay:1;
 start.setHours(12,0,0,0);
 start.setDate(start.getDate()-((start.getDay()-weekStart+7)%7)+7*offset);
 const end=new Date(start);end.setDate(start.getDate()+6);
 const pays=new Map(P.project(snapshot,now).shifts.map(x=>[x.shiftId,x]));
 const totals={workedMs:0,grossCents:0,taxCents:0,netCents:0,overtimeMs:0,provisional:0};
 const days=[];
 for(let i=0;i<7;i++){
  const dayDate=new Date(start);dayDate.setDate(start.getDate()+i);
  const key=localDate(dayDate);
  const shifts=snapshot.shifts.filter(s=>profile&&s.profileId===profile.id&&localDate(s.startedAt)===key).sort((a,b)=>a.startedAt-b.startedAt);
  const marks={entry:[],breakStart:[],breakEnd:[],exit:[]};
  const daily={workedMs:0,grossCents:0,taxCents:0,netCents:0,overtimeMs:0,provisional:0};
  for(const s of shifts){
   marks.entry.push({time:s.startedAt});
   for(const b of s.breaks||[]){
    marks.breakStart.push({time:b.startAt});
    marks.breakEnd.push({time:b.endAt,provisional:b.provisional===true});
    if(b.provisional===true)daily.provisional++
   }
   if(s.breakStartedAt!==null)marks.breakStart.push({time:s.breakStartedAt});
   if(s.closedAt!==null)marks.exit.push({time:s.closedAt});
   daily.workedMs+=duration(s);
   const pay=pays.get(s.id);
   if(pay){
    daily.grossCents+=pay.grossCents;daily.taxCents+=pay.taxCents;
    daily.netCents+=pay.netCents;daily.overtimeMs+=pay.overtimeMilliseconds
   }
  }
  for(const kind of Object.keys(daily))totals[kind]+=daily[kind];
  for(const group of Object.values(marks))group.sort((a,b)=>a.time-b.time);
  days.push({date:dayDate,key,shifts,marks,totals:daily,isToday:key===localDate(now)})
 }
 return {profile,start,weekEnd:end,days,totals}
}
function renderWeek(){
 const report=buildWeekReport(state,selectedProfile,reportWeekOffset);
 const selector=$('report-profile');selector.replaceChildren();
 for(const p of state.profiles){const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name+' · '+p.place;selector.append(opt)}
 selector.value=selectedProfile;selector.disabled=!state.profiles.length;
 $('report-place').textContent=report.profile?report.profile.name+' · '+report.profile.place:'Sin lugar configurado';
 const compactDate=d=>d.toLocaleDateString('es',{day:'numeric',month:'short'});
 $('report-dates').textContent=compactDate(report.start)+' – '+compactDate(report.weekEnd)+' '+report.weekEnd.getFullYear();
 $('report-current-week').disabled=reportWeekOffset===0;
 $('report-next-week').disabled=reportWeekOffset>=0;
 const rows=$('week-rows');rows.replaceChildren();
 function makeCell(text,options={}){
  const td=document.createElement('td');td.textContent=text;
  if(options.title)td.title=options.title;
  if(options.aria)td.setAttribute('aria-label',options.aria);
  if(options.provisional)td.className='report-estimated';
  if(options.empty)td.className='report-empty';
  return td
 }
 function markCell(marks){
  if(!marks.length)return makeCell('—',{empty:true});
  const first=marks[0],multiple=marks.length>1,provisional=marks.some(x=>x.provisional);
  return makeCell(weekClock(first.time)+(first.provisional?'~':'')+(multiple?'+':''),
   {provisional,title:marks.map(x=>weekClock(x.time)+(x.provisional?' (provisional)':'')).join(' · '),
    aria:'Marcas: '+marks.map(x=>weekClock(x.time)+(x.provisional?' provisional':'')).join(', ')})
 }
 for(const day of report.days){
  const tr=document.createElement('tr');if(day.isToday)tr.className='current-day';
  const first=document.createElement('td'),b=document.createElement('button');
  b.type='button';b.className='week-day-button';
  b.textContent=day.date.toLocaleDateString('es',{weekday:'short',day:'numeric'}).replace('.','');
  b.setAttribute('aria-label','Ver y editar las marcas del '+day.date.toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'}));
  b.onclick=()=>{selectedDay=day.key;month=day.key.slice(0,7);$('shift-form').hidden=true;render();showView('calendar')};
  first.append(b);if(day.shifts.length>1)first.title=day.shifts.length+' jornadas registradas';
  tr.append(first);
  tr.append(markCell(day.marks.entry),markCell(day.marks.breakStart),markCell(day.marks.breakEnd),markCell(day.marks.exit));
  tr.append(makeCell(day.shifts.length?detailedHours(day.totals.workedMs):'—',{empty:!day.shifts.length,title:'Horas de jornada registradas'}));
  tr.append(makeCell(day.shifts.length?money(day.totals.netCents):'—',{empty:!day.shifts.length,title:'Neto estimado después de retenciones'}));
  rows.append(tr)
 }
 $('week-total-hours').textContent=detailedHours(report.totals.workedMs);
 $('week-total-net').textContent=money(report.totals.netCents);
 $('week-total-gross').textContent=money(report.totals.grossCents);
 $('week-total-tax').textContent=money(report.totals.taxCents);
 $('week-total-overtime').textContent=detailedHours(report.totals.overtimeMs);
 $('week-total').textContent=(report.profile?'Tarifa actual: '+money(report.profile.rateCents)+'/h. ':'Configurá un lugar de trabajo. ')+
  (report.totals.provisional?report.totals.provisional+' regreso(s) del descanso pendientes de confirmar. ':'')+
  'Cifras estimadas según las tarifas y reglas de nómina del perfil.'
}
function setReportCapture(enabled){
 reportCapture=Boolean(enabled);
 const root=$$('.wt-app')[0];
 if(root)root.classList.toggle('report-capture-mode',reportCapture);
 $('report-capture').textContent=reportCapture?'Salir de captura':'Vista para captura';
 $('report-capture').setAttribute('aria-pressed',reportCapture?'true':'false')
}
function showView(view){
 currentView=view;
 for(const name of ['home','mark','settings','calendar','week'])$('view-'+name).hidden=name!==view;
 for(const button of $$('[data-nav]'))button.setAttribute('aria-current',button.dataset.nav===view?'page':'false');
 if(view!=='week')setReportCapture(false)
}




function readLocalObject(key){
 try{const data=JSON.parse(localStorage.getItem(key)||'{}');return data&&typeof data==='object'&&!Array.isArray(data)?data:{}}catch(_){return {}}
}
function geoFor(profileId){return geoSettings[profileId]||null}
function geoFeedback(text){$('geo-status').textContent=text}
function renderGeo(){
 const p=profile(),zone=geoFor(selectedProfile);
 if(geoFormProfile!==selectedProfile){
  geoFormProfile=selectedProfile;
  $('geo-enabled').checked=zone?.enabled===true;
  $('geo-lat').value=Number.isFinite(zone?.lat)?String(zone.lat):'';
  $('geo-lon').value=Number.isFinite(zone?.lon)?String(zone.lon):'';
  $('geo-radius').value=String(zone?.radiusMeters??805);
  $('geo-arrival').value=String(zone?.arrivalMinutes??20);
  $('geo-exit').value=String(zone?.exitMinutes??20);
  $('geo-place-label').value=zone?.label||'';
 }
 $('geo-profile-timezone').value=p?.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone||'No disponible';
 $('geo-choice-label').textContent=zone&&G.validZone(zone)?
  (zone.label||'Punto de trabajo guardado')+' · '+zone.lat.toFixed(5)+', '+zone.lon.toFixed(5):
  'Elegí un punto en el mapa o detectá tu ubicación; guardalo para crear la zona.';
 $('geo-start').disabled=!p||!zone?.enabled||!G.validZone(zone)||geoMonitor!==null;
 $('geo-stop').disabled=geoMonitor===null;
 $('geo-home-monitor').hidden=!geoMonitor;
 $('geo-home-monitor').textContent=geoMonitor?'GPS de '+(state.profiles.find(p=>p.id===geoMonitor.profileId)?.name||'trabajo')+' · '+(geoMonitor.paused?'pausado por pestaña oculta':'activo con esta página abierta'):'';
 renderGeoPending()
}
function renderGeoPending(){
 const proposal=geoPending[selectedProfile];
 $('geo-pending').hidden=!proposal;
 if(!proposal)return;
 $('geo-pending-label').textContent=proposal.kind==='entry'?'Entrada estimada':'Salida estimada';
 $('geo-pending-time').textContent=fmt(proposal.estimatedAt);
 $('geo-pending-info').textContent=proposal.kind==='entry'?
  'Permaneciste en la zona el tiempo configurado. Esta propuesta no modifica tu jornada hasta confirmarla.':
  'Nexo detectó tu salida y restó el margen configurado. Revisá la hora antes de registrarla.';
 $('geo-edit-form').hidden=true
}
function stopGeoMonitor(reason='Reconocimiento detenido. Tu ubicación ya no se consulta.'){
 if(geoMonitor){
  if(geoMonitor.watchId!==null)navigator.geolocation.clearWatch(geoMonitor.watchId);
  if(geoMonitor.pollId!==null)clearInterval(geoMonitor.pollId);
  geoMonitor=null
 }
 geoFeedback(reason);
 renderGeo()
}
function geolocationError(error){
 if(!geoMonitor)return;
 const reason=error?.code===1?'Permiso GPS denegado. Revisá los permisos de ubicación de Wix.':
  error?.code===2?'GPS no disponible. Comprobá los servicios de ubicación.':
  'No se obtuvo ubicación a tiempo; volveremos a intentar.';
 geoFeedback(reason);
 if(error?.code===1)stopGeoMonitor(reason)
}
function processGeoPosition(pos,monitor=geoMonitor){
 if(!monitor||monitor!==geoMonitor||document.visibilityState==='hidden')return;
 const zone=geoFor(monitor.profileId);
 if(!zone?.enabled||!G.validZone(zone)){stopGeoMonitor('Configuración GPS inválida o deshabilitada.');return}
 const now=Date.now();
 if(!Number.isFinite(pos.timestamp)||now-pos.timestamp>120000)return;
 const p={lat:pos.coords.latitude,lon:pos.coords.longitude,accuracy:pos.coords.accuracy};
 const result=G.observe(monitor.session,zone,p,now);
 monitor.session=result.session;
 const dist=Number.isFinite(result.distanceMeters)?result.distanceMeters+' m del punto':'posición no válida';
 geoFeedback('Reconocimiento '+(result.quality||'sin señal')+' · '+dist+
  (result.quality==='imprecisa'?' · precisión insuficiente; no se registran marcas.':''));
 if(!result.event)return;
 const entry=result.event.kind==='entry',observedAt=result.event.observedAt,estimatedAt=result.event.estimatedAt;
 const candidate={kind:result.event.kind,profileId:monitor.profileId,estimatedAt,observedAt,createdAt:now,source:'gps-foreground'};
 if(geoPending[monitor.profileId])return;
 const shift=E.active(state);
 if(entry){
  if(shift||state.shifts.some(s=>s.profileId===monitor.profileId&&localDate(s.startedAt)===localDate(estimatedAt)))return
 }else{
  if(!shift||shift.profileId!==monitor.profileId||shift.breakStartedAt!==null||estimatedAt<=shift.startedAt)return;
  const lastBreak=shift.breaks.length?shift.breaks[shift.breaks.length-1].endAt:shift.startedAt;
  if(estimatedAt<lastBreak)return;
  candidate.activeShiftId=shift.id
 }
 geoPending={...geoPending,[monitor.profileId]:candidate};
 localStorage.setItem(GEO_PENDING_KEY,JSON.stringify(geoPending));
 renderGeoPending();
 closeSuggestion(false);
 message((entry?'Entrada':'Salida')+' aproximada detectada. Confirmá o corregí la propuesta GPS.');
}
function saveGeoFromForm(){
 const p=profile();if(!p)throw Error('Primero agregá un lugar de trabajo');
 const zone={
  enabled:$('geo-enabled').checked,
  lat:Number($('geo-lat').value),lon:Number($('geo-lon').value),
  radiusMeters:Number($('geo-radius').value),arrivalMinutes:Number($('geo-arrival').value),
  exitMinutes:Number($('geo-exit').value),
  label:$('geo-place-label').value.trim().slice(0,100)
 };
 if($('geo-lat').value.trim()===''||$('geo-lon').value.trim()===''||!G.validZone(zone))
  throw Error('Coordenadas, radio o márgenes incorrectos');
 if(geoMonitor)stopGeoMonitor('GPS detenido al guardar un nuevo punto; iniciá reconocimiento nuevamente.');
 geoSettings={...geoSettings,[p.id]:zone};
 localStorage.setItem(GEO_SETTINGS_KEY,JSON.stringify(geoSettings));
 geoFormProfile=null;renderGeo();
 return p
}
async function openGeoMap(detect=false){
 if(!profile()){geoFeedback('Primero agregá un lugar de trabajo.');return}
 if(!M?.createMapPicker){geoFeedback('El selector de mapas no está disponible. Podés ingresar las coordenadas manualmente.');return}
 if(!workplaceMap){
  workplaceMap=M.createMapPicker({
   root:typeof uiRoot==='undefined'?document:uiRoot,document,
   onConfirm:chosen=>{
    $('geo-lat').value=String(Number(chosen.lat.toFixed(6)));
    $('geo-lon').value=String(Number(chosen.lon.toFixed(6)));
    if(chosen.label&&chosen.label!=='Ubicación aproximada')$('geo-place-label').value=chosen.label.slice(0,100);
    try{
     const p=saveGeoFromForm();
     geoFeedback('Guardaste el punto de '+(chosen.label||p.name)+'. Podés ajustar el radio o los márgenes y pulsar Guardar zona de nuevo.')
    }catch(e){geoFeedback(e.message||'No se pudo guardar el punto')}
   },
   onClose:()=>{
    const target=$('geo-open-map');if(target)target.focus()
   }
  })
 }
 const hasLat=$('geo-lat').value.trim()!=='',hasLon=$('geo-lon').value.trim()!=='';
 const lat=hasLat?Number($('geo-lat').value):null,lon=hasLon?Number($('geo-lon').value):null;
 const opening=workplaceMap.open({lat,lon,radiusMeters:Number($('geo-radius').value)||805});
 // Request GPS directly in the button gesture: awaiting a remote map library first
 // can lose transient user activation and prevent the browser permission prompt.
 if(detect)workplaceMap.detect();
 await opening
}
function resumeGeoMonitor(){
 const m=geoMonitor;if(!m||m.paused===false)return;
 if(!navigator.geolocation){stopGeoMonitor('Geolocalización no disponible.');return}
 m.paused=false;
 m.watchId=navigator.geolocation.watchPosition(pos=>processGeoPosition(pos,m),geolocationError,
  {enableHighAccuracy:false,maximumAge:15000,timeout:30000});
 m.pollId=setInterval(()=>navigator.geolocation.getCurrentPosition(pos=>processGeoPosition(pos,m),geolocationError,
  {enableHighAccuracy:false,maximumAge:0,timeout:20000}),60000);
 renderGeo()
}
function pauseGeoMonitor(){
 const m=geoMonitor;if(!m||m.paused)return;
 if(m.watchId!==null)navigator.geolocation.clearWatch(m.watchId);
 if(m.pollId!==null)clearInterval(m.pollId);
 m.watchId=null;m.pollId=null;m.paused=true;
 geoFeedback('GPS pausado con la pestaña oculta; no se detectarán entradas ni salidas en segundo plano.');
 renderGeo()
}
function startGeoMonitor(){
 if(!G){geoFeedback('Motor GPS no disponible.');return}
 const p=profile(),zone=geoFor(selectedProfile);
 if(!p||!zone?.enabled||!G.validZone(zone)){geoFeedback('Guardá primero un lugar de trabajo con la zona GPS habilitada.');return}
 if(!navigator.geolocation){geoFeedback('Este navegador no admite GPS.');return}
 if(geoMonitor)stopGeoMonitor();
 geoMonitor={profileId:p.id,session:G.emptySession(),paused:true,watchId:null,pollId:null};
 geoFeedback('Solicitando acceso a ubicación para esta sesión...');
 resumeGeoMonitor()
}
function confirmGeoCandidate(override){
 const candidate=geoPending[selectedProfile];
 if(!candidate)throw Error('Ya no hay una propuesta GPS pendiente');
 const at=override==null?candidate.estimatedAt:validDate(override),now=Date.now();
 if(at>now||now-at>36*3600000)throw Error('La hora propuesta debe estar dentro de las últimas 36 horas, sin ser futura');
 freshState();
 if(!state.profiles.some(p=>p.id===candidate.profileId)||candidate.profileId!==selectedProfile)throw Error('El lugar de trabajo cambió');
 let next;
 if(candidate.kind==='entry'){
  if(E.active(state)||state.shifts.some(s=>s.profileId===candidate.profileId&&localDate(s.startedAt)===localDate(at)))throw Error('Ya existe una jornada en esa fecha o una jornada abierta');
  next=E.start(state,candidate.profileId,at)
 }else{
  const shift=E.active(state);
  if(!shift||shift.id!==candidate.activeShiftId||shift.profileId!==candidate.profileId||shift.breakStartedAt!==null)throw Error('La jornada cambió; revisá el registro antes de confirmar');
  next=E.transition(state,E.TYPES.END,at)
 }
 delete geoPending[candidate.profileId];
 localStorage.setItem(GEO_PENDING_KEY,JSON.stringify(geoPending));
 save(next);
 showView('home');
 message('Marca GPS aproximada confirmada a las '+fmt(at)+'.')
}

function readBreakPreferences(){
 try{const v=JSON.parse(localStorage.getItem(BREAK_SETTINGS_KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch(_){return {}}
}
function prefsFor(profileId){
 const p=breakPreferences[profileId]||{};
 return {enabled:p.enabled===true,
  durationMinutes:Number.isInteger(p.durationMinutes)&&p.durationMinutes>=1&&p.durationMinutes<=240?p.durationMinutes:30,
  toleranceMinutes:Number.isInteger(p.toleranceMinutes)&&p.toleranceMinutes>=0&&p.toleranceMinutes<=120?p.toleranceMinutes:5}
}
function renderBreakSettings(){
 const prefs=prefsFor(selectedProfile),p=profile();
 $('break-auto-enabled').checked=prefs.enabled;
 $('break-duration').value=String(prefs.durationMinutes);
 $('break-tolerance').value=String(prefs.toleranceMinutes);
 for(const e of $('break-settings-form').querySelectorAll('input,button'))e.disabled=!p;
 $('break-settings-note').textContent=p?'Regreso provisional después de '+(prefs.durationMinutes+prefs.toleranceMinutes)+' minutos ('+prefs.durationMinutes+' + '+prefs.toleranceMinutes+').':'Primero agregá un lugar de trabajo.'
}
function latestProvisional(){
 const list=[];
 for(const shift of state.shifts.filter(s=>s.profileId===selectedProfile)){
  for(let i=0;i<(shift.breaks||[]).length;i++){
   const b=shift.breaks[i];
   if(b.provisional===true&&b.source==='auto-break')list.push({shift,breakIndex:i,break:b})
  }
 }
 return list.sort((a,b)=>b.break.endAt-a.break.endAt)[0]||null
}
function renderProvisional(){
 const item=latestProvisional();$('provisional-panel').hidden=!item;
 if(!item)return;
 const count=state.shifts.filter(s=>s.profileId===selectedProfile).reduce((n,s)=>n+(s.breaks||[]).filter(b=>b.provisional===true&&b.source==='auto-break').length,0);
 $('provisional-time').textContent=fmt(item.break.endAt);
 $('provisional-detail').textContent='Estimación del '+new Date(item.break.endAt).toLocaleDateString('es',{day:'numeric',month:'short'})+' · '+item.shift.place+(count>1?' · '+count+' pendientes':'');
 const undoable=item.shift.closedAt===null&&item.shift.breakStartedAt===null&&item.breakIndex===item.shift.breaks.length-1;
 $('undo-provisional').disabled=!undoable;
 $('undo-provisional').title=undoable?'Reabrir descanso sin perder su inicio':'Hay marcas posteriores: corregí la hora';
 $('provisional-edit-form').hidden=true
}
function checkAutoBreak(silent=false){
 const raw=localStorage.getItem(KEY);if(!raw)return false;
 const snap=JSON.parse(raw);
 if(snap?.schemaVersion!==1||!Array.isArray(snap.shifts)||!Array.isArray(snap.profiles))return false;
 const active=E.active(snap);if(!active||active.breakStartedAt===null)return false;
 const cfg=prefsFor(active.profileId);if(!cfg.enabled)return false;
 const now=Date.now(),target=active.breakStartedAt+(cfg.durationMinutes+cfg.toleranceMinutes)*60000;
 if(now<target||target<active.breakStartedAt||now-active.breakStartedAt>MAX_AUTO_AGE_MS)return false;
 if(localStorage.getItem(KEY)!==raw)return false;
 const transitioned=E.transition(snap,E.TYPES.BREAK_END,target);
 const next={...transitioned,shifts:transitioned.shifts.map(shift=>{
  if(shift.id!==active.id)return shift;
  const breaks=shift.breaks.slice(),index=breaks.length-1;
  breaks[index]={...breaks[index],provisional:true,source:'auto-break',createdAt:now,
   expectedMinutes:cfg.durationMinutes,toleranceMinutes:cfg.toleranceMinutes};
  return {...shift,breaks}
 })};
 if(localStorage.getItem(KEY)!==raw)return false;
 localStorage.setItem(KEY,JSON.stringify(next));
 state=next;selectedProfile=active.profileId;
 closeSuggestion(false);render();
 if(!silent)message('Regreso estimado a las '+fmt(target)+'. Confirmá o corregí la marca provisional.');
 return true
}
function updateProvisional(action,value){
 freshState();
 const item=latestProvisional();if(!item)throw Error('La marca provisional ya no existe');
 const {shift,breakIndex,break:b}=item;
 let revised;
 if(action==='confirm'){
  revised={...shift,breaks:shift.breaks.map((v,i)=>i===breakIndex?{...v,provisional:false,confirmedAt:Date.now()}:v)}
 }else if(action==='edit'){
  const end=validDate(value),limit=Math.min(shift.closedAt??Date.now(),Date.now(),shift.breaks[breakIndex+1]?.startAt??Infinity);
  if(end<=b.startAt||end>limit)throw Error('La hora corregida debe quedar entre el inicio del descanso y la siguiente marca');
  revised={...shift,breaks:shift.breaks.map((v,i)=>i===breakIndex?{...v,endAt:end,provisional:false,confirmedAt:Date.now(),corrected:true}:v)}
 }else if(action==='undo'){
  if(shift.closedAt!==null||shift.breakStartedAt!==null||breakIndex!==shift.breaks.length-1)throw Error('Existen marcas posteriores. Solo podés corregir la hora');
  revised={...shift,breaks:shift.breaks.slice(0,-1),breakStartedAt:b.startAt}
 }else throw Error('Operación no permitida');
 save({...state,shifts:state.shifts.map(s=>s.id===shift.id?revised:s)});
 return action
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
 if(currentView!=='home'||!$('suggest-backdrop').hidden||latestProvisional()||geoPending[selectedProfile])return;
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
 if(event.key===BREAK_SETTINGS_KEY){breakPreferences=readBreakPreferences();renderBreakSettings();return}
 if(event.key===GEO_SETTINGS_KEY){geoSettings=readLocalObject(GEO_SETTINGS_KEY);geoFormProfile=null;if(geoMonitor)stopGeoMonitor('Se actualizó la zona GPS en otra pestaña.');else renderGeo();return}
 if(event.key===GEO_PENDING_KEY){geoPending=readLocalObject(GEO_PENDING_KEY);renderGeoPending();return}
 if(event.key!==KEY)return;
 try{
  if(event.newValue)freshState();
  else {state=E.blank();selectedProfile=''}
  closeSuggestion(false);render();showView('home');message('Jornada actualizada desde otra pestaña.');
 }catch(e){message('No se pudieron leer los cambios de otra pestaña',true)}
}
function onReturnToApp(){
 if(document.visibilityState==='hidden'){lastHiddenAt=Date.now();pauseGeoMonitor();return}
 if(geoMonitor&&geoMonitor.paused)resumeGeoMonitor();
 if(!localStorage.getItem(KEY)){lastHiddenAt=null;return}
 try{
  freshState();
  if(!checkAutoBreak())render();
  if(lastHiddenAt&&Date.now()-lastHiddenAt>=120000&&currentView==='home'&&$('suggest-backdrop').hidden)proposeNextMark();
  lastHiddenAt=null
 }catch(e){message('No se pudo recuperar el descanso',true)}
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
$('profile-form').onsubmit=e=>{e.preventDefault();guard(()=>{const f=e.currentTarget,fd=new FormData(f);const next=E.addProfile(state,{name:fd.get('name'),place:fd.get('place'),hourlyRate:fd.get('hourlyRate'),taxEnabled:Number(fd.get('taxPercent'))>0,taxPercent:fd.get('taxPercent'),overtimeAfterHours:fd.get('overtimeAfterHours'),overtimeMultiplier:fd.get('overtimeMultiplier'),weekStartDay:(Number(fd.get('weekCloseDay'))+1)%7});selectedProfile=next.profiles[next.profiles.length-1].id;save(next);f.reset();f.hidden=true})};
$('profile').onchange=e=>{if(geoMonitor)stopGeoMonitor('GPS detenido al cambiar de lugar de trabajo.');selectedProfile=e.target.value;render()};
$('save-profile-week-close').onclick=()=>{
 const p=profile();
 if(!p){message('Primero creá un lugar de trabajo.',true);return}
 const closing=Number($('profile-week-close').value);
 if(!Number.isInteger(closing)||closing<0||closing>6){message('Seleccioná un día válido.',true);return}
 const nextStart=(closing+1)%7;
 if(p.weekStartDay===nextStart){message('El cierre de '+p.place+' ya es el '+WEEKDAY_NAMES[closing]+'.');return}
 // Keep the workplace's shift snapshots consistent with the configured payroll week.
 const next={
  ...state,
  profiles:state.profiles.map(item=>item.id===p.id?{...item,weekStartDay:nextStart}:item),
  shifts:state.shifts.map(item=>item.profileId===p.id?{...item,weekStartDay:nextStart}:item)
 };
 save(next);
 message('Cierre semanal actualizado: '+WEEKDAY_NAMES[closing]+'. Se recalcularon las semanas de '+p.place+'.')
};
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


$('geo-use-current').onclick=()=>openGeoMap(true);
$('geo-open-map').onclick=()=>openGeoMap(false);
$('geo-map-detect').onclick=()=>{if(workplaceMap)workplaceMap.detect()};
$('geo-map-identify').onclick=()=>{if(workplaceMap)workplaceMap.identify()};
$('geo-map-save').onclick=()=>{if(workplaceMap)workplaceMap.confirm()};
$('geo-map-close').onclick=()=>{if(workplaceMap)workplaceMap.close()};
$('geo-map-cancel').onclick=()=>{if(workplaceMap)workplaceMap.close()};
$('geo-form').onsubmit=event=>{
 event.preventDefault();
 try{
  const p=saveGeoFromForm();
  geoFeedback('Zona guardada para '+p.name+'. El GPS permanece apagado hasta que pulses Iniciar.')
 }catch(e){geoFeedback(e.message||'No se pudo guardar la zona')}
};
$('geo-start').onclick=startGeoMonitor;
$('geo-stop').onclick=()=>stopGeoMonitor();
$('geo-confirm').onclick=()=>{try{confirmGeoCandidate()}catch(e){message(e.message,true)}};
$('geo-discard').onclick=()=>{
 if(!geoPending[selectedProfile])return;
 delete geoPending[selectedProfile];localStorage.setItem(GEO_PENDING_KEY,JSON.stringify(geoPending));
 renderGeoPending();message('Propuesta GPS descartada. Ningún registro fue modificado.')
};
$('geo-edit').onclick=()=>{
 const c=geoPending[selectedProfile];if(!c)return;
 $('geo-edit-time').value=asInput(c.estimatedAt);
 $('geo-edit-form').hidden=false;
 $('geo-edit-time').focus()
};
$('geo-edit-cancel').onclick=()=>{$('geo-edit-form').hidden=true};
$('geo-edit-form').onsubmit=e=>{
 e.preventDefault();
 try{confirmGeoCandidate($('geo-edit-time').value)}catch(error){message(error.message||'No se pudo corregir hora GPS',true)}
};

$('break-settings-form').onsubmit=event=>{
 event.preventDefault();
 try{
  const p=profile();if(!p)throw Error('Primero agregá un lugar de trabajo');
  const fd=new FormData(event.currentTarget),duration=Number(fd.get('duration')),tolerance=Number(fd.get('tolerance'));
  if(!Number.isInteger(duration)||duration<1||duration>240)throw Error('Duración permitida: 1 a 240 minutos');
  if(!Number.isInteger(tolerance)||tolerance<0||tolerance>120)throw Error('Tolerancia permitida: 0 a 120 minutos');
  breakPreferences={...breakPreferences,[p.id]:{enabled:fd.get('enabled')==='on',durationMinutes:duration,toleranceMinutes:tolerance}};
  localStorage.setItem(BREAK_SETTINGS_KEY,JSON.stringify(breakPreferences));
  renderBreakSettings();
  if(!checkAutoBreak(true))render();
  message('Configuración de descanso guardada. Las nuevas marcas serán provisionales.')
 }catch(e){message(e.message||'No se pudo guardar el descanso',true)}
};
$('confirm-provisional').onclick=()=>{try{updateProvisional('confirm');message('Hora estimada confirmada.')}catch(e){message(e.message,true)}};
$('edit-provisional').onclick=()=>{
 const item=latestProvisional();if(!item)return;
 $('provisional-end-at').value=asInput(item.break.endAt);
 $('provisional-edit-form').hidden=false;$('provisional-end-at').focus()
};
$('cancel-provisional-edit').onclick=()=>{$('provisional-edit-form').hidden=true};
$('provisional-edit-form').onsubmit=e=>{
 e.preventDefault();
 try{updateProvisional('edit',$('provisional-end-at').value);message('Hora de regreso corregida.')}
 catch(err){message(err.message||'No se pudo corregir la hora',true)}
};
$('undo-provisional').onclick=()=>{try{updateProvisional('undo');message('Estimación descartada. El descanso sigue abierto.')}catch(e){message(e.message,true)}};
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

$('report-profile').onchange=e=>{if(geoMonitor)stopGeoMonitor('GPS detenido al cambiar de lugar de trabajo.');selectedProfile=e.target.value;render()};
$('report-prev-week').onclick=()=>{reportWeekOffset--;renderWeek()};
$('report-next-week').onclick=()=>{if(reportWeekOffset<0){reportWeekOffset++;renderWeek()}};
$('report-current-week').onclick=()=>{reportWeekOffset=0;renderWeek()};
$('report-capture').onclick=()=>setReportCapture(!reportCapture);
$('report-open-calendar').onclick=()=>{selectedDay=localDate(new Date());month=selectedDay.slice(0,7);render();showView('calendar')};
$('prev-month').onclick=()=>changeMonth(-1);$('next-month').onclick=()=>changeMonth(1);
function changeMonth(step){const [y,m]=month.split('-').map(Number);const d=new Date(y,m-1+step,1);month=localDate(d).slice(0,7);selectedDay=month+'-01';render()}
$('new-shift').onclick=()=>{if(!profile()){message('Primero agrega un lugar de trabajo',true);return}const f=$('shift-form');f.reset();f.hidden=false;f.elements.id.value='';f.elements.startedAt.value=selectedDay+'T09:00';f.elements.closedAt.value=selectedDay+'T17:00';f.elements.breakMinutes.value=0;f.scrollIntoView({behavior:'smooth',block:'nearest'})};
$('cancel-shift').onclick=()=>{$('shift-form').hidden=true};
$('shift-form').onsubmit=e=>{e.preventDefault();guard(()=>{const f=e.currentTarget,p=profile();if(!p)throw Error('Selecciona un perfil');const start=validDate(f.elements.startedAt.value),end=validDate(f.elements.closedAt.value),mins=Number(f.elements.breakMinutes.value);if(end<=start)throw Error('La salida debe ser posterior a la entrada');if(!Number.isInteger(mins)||mins<0||mins*60000>=end-start)throw Error('Descanso inválido');const existingId=f.elements.id.value,old=state.shifts.find(s=>s.id===existingId);if(existingId&&!old)throw Error('La jornada ya no existe');if(old&&old.closedAt===null)throw Error('Finaliza el turno antes de editarlo');const shift={...(old||profileSnapshot(p)),id:old?.id||('manual-'+Date.now()+'-'+Math.random().toString(36).slice(2)),startedAt:start,closedAt:end,breakStartedAt:null,breaks:mins?[{startAt:end-mins*60000,endAt:end}]:[]};const next={...state,shifts:existingId?state.shifts.map(s=>s.id===existingId?shift:s):[...state.shifts,shift]};if(next.shifts.filter(s=>s.closedAt===null).length>1)throw Error('Solo puede haber un turno activo');save(next);f.hidden=true;selectedDay=localDate(start);month=selectedDay.slice(0,7);render()})};
try{state=JSON.parse(localStorage.getItem(KEY)||'null')||E.blank();if(state.schemaVersion!==1||!Array.isArray(state.profiles)||!Array.isArray(state.shifts))throw Error('Formato inválido');selectedProfile=E.active(state)?.profileId||state.profiles[0]?.id||'';render();showView('home');checkAutoBreak();proposeNextMark()}
catch(err){state=E.blank();render();showView('home');message('No se pudieron cargar los datos locales: '+err.message,true)}
const breakMonitor=setInterval(()=>{try{checkAutoBreak()}catch(e){message('No se pudo comprobar descanso automático: '+e.message,true)}},15000);
const clockTimer=setInterval(()=>{
 if(typeof uiRoot!=='undefined'&&!uiRoot.host?.isConnected){
  clearInterval(clockTimer);
  clearInterval(breakMonitor);
  if(geoMonitor)stopGeoMonitor('GPS detenido al cerrar la aplicación.');
  if(workplaceMap)workplaceMap.close();
  window.removeEventListener('storage',onStorageUpdate);
  document.removeEventListener('visibilitychange',onReturnToApp);
  return
 }
 updateClock();
 const currentMinute=Math.floor(Date.now()/60000);
 if(currentView==='home'&&currentMinute!==lastEarningsRefreshMinute){
  lastEarningsRefreshMinute=currentMinute;
  renderHomeEarnings(payroll(),Date.now())
 }
 if(currentView==='week'&&currentMinute!==lastReportRefreshMinute){
  lastReportRefreshMinute=currentMinute;renderWeek()
 }
},1000);
})();
window.__nexoWorkTimeApp=true;
window.__nexoWorkTimeVersion=APP_VERSION
}catch(error){
window.__nexoWorkTimeApp=false;
const status=uiRoot.getElementById('message');
if(status){status.textContent='No se pudo iniciar Horas de trabajo: '+(error?.message||String(error));status.style.color='#ffbfc5'}
}
})();