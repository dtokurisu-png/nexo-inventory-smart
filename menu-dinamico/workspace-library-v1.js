(()=>{'use strict';
if(window.__NEXO_WORKSPACE_LIBRARY_V1__)return;window.__NEXO_WORKSPACE_LIBRARY_V1__=true;
if(!window.__NEXO_WORKSPACE_MODE__)return;

const view=document.getElementById('view');
const modalRoot=document.getElementById('modal');
if(!view||!modalRoot)return;

let activeTab='collections';
const pendingCollectionRequests=new Map();
let creatorPhotoObjectUrl='';

const data=()=>window.__NEXO_DM_DATA__||{recipes:[],ingredients:[],collections:[],context:{},capabilities:{}};
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
function hasContent(){return activeRecipes().length>0||activeProducts().length>0}
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
  if(!recipes.length){
    body.innerHTML=emptyState();
    bindActions(body);
    return;
  }
  body.innerHTML='<div class="nexoWorkspaceSheetTools"><label class="nexoWorkspaceSearch">'+icon('busqueda')+'<input class="search" data-nexo-sheet-search inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="'+esc(tr('Buscar receta, ingrediente o preparación…','Search recipe, ingredient or preparation…'))+'"></label><span data-nexo-search-count class="muted" style="font-size:11px"></span></div><div class="grid" data-nexo-sheet-grid>'+recipes.map(sheetCard).join('')+'</div>';
  body.querySelectorAll('[data-workspace-sheet]').forEach(card=>card.onclick=()=>window.NEXO_MENU_API?.openRecipe?.(card.dataset.workspaceSheet));
  const search=body.querySelector('[data-nexo-sheet-search]');
  const count=body.querySelector('[data-nexo-search-count]');
  const applySearch=()=>{
    const q=String(search?.value||'');
    let visible=0;
    body.querySelectorAll('[data-workspace-sheet]').forEach(card=>{
      const recipe=recipes.find(r=>r._id===card.dataset.workspaceSheet);
      const show=recipe?sheetMatches(recipe,q):false;
      card.hidden=!show;
      card.style.display=show?'':'none';
      if(show)visible++;
    });
    if(count)count.textContent=q.trim()?visible+' / '+recipes.length:'';
  };
  if(search){
    ['input','keyup','change','search','compositionend'].forEach(type=>search.addEventListener(type,applySearch));
    search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applySearch();search.blur()}});
  }
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
  scope.querySelectorAll('[data-nexo-create]').forEach(btn=>btn.onclick=openCreateFlow);
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
  nav.innerHTML='<button type="button" data-nexo-tab="collections">'+icon('coleccion')+'<span>'+esc(tr('Colecciones','Collections'))+'</span></button><button type="button" data-nexo-tab="sheets">'+icon('ficha-tecnica')+'<span>'+esc(tr('Fichas técnicas','Technical sheets'))+'</span></button>';

  const body=document.createElement('div');
  body.className='nexoWorkspaceLibraryBody';
  body.dataset.nexoWorkspaceBody='1';

  root.prepend(header,nav,body);
  root.querySelectorAll('[data-nexo-tab]').forEach(btn=>btn.onclick=()=>{activeTab=btn.dataset.nexoTab;renderBody(root)});
  bindActions(header);
  renderBody(root);
}

function revokeCreatorPhotoUrl(){
  if(creatorPhotoObjectUrl){
    try{URL.revokeObjectURL(creatorPhotoObjectUrl)}catch(_){}
    creatorPhotoObjectUrl=''
  }
}
function closeLayer(){
  revokeCreatorPhotoUrl();
  document.getElementById('nexoWorkspaceLibraryLayer')?.remove();
}

function layer(title,body){
  closeLayer();
  const el=document.createElement('div');
  el.id='nexoWorkspaceLibraryLayer';
  el.innerHTML='<div class="nexoWorkspaceModal"><div class="nexoWorkspaceModalHead"><strong>'+esc(title)+'</strong><button type="button" data-nexo-layer-close aria-label="'+esc(tr('Cerrar','Close'))+'">'+icon('cerrar')+'</button></div><div class="nexoWorkspaceModalBody">'+body+'</div></div>';
  document.body.appendChild(el);
  el.querySelector('[data-nexo-layer-close]').onclick=closeLayer;
  el.onclick=e=>{if(e.target===el)closeLayer()};
  return el;
}

function creatorDraftKey(){
  return 'nexo:fichas:create-draft:v1:'+(context().workspaceId||context().id||'workspace');
}
function readCreatorDraft(){
  try{
    const raw=localStorage.getItem(creatorDraftKey());
    const value=raw?JSON.parse(raw):null;
    return value&&typeof value==='object'?value:null
  }catch(_){return null}
}
function saveCreatorDraft(value){
  try{localStorage.setItem(creatorDraftKey(),JSON.stringify(value))}catch(_){}
}
function collectionsForCreator(){
  return (data().collections||[])
    .filter(row=>row&&row.active!==false)
    .sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0)||String(a.name||'').localeCompare(String(b.name||''),'es'))
}
function requestCollectionCreate(input){
  const requestId='collection_create_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>{
      pendingCollectionRequests.delete(requestId);
      reject(new Error(tr('La creación de la colección tardó demasiado.','Collection creation timed out.')))
    },30000);
    pendingCollectionRequests.set(requestId,{resolve,reject,timer});
    parent.postMessage({
      type:'NEXO_DM_CREATE_COLLECTION',
      payload:{requestId,input}
    },'*')
  })
}
function creatorCollectionOptions(selectedId){
  const rows=collectionsForCreator();
  return rows.map(row=>
    '<option value="'+esc(row.id)+'" '+(String(row.id)===String(selectedId)?'selected':'')+'>'+esc(row.name||tr('Colección','Collection'))+'</option>'
  ).join('')
}
function creatorStageOneMarkup(draft={}){
  const rows=collectionsForCreator();
  const requested=String(draft.collectionId||'');
  const hasRequested=rows.some(row=>String(row.id)===requested);
  const selected=hasRequested?requested:(rows[0]?.id||'__new__');
  const newMode=selected==='__new__'||!rows.length;
  const recipeType=String(draft.recipeType||'DISH').toUpperCase()==='SUBRECIPE'?'SUBRECIPE':'DISH';
  return '<form class="nexoCreatorStage" data-nexo-creator-stage-one novalidate>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 1 de 8','Stage 1 of 8'))+'</span><strong>'+esc(tr('Nueva ficha + colección','New sheet + collection'))+'</strong></div>'+
    '<p class="nexoCreatorIntro">'+esc(tr('Define la identidad básica de la ficha. La receta completa no se escribirá en Wix hasta la etapa final.','Define the basic sheet identity. The complete recipe will not be written to Wix until the final stage.'))+'</p>'+
    '<label class="nexoCreatorField"><span>'+esc(tr('Nombre de la ficha','Sheet name'))+'</span><input data-creator-title maxlength="160" autocomplete="off" required value="'+esc(draft.title||'')+'" placeholder="'+esc(tr('Ej. Aderezo César','E.g. Caesar Dressing'))+'"></label>'+
    '<fieldset class="nexoCreatorField nexoCreatorType"><legend>'+esc(tr('Tipo de ficha','Sheet type'))+'</legend>'+
      '<button type="button" data-creator-type="DISH" class="'+(recipeType==='DISH'?'active':'')+'"><strong>'+esc(tr('Plato / producto final','Dish / final product'))+'</strong><small>'+esc(tr('Ficha final que puede usar ingredientes y preparaciones.','Final sheet that can use ingredients and preparations.'))+'</small></button>'+
      '<button type="button" data-creator-type="SUBRECIPE" class="'+(recipeType==='SUBRECIPE'?'active':'')+'"><strong>'+esc(tr('Preparación / subproducto','Preparation / subproduct'))+'</strong><small>'+esc(tr('Preparación reutilizable que después puede vincularse a otros platos.','Reusable preparation that can later be linked to other dishes.'))+'</small></button>'+
      '<input type="hidden" data-creator-recipe-type value="'+esc(recipeType)+'">'+
    '</fieldset>'+
    '<label class="nexoCreatorField"><span>'+esc(tr('Colección','Collection'))+'</span><select data-creator-collection>'+
      creatorCollectionOptions(selected)+
      '<option value="__new__" '+(newMode?'selected':'')+'>'+esc(tr('+ Crear una nueva colección','+ Create a new collection'))+'</option>'+
    '</select></label>'+
    '<div class="nexoCreatorNewCollection" data-creator-new-collection '+(newMode?'':'hidden')+'>'+
      '<label class="nexoCreatorField"><span>'+esc(tr('Nombre de la nueva colección','New collection name'))+'</span><input data-creator-collection-name maxlength="120" autocomplete="off" value="'+esc(draft.pendingCollectionName||'')+'" placeholder="'+esc(tr('Ej. Menú de temporada','E.g. Seasonal menu'))+'"></label>'+
      '<label class="nexoCreatorField"><span>'+esc(tr('Descripción opcional','Optional description'))+'</span><textarea data-creator-collection-description maxlength="1000" rows="3" placeholder="'+esc(tr('Describe qué fichas agrupará esta colección.','Describe what this collection will contain.'))+'">'+esc(draft.pendingCollectionDescription||'')+'</textarea></label>'+
    '</div>'+
    '<div class="nexoCreatorStatus" data-creator-status aria-live="polite"></div>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-creator-cancel>'+esc(tr('Cancelar','Cancel'))+'</button><button type="submit" class="nexoWorkspaceBtn primary" data-creator-continue>'+esc(tr('Continuar','Continue'))+'</button></div>'+
  '</form>'
}
function showStageOneComplete(layerEl,draft){
  const body=layerEl.querySelector('.nexoWorkspaceModalBody');
  if(!body)return;
  body.innerHTML='<div class="nexoCreatorComplete">'+
    '<div class="nexoWorkspaceEmptyIcon">'+icon('ficha-tecnica')+'</div>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 1 de 8','Stage 1 of 8'))+'</span><strong>'+esc(tr('Completada','Complete'))+'</strong></div>'+
    '<h3>'+esc(draft.title)+'</h3>'+
    '<div class="nexoCreatorSummary">'+
      '<div><span>'+esc(tr('Tipo','Type'))+'</span><strong>'+esc(draft.recipeType==='DISH'?tr('Plato / producto final','Dish / final product'):tr('Preparación / subproducto','Preparation / subproduct'))+'</strong></div>'+
      '<div><span>'+esc(tr('Colección','Collection'))+'</span><strong>'+esc(draft.collectionName||draft.collectionId)+'</strong></div>'+
    '</div>'+
    '<p>'+esc(tr('El borrador quedó preparado para la Etapa 2: Editor principal. Todavía no se creó una receta incompleta en Wix.','The draft is ready for Stage 2: Main editor. No incomplete recipe has been created in Wix yet.'))+'</p>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-creator-edit>'+esc(tr('Editar etapa 1','Edit stage 1'))+'</button><button type="button" class="nexoWorkspaceBtn primary" data-creator-stage-two>'+esc(tr('Continuar a etapa 2','Continue to stage 2'))+'</button></div>'+
  '</div>';
  body.querySelector('[data-creator-edit]').onclick=()=>openCreateStageOne();
  body.querySelector('[data-creator-stage-two]').onclick=()=>openCreateStageTwo()
}
function bindCreatorStageOne(layerEl,draft={}){
  const form=layerEl.querySelector('[data-nexo-creator-stage-one]');
  if(!form)return;
  const typeInput=form.querySelector('[data-creator-recipe-type]');
  form.querySelectorAll('[data-creator-type]').forEach(btn=>btn.onclick=()=>{
    form.querySelectorAll('[data-creator-type]').forEach(x=>x.classList.toggle('active',x===btn));
    typeInput.value=btn.dataset.creatorType||'DISH'
  });
  const collectionSelect=form.querySelector('[data-creator-collection]');
  const newCollection=form.querySelector('[data-creator-new-collection]');
  const syncCollectionMode=()=>{newCollection.hidden=collectionSelect.value!=='__new__'};
  collectionSelect.addEventListener('change',syncCollectionMode);
  syncCollectionMode();
  form.querySelector('[data-creator-cancel]').onclick=closeLayer;
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const title=String(form.querySelector('[data-creator-title]')?.value||'').trim();
    const recipeType=String(typeInput.value||'DISH').toUpperCase()==='SUBRECIPE'?'SUBRECIPE':'DISH';
    const status=form.querySelector('[data-creator-status]');
    const submit=form.querySelector('[data-creator-continue]');
    if(!title){
      status.textContent=tr('Escribe el nombre de la ficha.','Enter the sheet name.');
      form.querySelector('[data-creator-title]')?.focus();
      return
    }
    let collectionId=String(collectionSelect.value||'');
    let collectionName='';
    if(collectionId==='__new__'){
      const name=String(form.querySelector('[data-creator-collection-name]')?.value||'').trim();
      const description=String(form.querySelector('[data-creator-collection-description]')?.value||'').trim();
      if(!name){
        status.textContent=tr('Escribe el nombre de la nueva colección.','Enter the new collection name.');
        form.querySelector('[data-creator-collection-name]')?.focus();
        return
      }
      submit.disabled=true;
      status.textContent=tr('Creando colección…','Creating collection…');
      try{
        const result=await requestCollectionCreate({name,description});
        const created=result?.collection||result;
        if(!created?.id)throw new Error(tr('Wix no devolvió la colección creada.','Wix did not return the created collection.'));
        const rows=data().collections||(data().collections=[]);
        if(!rows.some(row=>String(row?.id)===String(created.id)))rows.push({...created,active:created.active!==false});
        collectionId=String(created.id);
        collectionName=String(created.name||name)
      }catch(error){
        submit.disabled=false;
        status.textContent=String(error?.message||error||tr('No se pudo crear la colección.','Could not create collection.'));
        return
      }
    }else{
      const selected=collectionsForCreator().find(row=>String(row.id)===collectionId);
      if(!selected){
        status.textContent=tr('Selecciona una colección válida.','Select a valid collection.');
        return
      }
      collectionName=String(selected.name||collectionId)
    }
    const nextDraft={
      ...draft,
      schemaVersion:2,
      stage:Math.max(1,Number(draft.stage||1)),
      title,
      recipeType,
      collectionId,
      collectionName,
      workspaceId:String(context().workspaceId||''),
      workspaceName:String(context().workspaceName||''),
      updatedAt:new Date().toISOString()
    };
    saveCreatorDraft(nextDraft);
    showStageOneComplete(layerEl,nextDraft)
  })
}
function openCreateStageOne(){
  if(!canCreate())return;
  const draft=readCreatorDraft()||{};
  const el=layer(tr('Crear ficha técnica','Create technical sheet'),creatorStageOneMarkup(draft));
  bindCreatorStageOne(el,draft)
}


function creatorPhotoDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('INDEXED_DB_UNAVAILABLE'));return}
    const request=indexedDB.open('nexo-fichas-creator-drafts',1);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('photos'))db.createObjectStore('photos',{keyPath:'key'})};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('INDEXED_DB_FAILED'))
  })
}
function creatorPhotoKey(){return creatorDraftKey()+':hero'}
async function readCreatorPhoto(){
  const db=await creatorPhotoDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('photos','readonly');
    const req=tx.objectStore('photos').get(creatorPhotoKey());
    req.onsuccess=()=>resolve(req.result||null);
    req.onerror=()=>reject(req.error||new Error('PHOTO_DRAFT_READ_FAILED'));
    tx.oncomplete=()=>db.close()
  })
}
async function saveCreatorPhoto(file){
  const db=await creatorPhotoDb();
  const row={key:creatorPhotoKey(),blob:file,name:String(file?.name||'photo'),type:String(file?.type||'image/jpeg'),size:Number(file?.size||0),updatedAt:new Date().toISOString()};
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('photos','readwrite');
    tx.objectStore('photos').put(row);
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error||new Error('PHOTO_DRAFT_SAVE_FAILED'));
    tx.onabort=()=>reject(tx.error||new Error('PHOTO_DRAFT_SAVE_FAILED'))
  });
  db.close();
  return row
}
async function deleteCreatorPhoto(){
  try{
    const db=await creatorPhotoDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('photos','readwrite');
      tx.objectStore('photos').delete(creatorPhotoKey());
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error||new Error('PHOTO_DRAFT_DELETE_FAILED'))
    });
    db.close()
  }catch(_){}
}
function creatorUnitPair(value){
  const raw=String(value||'').trim();
  const key=searchNorm(raw);
  const pairs={
    'u':{es:'u',en:'ea'},'unidad':{es:'u',en:'ea'},'unidades':{es:'u',en:'ea'},'ea':{es:'u',en:'ea'},'each':{es:'u',en:'ea'},
    'porcion':{es:'porciones',en:'servings'},'porciones':{es:'porciones',en:'servings'},'serving':{es:'porciones',en:'servings'},'servings':{es:'porciones',en:'servings'}
  };
  return pairs[key]||{es:raw,en:raw}
}
function creatorCategorySuggestions(){
  return [...new Set((data().recipes||[]).map(row=>String(row?.category||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'))
}
function creatorUnitSuggestions(){
  return ['g','kg','ml','l','qt','gal','lb','oz','u','ea','porciones','servings']
}
function stageTwoDefaults(draft){
  const originalLanguage=String(draft.originalLanguage||lang()).toLowerCase()==='en'?'en':'es';
  let titleEs=String(draft.titleEs||'');
  let titleEn=String(draft.titleEn||'');
  if(!titleEs&&!titleEn&&draft.title){
    if(originalLanguage==='en')titleEn=String(draft.title);
    else titleEs=String(draft.title)
  }
  return {...draft,originalLanguage,titleEs,titleEn}
}
function creatorStageTwoMarkup(rawDraft={}){
  const draft=stageTwoDefaults(rawDraft);
  const yieldQty=draft.yieldQty===null||draft.yieldQty===undefined?'':String(draft.yieldQty);
  const yieldUnit=String(draft.yieldUnitEs||draft.yieldUnitEn||'');
  const categories=creatorCategorySuggestions().map(value=>'<option value="'+esc(value)+'"></option>').join('');
  const units=creatorUnitSuggestions().map(value=>'<option value="'+esc(value)+'"></option>').join('');
  return '<form class="nexoCreatorStage nexoCreatorStageTwo" data-nexo-creator-stage-two novalidate>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 2 de 8','Stage 2 of 8'))+'</span><strong>'+esc(tr('Editor principal','Main editor'))+'</strong></div>'+
    '<div class="nexoCreatorStageSummary"><span>'+esc(rawDraft.recipeType==='SUBRECIPE'?tr('Preparación / subproducto','Preparation / subproduct'):tr('Plato / producto final','Dish / final product'))+'</span><strong>'+esc(rawDraft.collectionName||rawDraft.collectionId||'')+'</strong></div>'+
    '<div class="nexoCreatorEditorGrid">'+
      '<section class="nexoCreatorPhotoPanel">'+
        '<div class="nexoCreatorPhotoPreview" data-creator-photo-preview><div class="nexoCreatorPhotoEmpty">'+icon('foto')+'<span>'+esc(tr('Sin foto de portada','No cover photo'))+'</span></div></div>'+
        '<input type="file" accept="image/*" data-creator-photo-input hidden>'+
        '<div class="nexoCreatorPhotoActions"><button type="button" class="nexoWorkspaceBtn" data-creator-photo-pick>'+esc(tr('Elegir foto','Choose photo'))+'</button><button type="button" class="nexoWorkspaceBtn" data-creator-photo-remove hidden>'+esc(tr('Quitar','Remove'))+'</button></div>'+
        '<small>'+esc(tr('La imagen queda en este borrador local y se subirá a Wix al publicar la ficha en la Etapa 8.','The image stays in this local draft and will upload to Wix when the sheet is published in Stage 8.'))+'</small>'+
      '</section>'+
      '<section class="nexoCreatorMainFields">'+
        '<label class="nexoCreatorField"><span>'+esc(tr('Nombre en español','Name in Spanish'))+'</span><input data-creator-title-es maxlength="160" autocomplete="off" value="'+esc(draft.titleEs)+'" placeholder="'+esc(tr('Ej. Aderezo César','E.g. Aderezo César'))+'"></label>'+
        '<label class="nexoCreatorField"><span>'+esc(tr('Nombre en inglés','Name in English'))+'</span><input data-creator-title-en maxlength="160" autocomplete="off" value="'+esc(draft.titleEn)+'" placeholder="E.g. Caesar Dressing"></label>'+
        '<div class="nexoCreatorTwoCols">'+
          '<label class="nexoCreatorField"><span>'+esc(tr('Idioma original','Original language'))+'</span><select data-creator-original-language><option value="es" '+(draft.originalLanguage==='es'?'selected':'')+'>Español</option><option value="en" '+(draft.originalLanguage==='en'?'selected':'')+'>English</option></select></label>'+
          '<label class="nexoCreatorField"><span>'+esc(tr('Categoría','Category'))+'</span><input data-creator-category list="nexoCreatorCategories" maxlength="100" value="'+esc(draft.category||'')+'" placeholder="'+esc(rawDraft.recipeType==='SUBRECIPE'?tr('Preparación','Preparation'):tr('Plato principal, guarnición…','Entrée, side…'))+'"><datalist id="nexoCreatorCategories">'+categories+'</datalist></label>'+
        '</div>'+
        '<div class="nexoCreatorTwoCols">'+
          '<label class="nexoCreatorField"><span>'+esc(tr('Rendimiento / cantidad final','Yield / final quantity'))+'</span><input data-creator-yield-qty type="number" min="0" step="any" inputmode="decimal" value="'+esc(yieldQty)+'" placeholder="0"></label>'+
          '<label class="nexoCreatorField"><span>'+esc(tr('Unidad del rendimiento','Yield unit'))+'</span><input data-creator-yield-unit list="nexoCreatorUnits" maxlength="40" value="'+esc(yieldUnit)+'" placeholder="g, qt, u…"><datalist id="nexoCreatorUnits">'+units+'</datalist></label>'+
        '</div>'+
        '<label class="nexoCreatorField"><span>'+esc(tr('Notas generales en español','General notes in Spanish'))+'</span><textarea data-creator-notes-es maxlength="4000" rows="4" placeholder="'+esc(tr('Notas generales de la ficha. El MOP se construirá en la Etapa 7.','General sheet notes. The MOP will be built in Stage 7.'))+'">'+esc(draft.notesEs||'')+'</textarea></label>'+
        '<label class="nexoCreatorField"><span>'+esc(tr('Notas generales en inglés','General notes in English'))+'</span><textarea data-creator-notes-en maxlength="4000" rows="4" placeholder="General sheet notes. The MOP will be built in Stage 7.">'+esc(draft.notesEn||'')+'</textarea></label>'+
      '</section>'+
    '</div>'+
    '<div class="nexoCreatorStatus" data-creator-status aria-live="polite"></div>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-creator-back-one>'+esc(tr('← Etapa 1','← Stage 1'))+'</button><button type="button" class="nexoWorkspaceBtn" data-creator-close>'+esc(tr('Guardar y cerrar','Save & close'))+'</button><button type="submit" class="nexoWorkspaceBtn primary">'+esc(tr('Guardar y continuar','Save & continue'))+'</button></div>'+
  '</form>'
}
function applyCreatorPhotoPreview(preview,row){
  revokeCreatorPhotoUrl();
  const remove=preview?.closest('.nexoCreatorPhotoPanel')?.querySelector('[data-creator-photo-remove]');
  if(!preview)return;
  if(row?.blob){
    creatorPhotoObjectUrl=URL.createObjectURL(row.blob);
    preview.innerHTML='<img src="'+esc(creatorPhotoObjectUrl)+'" alt="">';
    if(remove)remove.hidden=false
  }else{
    preview.innerHTML='<div class="nexoCreatorPhotoEmpty">'+icon('foto')+'<span>'+esc(tr('Sin foto de portada','No cover photo'))+'</span></div>';
    if(remove)remove.hidden=true
  }
}
async function hydrateCreatorPhoto(layerEl){
  const preview=layerEl.querySelector('[data-creator-photo-preview]');
  try{applyCreatorPhotoPreview(preview,await readCreatorPhoto())}catch(_){applyCreatorPhotoPreview(preview,null)}
}
function saveStageTwoFromForm(form,draft){
  const originalLanguage=String(form.querySelector('[data-creator-original-language]')?.value||'es')==='en'?'en':'es';
  const titleEs=String(form.querySelector('[data-creator-title-es]')?.value||'').trim();
  const titleEn=String(form.querySelector('[data-creator-title-en]')?.value||'').trim();
  const status=form.querySelector('[data-creator-status]');
  if(!titleEs&&!titleEn){
    status.textContent=tr('Escribe al menos un nombre para la ficha.','Enter at least one sheet name.');
    (originalLanguage==='en'?form.querySelector('[data-creator-title-en]'):form.querySelector('[data-creator-title-es]'))?.focus();
    return null
  }
  const qtyRaw=String(form.querySelector('[data-creator-yield-qty]')?.value||'').trim();
  const quantity=qtyRaw===''?null:Number(qtyRaw);
  if(qtyRaw!==''&&(!Number.isFinite(quantity)||quantity<0)){
    status.textContent=tr('El rendimiento debe ser un número válido.','Yield must be a valid number.');
    form.querySelector('[data-creator-yield-qty]')?.focus();
    return null
  }
  const unitPair=creatorUnitPair(form.querySelector('[data-creator-yield-unit]')?.value||'');
  const primaryTitle=originalLanguage==='en'?(titleEn||titleEs):(titleEs||titleEn);
  const next={
    ...draft,
    schemaVersion:2,
    stage:2,
    title:primaryTitle,
    titleEs,
    titleEn,
    originalLanguage,
    category:String(form.querySelector('[data-creator-category]')?.value||'').trim(),
    yieldQty:quantity,
    yieldUnitEs:unitPair.es,
    yieldUnitEn:unitPair.en,
    notesEs:String(form.querySelector('[data-creator-notes-es]')?.value||'').trim(),
    notesEn:String(form.querySelector('[data-creator-notes-en]')?.value||'').trim(),
    updatedAt:new Date().toISOString()
  };
  saveCreatorDraft(next);
  return next
}
function showStageTwoComplete(layerEl,draft){
  const body=layerEl.querySelector('.nexoWorkspaceModalBody');
  if(!body)return;
  const title=draft.originalLanguage==='en'?(draft.titleEn||draft.titleEs):(draft.titleEs||draft.titleEn);
  const yieldText=draft.yieldQty===null||draft.yieldQty===undefined||draft.yieldQty===''?tr('Sin definir','Not set'):[draft.yieldQty,draft.yieldUnitEs||draft.yieldUnitEn].filter(Boolean).join(' ');
  body.innerHTML='<div class="nexoCreatorComplete">'+
    '<div class="nexoWorkspaceEmptyIcon">'+icon('ficha-tecnica')+'</div>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 2 de 8','Stage 2 of 8'))+'</span><strong>'+esc(tr('Completada','Complete'))+'</strong></div>'+
    '<h3>'+esc(title||draft.title)+'</h3>'+
    '<div class="nexoCreatorSummary"><div><span>'+esc(tr('Categoría','Category'))+'</span><strong>'+esc(draft.category||tr('Sin definir','Not set'))+'</strong></div><div><span>'+esc(tr('Rendimiento','Yield'))+'</span><strong>'+esc(yieldText)+'</strong></div></div>'+
    '<p>'+esc(tr('La cabecera de la ficha quedó guardada en el borrador. La Etapa 3 añadirá los ingredientes existentes o nuevos.','The sheet header is saved in the draft. Stage 3 will add existing or new ingredients.'))+'</p>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-creator-edit-two>'+esc(tr('Editar etapa 2','Edit stage 2'))+'</button><button type="button" class="nexoWorkspaceBtn primary" data-creator-close>'+esc(tr('Listo','Done'))+'</button></div>'+
  '</div>';
  body.querySelector('[data-creator-edit-two]').onclick=()=>openCreateStageTwo();
  body.querySelector('[data-creator-close]').onclick=closeLayer
}
function bindCreatorStageTwo(layerEl,draft){
  const form=layerEl.querySelector('[data-nexo-creator-stage-two]');
  if(!form)return;
  const fileInput=form.querySelector('[data-creator-photo-input]');
  const preview=form.querySelector('[data-creator-photo-preview]');
  const remove=form.querySelector('[data-creator-photo-remove]');
  form.querySelector('[data-creator-photo-pick]').onclick=()=>fileInput.click();
  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files?.[0];
    const status=form.querySelector('[data-creator-status]');
    if(!file)return;
    if(!String(file.type||'').startsWith('image/')){
      status.textContent=tr('Selecciona un archivo de imagen válido.','Select a valid image file.');
      fileInput.value='';
      return
    }
    if(Number(file.size||0)>15*1024*1024){
      status.textContent=tr('La foto no puede superar 15 MB.','Photo cannot exceed 15 MB.');
      fileInput.value='';
      return
    }
    status.textContent=tr('Guardando foto en el borrador…','Saving photo to draft…');
    try{
      const row=await saveCreatorPhoto(file);
      const next={...readCreatorDraft(),heroDraft:{name:row.name,type:row.type,size:row.size,updatedAt:row.updatedAt},updatedAt:new Date().toISOString()};
      saveCreatorDraft(next);
      applyCreatorPhotoPreview(preview,row);
      status.textContent=tr('Foto guardada en el borrador.','Photo saved in draft.')
    }catch(error){
      status.textContent=String(error?.message||error||tr('No se pudo guardar la foto.','Could not save photo.'))
    }finally{fileInput.value=''}
  });
  remove.onclick=async()=>{
    await deleteCreatorPhoto();
    const current=readCreatorDraft()||draft;
    delete current.heroDraft;
    current.updatedAt=new Date().toISOString();
    saveCreatorDraft(current);
    applyCreatorPhotoPreview(preview,null)
  };
  form.querySelector('[data-creator-back-one]').onclick=()=>openCreateStageOne();
  form.querySelector('[data-creator-close]').onclick=()=>{
    const next=saveStageTwoFromForm(form,readCreatorDraft()||draft);
    if(next)closeLayer()
  };
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const next=saveStageTwoFromForm(form,readCreatorDraft()||draft);
    if(next)showStageTwoComplete(layerEl,next)
  });
  hydrateCreatorPhoto(layerEl)
}
function openCreateStageTwo(){
  if(!canCreate())return;
  const draft=readCreatorDraft()||{};
  if(!draft.title||!draft.collectionId){openCreateStageOne();return}
  const el=layer(tr('Crear ficha técnica','Create technical sheet'),creatorStageTwoMarkup(draft));
  bindCreatorStageTwo(el,draft)
}
function openCreateFlow(){
  if(!canCreate())return;
  const draft=readCreatorDraft();
  if(draft&&Number(draft.stage||0)>=2&&draft.title&&draft.collectionId){openCreateStageTwo();return}
  openCreateStageOne()
}

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
  if(!m?.type)return;
  if(m.type==='NEXO_DM_COLLECTION_CREATED'||m.type==='NEXO_DM_COLLECTION_ERROR'){
    const p=m.payload||{};
    const wait=pendingCollectionRequests.get(String(p.requestId||''));
    if(wait){
      clearTimeout(wait.timer);
      pendingCollectionRequests.delete(String(p.requestId||''));
      if(m.type==='NEXO_DM_COLLECTION_CREATED'&&p.ok!==false)wait.resolve(p.collection||p.data||p);
      else wait.reject(new Error(String(p.error||tr('No se pudo crear la colección.','Could not create collection.'))))
    }
    return
  }
  if(m.type==='MENU_DATA_LOADED')setTimeout(enhanceRoot,0);
});

setTimeout(enhanceRoot,0);
})();