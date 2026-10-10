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
    if(lang()==='en')nextDraft.titleEn=title;else nextDraft.titleEs=title;
    if(!nextDraft.originalLanguage)nextDraft.originalLanguage=lang();
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
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-creator-edit-two>'+esc(tr('Editar etapa 2','Edit stage 2'))+'</button><button type="button" class="nexoWorkspaceBtn primary" data-creator-stage-three>'+esc(tr('Continuar a etapa 3','Continue to stage 3'))+'</button></div>'+
  '</div>';
  body.querySelector('[data-creator-edit-two]').onclick=()=>openCreateStageTwo();
  body.querySelector('[data-creator-stage-three]').onclick=()=>openCreateStageThree()
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
  el.querySelector('.nexoWorkspaceModal')?.classList.add('nexoCreatorModalWide');
  bindCreatorStageTwo(el,draft)
}

function creatorDraftId(prefix='draft'){
  try{return prefix+'-'+crypto.randomUUID()}catch(_){return prefix+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,10)}
}
function creatorExistingIngredients(){
  return (data().ingredients||[])
    .filter(row=>row&&row.active!==false)
    .sort((a,b)=>{
      const an=String((lang()==='en'?(a.nameEn||a.nameEs):(a.nameEs||a.nameEn))||'');
      const bn=String((lang()==='en'?(b.nameEn||b.nameEs):(b.nameEs||b.nameEn))||'');
      return an.localeCompare(bn,lang()==='en'?'en':'es')
    })
}
function creatorIngredientName(row){
  return String(lang()==='en'?(row?.nameEn||row?.nameEs||''):(row?.nameEs||row?.nameEn||''))
}
function creatorIngredientSearchCorpus(row){
  return searchNorm([row?.nameEs,row?.nameEn,row?.descriptionEs,row?.descriptionEn].filter(Boolean).join(' '))
}
function creatorIngredientMatches(row,query){
  const q=searchNorm(query);
  if(!q)return false;
  return q.split(' ').filter(Boolean).every(token=>creatorIngredientSearchCorpus(row).includes(token))
}
function creatorIngredientComponents(draft){
  return (Array.isArray(draft?.components)?draft.components:[])
    .filter(row=>row&&String(row.componentType||'').toUpperCase()==='INGREDIENT')
    .sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0))
}
function creatorComponentDisplay(row){
  if(row?.ingredientSource==='new'){
    const ing=row.newIngredient||{};
    return String(lang()==='en'?(ing.nameEn||ing.nameEs||''):(ing.nameEs||ing.nameEn||''))
  }
  const found=creatorExistingIngredients().find(ing=>String(ing._id||ing.id||'')===String(row?.targetIngredientId||''));
  return creatorIngredientName(found)||String(lang()==='en'?(row?.displayEn||row?.displayEs||''):(row?.displayEs||row?.displayEn||''))||tr('Ingrediente','Ingredient')
}
function creatorIngredientImage(row){
  const found=creatorExistingIngredients().find(ing=>String(ing._id||ing.id||'')===String(row?.targetIngredientId||''));
  if(!found)return '';
  const images=Array.isArray(found.images)?found.images:[];
  return img(images[0]||found.baseImage||'')
}
function creatorNormalizeComponentUnit(raw){
  const pair=creatorUnitPair(raw);
  return {es:pair.es,en:pair.en}
}
function creatorStageThreeMarkup(draft={}){
  const count=creatorIngredientComponents(draft).length;
  return '<form class="nexoCreatorStage nexoCreatorStageThree" data-nexo-creator-stage-three novalidate>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 3 de 8','Stage 3 of 8'))+'</span><strong>'+esc(tr('Ingredientes existentes o nuevos','Existing or new ingredients'))+'</strong></div>'+
    '<div class="nexoCreatorStageSummary"><span>'+esc(draft.title||draft.titleEs||draft.titleEn||'')+'</span><strong data-creator-ingredient-count>'+count+' '+esc(tr(count===1?'ingrediente':'ingredientes',count===1?'ingredient':'ingredients'))+'</strong></div>'+
    '<p class="nexoCreatorIntro">'+esc(tr('Agrega los insumos base de esta ficha. Las preparaciones reutilizables se manejan en la Etapa 4.','Add the base ingredients for this sheet. Reusable preparations are handled in Stage 4.'))+'</p>'+
    '<section class="nexoCreatorIngredientAdd">'+
      '<div class="nexoCreatorIngredientSearchBox">'+
        '<label class="nexoCreatorField"><span>'+esc(tr('Buscar ingrediente existente','Search existing ingredient'))+'</span><input data-creator-ingredient-search autocomplete="off" placeholder="'+esc(tr('Escribe cebolla, tomate, harina…','Type onion, tomato, flour…'))+'"></label>'+
        '<div class="nexoCreatorIngredientResults" data-creator-ingredient-results><p>'+esc(tr('Escribe para buscar entre los ingredientes disponibles en este Workspace.','Type to search ingredients available in this Workspace.'))+'</p></div>'+
      '</div>'+
      '<div class="nexoCreatorIngredientOr"><span>'+esc(tr('o','or'))+'</span></div>'+
      '<div class="nexoCreatorNewIngredient">'+
        '<button type="button" class="nexoWorkspaceBtn wide" data-creator-new-ingredient-toggle>'+icon('nuevo')+'<span>'+esc(tr('Crear ingrediente nuevo','Create new ingredient'))+'</span></button>'+
        '<div class="nexoCreatorNewIngredientForm" data-creator-new-ingredient-form hidden>'+
          '<div class="nexoCreatorTwoCols">'+
            '<label class="nexoCreatorField"><span>'+esc(tr('Nombre en español','Name in Spanish'))+'</span><input data-new-ingredient-es maxlength="160" autocomplete="off"></label>'+
            '<label class="nexoCreatorField"><span>'+esc(tr('Nombre en inglés','Name in English'))+'</span><input data-new-ingredient-en maxlength="160" autocomplete="off"></label>'+
          '</div>'+
          '<div class="nexoCreatorTwoCols">'+
            '<label class="nexoCreatorField"><span>'+esc(tr('Descripción en español · opcional','Description in Spanish · optional'))+'</span><textarea data-new-ingredient-description-es maxlength="1000" rows="2"></textarea></label>'+
            '<label class="nexoCreatorField"><span>'+esc(tr('Descripción en inglés · opcional','Description in English · optional'))+'</span><textarea data-new-ingredient-description-en maxlength="1000" rows="2"></textarea></label>'+
          '</div>'+
          '<button type="button" class="nexoWorkspaceBtn primary" data-creator-add-new-ingredient>'+esc(tr('Añadir ingrediente nuevo','Add new ingredient'))+'</button>'+
        '</div>'+
      '</div>'+
    '</section>'+
    '<section class="nexoCreatorIngredientListWrap">'+
      '<div class="nexoCreatorIngredientListHead"><strong>'+esc(tr('Ingredientes de la ficha','Sheet ingredients'))+'</strong><span>'+esc(tr('Cantidad, unidad y nota pueden editarse aquí.','Quantity, unit and note can be edited here.'))+'</span></div>'+
      '<div class="nexoCreatorIngredientList" data-creator-ingredient-list></div>'+
    '</section>'+
    '<div class="nexoCreatorStatus" data-creator-status aria-live="polite"></div>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-creator-back-two>'+esc(tr('← Etapa 2','← Stage 2'))+'</button><button type="button" class="nexoWorkspaceBtn" data-creator-save-close>'+esc(tr('Guardar y cerrar','Save & close'))+'</button><button type="submit" class="nexoWorkspaceBtn primary">'+esc(tr('Guardar y continuar','Save & continue'))+'</button></div>'+
  '</form>'
}
function creatorStageThreeRow(row,index,total){
  const name=creatorComponentDisplay(row);
  const image=creatorIngredientImage(row);
  const source=row.ingredientSource==='new'?tr('Nuevo','New'):tr('Existente','Existing');
  const qty=row.quantity===null||row.quantity===undefined?'':String(row.quantity);
  const unit=String(row.unitEs||row.unitEn||'');
  return '<article class="nexoCreatorIngredientRow" data-creator-component-id="'+esc(row.draftId)+'">'+
    '<div class="nexoCreatorIngredientIdentity">'+
      '<div class="nexoCreatorIngredientThumb">'+(image?'<img src="'+esc(image)+'" alt="">':icon(row.ingredientSource==='new'?'nuevo':'productos'))+'</div>'+
      '<div><span class="nexoCreatorIngredientSource">'+esc(source)+'</span><strong>'+esc(name)+'</strong></div>'+
      '<div class="nexoCreatorIngredientOrder">'+
        '<button type="button" data-ingredient-up title="'+esc(tr('Subir','Move up'))+'" '+(index===0?'disabled':'')+'>↑</button>'+
        '<button type="button" data-ingredient-down title="'+esc(tr('Bajar','Move down'))+'" '+(index===total-1?'disabled':'')+'>↓</button>'+
        '<button type="button" data-ingredient-remove title="'+esc(tr('Eliminar','Remove'))+'">×</button>'+
      '</div>'+
    '</div>'+
    '<div class="nexoCreatorIngredientFields">'+
      '<label class="nexoCreatorField"><span>'+esc(tr('Cantidad','Quantity'))+'</span><input data-ingredient-quantity type="number" min="0" step="any" inputmode="decimal" value="'+esc(qty)+'" placeholder="0"></label>'+
      '<label class="nexoCreatorField"><span>'+esc(tr('Unidad','Unit'))+'</span><input data-ingredient-unit maxlength="40" value="'+esc(unit)+'" placeholder="g, ml, oz…"></label>'+
      '<label class="nexoCreatorField nexoCreatorIngredientNote"><span>'+esc(tr('Nota ES','Note ES'))+'</span><input data-ingredient-note-es maxlength="500" value="'+esc(row.noteEs||'')+'" placeholder="'+esc(tr('Ej. picado fino','E.g. finely chopped'))+'"></label>'+
      '<label class="nexoCreatorField nexoCreatorIngredientNote"><span>'+esc(tr('Nota EN','Note EN'))+'</span><input data-ingredient-note-en maxlength="500" value="'+esc(row.noteEn||'')+'" placeholder="E.g. finely chopped"></label>'+
    '</div>'+
  '</article>'
}
function creatorCurrentComponents(){
  const draft=readCreatorDraft()||{};
  return Array.isArray(draft.components)?draft.components:[]
}
function saveCreatorComponents(ingredients,{complete=false}={}){
  const draft=readCreatorDraft()||{};
  const current=(Array.isArray(draft.components)?draft.components:[]).slice().sort((a,b)=>Number(a?.sortOrder||0)-Number(b?.sortOrder||0));
  const remaining=ingredients.map(row=>({...row,componentType:'INGREDIENT'}));
  const merged=[];
  current.forEach(row=>{
    if(String(row?.componentType||'').toUpperCase()!=='INGREDIENT'){merged.push(row);return}
    const next=remaining.shift();
    if(next)merged.push(next)
  });
  merged.push(...remaining);
  const ordered=merged.map((row,index)=>({...row,sortOrder:index+1}));
  const next={...draft,components:ordered,stage:Math.max(3,Number(draft.stage||0)),stage3Complete:complete===true?true:draft.stage3Complete===true,schemaVersion:Math.max(3,Number(draft.schemaVersion||0)),updatedAt:new Date().toISOString()};
  saveCreatorDraft(next);
  return next
}
function readStageThreeRows(form){
  const draft=readCreatorDraft()||{};
  const previous=new Map(creatorIngredientComponents(draft).map(row=>[String(row.draftId),row]));
  const rows=[];
  form.querySelectorAll('[data-creator-component-id]').forEach((el,index)=>{
    const id=String(el.dataset.creatorComponentId||'');
    const base=previous.get(id);
    if(!base)return;
    const qtyRaw=String(el.querySelector('[data-ingredient-quantity]')?.value||'').trim();
    const quantity=qtyRaw===''?null:Number(qtyRaw);
    const unit=creatorNormalizeComponentUnit(el.querySelector('[data-ingredient-unit]')?.value||'');
    rows.push({
      ...base,
      componentType:'INGREDIENT',
      quantity:Number.isFinite(quantity)?quantity:null,
      unitEs:unit.es,
      unitEn:unit.en,
      noteEs:String(el.querySelector('[data-ingredient-note-es]')?.value||'').trim(),
      noteEn:String(el.querySelector('[data-ingredient-note-en]')?.value||'').trim(),
      sortOrder:index+1
    })
  });
  return rows
}
function renderStageThreeRows(form){
  const list=form.querySelector('[data-creator-ingredient-list]');
  const countEl=form.querySelector('[data-creator-ingredient-count]');
  const rows=creatorIngredientComponents(readCreatorDraft()||{});
  if(countEl)countEl.textContent=rows.length+' '+tr(rows.length===1?'ingrediente':'ingredientes',rows.length===1?'ingredient':'ingredients');
  if(!list)return;
  if(!rows.length){
    list.innerHTML='<div class="nexoCreatorIngredientEmpty">'+icon('productos')+'<p>'+esc(tr('Todavía no has añadido ingredientes.','No ingredients added yet.'))+'</p></div>';
    return
  }
  list.innerHTML=rows.map((row,index)=>creatorStageThreeRow(row,index,rows.length)).join('');
  list.querySelectorAll('[data-creator-component-id]').forEach(el=>{
    ['input','change'].forEach(type=>el.addEventListener(type,()=>{
      const updated=readStageThreeRows(form);
      saveCreatorComponents(updated)
    }));
    el.querySelector('[data-ingredient-remove]').onclick=()=>{
      const id=String(el.dataset.creatorComponentId||'');
      const updated=creatorIngredientComponents(readCreatorDraft()||{}).filter(row=>String(row.draftId)!==id);
      saveCreatorComponents(updated);
      renderStageThreeRows(form)
    };
    el.querySelector('[data-ingredient-up]').onclick=()=>{
      const id=String(el.dataset.creatorComponentId||'');
      const rows=creatorIngredientComponents(readCreatorDraft()||{});
      const index=rows.findIndex(row=>String(row.draftId)===id);
      if(index>0){[rows[index-1],rows[index]]=[rows[index],rows[index-1]];saveCreatorComponents(rows);renderStageThreeRows(form)}
    };
    el.querySelector('[data-ingredient-down]').onclick=()=>{
      const id=String(el.dataset.creatorComponentId||'');
      const rows=creatorIngredientComponents(readCreatorDraft()||{});
      const index=rows.findIndex(row=>String(row.draftId)===id);
      if(index>=0&&index<rows.length-1){[rows[index],rows[index+1]]=[rows[index+1],rows[index]];saveCreatorComponents(rows);renderStageThreeRows(form)}
    }
  })
}
function addExistingCreatorIngredient(form,ingredient){
  const id=String(ingredient?._id||ingredient?.id||'');
  if(!id)return;
  const nameEs=String(ingredient.nameEs||'');
  const nameEn=String(ingredient.nameEn||'');
  const rows=creatorIngredientComponents(readCreatorDraft()||{});
  rows.push({
    draftId:creatorDraftId('component'),
    componentType:'INGREDIENT',
    ingredientSource:'existing',
    targetIngredientId:id,
    targetPreparationId:'',
    targetRecipeId:'',
    quantity:null,
    unitEs:'',
    unitEn:'',
    displayEs:nameEs||nameEn,
    displayEn:nameEn||nameEs,
    noteEs:'',
    noteEn:'',
    sortOrder:rows.length+1
  });
  saveCreatorComponents(rows);
  renderStageThreeRows(form);
  const search=form.querySelector('[data-creator-ingredient-search]');
  if(search){search.value='';renderIngredientSearchResults(form,'')}
}
function renderIngredientSearchResults(form,query){
  const box=form.querySelector('[data-creator-ingredient-results]');
  if(!box)return;
  const q=String(query||'').trim();
  if(!q){
    box.innerHTML='<p>'+esc(tr('Escribe para buscar entre los ingredientes disponibles en este Workspace.','Type to search ingredients available in this Workspace.'))+'</p>';
    return
  }
  const matches=creatorExistingIngredients().filter(row=>creatorIngredientMatches(row,q)).slice(0,12);
  if(!matches.length){
    box.innerHTML='<p>'+esc(tr('No hay coincidencias. Puedes crear este ingrediente como nuevo.','No matches. You can create this as a new ingredient.'))+'</p>';
    return
  }
  box.innerHTML=matches.map(row=>{
    const id=String(row._id||row.id||'');
    const name=creatorIngredientName(row);
    const sub=lang()==='en'?(row.nameEs||''):(row.nameEn||'');
    const image=img((Array.isArray(row.images)?row.images[0]:null)||row.baseImage||'');
    return '<button type="button" data-existing-ingredient="'+esc(id)+'">'+
      '<span class="nexoCreatorIngredientSearchThumb">'+(image?'<img src="'+esc(image)+'" alt="">':icon('productos'))+'</span>'+
      '<span><strong>'+esc(name)+'</strong>'+(sub&&sub!==name?'<small>'+esc(sub)+'</small>':'')+'</span>'+
      '<b>'+esc(tr('Añadir','Add'))+'</b>'+
    '</button>'
  }).join('');
  box.querySelectorAll('[data-existing-ingredient]').forEach(btn=>btn.onclick=()=>{
    const ingredient=creatorExistingIngredients().find(row=>String(row._id||row.id||'')===String(btn.dataset.existingIngredient||''));
    if(ingredient)addExistingCreatorIngredient(form,ingredient)
  })
}
function addNewCreatorIngredient(form){
  const status=form.querySelector('[data-creator-status]');
  const nameEs=String(form.querySelector('[data-new-ingredient-es]')?.value||'').trim();
  const nameEn=String(form.querySelector('[data-new-ingredient-en]')?.value||'').trim();
  if(!nameEs&&!nameEn){
    status.textContent=tr('Escribe al menos un nombre para el ingrediente nuevo.','Enter at least one name for the new ingredient.');
    return
  }
  const names=[nameEs,nameEn].filter(Boolean).map(searchNorm);
  const existing=creatorExistingIngredients().find(row=>{
    const rowNames=[row.nameEs,row.nameEn].filter(Boolean).map(searchNorm);
    return names.some(name=>rowNames.includes(name))
  });
  if(existing){
    status.textContent=tr('Ese ingrediente ya existe. Añádelo desde la búsqueda para evitar duplicados.','That ingredient already exists. Add it from search to avoid duplicates.');
    return
  }
  const draft=readCreatorDraft()||{};
  const duplicateNew=creatorIngredientComponents(draft).some(row=>{
    if(row.ingredientSource!=='new')return false;
    const ing=row.newIngredient||{};
    const rowNames=[ing.nameEs,ing.nameEn].filter(Boolean).map(searchNorm);
    return names.some(name=>rowNames.includes(name))
  });
  if(duplicateNew){
    status.textContent=tr('Ese ingrediente nuevo ya está en esta ficha.','That new ingredient is already in this sheet.');
    return
  }
  const localIngredientId=creatorDraftId('ingredient');
  const newIngredient={
    draftId:localIngredientId,
    nameEs:nameEs||nameEn,
    nameEn:nameEn||nameEs,
    descriptionEs:String(form.querySelector('[data-new-ingredient-description-es]')?.value||'').trim(),
    descriptionEn:String(form.querySelector('[data-new-ingredient-description-en]')?.value||'').trim()
  };
  const rows=creatorIngredientComponents(draft);
  rows.push({
    draftId:creatorDraftId('component'),
    componentType:'INGREDIENT',
    ingredientSource:'new',
    targetIngredientId:'',
    targetPreparationId:'',
    targetRecipeId:'',
    newIngredient,
    quantity:null,
    unitEs:'',
    unitEn:'',
    displayEs:newIngredient.nameEs,
    displayEn:newIngredient.nameEn,
    noteEs:'',
    noteEn:'',
    sortOrder:rows.length+1
  });
  saveCreatorComponents(rows);
  ['[data-new-ingredient-es]','[data-new-ingredient-en]','[data-new-ingredient-description-es]','[data-new-ingredient-description-en]'].forEach(sel=>{const el=form.querySelector(sel);if(el)el.value=''});
  form.querySelector('[data-creator-new-ingredient-form]').hidden=true;
  status.textContent=tr('Ingrediente nuevo añadido al borrador.','New ingredient added to draft.');
  renderStageThreeRows(form)
}
function validateStageThree(form){
  const status=form.querySelector('[data-creator-status]');
  const rows=readStageThreeRows(form);
  for(const row of rows){
    if(row.quantity!==null&&(!Number.isFinite(row.quantity)||row.quantity<0)){
      status.textContent=tr('Revisa las cantidades de los ingredientes.','Check ingredient quantities.');
      return null
    }
  }
  if(!rows.length){
    status.textContent=tr('Añade al menos un ingrediente antes de continuar.','Add at least one ingredient before continuing.');
    return null
  }
  return rows
}
function showStageThreeComplete(layerEl,draft){
  const body=layerEl.querySelector('.nexoWorkspaceModalBody');
  if(!body)return;
  const rows=creatorIngredientComponents(draft);
  body.innerHTML='<div class="nexoCreatorComplete">'+
    '<div class="nexoWorkspaceEmptyIcon">'+icon('productos')+'</div>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 3 de 8','Stage 3 of 8'))+'</span><strong>'+esc(tr('Completada','Complete'))+'</strong></div>'+
    '<h3>'+esc(draft.title||draft.titleEs||draft.titleEn||'')+'</h3>'+
    '<div class="nexoCreatorSummary"><div><span>'+esc(tr('Ingredientes','Ingredients'))+'</span><strong>'+rows.length+'</strong></div><div><span>'+esc(tr('Nuevos','New'))+'</span><strong>'+rows.filter(row=>row.ingredientSource==='new').length+'</strong></div></div>'+
    '<p>'+esc(tr('Los insumos base quedaron guardados. En la Etapa 4 podrás convertir o añadir líneas como preparaciones reutilizables.','Base ingredients are saved. In Stage 4 you will be able to convert or add lines as reusable preparations.'))+'</p>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-creator-edit-three>'+esc(tr('Editar etapa 3','Edit stage 3'))+'</button><button type="button" class="nexoWorkspaceBtn primary" data-creator-stage-four>'+esc(tr('Continuar a etapa 4','Continue to stage 4'))+'</button></div>'+
  '</div>';
  body.querySelector('[data-creator-edit-three]').onclick=()=>openCreateStageThree();
  body.querySelector('[data-creator-stage-four]').onclick=()=>openCreateStageFour()
}
function bindCreatorStageThree(layerEl,draft){
  const form=layerEl.querySelector('[data-nexo-creator-stage-three]');
  if(!form)return;
  const search=form.querySelector('[data-creator-ingredient-search]');
  ['input','keyup','search','change'].forEach(type=>search?.addEventListener(type,()=>renderIngredientSearchResults(form,search.value)));
  const toggle=form.querySelector('[data-creator-new-ingredient-toggle]');
  const newForm=form.querySelector('[data-creator-new-ingredient-form]');
  toggle.onclick=()=>{newForm.hidden=!newForm.hidden;if(!newForm.hidden)form.querySelector('[data-new-ingredient-es]')?.focus()};
  form.querySelector('[data-creator-add-new-ingredient]').onclick=()=>addNewCreatorIngredient(form);
  form.querySelector('[data-creator-back-two]').onclick=()=>{
    const rows=readStageThreeRows(form);
    saveCreatorComponents(rows);
    openCreateStageTwo()
  };
  form.querySelector('[data-creator-save-close]').onclick=()=>{
    const rows=readStageThreeRows(form);
    saveCreatorComponents(rows);
    closeLayer()
  };
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const rows=validateStageThree(form);
    if(!rows)return;
    const next=saveCreatorComponents(rows,{complete:true});
    showStageThreeComplete(layerEl,next)
  });
  renderStageThreeRows(form)
}
function openCreateStageThree(){
  if(!canCreate())return;
  const draft=readCreatorDraft()||{};
  if(Number(draft.stage||0)<2){openCreateStageTwo();return}
  const next={...draft,stage:Math.max(3,Number(draft.stage||0)),schemaVersion:Math.max(3,Number(draft.schemaVersion||0)),updatedAt:new Date().toISOString()};
  saveCreatorDraft(next);
  const el=layer(tr('Crear ficha técnica','Create technical sheet'),creatorStageThreeMarkup(next));
  el.querySelector('.nexoWorkspaceModal')?.classList.add('nexoCreatorModalWide','nexoCreatorModalIngredients');
  bindCreatorStageThree(el,next)
}

function creatorReusablePreparations(){
  return (data().recipes||[])
    .filter(row=>row&&row.active!==false&&String(row.recipeType||'').toUpperCase()==='SUBRECIPE')
    .sort((a,b)=>{
      const an=String(lang()==='en'?(a.titleEn||a.titleEs||''):(a.titleEs||a.titleEn||''));
      const bn=String(lang()==='en'?(b.titleEn||b.titleEs||''):(b.titleEs||b.titleEn||''));
      return an.localeCompare(bn,lang()==='en'?'en':'es')
    })
}
function creatorPreparationName(row){
  return String(lang()==='en'?(row?.titleEn||row?.titleEs||''):(row?.titleEs||row?.titleEn||''))
}
function creatorPreparationSearchCorpus(row){
  return searchNorm([row?.titleEs,row?.titleEn,row?.category,row?.notesEs,row?.notesEn].filter(Boolean).join(' '))
}
function creatorPreparationMatches(row,query){
  const q=searchNorm(query);
  if(!q)return false;
  return q.split(' ').filter(Boolean).every(token=>creatorPreparationSearchCorpus(row).includes(token))
}
function creatorAllComponents(draft){
  return (Array.isArray(draft?.components)?draft.components:[])
    .filter(Boolean)
    .slice()
    .sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0))
}
function creatorSubrecipeComponents(draft){
  return creatorAllComponents(draft).filter(row=>String(row.componentType||'').toUpperCase()==='SUBRECIPE')
}
function creatorStageFourComponentName(row){
  const type=String(row?.componentType||'').toUpperCase();
  if(type==='INGREDIENT')return creatorComponentDisplay(row);
  if(row?.preparationSource==='pending'){
    const p=row.pendingPreparation||{};
    return String(lang()==='en'?(p.titleEn||p.titleEs||row.displayEn||row.displayEs||''):(p.titleEs||p.titleEn||row.displayEs||row.displayEn||''))
  }
  const found=creatorReusablePreparations().find(recipe=>String(recipe._id||recipe.id||'')===String(row?.targetRecipeId||''));
  return creatorPreparationName(found)||String(lang()==='en'?(row?.displayEn||row?.displayEs||''):(row?.displayEs||row?.displayEn||''))||tr('Preparación','Preparation')
}
function creatorStageFourComponentImage(row){
  if(String(row?.componentType||'').toUpperCase()==='INGREDIENT')return creatorIngredientImage(row);
  if(row?.preparationSource==='existing'){
    const found=creatorReusablePreparations().find(recipe=>String(recipe._id||recipe.id||'')===String(row?.targetRecipeId||''));
    return img(found?.heroImage||'')
  }
  return ''
}
function saveStageFourComponents(rows,{complete=false}={}){
  const draft=readCreatorDraft()||{};
  const ordered=rows.map((row,index)=>({...row,sortOrder:index+1}));
  const next={
    ...draft,
    components:ordered,
    stage:Math.max(4,Number(draft.stage||0)),
    stage4Complete:complete===true?true:draft.stage4Complete===true,
    schemaVersion:Math.max(4,Number(draft.schemaVersion||0)),
    updatedAt:new Date().toISOString()
  };
  saveCreatorDraft(next);
  return next
}
function creatorStageFourMarkup(draft={}){
  const rows=creatorAllComponents(draft);
  const prepCount=rows.filter(row=>String(row.componentType||'').toUpperCase()==='SUBRECIPE').length;
  const pendingCount=rows.filter(row=>String(row.componentType||'').toUpperCase()==='SUBRECIPE'&&row.preparationSource==='pending').length;
  return '<form class="nexoCreatorStage nexoCreatorStageFour" data-nexo-creator-stage-four novalidate>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 4 de 8','Stage 4 of 8'))+'</span><strong>'+esc(tr('Preparaciones reutilizables','Reusable preparations'))+'</strong></div>'+
    '<div class="nexoCreatorStageSummary"><span>'+esc(draft.title||draft.titleEs||draft.titleEn||'')+'</span><strong data-stage-four-count>'+prepCount+' '+esc(tr(prepCount===1?'preparación':'preparaciones',prepCount===1?'preparation':'preparations'))+(pendingCount?' · '+pendingCount+' '+esc(tr('pendiente(s)','pending')):'')+'</strong></div>'+
    '<p class="nexoCreatorIntro">'+esc(tr('Vincula una preparación que ya existe, crea un hueco pendiente para desarrollarlo en la Etapa 5 o convierte una línea de ingrediente en preparación pendiente. Si esta ficha no usa preparaciones, puedes continuar sin añadir ninguna.','Link an existing preparation, create a pending slot to build in Stage 5, or convert an ingredient line into a pending preparation. If this sheet uses no preparations, you can continue without adding one.'))+'</p>'+
    '<section class="nexoCreatorIngredientAdd nexoCreatorPreparationAdd">'+
      '<div class="nexoCreatorIngredientSearchBox">'+
        '<label class="nexoCreatorField"><span>'+esc(tr('Buscar preparación existente','Search existing preparation'))+'</span><input data-creator-preparation-search autocomplete="off" placeholder="'+esc(tr('Escribe vinagreta, salsa, puré…','Type vinaigrette, sauce, puree…'))+'"></label>'+
        '<div class="nexoCreatorIngredientResults" data-creator-preparation-results><p>'+esc(tr('Busca entre las fichas SUBRECIPE disponibles en este Workspace.','Search SUBRECIPE sheets available in this Workspace.'))+'</p></div>'+
      '</div>'+
      '<div class="nexoCreatorIngredientOr"><span>'+esc(tr('o','or'))+'</span></div>'+
      '<div class="nexoCreatorNewIngredient">'+
        '<button type="button" class="nexoWorkspaceBtn wide" data-creator-pending-preparation-toggle>'+icon('preparaciones')+'<span>'+esc(tr('Dejar preparación pendiente','Create pending preparation'))+'</span></button>'+
        '<div class="nexoCreatorNewIngredientForm" data-creator-pending-preparation-form hidden>'+
          '<div class="nexoCreatorTwoCols">'+
            '<label class="nexoCreatorField"><span>'+esc(tr('Nombre en español','Name in Spanish'))+'</span><input data-pending-preparation-es maxlength="160" autocomplete="off"></label>'+
            '<label class="nexoCreatorField"><span>'+esc(tr('Nombre en inglés','Name in English'))+'</span><input data-pending-preparation-en maxlength="160" autocomplete="off"></label>'+
          '</div>'+
          '<div class="nexoCreatorTwoCols">'+
            '<label class="nexoCreatorField"><span>'+esc(tr('Descripción ES · opcional','Description ES · optional'))+'</span><textarea data-pending-preparation-description-es maxlength="1000" rows="2"></textarea></label>'+
            '<label class="nexoCreatorField"><span>'+esc(tr('Descripción EN · opcional','Description EN · optional'))+'</span><textarea data-pending-preparation-description-en maxlength="1000" rows="2"></textarea></label>'+
          '</div>'+
          '<button type="button" class="nexoWorkspaceBtn primary" data-creator-add-pending-preparation>'+esc(tr('Añadir hueco pendiente','Add pending slot'))+'</button>'+
        '</div>'+
      '</div>'+
    '</section>'+
    '<section class="nexoCreatorIngredientListWrap">'+
      '<div class="nexoCreatorIngredientListHead"><strong>'+esc(tr('Composición de la ficha','Sheet composition'))+'</strong><span>'+esc(tr('Ingredientes y preparaciones comparten el orden final.','Ingredients and preparations share the final order.'))+'</span></div>'+
      '<div class="nexoCreatorIngredientList nexoCreatorCompositionList" data-creator-stage-four-list></div>'+
    '</section>'+
    '<div class="nexoCreatorStatus" data-creator-status aria-live="polite"></div>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-stage-four-back>'+esc(tr('← Etapa 3','← Stage 3'))+'</button><button type="button" class="nexoWorkspaceBtn" data-stage-four-save-close>'+esc(tr('Guardar y cerrar','Save & close'))+'</button><button type="submit" class="nexoWorkspaceBtn primary">'+esc(tr('Guardar y continuar','Save & continue'))+'</button></div>'+
  '</form>'
}
function creatorStageFourRow(row,index,total){
  const type=String(row.componentType||'').toUpperCase();
  const isIngredient=type==='INGREDIENT';
  const isPending=type==='SUBRECIPE'&&row.preparationSource==='pending';
  const name=creatorStageFourComponentName(row);
  const image=creatorStageFourComponentImage(row);
  const qty=row.quantity===null||row.quantity===undefined?'':String(row.quantity);
  const unit=String(row.unitEs||row.unitEn||'');
  const badge=isIngredient?tr('Ingrediente','Ingredient'):(isPending?tr('Preparación pendiente','Pending preparation'):tr('Preparación existente','Existing preparation'));
  const convert=isIngredient?'<button type="button" class="nexoCreatorInlineAction" data-stage-four-convert>'+esc(tr('Convertir en preparación','Convert to preparation'))+'</button>':'';
  const restore=!isIngredient&&row.convertedFromIngredient?'<button type="button" class="nexoCreatorInlineAction" data-stage-four-restore>'+esc(tr('Volver a ingrediente','Restore ingredient'))+'</button>':'';
  return '<article class="nexoCreatorIngredientRow nexoCreatorCompositionRow '+(isPending?'pending':'')+'" data-stage-four-component="'+esc(row.draftId)+'">'+
    '<div class="nexoCreatorIngredientIdentity">'+
      '<div class="nexoCreatorIngredientThumb '+(!isIngredient?'preparation':'')+'">'+(image?'<img src="'+esc(image)+'" alt="">':icon(isIngredient?'productos':'preparaciones'))+'</div>'+
      '<div><span class="nexoCreatorIngredientSource">'+esc(badge)+'</span><strong>'+esc(name)+'</strong>'+(isPending?'<small>'+esc(tr('Se desarrollará en la Etapa 5','Will be built in Stage 5'))+'</small>':'')+'<div class="nexoCreatorCompositionActions">'+convert+restore+'</div></div>'+
      '<div class="nexoCreatorIngredientOrder">'+
        '<button type="button" data-stage-four-up title="'+esc(tr('Subir','Move up'))+'" '+(index===0?'disabled':'')+'>↑</button>'+
        '<button type="button" data-stage-four-down title="'+esc(tr('Bajar','Move down'))+'" '+(index===total-1?'disabled':'')+'>↓</button>'+
        '<button type="button" data-stage-four-remove title="'+esc(tr('Eliminar','Remove'))+'">×</button>'+
      '</div>'+
    '</div>'+
    '<div class="nexoCreatorIngredientFields">'+
      '<label class="nexoCreatorField"><span>'+esc(tr('Cantidad','Quantity'))+'</span><input data-stage-four-quantity type="number" min="0" step="any" inputmode="decimal" value="'+esc(qty)+'" placeholder="0"></label>'+
      '<label class="nexoCreatorField"><span>'+esc(tr('Unidad','Unit'))+'</span><input data-stage-four-unit maxlength="40" value="'+esc(unit)+'" placeholder="g, ml, oz…"></label>'+
      '<label class="nexoCreatorField nexoCreatorIngredientNote"><span>'+esc(tr('Nota ES','Note ES'))+'</span><input data-stage-four-note-es maxlength="500" value="'+esc(row.noteEs||'')+'"></label>'+
      '<label class="nexoCreatorField nexoCreatorIngredientNote"><span>'+esc(tr('Nota EN','Note EN'))+'</span><input data-stage-four-note-en maxlength="500" value="'+esc(row.noteEn||'')+'"></label>'+
    '</div>'+
  '</article>'
}
function readStageFourRows(form){
  const draft=readCreatorDraft()||{};
  const previous=new Map(creatorAllComponents(draft).map(row=>[String(row.draftId),row]));
  const rows=[];
  form.querySelectorAll('[data-stage-four-component]').forEach((el,index)=>{
    const id=String(el.dataset.stageFourComponent||'');
    const base=previous.get(id);
    if(!base)return;
    const qtyRaw=String(el.querySelector('[data-stage-four-quantity]')?.value||'').trim();
    const quantity=qtyRaw===''?null:Number(qtyRaw);
    const unit=creatorNormalizeComponentUnit(el.querySelector('[data-stage-four-unit]')?.value||'');
    rows.push({
      ...base,
      quantity:Number.isFinite(quantity)?quantity:null,
      unitEs:unit.es,
      unitEn:unit.en,
      noteEs:String(el.querySelector('[data-stage-four-note-es]')?.value||'').trim(),
      noteEn:String(el.querySelector('[data-stage-four-note-en]')?.value||'').trim(),
      sortOrder:index+1
    })
  });
  return rows
}
function creatorPersistStageFourForm(form){
  const rows=readStageFourRows(form);
  return saveStageFourComponents(rows)
}
function renderStageFourRows(form){
  const list=form.querySelector('[data-creator-stage-four-list]');
  const count=form.querySelector('[data-stage-four-count]');
  const rows=creatorAllComponents(readCreatorDraft()||{});
  const prepRows=rows.filter(row=>String(row.componentType||'').toUpperCase()==='SUBRECIPE');
  const pending=prepRows.filter(row=>row.preparationSource==='pending').length;
  if(count)count.textContent=prepRows.length+' '+tr(prepRows.length===1?'preparación':'preparaciones',prepRows.length===1?'preparation':'preparations')+(pending?' · '+pending+' '+tr('pendiente(s)','pending'):'');
  if(!list)return;
  if(!rows.length){
    list.innerHTML='<div class="nexoCreatorIngredientEmpty">'+icon('preparaciones')+'<p>'+esc(tr('No hay componentes en el borrador.','There are no components in the draft.'))+'</p></div>';
    return
  }
  list.innerHTML=rows.map((row,index)=>creatorStageFourRow(row,index,rows.length)).join('');
  list.querySelectorAll('[data-stage-four-component]').forEach(el=>{
    ['input','change'].forEach(type=>el.addEventListener(type,()=>creatorPersistStageFourForm(form)));
    el.querySelector('[data-stage-four-remove]').onclick=()=>{
      creatorPersistStageFourForm(form);
      const id=String(el.dataset.stageFourComponent||'');
      const next=creatorAllComponents(readCreatorDraft()||{}).filter(row=>String(row.draftId)!==id);
      saveStageFourComponents(next);
      renderStageFourRows(form)
    };
    el.querySelector('[data-stage-four-up]').onclick=()=>{
      creatorPersistStageFourForm(form);
      const id=String(el.dataset.stageFourComponent||'');
      const rows=creatorAllComponents(readCreatorDraft()||{});
      const i=rows.findIndex(row=>String(row.draftId)===id);
      if(i>0){[rows[i-1],rows[i]]=[rows[i],rows[i-1]];saveStageFourComponents(rows);renderStageFourRows(form)}
    };
    el.querySelector('[data-stage-four-down]').onclick=()=>{
      creatorPersistStageFourForm(form);
      const id=String(el.dataset.stageFourComponent||'');
      const rows=creatorAllComponents(readCreatorDraft()||{});
      const i=rows.findIndex(row=>String(row.draftId)===id);
      if(i>=0&&i<rows.length-1){[rows[i],rows[i+1]]=[rows[i+1],rows[i]];saveStageFourComponents(rows);renderStageFourRows(form)}
    };
    const convert=el.querySelector('[data-stage-four-convert]');
    if(convert)convert.onclick=()=>{
      creatorPersistStageFourForm(form);
      const id=String(el.dataset.stageFourComponent||'');
      const rows=creatorAllComponents(readCreatorDraft()||{});
      const i=rows.findIndex(row=>String(row.draftId)===id);
      if(i<0)return;
      const source=rows[i];
      const titleEs=String(source.displayEs||creatorStageFourComponentName(source)||'');
      const titleEn=String(source.displayEn||source.displayEs||creatorStageFourComponentName(source)||'');
      rows[i]={
        draftId:source.draftId,
        componentType:'SUBRECIPE',
        preparationSource:'pending',
        targetIngredientId:'',
        targetPreparationId:'',
        targetRecipeId:'',
        pendingPreparation:{
          draftId:creatorDraftId('subrecipe'),
          titleEs,
          titleEn,
          descriptionEs:'',
          descriptionEn:'',
          stage5Complete:false
        },
        quantity:source.quantity??null,
        unitEs:source.unitEs||'',
        unitEn:source.unitEn||'',
        displayEs:titleEs,
        displayEn:titleEn,
        noteEs:source.noteEs||'',
        noteEn:source.noteEn||'',
        sortOrder:source.sortOrder,
        convertedFromIngredient:{...source}
      };
      saveStageFourComponents(rows);
      renderStageFourRows(form)
    };
    const restore=el.querySelector('[data-stage-four-restore]');
    if(restore)restore.onclick=()=>{
      creatorPersistStageFourForm(form);
      const id=String(el.dataset.stageFourComponent||'');
      const rows=creatorAllComponents(readCreatorDraft()||{});
      const i=rows.findIndex(row=>String(row.draftId)===id);
      if(i<0||!rows[i].convertedFromIngredient)return;
      const current=rows[i],source={...current.convertedFromIngredient};
      source.draftId=current.draftId;
      source.quantity=current.quantity;
      source.unitEs=current.unitEs;
      source.unitEn=current.unitEn;
      source.noteEs=current.noteEs;
      source.noteEn=current.noteEn;
      source.sortOrder=current.sortOrder;
      rows[i]=source;
      saveStageFourComponents(rows);
      renderStageFourRows(form)
    }
  })
}
function addExistingCreatorPreparation(form,recipe){
  creatorPersistStageFourForm(form);
  const id=String(recipe?._id||recipe?.id||'');
  if(!id)return;
  const rows=creatorAllComponents(readCreatorDraft()||{});
  rows.push({
    draftId:creatorDraftId('component'),
    componentType:'SUBRECIPE',
    preparationSource:'existing',
    targetIngredientId:'',
    targetPreparationId:'',
    targetRecipeId:id,
    quantity:null,
    unitEs:'',
    unitEn:'',
    displayEs:String(recipe.titleEs||recipe.titleEn||''),
    displayEn:String(recipe.titleEn||recipe.titleEs||''),
    noteEs:'',
    noteEn:'',
    sortOrder:rows.length+1
  });
  saveStageFourComponents(rows);
  renderStageFourRows(form);
  const search=form.querySelector('[data-creator-preparation-search]');
  if(search){search.value='';renderPreparationSearchResults(form,'')}
}
function renderPreparationSearchResults(form,query){
  const box=form.querySelector('[data-creator-preparation-results]');
  if(!box)return;
  const q=String(query||'').trim();
  if(!q){
    box.innerHTML='<p>'+esc(tr('Busca entre las fichas SUBRECIPE disponibles en este Workspace.','Search SUBRECIPE sheets available in this Workspace.'))+'</p>';
    return
  }
  const matches=creatorReusablePreparations().filter(row=>creatorPreparationMatches(row,q)).slice(0,12);
  if(!matches.length){
    box.innerHTML='<p>'+esc(tr('No hay coincidencias. Puedes dejar esta preparación pendiente.','No matches. You can leave this preparation pending.'))+'</p>';
    return
  }
  box.innerHTML=matches.map(row=>{
    const id=String(row._id||row.id||'');
    const name=creatorPreparationName(row);
    const sub=lang()==='en'?(row.titleEs||''):(row.titleEn||'');
    const image=img(row.heroImage||'');
    return '<button type="button" data-existing-preparation="'+esc(id)+'">'+
      '<span class="nexoCreatorIngredientSearchThumb">'+(image?'<img src="'+esc(image)+'" alt="">':icon('preparaciones'))+'</span>'+
      '<span><strong>'+esc(name)+'</strong>'+(sub&&sub!==name?'<small>'+esc(sub)+'</small>':'')+'</span>'+
      '<b>'+esc(tr('Vincular','Link'))+'</b>'+
    '</button>'
  }).join('');
  box.querySelectorAll('[data-existing-preparation]').forEach(btn=>btn.onclick=()=>{
    const recipe=creatorReusablePreparations().find(row=>String(row._id||row.id||'')===String(btn.dataset.existingPreparation||''));
    if(recipe)addExistingCreatorPreparation(form,recipe)
  })
}
function addPendingCreatorPreparation(form){
  const status=form.querySelector('[data-creator-status]');
  const titleEs=String(form.querySelector('[data-pending-preparation-es]')?.value||'').trim();
  const titleEn=String(form.querySelector('[data-pending-preparation-en]')?.value||'').trim();
  if(!titleEs&&!titleEn){
    status.textContent=tr('Escribe al menos un nombre para la preparación pendiente.','Enter at least one name for the pending preparation.');
    return
  }
  const names=[titleEs,titleEn].filter(Boolean).map(searchNorm);
  const existing=creatorReusablePreparations().find(row=>{
    const rowNames=[row.titleEs,row.titleEn].filter(Boolean).map(searchNorm);
    return names.some(name=>rowNames.includes(name))
  });
  if(existing){
    status.textContent=tr('Esa preparación ya existe. Vincúlala desde la búsqueda para evitar duplicados.','That preparation already exists. Link it from search to avoid duplicates.');
    return
  }
  const draft=readCreatorDraft()||{};
  const duplicatePending=creatorSubrecipeComponents(draft).some(row=>{
    if(row.preparationSource!=='pending')return false;
    const p=row.pendingPreparation||{};
    const rowNames=[p.titleEs,p.titleEn].filter(Boolean).map(searchNorm);
    return names.some(name=>rowNames.includes(name))
  });
  if(duplicatePending){
    status.textContent=tr('Esa preparación pendiente ya está en esta ficha.','That pending preparation is already in this sheet.');
    return
  }
  creatorPersistStageFourForm(form);
  const rows=creatorAllComponents(readCreatorDraft()||{});
  const pendingPreparation={
    draftId:creatorDraftId('subrecipe'),
    titleEs:titleEs||titleEn,
    titleEn:titleEn||titleEs,
    descriptionEs:String(form.querySelector('[data-pending-preparation-description-es]')?.value||'').trim(),
    descriptionEn:String(form.querySelector('[data-pending-preparation-description-en]')?.value||'').trim(),
    stage5Complete:false
  };
  rows.push({
    draftId:creatorDraftId('component'),
    componentType:'SUBRECIPE',
    preparationSource:'pending',
    targetIngredientId:'',
    targetPreparationId:'',
    targetRecipeId:'',
    pendingPreparation,
    quantity:null,
    unitEs:'',
    unitEn:'',
    displayEs:pendingPreparation.titleEs,
    displayEn:pendingPreparation.titleEn,
    noteEs:'',
    noteEn:'',
    sortOrder:rows.length+1
  });
  saveStageFourComponents(rows);
  ['[data-pending-preparation-es]','[data-pending-preparation-en]','[data-pending-preparation-description-es]','[data-pending-preparation-description-en]'].forEach(sel=>{const el=form.querySelector(sel);if(el)el.value=''});
  form.querySelector('[data-creator-pending-preparation-form]').hidden=true;
  status.textContent=tr('Preparación pendiente añadida al borrador.','Pending preparation added to draft.');
  renderStageFourRows(form)
}
function validateStageFour(form){
  const rows=readStageFourRows(form);
  const status=form.querySelector('[data-creator-status]');
  for(const row of rows){
    if(row.quantity!==null&&(!Number.isFinite(row.quantity)||row.quantity<0)){
      status.textContent=tr('Revisa las cantidades de la composición.','Check component quantities.');
      return null
    }
    if(String(row.componentType||'').toUpperCase()==='SUBRECIPE'&&row.preparationSource==='existing'&&!row.targetRecipeId){
      status.textContent=tr('Hay una preparación existente sin vínculo válido.','An existing preparation is missing its link.');
      return null
    }
    if(String(row.componentType||'').toUpperCase()==='SUBRECIPE'&&row.preparationSource==='pending'&&!row.pendingPreparation?.draftId){
      status.textContent=tr('Hay una preparación pendiente incompleta.','A pending preparation is incomplete.');
      return null
    }
  }
  return rows
}
function showStageFourComplete(layerEl,draft){
  const body=layerEl.querySelector('.nexoWorkspaceModalBody');
  if(!body)return;
  const preps=creatorSubrecipeComponents(draft);
  const pending=preps.filter(row=>row.preparationSource==='pending');
  body.innerHTML='<div class="nexoCreatorComplete">'+
    '<div class="nexoWorkspaceEmptyIcon">'+icon('preparaciones')+'</div>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 4 de 8','Stage 4 of 8'))+'</span><strong>'+esc(tr('Completada','Complete'))+'</strong></div>'+
    '<h3>'+esc(draft.title||draft.titleEs||draft.titleEn||'')+'</h3>'+
    '<div class="nexoCreatorSummary"><div><span>'+esc(tr('Preparaciones','Preparations'))+'</span><strong>'+preps.length+'</strong></div><div><span>'+esc(tr('Pendientes','Pending'))+'</span><strong>'+pending.length+'</strong></div></div>'+
    '<p>'+esc(pending.length?tr('Los huecos pendientes quedaron identificados para desarrollarlos en la Etapa 5.','Pending slots are identified and ready to be built in Stage 5.'):tr('No quedan preparaciones pendientes. La Etapa 5 podrá confirmarlo y continuar.','There are no pending preparations. Stage 5 can confirm this and continue.'))+'</p>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-stage-four-edit>'+esc(tr('Editar etapa 4','Edit stage 4'))+'</button><button type="button" class="nexoWorkspaceBtn primary" data-stage-five-open>'+esc(tr('Continuar a etapa 5','Continue to stage 5'))+'</button></div>'+
  '</div>';
  body.querySelector('[data-stage-four-edit]').onclick=()=>openCreateStageFour();
  body.querySelector('[data-stage-five-open]').onclick=()=>openCreateStageFive()
}
function bindCreatorStageFour(layerEl,draft){
  const form=layerEl.querySelector('[data-nexo-creator-stage-four]');
  if(!form)return;
  const search=form.querySelector('[data-creator-preparation-search]');
  ['input','keyup','search','change'].forEach(type=>search?.addEventListener(type,()=>renderPreparationSearchResults(form,search.value)));
  const toggle=form.querySelector('[data-creator-pending-preparation-toggle]');
  const pendingForm=form.querySelector('[data-creator-pending-preparation-form]');
  toggle.onclick=()=>{pendingForm.hidden=!pendingForm.hidden;if(!pendingForm.hidden)form.querySelector('[data-pending-preparation-es]')?.focus()};
  form.querySelector('[data-creator-add-pending-preparation]').onclick=()=>addPendingCreatorPreparation(form);
  form.querySelector('[data-stage-four-back]').onclick=()=>{
    creatorPersistStageFourForm(form);
    openCreateStageThree()
  };
  form.querySelector('[data-stage-four-save-close]').onclick=()=>{
    creatorPersistStageFourForm(form);
    closeLayer()
  };
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const rows=validateStageFour(form);
    if(!rows)return;
    const next=saveStageFourComponents(rows,{complete:true});
    showStageFourComplete(layerEl,next)
  });
  renderStageFourRows(form)
}
function openCreateStageFour(){
  if(!canCreate())return;
  const draft=readCreatorDraft()||{};
  if(Number(draft.stage||0)<3){openCreateStageThree();return}
  const next={...draft,stage:Math.max(4,Number(draft.stage||0)),schemaVersion:Math.max(4,Number(draft.schemaVersion||0)),updatedAt:new Date().toISOString()};
  saveCreatorDraft(next);
  const el=layer(tr('Crear ficha técnica','Create technical sheet'),creatorStageFourMarkup(next));
  el.querySelector('.nexoWorkspaceModal')?.classList.add('nexoCreatorModalWide','nexoCreatorModalIngredients','nexoCreatorModalPreparations');
  bindCreatorStageFour(el,next)
}


function creatorPendingPreparations(draft){
  return creatorSubrecipeComponents(draft).filter(row=>row?.preparationSource==='pending'&&row?.pendingPreparation?.draftId)
}
function creatorPendingPreparationEntry(draft,draftId){
  return creatorPendingPreparations(draft).find(row=>String(row.pendingPreparation?.draftId||'')===String(draftId||''))
}
function creatorPreparationPhotoKey(draftId){
  return creatorDraftKey()+':subrecipe:'+String(draftId||'pending')+':hero'
}
async function readCreatorPreparationPhoto(draftId){
  const db=await creatorPhotoDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('photos','readonly');
    const req=tx.objectStore('photos').get(creatorPreparationPhotoKey(draftId));
    req.onsuccess=()=>resolve(req.result||null);
    req.onerror=()=>reject(req.error||new Error('PREPARATION_PHOTO_DRAFT_READ_FAILED'));
    tx.oncomplete=()=>db.close()
  })
}
async function saveCreatorPreparationPhoto(draftId,file){
  const db=await creatorPhotoDb();
  const row={key:creatorPreparationPhotoKey(draftId),blob:file,name:String(file?.name||'photo'),type:String(file?.type||'image/jpeg'),size:Number(file?.size||0),updatedAt:new Date().toISOString()};
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('photos','readwrite');
    tx.objectStore('photos').put(row);
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error||new Error('PREPARATION_PHOTO_DRAFT_SAVE_FAILED'));
    tx.onabort=()=>reject(tx.error||new Error('PREPARATION_PHOTO_DRAFT_SAVE_FAILED'))
  });
  db.close();
  return row
}
async function deleteCreatorPreparationPhoto(draftId){
  try{
    const db=await creatorPhotoDb();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('photos','readwrite');
      tx.objectStore('photos').delete(creatorPreparationPhotoKey(draftId));
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error||new Error('PREPARATION_PHOTO_DRAFT_DELETE_FAILED'))
    });
    db.close()
  }catch(_){}
}
function creatorStageFiveIngredients(preparation){
  return (Array.isArray(preparation?.components)?preparation.components:[])
    .filter(row=>row&&String(row.componentType||'').toUpperCase()==='INGREDIENT')
    .slice()
    .sort((a,b)=>Number(a.sortOrder||0)-Number(b.sortOrder||0))
}
function creatorStageFiveSavePreparation(draftId,preparation){
  const draft=readCreatorDraft()||{};
  const rows=creatorAllComponents(draft).map(row=>{
    if(row?.preparationSource!=='pending'||String(row?.pendingPreparation?.draftId||'')!==String(draftId||''))return row;
    const nextPreparation={...row.pendingPreparation,...preparation,recipeType:'SUBRECIPE',draftId:String(draftId||row.pendingPreparation?.draftId||''),updatedAt:new Date().toISOString()};
    return {...row,pendingPreparation:nextPreparation,displayEs:String(nextPreparation.titleEs||nextPreparation.titleEn||row.displayEs||''),displayEn:String(nextPreparation.titleEn||nextPreparation.titleEs||row.displayEn||'')}
  });
  const next={...draft,components:rows,stage:Math.max(5,Number(draft.stage||0)),stage5Complete:false,schemaVersion:Math.max(5,Number(draft.schemaVersion||0)),updatedAt:new Date().toISOString()};
  saveCreatorDraft(next);
  return next
}
function creatorStageFiveValidation(preparation){
  if(!preparation)return tr('No se encontró la preparación pendiente.','Pending preparation was not found.');
  if(!String(preparation.titleEs||'').trim()&&!String(preparation.titleEn||'').trim())return tr('Escribe al menos un nombre para la preparación.','Enter at least one preparation name.');
  const qty=preparation.yieldQty;
  if(qty!==null&&qty!==undefined&&qty!==''&&(!Number.isFinite(Number(qty))||Number(qty)<0))return tr('El rendimiento debe ser un número válido.','Yield must be a valid number.');
  const ingredients=creatorStageFiveIngredients(preparation);
  if(!ingredients.length)return tr('Añade al menos un ingrediente propio a esta preparación.','Add at least one ingredient to this preparation.');
  for(const row of ingredients){
    if(row.quantity!==null&&row.quantity!==undefined&&row.quantity!==''&&(!Number.isFinite(Number(row.quantity))||Number(row.quantity)<0))return tr('Revisa las cantidades de los ingredientes de la preparación.','Check the preparation ingredient quantities.');
  }
  return ''
}
function creatorStageFivePreparationName(row){
  const p=row?.pendingPreparation||{};
  return String(lang()==='en'?(p.titleEn||p.titleEs||row?.displayEn||row?.displayEs||''):(p.titleEs||p.titleEn||row?.displayEs||row?.displayEn||''))||tr('Preparación pendiente','Pending preparation')
}
function creatorStageFiveMarkup(draft={}){
  const pending=creatorPendingPreparations(draft);
  const complete=pending.filter(row=>row.pendingPreparation?.stage5Complete===true&&!creatorStageFiveValidation(row.pendingPreparation)).length;
  const options=pending.map(row=>{
    const p=row.pendingPreparation||{};
    const ready=p.stage5Complete===true&&!creatorStageFiveValidation(p);
    return '<option value="'+esc(p.draftId)+'">'+(ready?'✓ ':'')+esc(creatorStageFivePreparationName(row))+'</option>'
  }).join('');
  return '<form class="nexoCreatorStage nexoCreatorStageFive" data-nexo-creator-stage-five novalidate>'+
    '<div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 5 de 8','Stage 5 of 8'))+'</span><strong>'+esc(tr('Desarrollar preparaciones pendientes','Build pending preparations'))+'</strong></div>'+
    '<div class="nexoCreatorStageSummary"><span>'+esc(draft.title||draft.titleEs||draft.titleEn||'')+'</span><strong data-stage-five-count>'+complete+' / '+pending.length+' '+esc(tr('listas','ready'))+'</strong></div>'+
    '<p class="nexoCreatorIntro">'+esc(tr('Completa cada subproducto pendiente dentro del mismo borrador: identidad, rendimiento, portada opcional e ingredientes propios. Nada se escribirá todavía en DMRecipes.','Complete each pending subproduct inside the same draft: identity, yield, optional cover and its own ingredients. Nothing is written to DMRecipes yet.'))+'</p>'+
    (pending.length?'<label class="nexoCreatorField nexoCreatorStageFiveSelector"><span>'+esc(tr('Preparación pendiente','Pending preparation'))+'</span><select data-stage-five-select>'+options+'</select></label><div data-stage-five-editor></div>':'<div class="nexoCreatorIngredientEmpty nexoCreatorStageFiveEmpty">'+icon('preparaciones')+'<p>'+esc(tr('Esta ficha no tiene preparaciones pendientes. Puedes completar la etapa y continuar.','This sheet has no pending preparations. You can complete the stage and continue.'))+'</p></div>')+
    '<div class="nexoCreatorStatus" data-creator-status aria-live="polite"></div>'+
    '<div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-stage-five-back>'+esc(tr('← Etapa 4','← Stage 4'))+'</button><button type="button" class="nexoWorkspaceBtn" data-stage-five-save-close>'+esc(tr('Guardar y cerrar','Save & close'))+'</button><button type="submit" class="nexoWorkspaceBtn primary">'+esc(tr('Completar etapa 5','Complete stage 5'))+'</button></div>'+
  '</form>'
}
function creatorStageFiveEditorMarkup(row){
  const p=row?.pendingPreparation||{};
  const yieldQty=p.yieldQty===null||p.yieldQty===undefined?'':String(p.yieldQty);
  const yieldUnit=String(p.yieldUnitEs||p.yieldUnitEn||'');
  const categories=creatorCategorySuggestions().map(value=>'<option value="'+esc(value)+'"></option>').join('');
  const units=creatorUnitSuggestions().map(value=>'<option value="'+esc(value)+'"></option>').join('');
  const ingredients=creatorStageFiveIngredients(p);
  const ready=p.stage5Complete===true&&!creatorStageFiveValidation(p);
  return '<section class="nexoCreatorStageFiveEditor" data-stage-five-active="'+esc(p.draftId)+'">'+
    '<div class="nexoCreatorStageFiveEditorHead"><div><span>'+esc(tr('SUBRECIPE local','Local SUBRECIPE'))+'</span><strong>'+esc(creatorStageFivePreparationName(row))+'</strong></div><b class="'+(ready?'ready':'')+'">'+esc(ready?tr('Lista','Ready'):tr('En edición','Editing'))+'</b></div>'+
    '<div class="nexoCreatorEditorGrid">'+
      '<div class="nexoCreatorPhotoPanel"><div class="nexoCreatorPhotoPreview" data-creator-photo-preview><div class="nexoCreatorPhotoEmpty">'+icon('foto')+'<span>'+esc(tr('Sin foto de portada','No cover photo'))+'</span></div></div><input type="file" accept="image/*" data-stage-five-photo-input hidden><div class="nexoCreatorPhotoActions"><button type="button" class="nexoWorkspaceBtn" data-stage-five-photo-pick>'+esc(tr('Elegir foto','Choose photo'))+'</button><button type="button" class="nexoWorkspaceBtn" data-creator-photo-remove hidden>'+esc(tr('Quitar','Remove'))+'</button></div><small>'+esc(tr('La foto queda local en IndexedDB hasta la publicación final.','The photo stays local in IndexedDB until final publication.'))+'</small></div>'+
      '<div class="nexoCreatorMainFields">'+
        '<div class="nexoCreatorTwoCols"><label class="nexoCreatorField"><span>'+esc(tr('Nombre ES','Name ES'))+'</span><input data-stage-five-title-es maxlength="160" value="'+esc(p.titleEs||'')+'"></label><label class="nexoCreatorField"><span>'+esc(tr('Nombre EN','Name EN'))+'</span><input data-stage-five-title-en maxlength="160" value="'+esc(p.titleEn||'')+'"></label></div>'+
        '<div class="nexoCreatorTwoCols"><label class="nexoCreatorField"><span>'+esc(tr('Idioma original','Original language'))+'</span><select data-stage-five-original-language><option value="es" '+(String(p.originalLanguage||'es')==='es'?'selected':'')+'>ES</option><option value="en" '+(String(p.originalLanguage||'')==='en'?'selected':'')+'>EN</option></select></label><label class="nexoCreatorField"><span>'+esc(tr('Categoría','Category'))+'</span><input data-stage-five-category maxlength="120" list="nexoCreatorStageFiveCategories" value="'+esc(p.category||'')+'"><datalist id="nexoCreatorStageFiveCategories">'+categories+'</datalist></label></div>'+
        '<div class="nexoCreatorTwoCols"><label class="nexoCreatorField"><span>'+esc(tr('Rendimiento','Yield'))+'</span><input data-stage-five-yield-qty type="number" min="0" step="any" inputmode="decimal" value="'+esc(yieldQty)+'"></label><label class="nexoCreatorField"><span>'+esc(tr('Unidad de rendimiento','Yield unit'))+'</span><input data-stage-five-yield-unit maxlength="40" list="nexoCreatorStageFiveUnits" value="'+esc(yieldUnit)+'"><datalist id="nexoCreatorStageFiveUnits">'+units+'</datalist></label></div>'+
        '<div class="nexoCreatorTwoCols"><label class="nexoCreatorField"><span>'+esc(tr('Descripción ES','Description ES'))+'</span><textarea data-stage-five-description-es maxlength="1000" rows="3">'+esc(p.descriptionEs||'')+'</textarea></label><label class="nexoCreatorField"><span>'+esc(tr('Descripción EN','Description EN'))+'</span><textarea data-stage-five-description-en maxlength="1000" rows="3">'+esc(p.descriptionEn||'')+'</textarea></label></div>'+
        '<div class="nexoCreatorTwoCols"><label class="nexoCreatorField"><span>'+esc(tr('Notas ES','Notes ES'))+'</span><textarea data-stage-five-notes-es maxlength="2000" rows="3">'+esc(p.notesEs||'')+'</textarea></label><label class="nexoCreatorField"><span>'+esc(tr('Notas EN','Notes EN'))+'</span><textarea data-stage-five-notes-en maxlength="2000" rows="3">'+esc(p.notesEn||'')+'</textarea></label></div>'+
      '</div>'+
    '</div>'+
    '<section class="nexoCreatorIngredientAdd nexoCreatorStageFiveIngredientAdd"><div class="nexoCreatorIngredientSearchBox"><label class="nexoCreatorField"><span>'+esc(tr('Añadir ingrediente existente','Add existing ingredient'))+'</span><input data-stage-five-ingredient-search autocomplete="off" placeholder="'+esc(tr('Buscar ingrediente…','Search ingredient…'))+'"></label><div class="nexoCreatorIngredientResults" data-stage-five-ingredient-results><p>'+esc(tr('Busca entre los ingredientes autorizados del Workspace.','Search the Workspace authorized ingredients.'))+'</p></div></div><div class="nexoCreatorIngredientOr"><span>'+esc(tr('o','or'))+'</span></div><div class="nexoCreatorNewIngredient"><button type="button" class="nexoWorkspaceBtn wide" data-stage-five-new-ingredient-toggle>'+icon('nuevo')+'<span>'+esc(tr('Crear ingrediente nuevo','Create new ingredient'))+'</span></button><div class="nexoCreatorNewIngredientForm" data-stage-five-new-ingredient-form hidden><div class="nexoCreatorTwoCols"><label class="nexoCreatorField"><span>'+esc(tr('Nombre ES','Name ES'))+'</span><input data-stage-five-new-ingredient-es maxlength="160"></label><label class="nexoCreatorField"><span>'+esc(tr('Nombre EN','Name EN'))+'</span><input data-stage-five-new-ingredient-en maxlength="160"></label></div><div class="nexoCreatorTwoCols"><label class="nexoCreatorField"><span>'+esc(tr('Descripción ES · opcional','Description ES · optional'))+'</span><textarea data-stage-five-new-ingredient-description-es maxlength="1000" rows="2"></textarea></label><label class="nexoCreatorField"><span>'+esc(tr('Descripción EN · opcional','Description EN · optional'))+'</span><textarea data-stage-five-new-ingredient-description-en maxlength="1000" rows="2"></textarea></label></div><button type="button" class="nexoWorkspaceBtn primary" data-stage-five-add-new-ingredient>'+esc(tr('Añadir ingrediente','Add ingredient'))+'</button></div></div></section>'+
    '<section class="nexoCreatorIngredientListWrap"><div class="nexoCreatorIngredientListHead"><strong>'+esc(tr('Ingredientes propios','Own ingredients'))+'</strong><span data-stage-five-ingredient-count>'+ingredients.length+' '+esc(tr(ingredients.length===1?'ingrediente':'ingredientes',ingredients.length===1?'ingredient':'ingredients'))+'</span></div><div class="nexoCreatorIngredientList" data-stage-five-ingredient-list></div></section>'+
    '<div class="nexoCreatorStageFiveLocalActions"><button type="button" class="nexoWorkspaceBtn primary" data-stage-five-complete-preparation>'+esc(tr('Guardar preparación como lista','Save preparation as ready'))+'</button></div>'+
  '</section>'
}
function creatorStageFiveIngredientRowsFromForm(form,preparation){
  const previous=new Map(creatorStageFiveIngredients(preparation).map(row=>[String(row.draftId),row]));
  const rows=[];
  form.querySelectorAll('[data-stage-five-ingredient-list] [data-creator-component-id]').forEach((el,index)=>{
    const id=String(el.dataset.creatorComponentId||''),base=previous.get(id);
    if(!base)return;
    const qtyRaw=String(el.querySelector('[data-ingredient-quantity]')?.value||'').trim();
    const quantity=qtyRaw===''?null:Number(qtyRaw);
    const unit=creatorNormalizeComponentUnit(el.querySelector('[data-ingredient-unit]')?.value||'');
    rows.push({...base,componentType:'INGREDIENT',quantity:Number.isFinite(quantity)?quantity:null,unitEs:unit.es,unitEn:unit.en,noteEs:String(el.querySelector('[data-ingredient-note-es]')?.value||'').trim(),noteEn:String(el.querySelector('[data-ingredient-note-en]')?.value||'').trim(),sortOrder:index+1})
  });
  return rows
}
function saveStageFivePreparationFromForm(form,{complete=false,silent=false}={}){
  const activeId=String(form.dataset.stageFiveActive||'');
  if(!activeId)return readCreatorDraft()||{};
  const entry=creatorPendingPreparationEntry(readCreatorDraft()||{},activeId);
  if(!entry)return null;
  const current=entry.pendingPreparation||{},status=form.querySelector('[data-creator-status]');
  const titleEs=String(form.querySelector('[data-stage-five-title-es]')?.value||'').trim();
  const titleEn=String(form.querySelector('[data-stage-five-title-en]')?.value||'').trim();
  const qtyRaw=String(form.querySelector('[data-stage-five-yield-qty]')?.value||'').trim();
  const yieldQty=qtyRaw===''?null:Number(qtyRaw);
  if(qtyRaw!==''&&(!Number.isFinite(yieldQty)||yieldQty<0)){if(!silent)status.textContent=tr('El rendimiento debe ser un número válido.','Yield must be a valid number.');return null}
  const yieldUnit=creatorUnitPair(form.querySelector('[data-stage-five-yield-unit]')?.value||'');
  const preparation={...current,recipeType:'SUBRECIPE',titleEs,titleEn,originalLanguage:String(form.querySelector('[data-stage-five-original-language]')?.value||'es')==='en'?'en':'es',category:String(form.querySelector('[data-stage-five-category]')?.value||'').trim(),yieldQty,yieldUnitEs:yieldUnit.es,yieldUnitEn:yieldUnit.en,descriptionEs:String(form.querySelector('[data-stage-five-description-es]')?.value||'').trim(),descriptionEn:String(form.querySelector('[data-stage-five-description-en]')?.value||'').trim(),notesEs:String(form.querySelector('[data-stage-five-notes-es]')?.value||'').trim(),notesEn:String(form.querySelector('[data-stage-five-notes-en]')?.value||'').trim(),components:creatorStageFiveIngredientRowsFromForm(form,current)};
  const validation=complete?creatorStageFiveValidation(preparation):'';
  if(validation){if(!silent)status.textContent=validation;return null}
  preparation.stage5Complete=complete===true?true:current.stage5Complete===true;
  return creatorStageFiveSavePreparation(activeId,preparation)
}
function renderStageFiveIngredientRows(form){
  const preparation=creatorPendingPreparationEntry(readCreatorDraft()||{},form.dataset.stageFiveActive)?.pendingPreparation||{};
  const rows=creatorStageFiveIngredients(preparation),list=form.querySelector('[data-stage-five-ingredient-list]'),count=form.querySelector('[data-stage-five-ingredient-count]');
  if(count)count.textContent=rows.length+' '+tr(rows.length===1?'ingrediente':'ingredientes',rows.length===1?'ingredient':'ingredients');
  if(!list)return;
  if(!rows.length){list.innerHTML='<div class="nexoCreatorIngredientEmpty">'+icon('productos')+'<p>'+esc(tr('Añade los ingredientes que componen esta preparación.','Add the ingredients used by this preparation.'))+'</p></div>';return}
  list.innerHTML=rows.map((row,index)=>creatorStageThreeRow(row,index,rows.length)).join('');
  list.querySelectorAll('[data-creator-component-id]').forEach(el=>{
    ['input','change'].forEach(type=>el.addEventListener(type,()=>saveStageFivePreparationFromForm(form,{silent:true})));
    el.querySelector('[data-ingredient-remove]').onclick=()=>{saveStageFivePreparationFromForm(form,{silent:true});const p=creatorPendingPreparationEntry(readCreatorDraft()||{},form.dataset.stageFiveActive)?.pendingPreparation||{};creatorStageFiveSavePreparation(form.dataset.stageFiveActive,{...p,components:creatorStageFiveIngredients(p).filter(row=>String(row.draftId)!==String(el.dataset.creatorComponentId||'')),stage5Complete:false});renderStageFiveIngredientRows(form)};
    el.querySelector('[data-ingredient-up]').onclick=()=>{saveStageFivePreparationFromForm(form,{silent:true});const p=creatorPendingPreparationEntry(readCreatorDraft()||{},form.dataset.stageFiveActive)?.pendingPreparation||{},next=creatorStageFiveIngredients(p),index=next.findIndex(row=>String(row.draftId)===String(el.dataset.creatorComponentId||''));if(index>0){[next[index-1],next[index]]=[next[index],next[index-1]];creatorStageFiveSavePreparation(form.dataset.stageFiveActive,{...p,components:next.map((row,i)=>({...row,sortOrder:i+1})),stage5Complete:false});renderStageFiveIngredientRows(form)}};
    el.querySelector('[data-ingredient-down]').onclick=()=>{saveStageFivePreparationFromForm(form,{silent:true});const p=creatorPendingPreparationEntry(readCreatorDraft()||{},form.dataset.stageFiveActive)?.pendingPreparation||{},next=creatorStageFiveIngredients(p),index=next.findIndex(row=>String(row.draftId)===String(el.dataset.creatorComponentId||''));if(index>=0&&index<next.length-1){[next[index],next[index+1]]=[next[index+1],next[index]];creatorStageFiveSavePreparation(form.dataset.stageFiveActive,{...p,components:next.map((row,i)=>({...row,sortOrder:i+1})),stage5Complete:false});renderStageFiveIngredientRows(form)}}
  })
}
function renderStageFiveIngredientSearchResults(form,query){
  const box=form.querySelector('[data-stage-five-ingredient-results]');
  if(!box)return;
  const q=String(query||'').trim();
  if(!q){box.innerHTML='<p>'+esc(tr('Busca entre los ingredientes autorizados del Workspace.','Search the Workspace authorized ingredients.'))+'</p>';return}
  const matches=creatorExistingIngredients().filter(row=>creatorIngredientMatches(row,q)).slice(0,12);
  if(!matches.length){box.innerHTML='<p>'+esc(tr('No hay coincidencias. Puedes crear este ingrediente como nuevo.','No matches. You can create this ingredient as new.'))+'</p>';return}
  box.innerHTML=matches.map(row=>{const id=String(row._id||row.id||''),name=creatorIngredientName(row),sub=lang()==='en'?(row.nameEs||''):(row.nameEn||''),image=img((Array.isArray(row.images)?row.images[0]:null)||row.baseImage||'');return '<button type="button" data-stage-five-existing-ingredient="'+esc(id)+'"><span class="nexoCreatorIngredientSearchThumb">'+(image?'<img src="'+esc(image)+'" alt="">':icon('productos'))+'</span><span><strong>'+esc(name)+'</strong>'+(sub&&sub!==name?'<small>'+esc(sub)+'</small>':'')+'</span><b>'+esc(tr('Añadir','Add'))+'</b></button>'}).join('');
  box.querySelectorAll('[data-stage-five-existing-ingredient]').forEach(btn=>btn.onclick=()=>{const ingredient=creatorExistingIngredients().find(row=>String(row._id||row.id||'')===String(btn.dataset.stageFiveExistingIngredient||''));if(ingredient)addExistingStageFiveIngredient(form,ingredient)})
}
function addExistingStageFiveIngredient(form,ingredient){
  saveStageFivePreparationFromForm(form,{silent:true});
  const entry=creatorPendingPreparationEntry(readCreatorDraft()||{},form.dataset.stageFiveActive);
  if(!entry)return;
  const p=entry.pendingPreparation||{},id=String(ingredient?._id||ingredient?.id||'');
  if(!id)return;
  const rows=creatorStageFiveIngredients(p);
  rows.push({draftId:creatorDraftId('component'),componentType:'INGREDIENT',ingredientSource:'existing',targetIngredientId:id,targetPreparationId:'',targetRecipeId:'',quantity:null,unitEs:'',unitEn:'',displayEs:String(ingredient.nameEs||ingredient.nameEn||''),displayEn:String(ingredient.nameEn||ingredient.nameEs||''),noteEs:'',noteEn:'',sortOrder:rows.length+1});
  creatorStageFiveSavePreparation(form.dataset.stageFiveActive,{...p,components:rows,stage5Complete:false});
  renderStageFiveIngredientRows(form);
  const search=form.querySelector('[data-stage-five-ingredient-search]');if(search){search.value='';renderStageFiveIngredientSearchResults(form,'')}
}
function addNewStageFiveIngredient(form){
  const status=form.querySelector('[data-creator-status]'),nameEs=String(form.querySelector('[data-stage-five-new-ingredient-es]')?.value||'').trim(),nameEn=String(form.querySelector('[data-stage-five-new-ingredient-en]')?.value||'').trim();
  if(!nameEs&&!nameEn){status.textContent=tr('Escribe al menos un nombre para el ingrediente nuevo.','Enter at least one name for the new ingredient.');return}
  const names=[nameEs,nameEn].filter(Boolean).map(searchNorm);
  const existing=creatorExistingIngredients().find(row=>[row.nameEs,row.nameEn].filter(Boolean).map(searchNorm).some(name=>names.includes(name)));
  if(existing){status.textContent=tr('Ese ingrediente ya existe. Añádelo desde la búsqueda para evitar duplicados.','That ingredient already exists. Add it from search to avoid duplicates.');return}
  saveStageFivePreparationFromForm(form,{silent:true});
  const entry=creatorPendingPreparationEntry(readCreatorDraft()||{},form.dataset.stageFiveActive);if(!entry)return;
  const p=entry.pendingPreparation||{},rows=creatorStageFiveIngredients(p);
  if(rows.some(row=>row.ingredientSource==='new'&&[row.newIngredient?.nameEs,row.newIngredient?.nameEn].filter(Boolean).map(searchNorm).some(name=>names.includes(name)))){status.textContent=tr('Ese ingrediente nuevo ya está en esta preparación.','That new ingredient is already in this preparation.');return}
  const newIngredient={draftId:creatorDraftId('ingredient'),nameEs:nameEs||nameEn,nameEn:nameEn||nameEs,descriptionEs:String(form.querySelector('[data-stage-five-new-ingredient-description-es]')?.value||'').trim(),descriptionEn:String(form.querySelector('[data-stage-five-new-ingredient-description-en]')?.value||'').trim()};
  rows.push({draftId:creatorDraftId('component'),componentType:'INGREDIENT',ingredientSource:'new',targetIngredientId:'',targetPreparationId:'',targetRecipeId:'',newIngredient,quantity:null,unitEs:'',unitEn:'',displayEs:newIngredient.nameEs,displayEn:newIngredient.nameEn,noteEs:'',noteEn:'',sortOrder:rows.length+1});
  creatorStageFiveSavePreparation(form.dataset.stageFiveActive,{...p,components:rows,stage5Complete:false});
  ['[data-stage-five-new-ingredient-es]','[data-stage-five-new-ingredient-en]','[data-stage-five-new-ingredient-description-es]','[data-stage-five-new-ingredient-description-en]'].forEach(sel=>{const el=form.querySelector(sel);if(el)el.value=''});
  const newForm=form.querySelector('[data-stage-five-new-ingredient-form]');if(newForm)newForm.hidden=true;
  status.textContent=tr('Ingrediente nuevo añadido a la preparación local.','New ingredient added to the local preparation.');
  renderStageFiveIngredientRows(form)
}
function renderStageFiveSelector(form){
  const pending=creatorPendingPreparations(readCreatorDraft()||{}),select=form.querySelector('[data-stage-five-select]');
  const current=String(form.dataset.stageFiveActive||select?.value||pending[0]?.pendingPreparation?.draftId||'');
  if(select)select.innerHTML=pending.map(row=>{const p=row.pendingPreparation||{},ready=p.stage5Complete===true&&!creatorStageFiveValidation(p);return '<option value="'+esc(p.draftId)+'" '+(String(p.draftId)===current?'selected':'')+'>'+(ready?'✓ ':'')+esc(creatorStageFivePreparationName(row))+'</option>'}).join('');
  const complete=pending.filter(row=>row.pendingPreparation?.stage5Complete===true&&!creatorStageFiveValidation(row.pendingPreparation)).length,count=form.querySelector('[data-stage-five-count]');
  if(count)count.textContent=complete+' / '+pending.length+' '+tr('listas','ready')
}
async function hydrateStageFivePhoto(form,draftId){
  const preview=form.querySelector('[data-creator-photo-preview]');
  try{applyCreatorPhotoPreview(preview,await readCreatorPreparationPhoto(draftId))}catch(_){applyCreatorPhotoPreview(preview,null)}
}
function bindStageFiveEditor(form){
  const activeId=String(form.dataset.stageFiveActive||''),editor=form.querySelector('[data-stage-five-editor]');
  if(!editor||!activeId)return;
  const fileInput=editor.querySelector('[data-stage-five-photo-input]');
  editor.querySelector('[data-stage-five-photo-pick]').onclick=()=>fileInput.click();
  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files?.[0],status=form.querySelector('[data-creator-status]');
    if(!file)return;
    if(!String(file.type||'').startsWith('image/')){status.textContent=tr('Selecciona un archivo de imagen válido.','Select a valid image file.');fileInput.value='';return}
    if(Number(file.size||0)>15*1024*1024){status.textContent=tr('La foto no puede superar 15 MB.','Photo cannot exceed 15 MB.');fileInput.value='';return}
    try{
      const row=await saveCreatorPreparationPhoto(activeId,file);
      saveStageFivePreparationFromForm(form,{silent:true});
      const p=creatorPendingPreparationEntry(readCreatorDraft()||{},activeId)?.pendingPreparation||{};
      creatorStageFiveSavePreparation(activeId,{...p,heroDraft:{name:row.name,type:row.type,size:row.size,updatedAt:row.updatedAt},stage5Complete:false});
      applyCreatorPhotoPreview(editor.querySelector('[data-creator-photo-preview]'),row);
      status.textContent=tr('Foto de la preparación guardada en el borrador.','Preparation photo saved in the draft.')
    }catch(error){status.textContent=String(error?.message||error||tr('No se pudo guardar la foto.','Could not save photo.'))}
    finally{fileInput.value=''}
  });
  editor.querySelector('[data-creator-photo-remove]').onclick=async()=>{
    await deleteCreatorPreparationPhoto(activeId);
    saveStageFivePreparationFromForm(form,{silent:true});
    const p={...(creatorPendingPreparationEntry(readCreatorDraft()||{},activeId)?.pendingPreparation||{}),stage5Complete:false};
    delete p.heroDraft;creatorStageFiveSavePreparation(activeId,p);applyCreatorPhotoPreview(editor.querySelector('[data-creator-photo-preview]'),null)
  };
  const search=editor.querySelector('[data-stage-five-ingredient-search]');
  ['input','keyup','search','change'].forEach(type=>search?.addEventListener(type,()=>renderStageFiveIngredientSearchResults(form,search.value)));
  const toggle=editor.querySelector('[data-stage-five-new-ingredient-toggle]'),newForm=editor.querySelector('[data-stage-five-new-ingredient-form]');
  toggle.onclick=()=>{newForm.hidden=!newForm.hidden;if(!newForm.hidden)editor.querySelector('[data-stage-five-new-ingredient-es]')?.focus()};
  editor.querySelector('[data-stage-five-add-new-ingredient]').onclick=()=>addNewStageFiveIngredient(form);
  editor.querySelector('[data-stage-five-complete-preparation]').onclick=()=>{
    const next=saveStageFivePreparationFromForm(form,{complete:true});
    if(!next)return;
    form.querySelector('[data-creator-status]').textContent=tr('Preparación guardada como lista.','Preparation saved as ready.');
    renderStageFiveSelector(form);
    const remaining=creatorPendingPreparations(next).find(row=>row.pendingPreparation?.stage5Complete!==true||creatorStageFiveValidation(row.pendingPreparation));
    if(remaining&&String(remaining.pendingPreparation?.draftId)!==activeId){form.dataset.stageFiveActive=String(remaining.pendingPreparation.draftId);const select=form.querySelector('[data-stage-five-select]');if(select)select.value=form.dataset.stageFiveActive}
    renderStageFiveEditor(form)
  };
  renderStageFiveIngredientRows(form);
  hydrateStageFivePhoto(form,activeId)
}
function renderStageFiveEditor(form){
  const editor=form.querySelector('[data-stage-five-editor]');
  if(!editor)return;
  const entry=creatorPendingPreparationEntry(readCreatorDraft()||{},form.dataset.stageFiveActive);
  if(!entry){editor.innerHTML='';return}
  editor.innerHTML=creatorStageFiveEditorMarkup(entry);
  bindStageFiveEditor(form)
}
function showStageFiveComplete(layerEl,draft){
  const body=layerEl.querySelector('.nexoWorkspaceModalBody');
  if(!body)return;
  const pending=creatorPendingPreparations(draft);
  body.innerHTML='<div class="nexoCreatorComplete"><div class="nexoWorkspaceEmptyIcon">'+icon('preparaciones')+'</div><div class="nexoCreatorProgress"><span>'+esc(tr('Etapa 5 de 8','Stage 5 of 8'))+'</span><strong>'+esc(tr('Completada','Complete'))+'</strong></div><h3>'+esc(draft.title||draft.titleEs||draft.titleEn||'')+'</h3><div class="nexoCreatorSummary"><div><span>'+esc(tr('Preparaciones desarrolladas','Built preparations'))+'</span><strong>'+pending.length+'</strong></div><div><span>'+esc(tr('Persistencia Wix','Wix persistence'))+'</span><strong>'+esc(tr('Aún no','Not yet'))+'</strong></div></div><p>'+esc(pending.length?tr('Las subrecetas pendientes ya tienen su estructura local. La Etapa 6 resolverá sus vínculos sin crear registros incompletos.','Pending subrecipes now have their local structure. Stage 6 will resolve their links without creating incomplete records.'):tr('No había subrecetas pendientes. El borrador queda listo para la Etapa 6.','There were no pending subrecipes. The draft is ready for Stage 6.'))+'</p><div class="nexoCreatorActions"><button type="button" class="nexoWorkspaceBtn" data-stage-five-edit>'+esc(tr('Editar etapa 5','Edit stage 5'))+'</button><button type="button" class="nexoWorkspaceBtn primary" data-stage-five-close>'+esc(tr('Listo','Done'))+'</button></div></div>';
  body.querySelector('[data-stage-five-edit]').onclick=()=>openCreateStageFive();
  body.querySelector('[data-stage-five-close]').onclick=closeLayer
}
function bindCreatorStageFive(layerEl,draft){
  const form=layerEl.querySelector('[data-nexo-creator-stage-five]');
  if(!form)return;
  const pending=creatorPendingPreparations(draft),select=form.querySelector('[data-stage-five-select]');
  form.dataset.stageFiveActive=String(select?.value||pending[0]?.pendingPreparation?.draftId||'');
  if(select)select.addEventListener('change',()=>{saveStageFivePreparationFromForm(form,{silent:true});form.dataset.stageFiveActive=String(select.value||'');renderStageFiveEditor(form)});
  form.querySelector('[data-stage-five-back]').onclick=()=>{saveStageFivePreparationFromForm(form,{silent:true});openCreateStageFour()};
  form.querySelector('[data-stage-five-save-close]').onclick=()=>{saveStageFivePreparationFromForm(form,{silent:true});closeLayer()};
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(form.dataset.stageFiveActive&&!saveStageFivePreparationFromForm(form,{silent:true}))return;
    const current=readCreatorDraft()||{},rows=creatorPendingPreparations(current);
    const invalid=rows.find(row=>row.pendingPreparation?.stage5Complete!==true||creatorStageFiveValidation(row.pendingPreparation));
    if(invalid){
      const id=String(invalid.pendingPreparation?.draftId||'');form.dataset.stageFiveActive=id;if(select)select.value=id;renderStageFiveEditor(form);
      form.querySelector('[data-creator-status]').textContent=creatorStageFiveValidation(invalid.pendingPreparation)||tr('Guarda esta preparación como lista antes de completar la etapa.','Save this preparation as ready before completing the stage.');
      return
    }
    const next={...current,stage:Math.max(5,Number(current.stage||0)),stage5Complete:true,schemaVersion:Math.max(5,Number(current.schemaVersion||0)),updatedAt:new Date().toISOString()};
    saveCreatorDraft(next);showStageFiveComplete(layerEl,next)
  });
  renderStageFiveSelector(form);renderStageFiveEditor(form)
}
function openCreateStageFive(){
  if(!canCreate())return;
  const draft=readCreatorDraft()||{};
  if(Number(draft.stage||0)<4||draft.stage4Complete!==true){openCreateStageFour();return}
  const next={...draft,stage:Math.max(5,Number(draft.stage||0)),schemaVersion:Math.max(5,Number(draft.schemaVersion||0)),updatedAt:new Date().toISOString()};
  saveCreatorDraft(next);
  const el=layer(tr('Crear ficha técnica','Create technical sheet'),creatorStageFiveMarkup(next));
  el.querySelector('.nexoWorkspaceModal')?.classList.add('nexoCreatorModalWide','nexoCreatorModalIngredients','nexoCreatorModalStageFive');
  bindCreatorStageFive(el,next)
}

function openCreateFlow(){
  if(!canCreate())return;
  const draft=readCreatorDraft();
  if(draft&&Number(draft.stage||0)>=5&&draft.stage4Complete===true&&draft.title&&draft.collectionId){openCreateStageFive();return}
  if(draft&&Number(draft.stage||0)>=4&&draft.title&&draft.collectionId){openCreateStageFour();return}
  if(draft&&Number(draft.stage||0)>=3&&draft.title&&draft.collectionId){openCreateStageThree();return}
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