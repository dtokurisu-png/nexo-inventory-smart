(function(){
if(window.__nexoGlobalHeaderV1)return;window.__nexoGlobalHeaderV1=true;

const REV='nexo-header-20260927-1';
const CSS='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/global-header.css?v='+REV;
const ROUTES={
  '/blank-8':{title:'Mi espacio',subtitle:'Nexo Group'},
  '/blank':{title:'Biblioteca de engranaje',subtitle:'Conocimiento para emprendedores'},
  '/blank-3-1':{title:'Inventario Smart',subtitle:'Herramientas empresariales'},
  '/blank-4':{title:'Fichas Técnicas Dinámicas',subtitle:'Herramientas empresariales'},
  '/blank-5':{title:'Nexo Learning Core',subtitle:'Aprendizaje y certificación'},
  '/blank-6':{title:'Camino Editorial',subtitle:'Creación y publicación'},
  '/blank-9':{title:'Nexo Checkpoint',subtitle:'Juegos y distribución'},
  '/nexo-links':{title:'Nexo Links',subtitle:'Nexo Group'},
  '/blank-2':{title:'Nexa',subtitle:'Asistencia Nexo'}
};

let explicitContext=null;

function siteBase(){
  const parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean);
  return location.origin+(parts.length?'/'+parts[0]:'');
}
function route(){
  const parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean);
  return '/'+(parts[parts.length-1]||'');
}
function isCenter(){
  const p=location.pathname.replace(/\/+$/,'');
  const parts=p.split('/').filter(Boolean);
  return p===(parts.length?'/'+parts[0]:'');
}
function eligible(){
  return !!ROUTES[route()]||isCenter();
}
function addCss(){
  if(document.getElementById('nxo-global-header-css'))return;
  const l=document.createElement('link');
  l.id='nxo-global-header-css';l.rel='stylesheet';l.href=CSS;
  document.head.appendChild(l);
}
function esc(v){
  return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function initials(v){
  return String(v||'N').trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'N';
}
function theme(){
  const q=new URLSearchParams(location.search);
  return String(q.get('nxoTheme')||document.documentElement.dataset.nxoTheme||'nexo').toLowerCase();
}
function profileName(){
  try{return localStorage.getItem('nexoHeaderDisplayName')||'Cuenta Nexo'}catch(_){return'Cuenta Nexo'}
}
function context(){
  if(explicitContext)return explicitContext;
  try{
    const saved=JSON.parse(sessionStorage.getItem('nexoHeaderContext')||'null');
    if(saved&&saved.path===location.pathname&&Date.now()-Number(saved.at||0)<3600000)return saved;
  }catch(_){}
  const info=isCenter()?{title:'Centro de desarrollo',subtitle:'Nexo Group'}:(ROUTES[route()]||{title:'Nexo Group',subtitle:''});
  return {...info,path:location.pathname};
}
function backInfo(){
  const q=new URLSearchParams(location.search);
  if(explicitContext?.backTarget){
    return {target:explicitContext.backTarget,label:explicitContext.backLabel||'Mi espacio'};
  }
  if(route()==='/blank-8'&&q.get('nxoWorkspace')){
    return {target:siteBase()+'/blank-8',label:'Mi espacio'};
  }
  if(route()==='/blank-8'&&!q.get('nxoWorkspace'))return null;
  let target=q.get('nxoBack')||'';
  let label=q.get('nxoBackLabel')||'';
  if(!target){
    try{
      const ref=new URL(document.referrer||'');
      if(ref.origin===location.origin&&ref.href!==location.href){
        target=ref.href;label=label||'Atrás';
      }
    }catch(_){}
  }
  if(!target){target=siteBase()+'/blank-8';label=label||'Mi espacio'}
  return {target,label};
}
function contextualUrl(path){
  const u=new URL(siteBase()+path);
  const q=new URLSearchParams(location.search);
  const back=q.get('nxoBack');
  const backLabel=q.get('nxoBackLabel');
  if(back)u.searchParams.set('nxoBack',back);
  if(backLabel)u.searchParams.set('nxoBackLabel',backLabel);
  return u.href;
}
function navItems(){
  return [
    {name:'Mi espacio',url:siteBase()+'/blank-8',hint:'Cuenta y Workspaces'},
    {name:'Centro de desarrollo',url:siteBase(),hint:'Catálogo de herramientas'},
    {name:'Biblioteca de engranaje',url:contextualUrl('/blank'),hint:'Conocimiento empresarial'},
    {name:'Inventario Smart',url:contextualUrl('/blank-3-1'),hint:'Inventario empresarial'},
    {name:'Fichas Técnicas Dinámicas',url:contextualUrl('/blank-4'),hint:'Fichas y colecciones'},
    {name:'Nexo Learning Core',url:contextualUrl('/blank-5'),hint:'Aprendizaje'},
    {name:'Nexo Checkpoint',url:contextualUrl('/blank-9'),hint:'Juegos y distribución'}
  ];
}
function closePanels(){
  document.querySelectorAll('.nxo-gh-pop.open').forEach(x=>x.classList.remove('open'));
}
function renderSearch(panel){
  panel.innerHTML='<div class="nxo-gh-searchbox"><input id="nxo-gh-search-input" placeholder="Buscar herramienta o espacio…" autocomplete="off"></div><div class="nxo-gh-results"></div>';
  const input=panel.querySelector('#nxo-gh-search-input');
  const results=panel.querySelector('.nxo-gh-results');
  const draw=()=>{
    const q=String(input.value||'').trim().toLowerCase();
    const rows=navItems().filter(x=>!q||(x.name+' '+x.hint).toLowerCase().includes(q));
    results.innerHTML=rows.map(x=>'<button type="button" class="nxo-gh-result" data-url="'+esc(x.url)+'"><span><strong>'+esc(x.name)+'</strong><small>'+esc(x.hint)+'</small></span><b>›</b></button>').join('')||'<div class="nxo-gh-empty">Sin coincidencias.</div>';
    results.querySelectorAll('[data-url]').forEach(b=>b.onclick=()=>location.assign(b.dataset.url));
  };
  input.oninput=draw;draw();setTimeout(()=>input.focus(),20);
}
function renderMenu(panel){
  panel.innerHTML='<div class="nxo-gh-menu-title">Navegación Nexo</div>'+
    navItems().slice(0,2).map(x=>'<button type="button" class="nxo-gh-menu-row" data-url="'+esc(x.url)+'"><span>'+esc(x.name)+'</span><b>›</b></button>').join('')+
    '<div class="nxo-gh-menu-note">Las herramientas conservan sus propios permisos y contexto.</div>';
  panel.querySelectorAll('[data-url]').forEach(b=>b.onclick=()=>location.assign(b.dataset.url));
}
function renderAccount(panel){
  const name=profileName();
  panel.innerHTML='<div class="nxo-gh-account-head"><div class="nxo-gh-avatar">'+esc(initials(name))+'</div><div><strong>'+esc(name)+'</strong><small>Cuenta Nexo</small></div></div>'+
    '<button class="nxo-gh-menu-row" data-url="'+esc(siteBase()+'/blank-8')+'"><span>Mi espacio</span><b>›</b></button>'+
    '<button class="nxo-gh-menu-row" data-url="'+esc(siteBase()+'/blank-8?nxoAccountAction=switch')+'"><span>Cambiar cuenta</span><b>↻</b></button>'+
    '<button class="nxo-gh-menu-row danger" data-url="'+esc(siteBase()+'/blank-8?nxoAccountAction=logout')+'"><span>Cerrar sesión</span><b>↗</b></button>';
  panel.querySelectorAll('[data-url]').forEach(b=>b.onclick=()=>location.assign(b.dataset.url));
}
function render(){
  if(!eligible())return;
  addCss();
  document.documentElement.classList.add('nxo-global-header-active');
  document.documentElement.dataset.nxoHeaderTheme=theme();
  let h=document.getElementById('nexo-global-header');
  if(!h){
    h=document.createElement('header');h.id='nexo-global-header';
    document.body.appendChild(h);
  }
  const ctx=context(),back=backInfo(),name=profileName();
  h.className='nxo-gh nxo-gh-theme-'+theme();
  h.innerHTML=
    '<div class="nxo-gh-left">'+
      (back?'<button class="nxo-gh-back" type="button" data-back="'+esc(back.target)+'">← <span>Volver a '+esc(back.label)+'</span></button>':'')+
      '<button class="nxo-gh-brand" type="button" data-home><span class="nxo-gh-mark">N</span><span class="nxo-gh-copy"><strong>'+esc(ctx.title||'Nexo Group')+'</strong><small>'+esc(ctx.subtitle||'Nexo Group')+'</small></span></button>'+
    '</div>'+
    '<div class="nxo-gh-right">'+
      '<button class="nxo-gh-icon" type="button" data-search aria-label="Buscar" title="Buscar">⌕</button>'+
      '<button class="nxo-gh-icon" type="button" data-menu aria-label="Menú" title="Menú">☰</button>'+
      '<button class="nxo-gh-account" type="button" data-account><span class="nxo-gh-avatar">'+esc(initials(name))+'</span><span class="nxo-gh-account-copy"><strong>'+esc(name)+'</strong><small>Cuenta</small></span><span>⌄</span></button>'+
    '</div>'+
    '<div class="nxo-gh-pop nxo-gh-search-pop" data-search-pop></div>'+
    '<div class="nxo-gh-pop nxo-gh-menu-pop" data-menu-pop></div>'+
    '<div class="nxo-gh-pop nxo-gh-account-pop" data-account-pop></div>';

  h.querySelector('[data-back]')?.addEventListener('click',e=>location.assign(e.currentTarget.dataset.back));
  h.querySelector('[data-home]')?.addEventListener('click',()=>location.assign(siteBase()+'/blank-8'));
  const searchPop=h.querySelector('[data-search-pop]'),menuPop=h.querySelector('[data-menu-pop]'),accountPop=h.querySelector('[data-account-pop]');
  const toggle=(panel,fill)=>{
    const open=!panel.classList.contains('open');closePanels();
    if(open){fill(panel);panel.classList.add('open')}
  };
  h.querySelector('[data-search]').onclick=()=>toggle(searchPop,renderSearch);
  h.querySelector('[data-menu]').onclick=()=>toggle(menuPop,renderMenu);
  h.querySelector('[data-account]').onclick=()=>toggle(accountPop,renderAccount);
}
window.addEventListener('NEXO_HEADER_CONTEXT',e=>{
  explicitContext={...(e.detail||{}),path:location.pathname,at:Date.now()};
  try{sessionStorage.setItem('nexoHeaderContext',JSON.stringify(explicitContext))}catch(_){}
  render();
});
window.addEventListener('popstate',()=>{explicitContext=null;render()});
document.addEventListener('click',e=>{
  const h=document.getElementById('nexo-global-header');
  if(h&&!h.contains(e.target))closePanels();
});
render();
})();