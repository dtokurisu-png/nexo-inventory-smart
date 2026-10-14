(function(){
'use strict';
const VERSION='20261014-1';
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

function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
:root{--nxo-global-header-height:${HEIGHT}px}
#${ID}{position:fixed;inset:0 0 auto 0;height:${HEIGHT}px;z-index:2147483600;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;pointer-events:auto}
#${ID},#${ID} *{box-sizing:border-box}
#${ID} .ngh-bar{height:100%;padding:0 22px;display:flex;align-items:center;gap:22px;background:#264c8f;color:#fff;border-bottom:1px solid rgba(255,255,255,.18);box-shadow:0 8px 28px rgba(23,39,85,.16)}
#${ID} button{font:inherit}
#${ID} .ngh-brand{border:0;background:transparent;color:inherit;display:flex;align-items:center;gap:10px;padding:0;cursor:pointer;min-width:max-content}
#${ID} .ngh-logo{width:72px;height:48px;display:block;object-fit:contain;object-position:left center}
#${ID} .ngh-brand-copy{display:grid;text-align:left}.ngh-brand-copy strong{font-size:13px;line-height:1.1}.ngh-brand-copy small{margin-top:3px;color:#d8e3f8;font-size:10px;max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${ID} .ngh-nav{align-self:stretch;display:flex;align-items:stretch;gap:18px;flex:1;min-width:0}
#${ID} .ngh-group{position:relative;display:flex;align-items:stretch}
#${ID} .ngh-nav-btn{position:relative;border:0;background:transparent;color:#d8e3f8;padding:0 2px;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:760;white-space:nowrap;cursor:pointer}
#${ID} .ngh-nav-btn:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:3px 3px 0 0;background:transparent}
#${ID} .ngh-nav-btn:hover,#${ID} .ngh-nav-btn:focus-visible{outline:none;color:#fff}
#${ID} .ngh-nav-btn:hover:after,#${ID} .ngh-nav-btn:focus-visible:after{background:#f88f5b}
#${ID} .ngh-nav-btn.active{color:#fff3a9;font-weight:900}#${ID} .ngh-nav-btn.active:after{background:#fff3a9}
#${ID} .ngh-icon{width:16px;height:16px;display:block;object-fit:contain}
#${ID} .ngh-menu{display:none;position:absolute;top:calc(100% + 8px);left:0;width:320px;max-width:min(420px,calc(100vw - 20px));max-height:min(68vh,620px);overflow:auto;padding:9px;border:1px solid #d7dfed;border-radius:14px;background:#f8fbff;color:#1d2940;box-shadow:0 18px 50px rgba(23,39,85,.28);z-index:30}
#${ID} .ngh-menu.open{display:grid;gap:7px}
#${ID} .ngh-title{padding:7px 9px 4px;color:#667085;font-size:8px;font-weight:900;letter-spacing:.075em;text-transform:uppercase}
#${ID} .ngh-divider{height:1px;background:#d7dfed;margin:3px 5px}
#${ID} .ngh-item{width:100%;min-height:36px;border:0;border-radius:9px;background:transparent;color:inherit;display:flex;align-items:center;gap:8px;padding:8px 9px;text-align:left;cursor:pointer;font-size:10px;font-weight:760}
#${ID} .ngh-item:hover,#${ID} .ngh-item:focus-visible{outline:none;background:#e6eefc}
#${ID} .ngh-item.child{padding-left:34px}
#${ID} .ngh-workspace{padding:5px;border:1px solid transparent;border-radius:11px}#${ID} .ngh-workspace:hover{border-color:#d7dfed}
#${ID} .ngh-utils{position:relative;margin-left:auto;display:flex;align-items:center;gap:5px}
#${ID} .ngh-icon-btn{width:38px;height:38px;padding:0;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:rgba(255,255,255,.07);color:#fff;cursor:pointer}
#${ID} .ngh-icon-btn:hover,#${ID} .ngh-icon-btn:focus-visible,#${ID} .ngh-icon-btn[aria-expanded="true"]{outline:none;background:#f2b35c;border-color:#f2b35c}
#${ID} .ngh-account{min-height:42px;padding:5px 9px;display:flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.12);border-radius:11px;background:rgba(255,255,255,.07);color:#fff;cursor:pointer}
#${ID} .ngh-account:hover,#${ID} .ngh-account:focus-visible,#${ID} .ngh-account[aria-expanded="true"]{outline:none;background:#f2b35c;border-color:#f2b35c;color:#111827}
#${ID} .ngh-avatar{width:34px;height:34px;border-radius:50%;overflow:hidden;display:grid;place-items:center;border:1px solid rgba(255,255,255,.26);background:rgba(255,255,255,.10);color:#fff3a9;font-size:12px;font-weight:850}
#${ID} .ngh-avatar img{width:100%;height:100%;object-fit:cover}
#${ID} .ngh-user{display:grid;text-align:left;min-width:0}#${ID} .ngh-user strong{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
#${ID} .ngh-user small{max-width:170px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#d8e3f8;font-size:8px}
#${ID} .ngh-role{display:inline-flex;width:max-content;margin-top:2px;padding:1px 5px;border:1px solid rgba(255,255,255,.26);border-radius:999px;color:#fff3a9;font-size:7px;font-weight:900}
#${ID} .ngh-pop{display:none;position:absolute;right:0;top:calc(100% + 8px);width:230px;overflow:hidden;border:1px solid #d7dfed;border-radius:14px;background:#f8fbff;color:#111827;box-shadow:0 18px 50px rgba(23,39,85,.28);z-index:40}
#${ID} .ngh-pop.open{display:block}#${ID} .ngh-pop button{width:100%;min-height:42px;border:0;border-top:1px solid #e2e8f0;background:transparent;color:inherit;padding:0 12px;text-align:left;font-size:11px;font-weight:760;cursor:pointer}#${ID} .ngh-pop button:first-child{border-top:0}#${ID} .ngh-pop button:hover{background:#eaf1ff}#${ID} .ngh-pop .danger{color:#9c2f2f}
#${ID} .ngh-empty{padding:12px 10px;color:#667085;font-size:10px}
@media(max-width:760px){#${ID}{height:${HEIGHT}px}#${ID} .ngh-bar{padding:0 10px;gap:8px}#${ID} .ngh-logo{width:58px;height:40px}#${ID} .ngh-brand-copy{display:none}#${ID} .ngh-nav{gap:10px;overflow:auto}#${ID} .ngh-nav-btn{font-size:10px}#${ID} .ngh-account{max-width:150px;padding:3px 5px}#${ID} .ngh-user strong{max-width:70px;font-size:9px}#${ID} .ngh-user small{display:none}}
`;
  document.head.appendChild(s)
}
function host(){ensureStyle();let h=document.getElementById(ID);if(!h){h=document.createElement('div');h.id=ID;document.body.appendChild(h)}return h}
function closeMenus(h,except=''){h.querySelectorAll('.ngh-menu,.ngh-pop').forEach(x=>{if(x.id!==except)x.classList.remove('open')});h.querySelectorAll('[aria-expanded="true"]').forEach(x=>{const target=x.dataset.menuTarget;if(target!==except)x.setAttribute('aria-expanded','false')})}
function toggle(h,id,button){const menu=h.querySelector('#'+id);if(!menu)return;const open=!menu.classList.contains('open');closeMenus(h,open?id:'');menu.classList.toggle('open',open);button?.setAttribute('aria-expanded',open?'true':'false')}
function findTool(nav,key,workspaceId=''){if(workspaceId){const ws=(nav?.workspaces||[]).find(x=>String(x.workspaceId)===String(workspaceId));return (ws?.tools||[]).find(x=>String(x.toolKey)===String(key))||null}return (nav?.personal?.tools||[]).find(x=>String(x.toolKey)===String(key))||null}
function fallbackTool(tool,ws){const route=String(tool?.routePath||'').trim();if(!route)return;const u=new URL(route,location.origin);if(ws?.workspaceId)u.searchParams.set('nxoWorkspace',ws.workspaceId);location.assign(u.href)}
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
  const context=opts.contextLabel||'Mi espacio';
  const lang=String(opts.language||'es').toLowerCase().startsWith('en')?'en':'es';
  const photo=profile?.photoImage?.url||profile?.photoImage?.image?.url||profile?.photoImage?.src||'';
  h.innerHTML='<header class="ngh-bar">'+
    '<button class="ngh-brand" data-home><img class="ngh-logo" src="'+LOGO+'" alt="Nexo Group"><span class="ngh-brand-copy"><strong>Nexo Group</strong><small>'+esc(context)+'</small></span></button>'+
    '<nav class="ngh-nav"><div class="ngh-group"><button class="ngh-nav-btn '+(active==='personal'||active==='workspace'||active==='tool'?'active':'')+'" data-personal data-menu-target="ngh-space" aria-expanded="false"><img class="ngh-icon" src="'+icon('home')+'" alt=""><span>'+(lang==='en'?'My space':'Mi espacio')+'</span><span>⌄</span></button><div class="ngh-menu" id="ngh-space">'+menuMarkup(nav)+'</div></div>'+
    '<button class="ngh-nav-btn '+(active==='development'?'active':'')+'" data-development><img class="ngh-icon" src="'+icon('desarrollo')+'" alt=""><span>'+(lang==='en'?'Development Center':'Centro de desarrollo')+'</span></button></nav>'+
    '<div class="ngh-utils"><div class="ngh-group"><button class="ngh-icon-btn" data-settings data-menu-target="ngh-settings" aria-expanded="false"><img class="ngh-icon" src="'+icon('ajustes-rapidos')+'" alt=""></button><div class="ngh-pop" id="ngh-settings"><button data-language>'+(lang==='en'?'Language':'Idioma')+' <strong style="float:right">'+lang.toUpperCase()+'</strong></button><button data-theme>'+(lang==='en'?'Appearance':'Apariencia')+'</button></div></div>'+
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