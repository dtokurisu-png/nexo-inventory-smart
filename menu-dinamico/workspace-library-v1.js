(()=>{'use strict';
if(window.__NEXO_WORKSPACE_LIBRARY_V1__)return;window.__NEXO_WORKSPACE_LIBRARY_V1__=true;
if(!window.__NEXO_WORKSPACE_MODE__)return;

const view=document.getElementById('view');
const modalRoot=document.getElementById('modal');
if(!view||!modalRoot)return;

let activeTab='collections';

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
function activePreparationSheets(){return activeRecipes().filter(x=>String(x.recipeType||'').toUpperCase()!=='DISH')}
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
              '<input type="file" accept="image/jpeg,image/png,image/webp" data-sheet-photo-input hidden>'+
            '</div>'+
          '</div>'+
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
              '<div class="nexoCompositionAction" data-composition-action="preparation">'+
                '<button type="button" class="nexoWorkspaceBtn" data-sheet-add-preparation aria-haspopup="menu" aria-expanded="false">'+icon('nuevo')+'<span>'+esc(tr('Preparación','Preparation'))+'</span></button>'+
                '<div class="nexoCompositionMenu" data-composition-menu="preparation" role="menu" hidden>'+
                  '<button type="button" role="menuitem" data-composition-choice="existing">'+esc(tr('Existente','Existing'))+'</button>'+
                  '<button type="button" role="menuitem" data-composition-choice="create">'+esc(tr('Crear','Create'))+'</button>'+
                '</div>'+
              '</div>'+
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
    mopSection.hidden=true
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

  function closeCompositionMenus(except=''){
    [
      ['ingredient',supplyMenu,supplyTrigger],
      ['preparation',preparationMenu,preparationTrigger]
    ].forEach(([kind,menu,trigger])=>{
      if(kind===except)return;
      menu.hidden=true;
      trigger.setAttribute('aria-expanded','false')
    })
  }
  function toggleCompositionMenu(kind){
    const menu=kind==='preparation'?preparationMenu:supplyMenu;
    const trigger=kind==='preparation'?preparationTrigger:supplyTrigger;
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
    if(state.photoUrl)try{URL.revokeObjectURL(state.photoUrl)}catch(_){}
    state.photoFile=null;
    state.photoUrl='';
    photoInput.value='';
    photoPreview.innerHTML='<div>'+icon('ficha-tecnica')+'<span>'+esc(isSupplyEditor?tr('Foto del insumo','Supply photo'):tr('Foto del producto','Product photo'))+'</span></div>';
    photoRemove.hidden=true
  };

  supplyTrigger.onclick=()=>toggleCompositionMenu('ingredient');
  preparationTrigger.onclick=()=>toggleCompositionMenu('preparation');
  supplyMenu.querySelector('[data-composition-choice="existing"]').onclick=()=>{
    closeCompositionMenus();
    existingPicker.hidden=false;
    renderExistingPicker('ingredient','')
  };
  supplyMenu.querySelector('[data-composition-choice="create"]').onclick=()=>openCreateChild('supply');
  preparationMenu.querySelector('[data-composition-choice="existing"]').onclick=()=>{
    closeCompositionMenus();
    existingPicker.hidden=false;
    renderExistingPicker('preparation','')
  };
  preparationMenu.querySelector('[data-composition-choice="create"]').onclick=()=>openCreateChild('preparation');

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
  if(m?.type==='MENU_DATA_LOADED')setTimeout(enhanceRoot,0);
});

setTimeout(enhanceRoot,0);
})();