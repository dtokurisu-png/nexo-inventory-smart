(function(){
'use strict';
const VERSION='20261014-10';
const HEIGHT=68;
const ID='nexo-global-header-runtime-host';
const STYLE_ID='nexo-global-header-runtime-css';
const ICON_BASE='https://dtokurisu-png.github.io/nexo-inventory-smart/assets/icons/nexo/';
const LOGO='https://static.wixstatic.com/media/8b64a8_7bd85ca8e1854afc9ae91eab7457c405~mv2.png';

function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function initials(v){return String(v||'N').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'N'}
function toolIconKey(tool){
  const key=[tool?.toolKey,tool?.name,tool?.nameEs,tool?.nameEn].filter(Boolean).join(' ').toLowerCase();
  if(/horar|schedule/.test(key))return'recordatorio';
  if(/fich|technical/.test(key))return'ficha-tecnica';
  if(/invent|product/.test(key))return'productos';
  if(/bibli|engranaje|guide/.test(key))return'guia';
  if(/learning|desarrollo|development/.test(key))return'desarrollo';
  if(/camino|editorial/.test(key))return'guia';
  if(/r96|risin|game/.test(key))return'catalogo';
  return'herramientas'
}
function icon(name){return ICON_BASE+encodeURIComponent(name)+'.png'}
function iconMarkup(name,extra=''){
  return '<img class="ngh-icon '+extra+'" src="'+esc(icon(name))+'" alt="">'
}

function ensureOutlineDefs(){
  if(document.getElementById('nexo-global-icon-outline-defs'))return;
  const box=document.createElement('div');
  box.id='nexo-global-icon-outline-defs';
  box.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  box.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true">'+
    '<filter id="nexo-global-icon-outline-day" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">'+
      '<feMorphology in="SourceAlpha" operator="dilate" radius="0.45" result="d"/>'+
      '<feFlood flood-color="#ffffff" flood-opacity="0.68" result="c"/>'+
      '<feComposite in="c" in2="d" operator="in" result="o"/>'+
      '<feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge>'+
    '</filter>'+
    '<filter id="nexo-global-icon-outline-night" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">'+
      '<feMorphology in="SourceAlpha" operator="dilate" radius="0.45" result="d"/>'+
      '<feFlood flood-color="#E1BD69" flood-opacity="0.74" result="c"/>'+
      '<feComposite in="c" in2="d" operator="in" result="o"/>'+
      '<feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge>'+
    '</filter>'+
  '</svg>';
  document.body.appendChild(box)
}

function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
:root{--nxo-global-header-height:${HEIGHT}px}
#${ID}{
  --ngh-bg:var(--nxo-header-background,#2F4F93);
  --ngh-border:var(--nxo-header-border,#172755);
  --ngh-text:var(--nxo-header-text,#FFFFFF);
  --ngh-muted:var(--nxo-header-muted,#DCE7F7);
  --ngh-active:var(--nxo-header-active,#E79069);
  --ngh-interaction:var(--nxo-interaction,#E79069);
  --ngh-interaction-contrast:var(--nxo-interaction-contrast,#111827);
  --ngh-surface:var(--nxo-surface-raised,#F8FBFF);
  --ngh-surface2:var(--nxo-background-alt,#EEF4FF);
  --ngh-panel-text:var(--nxo-text-primary,#111827);
  --ngh-panel-muted:var(--nxo-text-muted,#66738D);
  --ngh-panel-border:var(--nxo-border,#B9CBED);
  --ngh-panel-border-strong:var(--nxo-border-strong,#172755);
  --ngh-danger:var(--nxo-danger,#B94242);
  --ngh-shadow:var(--nxo-shadow,rgba(23,39,85,.18));
  --ngh-role:var(--nxo-role-text,var(--nxo-header-active,#E79069));
  position:fixed;inset:0 0 auto 0;height:${HEIGHT}px;z-index:2147483600;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  pointer-events:auto
}
#${ID}[data-theme="night"]{
  --ngh-bg:var(--nxo-header-background,rgba(6,9,14,.94));
  --ngh-border:var(--nxo-header-border,rgba(255,255,255,.08));
  --ngh-text:var(--nxo-header-text,#F2F5F8);
  --ngh-muted:var(--nxo-header-muted,#91A0B5);
  --ngh-active:var(--nxo-header-active,#E1BD69);
  --ngh-interaction:var(--nxo-interaction,#D7B45F);
  --ngh-interaction-contrast:var(--nxo-interaction-contrast,#17130C);
  --ngh-surface:var(--nxo-surface-raised,#18212E);
  --ngh-surface2:var(--nxo-background-alt,#0D121A);
  --ngh-panel-text:var(--nxo-text-primary,#F2F5F8);
  --ngh-panel-muted:var(--nxo-text-muted,#91A0B5);
  --ngh-panel-border:var(--nxo-border,rgba(145,160,181,.22));
  --ngh-panel-border-strong:var(--nxo-border-strong,rgba(184,197,216,.34));
  --ngh-danger:var(--nxo-danger,#FF7070);
  --ngh-shadow:var(--nxo-shadow,rgba(0,0,0,.28));
  --ngh-role:var(--nxo-role-text,#F0CE83)
}
#${ID},#${ID} *{box-sizing:border-box}
#${ID} .ngh-bar{
  height:100%;padding:0 22px;display:flex;align-items:center;gap:22px;
  background:var(--ngh-bg);color:var(--ngh-text);
  border-bottom:1px solid var(--ngh-border);
  box-shadow:0 8px 28px var(--ngh-shadow);
  -webkit-backdrop-filter:blur(20px) saturate(135%);
  backdrop-filter:blur(20px) saturate(135%)
}
#${ID} button{font:inherit}
#${ID} .ngh-brand{border:0;background:transparent;color:inherit;display:flex;align-items:center;gap:10px;padding:0;cursor:pointer;min-width:max-content}
#${ID} .ngh-logo{width:72px;height:48px;display:block;object-fit:contain;object-position:left center}
#${ID} .ngh-brand-copy{display:grid;text-align:left}
#${ID} .ngh-brand-copy strong{font-size:13px;line-height:1.1;color:var(--ngh-text)}
#${ID} .ngh-brand-copy small{margin-top:3px;color:var(--ngh-muted);font-size:10px;max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${ID} .ngh-nav{align-self:stretch;display:flex;align-items:stretch;gap:18px;flex:1;min-width:0}
#${ID} .ngh-group{position:relative;display:flex;align-items:stretch}
#${ID} .ngh-nav-btn{
  position:relative;border:0;background:transparent;color:var(--ngh-muted);padding:0 2px;
  display:flex;align-items:center;gap:6px;font-size:12px;font-weight:760;white-space:nowrap;cursor:pointer
}
#${ID} .ngh-nav-btn:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:3px 3px 0 0;background:transparent}
#${ID} .ngh-nav-btn:hover,#${ID} .ngh-nav-btn:focus-visible{outline:none;color:var(--ngh-text)}
#${ID} .ngh-nav-btn:hover:after,#${ID} .ngh-nav-btn:focus-visible:after{background:var(--ngh-interaction)}
#${ID} .ngh-nav-btn.active{color:var(--ngh-active);font-weight:900}
#${ID} .ngh-nav-btn.active:after{background:var(--ngh-active)}
#${ID} .ngh-icon{
  width:16px;height:16px;display:block;object-fit:contain;flex:0 0 auto;
  filter:url(#nexo-global-icon-outline-day)!important
}
#${ID}[data-theme="night"] .ngh-icon{
  filter:url(#nexo-global-icon-outline-night)!important
}
#${ID} .ngh-menu{
  display:none;position:absolute;top:calc(100% + 8px);left:0;width:320px;max-width:min(420px,calc(100vw - 20px));
  max-height:min(68vh,620px);overflow:auto;padding:9px;border:1px solid var(--ngh-panel-border);
  border-radius:14px;background:var(--ngh-surface);color:var(--ngh-panel-text);
  box-shadow:0 18px 50px var(--ngh-shadow);z-index:30
}
#${ID} .ngh-menu.open{display:grid;gap:7px}
#${ID} .ngh-title{padding:7px 9px 4px;color:var(--ngh-panel-muted);font-size:8px;font-weight:900;letter-spacing:.075em;text-transform:uppercase}
#${ID} .ngh-divider{height:1px;background:var(--ngh-panel-border);margin:3px 5px}
#${ID} .ngh-item{width:100%;min-height:36px;border:0;border-radius:9px;background:transparent;color:inherit;display:flex;align-items:center;gap:8px;padding:8px 9px;text-align:left;cursor:pointer;font-size:10px;font-weight:760}
#${ID} .ngh-item:hover,#${ID} .ngh-item:focus-visible{outline:none;background:var(--nxo-accent-soft,var(--ngh-surface2));color:var(--ngh-panel-text)}
#${ID} .ngh-item.child{padding-left:34px}
#${ID} .ngh-workspace{padding:5px;border:1px solid transparent;border-radius:11px}
#${ID} .ngh-workspace:hover{border-color:var(--ngh-panel-border)}
#${ID} .ngh-utils{position:relative;margin-left:auto;display:flex;align-items:center;gap:5px}
#${ID} .ngh-icon-btn{
  width:38px;height:38px;padding:0;display:grid;place-items:center;
  border:1px solid color-mix(in srgb,var(--ngh-text) 12%,transparent);
  border-radius:11px;background:color-mix(in srgb,var(--ngh-text) 7%,transparent);
  color:var(--ngh-text);cursor:pointer
}
#${ID} .ngh-icon-btn:hover,#${ID} .ngh-icon-btn:focus-visible,#${ID} .ngh-icon-btn[aria-expanded="true"]{
  outline:none;background:var(--ngh-interaction);border-color:var(--ngh-interaction);color:var(--ngh-interaction-contrast)
}
#${ID} .ngh-account{
  min-height:42px;padding:5px 9px;display:flex;align-items:center;gap:8px;
  border:1px solid color-mix(in srgb,var(--ngh-text) 12%,transparent);
  border-radius:11px;background:color-mix(in srgb,var(--ngh-text) 7%,transparent);
  color:var(--ngh-text);cursor:pointer
}
#${ID} .ngh-account:hover,#${ID} .ngh-account:focus-visible,#${ID} .ngh-account[aria-expanded="true"]{
  outline:none;background:var(--ngh-interaction);border-color:var(--ngh-interaction);color:var(--ngh-interaction-contrast)
}
#${ID} .ngh-avatar{
  width:34px;height:34px;border-radius:50%;overflow:hidden;display:grid;place-items:center;
  border:1px solid color-mix(in srgb,var(--ngh-text) 26%,transparent);
  background:color-mix(in srgb,var(--ngh-text) 10%,transparent);
  color:var(--ngh-active);font-size:12px;font-weight:850
}
#${ID} .ngh-avatar img{width:100%;height:100%;object-fit:cover}
#${ID} .ngh-user{display:grid;text-align:left;min-width:0}
#${ID} .ngh-user strong{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
#${ID} .ngh-user small{max-width:170px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ngh-muted);font-size:8px}
#${ID} .ngh-role{display:inline-flex;width:max-content;margin-top:2px;padding:1px 5px;border:1px solid var(--ngh-panel-border);border-radius:999px;color:var(--ngh-role);font-size:7px;font-weight:900}
#${ID} .ngh-pop{
  display:none;position:absolute;right:0;top:calc(100% + 8px);width:230px;overflow:hidden;
  border:1px solid var(--ngh-panel-border);border-radius:14px;background:var(--ngh-surface);
  color:var(--ngh-panel-text);box-shadow:0 18px 50px var(--ngh-shadow);z-index:40
}
#${ID} .ngh-pop.open{display:block}
#${ID} .ngh-pop button{
  width:100%;min-height:42px;border:0;border-top:1px solid var(--ngh-panel-border);
  background:transparent;color:inherit;padding:0 12px;text-align:left;font-size:11px;font-weight:760;cursor:pointer
}
#${ID} .ngh-pop button:first-child{border-top:0}
#${ID} .ngh-pop button:hover,#${ID} .ngh-pop button:focus-visible{
  outline:none;background:var(--nxo-accent-soft,var(--ngh-surface2));color:var(--ngh-panel-text)
}
#${ID} .ngh-pop .danger{color:var(--ngh-danger)}
#${ID} .ngh-setting-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important}
#${ID} .ngh-setting-label{display:flex;align-items:center;gap:8px;min-width:0}
#${ID} .ngh-setting-value{min-width:34px;padding:3px 7px;border:1px solid var(--ngh-panel-border);border-radius:999px;color:var(--ngh-panel-muted);font-size:9px;text-align:center}
#${ID} .ngh-empty{padding:12px 10px;color:var(--ngh-panel-muted);font-size:10px}
@media(max-width:760px){
  #${ID}{height:${HEIGHT}px}
  #${ID} .ngh-bar{padding:0 10px;gap:8px}
  #${ID} .ngh-logo{width:58px;height:40px}
  #${ID} .ngh-brand-copy{display:none}
  #${ID} .ngh-nav{gap:10px;overflow:auto}
  #${ID} .ngh-nav-btn{font-size:10px}
  #${ID} .ngh-account{max-width:150px;padding:3px 5px}
  #${ID} .ngh-user strong{max-width:70px;font-size:9px}
  #${ID} .ngh-user small{display:none}
}
`
  document.head.appendChild(s)
}
function host(){ensureStyle();ensureOutlineDefs();let h=document.getElementById(ID);if(!h){h=document.createElement('div');h.id=ID;document.body.appendChild(h)}return h}
function closeMenus(h,except=''){h.querySelectorAll('.ngh-menu,.ngh-pop').forEach(x=>{if(x.id!==except)x.classList.remove('open')});h.querySelectorAll('[aria-expanded="true"]').forEach(x=>{const target=x.dataset.menuTarget;if(target!==except)x.setAttribute('aria-expanded','false')})}
function toggle(h,id,button){const menu=h.querySelector('#'+id);if(!menu)return;const open=!menu.classList.contains('open');closeMenus(h,open?id:'');menu.classList.toggle('open',open);button?.setAttribute('aria-expanded',open?'true':'false')}
function findTool(nav,key,workspaceId=''){if(workspaceId){const ws=(nav?.workspaces||[]).find(x=>String(x.workspaceId)===String(workspaceId));return (ws?.tools||[]).find(x=>String(x.toolKey)===String(key))||null}return (nav?.personal?.tools||[]).find(x=>String(x.toolKey)===String(key))||null}
function fallbackTool(tool,ws){const route=String(tool?.routePath||'').trim();if(!route)return;const u=new URL(route,location.origin);if(ws?.workspaceId)u.searchParams.set('nxoWorkspace',ws.workspaceId);location.assign(u.href)}
function normalizeTheme(value){return value==='night'?'night':'day'}
function menuMarkup(nav){
  const direct=Array.isArray(nav?.personal?.tools)?nav.personal.tools:[];
  const spaces=Array.isArray(nav?.workspaces)?nav.workspaces:[];
  let out='';
  if(direct.length){out+='<div class="ngh-title">Accesos directos</div>'+direct.map(t=>'<button class="ngh-item" data-tool="'+esc(t.toolKey||'')+'" data-ws=""><img class="ngh-icon" src="'+icon(toolIconKey(t))+'" alt=""><span>'+esc(t.name||t.nameEs||t.toolKey||'Herramienta')+'</span></button>').join('')}
  if(spaces.length){if(out)out+='<div class="ngh-divider"></div>';out+='<div class="ngh-title">Workspaces</div>';for(const ws of spaces){out+='<div class="ngh-workspace"><button class="ngh-item" data-workspace="'+esc(ws.workspaceId||'')+'"><img class="ngh-icon" src="'+icon('workspace')+'" alt=""><strong>'+esc(ws.name||'Workspace')+'</strong></button>'+(Array.isArray(ws.tools)?ws.tools:[]).map(t=>'<button class="ngh-item child" data-tool="'+esc(t.toolKey||'')+'" data-ws="'+esc(ws.workspaceId||'')+'"><img class="ngh-icon" src="'+icon(toolIconKey(t))+'" alt=""><span>'+esc(t.name||t.nameEs||t.toolKey||'Herramienta')+'</span></button>').join('')+'</div>'}}
  return out||'<div class="ngh-empty">Sin accesos disponibles</div>'
}
function mount(container,opts={}){
  const h=host();
  const nav=opts.navigation||{};
  const profile=opts.profile||{};
  const active=opts.active||'personal';
  const theme=normalizeTheme(opts.theme);
  h.dataset.theme=theme;
  const context=opts.contextLabel||'Mi espacio';
  const lang=String(opts.language||'es').toLowerCase().startsWith('en')?'en':'es';
  const photo=profile?.photoImage?.url||profile?.photoImage?.image?.url||profile?.photoImage?.src||'';
  h.innerHTML='<header class="ngh-bar">'+
    '<button class="ngh-brand" data-home><img class="ngh-logo" src="'+LOGO+'" alt="Nexo Group"><span class="ngh-brand-copy"><strong>Nexo Group</strong><small>'+esc(context)+'</small></span></button>'+
    '<nav class="ngh-nav"><div class="ngh-group"><button class="ngh-nav-btn '+(active==='personal'||active==='workspace'||active==='tool'?'active':'')+'" data-personal data-menu-target="ngh-space" aria-expanded="false">'+iconMarkup('home')+'<span>'+(lang==='en'?'My space':'Mi espacio')+'</span><span>⌄</span></button><div class="ngh-menu" id="ngh-space">'+menuMarkup(nav)+'</div></div>'+
    '<button class="ngh-nav-btn '+(active==='development'?'active':'')+'" data-development>'+iconMarkup('desarrollo')+'<span>'+(lang==='en'?'Development Center':'Centro de desarrollo')+'</span></button></nav>'+
    '<div class="ngh-utils"><div class="ngh-group"><button class="ngh-icon-btn" data-settings data-menu-target="ngh-settings" aria-expanded="false">'+iconMarkup('ajustes-rapidos')+'</button><div class="ngh-pop" id="ngh-settings"><button class="ngh-setting-row" data-language><span class="ngh-setting-label">'+iconMarkup('idioma')+'<span>'+(lang==='en'?'Language':'Idioma')+'</span></span><strong class="ngh-setting-value">'+lang.toUpperCase()+'</strong></button><button class="ngh-setting-row" data-theme><span class="ngh-setting-label">'+iconMarkup(theme==='night'?'modo-oscuro':'modo-claro','ngh-theme-icon')+'<span>'+(lang==='en'?'Appearance':'Apariencia')+'</span></span><strong class="ngh-setting-value">'+(theme==='night'?(lang==='en'?'Dark':'Oscuro'):(lang==='en'?'Light':'Claro'))+'</strong></button></div></div>'+
    '<div class="ngh-group"><button class="ngh-account" data-account data-menu-target="ngh-account" aria-expanded="false"><span class="ngh-avatar">'+(photo?'<img src="'+esc(photo)+'" alt="">':esc(initials(profile.displayName||'Usuario Nexo')))+'</span><span class="ngh-user"><strong>'+esc(profile.displayName||'Usuario Nexo')+'</strong><span class="ngh-role">'+esc(opts.roleLabel||'Miembro')+'</span><small>'+esc(profile.email||'')+'</small></span><span>⌄</span></button><div class="ngh-pop" id="ngh-account"><button data-profile>'+(lang==='en'?'Profile settings':'Ajustes de perfil')+'</button><button data-switch>'+(lang==='en'?'Switch account':'Cambiar cuenta')+'</button><button class="danger" data-logout>'+(lang==='en'?'Sign out':'Cerrar sesión')+'</button></div></div></div>'+
    '</header>';

  const call=(name,...args)=>typeof opts[name]==='function'?opts[name](...args):undefined;
  h.querySelector('[data-home]')?.addEventListener('click',e=>{if(call('onHome',e)!==false&&typeof opts.onPersonal==='function')opts.onPersonal(e)});
  h.querySelector('[data-personal]')?.addEventListener('click',e=>{e.stopPropagation();toggle(h,'ngh-space',e.currentTarget)});
  h.querySelector('[data-development]')?.addEventListener('click',e=>{if(call('onDevelopment',e)!==false&&location.pathname!=='/')location.assign('/')});
  h.querySelector('[data-settings]')?.addEventListener('click',e=>{e.stopPropagation();toggle(h,'ngh-settings',e.currentTarget)});
  h.querySelector('[data-account]')?.addEventListener('click',e=>{e.stopPropagation();toggle(h,'ngh-account',e.currentTarget)});
  h.querySelector('[data-language]')?.addEventListener('click',e=>call('onLanguage',e));
  h.querySelector('[data-theme]')?.addEventListener('click',e=>call('onTheme',e));
  h.querySelector('[data-profile]')?.addEventListener('click',e=>call('onProfileSettings',e));
  h.querySelector('[data-switch]')?.addEventListener('click',e=>call('onSwitchAccount',e));
  h.querySelector('[data-logout]')?.addEventListener('click',e=>call('onLogout',e));
  h.querySelectorAll('[data-workspace]').forEach(b=>b.addEventListener('click',e=>{const ws=(nav.workspaces||[]).find(x=>String(x.workspaceId)===String(b.dataset.workspace));if(call('onWorkspace',ws,e)!==false&&ws?.workspaceId){const u=new URL(location.href);u.searchParams.set('nxoWorkspace',ws.workspaceId);location.assign(u.href)}}));
  h.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',e=>{const ws=(nav.workspaces||[]).find(x=>String(x.workspaceId)===String(b.dataset.ws));const tool=findTool(nav,b.dataset.tool,b.dataset.ws);if(call('onTool',tool,ws,e)!==false)fallbackTool(tool,ws)}));
  document.addEventListener('click',()=>closeMenus(h,''),{once:true});
  document.documentElement.style.setProperty('--nexo-global-header-height',HEIGHT+'px');
  return h
}
function unmount(){document.getElementById(ID)?.remove()}
window.NEXO_GLOBAL_HEADER={version:VERSION,height:HEIGHT,mount,unmount};
})();