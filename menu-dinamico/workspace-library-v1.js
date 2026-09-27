(()=>{'use strict';
if(window.__NEXO_WORKSPACE_LIBRARY_V1__)return;window.__NEXO_WORKSPACE_LIBRARY_V1__=true;
if(!window.__NEXO_WORKSPACE_MODE__)return;

const view=document.getElementById('view');
const modalRoot=document.getElementById('modal');
if(!view||!modalRoot)return;

let activeTab='collections';
let importOpen=false;

const data=()=>window.__NEXO_DM_DATA__||{recipes:[],ingredients:[],collections:[],context:{},capabilities:{}};
const lang=()=>document.documentElement.lang==='en'?'en':'es';
const tr=(es,en)=>lang()==='en'?en:es;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(o,enKey,esKey)=>lang()==='en'?(o?.[enKey]||o?.[esKey]||''):(o?.[esKey]||o?.[enKey]||'');
const img=x=>typeof x==='string'?x:(x&&(x.url||x.image?.url||x.src)||'');

function capabilities(){return data().capabilities||{}}
function context(){return data().context||{}}
function canImport(){return context().type==='workspace'&&capabilities().canShare===true}
function canCreate(){return capabilities().canEdit===true}
function activeRecipes(){return(data().recipes||[]).filter(x=>x&&x.active!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0))}
function activeProducts(){return(data().ingredients||[]).filter(x=>x&&x.active!==false)}
function hasContent(){return activeRecipes().length>0||activeProducts().length>0}

function sheetCard(r){
  const dish=String(r.recipeType||'').toUpperCase()==='DISH';
  const u=img(r.heroImage);
  const title=text(r,'titleEn','titleEs')||'—';
  return '<button class="card recipeCard '+(dish?'cardDish':'cardPrep')+' nexoWorkspaceSheet" data-workspace-sheet="'+esc(r._id)+'">'+
    '<div class="thumb">'+(u?'<img src="'+esc(u)+'" alt="'+esc(title)+'">':'<span class="muted">'+esc(tr('Sin foto','No photo'))+'</span>')+'</div>'+
    '<div class="meta"><span class="tag '+(dish?'tagDish':'tagPrep')+'">'+esc(dish?tr('Plato','Dish'):tr('Preparación','Preparation'))+'</span><h3>'+esc(title)+'</h3><span class="muted">'+esc(r.category||'')+'</span></div></button>';
}

function actionButtons(){
  return '<div class="nexoWorkspaceActions">'+
    (canCreate()?'<button type="button" class="nexoWorkspaceBtn" data-nexo-create>＋ '+esc(tr('Crear ficha','Create sheet'))+'</button>':'')+
    (canImport()?'<button type="button" class="nexoWorkspaceBtn primary" data-nexo-import>⇩ '+esc(tr('Importar fichas','Import sheets'))+'</button>':'')+
    '</div>';
}

function emptyState(){
  return '<div class="nexoWorkspaceEmpty"><div class="nexoWorkspaceEmptyIcon">⌁</div><h2>'+esc(tr('Este Workspace todavía no tiene fichas técnicas','This Workspace has no technical sheets yet'))+'</h2><p>'+esc(tr('Puedes crear una ficha desde cero o importar un paquete preparado por Nexo Group.','Create a sheet from scratch or import a package prepared by Nexo Group.'))+'</p>'+actionButtons()+'</div>';
}

function renderSheets(root){
  const body=root.querySelector('[data-nexo-workspace-body]');
  if(!body)return;
  const recipes=activeRecipes();
  if(!recipes.length){
    body.innerHTML=emptyState();
    bindActions(body);
    return;
  }
  body.innerHTML='<div class="nexoWorkspaceSheetTools"><input class="search" data-nexo-sheet-search placeholder="'+esc(tr('Buscar ficha técnica…','Search technical sheet…'))+'"></div><div class="grid" data-nexo-sheet-grid>'+recipes.map(sheetCard).join('')+'</div>';
  body.querySelectorAll('[data-workspace-sheet]').forEach(card=>card.onclick=()=>window.NEXO_MENU_API?.openRecipe?.(card.dataset.workspaceSheet));
  const search=body.querySelector('[data-nexo-sheet-search]');
  if(search)search.oninput=()=>{
    const q=String(search.value||'').trim().toLowerCase();
    body.querySelectorAll('[data-workspace-sheet]').forEach(card=>{
      card.style.display=!q||card.textContent.toLowerCase().includes(q)?'':'none';
    });
  };
}

function renderCollections(root){
  const body=root.querySelector('[data-nexo-workspace-body]');
  if(!body)return;
  if(!hasContent()){
    body.innerHTML=emptyState();
    bindActions(body);
    return;
  }
  body.innerHTML='';
  const grid=root.__nexoCollectionGrid;
  if(grid)body.appendChild(grid);
}

function renderBody(root){
  root.querySelectorAll('[data-nexo-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.nexoTab===activeTab));
  if(activeTab==='sheets')renderSheets(root);else renderCollections(root);
}

function bindActions(scope){
  scope.querySelectorAll('[data-nexo-create]').forEach(btn=>btn.onclick=openCreatePreview);
  scope.querySelectorAll('[data-nexo-import]').forEach(btn=>btn.onclick=openImport);
}

function enhanceRoot(){
  const root=view.querySelector('[data-taxonomy-view="root"]');
  if(!root||root.dataset.nexoWorkspaceEnhanced==='1')return;
  root.dataset.nexoWorkspaceEnhanced='1';
  const intro=root.querySelector('.taxonomyIntro');
  const grid=root.querySelector('.taxonomyGrid');
  if(!grid)return;
  root.__nexoCollectionGrid=grid;
  grid.remove();
  if(intro)intro.remove();

  const header=document.createElement('div');
  header.className='nexoWorkspaceLibraryHead';
  header.innerHTML='<div><div class="nexoWorkspaceEyebrow">'+esc(context().workspaceName||tr('Mi espacio','My space'))+'</div><h1>'+esc(tr('Fichas Técnicas Dinámicas','Dynamic Technical Sheets'))+'</h1><p>'+esc(tr('Trabaja con el motor completo de platos, preparaciones y productos.','Use the full dishes, preparations and products engine.'))+'</p></div>'+actionButtons();

  const nav=document.createElement('div');
  nav.className='nexoWorkspaceTabs';
  nav.innerHTML='<button type="button" data-nexo-tab="collections">'+esc(tr('Colecciones','Collections'))+'</button><button type="button" data-nexo-tab="sheets">'+esc(tr('Fichas técnicas','Technical sheets'))+'</button>';

  const body=document.createElement('div');
  body.className='nexoWorkspaceLibraryBody';
  body.dataset.nexoWorkspaceBody='1';

  root.prepend(header,nav,body);
  root.querySelectorAll('[data-nexo-tab]').forEach(btn=>btn.onclick=()=>{activeTab=btn.dataset.nexoTab;renderBody(root)});
  bindActions(header);
  renderBody(root);
}

function closeLayer(){
  document.getElementById('nexoWorkspaceLibraryLayer')?.remove();
  importOpen=false;
}

function layer(title,body){
  closeLayer();
  const el=document.createElement('div');
  el.id='nexoWorkspaceLibraryLayer';
  el.innerHTML='<div class="nexoWorkspaceModal"><div class="nexoWorkspaceModalHead"><strong>'+esc(title)+'</strong><button type="button" data-nexo-layer-close>×</button></div><div class="nexoWorkspaceModalBody">'+body+'</div></div>';
  document.body.appendChild(el);
  el.querySelector('[data-nexo-layer-close]').onclick=closeLayer;
  el.onclick=e=>{if(e.target===el)closeLayer()};
  return el;
}

function openCreatePreview(){
  layer(tr('Crear ficha técnica','Create technical sheet'),'<div class="nexoWorkspacePreview"><div class="nexoWorkspaceEmptyIcon">＋</div><h3>'+esc(tr('Creador de fichas en preparación','Technical sheet creator is being prepared'))+'</h3><p>'+esc(tr('Este botón utilizará el mismo motor dinámico para crear platos, preparaciones, productos, componentes, MOP, batches, traducciones y demás estructura. Por ahora queda como prevista.','This button will use the same dynamic engine to create dishes, preparations, products, components, MOP, batches, translations and the rest of the structure. For now it is a preview.'))+'</p></div>');
}

function openImport(){
  if(!canImport())return;
  importOpen=true;
  const el=layer(tr('Importar fichas técnicas','Import technical sheets'),'<p class="nexoWorkspaceModalCopy">'+esc(tr('Ingresa el código entregado por Nexo Group. El paquete se incorporará directamente a este Workspace usando el motor completo de Fichas Técnicas Dinámicas.','Enter the code provided by Nexo Group. The package will be added directly to this Workspace using the full Dynamic Technical Sheets engine.'))+'</p><input data-nexo-import-code class="search nexoWorkspaceCode" placeholder="NEXO-…" autocomplete="off" autocapitalize="characters"><div class="nexoWorkspaceProgress" data-nexo-import-progress></div><button type="button" class="nexoWorkspaceBtn primary wide" data-nexo-import-submit>'+esc(tr('Importar al Workspace','Import to Workspace'))+'</button>');
  const input=el.querySelector('[data-nexo-import-code]');
  const button=el.querySelector('[data-nexo-import-submit]');
  input?.focus();
  button.onclick=()=>{
    const code=String(input?.value||'').trim();
    if(!code)return;
    button.disabled=true;
    button.textContent=tr('Importando…','Importing…');
    const progress=el.querySelector('[data-nexo-import-progress]');
    if(progress)progress.textContent=tr('Preparando paquete…','Preparing package…');
    parent.postMessage({type:'NEXO_DM_IMPORT_CODE',payload:{code}},'*');
  };
}

function progress(payload){
  if(!importOpen)return;
  const el=document.querySelector('[data-nexo-import-progress]');
  if(!el)return;
  const done=Number(payload?.processedCount||0),total=Number(payload?.totalCount||0);
  el.textContent=total?tr('Importando '+done+' de '+total+' fichas…','Importing '+done+' of '+total+' sheets…'):tr('Importando paquete…','Importing package…');
}

function importDone(payload){
  if(!importOpen)return;
  const el=document.querySelector('[data-nexo-import-progress]');
  if(el)el.textContent=tr('✓ Importación completada. Actualizando biblioteca…','✓ Import complete. Refreshing library…');
  setTimeout(()=>{closeLayer();activeTab='collections'},700);
}

function importError(payload){
  if(!importOpen)return;
  const el=document.querySelector('[data-nexo-import-progress]');
  if(el)el.textContent=payload?.message||tr('No se pudo completar la importación.','Import could not be completed.');
  const button=document.querySelector('[data-nexo-import-submit]');
  if(button){button.disabled=false;button.textContent=tr('Continuar importación','Continue import')}
}

window.addEventListener('NEXO_TAXONOMY_RENDERED',e=>{
  if(e.detail?.mode==='root')queueMicrotask(enhanceRoot);
});

window.addEventListener('NEXO_NATIVE_RENDERED',e=>{
  if(e.detail?.kind==='home')setTimeout(enhanceRoot,0);
});

window.addEventListener('message',e=>{
  let m=e.data;
  if(typeof m==='string')try{m=JSON.parse(m)}catch{return}
  if(!m?.type)return;
  if(m.type==='NEXO_DM_IMPORT_PROGRESS')progress(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_DONE')importDone(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_ERROR')importError(m.payload||{});
  if(m.type==='MENU_DATA_LOADED')setTimeout(enhanceRoot,0);
});

setTimeout(enhanceRoot,0);
})();