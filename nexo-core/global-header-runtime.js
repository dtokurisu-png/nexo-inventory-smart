(function(){
'use strict';
const VERSION='20261018-16';
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
      '<feMorphology in="SourceAlpha" operator="dilate" radius="0.55" result="d"/>'+
      '<feFlood flood-color="#ffffff" flood-opacity="0.68" result="c"/>'+
      '<feComposite in="c" in2="d" operator="in" result="o"/>'+
      '<feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge>'+
    '</filter>'+
    '<filter id="nexo-global-icon-outline-night" x="-35%" y="-35%" width="170%" height="170%" color-interpolation-filters="sRGB">'+
      '<feMorphology in="SourceAlpha" operator="dilate" radius="0.55" result="d"/>'+
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
  position:fixed;inset:var(--nexo-global-header-top,0px) 0 auto 0;height:${HEIGHT}px;z-index:2147483600;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  pointer-events:auto
}
#${ID}[data-variant="camino"]{
  --ngh-bg:#06130F;
  --ngh-border:#21483C;
  --ngh-text:#F0FBF7;
  --ngh-muted:#86A399;
  --ngh-active:#65F2C6;
  --ngh-interaction:#20C997;
  --ngh-interaction-contrast:#032219;
  --ngh-surface:#0B1914;
  --ngh-surface2:#0E241C;
  --ngh-panel-text:#EDF8F4;
  --ngh-panel-muted:#819B91;
  --ngh-panel-border:#2A5144;
  --ngh-panel-border-strong:#34705D;
  --ngh-shadow:rgba(0,0,0,.34);
  --ngh-role:#74E8C4
}
#${ID}[data-variant="camino"][data-theme="day"]{
  --ngh-bg:#071A14;
  --ngh-border:#285849;
  --ngh-text:#F3FFFB;
  --ngh-muted:#A3C4B8;
  --ngh-active:#65F2C6;
  --ngh-interaction:#27D3A2;
  --ngh-interaction-contrast:#032219;
  --ngh-surface:#F3FBF7;
  --ngh-surface2:#E8F6F0;
  --ngh-panel-text:#10231D;
  --ngh-panel-muted:#5F786F;
  --ngh-panel-border:#B9D8CD;
  --ngh-panel-border-strong:#5C8E7D;
  --ngh-shadow:rgba(4,31,23,.22);
  --ngh-role:#0D7559
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
#${ID}[data-variant="camino"][data-theme="night"]{
  --ngh-bg:#06130F;
  --ngh-border:#21483C;
  --ngh-text:#F0FBF7;
  --ngh-muted:#86A399;
  --ngh-active:#65F2C6;
  --ngh-interaction:#20C997;
  --ngh-interaction-contrast:#032219;
  --ngh-surface:#0B1914;
  --ngh-surface2:#0E241C;
  --ngh-panel-text:#EDF8F4;
  --ngh-panel-muted:#819B91;
  --ngh-panel-border:#2A5144;
  --ngh-panel-border-strong:#34705D;
  --ngh-shadow:rgba(0,0,0,.34);
  --ngh-role:#74E8C4
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
#${ID} .ngh-product-mark{width:42px;height:42px;display:grid;place-items:center;border-radius:11px;background:var(--ngh-active);color:var(--ngh-interaction-contrast);font-size:17px;font-weight:950;box-shadow:0 7px 20px var(--ngh-shadow)}
#${ID} .ngh-product-nav{display:flex;align-items:stretch;gap:18px}
#${ID} .ngh-contexts{display:flex;align-items:center;gap:7px}
#${ID} .ngh-context{position:relative;display:flex;align-items:center}
#${ID} .ngh-context-btn{min-width:118px;height:42px;padding:5px 9px;border:1px solid color-mix(in srgb,var(--ngh-text) 14%,transparent);border-radius:11px;background:color-mix(in srgb,var(--ngh-text) 7%,transparent);color:var(--ngh-text);display:grid;text-align:left;cursor:pointer}
#${ID} .ngh-context-btn.static{cursor:default}
#${ID} .ngh-context-btn:not(.static):hover,#${ID} .ngh-context-btn[aria-expanded="true"]{background:var(--ngh-interaction);border-color:var(--ngh-interaction);color:var(--ngh-interaction-contrast)}
#${ID} .ngh-context-btn span{font-size:7px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;opacity:.72}
#${ID} .ngh-context-btn strong{margin-top:2px;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${ID} .ngh-context-menu{left:auto;right:0;min-width:250px}

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
#${ID} .ngh-workspace{position:relative;display:flex;align-items:center;gap:4px;padding:4px;border:1px solid transparent;border-radius:11px}
#${ID} .ngh-workspace:hover,#${ID} .ngh-workspace.flyout-open{border-color:var(--ngh-panel-border);background:color-mix(in srgb,var(--ngh-surface2) 55%,transparent)}
#${ID} .ngh-workspace>.ngh-item{flex:1;min-width:0}
#${ID} .ngh-workspace-tools{width:30px;height:34px;flex:0 0 30px;border:0;border-radius:8px;background:transparent;color:var(--ngh-panel-muted);display:grid;place-items:center;cursor:pointer;font-size:18px;line-height:1}
#${ID} .ngh-workspace-tools:hover,#${ID} .ngh-workspace-tools:focus-visible,#${ID} .ngh-workspace-tools[aria-expanded="true"]{outline:none;background:var(--nxo-accent-soft,var(--ngh-surface2));color:var(--ngh-panel-text)}
#${ID} #nxo-header-flyout-root{display:none;position:fixed;z-index:2147483642;width:286px;max-width:calc(100vw - 20px);max-height:min(68vh,560px);overflow:auto;padding:9px;border:1px solid var(--ngh-panel-border);border-radius:14px;background:var(--ngh-surface);color:var(--ngh-panel-text);box-shadow:0 18px 50px var(--ngh-shadow)}
#${ID} #nxo-header-flyout-root.open{display:grid;gap:5px}
#${ID} #nxo-header-flyout-root .ngh-flyout-head{padding:7px 9px 6px;border-bottom:1px solid var(--ngh-panel-border);margin-bottom:2px}
#${ID} #nxo-header-flyout-root .ngh-flyout-head strong{display:block;font-size:11px}
#${ID} #nxo-header-flyout-root .ngh-flyout-head small{display:block;margin-top:2px;color:var(--ngh-panel-muted);font-size:8px}
#${ID} #nxo-header-flyout-root .ngh-item{min-height:38px}
@media(max-width:760px){#${ID} #nxo-header-flyout-root{left:10px!important;right:10px!important;width:auto!important;max-width:none!important}}
#${ID} .ngh-utils{position:relative;margin-left:auto;display:flex;align-items:center;gap:7px}
#${ID} .ngh-desktop-settings{display:flex;align-items:center;gap:7px}
#${ID} .ngh-mobile-settings{display:none;position:relative}
#${ID} .ngh-direct-setting{
  min-height:38px;padding:0 9px;border:1px solid color-mix(in srgb,var(--ngh-text) 12%,transparent);
  border-radius:11px;background:color-mix(in srgb,var(--ngh-text) 7%,transparent);
  color:var(--ngh-text);display:inline-flex;align-items:center;gap:7px;cursor:pointer;
  font-size:10px;font-weight:850
}
#${ID} .ngh-direct-setting:hover,#${ID} .ngh-direct-setting:focus-visible{
  outline:none;background:var(--ngh-interaction);border-color:var(--ngh-interaction);color:var(--ngh-interaction-contrast)
}
#${ID} .ngh-direct-setting .ngh-icon{width:16px;height:16px}
#${ID} .ngh-direct-setting strong{font-size:9px;letter-spacing:.02em}
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

/* Unified global-header controls: contexts, language, theme and account use the same
   interaction language as the main navigation buttons. */
#${ID} .ngh-utils,
#${ID} .ngh-contexts,
#${ID} .ngh-desktop-settings{align-self:stretch;align-items:stretch}
#${ID} .ngh-context{align-items:stretch}
#${ID} .ngh-context-btn,
#${ID} .ngh-direct-setting,
#${ID} .ngh-icon-btn,
#${ID} .ngh-account{
  position:relative;
  height:100%;
  min-height:0;
  border:0;
  border-radius:0;
  background:transparent;
  box-shadow:none;
  color:var(--ngh-muted)
}
#${ID} .ngh-context-btn{min-width:108px;padding:8px 9px}
#${ID} .ngh-direct-setting{padding:0 9px}
#${ID} .ngh-account{padding:5px 7px}
#${ID} .ngh-icon-btn{width:40px}
#${ID} .ngh-context-btn:after,
#${ID} .ngh-direct-setting:after,
#${ID} .ngh-icon-btn:after,
#${ID} .ngh-account:after{
  content:"";
  position:absolute;
  left:0;right:0;bottom:0;
  height:3px;
  border-radius:3px 3px 0 0;
  background:transparent
}
#${ID} .ngh-context-btn:not(.static):hover,
#${ID} .ngh-context-btn:not(.static):focus-visible,
#${ID} .ngh-context-btn[aria-expanded="true"],
#${ID} .ngh-direct-setting:hover,
#${ID} .ngh-direct-setting:focus-visible,
#${ID} .ngh-icon-btn:hover,
#${ID} .ngh-icon-btn:focus-visible,
#${ID} .ngh-icon-btn[aria-expanded="true"],
#${ID} .ngh-account:hover,
#${ID} .ngh-account:focus-visible,
#${ID} .ngh-account[aria-expanded="true"]{
  outline:none;
  background:transparent;
  border-color:transparent;
  color:var(--ngh-text)
}
#${ID} .ngh-context-btn:not(.static):hover:after,
#${ID} .ngh-context-btn:not(.static):focus-visible:after,
#${ID} .ngh-context-btn[aria-expanded="true"]:after,
#${ID} .ngh-direct-setting:hover:after,
#${ID} .ngh-direct-setting:focus-visible:after,
#${ID} .ngh-icon-btn:hover:after,
#${ID} .ngh-icon-btn:focus-visible:after,
#${ID} .ngh-icon-btn[aria-expanded="true"]:after,
#${ID} .ngh-account:hover:after,
#${ID} .ngh-account:focus-visible:after,
#${ID} .ngh-account[aria-expanded="true"]:after{background:var(--ngh-interaction)}
#${ID} .ngh-context-btn.static{color:var(--ngh-text)}
#${ID} .ngh-context-btn.static:after{background:color-mix(in srgb,var(--ngh-active) 35%,transparent)}
#${ID} .ngh-context-btn span{opacity:.64}
#${ID} .ngh-context-btn strong,
#${ID} .ngh-direct-setting strong{color:inherit}
#${ID} .ngh-account .ngh-user strong{color:inherit}
#${ID} .ngh-account[aria-expanded="true"] .ngh-role,
#${ID} .ngh-account:hover .ngh-role{border-color:var(--ngh-interaction);color:var(--ngh-active)}

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
  #${ID} .ngh-product-nav{gap:10px;overflow:auto}
  #${ID} .ngh-contexts{display:none}
  #${ID}[data-variant="camino"] .ngh-contexts{display:flex}
  #${ID}[data-variant="camino"] .ngh-context:first-child{display:none}
  #${ID}[data-variant="camino"] .ngh-context-btn{min-width:92px}
  #${ID}[data-variant="camino"] .ngh-user{display:none}
  #${ID} .ngh-desktop-settings{display:none}
  #${ID} .ngh-mobile-settings{display:block}
}
`
  document.head.appendChild(s)
}
function removeLegacyHeaders(){
  ['nxo-shared-header','nxo-dev-header'].forEach(id=>{
    const el=document.getElementById(id);
    if(el&&el.id!==ID)el.remove()
  })
}
function host(){
  removeLegacyHeaders();
  ensureStyle();
  ensureOutlineDefs();
  let h=document.getElementById(ID);
  if(!h){
    h=document.createElement('div');
    h.id=ID;
    document.body.appendChild(h)
  }
  return h
}
function closeMenus(h,except=''){h.querySelectorAll('.ngh-menu,.ngh-pop').forEach(x=>{if(x.id!==except)x.classList.remove('open')});h.querySelectorAll('[aria-expanded="true"]').forEach(x=>{const target=x.dataset.menuTarget;if(target!==except)x.setAttribute('aria-expanded','false')})}
function toggle(h,id,button){const menu=h.querySelector('#'+id);if(!menu)return;const open=!menu.classList.contains('open');closeMenus(h,open?id:'');menu.classList.toggle('open',open);button?.setAttribute('aria-expanded',open?'true':'false')}
function findTool(nav,key,workspaceId=''){if(workspaceId){const ws=(nav?.workspaces||[]).find(x=>String(x.workspaceId)===String(workspaceId));return (ws?.tools||[]).find(x=>String(x.toolKey)===String(key))||null}return (nav?.personal?.tools||[]).find(x=>String(x.toolKey)===String(key))||null}
function fallbackTool(tool,ws){const route=String(tool?.routePath||'').trim();if(!route)return;const u=new URL(route,location.origin);if(ws?.workspaceId)u.searchParams.set('nxoWorkspace',ws.workspaceId);location.assign(u.href)}
function normalizeTheme(value){return value==='night'?'night':'day'}
function productNavMarkup(items,active=''){
  if(!Array.isArray(items)||!items.length)return '';
  return '<div class="ngh-product-nav">'+items.map(item=>
    '<button class="ngh-nav-btn '+((item.active||String(active)===String(item.key))?'active':'')+'" data-product-nav="'+esc(item.key||'')+'" '+(item.disabled?'disabled':'')+'>'+esc(item.label||item.key||'')+'</button>'
  ).join('')+'</div>'
}
function contextMarkup(items){
  if(!Array.isArray(items)||!items.length)return '';
  return '<div class="ngh-contexts">'+items.map(item=>{
    const options=Array.isArray(item.options)?item.options:[];
    const menuId='ngh-context-'+esc(item.key||'context');
    return '<div class="ngh-context"><button class="ngh-context-btn '+(options.length?'':'static')+'" data-context="'+esc(item.key||'')+'" '+(options.length?'data-menu-target="'+menuId+'" aria-expanded="false"':'')+'><span>'+esc(item.label||'')+'</span><strong>'+esc(item.value||'')+'</strong></button>'+
      (options.length?'<div class="ngh-menu ngh-context-menu" id="'+menuId+'">'+options.map(opt=>'<button class="ngh-item '+(opt.active?'active':'')+'" data-context-option="'+esc(item.key||'')+'" data-context-value="'+esc(opt.value||'')+'"><span>'+esc(opt.label||opt.value||'')+'</span></button>').join('')+'</div>':'')+
    '</div>'
  }).join('')+'</div>'
}
function menuMarkup(nav,lang='es'){
  const direct=Array.isArray(nav?.personal?.tools)?nav.personal.tools:[];
  const spaces=Array.isArray(nav?.workspaces)?nav.workspaces:[];
  const en=String(lang||'').toLowerCase().startsWith('en');
  let out='';
  if(direct.length){out+='<div class="ngh-title">'+(en?'Direct access':'Accesos directos')+'</div>'+direct.map(t=>'<button class="ngh-item" data-tool="'+esc(t.toolKey||'')+'" data-ws=""><img class="ngh-icon" src="'+icon(toolIconKey(t))+'" alt=""><span>'+esc(t.name||t.nameEs||t.toolKey||'Herramienta')+'</span></button>').join('')}
  if(spaces.length){
    if(out)out+='<div class="ngh-divider"></div>';
    out+='<div class="ngh-title">'+(en?'Workspaces':'Espacios de trabajo')+'</div>';
    for(const ws of spaces){
      const id=esc(ws.workspaceId||'');
      const label=esc(ws.name||'Workspace');
      out+='<div class="ngh-workspace" data-workspace-row="'+id+'"><button class="ngh-item" data-workspace="'+id+'"><img class="ngh-icon" src="'+icon('workspace')+'" alt=""><strong>'+label+'</strong></button><button type="button" class="ngh-workspace-tools" data-workspace-tools="'+id+'" aria-haspopup="true" aria-expanded="false" aria-label="'+esc((en?'Tools for ':'Herramientas de ')+(ws.name||'Workspace'))+'">›</button></div>';
    }
  }
  return out||'<div class="ngh-empty">'+(en?'No access available':'Sin accesos disponibles')+'</div>'
}
function workspaceFlyoutMarkup(ws,lang='es'){
  const en=String(lang||'').toLowerCase().startsWith('en');
  const tools=Array.isArray(ws?.tools)?ws.tools:[];
  let out='<div class="ngh-flyout-head"><strong>'+esc(ws?.name||'Workspace')+'</strong><small>'+(en?'Tools and applications':'Herramientas y aplicaciones')+'</small></div>';
  if(!tools.length)return out+'<div class="ngh-empty">'+(en?'No tools available':'Sin herramientas disponibles')+'</div>';
  out+=tools.map(t=>'<button class="ngh-item" data-flyout-tool="'+esc(t.toolKey||'')+'" data-ws="'+esc(ws?.workspaceId||'')+'"><img class="ngh-icon" src="'+icon(toolIconKey(t))+'" alt=""><span>'+esc(t.workspaceName||t.name||t.nameEs||t.nameEn||t.toolKey||'Herramienta')+'</span></button>').join('');
  return out
}
function mount(container,opts={}){
  const h=host();
  const nav=opts.navigation||{};
  const profile=opts.profile||{};
  const active=opts.active||'personal';
  const theme=normalizeTheme(opts.theme);
  h.dataset.theme=theme;
  h.dataset.variant=String(opts.variant||'');
  const context=opts.contextLabel||'Mi espacio';
  const lang=String(opts.language||'es').toLowerCase().startsWith('en')?'en':'es';
  const photo=profile?.photoImage?.url||profile?.photoImage?.image?.url||profile?.photoImage?.src||'';
  const brand=opts.brand&&typeof opts.brand==='object'?opts.brand:null;
  const brandMarkup=brand
    ?('<button class="ngh-brand" data-home>'+(brand.mark?'<span class="ngh-product-mark">'+esc(brand.mark)+'</span>':(brand.logoUrl?'<img class="ngh-logo" src="'+esc(brand.logoUrl)+'" alt="">':'<img class="ngh-logo" src="'+LOGO+'" alt="Nexo Group">'))+'<span class="ngh-brand-copy"><strong>'+esc(brand.title||'Nexo Group')+'</strong><small>'+esc(brand.subtitle||context)+'</small></span></button>')
    :('<button class="ngh-brand" data-home><img class="ngh-logo" src="'+LOGO+'" alt="Nexo Group"><span class="ngh-brand-copy"><strong>Nexo Group</strong><small>'+esc(context)+'</small></span></button>');
  const customNav=productNavMarkup(opts.productNavigation,opts.productActive);
  const globalNav=opts.hideGlobalNavigation?'':('<div class="ngh-group"><button class="ngh-nav-btn '+(active==='personal'||active==='workspace'||active==='tool'?'active':'')+'" data-personal data-menu-target="ngh-space" aria-expanded="false">'+iconMarkup('home')+'<span>'+(lang==='en'?'My space':'Mi espacio')+'</span><span>⌄</span></button><div class="ngh-menu" id="ngh-space">'+menuMarkup(nav)+'</div></div>'+
    '<button class="ngh-nav-btn '+(active==='development'?'active':'')+'" data-development>'+iconMarkup('desarrollo')+'<span>'+(lang==='en'?'Development Center':'Centro de desarrollo')+'</span></button>');
  h.innerHTML='<header class="ngh-bar">'+
    brandMarkup+
    '<nav class="ngh-nav">'+customNav+globalNav+'</nav>'+
    '<div class="ngh-utils">'+contextMarkup(opts.contextControls)+'<div class="ngh-desktop-settings"><button class="ngh-direct-setting" data-language>'+iconMarkup('idioma')+'<strong>'+lang.toUpperCase()+'</strong></button><button class="ngh-direct-setting" data-theme>'+iconMarkup(theme==='night'?'modo-oscuro':'modo-claro','ngh-theme-icon')+'<strong>'+(theme==='night'?'Dark':'Light')+'</strong></button></div><div class="ngh-mobile-settings"><button class="ngh-icon-btn" data-settings data-menu-target="ngh-settings" aria-expanded="false">'+iconMarkup('ajustes-rapidos')+'</button><div class="ngh-pop" id="ngh-settings"><button class="ngh-setting-row" data-language><span class="ngh-setting-label">'+iconMarkup('idioma')+'<span>'+(lang==='en'?'Language':'Idioma')+'</span></span><strong class="ngh-setting-value">'+lang.toUpperCase()+'</strong></button><button class="ngh-setting-row" data-theme><span class="ngh-setting-label">'+iconMarkup(theme==='night'?'modo-oscuro':'modo-claro','ngh-theme-icon')+'<span>'+(lang==='en'?'Appearance':'Apariencia')+'</span></span><strong class="ngh-setting-value">'+(theme==='night'?'Dark':'Light')+'</strong></button></div></div>'+
    '<div class="ngh-group"><button class="ngh-account" data-account data-menu-target="ngh-account" aria-expanded="false"><span class="ngh-avatar">'+(photo?'<img src="'+esc(photo)+'" alt="">':esc(initials(profile.displayName||'Usuario Nexo')))+'</span><span class="ngh-user"><strong>'+esc(profile.displayName||'Usuario Nexo')+'</strong><span class="ngh-role">'+esc(opts.roleLabel||'Miembro')+'</span><small>'+esc(profile.email||'')+'</small></span><span>⌄</span></button><div class="ngh-pop" id="ngh-account"><button data-profile>'+(lang==='en'?'Profile settings':'Ajustes de perfil')+'</button><button data-switch>'+(lang==='en'?'Switch account':'Cambiar cuenta')+'</button><button class="danger" data-logout>'+(lang==='en'?'Sign out':'Cerrar sesión')+'</button></div></div></div>'+
    '</header>';

  const call=(name,...args)=>typeof opts[name]==='function'?opts[name](...args):undefined;
  h.querySelector('[data-home]')?.addEventListener('click',e=>{if(call('onHome',e)!==false&&typeof opts.onPersonal==='function')opts.onPersonal(e)});
  h.querySelector('[data-personal]')?.addEventListener('click',e=>{e.stopPropagation();toggle(h,'ngh-space',e.currentTarget)});
  h.querySelector('[data-development]')?.addEventListener('click',e=>{if(call('onDevelopment',e)!==false&&location.pathname!=='/')location.assign('/')});
  h.querySelector('[data-settings]')?.addEventListener('click',e=>{e.stopPropagation();toggle(h,'ngh-settings',e.currentTarget)});
  h.querySelector('[data-account]')?.addEventListener('click',e=>{e.stopPropagation();toggle(h,'ngh-account',e.currentTarget)});
  h.querySelectorAll('[data-product-nav]').forEach(button=>button.addEventListener('click',e=>call('onProductNav',button.dataset.productNav,e)));
  h.querySelectorAll('[data-context]').forEach(button=>button.addEventListener('click',e=>{const target=button.dataset.menuTarget;if(target){e.stopPropagation();toggle(h,target,e.currentTarget)}}));
  h.querySelectorAll('[data-context-option]').forEach(button=>button.addEventListener('click',e=>call('onContextAction',button.dataset.contextOption,button.dataset.contextValue,e)));
  h.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',e=>call('onLanguage',e)));
  h.querySelectorAll('[data-theme]').forEach(button=>button.addEventListener('click',e=>call('onTheme',e)));
  h.querySelector('[data-profile]')?.addEventListener('click',e=>call('onProfileSettings',e));
  h.querySelector('[data-switch]')?.addEventListener('click',e=>call('onSwitchAccount',e));
  h.querySelector('[data-logout]')?.addEventListener('click',e=>call('onLogout',e));
  const spaceMenu=h.querySelector('#ngh-space');
  let flyout=h.querySelector('#nxo-header-flyout-root');
  if(!flyout){flyout=document.createElement('div');flyout.id='nxo-header-flyout-root';flyout.setAttribute('role','menu');h.appendChild(flyout)}
  let flyoutTimer=null,activeWorkspaceId='';
  const clearFlyoutTimer=()=>{if(flyoutTimer){clearTimeout(flyoutTimer);flyoutTimer=null}};
  const closeWorkspaceFlyout=()=>{clearFlyoutTimer();activeWorkspaceId='';flyout.classList.remove('open');flyout.innerHTML='';h.querySelectorAll('.ngh-workspace.flyout-open').forEach(x=>x.classList.remove('flyout-open'));h.querySelectorAll('[data-workspace-tools][aria-expanded="true"]').forEach(x=>x.setAttribute('aria-expanded','false'))};
  const positionWorkspaceFlyout=row=>{
    const rr=row.getBoundingClientRect(),mr=spaceMenu?.getBoundingClientRect();
    const width=Math.min(286,Math.max(220,window.innerWidth-20));
    let left=(mr?.right||rr.right)+8;
    if(left+width>window.innerWidth-10)left=Math.max(10,(mr?.left||rr.left)-width-8);
    let top=rr.top;
    const maxTop=Math.max(10,window.innerHeight-Math.min(flyout.scrollHeight||360,560)-10);
    top=Math.min(Math.max(10,top),maxTop);
    flyout.style.left=Math.round(left)+'px';flyout.style.top=Math.round(top)+'px'
  };
  const bindFlyoutTools=()=>flyout.querySelectorAll('[data-flyout-tool]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const ws=(nav.workspaces||[]).find(x=>String(x.workspaceId)===String(b.dataset.ws));const tool=findTool(nav,b.dataset.flyoutTool,b.dataset.ws);closeWorkspaceFlyout();closeMenus(h,'');if(call('onTool',tool,ws,e)!==false)fallbackTool(tool,ws)}));
  const openWorkspaceFlyout=(id,row)=>{
    clearFlyoutTimer();
    const ws=(nav.workspaces||[]).find(x=>String(x.workspaceId)===String(id));
    if(!ws)return;
    activeWorkspaceId=String(id);
    h.querySelectorAll('.ngh-workspace.flyout-open').forEach(x=>x.classList.remove('flyout-open'));
    h.querySelectorAll('[data-workspace-tools][aria-expanded="true"]').forEach(x=>x.setAttribute('aria-expanded','false'));
    row?.classList.add('flyout-open');row?.querySelector('[data-workspace-tools]')?.setAttribute('aria-expanded','true');
    flyout.innerHTML=workspaceFlyoutMarkup(ws,lang);
    flyout.classList.add('open');
    positionWorkspaceFlyout(row);
    bindFlyoutTools()
  };
  const scheduleFlyoutClose=()=>{clearFlyoutTimer();flyoutTimer=setTimeout(closeWorkspaceFlyout,180)};
  flyout.addEventListener('mouseenter',clearFlyoutTimer);
  flyout.addEventListener('mouseleave',scheduleFlyoutClose);
  h.querySelectorAll('[data-workspace-row]').forEach(row=>{
    const id=row.dataset.workspaceRow||'';
    row.addEventListener('mouseenter',()=>{if(window.matchMedia?.('(hover:hover) and (pointer:fine)').matches)openWorkspaceFlyout(id,row)});
    row.addEventListener('mouseleave',()=>{if(window.matchMedia?.('(hover:hover) and (pointer:fine)').matches)scheduleFlyoutClose()});
    row.addEventListener('focusin',()=>openWorkspaceFlyout(id,row));
    row.addEventListener('focusout',e=>{if(!row.contains(e.relatedTarget)&&!flyout.contains(e.relatedTarget))scheduleFlyoutClose()})
  });
  h.querySelectorAll('[data-workspace-tools]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const row=b.closest('[data-workspace-row]');const id=b.dataset.workspaceTools||'';if(activeWorkspaceId===String(id)&&flyout.classList.contains('open'))closeWorkspaceFlyout();else openWorkspaceFlyout(id,row)}));
  h.querySelectorAll('[data-workspace]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();closeWorkspaceFlyout();const ws=(nav.workspaces||[]).find(x=>String(x.workspaceId)===String(b.dataset.workspace));if(call('onWorkspace',ws,e)!==false&&ws?.workspaceId){const u=new URL(location.href);u.searchParams.set('nxoWorkspace',ws.workspaceId);location.assign(u.href)}}));
  h.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();closeWorkspaceFlyout();const ws=(nav.workspaces||[]).find(x=>String(x.workspaceId)===String(b.dataset.ws));const tool=findTool(nav,b.dataset.tool,b.dataset.ws);if(call('onTool',tool,ws,e)!==false)fallbackTool(tool,ws)}));
  h.querySelector('[data-personal]')?.addEventListener('click',()=>{if(!spaceMenu?.classList.contains('open'))closeWorkspaceFlyout()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeWorkspaceFlyout()});
  document.addEventListener('click',()=>closeMenus(h,''),{once:true});
  document.documentElement.style.setProperty('--nexo-global-header-height',HEIGHT+'px');
  return h
}
function unmount(){document.getElementById(ID)?.remove()}
window.NEXO_GLOBAL_HEADER={version:VERSION,height:HEIGHT,mount,unmount};
})();