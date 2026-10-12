(function(){
'use strict';
const VERSION='20261012-3';
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
    workspace:en?'Workspace':'Espacio de trabajo',
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
    openMenu:en?'Open menu':'Abrir menú',
    closeMenu:en?'Close menu':'Cerrar menú'
  }
}

function ensureStyle(){
  if(document.getElementById('nxo-shared-header-style'))return;
  const style=document.createElement('style');
  style.id='nxo-shared-header-style';
  style.textContent=`
.nxo-shared-header{
  --nxo-sh-bg:rgba(8,11,16,.94);
  --nxo-sh-text:#f2f5f8;
  --nxo-sh-soft:#b8c5d8;
  --nxo-sh-muted:#91a0b5;
  --nxo-sh-line:rgba(145,160,181,.18);
  --nxo-sh-line2:rgba(184,197,216,.30);
  --nxo-sh-active:#f0ce83;
  --nxo-sh-hover:#f2b35c;
  --nxo-sh-panel:rgba(15,21,30,.985);
  --nxo-sh-shadow:0 24px 80px rgba(0,0,0,.34);
  position:sticky!important;top:0!important;z-index:2147483200!important;
  min-height:64px!important;padding:0 22px!important;
  display:flex!important;align-items:center!important;gap:22px!important;
  color:var(--nxo-sh-text)!important;background:var(--nxo-sh-bg)!important;
  border-bottom:1px solid var(--nxo-sh-line)!important;
  box-shadow:0 8px 28px rgba(0,0,0,.18)!important;
  -webkit-backdrop-filter:blur(22px) saturate(140%)!important;
  backdrop-filter:blur(22px) saturate(140%)!important;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
  box-sizing:border-box!important
}
.nxo-shared-header[data-theme="day"]{
  --nxo-sh-bg:rgba(38,76,143,.96);
  --nxo-sh-text:#fff;
  --nxo-sh-soft:#e8eefb;
  --nxo-sh-muted:#d8e3f8;
  --nxo-sh-line:rgba(255,255,255,.18);
  --nxo-sh-line2:rgba(255,255,255,.26);
  --nxo-sh-active:#fff3a9;
  --nxo-sh-hover:#f88f5b;
  --nxo-sh-panel:rgba(248,251,255,.99);
  --nxo-sh-shadow:0 24px 70px rgba(23,39,85,.28)
}
.nxo-shared-header *{box-sizing:border-box}
.nxo-shared-header button{font-family:inherit}
.nxo-shared-header .nxo-nav-brand{
  display:flex!important;align-items:center!important;gap:10px!important;min-width:max-content!important;
  cursor:pointer!important;color:var(--nxo-sh-text)!important;background:transparent!important;border:0!important;
  padding:0!important
}
.nxo-shared-header .nxo-nav-mark{
  width:42px!important;height:42px!important;flex:0 0 42px!important;display:block!important;
  border-radius:10px!important;overflow:hidden!important;background:#000!important;
  border:1px solid rgba(255,255,255,.16)!important;box-shadow:0 8px 22px rgba(0,0,0,.24)!important
}
.nxo-shared-header .nxo-nav-mark img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
.nxo-shared-header .nxo-nav-brand-copy{display:grid!important;min-width:0!important;text-align:left!important}
.nxo-shared-header .nxo-nav-brand-copy strong{font-size:13px!important;line-height:1.1!important;color:var(--nxo-sh-text)!important}
.nxo-shared-header .nxo-nav-brand-copy small{
  margin-top:3px!important;color:var(--nxo-sh-muted)!important;font-size:10px!important;
  white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:190px!important
}
.nxo-shared-header .nxo-nav-collapse{
  display:flex;align-items:stretch;align-self:stretch;gap:22px;flex:1;min-width:0
}
.nxo-shared-header .nxo-nav-links{display:flex!important;align-items:stretch!important;align-self:stretch!important;gap:18px!important;flex:1!important;min-width:0!important}
.nxo-shared-header .nxo-nav-link{
  position:relative!important;border:0!important;background:transparent!important;color:var(--nxo-sh-muted)!important;
  padding:0 2px!important;font-size:12px!important;font-weight:760!important;cursor:pointer!important;
  white-space:nowrap!important;box-shadow:none!important;transform:none!important
}
.nxo-shared-header .nxo-nav-link:after{
  content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:transparent;border-radius:3px 3px 0 0
}
.nxo-shared-header .nxo-nav-link:hover,.nxo-shared-header .nxo-nav-link:focus-visible{color:var(--nxo-sh-text)!important;outline:none!important}
.nxo-shared-header .nxo-nav-link:hover:after,.nxo-shared-header .nxo-nav-link:focus-visible:after{background:var(--nxo-sh-hover)!important}
.nxo-shared-header .nxo-nav-link.active{color:var(--nxo-sh-active)!important;font-weight:900!important}
.nxo-shared-header .nxo-nav-link.active:after{background:var(--nxo-sh-active)!important}
.nxo-shared-header .nxo-nav-menu-utilities{display:flex!important;align-items:center!important;margin-left:auto!important}
.nxo-shared-header .nxo-nav-primary-utils{position:relative!important;display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:4px!important;flex:0 0 auto!important}
.nxo-shared-header .nxo-quick-settings-wrap{position:relative!important;display:flex!important;align-items:center!important}
.nxo-shared-header .nxo-quick-settings-button{
  appearance:none!important;width:38px!important;height:38px!important;padding:0!important;display:grid!important;place-items:center!important;
  border:1px solid transparent!important;border-radius:11px!important;background:transparent!important;color:var(--nxo-sh-text)!important;cursor:pointer!important
}
.nxo-shared-header .nxo-quick-settings-button:hover,.nxo-shared-header .nxo-quick-settings-button:focus-visible,.nxo-shared-header .nxo-quick-settings-button[aria-expanded="true"]{
  outline:none!important;background:rgba(255,255,255,.09)!important;border-color:var(--nxo-sh-line)!important
}
.nxo-shared-header .nxo-quick-settings-menu{
  display:none;position:absolute;right:0;top:calc(100% + 8px);z-index:170;width:230px;overflow:hidden;
  border:1px solid var(--nxo-sh-line2);border-radius:14px;background:var(--nxo-sh-panel);box-shadow:var(--nxo-sh-shadow)
}
.nxo-shared-header .nxo-quick-settings-menu.open{display:block}
.nxo-shared-header .nxo-quick-settings-title{padding:10px 12px 7px;color:var(--nxo-sh-muted);font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
.nxo-shared-header .nxo-quick-setting-row{
  appearance:none;width:100%;min-height:42px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;gap:12px;
  border:0;border-top:1px solid var(--nxo-sh-line);background:transparent;color:var(--nxo-sh-text);font-size:11px;font-weight:760;cursor:pointer
}
.nxo-shared-header[data-theme="day"] .nxo-quick-setting-row{color:#34405f}
.nxo-shared-header .nxo-quick-setting-row:hover,.nxo-shared-header .nxo-quick-setting-row:focus-visible{outline:none;background:rgba(255,255,255,.08)}
.nxo-shared-header[data-theme="day"] .nxo-quick-setting-row:hover,.nxo-shared-header[data-theme="day"] .nxo-quick-setting-row:focus-visible{background:#eaf1ff}
.nxo-shared-header .nxo-quick-setting-row strong{
  min-width:34px;padding:3px 7px;border:1px solid var(--nxo-sh-line2);border-radius:999px;
  color:var(--nxo-sh-soft);font-size:9px;text-align:center
}
.nxo-shared-header[data-theme="day"] .nxo-quick-setting-row strong{color:#34405f;border-color:#b9cbed}
.nxo-shared-header .nxo-icon-img{width:18px;height:18px;display:block;object-fit:contain;flex:0 0 auto}
.nxo-shared-header .nxo-icon-label{display:inline-flex;align-items:center;gap:7px;min-width:0}
.nxo-shared-header .nxo-nav-account{
  display:flex!important;align-items:center!important;gap:8px!important;border:1px solid transparent!important;
  background:transparent!important;color:var(--nxo-sh-text)!important;padding:6px 8px!important;border-radius:11px!important;cursor:pointer!important
}
.nxo-shared-header .nxo-nav-account:hover,.nxo-shared-header .nxo-nav-account:focus-visible{
  background:rgba(255,255,255,.075)!important;border-color:var(--nxo-sh-line)!important;outline:none!important
}
.nxo-shared-header .nxo-avatar{
  width:34px;height:34px;border-radius:50%;display:grid;place-items:center;overflow:hidden;flex:0 0 34px;
  border:1px solid rgba(255,255,255,.26);background:rgba(255,255,255,.10);color:var(--nxo-sh-active);font-weight:850;font-size:12px
}
.nxo-shared-header .nxo-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.nxo-shared-header .nxo-nav-account-copy{display:grid;text-align:left;min-width:0}
.nxo-shared-header .nxo-nav-account-name-row{display:flex;align-items:center;gap:5px;min-width:0}
.nxo-shared-header .nxo-nav-account-copy strong{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px}
.nxo-shared-header .nxo-nav-account-email{display:block;max-width:170px;margin-top:2px;color:var(--nxo-sh-muted);font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nxo-shared-header .nxo-nav-account-role{
  display:inline-flex;width:max-content;max-width:90px;padding:1px 5px;border-radius:999px;
  border:1px solid var(--nxo-sh-line2);color:var(--nxo-sh-active);font-size:7px;font-weight:900;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis
}
.nxo-shared-header .nxo-nav-caret{font-size:12px;color:var(--nxo-sh-muted)}
.nxo-shared-header .nxo-nav-account-menu{
  display:none;position:absolute;right:0;top:calc(100% + 8px);width:220px;overflow:hidden;z-index:180;
  border:1px solid var(--nxo-sh-line2);border-radius:14px;background:var(--nxo-sh-panel);box-shadow:var(--nxo-sh-shadow)
}
.nxo-shared-header .nxo-nav-account-menu.open{display:block}
.nxo-shared-header .nxo-nav-account-menu button{
  width:100%;border:0;background:transparent;color:var(--nxo-sh-text);padding:12px 13px;text-align:left;font-size:11px;font-weight:760;cursor:pointer
}
.nxo-shared-header[data-theme="day"] .nxo-nav-account-menu button{color:#111827}
.nxo-shared-header .nxo-nav-account-menu button:hover,.nxo-shared-header .nxo-nav-account-menu button:focus-visible{background:rgba(242,179,92,.16);outline:none}
.nxo-shared-header .nxo-nav-account-menu button.danger{color:#ffb4b4;border-top:1px solid var(--nxo-sh-line)}
.nxo-shared-header[data-theme="day"] .nxo-nav-account-menu button.danger{color:#b94242}
.nxo-shared-header .nxo-mobile-menu-button{
  display:none;width:42px;height:42px;padding:9px;border:1px solid var(--nxo-sh-line);border-radius:11px;
  background:rgba(255,255,255,.05);color:var(--nxo-sh-text);cursor:pointer;place-items:center;gap:4px
}
.nxo-shared-header .nxo-mobile-menu-button span{display:block;width:20px;height:2px;border-radius:999px;background:currentColor}
.nxo-shared-header .nxo-mobile-menu-button[aria-expanded="true"] span:nth-child(1){transform:translateY(6px) rotate(45deg)}
.nxo-shared-header .nxo-mobile-menu-button[aria-expanded="true"] span:nth-child(2){opacity:0}
.nxo-shared-header .nxo-mobile-menu-button[aria-expanded="true"] span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
.nxo-shared-header .nxo-shared-current{
  display:flex;align-items:center;min-height:30px;padding:0 9px;border:1px solid var(--nxo-sh-line);
  border-radius:999px;color:var(--nxo-sh-soft);font-size:9px;font-weight:850;white-space:nowrap
}
@media(max-width:760px){
  .nxo-shared-header{
    display:flex!important;flex-wrap:wrap!important;justify-content:flex-start!important;align-items:center!important;
    min-height:58px!important;padding:8px 10px!important;column-gap:7px!important;row-gap:7px!important
  }
  .nxo-shared-header .nxo-nav-brand{order:1!important;flex:0 0 auto!important;min-width:0!important}
  .nxo-shared-header .nxo-nav-brand-copy{display:none!important}
  .nxo-shared-header .nxo-nav-mark{width:50px!important;height:38px!important;flex:0 0 50px!important}
  .nxo-shared-header .nxo-nav-primary-utils{order:2!important;flex:1 1 auto!important;min-width:0!important;justify-content:flex-end!important;margin-left:auto!important}
  .nxo-shared-header .nxo-mobile-menu-button{order:3!important;display:grid!important;flex:0 0 38px!important;width:38px!important;height:38px!important;margin-left:0!important;padding:8px!important}
  .nxo-shared-header .nxo-nav-collapse{
    order:5!important;display:none;position:absolute!important;top:calc(100% + 8px)!important;left:10px!important;right:10px!important;
    z-index:190!important;max-height:calc(100dvh - 86px)!important;overflow:auto!important;padding:10px!important;
    border:1px solid var(--nxo-sh-line2)!important;border-radius:16px!important;background:var(--nxo-sh-panel)!important;box-shadow:var(--nxo-sh-shadow)!important
  }
  .nxo-shared-header .nxo-nav-collapse.open{display:grid!important;gap:8px!important}
  .nxo-shared-header .nxo-nav-links{display:grid!important;gap:5px!important;align-self:auto!important}
  .nxo-shared-header .nxo-nav-link,.nxo-shared-header .nxo-nav-link.active{
    display:flex!important;align-items:center!important;min-height:44px!important;width:100%!important;padding:0 12px!important;
    border-radius:10px!important;text-align:left!important
  }
  .nxo-shared-header .nxo-nav-link:after{display:none!important}
  .nxo-shared-header .nxo-nav-link:hover,.nxo-shared-header .nxo-nav-link:focus-visible,.nxo-shared-header .nxo-nav-link.active{background:rgba(255,255,255,.07)!important}
  .nxo-shared-header .nxo-nav-menu-utilities{display:none!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account{
    width:auto!important;max-width:142px!important;min-width:0!important;min-height:38px!important;height:38px!important;padding:3px 5px!important;gap:5px!important
  }
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account .nxo-avatar{width:30px!important;height:30px!important;flex:0 0 30px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-copy{display:block!important;min-width:0!important;flex:1 1 auto!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-copy strong{max-width:76px!important;font-size:9px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-email{max-width:102px!important;font-size:7px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-role{font-size:7px!important;max-width:64px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-caret{display:none!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-quick-settings-button{width:36px!important;height:36px!important}
  .nxo-shared-header .nxo-nav-primary-utils .nxo-quick-settings-menu,
  .nxo-shared-header .nxo-nav-primary-utils .nxo-nav-account-menu{
    position:fixed!important;top:64px!important;left:10px!important;right:10px!important;width:auto!important;margin:0!important;z-index:200!important
  }
  .nxo-shared-header .nxo-shared-current{display:none!important}
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
  const contextLabel=String(options.contextLabel||options.workspaceName||t.personal);
  const currentTool=String(options.currentToolLabel||'');
  const logo=String(options.logoUrl||LOGO_DEFAULT);
  const showPersonal=options.showPersonal!==false;
  const showDevelopment=options.showDevelopment!==false;
  const showWorkspace=Boolean(options.workspaceName);
  const avatar=photo?'<img src="'+esc(photo)+'" alt="'+esc(name)+'">':esc(initials(name));

  const quickSettings=
    '<div class="nxo-quick-settings-wrap">'+
      '<button type="button" class="nxo-quick-settings-button" id="nxo-quick-settings-button" aria-label="'+esc(t.quick)+'" aria-expanded="false">'+iconTag('ajustes-rapidos')+'</button>'+
      '<div class="nxo-quick-settings-menu" id="nxo-quick-settings-menu">'+
        '<div class="nxo-quick-settings-title">'+esc(t.quick)+'</div>'+
        '<button type="button" class="nxo-quick-setting-row" id="nxo-language-toggle">'+iconLabel('idioma',t.language)+'<strong>'+esc(language==='en'?t.english:t.spanish)+'</strong></button>'+
        '<button type="button" class="nxo-quick-setting-row" id="nxo-theme-toggle">'+iconLabel(theme==='night'?'modo-oscuro':'modo-claro',t.appearance)+'<strong>'+esc(theme==='night'?t.night:t.day)+'</strong></button>'+
      '</div>'+
    '</div>';

  const nav=[
    showPersonal?'<button type="button" class="nxo-nav-link '+(active==='personal'?'active':'')+'" id="nxo-personal">'+iconLabel('home',t.personal)+'</button>':'',
    showWorkspace?'<button type="button" class="nxo-nav-link '+(active==='workspace'?'active':'')+'" id="nxo-workspace-current">'+iconLabel('workspace',options.workspaceName)+'</button>':'',
    showDevelopment?'<button type="button" class="nxo-nav-link '+(active==='development'?'active':'')+'" id="nxo-nav-development">'+iconLabel('desarrollo',t.development)+'</button>':'',
    currentTool?'<button type="button" class="nxo-nav-link '+(active==='tool'?'active':'')+'" id="nxo-nav-current-tool" aria-current="'+(active==='tool'?'page':'false')+'">'+iconLabel(options.currentToolIcon||'herramientas',currentTool)+'</button>':'',
    String(options.extraNavHtml||'')
  ].filter(Boolean).join('');

  return '<header class="nxo-shared-header nxo-topbar nxo-workspace-nav" id="nxo-shared-header" data-theme="'+theme+'" data-language="'+language+'">'+
    '<button type="button" class="nxo-nav-brand" id="nxo-nav-home" aria-label="Nexo Group · '+esc(contextLabel)+'">'+
      '<span class="nxo-nav-mark"><img src="'+esc(logo)+'" alt="Nexo Group"></span>'+
      '<span class="nxo-nav-brand-copy"><strong>Nexo Group</strong><small>'+esc(contextLabel)+'</small></span>'+
    '</button>'+
    '<div class="nxo-nav-collapse" id="nxo-nav-collapse">'+
      '<nav class="nxo-nav-links" aria-label="Navegación principal">'+nav+'</nav>'+
    '</div>'+
    (currentTool?'<span class="nxo-shared-current">'+esc(currentTool)+'</span>':'')+
    '<div class="nxo-nav-primary-utils">'+
      quickSettings+
      String(options.notificationHtml||'')+
      '<button type="button" class="nxo-nav-account" id="nxo-nav-account" aria-expanded="false">'+
        '<span class="nxo-avatar">'+avatar+'</span>'+
        '<span class="nxo-nav-account-copy">'+
          '<span class="nxo-nav-account-name-row"><strong>'+esc(name)+'</strong><small class="nxo-nav-account-role" data-role="'+esc(roleKey)+'">'+esc(roleLabel)+'</small></span>'+
          (email?'<small class="nxo-nav-account-email">'+esc(email)+'</small>':'')+
        '</span>'+
        '<span class="nxo-nav-caret">⌄</span>'+
      '</button>'+
      '<div class="nxo-nav-account-menu" id="nxo-nav-account-menu">'+
        '<button type="button" data-account-action="settings">'+iconLabel('perfil',t.profile)+'</button>'+
        '<button type="button" data-account-action="switch">'+iconLabel('cuenta-correo',t.switch)+'</button>'+
        '<button type="button" class="danger" data-account-action="logout">'+iconLabel('cerrar',t.logout)+'</button>'+
      '</div>'+
      '<input type="file" id="nxo-profile-photo-input" class="nxo-profile-photo-input" accept="image/png,image/jpeg,image/webp" hidden>'+
    '</div>'+
    '<button type="button" class="nxo-mobile-menu-button" id="nxo-mobile-menu-button" aria-label="'+esc(t.openMenu)+'" aria-expanded="false" aria-controls="nxo-nav-collapse"><span></span><span></span><span></span></button>'+
  '</header>'
}

function bind(options={}){
  const header=document.getElementById('nxo-shared-header');
  if(!header)return;
  const account=header.querySelector('#nxo-nav-account');
  const accountMenu=header.querySelector('#nxo-nav-account-menu');
  const mobileButton=header.querySelector('#nxo-mobile-menu-button');
  const mobileMenu=header.querySelector('#nxo-nav-collapse');
  const quickPairs=[
    [header.querySelector('#nxo-quick-settings-button'),header.querySelector('#nxo-quick-settings-menu')]
  ];
  const closeMenus=except=>{
    if(except!=='account'){accountMenu?.classList.remove('open');account?.setAttribute('aria-expanded','false')}
    quickPairs.forEach(([button,menu],index)=>{
      if(except!=='quick'+index){menu?.classList.remove('open');button?.setAttribute('aria-expanded','false')}
    })
  };
  quickPairs.forEach(([button,menu],index)=>{
    button?.addEventListener('click',event=>{
      event.stopPropagation();
      const open=menu?.classList.toggle('open')===true;
      button.setAttribute('aria-expanded',open?'true':'false');
      closeMenus(open?'quick'+index:'')
    })
  });
  account?.addEventListener('click',event=>{
    event.stopPropagation();
    const open=accountMenu?.classList.toggle('open')===true;
    account.setAttribute('aria-expanded',open?'true':'false');
    closeMenus(open?'account':'')
  });
  mobileButton?.addEventListener('click',event=>{
    event.stopPropagation();
    const open=mobileMenu?.classList.toggle('open')===true;
    mobileButton.setAttribute('aria-expanded',open?'true':'false')
  });
  document.addEventListener('click',event=>{
    if(header.contains(event.target))return;
    closeMenus('');
    mobileMenu?.classList.remove('open');
    mobileButton?.setAttribute('aria-expanded','false')
  },{signal:options.signal});

  const call=(key,event)=>{if(typeof options[key]==='function'){event?.preventDefault?.();options[key](event)}};
  header.querySelector('#nxo-nav-home')?.addEventListener('click',event=>call('onHome',event),{signal:options.signal});
  header.querySelector('#nxo-personal')?.addEventListener('click',event=>call('onPersonal',event),{signal:options.signal});
  header.querySelector('#nxo-nav-development')?.addEventListener('click',event=>call('onDevelopment',event),{signal:options.signal});
  header.querySelector('#nxo-workspace-current')?.addEventListener('click',event=>call('onWorkspace',event),{signal:options.signal});
  header.querySelector('#nxo-nav-current-tool')?.addEventListener('click',event=>call('onCurrentTool',event),{signal:options.signal});

  const bindQuick=(id,key)=>header.querySelectorAll('#'+id).forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();call(key,event)},{signal:options.signal}));
  bindQuick('nxo-theme-toggle','onTheme');
  bindQuick('nxo-language-toggle','onLanguage');

  header.querySelectorAll('[data-account-action]').forEach(button=>{
    button.addEventListener('click',event=>{
      const action=button.dataset.accountAction;
      const map={settings:'onProfileSettings',switch:'onSwitchAccount',logout:'onLogout'};
      call(map[action],event)
    },{signal:options.signal})
  })
}

function sync({theme,language}={}){
  const header=document.getElementById('nxo-shared-header');
  if(!header)return;
  if(theme)header.dataset.theme=normalizeTheme(theme);
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

window.NEXO_SHARED_HEADER={version:VERSION,markup,bind,mount,sync,ensureStyle};
})();