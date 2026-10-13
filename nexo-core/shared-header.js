(function(){
'use strict';
const VERSION='20261013-9';
if(window.NEXO_SHARED_HEADER?.version===VERSION)return;

const ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const LOGO_DEFAULT='https://static.wixstatic.com/media/8b64a8_7bd85ca8e1854afc9ae91eab7457c405~mv2.png';

const esc=value=>String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const initials=value=>String(value||'N').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'N';
const mediaUrl=value=>typeof value==='string'?value:(value&&(value.url||value.image?.url||value.src)||'');
const iconUrl=name=>ICON_BASE+encodeURIComponent(String(name||''))+'.png';
const iconTag=(name,label='')=>'<img class="nxo-icon-img" src="'+esc(iconUrl(name))+'" alt="'+esc(label)+'" loading="lazy" decoding="async">';
const iconLabel=(name,label)=>'<span class="nxo-icon-label">'+iconTag(name,'')+'<span>'+esc(label)+'</span></span>';

function normalizeTheme(value){return value==='night'?'night':'day'}
function normalizeLanguage(value){return String(value||'').toLowerCase().startsWith('en')?'en':'es'}

function labels(language){
  const en=normalizeLanguage(language)==='en';
  return {
    personal:en?'My space':'Mi espacio',
    development:en?'Development Center':'Centro de desarrollo',
    workspaces:en?'Workspaces':'Workspaces',
    personalAccess:en?'Direct access':'Accesos directos',
    openWorkspace:en?'Open Workspace':'Abrir Workspace',
    noTools:en?'No tools available':'Sin herramientas disponibles',
    quick:en?'Quick settings':'Ajustes rápidos',
    appearance:en?'Appearance':'Apariencia',
    language:en?'Language':'Idioma',
    day:en?'Light':'Claro',
    night:en?'Dark':'Oscuro',
    spanish:'ES',
    english:'EN',
    profile:en?'Profile settings':'Ajustes de perfil',
    switch:en?'Switch account':'Cambiar cuenta',
    logout:en?'Sign out':'Cerrar sesión',
    openMenu:en?'Open menu':'Abrir menú'
  }
}

function toolIconKey(tool){
  const key=String(tool?.toolKey||tool?.name||'').toLowerCase();
  if(/fich|technical|dynamic-spec/.test(key))return'ficha-tecnica';
  if(/invent|product/.test(key))return'productos';
  if(/bibli|engranaje|gear/.test(key))return'guia';
  if(/learning|desarrollo/.test(key))return'desarrollo';
  if(/schedule|horario/.test(key))return'recordatorio';
  if(/camino|editorial/.test(key))return'guia';
  if(/r96|rising|game/.test(key))return'catalogo';
  return'herramientas'
}

function ensureStyle(){
  if(document.getElementById('nxo-shared-header-style'))return;
  const style=document.createElement('style');
  style.id='nxo-shared-header-style';
  style.textContent=`
.nxo-shared-header{
  --nxo-sh-bg:rgba(8,11,16,.94);--nxo-sh-text:#f2f5f8;--nxo-sh-soft:#b8c5d8;--nxo-sh-muted:#91a0b5;
  --nxo-sh-line:rgba(145,160,181,.18);--nxo-sh-line2:rgba(184,197,216,.30);--nxo-sh-active:#f0ce83;
  --nxo-sh-hover:#f2b35c;--nxo-sh-panel:rgba(15,21,30,.985);--nxo-sh-panel2:#131a24;--nxo-sh-shadow:0 24px 80px rgba(0,0,0,.34);
  position:sticky!important;top:0!important;z-index:2147483200!important;min-height:64px!important;padding:0 22px!important;
  display:flex!important;align-items:center!important;gap:22px!important;color:var(--nxo-sh-text)!important;background:var(--nxo-sh-bg)!important;
  border-bottom:1px solid var(--nxo-sh-line)!important;box-shadow:0 8px 28px rgba(0,0,0,.18)!important;
  -webkit-backdrop-filter:blur(22px) saturate(140%)!important;backdrop-filter:blur(22px) saturate(140%)!important;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;box-sizing:border-box!important;
  overflow:visible!important;contain:none!important
}
.nxo-shared-header[data-theme="day"]{
  --nxo-sh-bg:rgba(38,76,143,.96);--nxo-sh-text:#fff;--nxo-sh-soft:#e8eefb;--nxo-sh-muted:#d8e3f8;
  --nxo-sh-line:rgba(255,255,255,.18);--nxo-sh-line2:rgba(255,255,255,.26);--nxo-sh-active:#fff3a9;
  --nxo-sh-hover:#f88f5b;--nxo-sh-panel:rgba(248,251,255,.995);--nxo-sh-panel2:#eef4ff;--nxo-sh-shadow:0 24px 70px rgba(23,39,85,.28)
}
.nxo-shared-header *{box-sizing:border-box}
.nxo-shared-header button{font-family:inherit}
.nxo-shared-header .nxo-nav-brand{display:flex!important;align-items:center!important;gap:10px!important;min-width:max-content!important;cursor:pointer!important;color:var(--nxo-sh-text)!important;background:transparent!important;border:0!important;padding:0!important}
.nxo-shared-header .nxo-nav-mark{width:42px!important;height:42px!important;flex:0 0 42px!important;display:block!important;border-radius:10px!important;overflow:hidden!important;background:#000!important;border:1px solid rgba(255,255,255,.16)!important;box-shadow:0 8px 22px rgba(0,0,0,.24)!important}
.nxo-shared-header .nxo-nav-mark img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
.nxo-shared-header .nxo-nav-brand-copy{display:grid!important;min-width:0!important;text-align:left!important}
.nxo-shared-header .nxo-nav-brand-copy strong{font-size:13px!important;line-height:1.1!important;color:var(--nxo-sh-text)!important}
.nxo-shared-header .nxo-nav-brand-copy small{margin-top:3px!important;color:var(--nxo-sh-muted)!important;font-size:10px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:230px!important}
.nxo-shared-header .nxo-nav-collapse{display:flex;align-items:stretch;align-self:stretch;gap:22px;flex:1;min-width:0;overflow:visible!important}
.nxo-shared-header .nxo-nav-links{display:flex!important;align-items:stretch!important;align-self:stretch!important;gap:18px!important;flex:1!important;min-width:0!important;overflow:visible!important}
.nxo-shared-header .nxo-nav-group{position:relative!important;display:flex!important;align-items:stretch!important;overflow:visible!important}
.nxo-shared-header .nxo-nav-link{position:relative!important;border:0!important;background:transparent!important;color:var(--nxo-sh-muted)!important;padding:0 2px!important;font-size:12px!important;font-weight:760!important;cursor:pointer!important;white-space:nowrap!important;box-shadow:none!important;transform:none!important;display:flex!important;align-items:center!important;gap:5px!important}
.nxo-shared-header .nxo-nav-link:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:transparent;border-radius:3px 3px 0 0}
.nxo-shared-header .nxo-nav-link:hover,.nxo-shared-header .nxo-nav-link:focus-visible{color:var(--nxo-sh-text)!important;outline:none!important}
.nxo-shared-header .nxo-nav-link:hover:after,.nxo-shared-header .nxo-nav-link:focus-visible:after{background:var(--nxo-sh-hover)!important}
.nxo-shared-header .nxo-nav-link.active{color:var(--nxo-sh-active)!important;font-weight:900!important}
.nxo-shared-header .nxo-nav-link.active:after{background:var(--nxo-sh-active)!important}

.nxo-shared-header .nxo-nav-menu-caret{font-size:10px;line-height:1;opacity:.8;transition:transform .15s ease}
.nxo-shared-header .nxo-personal-menu{
  display:none;position:absolute;left:0;top:calc(100% + 8px);z-index:300;width:320px;max-width:min(420px,calc(100vw - 20px));
  max-height:min(70dvh,620px);overflow:auto;overscroll-behavior:contain;padding:9px;
  border:1px solid var(--nxo-sh-line2);border-radius:14px;background:var(--nxo-sh-panel);color:var(--nxo-sh-text);
  box-shadow:var(--nxo-sh-shadow);-webkit-backdrop-filter:blur(22px) saturate(140%);backdrop-filter:blur(22px) saturate(140%)
}
.nxo-shared-header .nxo-personal-menu.open{display:grid;gap:7px}
.nxo-shared-header[data-theme="day"] .nxo-personal-menu{color:#1d2940}
.nxo-shared-header .nxo-personal-menu-title{padding:7px 9px 4px;color:var(--nxo-sh-muted);font-size:8px;font-weight:900;letter-spacing:.075em;text-transform:uppercase}
.nxo-shared-header .nxo-personal-workspace{display:grid;gap:4px;padding:5px;border:1px solid transparent;border-radius:11px}
.nxo-shared-header .nxo-personal-workspace:hover{border-color:var(--nxo-sh-line)}
.nxo-shared-header .nxo-personal-workspace-name,.nxo-shared-header .nxo-personal-tool{appearance:none;width:100%;border:0;background:transparent;color:inherit;cursor:pointer;font:inherit;text-align:left}
.nxo-shared-header .nxo-personal-workspace-name{min-height:40px;padding:8px 9px;border-radius:9px;display:flex;align-items:center;gap:8px;font-size:11px;font-weight:850}
.nxo-shared-header .nxo-personal-tool{min-height:34px;padding:7px 9px 7px 34px;border-radius:8px;display:flex;align-items:center;gap:8px;font-size:10px;font-weight:740}
.nxo-shared-header .nxo-personal-workspace-name:hover,.nxo-shared-header .nxo-personal-workspace-name:focus-visible,.nxo-shared-header .nxo-personal-tool:hover,.nxo-shared-header .nxo-personal-tool:focus-visible{outline:none;background:rgba(255,255,255,.09)}
.nxo-shared-header[data-theme="day"] .nxo-personal-workspace-name:hover,.nxo-shared-header[data-theme="day"] .nxo-personal-workspace-name:focus-visible,.nxo-shared-header[data-theme="day"] .nxo-personal-tool:hover,.nxo-shared-header[data-theme="day"] .nxo-personal-tool:focus-visible{background:#e6eefc}
.nxo-shared-header .nxo-personal-menu .nxo-icon-img{width:16px;height:16px;display:block;object-fit:contain;flex:0 0 auto}
.nxo-shared-header .nxo-personal-tool .nxo-icon-img{width:14px;height:14px}
.nxo-shared-header .nxo-personal-menu-empty{padding:12px 10px;color:var(--nxo-sh-muted);font-size:10px}
@media(max-width:760px){
  .nxo-shared-header .nxo-nav-group:has(#nxo-personal){display:grid!important;width:100%!important}
  .nxo-shared-header .nxo-personal-menu{position:static!important;width:100%!important;max-width:none!important;max-height:52dvh!important;margin-top:3px!important;box-shadow:none!important;background:var(--nxo-sh-panel2)!important}
}

.nxo-shared-header .nxo-nav-primary-utils{position:relative!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;flex:0 0 auto!important}
.nxo-shared-header .nxo-quick-settings-wrap{position:relative!important;display:flex!important;align-items:center!important}
.nxo-shared-header .nxo-quick-settings-button{appearance:none!important;width:38px!important;height:38px!important;padding:0!important;display:grid!important;place-items:center!important;border:1px solid transparent!important;border-radius:11px!important;background:transparent!important;color:var(--nxo-sh-text)!important;cursor:pointer!important}
.nxo-shared-header .nxo-quick-settings-button:hover,.nxo-shared-header .nxo-quick-settings-button:focus-visible,.nxo-shared-header .nxo-quick-settings-button[aria-expanded="true"]{outline:none!important;background:rgba(255,255,255,.09)!important;border-color:var(--nxo-sh-line)!important}
.nxo-shared-header .nxo-quick-settings-menu{display:none;position:absolute;right:0;top:calc(100% + 8px);z-index:200;width:230px;overflow:hidden;border:1px solid var(--nxo-sh-line2);border-radius:14px;background:var(--nxo-sh-panel);box-shadow:var(--nxo-sh-shadow)}
.nxo-shared-header .nxo-quick-settings-menu.open{display:block}
.nxo-shared-header .nxo-quick-settings-title{padding:10px 12px 7px;color:var(--nxo-sh-muted);font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
.nxo-shared-header .nxo-quick-setting-row{appearance:none;width:100%;min-height:42px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:0;border-top:1px solid var(--nxo-sh-line);background:transparent;color:var(--nxo-sh-text);font-size:11px;font-weight:760;cursor:pointer}
.nxo-shared-header[data-theme="day"] .nxo-quick-setting-row{color:#34405f}
.nxo-shared-header .nxo-quick-setting-row:hover,.nxo-shared-header .nxo-quick-setting-row:focus-visible{outline:none;background:rgba(255,255,255,.08)}
.nxo-shared-header[data-theme="day"] .nxo-quick-setting-row:hover,.nxo-shared-header[data-theme="day"] .nxo-quick-setting-row:focus-visible{background:#eaf1ff}
.nxo-shared-header .nxo-quick-setting-row strong{min-width:34px;padding:3px 7px;border:1px solid var(--nxo-sh-line2);border-radius:999px;color:var(--nxo-sh-soft);font-size:9px;text-align:center}
.nxo-shared-header[data-theme="day"] .nxo-quick-setting-row strong{color:#34405f;border-color:#b9cbed}
.nxo-shared-header .nxo-icon-img{width:18px;height:18px;display:block;object-fit:contain;flex:0 0 auto}
.nxo-shared-header .nxo-icon-label{display:inline-flex;align-items:center;gap:7px;min-width:0}
.nxo-shared-header .nxo-nav-account{display:flex!important;align-items:center!important;gap:8px!important;border:1px solid transparent!important;background:transparent!important;color:var(--nxo-sh-text)!important;padding:6px 8px!important;border-radius:11px!important;cursor:pointer!important}
.nxo-shared-header .nxo-nav-account:hover,.nxo-shared-header .nxo-nav-account:focus-visible{background:rgba(255,255,255,.075)!important;border-color:var(--nxo-sh-line)!important;outline:none!important}
.nxo-shared-header .nxo-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;overflow:hidden;flex:0 0 34px;border:1px solid rgba(255,255,255,.26);background:rgba(255,255,255,.10);color:var(--nxo-sh-active);font-weight:850;font-size:12px}
.nxo-shared-header .nxo-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.nxo-shared-header .nxo-nav-account-copy{display:grid;text-align:left;min-width:0}
.nxo-shared-header .nxo-nav-account-name-row{display:flex;align-items:center;gap:5px;min-width:0}
.nxo-shared-header .nxo-nav-account-copy strong{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px}
.nxo-shared-header .nxo-nav-account-email{display:block;max-width:170px;margin-top:2px;color:var(--nxo-sh-muted);font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nxo-shared-header .nxo-nav-account-role{display:inline-flex;width:max-content;max-width:90px;padding:1px 5px;border-radius:999px;border:1px solid var(--nxo-sh-line2);color:var(--nxo-sh-active);font-size:7px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nxo-shared-header .nxo-nav-caret{font-size:12px;color:var(--nxo-sh-muted)}
.nxo-shared-header .nxo-nav-account-menu{display:none;position:absolute;right:0;top:calc(100% + 8px);width:220px;overflow:hidden;z-index:210;border:1px solid var(--nxo-sh-line2);border-radius:14px;background:var(--nxo-sh-panel);box-shadow:var(--nxo-sh-shadow)}
.nxo-shared-header .nxo-nav-account-menu.open{display:block}
.nxo-shared-header .nxo-nav-account-menu button{width:100%;border:0;background:transparent;color:var(--nxo-sh-text);padding:12px 13px;text-align:left;font-size:11px;font-weight:760;cursor:pointer}
.nxo-shared-header[data-theme="day"] .nxo-nav-account-menu button{color:#111827}
.nxo-shared-header .nxo-nav-account-menu button:hover,.nxo-shared-header .nxo-nav-account-menu button:focus-visible{background:rgba(242,179,92,.16);outline:none}
.nxo-shared-header .nxo-nav-account-menu button.danger{color:#ffb4b4;border-top:1px solid var(--nxo-sh-line)}
.nxo-shared-header[data-theme="day"] .nxo-nav-account-menu button.danger{color:#b94242}
.nxo-shared-header .nxo-mobile-menu-button{display:none;width:42px;height:42px;padding:9px;border:1px solid var(--nxo-sh-line);border-radius:11px;background:rgba(255,255,255,.05);color:var(--nxo-sh-text);cursor:pointer;place-items:center;gap:4px}
.nxo-shared-header .nxo-mobile-menu-button span{display:block;width:20px;height:2px;border-radius:999px;background:currentColor}
.nxo-shared-header .nxo-mobile-menu-button[aria-expanded="true"] span:nth-child(1){transform:translateY(6px) rotate(45deg)}
.nxo-shared-header .nxo-mobile-menu-button[aria-expanded="true"] span:nth-child(2){opacity:0}
.nxo-shared-header .nxo-mobile-menu-button[aria-expanded="true"] span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
@media(max-width:760px){
  .nxo-shared-header{display:flex!important;flex-wrap:wrap!important;justify-content:flex-start!important;align-items:center!important;min-height:58px!important;padding:8px 10px!important;column-gap:7px!important;row-gap:7px!important}
  .nxo-shared-header .nxo-nav-brand{order:1!important;flex:0 0 auto!important;min-width:0!important}
  .nxo-shared-header .nxo-nav-brand-copy{display:none!important}
  .nxo-shared-header .nxo-nav-mark{width:50px!important;height:38px!important;flex:0 0 50px!important}
  .nxo-shared-header .nxo-nav-primary-utils{order:2!important;flex:1 1 auto!important;min-width:0!important;justify-content:flex-end!important;margin-left:auto!important}
  .nxo-shared-header .nxo-mobile-menu-button{order:3!important;display:grid!important;flex:0 0 38px!important;width:38px!important;height:38px!important;margin-left:0!important;padding:8px!important}
  .nxo-shared-header .nxo-nav-collapse{order:5!important;display:none;position:absolute!important;top:calc(100% + 8px)!important;left:10px!important;right:10px!important;z-index:190!important;max-height:calc(100dvh - 86px)!important;overflow:auto!important;padding:10px!important;border:1px solid var(--nxo-sh-line2)!important;border-radius:16px!important;background:var(--nxo-sh-panel)!important;box-shadow:var(--nxo-sh-shadow)!important}
  .nxo-shared-header .nxo-nav-collapse.open{display:grid!important;gap:8px!important}
  .nxo-shared-header .nxo-nav-links{display:grid!important;gap:5px!important;align-self:auto!important}
  .nxo-shared-header .nxo-nav-group{display:grid!important}
  .nxo-shared-header .nxo-nav-link,.nxo-shared-header .nxo-nav-link.active{display:flex!important;align-items:center!important;min-height:44px!important;width:100%!important;padding:0 12px!important;border-radius:10px!important;text-align:left!important;justify-content:flex-start!important}
  .nxo-shared-header .nxo-nav-link:after{display:none!important}
  .nxo-shared-header .nxo-nav-link:hover,.nxo-shared-header .nxo-nav-link:focus-visible,.nxo-shared-header .nxo-nav-link.active{background:rgba(255,255,255,.07)!important}
  .nxo-shared-header .nxo-nav-menu-caret{margin-left:auto}
  
  
  
  .nxo-shared-header .nxo-workspace-group{display:block}
  
  
  
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account{width:auto!important;max-width:142px!important;min-width:0!important;min-height:38px!important;height:38px!important;padding:3px 5px!important;gap:5px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account .nxo-avatar{width:30px!important;height:30px!important;flex:0 0 30px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-copy{display:block!important;min-width:0!important;flex:1 1 auto!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-copy strong{max-width:76px!important;font-size:9px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-email{max-width:102px!important;font-size:7px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-role{font-size:7px!important;max-width:64px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-caret{display:none!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-quick-settings-button{width:36px!important;height:36px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-quick-settings-menu,.nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-menu{position:fixed!important;top:64px!important;left:10px!important;right:10px!important;width:auto!important;margin:0!important;z-index:220!important}
}
@media(max-width:390px){
  .nxo-shared-header .nxo-nav-mark{width:42px!important;flex-basis:42px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account{max-width:128px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-copy strong{max-width:50px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-email{max-width:84px!important}
}
`;
  document.head.appendChild(style)
}


function personalMenuMarkup(navigation,t){
  const workspaces=Array.isArray(navigation?.workspaces)?navigation.workspaces:[];
  if(!workspaces.length)return '<div class="nxo-personal-menu-empty">'+esc(normalizeLanguage(document.documentElement.lang)==='en'?'No Workspaces available':'Sin espacios de trabajo disponibles')+'</div>';
  let body='<div class="nxo-personal-menu-title">'+esc(t.workspaces)+'</div>';
  for(const ws of workspaces){
    const tools=Array.isArray(ws.tools)?ws.tools:[];
    body+='<section class="nxo-personal-workspace" data-nxo-workspace-row="'+esc(ws.workspaceId||'')+'">'+
      '<button type="button" class="nxo-personal-workspace-name" data-nxo-workspace-open="'+esc(ws.workspaceId||'')+'">'+iconTag('workspace','')+'<span>'+esc(ws.name||'Workspace')+'</span></button>'+
      tools.map(tool=>'<button type="button" class="nxo-personal-tool" data-nxo-tool="'+esc(tool?.toolKey||'')+'" data-nxo-workspace="'+esc(ws.workspaceId||'')+'">'+iconTag(toolIconKey(tool),'')+'<span>'+esc(tool?.name||tool?.toolKey||'Herramienta')+'</span></button>').join('')+
    '</section>'
  }
  return body
}

const NAV_TOOL_DEFS=[
  {toolKey:'gear-library',name:'Biblioteca de engranaje'},
  {toolKey:'learning-core',name:'Nexo Learning Core'},
  {toolKey:'dynamic-specs',name:'Fichas Técnicas Dinámicas'},
  {toolKey:'inventory-smart',name:'Inventario Smart'},
  {toolKey:'schedules',name:'Horarios'}
];

async function navigationInstallOptions(toolKey){
  const response=await fetch(siteBase()+'/_functions/nexoDevelopmentInstall',{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    credentials:'same-origin',
    cache:'no-store',
    body:JSON.stringify({action:'options',toolKey})
  });
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.ok||!data?.data)throw new Error(data?.error||'NAVIGATION_OPTIONS_FAILED');
  return data.data
}

function seedNavigationCopy(seed){
  const personalTools=Array.isArray(seed?.personal?.tools)?seed.personal.tools.map(x=>({...x})):[];
  const workspaces=Array.isArray(seed?.workspaces)?seed.workspaces.map(ws=>({...ws,tools:Array.isArray(ws.tools)?ws.tools.map(x=>({...x})):[]})):[];
  return {personal:{name:String(seed?.personal?.name||'Mi espacio'),tools:personalTools},workspaces}
}

async function loadNavigation(options={}){
  const seed=seedNavigationCopy(options.seedNavigation||{});
  const workspaceMap=new Map(seed.workspaces.map(ws=>[String(ws.workspaceId||''),ws]).filter(([id])=>id));
  const directMap=new Map(seed.personal.tools.map(tool=>[String(tool.toolKey||''),tool]).filter(([key])=>key));

  const rows=await Promise.all(NAV_TOOL_DEFS.map(async def=>{
    try{return {def,data:await navigationInstallOptions(def.toolKey)}}catch(_){return {def,data:null}}
  }));
  let successful=0;

  for(const row of rows){
    const data=row.data;
    if(!data)continue;
    successful++;
    const routePath=String(data.routePath||'').trim();
    if(!routePath)continue;
    const destinations=Array.isArray(data.destinations)?data.destinations:[];

    for(const destination of destinations){
      const type=String(destination?.type||'').toLowerCase();
      if(type==='personal'){
        if(destination.canOpen===true){
          directMap.set(row.def.toolKey,{
            toolKey:row.def.toolKey,
            name:String(data.nameEs||row.def.name||row.def.toolKey),
            description:'',
            routePath,
            scope:'personal'
          })
        }
        continue
      }
      if(type!=='workspace')continue;

      const workspaceId=String(destination?.id||'').trim();
      if(!workspaceId)continue;
      let ws=workspaceMap.get(workspaceId);
      if(!ws){
        ws={workspaceId,name:String(destination?.name||'Workspace'),logoImage:null,roleKey:'member',tools:[]};
        workspaceMap.set(workspaceId,ws)
      }else if(destination?.name){
        ws.name=String(destination.name)
      }

      if(destination.installed===true){
        const tools=Array.isArray(ws.tools)?ws.tools:(ws.tools=[]);
        const tool={
          toolKey:row.def.toolKey,
          name:String(data.nameEs||row.def.name||row.def.toolKey),
          description:'',
          routePath,
          scope:'workspace'
        };
        const index=tools.findIndex(x=>String(x.toolKey)===row.def.toolKey);
        if(index>=0)tools[index]=tool;else tools.push(tool)
      }
    }
  }

  if(options.isWonder===true){
    directMap.set('camino-editorial',{
      toolKey:'camino-editorial',name:'Camino Editorial',description:'Entorno editorial',routePath:'/blank-6',scope:'personal'
    });
    directMap.set('r96',{
      toolKey:'r96',name:'R96',description:'Entorno de juegos y desarrollo',routePath:'/blank-9',scope:'personal'
    })
  }

  if(!successful&&seed.workspaces.length===0&&seed.personal.tools.length===0){
    return {personal:{name:'Mi espacio',tools:[]},workspaces:[]}
  }

  const workspaces=[...workspaceMap.values()].map(ws=>({
    ...ws,
    tools:(Array.isArray(ws.tools)?ws.tools:[]).sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es',{sensitivity:'base'}))
  })).sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es',{sensitivity:'base'}));

  return {
    personal:{
      name:seed.personal.name||'Mi espacio',
      tools:[...directMap.values()].sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es',{sensitivity:'base'}))
    },
    workspaces
  }
}

function markup(options={}){
  ensureStyle();
  const language=normalizeLanguage(options.language);
  const theme=normalizeTheme(options.theme);
  const t=labels(language);
  const active=String(options.active||'').toLowerCase();
  const name=String(options.profile?.displayName||options.displayName||'Usuario Nexo');
  const email=String(options.profile?.email||options.email||'');
  const photo=mediaUrl(options.profile?.photoImage||options.photoImage);
  const roleKey=String(options.roleKey||options.profile?.roleKey||'member').toLowerCase();
  const roleLabel=String(options.roleLabel||options.profile?.roleLabel||(roleKey==='wonder'?'Wonder':roleKey==='owner'?'Owner':'Miembro'));
  const contextLabel=String(options.contextLabel||t.personal);
  const logo=String(options.logoUrl||LOGO_DEFAULT);
  const avatar=photo?'<img src="'+esc(photo)+'" alt="'+esc(name)+'">':esc(initials(name));
  const personalActive=active!=='development';

  const quickSettings='<div class="nxo-quick-settings-wrap"><button type="button" class="nxo-quick-settings-button" id="nxo-quick-settings-button" aria-label="'+esc(t.quick)+'" aria-expanded="false">'+iconTag('ajustes-rapidos')+'</button>'+
    '<div class="nxo-quick-settings-menu" id="nxo-quick-settings-menu"><div class="nxo-quick-settings-title">'+esc(t.quick)+'</div>'+
    '<button type="button" class="nxo-quick-setting-row" id="nxo-language-toggle">'+iconLabel('idioma',t.language)+'<strong>'+esc(language==='en'?t.english:t.spanish)+'</strong></button>'+
    '<button type="button" class="nxo-quick-setting-row" id="nxo-theme-toggle">'+iconLabel(theme==='night'?'modo-oscuro':'modo-claro',t.appearance)+'<strong>'+esc(theme==='night'?t.night:t.day)+'</strong></button></div></div>';

  const nav=
    '<div class="nxo-nav-group">'+
      '<button type="button" class="nxo-nav-link '+(personalActive?'active':'')+'" id="nxo-personal" aria-haspopup="true" aria-expanded="false" aria-controls="nxo-personal-menu">'+iconLabel('home',t.personal)+'<span class="nxo-nav-menu-caret">⌄</span></button>'+
      '<div class="nxo-personal-menu" id="nxo-personal-menu" role="menu"></div>'+
    '</div>'+
    '<div class="nxo-nav-group">'+
      '<button type="button" class="nxo-nav-link '+(active==='development'?'active':'')+'" id="nxo-nav-development">'+iconLabel('desarrollo',t.development)+'</button>'+
    '</div>';

  return '<header class="nxo-shared-header nxo-topbar nxo-workspace-nav" id="nxo-shared-header" data-theme="'+theme+'" data-language="'+language+'">'+
    '<button type="button" class="nxo-nav-brand" id="nxo-nav-home" aria-label="Nexo Group · '+esc(contextLabel)+'"><span class="nxo-nav-mark"><img src="'+esc(logo)+'" alt="Nexo Group"></span><span class="nxo-nav-brand-copy"><strong>Nexo Group</strong><small>'+esc(contextLabel)+'</small></span></button>'+
    '<div class="nxo-nav-collapse" id="nxo-nav-collapse"><nav class="nxo-nav-links" aria-label="Navegación principal">'+nav+'</nav></div>'+
    '<div class="nxo-nav-primary-utils">'+quickSettings+String(options.notificationHtml||'')+
      '<button type="button" class="nxo-nav-account" id="nxo-nav-account" aria-expanded="false"><span class="nxo-avatar">'+avatar+'</span><span class="nxo-nav-account-copy"><span class="nxo-nav-account-name-row"><strong>'+esc(name)+'</strong><small class="nxo-nav-account-role" data-role="'+esc(roleKey)+'">'+esc(roleLabel)+'</small></span>'+(email?'<small class="nxo-nav-account-email">'+esc(email)+'</small>':'')+'</span><span class="nxo-nav-caret">⌄</span></button>'+
      '<div class="nxo-nav-account-menu" id="nxo-nav-account-menu"><button type="button" data-account-action="settings">'+iconLabel('perfil',t.profile)+'</button><button type="button" data-account-action="switch">'+iconLabel('cuenta-correo',t.switch)+'</button><button type="button" class="danger" data-account-action="logout">'+iconLabel('cerrar',t.logout)+'</button></div>'+
      '<input type="file" id="nxo-profile-photo-input" class="nxo-profile-photo-input" accept="image/png,image/jpeg,image/webp" hidden>'+
    '</div>'+
    '<button type="button" class="nxo-mobile-menu-button" id="nxo-mobile-menu-button" aria-label="'+esc(t.openMenu)+'" aria-expanded="false" aria-controls="nxo-nav-collapse"><span></span><span></span><span></span></button>'+
  '</header>'
}

function siteBase(){
  const path=location.pathname.replace(/\/+$/,'');
  if(/\.(wixstudio|wixsite)\.com$/i.test(location.hostname)){
    const first=path.split('/').filter(Boolean)[0]||'';
    return location.origin+(first?'/'+first:'')
  }
  return location.origin
}

function defaultPersonalUrl(options){
  const u=new URL(siteBase()+'/blank-8');
  u.searchParams.set('nxoTheme',normalizeTheme(options.theme));
  u.searchParams.set('nxoLang',normalizeLanguage(options.language));
  return u.href
}
function defaultDevelopmentUrl(options){
  const u=new URL(siteBase()||location.origin);
  u.searchParams.set('nxoTheme',normalizeTheme(options.theme));
  u.searchParams.set('nxoLang',normalizeLanguage(options.language));
  return u.href
}
function defaultWorkspaceUrl(options,workspace){
  const u=new URL(defaultPersonalUrl(options));
  if(workspace?.workspaceId)u.searchParams.set('nxoWorkspace',workspace.workspaceId);
  return u.href
}
function defaultToolUrl(options,tool,workspace){
  const route=String(tool?.routePath||'').trim();
  if(!route)return'';
  const u=new URL(siteBase()+(route.startsWith('/')?route:'/'+route));
  const back=new URL(defaultPersonalUrl(options));
  if(workspace?.workspaceId)back.searchParams.set('nxoWorkspace',workspace.workspaceId);
  u.searchParams.set('nxoBack',back.href);
  u.searchParams.set('nxoBackLabel',workspace?.name||'Mi espacio');
  u.searchParams.set('nxoTheme',normalizeTheme(options.theme));
  u.searchParams.set('nxoLang',normalizeLanguage(options.language));
  if(workspace?.workspaceId){
    u.searchParams.set('nxoWorkspace',workspace.workspaceId);
    if(workspace.name)u.searchParams.set('nxoWorkspaceName',workspace.name);
    if(tool?.name)u.searchParams.set('nxoToolName',tool.name);
    if(tool?.description)u.searchParams.set('nxoToolDescription',tool.description)
  }
  return u.href
}


function bind(options={}){
  const header=document.getElementById('nxo-shared-header');
  if(!header)return;

  const navigation=options.navigation||{};
  const language=normalizeLanguage(options.language);
  const t=labels(language);
  const account=header.querySelector('#nxo-nav-account');
  const accountMenu=header.querySelector('#nxo-nav-account-menu');
  const mobileButton=header.querySelector('#nxo-mobile-menu-button');
  const mobileMenu=header.querySelector('#nxo-nav-collapse');
  const personalButton=header.querySelector('#nxo-personal');
  const quickButton=header.querySelector('#nxo-quick-settings-button');
  const quickMenu=header.querySelector('#nxo-quick-settings-menu');
  const hoverCapable=()=>Boolean(window.matchMedia?.('(hover:hover) and (pointer:fine)').matches)&&window.innerWidth>760;
  const call=(key,...args)=>typeof options[key]==='function'?options[key](...args):undefined;
  const go=url=>{if(url)location.assign(url)};
  const findWorkspace=id=>(Array.isArray(navigation.workspaces)?navigation.workspaces:[]).find(x=>String(x.workspaceId)===String(id))||null;
  const findTool=(key,workspace)=>{
    const list=workspace?workspace.tools:navigation?.personal?.tools;
    return (Array.isArray(list)?list:[]).find(x=>String(x.toolKey)===String(key))||null
  };

  const personalMenu=header.querySelector('#nxo-personal-menu');
  let personalCloseTimer=null;
  const clearPersonalTimer=()=>{if(personalCloseTimer){clearTimeout(personalCloseTimer);personalCloseTimer=null}};
  const closePersonalFlyout=()=>{clearPersonalTimer();personalMenu?.classList.remove('open');personalButton?.setAttribute('aria-expanded','false')};
  const openPersonalMenu=()=>{
    clearPersonalTimer();
    if(!personalMenu)return;
    personalMenu.innerHTML=personalMenuMarkup(navigation,t);
    personalMenu.classList.add('open');
    personalButton?.setAttribute('aria-expanded','true');
    personalMenu.querySelectorAll('[data-nxo-workspace-open]').forEach(button=>button.addEventListener('click',event=>{
      event.stopPropagation();
      const ws=findWorkspace(button.dataset.nxoWorkspaceOpen);
      closePersonalFlyout();
      const handled=call('onWorkspace',ws,event);
      if(handled===false)return;
      go(defaultWorkspaceUrl(options,ws))
    },{signal:options.signal}));
    personalMenu.querySelectorAll('[data-nxo-tool]').forEach(button=>button.addEventListener('click',event=>{
      event.stopPropagation();
      const ws=findWorkspace(button.dataset.nxoWorkspace);
      const tool=findTool(button.dataset.nxoTool,ws);
      closePersonalFlyout();
      const handled=call('onTool',tool,ws,event);
      if(handled===false)return;
      go(defaultToolUrl(options,tool,ws))
    },{signal:options.signal}))
  };
  const schedulePersonalClose=()=>{clearPersonalTimer();personalCloseTimer=setTimeout(closePersonalFlyout,180)};
  personalButton?.addEventListener('mouseenter',()=>{if(hoverCapable())openPersonalMenu()},{signal:options.signal});
  personalButton?.addEventListener('mouseleave',()=>{if(hoverCapable())schedulePersonalClose()},{signal:options.signal});
  personalButton?.addEventListener('click',event=>{event.stopPropagation();if(personalMenu?.classList.contains('open'))closePersonalFlyout();else openPersonalMenu()},{signal:options.signal});
  personalMenu?.addEventListener('mouseenter',clearPersonalTimer,{signal:options.signal});
  personalMenu?.addEventListener('mouseleave',()=>{if(hoverCapable())schedulePersonalClose()},{signal:options.signal});

  const closeUtilities=except=>{
    if(except!=='account'){accountMenu?.classList.remove('open');account?.setAttribute('aria-expanded','false')}
    if(except!=='quick'){quickMenu?.classList.remove('open');quickButton?.setAttribute('aria-expanded','false')}
  };
  const closeMobile=()=>{mobileMenu?.classList.remove('open');mobileButton?.setAttribute('aria-expanded','false')};

  header.querySelector('#nxo-nav-home')?.addEventListener('click',event=>{
    closePersonalFlyout();
    const handled=call('onHome',event);
    if(handled===false)return;
    go(defaultPersonalUrl(options))
  },{signal:options.signal});

  header.querySelector('#nxo-nav-development')?.addEventListener('click',event=>{
    closePersonalFlyout();closeMobile();
    const handled=call('onDevelopment',event);
    if(handled===false)return;
    go(defaultDevelopmentUrl(options))
  },{signal:options.signal});

  quickButton?.addEventListener('click',event=>{
    event.stopPropagation();closePersonalFlyout();
    const open=quickMenu?.classList.toggle('open')===true;
    quickButton.setAttribute('aria-expanded',open?'true':'false');
    closeUtilities(open?'quick':'')
  },{signal:options.signal});

  account?.addEventListener('click',event=>{
    event.stopPropagation();closePersonalFlyout();
    const open=accountMenu?.classList.toggle('open')===true;
    account.setAttribute('aria-expanded',open?'true':'false');
    closeUtilities(open?'account':'')
  },{signal:options.signal});

  mobileButton?.addEventListener('click',event=>{
    event.stopPropagation();closeUtilities('');closePersonalFlyout();
    const open=mobileMenu?.classList.toggle('open')===true;
    mobileButton.setAttribute('aria-expanded',open?'true':'false')
  },{signal:options.signal});

  document.addEventListener('click',event=>{
    if(header.contains(event.target))return;
    closePersonalFlyout();closeUtilities('');closeMobile()
  },{signal:options.signal});

  header.querySelector('#nxo-theme-toggle')?.addEventListener('click',event=>{event.stopPropagation();call('onTheme',event)},{signal:options.signal});
  header.querySelector('#nxo-language-toggle')?.addEventListener('click',event=>{event.stopPropagation();call('onLanguage',event)},{signal:options.signal});
  header.querySelectorAll('[data-account-action]').forEach(button=>{
    button.addEventListener('click',event=>{
      event.stopPropagation();
      const map={settings:'onProfileSettings',switch:'onSwitchAccount',logout:'onLogout'};
      call(map[button.dataset.accountAction],event)
    },{signal:options.signal})
  })
}


function sync({theme,language}={}){
  const header=document.getElementById('nxo-shared-header');
  if(!header)return;
  if(theme)header.dataset.theme=normalizeTheme(theme)
  if(language)header.dataset.language=normalizeLanguage(language)
}

function mount(container,options={}){
  ensureStyle();
  const target=typeof container==='string'?document.querySelector(container):container;
  if(!target)return null;
  document.getElementById('nxo-shared-header')?.remove();
  target.insertAdjacentHTML(options.position==='append'?'beforeend':'afterbegin',markup(options));
  bind(options);
  return document.getElementById('nxo-shared-header')
}

window.NEXO_SHARED_HEADER={version:VERSION,markup,bind,mount,sync,ensureStyle,loadNavigation};
})();