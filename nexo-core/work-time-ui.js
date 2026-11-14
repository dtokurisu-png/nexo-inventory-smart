/* Nexo Group / Horas - map picker v3, manual opt-in geo naming via Photon demo */
(function(){
'use strict';
const APP_VERSION="20261114-phase6-charts-1";
const ROOT_ID='nxo-work-time-app';
if(!decodeURIComponent(location.pathname).replace(/\/+$/,'').endsWith('/blank-2'))return;
if(window.__nexoWorkTimeApp&&window.__nexoWorkTimeVersion===APP_VERSION&&document.getElementById(ROOT_ID))return;
const prior=document.getElementById(ROOT_ID);if(prior)prior.remove();
const host=document.createElement('section');host.id=ROOT_ID;
host.setAttribute('aria-label','Horas de trabajo · Nexo Group');
host.style.cssText='position:fixed;inset:0;width:100%;height:100dvh;z-index:2147483100;overflow-y:auto;overscroll-behavior:contain;background:#121316;color:#f7f8fb;isolation:isolate';
const uiRoot=host.attachShadow({mode:'open'}),style=document.createElement('style');
style.textContent="\n:host{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#f7f8fb;color-scheme:dark;--nx-ui-rgb:255,255,255;--nx-fluid-rgb:255,255,255;--nx-text-rgb:255,255,255;--line:rgba(var(--nx-ui-rgb),.42)}\n*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;background:#121316}\n.wt-app{min-height:100dvh;position:relative;isolation:isolate;overflow:hidden;background:radial-gradient(ellipse at 58% 112%,#75767d3b,transparent 63%),linear-gradient(150deg,#08090b 1%,#202124 58%,#37383d 100%);color:#f7f8fb}\n\n/* Light, continuous liquid sheet. No bottom rounded vessel or separate bubble mounds. */\n.ambient{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none;color:rgb(var(--nx-fluid-rgb));isolation:isolate}\n.oil-scene{display:block;width:100%;height:100%;overflow:hidden;contain:layout paint;shape-rendering:geometricPrecision}\n.oil-scene .oil-sheet{fill:url(#oil-sheet-shade)}\n.oil-scene .oil-band{fill:none;stroke:rgba(var(--nx-fluid-rgb),.12);stroke-width:9;stroke-linecap:round}\n.oil-scene .oil-glint{fill:none;stroke:rgba(var(--nx-fluid-rgb),.32);stroke-width:1.5;stroke-linecap:round}\n.oil-scene .oil-trace{fill:none;stroke:rgba(var(--nx-fluid-rgb),.13);stroke-width:3.2;stroke-linecap:round}\n.oil-scene .oil-top-film{fill:none;stroke:rgba(var(--nx-fluid-rgb),.07);stroke-width:6;stroke-linecap:round}\n.oil-scene .oil-bridge{stroke:none}\n.oil-scene .oil-bubble-shape{fill:url(#oil-bubble-shade);stroke:rgba(var(--nx-fluid-rgb),.26);stroke-width:1.1}\n.oil-scene .oil-return-drop{fill:rgba(var(--nx-fluid-rgb),.085);stroke:rgba(var(--nx-fluid-rgb),.10);stroke-width:.7}\n@media(prefers-reduced-motion:reduce){.oil-scene{opacity:.6}}\n.shell{max-width:880px;margin:auto;padding:24px clamp(16px,4vw,42px) 70px;position:relative;z-index:1}\n.topbar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:17px;border-bottom:1px solid #ffffff44}\n.brand{border:0;background:transparent;color:#f9f9fa;display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.17em;font-weight:600;cursor:pointer;padding:8px 0}\n.brand-dot{width:9px;height:9px;border-radius:50%;background:#e4e7eb;box-shadow:0 0 16px #edf5ff6b}\n.nav{display:flex;gap:5px}.nav-btn,.back{border:0;background:transparent;color:#f4f5f7;cursor:pointer;min-width:40px;height:40px;border-radius:8px;display:grid;place-items:center}\n.nav-btn:hover,.nav-btn[aria-current=\"page\"],.back:hover{background:#ffffff21}\nsvg{width:21px;height:21px}\n#message{font-size:13px;text-align:center;min-height:24px;padding:10px 2px;color:#e7eaed}\n.view{animation:appear .2s ease}@keyframes appear{from{opacity:.4;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}\n.home{text-align:center;max-width:610px;margin:auto;padding:clamp(30px,8vh,90px) 0 0}\n.eyebrow{font-size:11px;color:#d6d8dd;letter-spacing:.2em;font-weight:600}.dim{color:#b7bcc5}\n.week-close-banner{margin:10px auto 2px;padding:0;max-width:480px;background:transparent;border:0;color:#f7f8fb;text-align:center}\n.week-close-banner strong{display:block;font-size:11px;letter-spacing:.14em;font-weight:600}\n\n.profile-week-close-controls{display:flex;gap:8px;align-items:end;flex-wrap:wrap;margin-top:12px}\n.profile-week-close-controls label{flex:1 1 190px}.profile-week-close-controls button{flex:0 1 auto}\n.profile-week-close-note{margin:9px 0 0;color:#aeb9c1;font-size:12px;line-height:1.5}\n.today-date{margin:16px 0 3px;color:#cbd0d8;font-size:clamp(14px,3.5vw,17px);text-transform:capitalize}\n.clock{font-size:clamp(64px,13vw,112px);font-variant-numeric:tabular-nums;letter-spacing:-.065em;line-height:1.19;font-weight:200;text-shadow:0 12px 45px #0009}.seconds{font-size:.27em;color:#b7bcc3;letter-spacing:0;margin-left:8px}\n.last-card{margin:40px auto 11px;text-align:left;max-width:480px;padding:20px 22px;border-top:1px solid var(--line);border-left:1px solid var(--line);border-radius:12px 0 0 0;background:linear-gradient(150deg,#ffffff0b,transparent)}\n.last-line{display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-top:12px}\n.last-line strong{font-size:clamp(23px,6vw,33px);font-weight:350;font-variant-numeric:tabular-nums}\n.last-line span{font-size:14px;color:#e1e4e8;text-align:right}\n.home-status,.hint{font-size:12px;color:#bfc4cd}.home-status{min-height:22px}\n.plus{width:82px;height:82px;border-radius:50%;border:1px solid #ffffffb8;background:#ffffff10;display:grid;place-items:center;margin:37px auto 11px;color:white;cursor:pointer;box-shadow:0 18px 55px #0009;transition:transform .2s,background .2s}\n.plus svg{width:34px;height:34px;stroke-width:1.3}.plus:hover{transform:scale(1.07);background:#ffffff26}.hint{letter-spacing:.14em}\n.home-pay-inline{max-width:480px;margin:0 auto 13px;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:0 4px;color:#d1d4db;font-size:13px;font-variant-numeric:tabular-nums}\n.home-pay-inline span{display:inline-flex;align-items:baseline;gap:8px;white-space:nowrap}\n.home-pay-inline strong{color:#fff;font-size:16px;font-weight:500}\n.section-title{display:flex;align-items:center;gap:12px;margin:27px 0 20px}.section-title h1{font-weight:350;font-size:clamp(24px,5vw,34px);margin:0;letter-spacing:-.04em}\n.panel{padding:18px 20px;margin:15px 0;border-left:1px solid var(--line);border-top:1px solid var(--line);border-radius:12px 0 0 0;background:linear-gradient(140deg,#ffffff0b,#0000000d)}\n.panel h2{font-size:17px;margin:0 0 15px;font-weight:500}.subtle{color:#b8bec6;font-size:13px;line-height:1.65}\nlabel{display:grid;gap:7px;color:#d0d4db;font-size:13px}\ninput,select{font:inherit;width:100%;color:white;background:#222328;border:1px solid #ffffff55;border-radius:6px;padding:9px 11px;min-height:42px}\nbutton{font:inherit}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}\n.btn{cursor:pointer;color:white;border:1px solid #ffffff66;background:#ffffff15;border-radius:7px;padding:9px 13px;min-height:42px}\n.btn:hover{background:#ffffff29}.btn.primary{background:#e6e8ec;color:#101114;border-color:#e6e8ec;font-weight:650}\n.btn.danger{color:#ffdadd;border-color:#e5adb3b0;background:#7b33332e}\nbutton:disabled{opacity:.31;cursor:not-allowed}\n.mark-grid,.fields,.metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.mark-grid{margin:25px 0}.mark{padding:17px;text-align:left;min-height:110px;cursor:pointer;color:white;background:#ffffff0d;border:0;border-top:1px solid #ffffff9a;border-left:1px solid #ffffff9a;border-radius:12px 0 0 0}\n.mark span{display:block;color:#afb6bf;font-size:21px;margin-bottom:22px}.mark:hover:not(:disabled){background:#ffffff23}\n.fields{margin:17px 0}.metrics .metric{padding:16px;border-top:1px solid #ffffff61;border-left:1px solid #ffffff61;border-radius:10px 0 0 0;color:#b7bec7;font-size:12px}\n.metric strong{display:block;color:white;font-weight:400;font-size:24px;margin-top:8px}\n.calendar-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.calendar-head h2{margin:0;text-transform:capitalize}\n.calendar{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;margin-top:15px}.weekday{text-align:center;color:#bfc4cd;font-size:12px;padding:8px 0}\n.day{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:62px;color:white;border:1px solid #ffffff33;border-radius:5px;background:#ffffff08;cursor:pointer}\n.day small{font-size:10px;color:#c2d2d1}.day.outside{opacity:.2;border:0}.day.selected{border-color:#fff;background:#ffffff26}\n.shift{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid #ffffff32}.shift:last-child{border:0}.shift small{display:block;color:#b8c0ca;margin-top:5px}.empty{padding:17px 0;color:#b5bbc3}\n.table-scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}th,td{padding:10px 8px;text-align:left;border-bottom:1px solid #ffffff27;white-space:nowrap}th{color:#bcc2ca;font-weight:500}\nfooter{font-size:11px;text-align:center;color:#969da8;line-height:1.6;padding-top:40px}\n:focus-visible{outline:2px solid #e0e5ed;outline-offset:3px}\n@media(max-width:580px){.shell{padding:15px 16px 60px}.fields,.metrics{grid-template-columns:1fr}.panel{padding:14px}.mark{min-height:98px;padding:13px}.last-card{margin-top:30px}.clock{font-size:clamp(61px,15vw,85px)}.day{min-height:48px}.day small{font-size:8px}.shift{align-items:start;flex-direction:column}}\n@media(prefers-reduced-motion:reduce){.view{animation:none}.plus{transition:none}}\n\n/* Fase 2: confirmación contextual sin convertir una visita en una marca obligatoria */\n.mark-stamp{font-size:13px;line-height:1.7;color:#b9bec6;margin:8px 0 0;letter-spacing:.015em}\n.suggest-backdrop{position:fixed;inset:0;z-index:30;background:rgba(6,7,9,.82);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(9px)}\n.suggest-dialog{width:min(100%,480px);max-height:min(90vh,620px);overflow-y:auto;border-left:1px solid #eff1f3a8;border-top:1px solid #eff1f3a8;border-radius:16px 2px 2px 2px;padding:clamp(22px,5vw,36px);box-shadow:0 26px 90px #000c;background:linear-gradient(145deg,#292a2e,#151618 72%)}\n.suggest-kicker{font-size:11px;letter-spacing:.19em;color:#bfc5cc;font-weight:650}\n.suggest-dialog h2{font-size:clamp(22px,5vw,30px);font-weight:380;line-height:1.27;letter-spacing:-.04em;margin:17px 0 12px;color:#fff}\n.suggest-dialog p{color:#c0c4cb;font-size:14px;line-height:1.6;margin:0}\n.suggest-time{font-size:clamp(38px,11vw,55px);font-variant-numeric:tabular-nums;letter-spacing:-.055em;font-weight:250;margin:23px 0 27px}\n.suggest-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}\n.suggest-actions button{min-width:0;min-height:44px}\n.suggest-actions .primary{grid-column:1/-1;grid-row:1}\n@media(max-width:400px){.suggest-backdrop{padding:12px}.suggest-dialog{padding:23px 18px}.suggest-actions{gap:6px}}\n\n/* Fase 3 · estimaciones de regreso del descanso, verificables y reversibles */\n.break-settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}\n.break-toggle{display:flex;gap:10px;align-items:flex-start;line-height:1.55;color:#eceef0}\n.break-toggle input{width:19px;min-height:19px;height:19px;flex:0 0 19px;accent-color:#f1f2f4;margin-top:2px}\n.break-toggle span{font-size:13px}\n.break-explainer{font-size:12px;line-height:1.65;color:#adb3be}\n.provisional-panel{text-align:left;max-width:530px;margin:23px auto 0;border-top:1px solid #e6e9efaa;border-left:1px solid #e6e9efaa;border-radius:13px 0 0;padding:16px;background:#ffffff10}\n.provisional-panel h2{font-size:14px;color:#f4f5f7;font-weight:550;letter-spacing:.02em;margin:0 0 8px}\n.provisional-panel .provisional-warning{color:#e0d2bb;font-size:12px;line-height:1.6}\n.provisional-panel .provisional-time{font-size:23px;font-weight:350;margin:11px 0 5px;font-variant-numeric:tabular-nums}\n.provisional-controls{display:flex;flex-wrap:wrap;gap:7px;margin-top:13px}\n.provisional-controls .btn{min-height:39px;font-size:12px}\n.provisional-edit{display:grid;gap:10px;margin:13px 0 0}\n.provisional-edit .btn{width:fit-content}\n#break-settings-note{min-height:15px}\n@media(max-width:580px){.break-settings-grid{grid-template-columns:1fr}.provisional-controls .btn{flex:1}}\n\n/* Fase 4 · resumen semanal capturable, legible en pantalla móvil */\n.report-view{max-width:940px;margin:0 auto}\n.report-toolbar{display:flex;justify-content:space-between;gap:12px;align-items:end;margin:0 0 17px}\n.report-profile-label{width:min(100%,330px);font-size:12px}\n.report-profile-label select{min-width:0}\n.report-week-navigation{display:flex;gap:6px;align-items:center;white-space:nowrap}\n.report-week-navigation .report-nav{font-size:25px;width:43px;padding:3px 8px}\n.report-current{font-size:12px}\n.report-paper{border-top:1px solid #f3f4f5a8;border-left:1px solid #f3f4f5a8;border-radius:13px 0 0 0;background:linear-gradient(150deg,#ffffff0e,#111215c5);padding:20px 18px 16px}\n.report-header h2{font-size:clamp(20px,4.7vw,28px);margin:10px 0 12px;font-weight:360;letter-spacing:-.035em}\n.report-overline{letter-spacing:.15em;font-size:10px;color:#b6bcc5;font-weight:650}\n.report-overline span{color:#f1f2f5}\n.report-header-bottom{display:flex;justify-content:space-between;gap:9px;font-size:12px;color:#cfd2d7;line-height:1.5;margin-bottom:17px}\n.report-header-bottom span:first-child{font-weight:600;color:#fff}\n.report-scroll{overflow-x:auto}\n.report-table{border-collapse:collapse;width:100%;min-width:0;table-layout:fixed}\n.report-table th,.report-table td{border-bottom:1px solid #e3e6eb29;padding:12px 5px;font-size:clamp(10px,1.4vw,12px);text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums;vertical-align:middle}\n.report-table th:first-child,.report-table td:first-child{text-align:left;width:14%}\n.report-table th:nth-child(2),.report-table th:nth-child(3),.report-table th:nth-child(4),.report-table th:nth-child(5){width:13%}\n.report-table th:nth-child(6){width:14%}\n.report-table th:nth-child(7){width:20%}\n.report-table thead th{font-weight:550;color:#d0d4dc;border-bottom:1px solid #ffffff6a}\n.report-table tbody tr:nth-child(even){background:#ffffff07}\n.report-table tbody tr.current-day{background:#ffffff18}\n.report-table .week-day-button{padding:3px 0;background:transparent;border:0;color:inherit;text-align:left;cursor:pointer;font:inherit;text-decoration:underline;text-decoration-color:#ffffff4c;text-underline-offset:3px;white-space:nowrap}\n.report-table .week-day-button:hover{color:#fff;text-decoration-color:#fff}\n.report-table .report-empty{color:#7e858f}\n.report-table .report-estimated{color:#f1d2a8}\n.report-table .report-more{color:#cad1db;font-size:10px;margin-left:1px}\n.report-table tfoot th,.report-table tfoot td{border-bottom:0;border-top:1px solid #ffffffa8;font-weight:700;font-size:clamp(11px,1.6vw,13px);color:#f9fafb;padding-top:16px}\n.report-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;padding:16px 0 4px;border-top:1px solid #ffffff2b}\n.report-metrics>div{display:grid;gap:6px}\n.report-metrics span{color:#b1b6c0;font-size:11px}\n.report-metrics strong{font-size:clamp(14px,2.2vw,17px);font-weight:500;font-variant-numeric:tabular-nums}\n.report-caption,.report-legend{color:#b9bec8;font-size:11px;line-height:1.5;margin:10px 0 0}\n.report-legend{color:#a2a9b3}\n.report-estimated-key{color:#f1d2a8;font-weight:700}\n.report-actions{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 0}\n.report-help{font-size:12px;line-height:1.6;color:#aeb4be}\n.wt-app.report-capture-mode .topbar,.wt-app.report-capture-mode #message,.wt-app.report-capture-mode footer,.wt-app.report-capture-mode .report-title,.wt-app.report-capture-mode .report-toolbar,.wt-app.report-capture-mode #report-open-calendar,.wt-app.report-capture-mode .report-help{display:none}\n.wt-app.report-capture-mode .shell{max-width:980px;padding-top:11px}\n.wt-app.report-capture-mode .report-paper{padding-top:22px}\n.wt-app.report-capture-mode .report-actions{justify-content:flex-end}\n@media(max-width:660px){\n .report-toolbar{align-items:stretch;flex-direction:column}\n .report-profile-label{width:100%}\n .report-week-navigation{justify-content:space-between}\n .report-paper{padding:15px 7px 12px}\n .report-table th,.report-table td{padding:10px 2px;font-size:10px;letter-spacing:-.035em}\n .report-table th:first-child,.report-table td:first-child{width:13%}\n .report-table th:nth-child(2),.report-table th:nth-child(3),.report-table th:nth-child(4),.report-table th:nth-child(5){width:13%}\n .report-table th:nth-child(6){width:15%}\n .report-table th:nth-child(7){width:20%}\n .report-header{padding:0 5px}\n .report-header-bottom{font-size:11px;display:grid;gap:2px}\n .report-metrics{padding-left:4px;padding-right:4px}\n .report-metrics strong{font-size:14px}\n .wt-app.report-capture-mode .shell{padding:8px 6px 45px}\n}\n@media(max-width:360px){.report-table th,.report-table td{font-size:9px;padding:9px 1px}.report-paper{padding:13px 4px 11px}.report-metrics strong{font-size:12px}.report-legend{font-size:10px}}\n@media print{\n .wt-app{background:#18191c!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}\n .topbar,#message,footer,.report-title,.report-toolbar,.report-actions,.report-help{display:none!important}\n .shell{width:100%;max-width:none;padding:0}\n .report-paper{padding:15px}\n .report-scroll{overflow:visible}\n .view:not(#view-week){display:none!important}\n}\n\n/* GPS foreground opt-in. No map or third-party trackers. */\n.geo-panel{position:relative}\n.geo-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:13px 0}\n.geo-grid label{min-width:0}\n.geo-info{color:#bec4cc;font-size:12px;line-height:1.65}\n.geo-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}\n.geo-actions .btn{min-height:42px}\n.geo-status{font-size:12px;color:#c5ced8;line-height:1.6;margin:12px 0}\n.geo-pending{margin:15px auto 20px;max-width:530px;padding:18px;border-top:1px solid #bce1f4a8;border-left:1px solid #bce1f4a8;border-radius:12px 0 0;background:#c0d9ef11;text-align:left}\n.geo-pending strong{font-weight:530}\n.geo-pending-time{display:block;font-size:26px;margin:9px 0;color:#f4f7f9;font-variant-numeric:tabular-nums}\n.geo-pending p{color:#c7d0d9;line-height:1.55;font-size:12px}\n.geo-pending .actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px}\n.geo-pending .actions .btn{font-size:12px}\n.geo-home-monitor{color:#c2cbd5;font-size:12px;line-height:1.5;margin:10px auto}\n@media(max-width:520px){.geo-grid{grid-template-columns:1fr}.geo-pending{padding:14px}.geo-pending .actions .btn{flex:1}}\n\n/* Nexo: map selection dialog and place recommendation, mobile-first */\n.geo-map-launch{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin:10px 0}\n.geo-map-launch .btn{flex:1 1 180px}\n.geo-map-backdrop{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.82);padding:12px;backdrop-filter:blur(8px)}\n.geo-map-dialog{width:min(100%,750px);max-height:94dvh;display:flex;flex-direction:column;overflow:hidden;border:1px solid #ffffff7a;border-radius:13px;background:#1b1d20;box-shadow:0 30px 80px #000b}\n.geo-map-heading{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:16px 16px 9px}\n.geo-map-heading h2{font-size:19px;font-weight:500;letter-spacing:-.02em;margin:0}\n.geo-map-heading button{border:0;background:transparent;color:#fff;border-radius:7px;padding:5px 9px;font-size:22px}\n.geo-map-info{padding:0 16px 9px;color:#c0c6cf;font-size:12px;line-height:1.55}\n.geo-map-viewport{position:relative;flex:0 0 auto;width:100%;height:min(54dvh,490px);min-height:235px;isolation:isolate;background:#30343a;overflow:hidden}\n.geo-map-stage{display:block;width:100%;height:100%;min-height:100%;background:#30343a;position:relative;z-index:1;touch-action:pan-x pan-y}\n.geo-map-diagnostic{padding:5px 12px;min-height:28px;flex:0 0 auto;font-size:11px;color:#c7d1d9;background:#24272b;overflow-wrap:anywhere}\n.geo-map-stage .leaflet-container{font-family:system-ui,Arial,sans-serif}\n.geo-map-loader{position:absolute;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;background:#262b32ed;color:#f9fcff;padding:20px;text-align:center;pointer-events:none}\n.geo-map-loader strong{font-size:15px;font-weight:600}.geo-map-loader small{font-size:12px;color:#cbd7e0;line-height:1.5;max-width:320px}\n.geo-map-loader-track{height:9px;width:min(84%,310px);border-radius:9px;overflow:hidden;background:#59616b}\n.geo-map-loader-fill{height:100%;width:30%;background:#f7f8fb;border-radius:9px;transition:width .2s ease}\n.geo-map-loader:not([data-determinate=\"true\"]) .geo-map-loader-fill{animation:geo-map-pulse 1.4s ease-in-out infinite}\n@keyframes geo-map-pulse{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}\n@media(prefers-reduced-motion:reduce){.geo-map-loader-fill{animation:none!important;transition:none!important}}\n.geo-map-stage .leaflet-control-attribution{font-size:10px!important;color:#212121!important}\n.geo-map-stage .leaflet-control-attribution a{color:#074a73!important}\n.geo-map-stage .leaflet-control-zoom a{color:#171b23!important}\n.geo-map-result{padding:13px 16px 4px;font-size:13px;min-height:57px;line-height:1.4}\n.geo-map-result strong{display:block;color:#fff;font-weight:600}\n.geo-map-result span{color:#bdc5cf;display:block;margin-top:3px;font-size:12px}\n.geo-map-actions{display:flex;flex-wrap:wrap;gap:7px;padding:10px 16px 16px}\n.geo-map-actions .btn{flex:1;min-width:108px}\n.geo-map-preview{display:flex;gap:10px;margin:7px 0 0;align-items:start;color:#c4cbd3;font-size:12px;line-height:1.5}\n.geo-map-preview .geo-dot{width:8px;height:8px;flex:0 0 auto;border-radius:50%;background:#8ee3c5;margin-top:5px}\n.geo-map-hint{color:#afb6c2;font-size:12px;margin:9px 0}\n.geo-timezone-note{font-size:12px;color:#bfc7d3}\n@media(max-width:550px){.geo-map-backdrop{padding:6px}.geo-map-dialog{max-height:98dvh}.geo-map-heading{padding:12px 12px 8px}.geo-map-viewport{height:49dvh;min-height:220px}.geo-map-info,.geo-map-result{padding-left:12px;padding-right:12px}.geo-map-actions{padding:9px 12px 13px}.geo-map-actions .btn{font-size:12px;padding:9px 5px}}\n\n\n/* The black surfaces remain fixed. Only originally light elements can change. */\n.wt-app{color:rgb(var(--nx-text-rgb))}\n.wt-app :is(.eyebrow,.week-close-banner,.today-date,.clock,.last-line,.home-status,.hint,.home-pay-inline,.home-pay-inline strong,h1,h2,h3,p,label,small,footer,.metric,.metric strong,.mark,.mark span,.btn:not(.primary),.brand,.nav-btn,.back,.subtle,th,td,.last-line span,.last-line strong,.geo-status,.geo-info,.geo-choice-label){color:rgb(var(--nx-text-rgb))}\n.wt-app :is(.dim,.hint,.today-date,.subtle,small,footer,.home-status,.home-pay-inline){opacity:.85}\n.wt-app .btn.primary,.wt-app .btn.primary *{color:#101114}\n.wt-app :is(.topbar,.last-card,.panel,.mark,.metric,.day,.btn:not(.primary),input:not(.tone-range),select,.week-day-button){border-color:rgba(var(--nx-ui-rgb),.45)}\n.wt-app :is(.last-card,.panel,.mark,.metric){border-top-color:rgba(var(--nx-ui-rgb),.5);border-left-color:rgba(var(--nx-ui-rgb),.5)}\n.wt-app .plus{border-color:rgba(var(--nx-ui-rgb),.75)}\n.wt-app :is(.brand-dot,.btn.primary){background-color:rgb(var(--nx-ui-rgb));border-color:rgb(var(--nx-ui-rgb))}\n.wt-app :is(.panel,.last-card,.mark){background-image:linear-gradient(140deg,rgba(var(--nx-ui-rgb),.045),transparent)}\n.wt-app .btn:not(.primary){background-color:rgba(var(--nx-ui-rgb),.06)}\n.wt-app .btn:not(.primary):hover{background-color:rgba(var(--nx-ui-rgb),.12)}\n.wt-app :focus-visible{outline-color:rgb(var(--nx-ui-rgb))}\n.tone-open{margin:0 0 16px;border-color:rgba(var(--nx-ui-rgb),.5)}\n.tone-overlay{position:fixed;inset:0;z-index:1600;background:#0000008c;display:flex;align-items:center;justify-content:center;padding:15px;isolation:isolate}\n.tone-editor{width:min(100%,680px);padding:22px 18px;border-radius:12px;background:#101114;border:1px solid rgba(var(--nx-ui-rgb),.44);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:19px;box-shadow:0 16px 60px #000a}\n.tone-fields{display:grid;gap:20px;min-width:0}\n.tone-row{display:grid;grid-template-columns:72px minmax(0,1fr);align-items:center;gap:12px;font-size:13px;color:rgb(var(--nx-text-rgb))}\n.tone-range{appearance:none!important;-webkit-appearance:none!important;display:block!important;width:100%!important;min-height:0!important;height:9px!important;border:0!important;padding:0!important;margin:0!important;border-radius:999px!important;outline-offset:6px;background:linear-gradient(to right,#fff 0%,#fff 3%,#ff7777 13%,#ffe66a 26%,#71f7a4 40%,#78e7ff 54%,#809bff 70%,#c68eff 85%,#ff7777 100%)!important;cursor:pointer}\n.tone-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:19px;height:19px;background:#fff;border:2px solid #17191d;border-radius:50%;box-shadow:0 0 0 1px #ffffffaa}\n.tone-range::-moz-range-thumb{width:17px;height:17px;background:#fff;border:2px solid #17191d;border-radius:50%}\n.tone-buttons{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}\n.tone-save,.tone-cancel{background:transparent;border:1px solid rgba(var(--nx-ui-rgb),.60);border-radius:8px;color:rgb(var(--nx-text-rgb));padding:10px 13px;min-height:38px;cursor:pointer}\n.tone-save{background:rgb(var(--nx-ui-rgb));color:#101114;font-weight:600}\n.tone-cancel{font-size:18px;line-height:1;width:38px;padding:7px}\n@media(max-width:480px){.tone-editor{padding:18px 13px;gap:9px}.tone-row{grid-template-columns:60px minmax(0,1fr);gap:7px;font-size:12px}.tone-save{padding:8px 9px;font-size:12px}}\n\n/* Compact multi-workplace timesheet and a small, accessible capture help. */\n.report-table .report-day-label{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}\n.report-table .report-work-tag{font-size:10px;min-width:20px;flex:0 0 auto;font-weight:750;letter-spacing:.02em;color:rgb(var(--nx-text-rgb));opacity:.75}\n.report-table .week-day-button{font-size:inherit;min-width:0;line-height:1.35}\n.report-table tbody .report-no-shifts{text-align:center;color:#aeb4be;padding:17px 0}\n.report-header-bottom{justify-content:flex-end;margin-bottom:14px}\n.report-rates{margin:12px 0 0;font-size:12px;line-height:1.65;color:rgb(var(--nx-text-rgb))}\n.report-rate-line{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap;margin:3px 0}\n.report-rate-line span+span{opacity:.82}\n.report-actions{align-items:center}\n.report-capture-tools{display:inline-flex;gap:7px;align-items:center}\n.report-info{width:22px;height:22px;min-width:22px;border-radius:50%;padding:0;border:1px solid rgba(var(--nx-ui-rgb),.72);color:rgb(var(--nx-text-rgb));background:transparent;cursor:pointer;font-size:12px;font-weight:650;line-height:1}\n.report-info-backdrop{position:fixed;inset:0;z-index:1700;display:flex;align-items:center;justify-content:center;padding:15px;background:#000a}\n.report-info-dialog{position:relative;background:#141518;border:1px solid rgba(var(--nx-ui-rgb),.5);border-radius:12px;padding:25px 18px 18px;width:min(100%,360px);text-align:left;box-shadow:0 20px 56px #000a}\n.report-info-dialog strong{font-size:15px;font-weight:600}\n.report-info-dialog p{font-size:13px;line-height:1.6;margin:13px 0 19px}\n.report-info-close{position:absolute;top:7px;right:9px;border:0;background:transparent;color:rgb(var(--nx-text-rgb));font-size:22px;cursor:pointer;min-width:30px;min-height:30px}\n.wt-app.report-capture-mode .report-money,.wt-app.report-capture-mode .report-metrics,.wt-app.report-capture-mode .report-rates,.wt-app.report-capture-mode #report-capture-info{display:none!important}\n.wt-app.report-capture-mode .report-table th:first-child,.wt-app.report-capture-mode .report-table td:first-child{width:19%}\n.wt-app.report-capture-mode .report-table th:nth-child(2),.wt-app.report-capture-mode .report-table th:nth-child(3),.wt-app.report-capture-mode .report-table th:nth-child(4),.wt-app.report-capture-mode .report-table th:nth-child(5){width:16%}\n.wt-app.report-capture-mode .report-table th:nth-child(6){width:17%}\n@media(max-width:660px){.report-table .report-work-tag{font-size:9px;min-width:17px}.report-table .report-day-label{gap:3px}.report-table th:first-child,.report-table td:first-child{width:18%}.report-table th:nth-child(2),.report-table th:nth-child(3),.report-table th:nth-child(4),.report-table th:nth-child(5){width:12%}.report-table th:nth-child(6){width:14%}.report-table th:nth-child(7){width:20%}}\n@media print{.report-money,.report-metrics,.report-rates,.report-info-backdrop{display:none!important}}\n\n\n/* Per-workplace pastel tags for workweek boundaries; only a quarter-opacity\n   gradient covers a beginning-of-week calendar tile. */\n.day{position:relative;overflow:hidden;isolation:isolate}\n.day .calendar-week-end{position:absolute;top:4px;right:4px;width:9px;height:9px;border-radius:50%;border:1px solid #ffffff40;pointer-events:none}\n.day .calendar-date-number{position:relative;z-index:1;font-variant-numeric:tabular-nums}\n.day .calendar-off-label{font-size:10px;font-weight:750;letter-spacing:.08em;color:rgb(var(--nx-text-rgb));position:relative;z-index:1}\n.day .calendar-work-hours{position:relative;z-index:1}\n.day.selected{box-shadow:inset 0 0 0 1px rgba(var(--nx-ui-rgb),.65)}\n.calendar-off-picker{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:13px;margin-top:15px;padding-top:12px;border-top:1px solid rgba(var(--nx-ui-rgb),.14)}\n.calendar-off-picker>span,.profile-color-settings>span{font-size:12px;color:rgb(var(--nx-text-rgb));opacity:.85;white-space:nowrap}\n.calendar-off-options,.tag-palette{display:flex;gap:7px;align-items:center;flex-wrap:wrap}\n.calendar-off-tag{display:inline-flex;align-items:center;justify-content:center;min-width:42px;min-height:30px;padding:4px 9px;border:1px solid rgba(var(--nx-ui-rgb),.34);border-radius:7px;background:#ffffff0b;color:rgb(var(--nx-text-rgb));font-size:12px;font-weight:650;letter-spacing:.05em;cursor:pointer}\n.calendar-off-tag[aria-pressed=\"true\"]{border-color:var(--work-tag);background:var(--work-tag-wash);box-shadow:inset 0 0 0 1px var(--work-tag-wash)}\n.calendar-off-tag[aria-pressed=\"true\"]::after{content:\" OFF\";font-size:9px;letter-spacing:0;font-weight:700;margin-left:3px}\n.profile-color-settings{display:flex;gap:13px;align-items:center;flex-wrap:wrap;margin:13px 0}\n.tag-palette{gap:10px}\n.tag-palette button{display:block;min-width:0;min-height:0;width:25px;height:25px;padding:0;border-radius:50%;border:2px solid #0005;cursor:pointer;outline-offset:3px}\n.tag-palette button[aria-pressed=\"true\"]{box-shadow:0 0 0 2px rgb(var(--nx-ui-rgb));border-color:#161719}\n@media(max-width:400px){.calendar-off-picker{grid-template-columns:1fr;gap:8px}.day .calendar-week-end{width:7px;height:7px;top:3px;right:3px}.calendar-off-tag{min-width:37px;padding:4px 7px;font-size:11px}}\n\n/* Nexo settings: quiet summary-first cards, actions only on expansion. */\n.settings-compact{padding:15px 16px;margin-bottom:12px}\n.settings-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}\n.settings-heading h2{font-size:16px;font-weight:550;margin:0;letter-spacing:-.02em}\n.settings-info-trigger{display:grid;place-items:center;flex:none;width:23px;height:23px;min-height:0;border:1px solid rgba(var(--nx-ui-rgb),.48);border-radius:50%;background:transparent;color:rgb(var(--nx-text-rgb));font:600 12px system-ui;cursor:pointer}\n.settings-stack{display:grid;gap:5px}\n.settings-item{border:1px solid rgba(var(--nx-ui-rgb),.13);border-radius:9px;background:rgba(var(--nx-ui-rgb),.025);overflow:hidden}\n.settings-item-button{width:100%;display:flex;align-items:center;gap:8px;min-width:0;padding:11px 9px;text-align:left;background:transparent;border:0;color:rgb(var(--nx-text-rgb));cursor:pointer;font:inherit}\n.settings-item-name{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:550}\n.settings-item-meta{color:rgb(var(--nx-text-rgb));opacity:.80;flex:none;white-space:nowrap;font-size:11px;font-variant-numeric:tabular-nums}\n.settings-item-arrow{font-size:12px;opacity:.65;display:block;transition:transform .2s}\n.settings-item[data-expanded=true] .settings-item-arrow{transform:rotate(180deg)}\n.settings-item-dot{width:10px;height:10px;border-radius:50%;flex:none;box-shadow:0 0 0 2px #ffffff0a}\n.settings-item-detail{padding:0 11px 12px 27px;font-size:12px;line-height:1.6;color:rgb(var(--nx-text-rgb))}\n.settings-item-detail[hidden]{display:none!important}\n.settings-item-detail .btn{font-size:11px;margin-top:8px;padding:8px 11px}\n.settings-detail-grid{display:flex;flex-wrap:wrap;gap:6px 14px;opacity:.84}\n.settings-detail-grid span{white-space:normal}\n.settings-location-label{display:grid;flex:1;min-width:0;gap:3px}\n.settings-location-label strong{font-size:12px;font-weight:550;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n.settings-location-label small{font-size:10px;opacity:.72;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.settings-compact>.actions{margin-top:12px}\n.settings-compact>.actions .btn{font-size:12px}\n.settings-edit-form{margin-top:13px;padding:13px 0 2px;border-top:1px solid rgba(var(--nx-ui-rgb),.22)}\n.settings-edit-form[hidden],.settings-info-backdrop[hidden]{display:none!important}\n.settings-edit-form h3{font-size:14px;font-weight:550;margin:0 0 13px}\n.settings-edit-form .fields{gap:11px}\n.settings-edit-form .btn{font-size:12px}\n.settings-form-note{font-size:11px;opacity:.72;line-height:1.55;margin-top:9px}\n.settings-break-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 0}\n.settings-break-summary>div{display:grid;gap:4px}\n.settings-break-summary strong{font-size:16px;font-weight:550;letter-spacing:.02em}\n.settings-break-summary small{font-size:11px;opacity:.7}\n.settings-state{border:1px solid rgba(var(--nx-ui-rgb),.3);padding:4px 9px;border-radius:999px;font-size:11px}\n.settings-info-backdrop{position:fixed;inset:0;z-index:1800;display:flex;align-items:center;justify-content:center;padding:18px;background:#000b}\n.settings-info-dialog{position:relative;width:min(100%,400px);padding:22px 18px 18px;border-radius:13px;background:#17181c;border:1px solid rgba(var(--nx-ui-rgb),.4);box-shadow:0 25px 70px #000b}\n.settings-info-dialog h3{font-size:16px;font-weight:550;margin:0 25px 14px 0}\n.settings-info-dialog p{font-size:13px;line-height:1.7;margin:0 0 17px;color:rgb(var(--nx-text-rgb))}\n.settings-info-close{position:absolute;right:8px;top:5px;background:transparent;border:0;color:rgb(var(--nx-text-rgb));font-size:24px;cursor:pointer;min-width:32px;min-height:32px}\n@media(max-width:460px){.settings-compact{padding:13px 11px}.settings-item-button{gap:6px;padding:11px 7px}.settings-item-name{font-size:12px}.settings-item-meta{font-size:10px}.settings-item-detail{padding-left:19px}}\n\n/* Tag-colored comparison charts. Lightweight SVG, no external dependencies. */\n.chart-view{max-width:970px;margin:0 auto}\n.chart-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin:0 0 15px}\n.chart-tab{border:1px solid rgba(var(--nx-ui-rgb),.25);background:rgba(var(--nx-ui-rgb),.045);color:rgb(var(--nx-text-rgb));border-radius:8px;padding:11px 5px;min-height:39px;cursor:pointer;font-size:12px}\n.chart-tab[aria-selected=\"true\"]{border-color:rgba(var(--nx-ui-rgb),.76);background:rgba(var(--nx-ui-rgb),.18);font-weight:700}\n.chart-period-bar{display:flex;align-items:center;gap:7px;flex-wrap:nowrap;margin-bottom:8px}\n.chart-period-title{flex:1;min-width:0;text-align:center;color:rgb(var(--nx-text-rgb));font-size:13px;font-weight:580;text-transform:capitalize}\n.chart-arrow{font-size:23px;min-width:38px;padding:3px 9px}\n.chart-today{font-size:11px;padding:8px 10px;min-width:0}\n.chart-card{padding:16px 12px 12px;margin:0}\n.chart-legend{display:flex;align-items:center;flex-wrap:wrap;gap:9px 17px;margin:0 0 12px}\n.chart-legend-item{display:inline-flex;align-items:center;gap:7px;font-size:12px;min-width:0;color:rgb(var(--nx-text-rgb));}\n.chart-legend-dot{display:inline-block;flex:none;width:10px;height:10px;border-radius:3px;background:var(--chart-place-color)}\n.chart-scroll{width:100%;overflow-x:auto;overflow-y:hidden;overscroll-behavior-inline:contain;scrollbar-width:thin;-webkit-overflow-scrolling:touch}\n.work-chart{display:block;max-width:none;height:336px;overflow:visible}\n.chart-selection{min-height:33px;padding:8px 5px 1px;font-size:12px;color:rgb(var(--nx-text-rgb));line-height:1.45}\n.chart-note{font-size:11px;line-height:1.6;margin:6px 5px 0;color:rgb(var(--nx-text-rgb));opacity:.74}\n.chart-bar{cursor:pointer}\n.chart-bar:focus{outline:2px solid rgb(var(--nx-ui-rgb));outline-offset:2px}\n.chart-summaries{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:11px}\n.chart-summary{padding:14px;border-top:1px solid rgba(var(--nx-ui-rgb),.36);border-left:1px solid rgba(var(--nx-ui-rgb),.36);border-radius:10px 0 0;background:rgba(var(--nx-ui-rgb),.045)}\n.chart-summary-header{display:flex;align-items:center;gap:9px;margin-bottom:10px}\n.chart-summary-header strong{font-size:13px;font-weight:600;flex:1}\n.chart-summary-grid{display:grid;grid-template-columns:1fr auto;gap:6px 12px;align-items:baseline;font-size:12px}\n.chart-summary-grid span{opacity:.78}\n.chart-summary-grid strong{font-size:12px;font-weight:600;text-align:right;font-variant-numeric:tabular-nums}\n.chart-total-card{border-color:rgba(var(--nx-ui-rgb),.65)}\n@media(max-width:510px){.chart-card{padding:13px 7px}.chart-period-bar{gap:4px}.chart-period-title{font-size:11px}.chart-summaries{grid-template-columns:1fr}.chart-tab{font-size:11px}.chart-legend{padding-left:5px;gap:8px 11px}.chart-legend-item{font-size:11px}}\n";
const screen=document.createElement('div');screen.innerHTML="<div class=\"wt-app\"><div class=\"ambient\" aria-hidden=\"true\">\n<svg id=\"oil-scene\" class=\"oil-scene\" viewBox=\"0 0 1000 1000\" preserveAspectRatio=\"none\" focusable=\"false\">\n<defs id=\"oil-definitions\">\n<linearGradient id=\"oil-sheet-shade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n<stop offset=\"0%\" style=\"stop-color:rgb(var(--nx-fluid-rgb));stop-opacity:.26\"/>\n<stop offset=\"24%\" style=\"stop-color:rgb(var(--nx-fluid-rgb));stop-opacity:.09\"/>\n<stop offset=\"70%\" style=\"stop-color:rgb(var(--nx-fluid-rgb));stop-opacity:.15\"/>\n<stop offset=\"100%\" style=\"stop-color:rgb(var(--nx-fluid-rgb));stop-opacity:.24\"/>\n</linearGradient>\n<radialGradient id=\"oil-bubble-shade\" cx=\".32\" cy=\".22\" r=\".86\">\n<stop offset=\"0%\" style=\"stop-color:rgb(var(--nx-fluid-rgb));stop-opacity:.41\"/>\n<stop offset=\"47%\" style=\"stop-color:rgb(var(--nx-fluid-rgb));stop-opacity:.15\"/>\n<stop offset=\"100%\" style=\"stop-color:rgb(var(--nx-fluid-rgb));stop-opacity:.035\"/>\n</radialGradient>\n</defs>\n<g id=\"oil-returns\"></g>\n<path class=\"oil-top-film\" id=\"oil-film-path\"/>\n<path class=\"oil-sheet\" id=\"oil-sheet-path\"/>\n<path class=\"oil-band\" id=\"oil-band-path\"/>\n<path class=\"oil-trace\" id=\"oil-trace-path\"/>\n<path class=\"oil-glint\" id=\"oil-glint-path\"/>\n<g id=\"oil-bridges\"></g>\n<g id=\"oil-rising\"></g>\n</svg>\n</div>\n<main class=\"shell\">\n<header class=\"topbar\"><button class=\"brand\" type=\"button\" data-nav=\"home\"><span class=\"brand-dot\"></span>NEXO / HORAS</button><nav class=\"nav\" aria-label=\"Secciones\"><button class=\"nav-btn\" type=\"button\" data-nav=\"week\" title=\"Resumen semanal\" aria-label=\"Resumen semanal\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M9 6h12M9 12h12M9 18h12M3 6h2M3 12h2M3 18h2\"/></svg></button><button class=\"nav-btn\" type=\"button\" data-nav=\"charts\" title=\"Gráficas\" aria-label=\"Gráficas\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 3v18h18\"/><rect x=\"6\" y=\"12\" width=\"3.3\" height=\"6\" rx=\".6\"/><rect x=\"11.4\" y=\"8\" width=\"3.3\" height=\"10\" rx=\".6\"/><rect x=\"16.8\" y=\"5\" width=\"3.3\" height=\"13\" rx=\".6\"/></svg></button><button class=\"nav-btn\" type=\"button\" data-nav=\"calendar\" title=\"Calendario\" aria-label=\"Calendario\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 3v4M17 3v4M3 10h18\"/></svg></button><button class=\"nav-btn\" type=\"button\" data-nav=\"settings\" title=\"Ajustes\" aria-label=\"Ajustes\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"m10 2-.5 2.2-2 1-2.1-.7-2 3.4L5 9.5v2.5l-1.6 1.5 2 3.4 2.1-.7 2 1L10 20h4l.5-2.8 2-1 2.1.7 2-3.4L19 12V9.5l1.6-1.6-2-3.4-2.1.7-2-1L14 2z\"/></svg></button></nav></header>\n<div id=\"message\" role=\"status\" aria-live=\"polite\"></div>\n<section id=\"view-home\" class=\"view home\">\n<div class=\"eyebrow\">MI JORNADA</div><div id=\"week-close-banner\" class=\"week-close-banner\" hidden role=\"status\" aria-live=\"polite\"><strong>DÍA DE CIERRE</strong></div><div id=\"today-date\" class=\"today-date\">—</div><div class=\"clock\"><span id=\"clock-time\">--:--</span><span class=\"seconds\" id=\"clock-seconds\">--</span></div>\n<div class=\"last-card\"><div class=\"eyebrow dim\">ÚLTIMA MARCA</div><div class=\"last-line\"><strong id=\"last-time\">—</strong><span id=\"last-type\">Sin registros</span></div></div>\n<div class=\"home-pay-inline\" aria-label=\"Ganancias estimadas\"><span>Hoy <strong id=\"home-pay-today\">$0.00</strong></span><span>Semana <strong id=\"home-pay-week\">$0.00</strong></span></div>\n<p id=\"home-status\" class=\"home-status\">Sin turno activo</p>\n<div class=\"geo-pending\" id=\"geo-pending\" hidden>\n <div class=\"eyebrow dim\">UBICACIÓN · MARCA PROVISIONAL</div>\n <strong id=\"geo-pending-label\">Marca estimada</strong>\n <span class=\"geo-pending-time\" id=\"geo-pending-time\">--:--</span>\n <p id=\"geo-pending-info\">Nexo calculó una hora aproximada usando tu ubicación. No afecta la nómina hasta confirmarla.</p>\n <div class=\"actions\">\n  <button type=\"button\" class=\"btn primary\" id=\"geo-confirm\">Confirmar</button>\n  <button type=\"button\" class=\"btn\" id=\"geo-edit\">Corregir hora</button>\n  <button type=\"button\" class=\"btn\" id=\"geo-discard\">Descartar</button>\n </div>\n <form id=\"geo-edit-form\" hidden>\n  <label>Hora real <input type=\"datetime-local\" id=\"geo-edit-time\" required></label>\n  <div class=\"actions\"><button type=\"submit\" class=\"btn primary\">Guardar corrección</button><button type=\"button\" class=\"btn\" id=\"geo-edit-cancel\">Cancelar</button></div>\n </form>\n</div>\n<div class=\"geo-home-monitor\" id=\"geo-home-monitor\" hidden>Reconocimiento GPS activo durante esta sesión.</div>\n<div class=\"provisional-panel\" id=\"provisional-panel\" hidden>\n <h2>Regreso del descanso · provisional</h2>\n <div class=\"provisional-warning\">Nexo estimó esta hora a partir del margen configurado. No es una marca manual confirmada.</div>\n <div id=\"provisional-time\" class=\"provisional-time\">—</div>\n <p id=\"provisional-detail\" class=\"subtle\"></p>\n <div class=\"provisional-controls\">\n  <button class=\"btn primary\" type=\"button\" id=\"confirm-provisional\">Confirmar</button>\n  <button class=\"btn\" type=\"button\" id=\"edit-provisional\">Corregir hora</button>\n  <button class=\"btn\" type=\"button\" id=\"undo-provisional\">Descartar</button>\n </div>\n <form id=\"provisional-edit-form\" class=\"provisional-edit\" hidden>\n  <label>Hora real de regreso <input type=\"datetime-local\" id=\"provisional-end-at\" required></label>\n  <div class=\"actions\"><button type=\"submit\" class=\"btn primary\">Guardar corrección</button><button type=\"button\" class=\"btn\" id=\"cancel-provisional-edit\">Cancelar</button></div>\n </form>\n</div>\n<button type=\"button\" id=\"open-mark\" class=\"plus\" aria-label=\"Agregar marca\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 3v18M3 12h18\"/></svg></button><div class=\"hint\">AGREGAR MARCA</div>\n\n</section>\n<section class=\"view\" id=\"view-mark\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Nueva marca</h1></div><p class=\"subtle\">Seleccioná el tipo de marca. La hora se registra al confirmar.</p>\n<p id=\"mark-captured-at\" class=\"mark-stamp\" aria-live=\"polite\">Hora de la marca: --:--</p><div class=\"mark-grid\"><button class=\"mark\" type=\"button\" id=\"clock-in\"><span>01</span>Entrada al trabajo</button><button class=\"mark\" type=\"button\" id=\"break-start\"><span>02</span>Inicio de descanso</button><button class=\"mark\" type=\"button\" id=\"break-end\"><span>03</span>Fin de descanso</button><button class=\"mark\" type=\"button\" id=\"clock-out\"><span>04</span>Salida del trabajo</button></div>\n<div class=\"panel\"><p id=\"active-info\" class=\"subtle\">No hay un turno activo.</p></div></section>\n<section class=\"view\" id=\"view-settings\" hidden>\n<div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Ajustes</h1></div>\n<button type=\"button\" id=\"tone-open\" class=\"btn tone-open\">Ajustar colores</button>\n<div class=\"panel settings-compact\">\n <div class=\"settings-heading\"><h2>Lugares de trabajo</h2><button type=\"button\" class=\"settings-info-trigger\" data-settings-info=\"week\" aria-label=\"Información sobre el cierre semanal\" title=\"Información del cierre\">i</button></div>\n <div id=\"settings-workplace-list\" class=\"settings-stack\"></div>\n <div class=\"actions\"><button class=\"btn\" id=\"show-profile\" type=\"button\">+ Agregar lugar</button></div>\n <form id=\"profile-form\" class=\"settings-edit-form\" hidden><input type=\"hidden\" name=\"id\">\n  <h3 id=\"profile-form-title\">Agregar lugar</h3>\n  <div class=\"fields\">\n   <label>Nombre del perfil<input name=\"name\" required placeholder=\"Trabajo principal\"></label>\n   <label>Lugar o empresa<input name=\"place\" required placeholder=\"Hotel / restaurante\"></label>\n   <label>Tarifa por hora ($)<input name=\"hourlyRate\" type=\"number\" min=\"0\" step=\".01\" required></label>\n   <label>Retención estimada (%)<input name=\"taxPercent\" type=\"number\" min=\"0\" max=\"100\" step=\".01\" value=\"0\"></label>\n   <label>Día de cierre de la semana<select name=\"weekCloseDay\"><option value=\"0\">Domingo</option><option value=\"1\">Lunes</option><option value=\"2\">Martes</option><option value=\"3\">Miércoles</option><option value=\"4\">Jueves</option><option value=\"5\">Viernes</option><option value=\"6\">Sábado</option></select></label>\n   <label>Límite semanal (horas)<input name=\"overtimeAfterHours\" type=\"number\" min=\"1\" max=\"168\" value=\"40\" required></label>\n   <label>Multiplicador de extras<input name=\"overtimeMultiplier\" type=\"number\" min=\"1\" max=\"10\" step=\".1\" value=\"1.5\" required></label>\n  </div>\n  <div class=\"profile-color-settings\"><span>Color del tag</span><div id=\"new-profile-tag-palette\" class=\"tag-palette\" role=\"group\" aria-label=\"Color del lugar\"></div></div>\n  <div class=\"actions\"><button class=\"btn primary\" type=\"submit\">Guardar configuración</button><button class=\"btn\" type=\"button\" id=\"cancel-profile\">Cancelar</button></div>\n </form>\n</div>\n<div class=\"panel settings-compact geo-panel\">\n <div class=\"settings-heading\"><h2>Ubicaciones de trabajo</h2><button type=\"button\" class=\"settings-info-trigger\" data-settings-info=\"geo\" aria-label=\"Información sobre ubicación y privacidad\" title=\"Ubicación y privacidad\">i</button></div>\n <div id=\"settings-geo-list\" class=\"settings-stack\"></div>\n <div class=\"actions\"><button type=\"button\" id=\"geo-add\" class=\"btn\">+ Registrar ubicación</button></div>\n <form id=\"geo-form\" class=\"settings-edit-form\" hidden>\n  <h3 id=\"geo-form-title\">Registrar ubicación</h3>\n  <label>Lugar de trabajo<select id=\"geo-profile\" aria-label=\"Lugar de trabajo para la ubicación\"></select></label>\n  <label class=\"break-toggle\"><input type=\"checkbox\" id=\"geo-enabled\" name=\"enabled\" checked><span>Permitir propuestas provisionales por ubicación</span></label>\n  <div class=\"geo-grid\">\n   <label>Latitud<input type=\"number\" id=\"geo-lat\" name=\"lat\" min=\"-90\" max=\"90\" step=\"any\" placeholder=\"Establecer ubicación\" required></label>\n   <label>Longitud<input type=\"number\" id=\"geo-lon\" name=\"lon\" min=\"-180\" max=\"180\" step=\"any\" placeholder=\"Establecer ubicación\" required></label>\n   <label>Radio de reconocimiento<select id=\"geo-radius\" name=\"radius\"><option value=\"200\">200 metros</option><option value=\"805\" selected>Media milla</option><option value=\"1609\">Una milla</option></select></label>\n   <label>Tiempo dentro antes de proponer entrada (min)<input id=\"geo-arrival\" name=\"arrival\" type=\"number\" min=\"0\" max=\"120\" step=\"1\" value=\"20\" required></label>\n   <label>Restar a la primera salida detectada (min)<input id=\"geo-exit\" name=\"exit\" type=\"number\" min=\"0\" max=\"120\" step=\"1\" value=\"20\" required></label>\n  </div>\n  <div class=\"geo-map-launch\"><button id=\"geo-use-current\" type=\"button\" class=\"btn\">Detectar mi ubicación</button><button id=\"geo-open-map\" type=\"button\" class=\"btn\">Elegir en el mapa</button></div>\n  <div class=\"geo-map-preview\" id=\"geo-choice-preview\"><span class=\"geo-dot\" aria-hidden=\"true\"></span><span id=\"geo-choice-label\">Elegí un punto en el mapa o detectá tu ubicación.</span></div>\n  <div class=\"geo-grid\"><label>Nombre del lugar (opcional)<input type=\"text\" id=\"geo-place-label\" name=\"placeLabel\" maxlength=\"100\" placeholder=\"Nombre del hotel, edificio o comercio\"></label>\n   <label>Zona horaria del perfil<input type=\"text\" id=\"geo-profile-timezone\" readonly aria-label=\"Zona horaria detectada del perfil\"></label></div>\n  <div class=\"geo-actions\"><button type=\"submit\" class=\"btn primary\">Guardar ubicación</button><button type=\"button\" class=\"btn\" id=\"geo-cancel\">Cancelar</button></div>\n  <p class=\"geo-status\" id=\"geo-status\" role=\"status\" aria-live=\"polite\">Reconocimiento GPS disponible con permiso del navegador.</p>\n </form>\n</div>\n<div class=\"panel settings-compact\" id=\"break-settings-panel\">\n <div class=\"settings-heading\"><h2>Descanso automático provisional</h2><button type=\"button\" class=\"settings-info-trigger\" data-settings-info=\"break\" aria-label=\"Información sobre descanso automático\" title=\"Descanso automático\">i</button></div>\n <div class=\"settings-break-summary\">\n  <div><strong id=\"break-settings-summary\">D30 · 5T</strong><small id=\"break-settings-profile\">Lugar de trabajo</small></div>\n  <span class=\"settings-state\" id=\"break-settings-state\">Activo</span>\n </div>\n <div class=\"actions\"><button class=\"btn\" id=\"break-edit\" type=\"button\">Editar configuración</button></div>\n <form id=\"break-settings-form\" class=\"settings-edit-form\" hidden>\n  <label class=\"break-toggle\"><input name=\"enabled\" id=\"break-auto-enabled\" type=\"checkbox\" checked><span>Activar estimaciones provisionales</span></label>\n  <div class=\"break-settings-grid\">\n   <label>Duración habitual de descanso (minutos)<input name=\"duration\" id=\"break-duration\" type=\"number\" min=\"1\" max=\"240\" step=\"1\" value=\"30\" required></label>\n   <label>Tolerancia adicional (minutos)<input name=\"tolerance\" id=\"break-tolerance\" type=\"number\" min=\"0\" max=\"120\" step=\"1\" value=\"5\" required></label>\n  </div>\n  <div id=\"break-settings-note\" class=\"settings-form-note\"></div>\n  <div class=\"actions\"><button class=\"btn primary\" type=\"submit\" id=\"save-break-settings\">Guardar configuración</button><button class=\"btn\" type=\"button\" id=\"break-cancel\">Cancelar</button></div>\n </form>\n</div>\n<div id=\"settings-info-backdrop\" class=\"settings-info-backdrop\" hidden role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"settings-info-title\">\n <div class=\"settings-info-dialog\"><button class=\"settings-info-close\" id=\"settings-info-close\" type=\"button\" aria-label=\"Cerrar información\">×</button><h3 id=\"settings-info-title\"></h3><p id=\"settings-info-text\"></p><button id=\"settings-info-done\" class=\"btn\" type=\"button\">Entendido</button></div>\n</div>\n</section>\n<section class=\"view chart-view\" id=\"view-charts\" hidden>\n  <div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Gráfica de horas</h1></div>\n  <div class=\"chart-tabs\" role=\"tablist\" aria-label=\"Período de la gráfica\">\n   <button type=\"button\" role=\"tab\" class=\"chart-tab\" data-chart-tab=\"day\" aria-selected=\"false\">Día</button>\n   <button type=\"button\" role=\"tab\" class=\"chart-tab\" data-chart-tab=\"week\" aria-selected=\"true\">Semana</button>\n   <button type=\"button\" role=\"tab\" class=\"chart-tab\" data-chart-tab=\"month\" aria-selected=\"false\">Mes</button>\n   <button type=\"button\" role=\"tab\" class=\"chart-tab\" data-chart-tab=\"year\" aria-selected=\"false\">Año</button>\n  </div>\n  <div class=\"chart-period-bar\">\n   <button class=\"btn chart-arrow\" type=\"button\" id=\"chart-prev\" aria-label=\"Período anterior\">‹</button>\n   <div class=\"chart-period-title\" id=\"chart-period-title\">—</div>\n   <button class=\"btn chart-arrow\" type=\"button\" id=\"chart-next\" aria-label=\"Período siguiente\">›</button>\n   <button class=\"btn chart-today\" type=\"button\" id=\"chart-today\">Actual</button>\n  </div>\n  <div class=\"panel chart-card\">\n   <div class=\"chart-legend\" id=\"chart-legend\" aria-label=\"Lugares de trabajo\"></div>\n   <div class=\"chart-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"Gráfica comparativa; desliza horizontalmente cuando sea necesario\">\n    <svg id=\"work-chart\" class=\"work-chart\" role=\"img\" aria-label=\"Horas trabajadas agrupadas por lugar y período\"></svg>\n   </div>\n   <div id=\"chart-selection\" class=\"chart-selection\" aria-live=\"polite\">Tocá una barra para consultar los detalles.</div>\n   <p id=\"chart-note\" class=\"chart-note\"></p>\n  </div>\n  <div class=\"chart-summaries\" id=\"chart-summaries\" aria-live=\"polite\"></div>\n</section>\n<section class=\"view\" id=\"view-calendar\" hidden><div class=\"section-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Calendario</h1></div><div class=\"panel\"><div class=\"calendar-head\"><button class=\"btn\" id=\"prev-month\" type=\"button\" aria-label=\"Mes anterior\">‹</button><h2 id=\"month-label\"></h2><button class=\"btn\" id=\"next-month\" type=\"button\" aria-label=\"Mes siguiente\">›</button></div><div class=\"calendar\" id=\"calendar\"></div>\n <div class=\"calendar-off-picker\"><span>Marcar como libre</span><div class=\"calendar-off-options\" id=\"calendar-off-options\" role=\"group\" aria-label=\"Día libre por lugar de trabajo\"></div></div></div>\n<div class=\"panel\"><h2 id=\"selected-label\">Jornadas del día</h2><div id=\"shift-list\"></div><div class=\"actions\"><button class=\"btn primary\" id=\"new-shift\" type=\"button\">+ Añadir jornada anterior</button></div>\n<form id=\"shift-form\" hidden><input type=\"hidden\" name=\"id\"><div class=\"fields\"><label>Entrada<input name=\"startedAt\" type=\"datetime-local\" required></label><label>Salida<input name=\"closedAt\" type=\"datetime-local\" required></label><label>Descanso total (minutos)<input name=\"breakMinutes\" type=\"number\" min=\"0\" step=\"1\" value=\"0\" required></label></div><div class=\"actions\"><button class=\"btn primary\" type=\"submit\">Guardar jornada</button><button class=\"btn\" id=\"cancel-shift\" type=\"button\">Cancelar</button></div></form></div></section>\n<section class=\"view report-view\" id=\"view-week\" hidden>\n  <div class=\"section-title report-title\"><button class=\"back\" type=\"button\" data-nav=\"home\" aria-label=\"Volver al inicio\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m15 18-6-6 6-6\"/></svg></button><h1>Resumen semanal</h1></div>\n  <div class=\"report-toolbar\" id=\"report-toolbar\">\n    <label class=\"report-profile-label\">Lugar de trabajo\n      <select id=\"report-profile\" aria-label=\"Lugar de trabajo para el resumen semanal\"></select>\n    </label>\n    <div class=\"report-week-navigation\" role=\"group\" aria-label=\"Elegir semana\">\n      <button class=\"btn report-nav\" type=\"button\" id=\"report-prev-week\" aria-label=\"Semana anterior\">‹</button>\n      <button class=\"btn report-current\" type=\"button\" id=\"report-current-week\">Esta semana</button>\n      <button class=\"btn report-nav\" type=\"button\" id=\"report-next-week\" aria-label=\"Semana siguiente\">›</button>\n    </div>\n  </div>\n  <div class=\"report-paper\" id=\"report-paper\">\n    <div class=\"report-header\">\n      <h2>Resumen de la semana</h2>\n      <div class=\"report-header-bottom\">\n        <span id=\"report-dates\">—</span>\n      </div>\n    </div>\n    <div class=\"report-scroll\">\n      <table class=\"report-table\" aria-label=\"Jornadas por lugar de trabajo, entradas, descansos, salidas y horas\">\n        <thead><tr><th scope=\"col\">Día</th><th scope=\"col\">Entr.</th><th scope=\"col\">Break</th><th scope=\"col\">Reg.</th><th scope=\"col\">Salida</th><th scope=\"col\">Horas</th><th scope=\"col\" class=\"report-money\">Neto</th></tr></thead>\n        <tbody id=\"week-rows\"></tbody>\n        <tfoot><tr><th scope=\"row\">Total</th><td colspan=\"4\"></td><td id=\"week-total-hours\">0h</td><td id=\"week-total-net\" class=\"report-money\">$0.00</td></tr></tfoot>\n      </table>\n    </div>\n    <div class=\"report-metrics\">\n      <div><span>Bruto</span><strong id=\"week-total-gross\">$0.00</strong></div>\n      <div><span>Retención</span><strong id=\"week-total-tax\">$0.00</strong></div>\n      <div><span>Horas extra</span><strong id=\"week-total-overtime\">0h</strong></div>\n    </div>\n    <div id=\"week-total\" class=\"report-rates\" aria-live=\"polite\"></div>\n  </div>\n  <div class=\"report-actions\">\n    <div class=\"report-capture-tools\">\n      <button class=\"btn\" id=\"report-capture\" type=\"button\" aria-pressed=\"false\">Vista para captura</button>\n      <button class=\"report-info\" id=\"report-capture-info\" type=\"button\" aria-label=\"¿Qué es Vista para captura?\" title=\"Información de Vista para captura\">i</button>\n    </div>\n    <button class=\"btn\" id=\"report-open-calendar\" type=\"button\">Editar marcas en calendario</button>\n  </div>\n  <div class=\"report-info-backdrop\" id=\"report-info-backdrop\" hidden role=\"dialog\" aria-modal=\"true\" aria-label=\"Vista para captura\">\n    <div class=\"report-info-dialog\">\n      <button class=\"report-info-close\" type=\"button\" id=\"report-info-close\" aria-label=\"Cerrar\">×</button>\n      <strong>Vista para captura</strong>\n      <p>Muestra las marcas y horas de la semana sin importes ni tarifas, para compartir una captura de pantalla. No cambia tus registros.</p>\n      <button class=\"btn\" type=\"button\" id=\"report-info-done\">Entendido</button>\n    </div>\n  </div>\n</section>\n\n<div class=\"geo-map-backdrop\" id=\"geo-map-backdrop\" hidden>\n <section class=\"geo-map-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"geo-map-title\" aria-describedby=\"geo-map-description\">\n  <div class=\"geo-map-heading\"><h2 id=\"geo-map-title\">Elegir ubicación de trabajo <span style=\"display:block;margin-top:4px;font-size:11px;color:#e8e8e8;letter-spacing:.03em;font-weight:500\">Mapa v0.2.7 · Wix sincronizado</span></h2><button id=\"geo-map-close\" type=\"button\" aria-label=\"Cerrar mapa\">×</button></div>\n  <p class=\"geo-map-info\" id=\"geo-map-description\">Tocá el mapa para mover el punto. El círculo muestra el radio. Al identificar un lugar, sus coordenadas se consultan una sola vez mediante Photon/komoot y OpenStreetMap, servicios externos. Confirmá antes de guardar.</p>\n  <div class=\"geo-map-viewport\"><div id=\"geo-map-stage\" class=\"geo-map-stage\" aria-label=\"Mapa para escoger el lugar de trabajo\"></div><div class=\"geo-map-loader\" id=\"geo-map-loader\" role=\"status\" aria-live=\"polite\"><strong id=\"geo-map-load-label\">Preparando el mapa…</strong><div class=\"geo-map-loader-track\" role=\"progressbar\" id=\"geo-map-progress\" aria-label=\"Carga de las calles\"><div class=\"geo-map-loader-fill\" id=\"geo-map-progress-fill\"></div></div><small id=\"geo-map-load-detail\">Conectando con el servicio cartográfico</small></div></div><div id=\"geo-map-diagnostic\" class=\"geo-map-diagnostic\" aria-live=\"polite\">Mapa v0.2.5 · Visor listo para iniciar</div>\n  \n  <div class=\"geo-map-result\" aria-live=\"polite\"><strong id=\"geo-map-place\">Punto por seleccionar</strong><span id=\"geo-map-address\">Detectá tu posición o tocá el mapa para elegir.</span></div>\n  <div class=\"geo-map-actions\">\n   <button class=\"btn\" type=\"button\" id=\"geo-map-detect\">Mi ubicación</button>\n   <button class=\"btn\" type=\"button\" id=\"geo-map-identify\">Identificar lugar</button>\n   <button class=\"btn primary\" type=\"button\" id=\"geo-map-save\" disabled>Guardar este punto</button>\n   <button class=\"btn\" type=\"button\" id=\"geo-map-cancel\">Cancelar</button>\n  </div>\n </section>\n</div>\n\n<div id=\"suggest-backdrop\" class=\"suggest-backdrop\" hidden>\n  <section class=\"suggest-dialog\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"suggest-title\" aria-describedby=\"suggest-description\">\n    <div class=\"suggest-kicker\">SUGERENCIA DE MARCA</div>\n    <h2 id=\"suggest-title\">¿Registrar tu siguiente marca?</h2>\n    <p id=\"suggest-description\">Podés confirmar o continuar sin registrar nada.</p>\n    <div class=\"suggest-time\" id=\"suggest-time\">--:--</div>\n    <div class=\"suggest-actions\">\n      <button class=\"btn\" id=\"suggest-no\" type=\"button\">Ahora no</button>\n      <button class=\"btn\" id=\"suggest-other\" type=\"button\">Otra marca</button>\n      <button class=\"btn primary\" id=\"suggest-yes\" type=\"button\">Sí, registrar</button>\n    </div>\n  </section>\n</div>\n<footer>Versión de desarrollo: los registros permanecen en este navegador y dispositivo. Aún no existe sincronización por cuenta.</footer>\n</main><div class=\"tone-overlay\" id=\"tone-overlay\" hidden role=\"dialog\" aria-modal=\"true\" aria-label=\"Ajustar colores\">\n<div class=\"tone-editor\">\n<div class=\"tone-fields\">\n<label class=\"tone-row\">Interfaz<input id=\"tone-ui\" class=\"tone-range\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" value=\"0\" aria-label=\"Interfaz\"></label>\n<label class=\"tone-row\">Fondo<input id=\"tone-fluid\" class=\"tone-range\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" value=\"0\" aria-label=\"Fondo\"></label>\n<label class=\"tone-row\">Texto<input id=\"tone-text\" class=\"tone-range\" type=\"range\" min=\"0\" max=\"360\" step=\"1\" value=\"0\" aria-label=\"Texto\"></label>\n</div><div class=\"tone-buttons\"><button type=\"button\" id=\"tone-save\" class=\"tone-save\">Guardar</button><button type=\"button\" id=\"tone-cancel\" class=\"tone-cancel\" aria-label=\"Cancelar\">×</button></div>\n</div></div>\n</div>";
uiRoot.append(style,screen);document.body.appendChild(host);

/* Unified vector oil sheet. The emergence bridge follows the same moving
   wave as the bubble, pinches off and returns as a small surface ripple.
   The scene is visual only: it has no access to work records or user settings. */
function startOilScene(rootNode,hostNode){
 const svg=rootNode.getElementById('oil-scene');
 if(!svg||!window.requestAnimationFrame)return;
 const NS='http://www.w3.org/2000/svg',query=id=>rootNode.getElementById(id);
 const sheet=query('oil-sheet-path'),band=query('oil-band-path'),trace=query('oil-trace-path'),
       glint=query('oil-glint-path'),film=query('oil-film-path');
 const bridges=query('oil-bridges'),rising=query('oil-rising'),returns=query('oil-returns');
 const create=(tag,cls,parent)=>{
  const node=document.createElementNS(NS,tag);
  node.setAttribute('class',cls);parent.appendChild(node);return node
 };
 const defs=query('oil-definitions');
 const models=[
  {x:.13,r:18,period:23,offset:4},
  {x:.33,r:27,period:29,offset:17},
  {x:.58,r:23,period:26,offset:10},
  {x:.81,r:30,period:32,offset:24},
  {x:.45,r:20,period:27,offset:22},
  {x:.69,r:18,period:24,offset:2}
 ].map((model,i)=>{
  // Per-bubble vertical transparency keeps the soft 3-D radial shading.
  // During detachment the lower edge is invisible, whereas at the upper
  // collision the upper edge dissolves into the top liquid film.
  const maskGradient=create('linearGradient','oil-alpha-gradient',defs);
  const alphaId='oil-alpha-'+i,maskId='oil-alpha-mask-'+i;
  maskGradient.setAttribute('id',alphaId);
  maskGradient.setAttribute('x1','0%');
  maskGradient.setAttribute('y1','0%');
  maskGradient.setAttribute('x2','0%');
  maskGradient.setAttribute('y2','100%');
  const maskStops=[0,.3,.68,1].map(position=>{
   const stop=create('stop','',maskGradient);
   stop.setAttribute('offset',String(position*100)+'%');
   stop.setAttribute('stop-color','#fff');
   return stop
  });
  const mask=create('mask','',defs);
  mask.setAttribute('id',maskId);
  mask.setAttribute('maskUnits','userSpaceOnUse');
  mask.setAttribute('maskContentUnits','userSpaceOnUse');
  const maskRect=create('rect','',mask);
  maskRect.setAttribute('fill','url(#'+alphaId+')');
  const neckGradient=create('linearGradient','',defs);
  const neckGradientId='oil-neck-shade-'+i;
  neckGradient.setAttribute('id',neckGradientId);
  neckGradient.setAttribute('x1','0%');neckGradient.setAttribute('y1','0%');
  neckGradient.setAttribute('x2','0%');neckGradient.setAttribute('y2','100%');
  const neckStops=[0,.23,.64,1].map((position,j)=>{
   const stop=create('stop','',neckGradient);
   stop.setAttribute('offset',String(position*100)+'%');
   stop.setAttribute('style','stop-color:rgb(var(--nx-fluid-rgb))');
   stop.setAttribute('stop-opacity',j===0?'0':j===3?'.22':'.29');
   return stop
  });
  const bridge=create('path','oil-bridge',bridges);
  bridge.setAttribute('fill','url(#'+neckGradientId+')');
  const bubble=create('ellipse','oil-bubble-shape',rising);
  bubble.setAttribute('mask','url(#'+maskId+')');
  return {...model,bridge,bubble,maskRect,maskStops,neckStops}
 });
 const down=[.035,.080,.115,.93,.965,.885,.06,.94,.12,.90].map((x,i)=>({
  x,r:3+(i%4)*1.4,period:13+(i%5)*3,offset:i*4.6,
  node:create('ellipse','oil-return-drop',returns)
 }));
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
 const smooth=x=>{const p=clamp(x);return p*p*(3-2*p)};
 const gaussian=(x,w)=>Math.exp(-Math.pow(x/Math.max(w,1),2));
 let last=0,lastWidth=0,lastHeight=0,active=true;
 let width=1000,height=1000,base=850;
 function wave(x,t){
  const amp=Math.max(4,Math.min(13,height*.015));
  let y=base+amp*(.53*Math.sin(x/Math.max(width,1)*Math.PI*3+t*.63)+.30*Math.sin(x/Math.max(width,1)*Math.PI*6.7-t*.41)+.19*Math.sin(x/Math.max(width,1)*Math.PI*1.6+t*.21));
  for(const m of models){
   const phase=((t+m.offset)%m.period)/m.period;
   const grow=smooth((phase-.008)/.12),rest=1-smooth((phase-.17)/.12);
   const rise=grow*rest;
   const ripple=phase>.18&&phase<.39?
    Math.sin((phase-.18)*Math.PI/.21)*(1-smooth((phase-.18)/.21)):0;
   const cx=m.x*width;
   const radius=m.r*Math.min(width/420,1.2);
   y-=Math.min(23,radius*.8)*rise*gaussian(x-cx,radius*1.75);
   y+=Math.sin((x-cx)/(radius*.6)+t*2.3)*4*ripple*gaussian(x-cx,radius*3.8);
  }
  return y
 }
 const wavePath=(t,delta=0,fill=false)=>{
  let d='';
  const steps=Math.max(32,Math.min(88,Math.ceil(width/10)));
  for(let i=0;i<=steps;i++){
   const x=width*i/steps;
   const y=wave(x,t)+delta+Math.sin(x/Math.max(width,1)*Math.PI*4+t*.65)*(delta?2:0);
   d+=(i?' L ':'M ')+x.toFixed(1)+' '+y.toFixed(1)
  }
  if(fill)d+=' L '+width.toFixed(1)+' '+height.toFixed(1)+' L 0 '+height.toFixed(1)+' Z';
  return d
 };
 function paint(time){
  const t=time/1000;
  const rect=svg.getBoundingClientRect();
  if(rect.width<2||rect.height<2)return;
  if(Math.abs(rect.width-lastWidth)>1||Math.abs(rect.height-lastHeight)>1){
   width=rect.width;height=rect.height;lastWidth=width;lastHeight=height;
   base=height*.846;
   svg.setAttribute('viewBox','0 0 '+width.toFixed(1)+' '+height.toFixed(1))
  }
  sheet.setAttribute('d',wavePath(t,0,true));
  band.setAttribute('d',wavePath(t,3,false));
  trace.setAttribute('d',wavePath(t,-9,false));
  glint.setAttribute('d',wavePath(t,-1.8,false));
  let topD='';
  for(let i=0;i<=35;i++){
   const x=width*i/35, y=height*.07+3*Math.sin(i*.23-t*.38);
   topD+=(i?' L ':'M ')+x.toFixed(1)+' '+y.toFixed(1)
  }
  film.setAttribute('d',topD);
  for(const b of models){
   const phase=((t+b.offset)%b.period)/b.period;
   const cx=b.x*width,initialRadius=b.r*Math.min(width/420,1.2);
   const born=smooth(phase/.17),radius=Math.max(1,initialRadius*(.26+.74*born));
   const surfaceY=wave(cx,t);
   const filmY=height*.07+3*Math.sin(cx/Math.max(width,1)*Math.PI*2.5-t*.38);
   const travel=smooth((phase-.185)/.715);
   const distortion=phase<.18?1.26-.26*born:1+Math.sin(t*3+b.x*20)*.045;
   // The sphere rises unchanged until it reaches the upper film at ~90%.
   // Only after contact does it flatten and continue entering that film.
   const fusion=smooth((phase-.90)/.10);
   const rx=radius*(1+.55*fusion),ry=radius*distortion*(1-.79*fusion);
   const startCY=surfaceY-radius*.5-initialRadius*2.2*born;
   const cy=startCY+(filmY+radius-startCY)*travel-initialRadius*1.31*fusion;
   const opacity=smooth(phase/.045)*(1-smooth((phase-.985)/.015));
   b.bubble.setAttribute('cx',cx.toFixed(1));
   b.bubble.setAttribute('cy',cy.toFixed(1));
   b.bubble.setAttribute('rx',rx.toFixed(1));
   b.bubble.setAttribute('ry',Math.max(1,ry).toFixed(1));
   b.bubble.setAttribute('opacity',(opacity*.68).toFixed(3));
   // SVG alpha mask creates a real zero-opacity seam, while preserving
   // the original radial fill and soft spherical highlight.
   const joined=1-smooth((phase-.165)/.075);
   const topMelt=smooth((phase-.90)/.10);
   const alpha=[1-topMelt,1-topMelt*.82,1,1-joined];
   for(let i=0;i<b.maskStops.length;i++)
    b.maskStops[i].setAttribute('stop-opacity',alpha[i].toFixed(3));
   b.maskRect.setAttribute('x',(cx-rx-2).toFixed(2));
   b.maskRect.setAttribute('y',(cy-ry-2).toFixed(2));
   b.maskRect.setAttribute('width',(rx*2+4).toFixed(2));
   b.maskRect.setAttribute('height',(ry*2+4).toFixed(2));
   // At birth the connector has TWO broad ends and a 10% waist.
   // Base diameter is 120% of the sphere's diameter. The bubble side
   // has the sphere's full diameter, unlike the former pointed cone.
   // After separation the connector retracts into the undulating surface.
   const retract=smooth((phase-.18)/.16);
   const neckVisibility=smooth((phase-.012)/.06)*
    (1-smooth((phase-.29)/.065));
   const baseY=surfaceY+4;
   const tip=phase<=.18?cy+ry*.78:
    surfaceY-initialRadius*1.94*(1-retract);
   const gap=baseY-tip;
   const upperHalf=phase<=.18?rx:
    initialRadius*(1-retract*.94);
   const bottomHalf=initialRadius*1.20*(.78+.22*born);
   const waistHalf=Math.max(.8,Math.min(upperHalf,bottomHalf)*(.10+.24*retract));
   if(neckVisibility>.005&&gap>1){
    const midY=tip+gap*.53;
    const leftBase=cx-bottomHalf,rightBase=cx+bottomHalf;
    const leftTop=cx-upperHalf,rightTop=cx+upperHalf;
    const leftWaist=cx-waistHalf,rightWaist=cx+waistHalf;
    const path='M '+leftBase.toFixed(2)+' '+baseY.toFixed(2)+
     ' C '+(cx-bottomHalf*.97).toFixed(2)+' '+(baseY-gap*.23).toFixed(2)+
     ' '+(cx-waistHalf*1.2).toFixed(2)+' '+(midY+gap*.11).toFixed(2)+
     ' '+leftWaist.toFixed(2)+' '+midY.toFixed(2)+
     ' C '+(cx-waistHalf*.8).toFixed(2)+' '+(midY-gap*.12).toFixed(2)+
     ' '+(cx-upperHalf*.87).toFixed(2)+' '+(tip+gap*.08).toFixed(2)+
     ' '+leftTop.toFixed(2)+' '+tip.toFixed(2)+
     ' Q '+cx.toFixed(2)+' '+(tip-gap*.035).toFixed(2)+
     ' '+rightTop.toFixed(2)+' '+tip.toFixed(2)+
     ' C '+(cx+upperHalf*.87).toFixed(2)+' '+(tip+gap*.08).toFixed(2)+
     ' '+(cx+waistHalf*.8).toFixed(2)+' '+(midY-gap*.12).toFixed(2)+
     ' '+rightWaist.toFixed(2)+' '+midY.toFixed(2)+
     ' C '+(cx+waistHalf*1.2).toFixed(2)+' '+(midY+gap*.11).toFixed(2)+
     ' '+(cx+bottomHalf*.97).toFixed(2)+' '+(baseY-gap*.23).toFixed(2)+
     ' '+rightBase.toFixed(2)+' '+baseY.toFixed(2)+' Z';
    b.bridge.setAttribute('d',path);
    b.bridge.setAttribute('opacity',(neckVisibility*.82).toFixed(3));
   }else b.bridge.setAttribute('opacity','0');
   // While joined, the connector itself is completely transparent
   // at its top end. Immediately after detachment that end gains the
   // same translucent material as the wave while contracting downward.
   b.neckStops[0].setAttribute('stop-opacity',
    (.26*smooth((phase-.18)/.075)).toFixed(3));
  }
  for(const d of down){
   const phase=((t+d.offset)%d.period)/d.period;
   const cy=height*.07+phase*height*.87;
   const sway=Math.sin(t*.67+d.offset)*Math.min(width*.012,10);
   d.node.setAttribute('cx',(d.x*width+sway).toFixed(1));
   d.node.setAttribute('cy',cy.toFixed(1));
   d.node.setAttribute('rx',(d.r*.75).toFixed(1));
   d.node.setAttribute('ry',(d.r*(1+Math.sin(t+d.x*10)*.12)).toFixed(1));
   d.node.setAttribute('opacity',(Math.min(.60,smooth(phase/.08)*(1-smooth((phase-.91)/.09))*.40)).toFixed(3))
  }
 }
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function loop(now){
  if(!active||!hostNode.isConnected){active=false;return}
  requestAnimationFrame(loop);
  if(document.hidden||now-last<38)return;
  last=now;paint(now)
 }
 paint(0);
 if(!reduced)requestAnimationFrame(loop);
}

try{startOilScene(uiRoot,host)}catch(_){/* An optional visual effect must never block the time clock. */}
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
const GEO_MONITOR_KEY='nexo.personal-work-time.geo-session.v1';
const WORK_TAG_KEY='nexo.personal-work-time.work-tags.v1';
const WORK_OFF_KEY='nexo.personal-work-time.days-off.v1';
const TONE_SETTINGS_KEY='nexo.personal-work-time.colors.v1';
const MAX_AUTO_AGE_MS=86400000;
const $=id=>uiRoot.getElementById(id);
const $$=query=>uiRoot.querySelectorAll(query);
let state,selectedProfile='',selectedDay=localDate(new Date()),month=selectedDay.slice(0,7);
let reportWeekOffset=0,reportCapture=false,reportProfileId='all',lastReportRefreshMinute=-1,lastEarningsRefreshMinute=-1;
let chartMode='week',chartAnchor=new Date(),lastChartRefreshMinute=-1;
let capturedMarkAt=null,pendingSuggestion=null,currentView='home',lastHiddenAt=null;
const CAPTURE_WINDOW_MS=5*60*1000;
let breakPreferences=readBreakPreferences();
let geoSettings=readLocalObject(GEO_SETTINGS_KEY),geoPending=readLocalObject(GEO_PENDING_KEY);
let workTags=readLocalObject(WORK_TAG_KEY),workDaysOff=readLocalObject(WORK_OFF_KEY);
let pendingNewTagColor='';
let settingsExpandedProfile=null,settingsExpandedGeo=null,profileEditingId=null,geoFormOpen=false,breakEditing=false,settingsInfoReturn=null;
let geoMonitor=null,geoFormProfile=null,workplaceMap=null;
let geoRecoveryPending=false,geoRecoveryTimer=null;
function localDate(v){const d=new Date(v);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function asInput(t){const d=new Date(t);return localDate(d)+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function fmt(t){return new Date(t).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'})}
function hours(ms){return (ms/3600000).toFixed(2)+' h'}
function money(cents){return '$'+(cents/100).toFixed(2)}
function message(msg,bad=false){$('message').textContent=msg;$('message').style.color=bad?'#ffaeae':'#84ffe0'}
function save(next){
 state=next;
 // Creating a work shift overrides an older OFF indication for that same
 // workplace/date, without touching any actual payroll entries.
 let cleaned=false;
 for(const shift of next.shifts){
  const key=localDate(shift.startedAt),off=workDaysOff[shift.profileId];
  if(off?.[key]){
   const days={...off};delete days[key];
   workDaysOff={...workDaysOff,[shift.profileId]:days};cleaned=true
  }
 }
 if(cleaned)localStorage.setItem(WORK_OFF_KEY,JSON.stringify(workDaysOff));
 localStorage.setItem(KEY,JSON.stringify(state));render()
}

const WORK_TAG_COLORS=[
 {id:'mint',name:'Verde pastel',rgb:[148,221,185]},
 {id:'sky',name:'Azul pastel',rgb:[151,194,240]},
 {id:'lilac',name:'Lila pastel',rgb:[203,174,237]},
 {id:'peach',name:'Durazno pastel',rgb:[241,190,159]},
 {id:'rose',name:'Rosa pastel',rgb:[238,165,192]}
];
function tagChoice(p){
 const saved=workTags[p.id];
 const candidate=WORK_TAG_COLORS.find(x=>x.id===saved);
 const idx=state.profiles.findIndex(x=>x.id===p.id);
 return candidate||WORK_TAG_COLORS[Math.max(0,idx)%WORK_TAG_COLORS.length]
}
function weekStartDayOf(p){
 return Number.isInteger(p.weekStartDay)&&p.weekStartDay>=0&&p.weekStartDay<=6?p.weekStartDay:1
}
function workTagInitials(p){
 const name=String(p.place||p.name||'TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z]/g,'').toUpperCase();
 return (name+'TR').slice(0,2)
}
function workTagDisplay(p){
 const initials=workTagInitials(p);
 const same=state.profiles.filter(x=>workTagInitials(x)===initials);
 return same.length<=1?initials:initials+String(same.findIndex(x=>x.id===p.id)+1)
}
function alphaTag(color,opacity){
 return 'rgba('+color.rgb.join(',')+','+opacity+')'
}
function pastelBlend(colors,opacity=.25){
 if(!colors.length)return '';
 if(colors.length===1)return 'linear-gradient(135deg,'+alphaTag(colors[0],opacity)+' 0%,'+alphaTag(colors[0],opacity*.56)+' 100%)';
 return 'linear-gradient(135deg,'+colors.map((color,i)=>alphaTag(color,opacity)+' '+(100*i/(colors.length-1)).toFixed(1)+'%').join(',')+')'
}
function pastelDot(colors){
 if(!colors.length)return '';
 if(colors.length===1)return alphaTag(colors[0],.92);
 return 'linear-gradient(135deg,'+colors.map((color,i)=>alphaTag(color,.95)+' '+(100*i/(colors.length-1)).toFixed(1)+'%').join(',')+')'
}
function isOffDay(profileId,key){return workDaysOff[profileId]?.[key]===true}
function newTagDefault(){
 const occupied=new Set(state.profiles.map(p=>tagChoice(p).id));
 return WORK_TAG_COLORS.find(color=>!occupied.has(color.id))?.id||'mint'
}
function paletteFill(id,selected,onChoice){
 const el=$(id);if(!el)return;
 el.replaceChildren();
 for(const color of WORK_TAG_COLORS){
  const btn=document.createElement('button');
  btn.type='button';btn.style.background='rgb('+color.rgb.join(',')+')';
  btn.setAttribute('aria-label',color.name);
  btn.title=color.name;btn.setAttribute('aria-pressed',selected===color.id?'true':'false');
  btn.onclick=()=>onChoice(color.id);
  el.append(btn)
 }
}
function renderTagSettings(){
 paletteFill('new-profile-tag-palette',pendingNewTagColor,id=>{
  pendingNewTagColor=id;renderTagSettings()
 })
}
function renderOffPicker(){
 const box=$('calendar-off-options');box.replaceChildren();
 for(const p of state.profiles){
  const active=isOffDay(p.id,selectedDay),color=tagChoice(p);
  const b=document.createElement('button');b.type='button';b.className='calendar-off-tag';
  b.textContent=workTagDisplay(p);
  b.setAttribute('aria-label',(active?'Quitar libre en ':'Marcar libre en ')+p.place+' para '+selectedDay);
  b.setAttribute('aria-pressed',active?'true':'false');
  b.title=p.place+(active?' · libre':' · marcar libre');
  b.style.setProperty('--work-tag','rgb('+color.rgb.join(',')+')');
  b.style.setProperty('--work-tag-wash',alphaTag(color,.24));
  b.onclick=()=>{
   const next=!(workDaysOff[p.id]?.[selectedDay]===true);
   if(next&&state.shifts.some(s=>s.profileId===p.id&&localDate(s.startedAt)===selectedDay)){
    message('Ya hay una jornada de '+p.place+' ese día. Primero revisá esas marcas.',true);
    return
   }
   const byDate={...(workDaysOff[p.id]||{})};
   if(next)byDate[selectedDay]=true;else delete byDate[selectedDay];
   workDaysOff={...workDaysOff,[p.id]:byDate};
   try{localStorage.setItem(WORK_OFF_KEY,JSON.stringify(workDaysOff))}
   catch(_){message('No se pudo guardar el día libre.',true);return}
   selectedProfile=p.id;
   render();
   message((next?'Día libre marcado':'Día libre retirado')+' · '+p.place)
  };
  box.append(b)
 }
}


function profileLabel(p){return p.name+' · '+p.place}
function settingsCard(type,p,summary,details){
 const section=document.createElement('div');section.className='settings-item';
 const isProfile=type==='profile',expanded=(isProfile?settingsExpandedProfile:settingsExpandedGeo)===p.id;
 section.dataset.expanded=expanded?'true':'false';
 const main=document.createElement('button');main.type='button';main.className='settings-item-button';
 main.setAttribute('aria-expanded',expanded?'true':'false');
 main.setAttribute('aria-label',(expanded?'Cerrar ':'Abrir ')+(isProfile?'configuración de ':'ubicación de ')+profileLabel(p));
 const dot=document.createElement('i');dot.className='settings-item-dot';
 dot.style.background='rgb('+tagChoice(p).rgb.join(',')+')';dot.setAttribute('aria-hidden','true');
 main.append(dot);
 if(isProfile){
  const name=document.createElement('span');name.className='settings-item-name';name.textContent=profileLabel(p);main.append(name);
  const meta=document.createElement('span');meta.className='settings-item-meta';meta.textContent=money(p.rateCents)+'/h';main.append(meta)
 }else{
  const name=document.createElement('span');name.className='settings-location-label';
  const title=document.createElement('strong');title.textContent=summary;
  const location=document.createElement('small');location.textContent=details;
  name.append(title,location);main.append(name)
 }
 const arrow=document.createElement('span');arrow.className='settings-item-arrow';arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');main.append(arrow);
 const content=document.createElement('div');content.className='settings-item-detail';content.hidden=!expanded;
 const attributes=document.createElement('div');attributes.className='settings-detail-grid';
 if(isProfile){
  for(const t of ['Cierre · '+WEEKDAY_NAMES[closeDay(p)],'Retención · '+(p.taxBasisPoints/100).toFixed(2).replace(/\.?0+$/,'')+'%',
   'Extras desde '+p.overtimeAfterMilliseconds/3600000+' h','Multiplicador ×'+(p.overtimeMultiplierBasisPoints/10000).toFixed(2).replace(/\.?0+$/,'')]){
   const label=document.createElement('span');label.textContent=t;attributes.append(label)
  }
 }else{
  const zone=geoFor(p.id);
  const labels=zone&&G.validZone(zone)?[
   'Radio · '+zone.radiusMeters+' m',
   'Entrada · '+zone.arrivalMinutes+' min',
   'Salida · '+zone.exitMinutes+' min',
   zone.enabled?'Reconocimiento habilitado':'Reconocimiento pausado'
  ]:['Sin zona GPS guardada'];
  for(const t of labels){const label=document.createElement('span');label.textContent=t;attributes.append(label)}
 }
 content.append(attributes);
 const edit=document.createElement('button');edit.type='button';edit.className='btn';
 edit.textContent=isProfile?'Editar configuración':geoFor(p.id)?'Editar ubicación':'Registrar ubicación';
 edit.onclick=()=>isProfile?openProfileEditor(p):openGeoEditor(p);
 content.append(edit);
 main.onclick=()=>{
  if(isProfile)settingsExpandedProfile=expanded?null:p.id;
  else settingsExpandedGeo=expanded?null:p.id;
  if(profileEditingId!==null)closeProfileEditor();
  if(geoFormOpen)closeGeoEditor();
  selectedProfile=p.id;render()
 };
 section.append(main,content);
 return section
}
function renderSettingsCards(){
 const workplaces=$('settings-workplace-list'),locations=$('settings-geo-list');
 workplaces.replaceChildren();locations.replaceChildren();
 for(const p of state.profiles){
  workplaces.append(settingsCard('profile',p));
  const zone=geoFor(p.id);
  const exists=zone&&G.validZone(zone);
  const label=exists?(zone.label||p.place):p.place+' · Sin ubicación';
  const meta=exists?p.place+' · '+zone.lat.toFixed(5)+', '+zone.lon.toFixed(5):'Registrar punto GPS';
  locations.append(settingsCard('geo',p,label,meta))
 }
 if(!state.profiles.length){
  for(const target of [workplaces,locations]){
   const msg=document.createElement('p');msg.className='settings-form-note';
   msg.textContent='Agregá un lugar de trabajo para comenzar.';target.append(msg)
  }
 }
 $('geo-add').disabled=!state.profiles.length;
 $('profile-form').hidden=profileEditingId===null;
 $('geo-form').hidden=!geoFormOpen;
 $('break-settings-form').hidden=!breakEditing
}
function openProfileEditor(p=null){
 const form=$('profile-form');form.reset();
 profileEditingId=p?p.id:'new';
 pendingNewTagColor=p?tagChoice(p).id:newTagDefault();
 if(p){
  selectedProfile=p.id;settingsExpandedProfile=p.id;
  form.elements.id.value=p.id;
  form.elements.name.value=p.name;form.elements.place.value=p.place;
  form.elements.hourlyRate.value=String(p.rateCents/100);
  form.elements.taxPercent.value=String(p.taxBasisPoints/100);
  form.elements.weekCloseDay.value=String(closeDay(p));
  form.elements.overtimeAfterHours.value=String(p.overtimeAfterMilliseconds/3600000);
  form.elements.overtimeMultiplier.value=String(p.overtimeMultiplierBasisPoints/10000);
 }else{
  form.elements.id.value='';
  form.elements.weekCloseDay.value='0'
 }
 $('profile-form-title').textContent=p?'Editar '+profileLabel(p):'Agregar lugar';
 form.hidden=false;renderTagSettings();
 form.scrollIntoView({behavior:'smooth',block:'nearest'})
}
function closeProfileEditor(){
 profileEditingId=null;$('profile-form').hidden=true
}
function openGeoEditor(p){
 if(!p){message('Primero agregá un lugar de trabajo.',true);return}
 selectedProfile=p.id;settingsExpandedGeo=p.id;geoFormOpen=true;geoFormProfile=null;
 $('geo-form-title').textContent=geoFor(p.id)?'Editar ubicación':'Registrar ubicación';
 renderGeo();
 $('geo-form').hidden=false;$('geo-form').scrollIntoView({behavior:'smooth',block:'nearest'})
}
function closeGeoEditor(){geoFormOpen=false;$('geo-form').hidden=true}

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
if(!pendingNewTagColor)pendingNewTagColor=newTagDefault();
renderTagSettings();
$('clock-in').disabled=!p||!!a;$('break-start').disabled=!a||a.breakStartedAt!==null;$('break-end').disabled=!a||a.breakStartedAt===null;$('clock-out').disabled=!a;
$('active-info').textContent=a?('En '+a.place+' · '+(a.breakStartedAt===null?'Trabajando':'En descanso')+' · Inicio '+new Date(a.startedAt).toLocaleString('es')):'No hay un turno activo.';
const calc=payroll(),sum=new Map(calc.shifts.map(x=>[x.shiftId,x]));
renderHomeEarnings(calc,Date.now());
renderCalendar();renderList(sum);renderDashboard();renderWeek();renderBreakSettings();renderProvisional();renderGeo();renderSettingsCards();if(currentView==='charts')renderCharts();
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
function workInitials(p){
 const label=String(p?.place||p?.name||'TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z]/g,'').toUpperCase();
 return (label+'TR').slice(0,2)
}
function buildWeekReport(snapshot,profileId='all',offset=0,now=Date.now()){
 const selected=snapshot.profiles.find(x=>x.id===profileId)||null;
 const includeAll=!selected;
 // A multi-workplace report is a coordinated cycle, not a Monday–Sunday
 // calendar week. Its reference is the latest starting weekday in a
 // Monday-based week (e.g. Saturday before the following Monday).
 // Each workplace keeps its own seven-day payroll period. The combined
 // dates are the union, but only shifts inside THEIR workplace period count.
 const weekDay=p=>Number.isInteger(p?.weekStartDay)&&p.weekStartDay>=0&&p.weekStartDay<=6?p.weekStartDay:1;
 const orderFromMonday=d=>(d+6)%7;
 const lead=snapshot.profiles.reduce((best,p)=>!best||
  orderFromMonday(weekDay(p))>orderFromMonday(weekDay(best))?p:best,null);
 const leadDay=weekDay(lead||selected);
 const base=new Date(now);
 base.setHours(12,0,0,0);
 base.setDate(base.getDate()-(base.getDay()-leadDay+7)%7+7*offset);
 const periods=new Map();
 for(const p of snapshot.profiles){
  const start=new Date(base);
  start.setDate(base.getDate()+(weekDay(p)-leadDay+7)%7);
  const end=new Date(start);end.setDate(start.getDate()+6);
  periods.set(p.id,{start,end,startKey:localDate(start),endKey:localDate(end)})
 }
 const relevant=selected?[selected]:snapshot.profiles;
 const ranges=relevant.map(p=>periods.get(p.id));
 const start=ranges.length?new Date(Math.min(...ranges.map(p=>p.start.getTime()))):new Date(base);
 const end=ranges.length?new Date(Math.max(...ranges.map(p=>p.end.getTime()))):new Date(base);
 if(!ranges.length)end.setDate(start.getDate()+6);
 const pays=new Map(P.project(snapshot,now).shifts.map(x=>[x.shiftId,x]));
 const profiles=new Map(snapshot.profiles.map(p=>[p.id,p]));
 const totals={workedMs:0,grossCents:0,taxCents:0,netCents:0,overtimeMs:0,provisional:0};
 const byProfile=new Map();
 const entries=[];
 for(const shift of snapshot.shifts){
  if(!includeAll&&shift.profileId!==selected.id)continue;
  const period=periods.get(shift.profileId);
  if(!period)continue;
  const key=localDate(shift.startedAt);
  if(key<period.startKey||key>period.endKey)continue;
  const p=profiles.get(shift.profileId)||null;
  const marks={entry:[{time:shift.startedAt}],breakStart:[],breakEnd:[],exit:[]};
  let provisional=0;
  for(const b of shift.breaks||[]){
   marks.breakStart.push({time:b.startAt});
   marks.breakEnd.push({time:b.endAt,provisional:b.provisional===true});
   if(b.provisional===true)provisional++
  }
  if(shift.breakStartedAt!==null)marks.breakStart.push({time:shift.breakStartedAt});
  if(shift.closedAt!==null)marks.exit.push({time:shift.closedAt});
  for(const list of Object.values(marks))list.sort((a,b)=>a.time-b.time);
  const pay=pays.get(shift.id);
  const amounts={
   workedMs:duration(shift),
   grossCents:pay?.grossCents??0,
   taxCents:pay?.taxCents??0,
   netCents:pay?.netCents??0,
   overtimeMs:pay?.overtimeMilliseconds??0,
   provisional
  };
  for(const part of Object.keys(totals))totals[part]+=amounts[part];
  let subtotal=byProfile.get(shift.profileId);
  if(!subtotal){subtotal={profile:p,taxCents:0,grossCents:0,netCents:0};byProfile.set(shift.profileId,subtotal)}
  subtotal.taxCents+=amounts.taxCents;subtotal.grossCents+=amounts.grossCents;subtotal.netCents+=amounts.netCents;
  entries.push({shift,key,date:new Date(shift.startedAt),profile:p,initials:workInitials(p||{place:shift.place||shift.profileName}),marks,totals:amounts,isToday:key===localDate(now)})
 }
 entries.sort((a,b)=>a.shift.startedAt-b.shift.startedAt||String(a.shift.id).localeCompare(String(b.shift.id)));
 return {profile:selected,includeAll,start,weekEnd:end,entries,totals,byProfile,periods}
}

// The visualization reads the existing payroll projection; it never writes
// time entries, tax data, or rates. Each workplace keeps its own payroll week.
const CHART_MONTHS=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
function chartEmpty(){return {hours:0,gross:0,tax:0,extra:0}}
function chartAggregate(rows){
 const value=chartEmpty();
 for(const r of rows){value.hours+=r.hours;value.gross+=r.gross;value.tax+=r.tax;value.extra+=r.extra}
 return value
}
function chartDateAt(year,month,day){return new Date(year,month,day,12,0,0,0)}
function chartDateLabel(d){return d.toLocaleDateString('es',{day:'numeric',month:'short'})}
function chartWeekBegin(d,firstDay=1){
 const start=chartDateAt(d.getFullYear(),d.getMonth(),d.getDate());
 start.setDate(start.getDate()-(start.getDay()-firstDay+7)%7);
 return start
}
function chartWeeklyProjection(snapshot,now=Date.now()){
 const projected=P.project(snapshot,now);
 const byDay=new Map();
 const byPayrollWeek=new Map();
 function add(map,key,hours,gross,tax,extra){
  let row=map.get(key);
  if(!row){row=chartEmpty();map.set(key,row)}
  row.hours+=hours;row.gross+=gross;row.tax+=tax;row.extra+=extra
 }
 // Projected segments are already split at every workplace-specific
 // overtime boundary and use the rate saved in the original shift.
 for(const seg of projected.segments){
  const normal=seg.regularMilliseconds,extra=seg.overtimeMilliseconds;
  const gross=seg.regularPayCentsUnrounded+seg.overtimePayCentsUnrounded;
  const tax=gross*(seg.taxBasisPoints||0)/10000;
  add(byPayrollWeek,seg.profileId+'|'+seg.weekStart,(normal+extra)/3600000,gross,tax,extra/3600000);
  function allocate(from,to,rate,extraTime){
   let cursor=from;
   while(cursor<to){
    const d=new Date(cursor);
    const midnight=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime();
    const until=Math.min(to,midnight);
    if(until<=cursor)break;
    const ms=until-cursor,money=ms*rate,partTax=money*(seg.taxBasisPoints||0)/10000;
    add(byDay,seg.profileId+'|'+localDate(cursor),ms/3600000,money,partTax,extraTime?ms/3600000:0);
    cursor=until
   }
  }
  if(normal>0)allocate(seg.startAt,seg.startAt+normal,seg.regularPayCentsUnrounded/normal,false);
  if(extra>0)allocate(seg.startAt+normal,seg.endAt,seg.overtimePayCentsUnrounded/extra,true)
 }
 return {byDay,byPayrollWeek}
}
function buildChartModel(snapshot,mode,anchor=new Date(),now=Date.now()){
 const profiles=snapshot.profiles;
 const data=chartWeeklyProjection(snapshot,now),a=chartDateAt(anchor.getFullYear(),anchor.getMonth(),anchor.getDate());
 let keys=[],labels=[],periodTitle='',note='',periodWeeks=new Map(),thresholds=[];
 const dateOf=(d,shift=0)=>{const t=new Date(d);t.setDate(t.getDate()+shift);return t};
 const fmtRange=(l,r)=>chartDateLabel(l)+' – '+chartDateLabel(r)+' '+r.getFullYear();
 if(mode==='day'){
  const key=localDate(a);
  keys=[key];labels=['Hoy'];
  periodTitle=a.toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  note='Comparación de horas registradas por lugar durante este día. Las jornadas abiertas se actualizan mientras la página está visible.'
 }else if(mode==='week'){
  const start=chartWeekBegin(a,1);
  keys=Array.from({length:7},(_,i)=>localDate(dateOf(start,i)));
  labels=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  periodTitle=fmtRange(start,dateOf(start,6));
  note='Esta gráfica compara días de lunes a domingo. Las horas extra se calculan según la semana laboral configurada de cada lugar.'
 }else if(mode==='month'){
  const start=chartDateAt(a.getFullYear(),a.getMonth(),1),last=chartDateAt(a.getFullYear(),a.getMonth()+1,0);
  for(const p of profiles){
   const first=chartWeekBegin(start,weekStartDayOf(p));
   const weeks=[];
   for(let current=first;current<=last;current=dateOf(current,7)){
    weeks.push({start:new Date(current),key:localDate(current),end:dateOf(current,6)})
   }
   periodWeeks.set(p.id,weeks)
  }
  const count=Math.max(1,...[...periodWeeks.values()].map(w=>w.length));
  keys=Array.from({length:count},(_,i)=>i);
  labels=keys.map(i=>'S'+(i+1));
  periodTitle=start.toLocaleDateString('es',{month:'long',year:'numeric'});
  note='Cada barra mensual representa una semana laboral completa de ese lugar; puede incluir días de meses vecinos. Las líneas punteadas marcan el límite de horas normales configurado.'
  thresholds=profiles.map(p=>({id:p.id,hours:(p.overtimeAfterMilliseconds||40*3600000)/3600000}))
 }else{
  keys=Array.from({length:12},(_,i)=>String(a.getFullYear())+'-'+String(i+1).padStart(2,'0'));
  labels=CHART_MONTHS;
  periodTitle=String(a.getFullYear());
  note='Las barras anuales suman las horas y los importes asignados a cada mes de calendario, incluso cuando una jornada cruza la medianoche.'
 }
 const series=new Map(),summaries=new Map();
 const dayRows=[...data.byDay];
 for(const p of profiles){
  let values=[];
  for(const key of keys){
   if(mode==='month'){
    const week=periodWeeks.get(p.id)?.[key];
    values.push(week?{...chartEmpty(),...(data.byPayrollWeek.get(p.id+'|'+week.key)||{}),range:fmtRange(week.start,week.end)}:chartEmpty())
   }else if(mode==='year'){
    const items=dayRows.filter(([compound])=>compound.startsWith(p.id+'|')&&compound.slice(p.id.length+1,7+p.id.length)===key).map(([,v])=>v);
    values.push(chartAggregate(items))
   }else values.push({...chartEmpty(),...(data.byDay.get(p.id+'|'+key)||{})})
  }
  series.set(p.id,values);
  summaries.set(p.id,chartAggregate(values))
 }
 const total=chartAggregate([...summaries.values()]);
 if(mode==='day')labels=keys.map(()=>a.toLocaleDateString('es',{weekday:'short',day:'numeric'}).replace('.',''));
 const maxBars=Math.max(0,...[...series.values()].flatMap(v=>v.map(x=>x.hours)));
 const maxThreshold=mode==='month'?Math.max(0,...thresholds.map(t=>t.hours)):0;
 const step=mode==='month'?8:mode==='year'?40:maxBars<=6?1:maxBars<=12?2:4;
 const yMax=Math.max(step,Math.ceil((Math.max(maxBars,maxThreshold)+.00001)/step)*step);
 return {mode,profiles,labels,keys,series,summaries,total,yMax,step,periodTitle,note,thresholds,periodWeeks}
}
function renderCharts(){
 const model=buildChartModel(state,chartMode,chartAnchor);
 const svg=$('work-chart'),legend=$('chart-legend'),summaries=$('chart-summaries');
 if(!svg||!legend||!summaries)return;
 const NS='http://www.w3.org/2000/svg';
 const createSVG=(kind,attrs={},parent=svg)=>{
  const e=document.createElementNS(NS,kind);
  for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
  parent.append(e);return e
 };
 svg.replaceChildren();legend.replaceChildren();summaries.replaceChildren();
 for(const tab of $$('[data-chart-tab]'))tab.setAttribute('aria-selected',tab.dataset.chartTab===chartMode?'true':'false');
 $('chart-period-title').textContent=model.periodTitle;
 $('chart-note').textContent=model.note;
 $('chart-today').textContent=chartMode==='day'?'Hoy':'Actual';
 const today=new Date();
 const isFuture=chartMode==='day'?localDate(chartAnchor)>=localDate(today):
  chartMode==='week'?localDate(chartWeekBegin(chartAnchor))>=localDate(chartWeekBegin(today)):
  chartMode==='month'?chartAnchor.getFullYear()*12+chartAnchor.getMonth()>=today.getFullYear()*12+today.getMonth():
  chartAnchor.getFullYear()>=today.getFullYear();
 $('chart-next').disabled=isFuture;
 const colors=new Map();
 for(const p of model.profiles){
  const rgba='rgb('+tagChoice(p).rgb.join(',')+')';colors.set(p.id,rgba);
  const label=document.createElement('span');label.className='chart-legend-item';
  const dot=document.createElement('i');dot.className='chart-legend-dot';
  dot.style.setProperty('--chart-place-color',rgba);
  const txt=document.createElement('span');txt.textContent=p.place;
  label.append(dot,txt);legend.append(label)
 }
 const count=model.labels.length,pCount=Math.max(1,model.profiles.length);
 const groupWidth=Math.max(chartMode==='day'?90:chartMode==='year'?86:95,35+pCount*22);
 const left=48,right=24,top=24,height=336,bottom=58,plotBottom=height-bottom,plotHeight=plotBottom-top;
 const chartWidth=left+right+groupWidth*count;
 svg.setAttribute('width',chartWidth);
 svg.setAttribute('height',height);
 svg.setAttribute('viewBox','0 0 '+chartWidth+' '+height);
 const axis=(hours)=>plotBottom-plotHeight*Math.max(0,hours)/model.yMax;
 const tickCount=Math.max(1,Math.round(model.yMax/model.step));
 const stride=Math.max(1,Math.ceil(tickCount/8));
 for(let i=0;i<=tickCount;i+=stride){
  const value=Math.min(model.yMax,i*model.step);
  const y=axis(value);
  createSVG('line',{x1:left,y1:y,x2:chartWidth-right,y2:y,stroke:'rgba(226,231,236,.17)','stroke-width':1});
  const label=createSVG('text',{x:left-11,y:y+4,'text-anchor':'end',fill:'rgba(232,236,241,.79)','font-size':11,'font-family':'system-ui'});
  label.textContent=String(value)
 }
 if((tickCount%stride)!==0){
  const y=axis(model.yMax);
  createSVG('line',{x1:left,y1:y,x2:chartWidth-right,y2:y,stroke:'rgba(226,231,236,.17)'});
  const label=createSVG('text',{x:left-11,y:y+4,'text-anchor':'end',fill:'rgba(232,236,241,.79)','font-size':11});
  label.textContent=String(model.yMax)
 }
 const ylabel=createSVG('text',{x:11,y:13,fill:'rgba(232,236,241,.7)','font-size':11,'font-family':'system-ui'});ylabel.textContent='Horas';
 if(chartMode==='month'){
  const collisions=new Map();
  for(const threshold of model.thresholds){
   const key=String(threshold.hours);
   const count=collisions.get(key)||0;collisions.set(key,count+1);
   const y=axis(threshold.hours)+(count%5-2)*1.6;
   createSVG('line',{x1:left,y1:y,x2:chartWidth-right,y2:y,stroke:colors.get(threshold.id),'stroke-width':1.35,'stroke-dasharray':'7 5',opacity:.93});
  }
 }
 for(let i=0;i<count;i++){
  const center=left+(i+.5)*groupWidth;
  const label=createSVG('text',{x:center,y:plotBottom+22,'text-anchor':'middle',fill:'rgba(232,236,241,.83)','font-size':chartMode==='year'?10:11,'font-family':'system-ui'});
  label.textContent=model.labels[i];
  const available=Math.max(18,groupWidth-18),barW=Math.min(24,Math.max(4,available/pCount-3));
  const leftBars=center-pCount*(barW+3)/2+1.5;
  for(let j=0;j<model.profiles.length;j++){
   const p=model.profiles[j],value=model.series.get(p.id)[i];
   if(!value||value.hours<=.00001)continue;
   const h=plotHeight*value.hours/model.yMax;
   const x=leftBars+j*(barW+3),y=axis(value.hours);
   const rect=createSVG('rect',{x:x.toFixed(2),y:y.toFixed(2),width:barW.toFixed(2),height:Math.max(1,h).toFixed(2),rx:Math.min(3,barW/3),fill:colors.get(p.id),opacity:.92,tabindex:0,role:'button','aria-label':p.place+', '+(value.range||model.labels[i])+': '+value.hours.toFixed(2)+' horas','class':'chart-bar'});
   const detail=p.place+' · '+(value.range||model.labels[i])+': '+value.hours.toFixed(2)+' h | Bruto '+money(Math.round(value.gross))+' | Retención '+money(Math.round(value.tax))+' | Neto '+money(Math.round(value.gross-value.tax));
   const tooltip=createSVG('title',{},rect);tooltip.textContent=detail;
   rect.onclick=()=>{$('chart-selection').textContent=detail};
   rect.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();rect.onclick()}}
  }
 }
 if(!model.profiles.length){
  $('chart-selection').textContent='Agregá un lugar de trabajo desde Ajustes para comenzar.'
 }else if(model.total.hours<=.00001){
  $('chart-selection').textContent='No hay horas registradas en este período.'
 }else $('chart-selection').textContent='Tocá una barra para ver horas, bruto, retención y neto.';
 function addSummary(name,color,row,threshold){
  const card=document.createElement('div');card.className='chart-summary'+(color?'':' chart-total-card');
  const heading=document.createElement('div');heading.className='chart-summary-header';
  if(color){
   const dot=document.createElement('i');dot.className='chart-legend-dot';
   dot.style.setProperty('--chart-place-color',color);heading.append(dot)
  }
  const title=document.createElement('strong');title.textContent=name;heading.append(title);card.append(heading);
  const fields=document.createElement('div');fields.className='chart-summary-grid';
  const values=[['Horas',row.hours.toFixed(2)+' h'],['Bruto',money(Math.round(row.gross))],['Retención',money(Math.round(row.tax))],['Neto',money(Math.round(row.gross-row.tax))],['Horas extra',row.extra.toFixed(2)+' h']];
  if(threshold!==null)values.push(['Límite normal',threshold+' h/sem.']);
  for(const [key,val] of values){
   const name=document.createElement('span');name.textContent=key;
   const result=document.createElement('strong');result.textContent=val;
   fields.append(name,result)
  }
  card.append(fields);summaries.append(card)
 }
 for(const p of model.profiles){
  const threshold=chartMode==='month'?(p.overtimeAfterMilliseconds||40*3600000)/3600000:null;
  addSummary(p.place,colors.get(p.id),model.summaries.get(p.id),threshold)
 }
 if(model.profiles.length>1)addSummary('Total · Todos los lugares',null,model.total,null);
}
function shiftChartPeriod(step){
 const d=new Date(chartAnchor);
 if(chartMode==='day')d.setDate(d.getDate()+step);
 else if(chartMode==='week')d.setDate(d.getDate()+7*step);
 else if(chartMode==='month'){d.setDate(1);d.setMonth(d.getMonth()+step)}
 else {d.setMonth(0,1);d.setFullYear(d.getFullYear()+step)}
 chartAnchor=d;
 renderCharts()
}

function renderWeek(){
 const report=buildWeekReport(state,reportProfileId,reportWeekOffset);
 const selector=$('report-profile');
 selector.replaceChildren();
 const all=document.createElement('option');all.value='all';all.textContent='Todos los lugares';selector.append(all);
 for(const p of state.profiles){const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name+' · '+p.place;selector.append(opt)}
 selector.value=report.profile?report.profile.id:'all';
 selector.disabled=!state.profiles.length;
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
  if(options.money)td.classList.add('report-money');
  return td
 }
 function markCell(marks){
  if(!marks.length)return makeCell('—',{empty:true});
  const first=marks[0],multiple=marks.length>1,provisional=marks.some(x=>x.provisional);
  return makeCell(weekClock(first.time)+(first.provisional?'~':'')+(multiple?'+':''),
   {provisional,title:marks.map(x=>weekClock(x.time)+(x.provisional?' (provisional)':'')).join(' · '),
    aria:'Marcas: '+marks.map(x=>weekClock(x.time)+(x.provisional?' provisional':'')).join(', ')})
 }
 if(!report.entries.length){
  const tr=document.createElement('tr'),td=document.createElement('td');
  td.colSpan=7;td.className='report-no-shifts';td.textContent='Sin jornadas esta semana';
  tr.append(td);rows.append(tr)
 }
 for(const entry of report.entries){
  const tr=document.createElement('tr');if(entry.isToday)tr.className='current-day';
  const first=document.createElement('td'),day=document.createElement('span'),tag=document.createElement('span'),b=document.createElement('button');
  day.className='report-day-label';tag.className='report-work-tag';tag.textContent=entry.initials;
  tag.title=entry.profile?.place||entry.profile?.name||entry.shift.place||'Trabajo';
  b.type='button';b.className='week-day-button';
  b.textContent=entry.date.toLocaleDateString('es',{weekday:'short',day:'numeric'}).replace('.','');
  b.setAttribute('aria-label','Ver y editar '+(entry.profile?.place||'la jornada')+' del '+entry.date.toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'}));
  b.onclick=()=>{
   selectedProfile=entry.shift.profileId;
   selectedDay=entry.key;month=entry.key.slice(0,7);
   $('shift-form').hidden=true;render();showView('calendar')
  };
  day.append(tag,b);first.append(day);tr.append(first);
  tr.append(markCell(entry.marks.entry),markCell(entry.marks.breakStart),markCell(entry.marks.breakEnd),markCell(entry.marks.exit));
  tr.append(makeCell(detailedHours(entry.totals.workedMs)));
  tr.append(makeCell(money(entry.totals.netCents),{money:true}));
  rows.append(tr)
 }
 $('week-total-hours').textContent=detailedHours(report.totals.workedMs);
 $('week-total-net').textContent=money(report.totals.netCents);
 $('week-total-gross').textContent=money(report.totals.grossCents);
 $('week-total-tax').textContent=money(report.totals.taxCents);
 $('week-total-overtime').textContent=detailedHours(report.totals.overtimeMs);
 const rates=$('week-total');rates.replaceChildren();
 const profiles=report.includeAll?state.profiles:report.profile?[report.profile]:[];
 for(const p of profiles){
  const div=document.createElement('div');div.className='report-rate-line';
  const label=document.createElement('span');
  label.textContent='Tarifa '+money(p.rateCents)+'/h · '+p.place;
  div.append(label);
  const subtotal=report.byProfile.get(p.id);
  if(p.taxBasisPoints>0){
   const tax=document.createElement('span');
   tax.textContent='Retención '+money(subtotal?.taxCents??0);
   div.append(tax)
  }
  rates.append(div)
 }
}
function setReportCapture(enabled){
 reportCapture=Boolean(enabled);
 const root=$$('.wt-app')[0];
 if(root)root.classList.toggle('report-capture-mode',reportCapture);
 $('report-capture').textContent=reportCapture?'Salir de captura':'Vista para captura';
 $('report-capture').setAttribute('aria-pressed',reportCapture?'true':'false')
}
// Independent user palette; no payroll or authentication data is modified.
const TONE_DEFAULT={ui:0,fluid:0,text:0};
function clampTone(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(360,Math.round(n))):0}
function storedTones(){
 try{
  const v=JSON.parse(localStorage.getItem(TONE_SETTINGS_KEY)||'null');
  if(!v||typeof v!=='object')return {...TONE_DEFAULT};
  return {ui:clampTone(v.ui),fluid:clampTone(v.fluid),text:clampTone(v.text)}
 }catch(_){return {...TONE_DEFAULT}}
}
let savedTones=storedTones(),previewTones={...savedTones};
function toneRgb(value){
 const hueIndex=clampTone(value);
 if(hueIndex===0)return '255,255,255';
 const h=((hueIndex-1)/359)*360,s=.89,l=.75,c=(1-Math.abs(2*l-1))*s;
 const x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
 let r=0,g=0,b=0;
 if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}
 else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}
 return [r,g,b].map(k=>Math.round((k+m)*255)).join(',')
}
function applyTones(palette){
 uiRoot.host.style.setProperty('--nx-ui-rgb',toneRgb(palette.ui));
 uiRoot.host.style.setProperty('--nx-fluid-rgb',toneRgb(palette.fluid));
 uiRoot.host.style.setProperty('--nx-text-rgb',toneRgb(palette.text))
}
function toneEditorOpen(){
 previewTones={...savedTones};
 $('tone-ui').value=String(previewTones.ui);
 $('tone-fluid').value=String(previewTones.fluid);
 $('tone-text').value=String(previewTones.text);
 message('');
 showView('home');
 $('tone-overlay').hidden=false;
 $('tone-ui').focus()
}
function toneEditorClose(saveChanges){
 if(saveChanges){
  try{localStorage.setItem(TONE_SETTINGS_KEY,JSON.stringify(previewTones))}
  catch(e){message('No se pudo guardar el color en este navegador.',true);return}
  savedTones={...previewTones}
 }else applyTones(savedTones);
 $('tone-overlay').hidden=true;
 showView('settings')
}
applyTones(savedTones);

function showView(view){
 currentView=view;
 for(const name of ['home','mark','settings','calendar','week','charts'])$('view-'+name).hidden=name!==view;
 for(const button of $$('[data-nav]'))button.setAttribute('aria-current',button.dataset.nav===view?'page':'false');
 if(view!=='week')setReportCapture(false);
 if(view==='charts')renderCharts()
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
  $('geo-enabled').checked=zone?.enabled!==false;
  $('geo-lat').value=Number.isFinite(zone?.lat)?String(zone.lat):'';
  $('geo-lon').value=Number.isFinite(zone?.lon)?String(zone.lon):'';
  $('geo-radius').value=String(zone?.radiusMeters??805);
  $('geo-arrival').value=String(zone?.arrivalMinutes??20);
  $('geo-exit').value=String(zone?.exitMinutes??20);
  $('geo-place-label').value=zone?.label||'';
 }
 const options=$('geo-profile');options.replaceChildren();
 for(const item of state.profiles){
  const option=document.createElement('option');option.value=item.id;option.textContent=profileLabel(item);options.append(option)
 }
 options.value=selectedProfile;
 $('geo-profile-timezone').value=p?.timeZone||Intl.DateTimeFormat().resolvedOptions().timeZone||'No disponible';
 $('geo-choice-label').textContent=zone&&G.validZone(zone)?
  (zone.label||'Punto de trabajo guardado')+' · '+zone.lat.toFixed(5)+', '+zone.lon.toFixed(5):
  'Elegí un punto en el mapa o detectá tu ubicación; guardalo para crear la zona.';
 $('geo-home-monitor').hidden=!geoMonitor;
 $('geo-home-monitor').textContent=geoMonitor?'GPS de '+(state.profiles.find(p=>p.id===geoMonitor.profileId)?.name||'trabajo')+' · '+(geoMonitor.paused?'pausado por pestaña oculta':'activo con esta página abierta'):'';
 renderGeoPending()
}
function renderGeoPending(){
 const proposal=geoPending[selectedProfile];
 $('geo-pending').hidden=!proposal;
 if(!proposal)return;
 const review=proposal.needsCrossingTime===true;
 $('geo-pending-label').textContent=review?'Revisar salida de la zona':proposal.kind==='entry'?'Entrada estimada':'Salida estimada';
 $('geo-pending-time').textContent=review?'Hora por indicar':fmt(proposal.estimatedAt);
 $('geo-pending-info').textContent=review?
  'Al volver estás fuera de la zona. '+
  (Number.isFinite(proposal.lastInsideAt)?'Última comprobación dentro: '+fmt(proposal.lastInsideAt)+' · ':'')+
  'Comprobación fuera: '+fmt(proposal.firstOutsideAt)+
  '. El GPS no registró el momento de salida. Indicá cuándo cruzaste el límite; restaremos '+proposal.marginMinutes+' min antes de registrar.':
  proposal.kind==='entry'?
  'Permaneciste en la zona el tiempo configurado. Esta propuesta no modifica tu jornada hasta confirmarla.':
  'Nexo detectó tu salida y restó el margen configurado. Revisá la hora antes de registrarla.';
 $('geo-confirm').disabled=review;
 $('geo-edit').textContent=review?'Indicar hora':'Corregir hora';
 $('geo-edit-form').hidden=!review;
 const field=$('geo-edit-time');
 const label=field.closest('label');
 if(label&&label.firstChild)label.firstChild.textContent=review?'Hora en que saliste de la zona ':'Hora real ';
 if(review)field.value='';
}
function persistedGeoSession(){
 const data=readLocalObject(GEO_MONITOR_KEY);
 if(data.active!==true||typeof data.profileId!=='string')return null;
 return data
}
function persistGeoSession(m){
 if(!m)return;
 const record={
  active:true,
  profileId:m.profileId,
  shiftId:E.active(state)?.id||null,
  session:m.session,
  lastInsideAt:Number.isFinite(m.lastInsideAt)?m.lastInsideAt:null,
  lastSampleAt:Number.isFinite(m.lastSampleAt)?m.lastSampleAt:null,
  savedAt:Date.now()
 };
 try{localStorage.setItem(GEO_MONITOR_KEY,JSON.stringify(record))}
 catch(_){geoFeedback('No se pudo conservar la sesión GPS en este navegador.')}
}
function clearGeoRecovery(){
 geoRecoveryPending=false;
 if(geoRecoveryTimer!==null){clearTimeout(geoRecoveryTimer);geoRecoveryTimer=null}
}
function scheduleGenericFallback(){
 clearGeoRecovery();
 if(currentView!=='home'||geoPending[selectedProfile])return;
 geoRecoveryPending=true;
 // A missing GPS fix must not block the ordinary manual-mark flow forever.
 geoRecoveryTimer=setTimeout(()=>{
  geoRecoveryTimer=null;
  if(!geoRecoveryPending)return;
  geoRecoveryPending=false;
  if(!geoPending[selectedProfile])proposeNextMark()
 },14000)
}
function stopGeoMonitor(reason='Reconocimiento detenido. Tu ubicación ya no se consulta.'){
 clearGeoRecovery();
 if(geoMonitor){
  if(geoMonitor.watchId!==null)navigator.geolocation.clearWatch(geoMonitor.watchId);
  if(geoMonitor.pollId!==null)clearInterval(geoMonitor.pollId);
  geoMonitor=null
 }
 localStorage.removeItem(GEO_MONITOR_KEY);
 geoFeedback(reason);
 renderGeo()
}
function disposeGeoMonitor(){
 // Navigation/closing is NOT the user's request to turn recognition off.
 // Preserve opt-in for the next visible launch; the browser stops observing.
 if(!geoMonitor)return;
 if(geoMonitor.watchId!==null)navigator.geolocation.clearWatch(geoMonitor.watchId);
 if(geoMonitor.pollId!==null)clearInterval(geoMonitor.pollId);
 persistGeoSession(geoMonitor);
 geoMonitor=null
}
function restoreGeoMonitor(){
 // A saved, enabled workplace zone and an open shift are an explicit opt-in
 // to check GPS on launch. No browser geolocation runs while the page is closed.
 const activeShift=E.active(state);
 const saved=persistedGeoSession();
 // An enabled zone is enough to resume foreground recognition, even
 // before the first entry of the day. Never monitor a disabled zone.
 const enabled=p=>p&&geoFor(p.id)?.enabled&&G.validZone(geoFor(p.id));
 const preferred=activeShift?state.profiles.find(p=>p.id===activeShift.profileId):
  state.profiles.find(p=>p.id===selectedProfile&&enabled(p))||state.profiles.find(enabled);
 const stored=saved||(enabled(preferred)?{
  active:true,profileId:preferred.id,shiftId:activeShift?.id||null,
  session:G.emptySession(),lastInsideAt:null,lastSampleAt:null
 }:null);
 if(!stored||geoMonitor)return false;
 const zone=geoFor(stored.profileId);
 const prof=state.profiles.find(p=>p.id===stored.profileId);
 if(!prof||!zone?.enabled||!G.validZone(zone)||!navigator.geolocation){
  localStorage.removeItem(GEO_MONITOR_KEY);
  return false
 }
 const active=E.active(state);
 // An open shift for another workplace should not be monitored silently.
 if(active&&active.profileId!==stored.profileId)return false;
 selectedProfile=stored.profileId;
 const sameShift=!active||!stored.shiftId||stored.shiftId===active.id;
 const session=sameShift&&stored.session&&typeof stored.session==='object'?{
  ...G.emptySession(),
  ...stored.session,
  mode:stored.session.mode==='inside'||stored.session.mode==='outside'?stored.session.mode:'unknown'
 }:G.emptySession();
 geoMonitor={
  profileId:stored.profileId,session,
  paused:true,watchId:null,pollId:null,
  lastInsideAt:sameShift&&Number.isFinite(stored.lastInsideAt)?stored.lastInsideAt:null,
  lastSampleAt:sameShift&&Number.isFinite(stored.lastSampleAt)?stored.lastSampleAt:null,
  restored:true
 };
 scheduleGenericFallback();
 resumeGeoMonitor();
 geoFeedback('Comprobando zona de '+(prof.place||prof.name)+' tras volver a abrir la página…');
 return true
}
function geolocationError(error){
 if(!geoMonitor)return;
 const reason=error?.code===1?'Permiso GPS denegado. Revisá los permisos de ubicación de Wix.':
  error?.code===2?'GPS no disponible. Comprobá los servicios de ubicación.':
  'No se obtuvo ubicación a tiempo; volveremos a intentar.';
 geoFeedback(reason);
 if(error?.code===1){const pending=geoRecoveryPending;stopGeoMonitor(reason);if(pending&&currentView==='home')proposeNextMark()}
 else if(geoRecoveryPending){clearGeoRecovery();if(currentView==='home')proposeNextMark()}
}
function processGeoPosition(pos,monitor=geoMonitor){
 if(!monitor||monitor!==geoMonitor||document.visibilityState==='hidden')return;
 const zone=geoFor(monitor.profileId);
 if(!zone?.enabled||!G.validZone(zone)){stopGeoMonitor('Configuración GPS inválida o deshabilitada.');return}
 const now=Date.now();
 if(!Number.isFinite(pos.timestamp)||now-pos.timestamp>120000)return;
 const p={lat:pos.coords.latitude,lon:pos.coords.longitude,accuracy:pos.coords.accuracy};
 const before=monitor.session;
 const lastGood=monitor.lastSampleAt;
 const lastInside=monitor.lastInsideAt;
 const hadGap=Number.isFinite(lastGood)&&now-lastGood>150000;
 const result=G.observe(before,zone,p,now);
 if(result.quality==='imprecisa'||result.quality==='límite'){
  geoFeedback('GPS '+result.quality+' · esperaremos una lectura confiable.');
  if(monitor.restored)geoFeedback('Comprobando GPS al regresar · '+result.quality+'.');
  return
 }
 monitor.lastSampleAt=now;
 // A long interval with the page closed cannot count as verified
 // residence inside a zone or as two distinct outside samples.
 if(hadGap&&result.quality==='dentro'&&!before.entryEmitted){
  result.session={...result.session,enteredAt:now}
 }
 if(hadGap&&result.quality==='fuera'&&before.mode==='outside'){
  result.session={...result.session,exitStartedAt:now,outsideSamples:1}
 }
 monitor.session=result.session;
 if(result.quality==='dentro')monitor.lastInsideAt=now;
 const dist=Number.isFinite(result.distanceMeters)?result.distanceMeters+' m del punto':'posición no válida';
 geoFeedback('Reconocimiento '+result.quality+' · '+dist);
 const active=E.active(state);
 const missedExit=result.quality==='fuera'&&active&&
  active.profileId===monitor.profileId&&active.breakStartedAt===null&&
  !geoPending[monitor.profileId]&&(
   (hadGap&&before.mode==='inside'&&Number.isFinite(lastInside))||
   (monitor.restored&&before.mode==='unknown')
  );
 if(missedExit){
  // No observation occurred during the closed-page gap: never invent
  // the precise crossing time. Require the user to supply it.
  const candidate={
   kind:'exit',needsCrossingTime:true,
   profileId:monitor.profileId,activeShiftId:active.id,
   lastInsideAt:Number.isFinite(lastInside)?lastInside:null,
   earliestAt:active.startedAt,firstOutsideAt:now,createdAt:now,
   marginMinutes:zone.exitMinutes,source:'gps-resume-review'
  };
  geoPending={...geoPending,[monitor.profileId]:candidate};
  localStorage.setItem(GEO_PENDING_KEY,JSON.stringify(geoPending));
  monitor.session={...monitor.session,mode:'outside',everInside:true,exitStartedAt:null,outsideSamples:1,exitEmitted:true};
  selectedProfile=monitor.profileId;
  closeSuggestion(false);
  clearGeoRecovery();
  render();
  showView('home');
  message('Estás fuera de la zona laboral. Revisá la hora de salida detectada al regresar.')
 }else if(monitor.restored){
  clearGeoRecovery();
  if(!geoPending[selectedProfile]&&currentView==='home')proposeNextMark();
 }
 monitor.restored=false;
 persistGeoSession(monitor);
 if(missedExit||!result.event)return;
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
 message((entry?'Entrada':'Salida')+' aproximada detectada. Confirmá o corregí la propuesta GPS.')
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
 // Applies equally when saved via the form and via the map picker.
 if(zone.enabled)startGeoMonitor();
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
     closeGeoEditor();renderSettingsCards();
     message('Ubicación guardada para '+p.place+'.')
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
  {enableHighAccuracy:false,maximumAge:0,timeout:30000});
 // Ask for a fresh fix on return, without relying solely on a cached watch event.
 navigator.geolocation.getCurrentPosition(pos=>processGeoPosition(pos,m),geolocationError,
  {enableHighAccuracy:false,maximumAge:0,timeout:25000});
 m.pollId=setInterval(()=>navigator.geolocation.getCurrentPosition(pos=>processGeoPosition(pos,m),geolocationError,
  {enableHighAccuracy:false,maximumAge:0,timeout:20000}),60000);
 persistGeoSession(m);
 renderGeo()
}
function pauseGeoMonitor(){
 const m=geoMonitor;if(!m||m.paused)return;
 if(m.watchId!==null)navigator.geolocation.clearWatch(m.watchId);
 if(m.pollId!==null)clearInterval(m.pollId);
 m.watchId=null;m.pollId=null;m.paused=true;
 persistGeoSession(m);
 geoFeedback('GPS pausado con la pestaña oculta; comprobación al volver, sin detección en segundo plano.');
 renderGeo()
}
function startGeoMonitor(){
 if(!G){geoFeedback('Motor GPS no disponible.');return}
 const p=profile(),zone=geoFor(selectedProfile);
 if(!p||!zone?.enabled||!G.validZone(zone)){geoFeedback('Guardá primero un lugar de trabajo con la zona GPS habilitada.');return}
 if(!navigator.geolocation){geoFeedback('Este navegador no admite GPS.');return}
 if(geoMonitor)stopGeoMonitor();
 geoMonitor={profileId:p.id,session:G.emptySession(),paused:true,watchId:null,pollId:null,lastInsideAt:null,lastSampleAt:null,restored:false};
 geoFeedback('Solicitando GPS. Se reanudará al volver a abrir la página, pero no funciona cerrada.');
 persistGeoSession(geoMonitor);
 resumeGeoMonitor()
}
function confirmGeoCandidate(override){
 const candidate=geoPending[selectedProfile];
 if(!candidate)throw Error('Ya no hay una propuesta GPS pendiente');
 const review=candidate.needsCrossingTime===true;
 if(review&&override==null)throw Error('Indicá la hora en que saliste de la zona.');
 const crossing=review?validDate(override):null;
 const margin=review?(Number(candidate.marginMinutes)||0)*60000:0;
 const at=review?crossing-margin:override==null?candidate.estimatedAt:validDate(override),now=Date.now();
 if(review){
  if(crossing<(Number.isFinite(candidate.lastInsideAt)?candidate.lastInsideAt:candidate.earliestAt)||crossing>candidate.firstOutsideAt+60000)
   throw Error('La salida debe estar entre la última posición dentro y la primera comprobación fuera.');
 }
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
  const last=shift.breaks.length?shift.breaks[shift.breaks.length-1].endAt:shift.startedAt;
  if(at<last)throw Error('La hora calculada con el margen queda antes de la última marca. Ajustá la hora de salida.');
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
 return {enabled:p.enabled!==false,
  durationMinutes:Number.isInteger(p.durationMinutes)&&p.durationMinutes>=1&&p.durationMinutes<=240?p.durationMinutes:30,
  toleranceMinutes:Number.isInteger(p.toleranceMinutes)&&p.toleranceMinutes>=0&&p.toleranceMinutes<=120?p.toleranceMinutes:5}
}
function renderBreakSettings(){
 const prefs=prefsFor(selectedProfile),p=profile();
 $('break-auto-enabled').checked=prefs.enabled;
 $('break-duration').value=String(prefs.durationMinutes);
 $('break-tolerance').value=String(prefs.toleranceMinutes);
 for(const e of $('break-settings-form').querySelectorAll('input,button'))e.disabled=!p;
 $('break-settings-note').textContent=p?'Estimar regreso tras '+(prefs.durationMinutes+prefs.toleranceMinutes)+' minutos.':'Primero agregá un lugar de trabajo.';
 $('break-settings-summary').textContent='D'+prefs.durationMinutes+' · '+prefs.toleranceMinutes+'T';
 $('break-settings-profile').textContent=p?profileLabel(p):'Sin lugar de trabajo';
 $('break-settings-state').textContent=p?(prefs.enabled?'Activo':'Pausado'):'Sin configurar';
 $('break-edit').disabled=!p;
 $('break-settings-form').hidden=!breakEditing
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
 if(event.key===WORK_TAG_KEY){workTags=readLocalObject(WORK_TAG_KEY);renderTagSettings();renderCalendar();renderSettingsCards();return}
 if(event.key===WORK_OFF_KEY){workDaysOff=readLocalObject(WORK_OFF_KEY);renderCalendar();return}
 if(event.key===TONE_SETTINGS_KEY){savedTones=storedTones();if($('tone-overlay').hidden)applyTones(savedTones);return}
 if(event.key===BREAK_SETTINGS_KEY){breakPreferences=readBreakPreferences();renderBreakSettings();return}
 if(event.key===GEO_SETTINGS_KEY){geoSettings=readLocalObject(GEO_SETTINGS_KEY);geoFormProfile=null;if(geoMonitor)stopGeoMonitor('Se actualizó la zona GPS en otra pestaña.');renderGeo();renderSettingsCards();return}
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
 if(geoMonitor&&geoMonitor.paused){scheduleGenericFallback();geoMonitor.restored=true;resumeGeoMonitor()}
 else if(!geoMonitor)restoreGeoMonitor();
 if(!localStorage.getItem(KEY)){lastHiddenAt=null;return}
 try{
  freshState();
  if(!checkAutoBreak())render();
  if(!geoRecoveryPending&&lastHiddenAt&&Date.now()-lastHiddenAt>=120000&&currentView==='home'&&$('suggest-backdrop').hidden)proposeNextMark();
  lastHiddenAt=null
 }catch(e){message('No se pudo recuperar el descanso',true)}
}

function renderCalendar(){
 const [year,mo]=month.split('-').map(Number),first=new Date(year,mo-1,1);
 const offset=(first.getDay()+6)%7,days=new Date(year,mo,0).getDate();
 $('month-label').textContent=first.toLocaleDateString('es',{month:'long',year:'numeric'});
 const box=$('calendar');box.replaceChildren();
 for(const label of ['L','M','X','J','V','S','D']){
  const e=document.createElement('span');e.className='weekday';e.textContent=label;box.append(e)
 }
 for(let k=0;k<offset;k++){
  const e=document.createElement('span');e.className='day outside';box.append(e)
 }
 const chosen=profile();
 for(let n=1;n<=days;n++){
  const date=month+'-'+String(n).padStart(2,'0'),weekday=new Date(year,mo-1,n,12).getDay();
  const starts=state.profiles.filter(p=>weekStartDayOf(p)===weekday);
  const ends=state.profiles.filter(p=>(weekStartDayOf(p)+6)%7===weekday);
  const records=state.shifts.filter(s=>s.profileId===selectedProfile&&localDate(s.startedAt)===date);
  const b=document.createElement('button');
  b.className='day'+(date===selectedDay?' selected':'');b.type='button';
  if(starts.length)b.style.background=pastelBlend(starts.map(tagChoice),.25);
  const label=document.createElement('span');label.className='calendar-date-number';label.textContent=n;b.append(label);
  if(ends.length){
   const dot=document.createElement('i');dot.className='calendar-week-end';
   dot.style.background=pastelDot(ends.map(tagChoice));
   b.append(dot)
  }
  const offForSelected=chosen&&isOffDay(chosen.id,date);
  if(offForSelected){
   const small=document.createElement('small');small.className='calendar-off-label';small.textContent='OFF';b.append(small)
  }else if(records.length){
   const small=document.createElement('small');small.className='calendar-work-hours';
   small.textContent=hours(records.reduce((v,s)=>v+duration(s),0));b.append(small)
  }else{
   const otherOff=state.profiles.filter(p=>isOffDay(p.id,date));
   if(otherOff.length){
    const small=document.createElement('small');small.className='calendar-off-label';
    small.textContent=otherOff.length===1?workTagDisplay(otherOff[0])+' OFF':'OFF';small.title=otherOff.map(p=>p.place).join(' · ');b.append(small)
   }
  }
  const note=starts.map(p=>'Inicio de semana: '+p.place)
   .concat(ends.map(p=>'Fin de semana: '+p.place));
  if(offForSelected)note.push('Libre: '+chosen.place);
  b.title=note.join(' · ');
  b.setAttribute('aria-label',new Date(year,mo-1,n,12).toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long'})+
   (note.length?' · '+note.join(' · '):''));
  b.onclick=()=>{selectedDay=date;$('shift-form').hidden=true;render()};
  box.append(b)
 }
 renderOffPicker()
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
const SETTINGS_INFOS={
 week:{title:'Cierre de semana',text:'Cada lugar tiene su propio día de cierre. Al modificarlo se recalculan los períodos semanales y las horas extra de ese trabajo, sin borrar marcas anteriores. Las tarifas de jornadas ya registradas se conservan.'},
 geo:{title:'Ubicación y privacidad',text:'La ubicación se consulta con permiso del navegador mientras la página está visible. Se conserva el punto central del trabajo y las horas propuestas, no tu recorrido. No existe seguimiento continuo con la página cerrada o el teléfono bloqueado. Las propuestas GPS deben confirmarse manualmente y se descartan las lecturas imprecisas.'},
 break:{title:'Descanso automático provisional',text:'D indica minutos de descanso y T indica minutos de tolerancia. Por ejemplo, D30 · 5T propone el regreso después de 35 minutos cuando no se registra manualmente. Las marcas son provisionales: puedes confirmarlas, corregirlas o descartarlas. Puedes pausar las estimaciones desde Editar configuración.'}
};
function closeSettingsInfo(){
 $('settings-info-backdrop').hidden=true;
 if(settingsInfoReturn)settingsInfoReturn.focus();
 settingsInfoReturn=null
}
for(const btn of $$('[data-settings-info]')){
 btn.onclick=()=>{
  const info=SETTINGS_INFOS[btn.dataset.settingsInfo];if(!info)return;
  settingsInfoReturn=btn;
  $('settings-info-title').textContent=info.title;
  $('settings-info-text').textContent=info.text;
  $('settings-info-backdrop').hidden=false;
  $('settings-info-close').focus()
 }
}
$('settings-info-close').onclick=closeSettingsInfo;
$('settings-info-done').onclick=closeSettingsInfo;
$('settings-info-backdrop').onclick=e=>{if(e.target===$('settings-info-backdrop'))closeSettingsInfo()};
$('settings-info-backdrop').onkeydown=e=>{
 if(e.key==='Escape'){e.preventDefault();closeSettingsInfo()}
 if(e.key==='Tab'){
  const close=$('settings-info-close'),done=$('settings-info-done');
  if(e.shiftKey&&document.activeElement===close){e.preventDefault();done.focus()}
  else if(!e.shiftKey&&document.activeElement===done){e.preventDefault();close.focus()}
 }
};
$('tone-open').onclick=toneEditorOpen;
for(const [id,key] of [['tone-ui','ui'],['tone-fluid','fluid'],['tone-text','text']]){
 $(id).oninput=e=>{previewTones[key]=clampTone(e.target.value);applyTones(previewTones)}
}
$('tone-save').onclick=()=>toneEditorClose(true);
$('tone-cancel').onclick=()=>toneEditorClose(false);
$('tone-overlay').onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();toneEditorClose(false)}};
$('show-profile').onclick=()=>openProfileEditor();
$('cancel-profile').onclick=closeProfileEditor;
$('profile-form').onsubmit=e=>{
 e.preventDefault();
 guard(()=>{
  const form=e.currentTarget,fd=new FormData(form),id=fd.get('id');
  const input={
   name:fd.get('name'),place:fd.get('place'),
   hourlyRate:fd.get('hourlyRate'),taxEnabled:Number(fd.get('taxPercent'))>0,
   taxPercent:fd.get('taxPercent'),
   overtimeAfterHours:fd.get('overtimeAfterHours'),
   overtimeMultiplier:fd.get('overtimeMultiplier'),
   weekStartDay:(Number(fd.get('weekCloseDay'))+1)%7
  };
  let next,newId;
  if(id){
   const original=state.profiles.find(p=>p.id===id);
   if(!original)throw Error('Ya no existe este lugar de trabajo');
   const validated=E.addProfile(E.blank(),{...input,timeZone:original.timeZone}).profiles[0];
   const updated={...original,...validated,id:original.id,createdAt:original.createdAt,timeZone:original.timeZone};
   next={...state,profiles:state.profiles.map(p=>p.id===id?updated:p),
    shifts:state.shifts.map(sh=>sh.profileId===id?{...sh,weekStartDay:updated.weekStartDay}:sh)};
   newId=id
  }else{
   next=E.addProfile(state,input);
   newId=next.profiles[next.profiles.length-1].id
  }
  const tagColor=pendingNewTagColor||newTagDefault();
  localStorage.setItem(WORK_TAG_KEY,JSON.stringify({...workTags,[newId]:tagColor}));
  workTags={...workTags,[newId]:tagColor};
  selectedProfile=newId;settingsExpandedProfile=newId;
  profileEditingId=null;
  form.hidden=true;form.reset();pendingNewTagColor='';
  save(next)
 })
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
$('geo-add').onclick=()=>openGeoEditor(state.profiles.find(p=>!G.validZone(geoFor(p.id)))||profile()||state.profiles[0]);
$('geo-cancel').onclick=closeGeoEditor;
$('geo-profile').onchange=e=>{
 const chosen=state.profiles.find(p=>p.id===e.target.value);if(!chosen)return;
 selectedProfile=chosen.id;geoFormProfile=null;renderGeo();renderSettingsCards()
};
$('geo-form').onsubmit=event=>{
 event.preventDefault();
 try{
  const p=saveGeoFromForm();
  closeGeoEditor();renderSettingsCards();
  message('Ubicación guardada para '+p.place+'. El GPS se comprueba cuando esta página está visible.')
 }catch(e){geoFeedback(e.message||'No se pudo guardar la zona')}
};
$('geo-confirm').onclick=()=>{try{confirmGeoCandidate()}catch(e){message(e.message,true)}};
$('geo-discard').onclick=()=>{
 if(!geoPending[selectedProfile])return;
 delete geoPending[selectedProfile];localStorage.setItem(GEO_PENDING_KEY,JSON.stringify(geoPending));
 renderGeoPending();message('Propuesta GPS descartada. Ningún registro fue modificado.')
};
$('geo-edit').onclick=()=>{
 const c=geoPending[selectedProfile];if(!c)return;
 $('geo-edit-time').value=c.needsCrossingTime?'':asInput(c.estimatedAt);
 $('geo-edit-form').hidden=false;
 $('geo-edit-time').focus()
};
$('geo-edit-cancel').onclick=()=>{$('geo-edit-form').hidden=true};
$('geo-edit-form').onsubmit=e=>{
 e.preventDefault();
 try{confirmGeoCandidate($('geo-edit-time').value)}catch(error){message(error.message||'No se pudo corregir hora GPS',true)}
};

$('break-edit').onclick=()=>{
 if(!profile()){message('Primero agregá un lugar de trabajo.',true);return}
 breakEditing=true;renderBreakSettings();
 $('break-duration').focus()
};
$('break-cancel').onclick=()=>{breakEditing=false;renderBreakSettings()};
$('break-settings-form').onsubmit=event=>{
 event.preventDefault();
 try{
  const p=profile();if(!p)throw Error('Primero agregá un lugar de trabajo');
  const fd=new FormData(event.currentTarget),duration=Number(fd.get('duration')),tolerance=Number(fd.get('tolerance'));
  if(!Number.isInteger(duration)||duration<1||duration>240)throw Error('Duración permitida: 1 a 240 minutos');
  if(!Number.isInteger(tolerance)||tolerance<0||tolerance>120)throw Error('Tolerancia permitida: 0 a 120 minutos');
  breakPreferences={...breakPreferences,[p.id]:{enabled:fd.get('enabled')==='on',durationMinutes:duration,toleranceMinutes:tolerance}};
  localStorage.setItem(BREAK_SETTINGS_KEY,JSON.stringify(breakPreferences));
  breakEditing=false;
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
for(const tab of $$('[data-chart-tab]'))tab.onclick=()=>{
 chartMode=tab.dataset.chartTab;
 chartAnchor=new Date();
 renderCharts()
};
$('chart-prev').onclick=()=>shiftChartPeriod(-1);
$('chart-next').onclick=()=>shiftChartPeriod(1);
$('chart-today').onclick=()=>{chartAnchor=new Date();renderCharts()};

window.addEventListener('storage',onStorageUpdate);
document.addEventListener('visibilitychange',onReturnToApp);

$('report-profile').onchange=e=>{reportProfileId=e.target.value;reportWeekOffset=0;renderWeek()};
$('report-prev-week').onclick=()=>{reportWeekOffset--;renderWeek()};
$('report-next-week').onclick=()=>{if(reportWeekOffset<0){reportWeekOffset++;renderWeek()}};
$('report-current-week').onclick=()=>{reportWeekOffset=0;renderWeek()};
$('report-capture').onclick=()=>setReportCapture(!reportCapture);
const captureInfo=$('report-info-backdrop');
function closeCaptureInfo(){captureInfo.hidden=true;$('report-capture-info').focus()}
$('report-capture-info').onclick=()=>{captureInfo.hidden=false;$('report-info-close').focus()};
$('report-info-close').onclick=closeCaptureInfo;
$('report-info-done').onclick=closeCaptureInfo;
captureInfo.onclick=e=>{if(e.target===captureInfo)closeCaptureInfo()};
captureInfo.onkeydown=e=>{
 if(e.key==='Escape'){e.preventDefault();closeCaptureInfo()}
 if(e.key==='Tab'){
  const controls=[$('report-info-close'),$('report-info-done')];
  const next=e.shiftKey?controls[0]:controls[1];
  if((e.shiftKey&&document.activeElement===controls[0])||(!e.shiftKey&&document.activeElement===controls[1])){
   e.preventDefault();(e.shiftKey?controls[1]:controls[0]).focus()
  }
 }
};
$('report-open-calendar').onclick=()=>{selectedDay=localDate(new Date());month=selectedDay.slice(0,7);render();showView('calendar')};
$('prev-month').onclick=()=>changeMonth(-1);$('next-month').onclick=()=>changeMonth(1);
function changeMonth(step){const [y,m]=month.split('-').map(Number);const d=new Date(y,m-1+step,1);month=localDate(d).slice(0,7);selectedDay=month+'-01';render()}
$('new-shift').onclick=()=>{if(!profile()){message('Primero agrega un lugar de trabajo',true);return}const f=$('shift-form');f.reset();f.hidden=false;f.elements.id.value='';f.elements.startedAt.value=selectedDay+'T09:00';f.elements.closedAt.value=selectedDay+'T17:00';f.elements.breakMinutes.value=0;f.scrollIntoView({behavior:'smooth',block:'nearest'})};
$('cancel-shift').onclick=()=>{$('shift-form').hidden=true};
$('shift-form').onsubmit=e=>{e.preventDefault();guard(()=>{const f=e.currentTarget,p=profile();if(!p)throw Error('Selecciona un perfil');const start=validDate(f.elements.startedAt.value),end=validDate(f.elements.closedAt.value),mins=Number(f.elements.breakMinutes.value);if(end<=start)throw Error('La salida debe ser posterior a la entrada');if(!Number.isInteger(mins)||mins<0||mins*60000>=end-start)throw Error('Descanso inválido');const existingId=f.elements.id.value,old=state.shifts.find(s=>s.id===existingId);if(existingId&&!old)throw Error('La jornada ya no existe');if(old&&old.closedAt===null)throw Error('Finaliza el turno antes de editarlo');const shift={...(old||profileSnapshot(p)),id:old?.id||('manual-'+Date.now()+'-'+Math.random().toString(36).slice(2)),startedAt:start,closedAt:end,breakStartedAt:null,breaks:mins?[{startAt:end-mins*60000,endAt:end}]:[]};const next={...state,shifts:existingId?state.shifts.map(s=>s.id===existingId?shift:s):[...state.shifts,shift]};if(next.shifts.filter(s=>s.closedAt===null).length>1)throw Error('Solo puede haber un turno activo');save(next);f.hidden=true;selectedDay=localDate(start);month=selectedDay.slice(0,7);render()})};
try{state=JSON.parse(localStorage.getItem(KEY)||'null')||E.blank();if(state.schemaVersion!==1||!Array.isArray(state.profiles)||!Array.isArray(state.shifts))throw Error('Formato inválido');selectedProfile=E.active(state)?.profileId||state.profiles[0]?.id||'';render();showView('home');checkAutoBreak();if(!restoreGeoMonitor())proposeNextMark()}
catch(err){state=E.blank();render();showView('home');message('No se pudieron cargar los datos locales: '+err.message,true)}
const breakMonitor=setInterval(()=>{try{checkAutoBreak()}catch(e){message('No se pudo comprobar descanso automático: '+e.message,true)}},15000);
const clockTimer=setInterval(()=>{
 if(typeof uiRoot!=='undefined'&&!uiRoot.host?.isConnected){
  clearInterval(clockTimer);
  clearInterval(breakMonitor);
  if(geoMonitor)disposeGeoMonitor();
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
 if(currentView==='charts'&&currentMinute!==lastChartRefreshMinute){
  lastChartRefreshMinute=currentMinute;renderCharts()
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