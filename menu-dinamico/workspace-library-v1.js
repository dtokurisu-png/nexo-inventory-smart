(()=>{'use strict';
if(window.__NEXO_WORKSPACE_LIBRARY_V1__)return;window.__NEXO_WORKSPACE_LIBRARY_V1__=true;
if(!window.__NEXO_WORKSPACE_MODE__)return;

const view=document.getElementById('view');
const modalRoot=document.getElementById('modal');
if(!view||!modalRoot)return;

let activeTab='collections';
let activeCollectionId='';
const pendingCollectionRequests=new Map();

const data=()=>window.__NEXO_DM_DATA__||{recipes:[],ingredients:[],collections:[],collectionItems:[],context:{},capabilities:{}};
const lang=()=>document.documentElement.lang==='en'?'en':'es';
const tr=(es,en)=>lang()==='en'?en:es;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(o,enKey,esKey)=>lang()==='en'?(o?.[enKey]||o?.[esKey]||''):(o?.[esKey]||o?.[enKey]||'');
const img=x=>typeof x==='string'?x:(x&&(x.url||x.image?.url||x.src)||'');
const ICON_BASE='../assets/icons/nexo/';
const icon=name=>'<img class="nexoWorkspaceIcon" src="'+esc(ICON_BASE+encodeURIComponent(String(name||''))+'.png')+'" alt="" loading="lazy" decoding="async">';

function capabilities(){return data().capabilities||{}}
function context(){return data().context||{}}
function canImport(){return context().type==='workspace'&&capabilities().canShare===true}
function canCreate(){return capabilities().canEdit===true}
function activeRecipes(){return(data().recipes||[]).filter(x=>x&&x.active!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0))}
function activeProducts(){return(data().ingredients||[]).filter(x=>x&&x.active!==false)}
function activeProcesses(){return(data().processes||[]).filter(x=>x&&x.active!==false).sort((a,b)=>String(text(a,'nameEn','nameEs')||a?._id||'').localeCompare(String(text(b,'nameEn','nameEs')||b?._id||'')))}
function activePreparationSheets(){return activeRecipes().filter(x=>String(x.recipeType||'').toUpperCase()!=='DISH')}
function activeCollections(){
  return (data().collections||[])
    .filter(row=>row&&row.active!==false)
    .sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0)||String(a.name||'').localeCompare(String(b.name||''),'es'))
}
function collectionById(id){return activeCollections().find(row=>String(row.id||row._id)===String(id))||null}
function collectionId(row){return String(row?.id||row?._id||'')}
function collectionName(row){return String(row?.name||row?.title||tr('Colección','Collection'))}
function collectionDescription(row){return String(row?.description||'')}
function activeCollectionItems(){
  const rows=data().collectionItems||data().technicalSheetCollectionItems||data().collectionMemberships||[];
  return (Array.isArray(rows)?rows:[]).filter(row=>row&&row.active!==false)
}
function collectionMembers(id){
  const links=activeCollectionItems().filter(row=>String(row.collectionId||'')===String(id));
  if(links.length){
    const recipeIds=new Set(links.filter(row=>String(row.sourceCollection||'DMRecipes')==='DMRecipes').map(row=>String(row.technicalSheetId||'')));
    const supplyIds=new Set(links.filter(row=>String(row.sourceCollection||'')==='DMIngredients').map(row=>String(row.technicalSheetId||'')));
    return {
      recipes:activeRecipes().filter(row=>recipeIds.has(String(row._id))),
      supplies:activeProducts().filter(row=>supplyIds.has(String(row._id)))
    }
  }
  return {
    recipes:activeRecipes().filter(row=>String(row.collectionId||'')===String(id)),
    supplies:activeProducts().filter(row=>String(row.collectionId||'')===String(id))
  }
}
function recipesForCollection(id){return collectionMembers(id).recipes}
function suppliesForCollection(id){return collectionMembers(id).supplies}
function collectionItemCount(id){const members=collectionMembers(id);return members.recipes.length+members.supplies.length}
function hasContent(){return activeCollections().length>0||activeRecipes().length>0||activeProducts().length>0}
function searchNorm(v){try{return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}catch(_){return String(v??'').toLowerCase().trim()}}
function sheetSearchCorpus(recipe){
  const d=data(),vals=[recipe?.titleEn,recipe?.titleEs,recipe?.category,recipe?.recipeType,recipe?.notesEn,recipe?.notesEs];
  const sections=(d.sections||[]).filter(s=>s&&s.recipeId===recipe?._id);
  const sectionIds=new Set(sections.map(s=>s._id));
  sections.forEach(s=>vals.push(s.titleEn,s.titleEs));
  (d.components||[]).filter(c=>c&&(c.recipeId===recipe?._id||sectionIds.has(c.sectionId))).forEach(comp=>{
    vals.push(comp.displayEn,comp.displayEs,comp.noteEn,comp.noteEs);
    if(comp.targetIngredientId){
      const ing=(d.ingredients||[]).find(x=>x&&x._id===comp.targetIngredientId);
      if(ing)vals.push(ing.nameEn,ing.nameEs)
    }
    if(comp.targetPreparationId){
      const prep=(d.preparations||[]).find(x=>x&&x._id===comp.targetPreparationId);
      if(prep)vals.push(prep.nameEn,prep.nameEs)
    }
    if(comp.targetRecipeId){
      const sub=(d.recipes||[]).find(x=>x&&x._id===comp.targetRecipeId);
      if(sub)vals.push(sub.titleEn,sub.titleEs)
    }
  });
  return searchNorm(vals.filter(Boolean).join(' '))
}
function sheetMatches(recipe,query){
  const tokens=searchNorm(query).split(' ').filter(Boolean);
  if(!tokens.length)return true;
  const corpus=sheetSearchCorpus(recipe);
  return tokens.every(token=>corpus.includes(token))
}
function supplySearchCorpus(supply){
  const d=data(),vals=[supply?.nameEn,supply?.nameEs,supply?.descriptionEn,supply?.descriptionEs,supply?.supplyMode];
  (d.supplyProcesses||[]).filter(row=>String(row?.supplyId||'')===String(supply?._id||'')).forEach(relation=>{
    const process=(d.processes||[]).find(row=>String(row?._id||'')===String(relation?.processId||''));
    if(process)vals.push(process.nameEn,process.nameEs,process.descriptionEn,process.descriptionEs)
  });
  return searchNorm(vals.filter(Boolean).join(' '))
}
function supplyMatches(supply,query){
  const tokens=searchNorm(query).split(' ').filter(Boolean);
  if(!tokens.length)return true;
  const corpus=supplySearchCorpus(supply);
  return tokens.every(token=>corpus.includes(token))
}

function requestCollectionCreate(input){
  const requestId='collection_create_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{
      pendingCollectionRequests.delete(requestId);
      reject(new Error(tr('La creación de la colección tardó demasiado.','Collection creation timed out.')))
    },30000);
    pendingCollectionRequests.set(requestId,{resolve,reject,timer});
    parent.postMessage({type:'NEXO_DM_CREATE_COLLECTION',payload:{requestId,input}},'*')
  })
}

function sheetCard(r){
  const dish=String(r.recipeType||'').toUpperCase()==='DISH';
  const u=img(r.heroImage);
  const title=text(r,'titleEn','titleEs')||'—';
  return '<button class="card recipeCard '+(dish?'cardDish':'cardPrep')+' nexoWorkspaceSheet" data-workspace-sheet="'+esc(r._id)+'">'+
    '<div class="thumb">'+(u?'<img src="'+esc(u)+'" alt="'+esc(title)+'">':'<span class="muted">'+esc(tr('Sin foto','No photo'))+'</span>')+'</div>'+
    '<div class="meta"><span class="tag '+(dish?'tagDish':'tagPrep')+'">'+esc(dish?tr('Plato','Dish'):tr('Preparación','Preparation'))+'</span><h3>'+esc(title)+'</h3><span class="muted">'+esc(r.category||'')+'</span></div></button>';
}
function supplyCard(supply){
  const photos=Array.isArray(supply?.images)?supply.images.filter(Boolean):[];
  const u=img(supply?.baseImage||photos[0]);
  const title=text(supply,'nameEn','nameEs')||'—';
  const mode=String(supply?.supplyMode||'').toUpperCase();
  const meta=mode==='PROCESSABLE'?tr('Procesable','Processable'):mode==='CONSUMABLE'?tr('Consumible','Consumable'):tr('Insumo base','Base supply');
  return '<button class="card recipeCard cardProduct nexoWorkspaceSupply" data-workspace-supply="'+esc(supply._id)+'">'+
    '<div class="thumb">'+(u?'<img src="'+esc(u)+'" alt="'+esc(title)+'">':'<span class="muted">'+esc(tr('Sin foto','No photo'))+'</span>')+'</div>'+
    '<div class="meta"><span class="tag tagProduct">'+esc(tr('Insumo','Supply'))+'</span><h3>'+esc(title)+'</h3><span class="muted">'+esc(meta)+'</span></div></button>';
}
function bindTechnicalCards(scope){
  scope.querySelectorAll('[data-workspace-sheet]').forEach(card=>card.onclick=()=>window.NEXO_MENU_API?.openRecipe?.(card.dataset.workspaceSheet));
  scope.querySelectorAll('[data-workspace-supply]').forEach(card=>card.onclick=()=>window.NEXO_MENU_API?.openIngredient?.(card.dataset.workspaceSupply))
}

function actionButtons(){
  return '<div class="nexoWorkspaceActions">'+
    (canCreate()?'<button type="button" class="nexoWorkspaceBtn" data-nexo-create>'+icon('nuevo')+'<span>'+esc(tr('Crear ficha','Create sheet'))+'</span></button>':'')+
    (canImport()?'<button type="button" class="nexoWorkspaceBtn primary" data-nexo-import>'+icon('sincronizar')+'<span>'+esc(tr('Importar fichas','Import sheets'))+'</span></button>':'')+
    '</div>';
}

function emptyState(){
  return '<div class="nexoWorkspaceEmpty"><div class="nexoWorkspaceEmptyIcon">'+icon('ficha-tecnica')+'</div><h2>'+esc(tr('Este Workspace todavía no tiene fichas técnicas','This Workspace has no technical sheets yet'))+'</h2><p>'+esc(tr('Puedes crear una ficha desde cero o importar un paquete preparado por Nexo Group.','Create a sheet from scratch or import a package prepared by Nexo Group.'))+'</p>'+actionButtons()+'</div>';
}

function renderSheets(root){
  const body=root.querySelector('[data-nexo-workspace-body]');
  if(!body)return;
  const recipes=activeRecipes();
  const supplies=activeProducts().slice().sort((a,b)=>String(text(a,'nameEn','nameEs')||'').localeCompare(String(text(b,'nameEn','nameEs')||''),'es'));
  const total=recipes.length+supplies.length;
  if(!total){
    body.innerHTML=emptyState();
    bindActions(body);
    return;
  }
  body.innerHTML='<div class="nexoWorkspaceSheetTools"><label class="nexoWorkspaceSearch">'+icon('busqueda')+'<input class="search" data-nexo-sheet-search inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="'+esc(tr('Buscar plato, preparación o insumo…','Search dish, preparation, or supply…'))+'"></label><span data-nexo-search-count class="muted" style="font-size:11px"></span></div><div class="grid" data-nexo-sheet-grid>'+recipes.map(sheetCard).join('')+supplies.map(supplyCard).join('')+'</div>';
  bindTechnicalCards(body);
  const search=body.querySelector('[data-nexo-sheet-search]');
  const count=body.querySelector('[data-nexo-search-count]');
  const applySearch=()=>{
    const q=String(search?.value||'');
    let visible=0;
    body.querySelectorAll('[data-workspace-sheet]').forEach(card=>{
      const recipe=recipes.find(r=>String(r._id)===String(card.dataset.workspaceSheet));
      const show=recipe?sheetMatches(recipe,q):false;
      card.hidden=!show;
      card.style.display=show?'':'none';
      if(show)visible++
    });
    body.querySelectorAll('[data-workspace-supply]').forEach(card=>{
      const supply=supplies.find(row=>String(row._id)===String(card.dataset.workspaceSupply));
      const show=supply?supplyMatches(supply,q):false;
      card.hidden=!show;
      card.style.display=show?'':'none';
      if(show)visible++
    });
    if(count)count.textContent=q.trim()?visible+' / '+total:''
  };
  if(search){
    ['input','keyup','change','search','compositionend'].forEach(type=>search.addEventListener(type,applySearch));
    search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applySearch();search.blur()}});
  }
}

function collectionCard(row){
  const id=collectionId(row);
  const count=collectionItemCount(id);
  const description=collectionDescription(row);
  return '<button type="button" class="nexoCollectionCard" data-nexo-collection="'+esc(id)+'">'+
    '<div class="nexoCollectionCardIcon">'+icon('coleccion')+'</div>'+
    '<div class="nexoCollectionCardBody">'+
      '<div class="nexoCollectionCardMeta"><span>'+esc(tr('Colección','Collection'))+'</span><strong>'+count+'</strong></div>'+
      '<h3>'+esc(collectionName(row))+'</h3>'+
      '<p>'+esc(description||tr('Colección de fichas técnicas.','Technical sheet collection.'))+'</p>'+
      '<small>'+esc(count===1?tr('1 ficha técnica','1 technical sheet'):count+' '+tr('fichas técnicas','technical sheets'))+'</small>'+
    '</div>'+
  '</button>'
}

function closeCollectionCreate(){
  document.getElementById('nexoCollectionCreateLayer')?.remove()
}
function openCollectionCreate(root){
  if(!canCreate())return;
  closeCollectionCreate();
  const layer=document.createElement('div');
  layer.id='nexoCollectionCreateLayer';
  layer.innerHTML=
    '<div class="nexoCollectionCreateDialog" role="dialog" aria-modal="true" aria-label="'+esc(tr('Nueva colección','New collection'))+'">'+
      '<header><div><span>'+esc(tr('Colecciones','Collections'))+'</span><strong>'+esc(tr('Nueva colección','New collection'))+'</strong></div><button type="button" data-collection-create-close>×</button></header>'+
      '<form data-collection-create-form>'+
        '<label><span>'+esc(tr('Nombre','Name'))+'</span><input data-collection-create-name maxlength="120" autocomplete="off" placeholder="'+esc(tr('Ej. Menú de temporada','E.g. Seasonal menu'))+'"></label>'+
        '<label><span>'+esc(tr('Descripción opcional','Optional description'))+'</span><textarea data-collection-create-description maxlength="1000" rows="4" placeholder="'+esc(tr('Describe qué fichas agrupará esta colección.','Describe what this collection will contain.'))+'"></textarea></label>'+
        '<div class="nexoCollectionCreateStatus" data-collection-create-status aria-live="polite"></div>'+
        '<div class="nexoCollectionCreateActions"><button type="button" class="nexoWorkspaceBtn" data-collection-create-cancel>'+esc(tr('Cancelar','Cancel'))+'</button><button type="submit" class="nexoWorkspaceBtn primary">'+esc(tr('Crear colección','Create collection'))+'</button></div>'+
      '</form>'+
    '</div>';
  document.body.appendChild(layer);
  const form=layer.querySelector('[data-collection-create-form]');
  const nameInput=layer.querySelector('[data-collection-create-name]');
  const status=layer.querySelector('[data-collection-create-status]');
  const close=()=>closeCollectionCreate();
  layer.querySelector('[data-collection-create-close]').onclick=close;
  layer.querySelector('[data-collection-create-cancel]').onclick=close;
  layer.addEventListener('mousedown',e=>{if(e.target===layer)close()});
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const name=String(nameInput.value||'').trim();
    const description=String(layer.querySelector('[data-collection-create-description]')?.value||'').trim();
    if(!name){
      status.textContent=tr('Escribe el nombre de la colección.','Enter the collection name.');
      nameInput.focus();
      return
    }
    const submit=form.querySelector('[type="submit"]');
    submit.disabled=true;
    status.textContent=tr('Creando colección…','Creating collection…');
    try{
      const result=await requestCollectionCreate({name,description});
      const created=result?.collection||result;
      if(!created?.id)throw new Error(tr('No se recibió la colección creada.','The created collection was not returned.'));
      const rows=data().collections||(data().collections=[]);
      if(!rows.some(row=>String(row?.id||row?._id)===String(created.id)))rows.push({...created,active:created.active!==false});
      close();
      activeCollectionId=String(created.id);
      renderCollections(root)
    }catch(error){
      submit.disabled=false;
      status.textContent=String(error?.message||error||tr('No se pudo crear la colección.','Could not create collection.'))
    }
  });
  queueMicrotask(()=>nameInput.focus())
}

function renderCollectionDetail(root,collection){
  const body=root.querySelector('[data-nexo-workspace-body]');
  if(!body)return;
  const id=collectionId(collection);
  const members=collectionMembers(id);
  const recipes=members.recipes;
  const supplies=members.supplies;
  const total=recipes.length+supplies.length;
  body.innerHTML=
    '<div class="nexoCollectionDetailHead">'+
      '<button type="button" class="nexoWorkspaceBtn nexoCollectionBack" data-collection-back>← '+esc(tr('Colecciones','Collections'))+'</button>'+
      '<div><span>'+esc(tr('Colección','Collection'))+'</span><h2>'+esc(collectionName(collection))+'</h2><p>'+esc(collectionDescription(collection)||tr('Colección de fichas técnicas.','Technical sheet collection.'))+'</p></div>'+
      (canCreate()?'<button type="button" class="nexoWorkspaceBtn" data-nexo-create>'+icon('nuevo')+'<span>'+esc(tr('Crear ficha','Create sheet'))+'</span></button>':'')+
    '</div>'+
    (total
      ? '<div class="nexoWorkspaceSheetTools"><label class="nexoWorkspaceSearch">'+icon('busqueda')+'<input class="search" data-collection-sheet-search inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="'+esc(tr('Buscar dentro de la colección…','Search within collection…'))+'"></label><span data-collection-search-count class="muted" style="font-size:11px"></span></div><div class="grid" data-collection-sheet-grid>'+recipes.map(sheetCard).join('')+supplies.map(supplyCard).join('')+'</div>'
      : '<div class="nexoCollectionEmpty">'+icon('ficha-tecnica')+'<strong>'+esc(tr('Esta colección todavía no tiene fichas','This collection has no sheets yet'))+'</strong><span>'+esc(tr('Crea una ficha para comenzar a organizar esta colección.','Create a sheet to start organizing this collection.'))+'</span></div>');
  body.querySelector('[data-collection-back]').onclick=()=>{activeCollectionId='';renderCollections(root)};
  bindTechnicalCards(body);
  bindActions(body);
  const search=body.querySelector('[data-collection-sheet-search]');
  const count=body.querySelector('[data-collection-search-count]');
  if(search)search.addEventListener('input',()=>{
    const q=String(search.value||'');
    let visible=0;
    body.querySelectorAll('[data-workspace-sheet]').forEach(card=>{
      const recipe=recipes.find(row=>String(row._id)===String(card.dataset.workspaceSheet));
      const show=recipe?sheetMatches(recipe,q):false;
      card.hidden=!show;
      card.style.display=show?'':'none';
      if(show)visible++
    });
    body.querySelectorAll('[data-workspace-supply]').forEach(card=>{
      const supply=supplies.find(row=>String(row._id)===String(card.dataset.workspaceSupply));
      const show=supply?supplyMatches(supply,q):false;
      card.hidden=!show;
      card.style.display=show?'':'none';
      if(show)visible++
    });
    if(count)count.textContent=q.trim()?visible+' / '+total:''
  })
}

function renderCollections(root){
  const body=root.querySelector('[data-nexo-workspace-body]');
  if(!body)return;
  const rows=activeCollections();
  if(activeCollectionId){
    const selected=collectionById(activeCollectionId);
    if(selected){renderCollectionDetail(root,selected);return}
    activeCollectionId=''
  }
  body.innerHTML=
    '<div class="nexoCollectionsToolbar"><div><span>'+esc(tr('Biblioteca','Library'))+'</span><h2>'+esc(tr('Colecciones','Collections'))+'</h2><p>'+esc(tr('Agrupa fichas técnicas sin duplicarlas.','Group technical sheets without duplicating them.'))+'</p></div>'+
      (canCreate()?'<button type="button" class="nexoWorkspaceBtn primary" data-create-collection>'+icon('nuevo')+'<span>'+esc(tr('Nueva colección','New collection'))+'</span></button>':'')+
    '</div>'+
    (rows.length
      ? '<div class="nexoCollectionsGrid">'+rows.map(collectionCard).join('')+'</div>'
      : '<div class="nexoCollectionEmpty">'+icon('coleccion')+'<strong>'+esc(tr('Todavía no hay colecciones','No collections yet'))+'</strong><span>'+esc(tr('Crea una colección para organizar las fichas de este Workspace.','Create a collection to organize this Workspace\'s sheets.'))+'</span></div>');
  body.querySelector('[data-create-collection]')?.addEventListener('click',()=>openCollectionCreate(root));
  body.querySelectorAll('[data-nexo-collection]').forEach(card=>card.onclick=()=>{
    activeCollectionId=String(card.dataset.nexoCollection||'');
    renderCollections(root)
  })
}

function renderBody(root){
  root.querySelectorAll('[data-nexo-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.nexoTab===activeTab));
  if(activeTab==='sheets')renderSheets(root);else renderCollections(root);
}

function bindActions(scope){
  scope.querySelectorAll('[data-nexo-create]').forEach(btn=>btn.onclick=openCreateFlow);
  scope.querySelectorAll('[data-nexo-import]').forEach(btn=>btn.onclick=openImport);
}

function enhanceRoot(){
  const root=view.querySelector('[data-taxonomy-view="root"]');
  if(!root||root.dataset.nexoWorkspaceEnhanced==='1')return;
  root.dataset.nexoWorkspaceEnhanced='1';
  const intro=root.querySelector('.taxonomyIntro');
  const grid=root.querySelector('.taxonomyGrid');
  if(grid)grid.remove();
  if(intro)intro.remove();

  const header=document.createElement('div');
  header.className='nexoWorkspaceLibraryHead';
  header.innerHTML='<div><div class="nexoWorkspaceEyebrow">'+esc(context().workspaceName||tr('Mi espacio','My space'))+'</div><h1>'+esc(tr('Fichas Técnicas Dinámicas','Dynamic Technical Sheets'))+'</h1><p>'+esc(tr('Trabaja con el motor completo de platos, preparaciones y productos.','Use the full dishes, preparations and products engine.'))+'</p></div>'+actionButtons();

  const nav=document.createElement('div');
  nav.className='nexoWorkspaceTabs';
  nav.innerHTML='<button type="button" data-nexo-tab="collections">'+icon('coleccion')+'<span>'+esc(tr('Colecciones','Collections'))+'</span></button><button type="button" data-nexo-tab="sheets">'+icon('ficha-tecnica')+'<span>'+esc(tr('Fichas técnicas','Technical sheets'))+'</span></button>';

  const body=document.createElement('div');
  body.className='nexoWorkspaceLibraryBody';
  body.dataset.nexoWorkspaceBody='1';

  root.prepend(header,nav,body);
  root.querySelectorAll('[data-nexo-tab]').forEach(btn=>btn.onclick=()=>{activeTab=btn.dataset.nexoTab;if(activeTab!=='collections')activeCollectionId='';renderBody(root)});
  bindActions(header);
  renderBody(root);
}

const sheetEditorStack=[];
let activeSheetEditor=null;
const SHEET_EDITOR_Z_BASE=2147483620;

function sheetEditorTop(){
  return sheetEditorStack[sheetEditorStack.length-1]||null
}
function syncSheetEditorStack(){
  const top=sheetEditorTop();
  sheetEditorStack.forEach((entry,index)=>{
    const active=entry===top;
    const layer=entry.layer;
    if(!layer)return;
    layer.dataset.sheetDepth=String(index);
    layer.dataset.sheetInactive=active?'false':'true';
    layer.style.zIndex=String(SHEET_EDITOR_Z_BASE+Math.min(index,20));
    layer.setAttribute('aria-hidden',active?'false':'true');
    try{layer.inert=!active}catch(_){}
    if(!active){
      layer.querySelectorAll('[data-mop-caret-plus],[data-mop-picker],.nexoSheetUnitPicker').forEach(node=>{node.hidden=true});
      layer.querySelectorAll('[data-composition-menu]').forEach(node=>{node.hidden=true})
    }
  });
  activeSheetEditor=top
}
function sheetEditorParent(state){
  if(!state?.parentId)return null;
  return sheetEditorStack.find(entry=>entry.id===state.parentId)||null
}
function sheetEditorDispose(state){
  if(!state)return;
  for(const cleanup of state.cleanups||[]){
    try{cleanup()}catch(_){}
  }
  state.cleanups=[];
  if(state.photoUrl){
    try{URL.revokeObjectURL(state.photoUrl)}catch(_){}
    state.photoUrl=''
  }
  for(const photo of state.supplyPhotos||[]){
    if(photo?.url)try{URL.revokeObjectURL(photo.url)}catch(_){}
  }
  state.supplyPhotos=[];
  for(const relation of state.supplyProcesses||[]){
    if(relation?.imageUrl)try{URL.revokeObjectURL(relation.imageUrl)}catch(_){}
  }
  try{state.layer?.remove()}catch(_){}
}
function sheetEditorClose(target=activeSheetEditor,reason='cancel'){
  const current=sheetEditorTop();
  if(!target||target!==current)return false;
  const parent=sheetEditorParent(target);
  const resumeFocus=parent?.resumeFocus||null;
  sheetEditorStack.pop();
  sheetEditorDispose(target);
  syncSheetEditorStack();
  if(typeof target.onClose==='function'){
    try{target.onClose({reason,parentState:parent||null,childState:target})}catch(_){}
  }
  if(parent){
    parent.resumeFocus=null;
    queueMicrotask(()=>{
      if(resumeFocus?.isConnected){
        try{resumeFocus.focus({preventScroll:true})}catch(_){try{resumeFocus.focus()}catch(__){}}
      }
    })
  }
  return true
}
function sheetEditorComplete(target=activeSheetEditor,payload=null){
  const current=sheetEditorTop();
  if(!target||target!==current)return false;
  const parent=sheetEditorParent(target);
  const onComplete=target.onComplete;
  const closed=sheetEditorClose(target,'complete');
  if(closed&&typeof onComplete==='function'){
    try{onComplete(payload,{parentState:parent||null,childState:target})}catch(_){}
  }
  return closed
}
function openNestedSheetEditor(kind,options={}){
  const parent=sheetEditorTop();
  if(!parent)return null;
  parent.resumeFocus=parent.layer?.contains(document.activeElement)?document.activeElement:null;
  return sheetEditorTemplate({
    ...options,
    kind:String(kind||'technical-sheet'),
    parentState:parent
  })
}
const SUPPLY_PHOTO_LIMIT=3;
const SHEET_UNIT_CATALOG=[
  ['G','Gramo','Gram'],['KG','Kilogramo','Kilogram'],['MG','Miligramo','Milligram'],
  ['OZ','Onza','Ounce'],['LB','Libra','Pound'],
  ['ML','Mililitro','Milliliter'],['L','Litro','Liter'],['CL','Centilitro','Centiliter'],
  ['EA','Each / pieza','Each'],['U','Unidad','Unit'],['PC','Pieza','Piece'],['BU','Manojo','Bunch'],
  ['TSP','Cucharadita','Teaspoon'],['TBSP','Cucharada sopera','Tablespoon'],
  ['CC','Cucharadita','Teaspoon'],['CP','Cucharada de postre','Dessert spoon'],['CS','Cucharada sopera','Tablespoon'],
  ['CUP','Taza','Cup'],['QT','Cuarto de galón','Quart'],['GAL','Galón','Gallon'],
  ['TT','Al gusto','To taste'],['AN','Según necesidad','As needed'],['CN','Cantidad necesaria','Quantity as needed']
];
const sheetUnitLabel=code=>{
  const row=SHEET_UNIT_CATALOG.find(item=>item[0]===String(code||'').toUpperCase());
  if(!row)return String(code||'');
  return row[0]+' — '+(lang()==='en'?row[2]:row[1])
};

function sheetEditorId(prefix='draft'){
  return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8)
}
function ingredientName(row){
  return text(row,'nameEn','nameEs')||row?.name||tr('Ingrediente','Ingredient')
}
function preparationSheetName(row){
  return text(row,'titleEn','titleEs')||row?.title||tr('Preparación','Preparation')
}
function sheetEditorShell(options={}){
  const el=document.createElement('div');
  const layerId=String(options.layerId||sheetEditorId('sheet-layer'));
  el.id=layerId;
  el.className='nexoSingleSheetEditorLayer';
  el.dataset.sheetKind=String(options.kind||'technical-sheet');
  const ariaLabel=options.ariaLabel||tr('Crear ficha técnica','Create technical sheet');
  const eyebrow=options.eyebrow||tr('Nueva ficha técnica','New technical sheet');
  const heading=options.heading||tr('Crear ficha','Create sheet');
  const photoLabel=options.photoLabel||tr('Foto del producto','Product photo');
  const titlePlaceholder=options.titlePlaceholder||tr('Nombre del producto o preparación','Product or preparation name');
  const descriptionPlaceholder=options.descriptionPlaceholder||tr('Describe brevemente esta ficha.','Briefly describe this sheet.');
  const allowPreparationComponent=String(options.kind||'')!=='preparation';
  el.innerHTML=
    '<div class="nexoSheetEditorFrame" role="dialog" aria-modal="true" aria-label="'+esc(ariaLabel)+'">'+
      '<header class="nexoSheetEditorHead">'+
        '<div><span>'+esc(eyebrow)+'</span><strong>'+esc(heading)+'</strong></div>'+
        '<button type="button" data-sheet-editor-close aria-label="'+esc(tr('Cerrar','Close'))+'">'+icon('cerrar')+'</button>'+
      '</header>'+
      '<main class="nexoSheetEditorCanvas">'+
        '<section class="nexoSheetEditorHero">'+
          '<div class="nexoSheetEditorPhoto" data-sheet-photo-preview>'+
            '<div>'+icon('ficha-tecnica')+'<span>'+esc(photoLabel)+'</span></div>'+
          '</div>'+
          '<div class="nexoSheetEditorIdentity">'+
            '<label><span>'+esc(tr('Nombre','Name'))+'</span><input data-sheet-title maxlength="160" autocomplete="off" placeholder="'+esc(titlePlaceholder)+'"></label>'+
            '<label><span>'+esc(tr('Descripción breve','Short description'))+'</span><textarea data-sheet-description maxlength="800" rows="3" placeholder="'+esc(descriptionPlaceholder)+'"></textarea></label>'+
            '<div class="nexoSheetEditorPhotoActions">'+
              '<button type="button" class="nexoWorkspaceBtn" data-sheet-photo-choose>'+icon('nuevo')+'<span>'+esc(tr('Agregar foto','Add photo'))+'</span></button>'+
              '<button type="button" class="nexoWorkspaceBtn" data-sheet-photo-remove hidden>'+esc(tr('Quitar foto','Remove photo'))+'</button>'+
              '<input type="file" accept="image/jpeg,image/png,image/webp" '+(String(options.kind||'')==='supply'?'multiple ':'')+'data-sheet-photo-input hidden>'+
            '</div>'+
            '<div class="nexoSupplyPhotoGallery" data-supply-photo-gallery hidden></div>'+
          '</div>'+
        '</section>'+
        '<section class="nexoSheetEditorSection nexoSupplyEditorSection" data-sheet-supply-section hidden>'+
          '<div class="nexoSheetEditorSectionHead">'+
            '<div><span>'+esc(tr('Presentación','Presentation'))+'</span><h2>'+esc(tr('Uso del insumo','Supply usage'))+'</h2></div>'+
          '</div>'+
          '<div class="nexoSupplyPresentationGrid">'+
            '<label><span>'+esc(tr('Cantidad opcional','Optional quantity'))+'</span><input data-supply-quantity inputmode="decimal" autocomplete="off" placeholder="'+esc(tr('Ej. 1000','e.g. 1000'))+'"></label>'+
            '<label><span>'+esc(tr('Unidad opcional','Optional unit'))+'</span><select data-supply-unit><option value="">'+esc(tr('Sin unidad','No unit'))+'</option>'+SHEET_UNIT_CATALOG.map(row=>'<option value="'+esc(row[0])+'">'+esc(row[0]+' — '+(lang()==='en'?row[2]:row[1]))+'</option>').join('')+'</select></label>'+
          '</div>'+
          '<div class="nexoSupplyModeBlock">'+
            '<span class="nexoSupplyFieldLabel">'+esc(tr('Tipo de insumo','Supply type'))+'</span>'+
            '<div class="nexoSupplyModeGroup" role="radiogroup" aria-label="'+esc(tr('Tipo de insumo','Supply type'))+'">'+
              '<button type="button" data-supply-mode="CONSUMABLE" aria-pressed="true"><strong>'+esc(tr('Consumible','Consumable'))+'</strong><span>'+esc(tr('Se utiliza tal como está.','Used as-is.'))+'</span></button>'+
              '<button type="button" data-supply-mode="PROCESSABLE" aria-pressed="false"><strong>'+esc(tr('Procesable','Processable'))+'</strong><span>'+esc(tr('Puede tener una o varias formas de proceso.','Can have one or more processing forms.'))+'</span></button>'+
            '</div>'+
          '</div>'+
        '</section>'+
        '<section class="nexoSheetEditorSection nexoSupplyEditorSection" data-sheet-supply-processes hidden>'+
          '<div class="nexoSheetEditorSectionHead">'+
            '<div><span>'+esc(tr('Procesos','Processes'))+'</span><h2>'+esc(tr('Formas de procesar este insumo','Ways to process this supply'))+'</h2></div>'+
            '<div class="nexoSheetEditorSectionActions">'+
              '<div class="nexoCompositionAction" data-supply-process-action>'+
                '<button type="button" class="nexoWorkspaceBtn" data-supply-process-add aria-haspopup="menu" aria-expanded="false">'+icon('nuevo')+'<span>'+esc(tr('Proceso','Process'))+'</span></button>'+
                '<div class="nexoCompositionMenu" data-supply-process-menu role="menu" hidden>'+
                  '<button type="button" role="menuitem" data-supply-process-choice="existing">'+esc(tr('Existente','Existing'))+'</button>'+
                  '<button type="button" role="menuitem" data-supply-process-choice="create">'+esc(tr('Crear','Create'))+'</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="nexoSheetIngredientPicker" data-supply-process-picker hidden></div>'+
          '<div class="nexoSupplyProcessList" data-supply-process-list></div>'+
        '</section>'+
        '<section class="nexoSheetEditorSection" data-sheet-ingredients-section>'+
          '<div class="nexoSheetEditorSectionHead">'+
            '<div><span>'+esc(tr('Composición','Composition'))+'</span><h2>'+esc(tr('Ingredientes','Ingredients'))+'</h2></div>'+
            '<div class="nexoSheetEditorSectionActions">'+
              '<div class="nexoCompositionAction" data-composition-action="ingredient">'+
                '<button type="button" class="nexoWorkspaceBtn" data-sheet-add-existing aria-haspopup="menu" aria-expanded="false">'+icon('nuevo')+'<span>'+esc(tr('Insumo','Supply'))+'</span></button>'+
                '<div class="nexoCompositionMenu" data-composition-menu="ingredient" role="menu" hidden>'+
                  '<button type="button" role="menuitem" data-composition-choice="existing">'+esc(tr('Existente','Existing'))+'</button>'+
                  '<button type="button" role="menuitem" data-composition-choice="create">'+esc(tr('Crear','Create'))+'</button>'+
                '</div>'+
              '</div>'+
              (allowPreparationComponent
                ? '<div class="nexoCompositionAction" data-composition-action="preparation">'+
                    '<button type="button" class="nexoWorkspaceBtn" data-sheet-add-preparation aria-haspopup="menu" aria-expanded="false">'+icon('nuevo')+'<span>'+esc(tr('Preparación','Preparation'))+'</span></button>'+
                    '<div class="nexoCompositionMenu" data-composition-menu="preparation" role="menu" hidden>'+
                      '<button type="button" role="menuitem" data-composition-choice="existing">'+esc(tr('Existente','Existing'))+'</button>'+
                      '<button type="button" role="menuitem" data-composition-choice="create">'+esc(tr('Crear','Create'))+'</button>'+
                    '</div>'+
                  '</div>'
                : '')+
            '</div>'+
          '</div>'+
          '<div class="nexoSheetIngredientPicker" data-sheet-existing-picker hidden></div>'+
          '<div class="nexoSheetIngredientList" data-sheet-ingredient-list></div>'+
        '</section>'+
        '<section class="nexoSheetEditorSection" data-sheet-mop-section>'+
          '<div class="nexoSheetEditorSectionHead nexoMopSectionHead">'+
            '<div><span>'+esc(tr('Método','Method'))+'</span><h2>MOP</h2></div>'+
            '<div class="nexoMopHeadActions">'+
              '<div class="nexoMopHistoryActions" role="group" aria-label="'+esc(tr('Historial del MOP','MOP history'))+'">'+
                '<button type="button" class="nexoMopHistoryBtn" data-mop-undo aria-label="'+esc(tr('Deshacer','Undo'))+'" title="'+esc(tr('Deshacer','Undo'))+'" disabled>↶</button>'+
                '<button type="button" class="nexoMopHistoryBtn" data-mop-redo aria-label="'+esc(tr('Rehacer','Redo'))+'" title="'+esc(tr('Rehacer','Redo'))+'" disabled>↷</button>'+
              '</div>'+
              '<button type="button" class="nexoMopSetStepBtn" data-mop-set-step disabled><span>'+esc(tr('Establecer paso','Set step'))+'</span><strong aria-hidden="true">+</strong></button>'+
              '<div class="nexoMopInfoWrap" data-mop-info-wrap>'+
                '<button type="button" class="nexoMopInfoBtn" data-mop-info aria-label="'+esc(tr('Información del MOP','MOP information'))+'" aria-expanded="false">!</button>'+
                '<div class="nexoMopInfoPopover" role="tooltip">'+esc(tr('Escribe el método como texto normal y usa el + junto al cursor para insertar ingredientes dinámicos. Cuando completes una acción, usa Establecer paso: el contenido se guardará arriba y el área quedará lista para el siguiente paso.','Write the method as normal text and use the + beside the cursor to insert dynamic ingredients. When an action is complete, use Set step: the content will be saved above and the editor will be cleared for the next step.'))+'</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div class="nexoMopStepsList" data-mop-steps-list></div>'+
          '<div class="nexoMopEditorWrap" data-mop-wrap>'+
            '<div class="nexoMopEditor" data-sheet-mop-editor contenteditable="true" role="textbox" aria-multiline="true" data-placeholder="'+esc(tr('Escribe aquí el MOP…','Write the MOP here…'))+'"></div>'+
            '<button type="button" class="nexoMopCaretPlus" data-mop-caret-plus aria-label="'+esc(tr('Insertar ingrediente dinámico','Insert dynamic ingredient'))+'" hidden>+</button>'+
            '<div class="nexoMopPicker" data-mop-picker hidden></div>'+
          '</div>'+
        '</section>'+
      '</main>'+
    '</div>';
  document.body.appendChild(el);
  return el
}
function sheetEditorTemplate(options={}){
  const parentState=options.parentState||null;
  if(parentState&&parentState!==sheetEditorTop())return null;
  const editorId=sheetEditorId('sheet-editor');
  const layer=sheetEditorShell({...options,layerId:'nexoSheetEditorLayer_'+editorId});
  const state={
    id:editorId,
    kind:String(options.kind||'technical-sheet'),
    parentId:parentState?.id||'',
    layer,
    onComplete:typeof options.onComplete==='function'?options.onComplete:null,
    onClose:typeof options.onClose==='function'?options.onClose:null,
    cleanups:[],
    resumeFocus:null,
    title:'',
    description:'',
    photoFile:null,
    photoUrl:'',
    supplyPhotos:[],
    primaryPhotoId:'',
    defaultQuantity:'',
    defaultUnit:'',
    supplyMode:'CONSUMABLE',
    supplyProcesses:[],
    components:[],
    steps:[],
    mopHistory:[],
    mopHistoryIndex:-1,
    restoringMopHistory:false,
    savedMopRange:null,
    mopChoice:null,
    restoringMopRange:false,
    positioningMopPlus:false,
    openUnitComponentId:''
  };
  sheetEditorStack.push(state);
  syncSheetEditorStack();

  const title=layer.querySelector('[data-sheet-title]');
  const description=layer.querySelector('[data-sheet-description]');
  const compositionSection=layer.querySelector('[data-sheet-ingredients-section]');
  const mopSection=layer.querySelector('[data-sheet-mop-section]');
  const supplySection=layer.querySelector('[data-sheet-supply-section]');
  const supplyProcessesSection=layer.querySelector('[data-sheet-supply-processes]');
  const supplyQuantity=layer.querySelector('[data-supply-quantity]');
  const supplyUnit=layer.querySelector('[data-supply-unit]');
  const supplyPhotoGallery=layer.querySelector('[data-supply-photo-gallery]');
  const supplyProcessAction=layer.querySelector('[data-supply-process-action]');
  const supplyProcessTrigger=layer.querySelector('[data-supply-process-add]');
  const supplyProcessMenu=layer.querySelector('[data-supply-process-menu]');
  const supplyProcessPicker=layer.querySelector('[data-supply-process-picker]');
  const supplyProcessList=layer.querySelector('[data-supply-process-list]');
  const photoInput=layer.querySelector('[data-sheet-photo-input]');
  const photoChoose=layer.querySelector('[data-sheet-photo-choose]');
  const photoRemove=layer.querySelector('[data-sheet-photo-remove]');
  const photoPreview=layer.querySelector('[data-sheet-photo-preview]');
  const list=layer.querySelector('[data-sheet-ingredient-list]');
  const existingPicker=layer.querySelector('[data-sheet-existing-picker]');
  const supplyAction=layer.querySelector('[data-composition-action="ingredient"]');
  const preparationAction=layer.querySelector('[data-composition-action="preparation"]');
  const supplyTrigger=layer.querySelector('[data-sheet-add-existing]');
  const preparationTrigger=layer.querySelector('[data-sheet-add-preparation]');
  const supplyMenu=layer.querySelector('[data-composition-menu="ingredient"]');
  const preparationMenu=layer.querySelector('[data-composition-menu="preparation"]');
  const editor=layer.querySelector('[data-sheet-mop-editor]');
  const mopWrap=layer.querySelector('[data-mop-wrap]');
  const mopStepsList=layer.querySelector('[data-mop-steps-list]');
  const mopUndo=layer.querySelector('[data-mop-undo]');
  const mopRedo=layer.querySelector('[data-mop-redo]');
  const mopSetStep=layer.querySelector('[data-mop-set-step]');
  const mopInfo=layer.querySelector('[data-mop-info]');
  const mopInfoWrap=layer.querySelector('[data-mop-info-wrap]');
  const caretPlus=layer.querySelector('[data-mop-caret-plus]');
  const mopPicker=layer.querySelector('[data-mop-picker]');
  layer.appendChild(mopPicker);
  const unitPicker=document.createElement('div');
  unitPicker.className='nexoSheetUnitPicker';
  unitPicker.hidden=true;
  layer.appendChild(unitPicker);
  const editorCanvas=layer.querySelector('.nexoSheetEditorCanvas');
  const isSupplyEditor=state.kind==='supply';
  if(isSupplyEditor){
    compositionSection.hidden=true;
    mopSection.hidden=true;
    supplySection.hidden=false;
    supplyPhotoGallery.hidden=false
  }

  const componentById=id=>state.components.find(row=>row.id===id);
  const isPreparationComponent=row=>row?.source==='preparation'||row?.source==='new-preparation';
  const isEditableComponent=row=>row?.source==='new'||row?.source==='new-preparation';

  function mopAmountNumber(value){
    const normalized=String(value??'').trim().replace(',','.');
    if(!normalized)return null;
    const number=Number(normalized);
    return Number.isFinite(number)&&number>=0?number:null
  }
  function mopAmountText(value){
    const number=Number(value);
    if(!Number.isFinite(number))return '';
    return String(Number(number.toFixed(6)))
  }
  function allocatedAmount(componentId){
    let total=0;
    layer.querySelectorAll('[data-mop-component-id="'+CSS.escape(componentId)+'"]').forEach(token=>{
      const value=mopAmountNumber(token.dataset.mopAllocatedQuantity);
      if(value!==null)total+=value
    });
    return total
  }
  function remainingAmount(component){
    const total=mopAmountNumber(component?.quantity);
    if(total===null)return null;
    return Math.max(0,total-allocatedAmount(component.id))
  }
  function componentTokenText(component,allocatedQuantity){
    const quantity=mopAmountText(allocatedQuantity);
    const unit=String(component?.unit??'').trim();
    const name=String(component?.name||tr('Ingrediente','Ingredient')).trim();
    return [[quantity,unit].filter(Boolean).join(' '),name].filter(Boolean).join(' ')
  }
  function syncStepHtmlFromDom(){
    mopStepsList.querySelectorAll('[data-mop-step-id]').forEach(stepEl=>{
      const step=state.steps.find(row=>row.id===stepEl.dataset.mopStepId);
      const body=stepEl.querySelector('[data-mop-step-body]');
      if(step&&body)step.html=body.innerHTML
    })
  }
  function renderMopSteps(){
    if(!state.steps.length){
      mopStepsList.innerHTML='';
      return
    }
    mopStepsList.innerHTML=state.steps.map((step,index)=>
      '<article class="nexoMopStep" data-mop-step-id="'+esc(step.id)+'">'+
        '<div class="nexoMopStepIndex" aria-hidden="true">'+(index+1)+'</div>'+
        '<div class="nexoMopStepBody" data-mop-step-body>'+step.html+'</div>'+
      '</article>'
    ).join('')
  }
  function mopDraftHasContent(){
    if(editor.querySelector('[data-mop-component-id]'))return true;
    return String(editor.textContent||'').replace(/\u200b/g,'').trim().length>0
  }
  function mopSnapshot(){
    return {
      draft:editor.innerHTML,
      steps:state.steps.map(step=>({id:step.id,html:step.html}))
    }
  }
  function mopSnapshotKey(snapshot){
    return JSON.stringify(snapshot)
  }
  function updateMopActionButtons(){
    mopUndo.disabled=state.mopHistoryIndex<=0;
    mopRedo.disabled=state.mopHistoryIndex<0||state.mopHistoryIndex>=state.mopHistory.length-1;
    mopSetStep.disabled=!mopDraftHasContent()
  }
  function commitMopHistory(){
    if(state.restoringMopHistory)return;
    syncStepHtmlFromDom();
    const snapshot=mopSnapshot();
    const key=mopSnapshotKey(snapshot);
    const current=state.mopHistory[state.mopHistoryIndex];
    if(current&&mopSnapshotKey(current)===key){
      updateMopActionButtons();
      return
    }
    state.mopHistory=state.mopHistory.slice(0,state.mopHistoryIndex+1);
    state.mopHistory.push(snapshot);
    if(state.mopHistory.length>100)state.mopHistory.shift();
    state.mopHistoryIndex=state.mopHistory.length-1;
    updateMopActionButtons()
  }
  function restoreMopSnapshot(snapshot){
    if(!snapshot)return;
    state.restoringMopHistory=true;
    state.steps=snapshot.steps.map(step=>({id:step.id,html:step.html}));
    editor.innerHTML=snapshot.draft;
    renderMopSteps();
    state.savedMopRange=null;
    caretPlus.hidden=true;
    hideMopPicker();
    refreshMopTokens();
    state.restoringMopHistory=false;
    updateMopActionButtons()
  }
  function undoMop(){
    if(state.mopHistoryIndex<=0)return;
    state.mopHistoryIndex-=1;
    restoreMopSnapshot(state.mopHistory[state.mopHistoryIndex])
  }
  function redoMop(){
    if(state.mopHistoryIndex>=state.mopHistory.length-1)return;
    state.mopHistoryIndex+=1;
    restoreMopSnapshot(state.mopHistory[state.mopHistoryIndex])
  }
  function establishMopStep(){
    if(!mopDraftHasContent())return;
    hideMopPicker();
    state.steps.push({id:sheetEditorId('mop-step'),html:editor.innerHTML});
    editor.innerHTML='';
    state.savedMopRange=null;
    caretPlus.hidden=true;
    renderMopSteps();
    try{editor.focus({preventScroll:true})}catch(_){editor.focus()}
    const selection=window.getSelection();
    if(selection){
      const range=document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      state.savedMopRange=range.cloneRange();
      positionCaretPlus(state.savedMopRange)
    }
    commitMopHistory()
  }

  function refreshMopTokens(){
    layer.querySelectorAll('[data-mop-component-id]').forEach(token=>{
      const component=componentById(String(token.dataset.mopComponentId||''));
      if(!component){token.remove();return}
      const quantity=mopAmountNumber(token.dataset.mopAllocatedQuantity);
      if(quantity===null){token.remove();return}
      token.textContent=componentTokenText(component,quantity)
    });
    syncStepHtmlFromDom();
    updateMopActionButtons()
  }
  function removeComponentTokens(id){
    layer.querySelectorAll('[data-mop-component-id="'+CSS.escape(id)+'"]').forEach(node=>node.remove());
    syncStepHtmlFromDom();
    commitMopHistory()
  }
  function renderIngredientList(){
    if(!state.components.length){
      list.innerHTML='<div class="nexoSheetIngredientEmpty">'+icon('ficha-tecnica')+'<strong>'+esc(tr('Todavía no hay ingredientes','No ingredients yet'))+'</strong><span>'+esc(tr('Agrega uno existente o crea uno nuevo.','Add an existing one or create a new one.'))+'</span></div>';
      return
    }
    list.innerHTML=state.components.map((row,index)=>
      '<article class="nexoSheetIngredientRow" data-component-id="'+esc(row.id)+'">'+
        '<div class="nexoSheetIngredientIndex">'+(index+1)+'</div>'+
        '<label class="nexoSheetIngredientName"><span>'+esc(isPreparationComponent(row)?tr('Preparación','Preparation'):tr('Insumo','Supply'))+'</span><input data-component-name maxlength="160" value="'+esc(row.name)+'" '+(!isEditableComponent(row)?'readonly':'')+'></label>'+
        '<label><span>'+esc(tr('Cantidad','Quantity'))+'</span><input data-component-quantity inputmode="decimal" value="'+esc(row.quantity)+'" placeholder="1000"></label>'+
        '<label class="nexoSheetUnitField"><span>'+esc(tr('Unidad','Unit'))+'</span><button type="button" class="nexoSheetUnitTrigger" data-component-unit-trigger aria-haspopup="listbox">'+
          '<strong>'+esc(row.unit||tr('Elegir unidad','Choose unit'))+'</strong>'+
          '<small>'+esc(row.unit?sheetUnitLabel(row.unit):tr('Usar una unidad existente','Use an existing unit'))+'</small>'+
        '</button></label>'+
        '<button type="button" class="nexoSheetIngredientRemove" data-component-remove aria-label="'+esc(tr('Eliminar ingrediente','Remove ingredient'))+'">×</button>'+
      '</article>'
    ).join('');
    list.querySelectorAll('[data-component-id]').forEach(rowEl=>{
      const component=componentById(rowEl.dataset.componentId);
      if(!component)return;
      const nameInput=rowEl.querySelector('[data-component-name]');
      const qtyInput=rowEl.querySelector('[data-component-quantity]');
      const unitTrigger=rowEl.querySelector('[data-component-unit-trigger]');
      const sync=()=>{
        if(isEditableComponent(component))component.name=String(nameInput.value||'');
        component.quantity=String(qtyInput.value||'');
        refreshMopTokens()
      };
      nameInput.addEventListener('input',sync);
      qtyInput.addEventListener('input',sync);
      unitTrigger.onclick=()=>openUnitPicker(component,unitTrigger);
      rowEl.querySelector('[data-component-remove]').onclick=()=>{
        state.components=state.components.filter(item=>item.id!==component.id);
        removeComponentTokens(component.id);
        renderIngredientList();
        hideMopPicker()
      }
    })
  }
  function hideUnitPicker(){
    unitPicker.hidden=true;
    state.openUnitComponentId=''
  }
  function positionUnitPicker(trigger){
    if(unitPicker.hidden||!trigger)return;
    const rect=trigger.getBoundingClientRect();
    const margin=10;
    const width=Math.min(360,Math.max(270,window.innerWidth-margin*2));
    const left=Math.max(margin,Math.min(rect.left,window.innerWidth-width-margin));
    unitPicker.style.width=width+'px';
    const desiredHeight=Math.min(420,Math.max(250,window.innerHeight*0.52));
    unitPicker.style.maxHeight=desiredHeight+'px';
    const spaceBelow=window.innerHeight-rect.bottom-margin;
    const spaceAbove=rect.top-margin;
    if(spaceBelow>=Math.min(300,desiredHeight)||spaceBelow>=spaceAbove){
      unitPicker.style.top=Math.max(margin,rect.bottom+7)+'px';
      unitPicker.style.bottom='auto'
    }else{
      unitPicker.style.top='auto';
      unitPicker.style.bottom=Math.max(margin,window.innerHeight-rect.top+7)+'px'
    }
    unitPicker.style.left=left+'px'
  }
  function openUnitPicker(component,trigger){
    hideMopPicker();
    state.openUnitComponentId=component.id;
    unitPicker.innerHTML=
      '<div class="nexoSheetUnitPickerHead"><div><span>'+esc(tr('Unidad de medida','Unit of measure'))+'</span><strong>'+esc(tr('Selecciona una unidad existente','Choose an existing unit'))+'</strong></div><button type="button" data-unit-close>×</button></div>'+
      '<div class="nexoSheetUnitPickerList" role="listbox">'+
        SHEET_UNIT_CATALOG.map(row=>{
          const code=row[0],label=lang()==='en'?row[2]:row[1];
          return '<button type="button" role="option" data-unit-code="'+esc(code)+'" class="'+(component.unit===code?'active':'')+'"><strong>'+esc(code)+'</strong><span>'+esc(label)+'</span></button>'
        }).join('')+
      '</div>'+
      '<div class="nexoSheetUnitPickerOther"><button type="button" data-unit-other disabled>'+esc(tr('Otra','Other'))+'</button><small>'+esc(tr('La creación de nuevas unidades no está disponible aquí.','Creating new units is not available here.'))+'</small></div>';
    unitPicker.querySelector('[data-unit-close]').onclick=hideUnitPicker;
    unitPicker.querySelectorAll('[data-unit-code]').forEach(btn=>btn.onclick=()=>{
      component.unit=String(btn.dataset.unitCode||'');
      hideUnitPicker();
      renderIngredientList();
      refreshMopTokens()
    });
    unitPicker.hidden=false;
    positionUnitPicker(trigger)
  }

  function supplyPhotoById(id){
    return state.supplyPhotos.find(photo=>photo.id===id)||null
  }
  function renderSupplyPhotos(){
    if(!isSupplyEditor)return;
    if(!state.supplyPhotos.length){
      state.primaryPhotoId='';
      photoPreview.innerHTML='<div>'+icon('ficha-tecnica')+'<span>'+esc(tr('Foto del insumo','Supply photo'))+'</span></div>';
      supplyPhotoGallery.innerHTML='<div class="nexoSupplyPhotoEmpty">'+esc(tr('Puedes agregar hasta 3 fotos y elegir una como principal.','You can add up to 3 photos and choose one as primary.'))+'</div>';
      photoRemove.hidden=true;
      return
    }
    if(!supplyPhotoById(state.primaryPhotoId))state.primaryPhotoId=state.supplyPhotos[0].id;
    const primary=supplyPhotoById(state.primaryPhotoId)||state.supplyPhotos[0];
    photoPreview.innerHTML='<img src="'+esc(primary.url)+'" alt="">';
    photoRemove.hidden=true;
    photoChoose.disabled=state.supplyPhotos.length>=SUPPLY_PHOTO_LIMIT;
    supplyPhotoGallery.innerHTML=state.supplyPhotos.map(photo=>
      '<article class="nexoSupplyPhotoThumb '+(photo.id===state.primaryPhotoId?'primary':'')+'" data-supply-photo-id="'+esc(photo.id)+'">'+
        '<button type="button" class="nexoSupplyPhotoMain" data-supply-photo-primary title="'+esc(tr('Usar como foto principal','Use as primary photo'))+'">'+
          '<img src="'+esc(photo.url)+'" alt="">'+
          '<span aria-hidden="true">'+(photo.id===state.primaryPhotoId?'★':'☆')+'</span>'+
        '</button>'+
        '<button type="button" class="nexoSupplyPhotoDelete" data-supply-photo-delete aria-label="'+esc(tr('Eliminar foto','Remove photo'))+'">×</button>'+
      '</article>'
    ).join('');
    supplyPhotoGallery.querySelectorAll('[data-supply-photo-id]').forEach(card=>{
      const id=card.dataset.supplyPhotoId;
      card.querySelector('[data-supply-photo-primary]').onclick=()=>{
        state.primaryPhotoId=id;
        renderSupplyPhotos()
      };
      card.querySelector('[data-supply-photo-delete]').onclick=()=>{
        const photo=supplyPhotoById(id);
        if(photo?.url)try{URL.revokeObjectURL(photo.url)}catch(_){}
        state.supplyPhotos=state.supplyPhotos.filter(row=>row.id!==id);
        if(state.primaryPhotoId===id)state.primaryPhotoId=state.supplyPhotos[0]?.id||'';
        photoInput.value='';
        renderSupplyPhotos()
      }
    })
  }
  function supplyProcessName(row){
    return text(row,'nameEn','nameEs')||row?.name||tr('Proceso','Process')
  }
  function renderSupplyProcessList(){
    if(!isSupplyEditor)return;
    if(!state.supplyProcesses.length){
      supplyProcessList.innerHTML='<div class="nexoSheetIngredientEmpty"><strong>'+esc(tr('Todavía no hay procesos','No processes yet'))+'</strong><span>'+esc(tr('Agrega un proceso existente o crea uno nuevo.','Add an existing process or create a new one.'))+'</span></div>';
      return
    }
    supplyProcessList.innerHTML=state.supplyProcesses.map((relation,index)=>
      '<article class="nexoSupplyProcessRow" data-supply-process-id="'+esc(relation.id)+'">'+
        '<div class="nexoSheetIngredientIndex">'+(index+1)+'</div>'+
        '<label><span>'+esc(tr('Proceso','Process'))+'</span><input data-supply-process-name maxlength="160" value="'+esc(relation.name||'')+'" '+(relation.source==='new'?'':'readonly')+'></label>'+
        '<label><span>'+esc(tr('Descripción','Description'))+'</span><input data-supply-process-description maxlength="300" value="'+esc(relation.description||'')+'" '+(relation.source==='new'?'':'readonly')+'></label>'+
        '<div class="nexoSupplyProcessPhoto">'+
          (relation.imageUrl?'<img src="'+esc(relation.imageUrl)+'" alt="">':'<span>'+esc(tr('Sin foto','No photo'))+'</span>')+
          '<button type="button" data-supply-process-photo>'+esc(relation.imageUrl?tr('Cambiar','Change'):tr('Agregar foto','Add photo'))+'</button>'+
          '<input type="file" accept="image/jpeg,image/png,image/webp" data-supply-process-photo-input hidden>'+
        '</div>'+
        '<button type="button" class="nexoSheetIngredientRemove" data-supply-process-remove aria-label="'+esc(tr('Eliminar proceso','Remove process'))+'">×</button>'+
      '</article>'
    ).join('');
    supplyProcessList.querySelectorAll('[data-supply-process-id]').forEach(rowEl=>{
      const relation=state.supplyProcesses.find(row=>row.id===rowEl.dataset.supplyProcessId);
      if(!relation)return;
      const nameInput=rowEl.querySelector('[data-supply-process-name]');
      const descriptionInput=rowEl.querySelector('[data-supply-process-description]');
      if(relation.source==='new'){
        nameInput.addEventListener('input',()=>{relation.name=nameInput.value});
        descriptionInput.addEventListener('input',()=>{relation.description=descriptionInput.value})
      }
      const processPhotoInput=rowEl.querySelector('[data-supply-process-photo-input]');
      rowEl.querySelector('[data-supply-process-photo]').onclick=()=>processPhotoInput.click();
      processPhotoInput.onchange=()=>{
        const file=processPhotoInput.files?.[0];
        if(!file||!/^image\/(jpeg|png|webp)$/i.test(String(file.type||'')))return;
        if(relation.imageUrl)try{URL.revokeObjectURL(relation.imageUrl)}catch(_){}
        relation.imageFile=file;
        relation.imageUrl=URL.createObjectURL(file);
        renderSupplyProcessList()
      };
      rowEl.querySelector('[data-supply-process-remove]').onclick=()=>{
        if(relation.imageUrl)try{URL.revokeObjectURL(relation.imageUrl)}catch(_){}
        state.supplyProcesses=state.supplyProcesses.filter(row=>row.id!==relation.id);
        renderSupplyProcessList()
      }
    })
  }
  function closeSupplyProcessMenu(){
    if(!isSupplyEditor)return;
    supplyProcessMenu.hidden=true;
    supplyProcessTrigger.setAttribute('aria-expanded','false')
  }
  function renderSupplyProcessPicker(query=''){
    if(!isSupplyEditor)return;
    const q=searchNorm(query);
    const selected=new Set(state.supplyProcesses.filter(row=>row.processId).map(row=>String(row.processId)));
    const rows=activeProcesses().filter(row=>{
      if(selected.has(String(row._id||'')))return false;
      if(!q)return true;
      return searchNorm([row.nameEs,row.nameEn,row.descriptionEs,row.descriptionEn].filter(Boolean).join(' ')).includes(q)
    }).slice(0,40);
    supplyProcessPicker.innerHTML=
      '<div class="nexoSheetIngredientPickerHead"><label>'+icon('busqueda')+'<input data-supply-process-search autocomplete="off" placeholder="'+esc(tr('Buscar proceso…','Search process…'))+'" value="'+esc(query)+'"></label><button type="button" data-supply-process-picker-close>×</button></div>'+
      '<div class="nexoSheetIngredientPickerResults">'+
        (rows.length?rows.map(row=>'<button type="button" data-process-catalog-id="'+esc(row._id)+'"><strong>'+esc(supplyProcessName(row))+'</strong><span>'+esc(text(row,'descriptionEn','descriptionEs')||'')+'</span></button>').join(''):'<p>'+esc(tr('No hay procesos disponibles con esa búsqueda.','No processes match that search.'))+'</p>')+
      '</div>';
    const search=supplyProcessPicker.querySelector('[data-supply-process-search]');
    search?.addEventListener('input',()=>renderSupplyProcessPicker(search.value));
    supplyProcessPicker.querySelector('[data-supply-process-picker-close]').onclick=()=>{supplyProcessPicker.hidden=true};
    supplyProcessPicker.querySelectorAll('[data-process-catalog-id]').forEach(btn=>btn.onclick=()=>{
      const process=activeProcesses().find(row=>String(row._id)===String(btn.dataset.processCatalogId));
      if(!process)return;
      state.supplyProcesses.push({
        id:sheetEditorId('supply-process'),
        source:'existing',
        processId:String(process._id),
        name:supplyProcessName(process),
        description:text(process,'descriptionEn','descriptionEs')||'',
        imageFile:null,
        imageUrl:''
      });
      supplyProcessPicker.hidden=true;
      renderSupplyProcessList()
    });
    queueMicrotask(()=>search?.focus())
  }
  function setSupplyMode(mode){
    if(!isSupplyEditor)return;
    state.supplyMode=mode==='PROCESSABLE'?'PROCESSABLE':'CONSUMABLE';
    layer.querySelectorAll('[data-supply-mode]').forEach(btn=>{
      const active=btn.dataset.supplyMode===state.supplyMode;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',active?'true':'false')
    });
    supplyProcessesSection.hidden=state.supplyMode!=='PROCESSABLE';
    if(state.supplyMode!=='PROCESSABLE'){
      supplyProcessPicker.hidden=true;
      closeSupplyProcessMenu()
    }
  }

  function closeCompositionMenus(except=''){
    [
      ['ingredient',supplyMenu,supplyTrigger],
      ['preparation',preparationMenu,preparationTrigger]
    ].forEach(([kind,menu,trigger])=>{
      if(kind===except||!menu||!trigger)return;
      menu.hidden=true;
      trigger.setAttribute('aria-expanded','false')
    })
  }
  function toggleCompositionMenu(kind){
    const menu=kind==='preparation'?preparationMenu:supplyMenu;
    const trigger=kind==='preparation'?preparationTrigger:supplyTrigger;
    if(!menu||!trigger)return;
    const willOpen=menu.hidden;
    closeCompositionMenus(kind);
    menu.hidden=!willOpen;
    trigger.setAttribute('aria-expanded',willOpen?'true':'false')
  }
  function openCreateChild(kind){
    closeCompositionMenus();
    existingPicker.hidden=true;
    if(kind==='preparation'){
      openNestedSheetEditor('preparation',{
        ariaLabel:tr('Crear preparación','Create preparation'),
        eyebrow:tr('Nueva preparación','New preparation'),
        heading:tr('Crear preparación','Create preparation'),
        photoLabel:tr('Foto de la preparación','Preparation photo'),
        titlePlaceholder:tr('Nombre de la preparación','Preparation name'),
        descriptionPlaceholder:tr('Describe brevemente esta preparación.','Briefly describe this preparation.')
      });
      return
    }
    openNestedSheetEditor('supply',{
      ariaLabel:tr('Crear insumo','Create supply'),
      eyebrow:tr('Nuevo insumo','New supply'),
      heading:tr('Crear insumo','Create supply'),
      photoLabel:tr('Foto del insumo','Supply photo'),
      titlePlaceholder:tr('Nombre del insumo','Supply name'),
      descriptionPlaceholder:tr('Describe brevemente este insumo.','Briefly describe this supply.')
    })
  }

  function renderExistingPicker(kind='ingredient',query=''){
    const isPreparation=kind==='preparation';
    const q=searchNorm(query);
    const selectedIds=new Set(
      state.components
        .filter(row=>isPreparation?row.source==='preparation':row.source==='existing')
        .map(row=>isPreparation?row.targetRecipeId:row.targetIngredientId)
        .filter(Boolean)
        .map(String)
    );
    const catalog=isPreparation?activePreparationSheets():activeProducts();
    const rows=catalog.filter(row=>{
      if(selectedIds.has(String(row._id||'')))return false;
      if(!q)return true;
      const corpus=isPreparation
        ? [row.titleEs,row.titleEn,row.category,row.recipeType].filter(Boolean).join(' ')
        : [row.nameEs,row.nameEn,row.descriptionEs,row.descriptionEn].filter(Boolean).join(' ');
      return searchNorm(corpus).includes(q)
    }).slice(0,40);
    const itemName=row=>isPreparation?preparationSheetName(row):ingredientName(row);
    const itemDetail=row=>isPreparation
      ? String(row.category||tr('Preparación existente','Existing preparation'))
      : (text(row,'descriptionEn','descriptionEs')||'');
    existingPicker.innerHTML=
      '<div class="nexoSheetIngredientPickerHead"><label>'+icon('busqueda')+'<input data-existing-search autocomplete="off" placeholder="'+esc(isPreparation?tr('Buscar preparación…','Search preparation…'):tr('Buscar insumo…','Search supply…'))+'" value="'+esc(query)+'"></label><button type="button" data-existing-close>×</button></div>'+
      '<div class="nexoSheetIngredientPickerResults">'+
        (rows.length
          ? rows.map(row=>'<button type="button" data-existing-id="'+esc(row._id)+'"><strong>'+esc(itemName(row))+'</strong><span>'+esc(itemDetail(row))+'</span></button>').join('')
          : '<p>'+esc(isPreparation?tr('No hay preparaciones disponibles con esa búsqueda.','No preparations match that search.'):tr('No hay insumos disponibles con esa búsqueda.','No supplies match that search.'))+'</p>')+
      '</div>';
    const search=existingPicker.querySelector('[data-existing-search]');
    search?.addEventListener('input',()=>renderExistingPicker(kind,search.value));
    existingPicker.querySelector('[data-existing-close]').onclick=()=>{existingPicker.hidden=true};
    existingPicker.querySelectorAll('[data-existing-id]').forEach(btn=>btn.onclick=()=>{
      const source=catalog.find(row=>String(row._id)===String(btn.dataset.existingId));
      if(!source)return;
      if(isPreparation){
        state.components.push({
          id:sheetEditorId('component'),
          source:'preparation',
          targetIngredientId:'',
          targetRecipeId:String(source._id),
          name:preparationSheetName(source),
          quantity:'',
          unit:''
        })
      }else{
        state.components.push({
          id:sheetEditorId('component'),
          source:'existing',
          targetIngredientId:String(source._id),
          targetRecipeId:'',
          name:ingredientName(source),
          quantity:'',
          unit:''
        })
      }
      existingPicker.hidden=true;
      renderIngredientList()
    });
    queueMicrotask(()=>search?.focus())
  }

  function positionCaretPlus(range=state.savedMopRange){
    if(state.positioningMopPlus||!range){
      if(!range)caretPlus.hidden=true;
      return
    }
    let probe=null;
    state.positioningMopPlus=true;
    state.restoringMopRange=true;
    try{
      const work=range.cloneRange();
      work.collapse(true);
      probe=document.createElement('span');
      probe.className='nexoMopCaretProbe';
      probe.setAttribute('aria-hidden','true');
      probe.textContent='\u200b';
      work.insertNode(probe);
      const rect=probe.getBoundingClientRect();
      const caretX=rect.left;
      const caretCenterY=rect.top+(rect.height/2);
      caretPlus.style.left=(caretX+11)+'px';
      caretPlus.style.top=(caretCenterY-15)+'px';
      caretPlus.hidden=false;

      const restored=document.createRange();
      restored.setStartBefore(probe);
      restored.collapse(true);
      probe.remove();
      probe=null;
      editor.normalize();

      if(document.activeElement===editor){
        const selection=window.getSelection();
        if(selection){
          selection.removeAllRanges();
          selection.addRange(restored)
        }
      }
      state.savedMopRange=restored.cloneRange()
    }catch(_){
      caretPlus.hidden=true
    }finally{
      if(probe?.isConnected)probe.remove();
      state.restoringMopRange=false;
      state.positioningMopPlus=false
    }
  }
  function rememberMopRange(){
    if(state.restoringMopRange||state.positioningMopPlus)return;
    const selection=window.getSelection();
    if(!selection||!selection.rangeCount)return;
    const range=selection.getRangeAt(0);
    if(!editor.contains(range.startContainer))return;
    state.savedMopRange=range.cloneRange();
    positionCaretPlus(state.savedMopRange)
  }
  function restoreMopRange(){
    let range=null;
    try{
      if(state.savedMopRange&&editor.contains(state.savedMopRange.startContainer)){
        range=state.savedMopRange.cloneRange()
      }
    }catch(_){}
    if(!range){
      range=document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false)
    }
    state.restoringMopRange=true;
    try{
      editor.focus({preventScroll:true});
    }catch(_){
      editor.focus()
    }
    const selection=window.getSelection();
    if(!selection){
      state.restoringMopRange=false;
      return null
    }
    selection.removeAllRanges();
    selection.addRange(range);
    state.savedMopRange=range.cloneRange();
    state.restoringMopRange=false;
    return range
  }
  function hideMopPicker(){
    mopPicker.hidden=true;
    state.mopChoice=null
  }
  function renderMopPicker(){
    const available=state.components.filter(row=>{
      const remaining=remainingAmount(row);
      return remaining!==null&&remaining>0&&String(row.unit||'').trim()
    });
    if(!state.components.length){
      mopPicker.innerHTML='<div class="nexoMopPickerEmpty">'+esc(tr('Primero agrega ingredientes en la sección superior.','Add ingredients in the section above first.'))+'</div>';
      mopPicker.hidden=false;
      positionMopPicker();
      return
    }
    if(!state.mopChoice){
      mopPicker.innerHTML=
        '<div class="nexoMopPickerTitle">'+esc(tr('Seleccionar ingrediente','Select ingredient'))+'</div>'+
        (available.length
          ? '<div class="nexoMopPickerList">'+available.map(row=>{
              const remaining=remainingAmount(row);
              return '<button type="button" data-mop-choose="'+esc(row.id)+'"><strong>'+esc(row.name||tr('Ingrediente','Ingredient'))+'</strong><span>'+esc(mopAmountText(remaining)+' '+String(row.unit||''))+' · '+esc(tr('disponible','available'))+'</span></button>'
            }).join('')+'</div>'
          : '<div class="nexoMopPickerEmpty">'+esc(tr('No quedan ingredientes con cantidad y unidad disponibles para insertar.','No ingredients with remaining quantity and unit are available to insert.'))+'</div>');
      mopPicker.querySelectorAll('[data-mop-choose]').forEach(btn=>btn.onclick=()=>{
        state.mopChoice={componentId:String(btn.dataset.mopChoose),action:''};
        renderMopPicker()
      })
    }else{
      const component=componentById(state.mopChoice.componentId);
      const remaining=component?remainingAmount(component):null;
      if(!component||remaining===null||remaining<=0){state.mopChoice=null;renderMopPicker();return}
      const unit=String(component.unit||'');
      const fullText=componentTokenText(component,remaining);
      if(state.mopChoice.action==='split'){
        mopPicker.innerHTML=
          '<button type="button" class="nexoMopPickerBack" data-mop-back>← '+esc(tr('Atrás','Back'))+'</button>'+
          '<div class="nexoMopPickerSelected"><strong>'+esc(component.name||tr('Ingrediente','Ingredient'))+'</strong><span>'+esc(tr('Disponible','Available'))+': '+esc(mopAmountText(remaining)+' '+unit)+'</span></div>'+
          '<label class="nexoMopSplitField"><span>'+esc(tr('Cantidad a agregar','Amount to add'))+'</span><div><input data-mop-split-quantity inputmode="decimal" autocomplete="off" placeholder="'+esc(mopAmountText(remaining))+'"><strong>'+esc(unit)+'</strong></div><small data-mop-split-error></small></label>'+
          '<button type="button" class="nexoWorkspaceBtn primary wide" data-mop-split-done>'+esc(tr('Listo','Done'))+'</button>';
        mopPicker.querySelector('[data-mop-back]').onclick=()=>{state.mopChoice.action='';renderMopPicker()};
        const input=mopPicker.querySelector('[data-mop-split-quantity]');
        const error=mopPicker.querySelector('[data-mop-split-error]');
        const submit=()=>{
          const amount=mopAmountNumber(input.value);
          if(amount===null||amount<=0){
            error.textContent=tr('Ingresa una cantidad mayor que cero.','Enter an amount greater than zero.');
            input.focus();
            return
          }
          if(amount>remaining+1e-9){
            error.textContent=tr('La cantidad supera lo que queda disponible.','The amount is greater than what remains available.');
            input.focus();
            return
          }
          insertMopToken(component,amount);
          hideMopPicker()
        };
        input.addEventListener('input',()=>{error.textContent=''});
        input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit()}});
        mopPicker.querySelector('[data-mop-split-done]').onclick=submit;
        queueMicrotask(()=>input.focus())
      }else{
        mopPicker.innerHTML=
          '<button type="button" class="nexoMopPickerBack" data-mop-back>← '+esc(tr('Ingredientes','Ingredients'))+'</button>'+
          '<div class="nexoMopPickerSelected"><strong>'+esc(component.name||tr('Ingrediente','Ingredient'))+'</strong><span>'+esc(tr('Quedan','Remaining'))+' '+esc(mopAmountText(remaining)+' '+unit)+'</span></div>'+
          '<div class="nexoMopAllocationActions">'+
            '<button type="button" data-mop-add-all><span>'+esc(tr('Agregar todo','Add all'))+'</span><strong>'+esc(fullText)+'</strong></button>'+
            '<button type="button" data-mop-split><span>'+esc(tr('Dividir','Split'))+'</span><strong>'+esc(tr('Usar solo una parte y conservar el resto','Use only part and keep the remainder'))+'</strong></button>'+
          '</div>';
        mopPicker.querySelector('[data-mop-back]').onclick=()=>{state.mopChoice=null;renderMopPicker()};
        mopPicker.querySelector('[data-mop-add-all]').onclick=()=>{
          insertMopToken(component,remaining);
          hideMopPicker()
        };
        mopPicker.querySelector('[data-mop-split]').onclick=()=>{
          state.mopChoice.action='split';
          renderMopPicker()
        }
      }
    }
    mopPicker.hidden=false;
    positionMopPicker()
  }
  function positionMopPicker(){
    if(mopPicker.hidden||caretPlus.hidden)return;
    const rect=caretPlus.getBoundingClientRect();
    const margin=10;
    const width=Math.min(360,Math.max(270,window.innerWidth-margin*2));
    const left=Math.max(margin,Math.min(rect.left,window.innerWidth-width-margin));
    const maxHeight=Math.min(420,Math.max(240,window.innerHeight*0.52));
    mopPicker.style.width=width+'px';
    mopPicker.style.maxHeight=maxHeight+'px';
    mopPicker.style.left=left+'px';
    const spaceBelow=window.innerHeight-rect.bottom-margin;
    const spaceAbove=rect.top-margin;
    if(spaceBelow>=Math.min(300,maxHeight)||spaceBelow>=spaceAbove){
      mopPicker.style.top=Math.max(margin,rect.bottom+7)+'px';
      mopPicker.style.bottom='auto'
    }else{
      mopPicker.style.top='auto';
      mopPicker.style.bottom=Math.max(margin,window.innerHeight-rect.top+7)+'px'
    }
  }
  function insertMopToken(component,allocatedQuantity){
    const amount=mopAmountNumber(allocatedQuantity);
    if(amount===null||amount<=0)return;
    const remaining=remainingAmount(component);
    if(remaining===null||amount>remaining+1e-9)return;
    const range=restoreMopRange();
    if(!range)return;
    const token=document.createElement('span');
    token.className='nexoMopDynamicToken';
    token.contentEditable='false';
    token.dataset.mopComponentId=component.id;
    token.dataset.mopAllocatedQuantity=mopAmountText(amount);
    token.textContent=componentTokenText(component,amount);
    range.deleteContents();
    range.insertNode(token);
    const spacer=document.createTextNode(' ');
    token.after(spacer);
    const next=document.createRange();
    next.setStart(spacer,String(spacer.nodeValue||'').length);
    next.collapse(true);
    const selection=window.getSelection();
    selection.removeAllRanges();
    selection.addRange(next);
    state.savedMopRange=next.cloneRange();
    positionCaretPlus(state.savedMopRange);
    commitMopHistory()
  }

  title.addEventListener('input',()=>{state.title=title.value});
  description.addEventListener('input',()=>{state.description=description.value});
  photoChoose.onclick=()=>photoInput.click();
  photoInput.onchange=()=>{
    if(isSupplyEditor){
      const room=Math.max(0,SUPPLY_PHOTO_LIMIT-state.supplyPhotos.length);
      const files=[...(photoInput.files||[])].filter(file=>/^image\/(jpeg|png|webp)$/i.test(String(file.type||''))).slice(0,room);
      files.forEach(file=>{
        const photo={id:sheetEditorId('supply-photo'),file,url:URL.createObjectURL(file)};
        state.supplyPhotos.push(photo);
        if(!state.primaryPhotoId)state.primaryPhotoId=photo.id
      });
      photoInput.value='';
      renderSupplyPhotos();
      return
    }
    const file=photoInput.files?.[0];
    if(!file)return;
    if(!/^image\/(jpeg|png|webp)$/i.test(String(file.type||'')))return;
    if(state.photoUrl)try{URL.revokeObjectURL(state.photoUrl)}catch(_){}
    state.photoFile=file;
    state.photoUrl=URL.createObjectURL(file);
    photoPreview.innerHTML='<img src="'+esc(state.photoUrl)+'" alt="">';
    photoRemove.hidden=false
  };
  photoRemove.onclick=()=>{
    if(isSupplyEditor)return;
    if(state.photoUrl)try{URL.revokeObjectURL(state.photoUrl)}catch(_){}
    state.photoFile=null;
    state.photoUrl='';
    photoInput.value='';
    photoPreview.innerHTML='<div>'+icon('ficha-tecnica')+'<span>'+esc(tr('Foto del producto','Product photo'))+'</span></div>';
    photoRemove.hidden=true
  };

  if(isSupplyEditor){
    supplyQuantity.addEventListener('input',()=>{state.defaultQuantity=String(supplyQuantity.value||'')});
    supplyUnit.addEventListener('change',()=>{state.defaultUnit=String(supplyUnit.value||'')});
    layer.querySelectorAll('[data-supply-mode]').forEach(btn=>btn.onclick=()=>setSupplyMode(btn.dataset.supplyMode));
    supplyProcessTrigger.onclick=()=>{
      const open=supplyProcessMenu.hidden;
      supplyProcessMenu.hidden=!open;
      supplyProcessTrigger.setAttribute('aria-expanded',open?'true':'false')
    };
    supplyProcessMenu.querySelector('[data-supply-process-choice="existing"]').onclick=()=>{
      closeSupplyProcessMenu();
      supplyProcessPicker.hidden=false;
      renderSupplyProcessPicker('')
    };
    supplyProcessMenu.querySelector('[data-supply-process-choice="create"]').onclick=()=>{
      closeSupplyProcessMenu();
      supplyProcessPicker.hidden=true;
      const id=sheetEditorId('supply-process');
      state.supplyProcesses.push({
        id,
        source:'new',
        processId:'',
        name:'',
        description:'',
        imageFile:null,
        imageUrl:''
      });
      renderSupplyProcessList();
      queueMicrotask(()=>supplyProcessList.querySelector('[data-supply-process-id="'+CSS.escape(id)+'"] [data-supply-process-name]')?.focus())
    };
    renderSupplyPhotos();
    renderSupplyProcessList();
    setSupplyMode('CONSUMABLE')
  }

  supplyTrigger.onclick=()=>toggleCompositionMenu('ingredient');
  supplyMenu.querySelector('[data-composition-choice="existing"]').onclick=()=>{
    closeCompositionMenus();
    existingPicker.hidden=false;
    renderExistingPicker('ingredient','')
  };
  supplyMenu.querySelector('[data-composition-choice="create"]').onclick=()=>openCreateChild('supply');
  if(preparationTrigger&&preparationMenu){
    preparationTrigger.onclick=()=>toggleCompositionMenu('preparation');
    preparationMenu.querySelector('[data-composition-choice="existing"]').onclick=()=>{
      closeCompositionMenus();
      existingPicker.hidden=false;
      renderExistingPicker('preparation','')
    };
    preparationMenu.querySelector('[data-composition-choice="create"]').onclick=()=>openCreateChild('preparation')
  }

  ['keyup','mouseup','input','focus'].forEach(type=>editor.addEventListener(type,rememberMopRange));
  editor.addEventListener('input',()=>{
    if(!state.restoringMopHistory)commitMopHistory()
  });
  editor.addEventListener('blur',()=>setTimeout(()=>{
    if(!mopPicker.matches(':hover')&&!caretPlus.matches(':hover'))caretPlus.hidden=true
  },80));
  mopUndo.onclick=undoMop;
  mopRedo.onclick=redoMop;
  mopSetStep.onclick=establishMopStep;
  mopInfo.onclick=()=>{
    const open=mopInfoWrap.classList.toggle('open');
    mopInfo.setAttribute('aria-expanded',open?'true':'false')
  };
  caretPlus.addEventListener('mousedown',e=>e.preventDefault());
  caretPlus.onclick=()=>{
    hideUnitPicker();
    restoreMopRange();
    renderMopPicker()
  };
  mopPicker.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
  unitPicker.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
  const repositionFloatingPickers=()=>{
    if(state.savedMopRange&&!caretPlus.hidden)positionCaretPlus(state.savedMopRange);
    if(!mopPicker.hidden)positionMopPicker();
    if(!unitPicker.hidden){
      const trigger=list.querySelector('[data-component-id="'+CSS.escape(state.openUnitComponentId)+'"] [data-component-unit-trigger]');
      if(trigger)positionUnitPicker(trigger);else hideUnitPicker()
    }
  };
  editorCanvas?.addEventListener('scroll',repositionFloatingPickers,{passive:true});
  if(editorCanvas)state.cleanups.push(()=>editorCanvas.removeEventListener('scroll',repositionFloatingPickers));
  const onEditorResize=()=>{if(activeSheetEditor===state)repositionFloatingPickers()};
  window.addEventListener('resize',onEditorResize,{passive:true});
  state.cleanups.push(()=>window.removeEventListener('resize',onEditorResize));
  const onEditorSelectionChange=()=>{
    if(activeSheetEditor!==state||state.restoringMopRange)return;
    const selection=window.getSelection();
    if(!selection||!selection.rangeCount)return;
    const range=selection.getRangeAt(0);
    if(editor.contains(range.startContainer)){
      state.savedMopRange=range.cloneRange();
      positionCaretPlus(state.savedMopRange)
    }
  };
  document.addEventListener('selectionchange',onEditorSelectionChange);
  state.cleanups.push(()=>document.removeEventListener('selectionchange',onEditorSelectionChange));
  const onEditorKeydown=e=>{
    if(activeSheetEditor!==state)return;
    if(e.key==='Escape'){
      e.preventDefault();
      sheetEditorClose(state,'escape')
    }
  };
  document.addEventListener('keydown',onEditorKeydown);
  state.cleanups.push(()=>document.removeEventListener('keydown',onEditorKeydown));

  layer.querySelector('[data-sheet-editor-close]').onclick=()=>sheetEditorClose(state,'close-button');
  layer.addEventListener('mousedown',e=>{
    if(e.target===layer){sheetEditorClose(state,'backdrop');return}
    if(isSupplyEditor&&!e.target.closest('[data-supply-process-action]'))closeSupplyProcessMenu();
    if(!e.target.closest('[data-composition-action]'))closeCompositionMenus();
    if(!mopPicker.hidden&&!e.target.closest('[data-mop-picker]')&&!e.target.closest('[data-mop-caret-plus]'))hideMopPicker();
    if(!unitPicker.hidden&&!e.target.closest('.nexoSheetUnitPicker')&&!e.target.closest('[data-component-unit-trigger]'))hideUnitPicker();
    if(!e.target.closest('[data-mop-info-wrap]')){
      mopInfoWrap.classList.remove('open');
      mopInfo.setAttribute('aria-expanded','false')
    }
  });
  renderIngredientList();
  renderMopSteps();
  commitMopHistory();
  queueMicrotask(()=>{
    if(activeSheetEditor===state)title.focus()
  });
  return state
}
function openCreateFlow(){
  if(!canCreate())return;
  sheetEditorTemplate()
}

window.NEXO_FICHAS_NESTED_EDITOR=Object.freeze({
  get depth(){return sheetEditorStack.length},
  get activeKind(){return sheetEditorTop()?.kind||''},
  openChild(kind,options={}){return openNestedSheetEditor(kind,options)},
  closeTop(reason='api'){return sheetEditorClose(sheetEditorTop(),reason)},
  completeTop(payload=null){return sheetEditorComplete(sheetEditorTop(),payload)}
});

function openImport(){
  if(!canImport())return;
  parent.postMessage({type:'NEXO_DM_OPEN_IMPORT',payload:{}},'*');
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
  const p=m?.payload||{};
  if(m?.type==='NEXO_DM_COLLECTION_CREATED'||m?.type==='NEXO_DM_COLLECTION_ERROR'){
    const requestId=String(p.requestId||'');
    const wait=pendingCollectionRequests.get(requestId);
    if(!wait)return;
    clearTimeout(wait.timer);
    pendingCollectionRequests.delete(requestId);
    if(m.type==='NEXO_DM_COLLECTION_CREATED'&&p.ok!==false)wait.resolve(p);
    else wait.reject(new Error(String(p.error||tr('No se pudo crear la colección.','Could not create collection.'))));
    return
  }
  if(m?.type==='MENU_DATA_LOADED')setTimeout(enhanceRoot,0);
});

setTimeout(enhanceRoot,0);
})();