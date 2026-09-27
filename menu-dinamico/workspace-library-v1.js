(()=>{'use strict';
if(window.__NEXO_WORKSPACE_LIBRARY_V1__)return;window.__NEXO_WORKSPACE_LIBRARY_V1__=true;
if(!window.__NEXO_WORKSPACE_MODE__)return;

const view=document.getElementById('view');
const modalRoot=document.getElementById('modal');
if(!view||!modalRoot)return;

let activeTab='collections';
let importOpen=false;
let importPreview=null;
let importCode='';
let importLog=[];
let previewWatchdog=0;

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
  clearTimeout(previewWatchdog);
  previewWatchdog=0;
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

function countLabel(count,singular,plural){
  return Number(count)===1?singular:plural;
}

function importSpinner(textValue){
  return '<div class="nexoImportSpinnerRow"><span class="nexoImportSpinner"></span><span>'+esc(textValue)+'</span></div>';
}

function openImport(){
  if(!canImport())return;
  importOpen=true;
  importPreview=null;
  importCode='';
  importLog=[];
  const el=layer(
    tr('Importar fichas técnicas','Import technical sheets'),
    '<div data-nexo-import-stage="code">'+
      '<p class="nexoWorkspaceModalCopy">'+esc(tr(
        'Ingresa el código entregado por Nexo Group. Primero revisaremos el contenido del paquete; nada se importará hasta que confirmes.',
        'Enter the code provided by Nexo Group. We will first review the package contents; nothing will be imported until you confirm.'
      ))+'</p>'+
      '<input data-nexo-import-code class="search nexoWorkspaceCode" placeholder="NEXO-…" autocomplete="off" autocapitalize="characters">'+
      '<div class="nexoWorkspaceProgress" data-nexo-import-validation></div>'+
      '<button type="button" class="nexoWorkspaceBtn primary wide" data-nexo-import-preview>'+esc(tr('Revisar paquete','Review package'))+'</button>'+
    '</div>'
  );
  const input=el.querySelector('[data-nexo-import-code]');
  const button=el.querySelector('[data-nexo-import-preview]');
  input?.focus();
  button.onclick=()=>{
    const code=String(input?.value||'').trim();
    if(!code)return;
    importCode=code;
    button.disabled=true;
    button.textContent=tr('Validando…','Validating…');
    const validation=el.querySelector('[data-nexo-import-validation]');
    if(validation)validation.innerHTML=importSpinner(tr('Validando código y leyendo paquete…','Validating code and reading package…'));
    clearTimeout(previewWatchdog);
    previewWatchdog=setTimeout(()=>{
      if(importOpen&&!importPreview){
        previewError({message:tr(
          'No se recibió respuesta del validador. Reintenta; no se modificaron datos.',
          'No response was received from the validator. Retry; no data was changed.'
        )});
      }
    },12000);
    parent.postMessage({type:'NEXO_DM_IMPORT_PREVIEW_CODE',payload:{code}},'*');
  };
}

function renderImportPreview(payload){
  if(!importOpen)return;
  clearTimeout(previewWatchdog);
  previewWatchdog=0;
  importPreview=payload||{};
  const modal=document.querySelector('#nexoWorkspaceLibraryLayer .nexoWorkspaceModalBody');
  if(!modal)return;

  const total=Number(importPreview.totalCount||0);
  const done=Number(importPreview.alreadyCompleteCount||0);
  const pending=Number(importPreview.pendingCount||Math.max(0,total-done));
  const containerSingular=importPreview.containerLabelSingular||tr('colección','collection');
  const containerPlural=importPreview.containerLabelPlural||tr('colecciones','collections');
  const itemSingular=importPreview.itemLabelSingular||tr('elemento','item');
  const itemPlural=importPreview.itemLabelPlural||tr('elementos','items');
  const collections=Array.isArray(importPreview.collections)?importPreview.collections:[];

  const collectionRows=collections.map(group=>{
    const count=Number(group?.count||0);
    const label=countLabel(count,group?.itemLabelSingular||itemSingular,group?.itemLabelPlural||itemPlural);
    const linked=group?.importMode==='linked'
      ?'<span class="nexoImportLinked">'+esc(tr('vinculados','linked'))+'</span>'
      :'';
    return '<div class="nexoImportCollectionRow">'+
      '<div><strong>'+esc(group?.name||'—')+'</strong>'+linked+'</div>'+
      '<span>'+esc(String(count))+' '+esc(label)+'</span>'+
    '</div>';
  }).join('');

  const resumed=done>0
    ?'<div class="nexoImportResume">↻ '+esc(tr(
      'Se detectó una importación anterior: '+done+' de '+total+' '+itemPlural+' ya están completas. Se continuará desde ahí.',
      'A previous import was detected: '+done+' of '+total+' '+itemPlural+' are already complete. Import will resume from there.'
    ))+'</div>'
    :'';

  modal.innerHTML=
    '<div class="nexoImportPreview">'+
      '<div class="nexoImportPackageHead"><span class="nexoImportPackageIcon">⇩</span><div><div class="nexoImportEyebrow">'+esc(tr('Paquete verificado','Verified package'))+'</div><h3>'+esc(importPreview.packageName||tr('Paquete Nexo','Nexo package'))+'</h3></div></div>'+
      (importPreview.packageDescription?'<p class="nexoWorkspaceModalCopy">'+esc(importPreview.packageDescription)+'</p>':'')+
      '<div class="nexoImportStats">'+
        '<div><strong>'+esc(String(collections.length))+'</strong><span>'+esc(countLabel(collections.length,containerSingular,containerPlural))+'</span></div>'+
        '<div><strong>'+esc(String(total))+'</strong><span>'+esc(countLabel(total,itemSingular,itemPlural))+'</span></div>'+
        (done?'<div><strong>'+esc(String(pending))+'</strong><span>'+esc(tr('pendientes','pending'))+'</span></div>':'')+
      '</div>'+
      '<div class="nexoImportCollections">'+collectionRows+'</div>'+
      resumed+
      '<p class="nexoImportQuestion">'+esc(tr('¿Deseas continuar con la importación?','Do you want to continue with the import?'))+'</p>'+
      '<div class="nexoImportConfirmActions">'+
        '<button type="button" class="nexoWorkspaceBtn" data-nexo-import-cancel>'+esc(tr('No, cancelar','No, cancel'))+'</button>'+
        '<button type="button" class="nexoWorkspaceBtn primary" data-nexo-import-confirm>'+esc(tr('Sí, importar','Yes, import'))+'</button>'+
      '</div>'+
    '</div>';

  modal.querySelector('[data-nexo-import-cancel]').onclick=closeLayer;
  modal.querySelector('[data-nexo-import-confirm]').onclick=()=>{
    renderImportProgressShell();
    parent.postMessage({type:'NEXO_DM_IMPORT_CONFIRM',payload:{code:importCode}},'*');
  };
}

function renderImportProgressShell(){
  if(!importOpen)return;
  importLog=[];
  const modal=document.querySelector('#nexoWorkspaceLibraryLayer .nexoWorkspaceModalBody');
  if(!modal)return;
  const total=Number(importPreview?.totalCount||0);
  const done=Number(importPreview?.alreadyCompleteCount||0);
  const percent=total?Math.round((done/total)*100):0;
  modal.innerHTML=
    '<div class="nexoImportRunning">'+
      '<div class="nexoImportRunningHead"><div><div class="nexoImportEyebrow">'+esc(tr('Importando paquete','Importing package'))+'</div><h3>'+esc(importPreview?.packageName||'')+'</h3></div><strong data-nexo-import-percent>'+percent+'%</strong></div>'+
      '<div class="nexoImportBar"><span data-nexo-import-bar style="width:'+percent+'%"></span></div>'+
      '<div class="nexoImportCounter" data-nexo-import-counter>'+done+' / '+total+'</div>'+
      '<div class="nexoImportCurrent" data-nexo-import-current>'+importSpinner(tr('Preparando importación…','Preparing import…'))+'</div>'+
      '<div class="nexoImportLog" data-nexo-import-log></div>'+
      '<div class="nexoImportFooter" data-nexo-import-footer></div>'+
    '</div>';
}

function appendImportLog(html){
  importLog.push(html);
  if(importLog.length>80)importLog=importLog.slice(-80);
  const el=document.querySelector('[data-nexo-import-log]');
  if(el){
    el.innerHTML=importLog.join('');
    el.scrollTop=el.scrollHeight;
  }
}

function itemProgressText(payload,mode){
  const label=payload?.itemLabelSingular||importPreview?.itemLabelSingular||tr('elemento','item');
  const title=payload?.title||payload?.titleEs||payload?.titleEn||payload?.id||'—';
  const containerLabel=payload?.containerLabelSingular||importPreview?.containerLabelSingular||tr('colección','collection');
  const collection=payload?.collectionName||tr('Sin colección','No collection');
  if(mode==='done'){
    return '✓ '+label+' «'+title+'» · '+containerLabel+' «'+collection+'»';
  }
  return tr('Cargando ','Loading ')+label+' «'+title+'» '+tr('en ','in ')+containerLabel+' «'+collection+'»…';
}

function importBegin(payload){
  if(!importOpen)return;
  const current=document.querySelector('[data-nexo-import-current]');
  if(current)current.innerHTML=importSpinner(tr('Iniciando importación…','Starting import…'));
  progress(payload||{});
}

function importItemStart(payload){
  if(!importOpen)return;
  const current=document.querySelector('[data-nexo-import-current]');
  if(current)current.innerHTML=importSpinner(itemProgressText(payload,'start'));
}

function importItemDone(payload){
  if(!importOpen)return;
  appendImportLog('<div class="nexoImportLogRow done">'+esc(itemProgressText(payload,'done'))+'</div>');
}

function progress(payload){
  if(!importOpen)return;
  const done=Number(payload?.processedCount||0);
  const total=Number(payload?.totalCount||importPreview?.totalCount||0);
  const percent=Number.isFinite(Number(payload?.percent))
    ?Number(payload.percent)
    :(total?Math.round((done/total)*100):0);
  const bar=document.querySelector('[data-nexo-import-bar]');
  const pct=document.querySelector('[data-nexo-import-percent]');
  const counter=document.querySelector('[data-nexo-import-counter]');
  if(bar)bar.style.width=Math.max(0,Math.min(100,percent))+'%';
  if(pct)pct.textContent=percent+'%';
  if(counter)counter.textContent=done+' / '+total;
}

function importDone(payload){
  if(!importOpen)return;
  progress({processedCount:payload?.totalCount||payload?.processedCount||importPreview?.totalCount||0,totalCount:payload?.totalCount||importPreview?.totalCount||0,percent:100});
  const current=document.querySelector('[data-nexo-import-current]');
  if(current)current.innerHTML='<div class="nexoImportComplete">✓ '+esc(tr('Importación completada. Actualizando biblioteca…','Import complete. Refreshing library…'))+'</div>';
  appendImportLog('<div class="nexoImportLogRow done strong">✓ '+esc(tr('Paquete completado','Package complete'))+'</div>');
  setTimeout(()=>{closeLayer();activeTab='collections'},1200);
}

function importError(payload){
  if(!importOpen)return;
  const item=payload?.item||null;
  const current=document.querySelector('[data-nexo-import-current]');
  const message=payload?.message||tr('No se pudo completar la importación.','Import could not be completed.');
  if(current)current.innerHTML='<div class="nexoImportFailure">⚠ '+esc(message)+'</div>';
  if(item){
    const label=item?.itemLabelSingular||importPreview?.itemLabelSingular||tr('elemento','item');
    const title=item?.title||item?.titleEs||item?.titleEn||item?.id||'—';
    const containerLabel=importPreview?.containerLabelSingular||tr('colección','collection');
    const collection=item?.collectionName||tr('Sin colección','No collection');
    appendImportLog('<div class="nexoImportLogRow error">✕ '+esc(label+' «'+title+'» · '+containerLabel+' «'+collection+'» — '+message)+'</div>');
  }else{
    appendImportLog('<div class="nexoImportLogRow error">✕ '+esc(message)+'</div>');
  }
  const footer=document.querySelector('[data-nexo-import-footer]');
  if(footer){
    footer.innerHTML='<button type="button" class="nexoWorkspaceBtn" data-nexo-import-close>'+esc(tr('Cerrar','Close'))+'</button><button type="button" class="nexoWorkspaceBtn primary" data-nexo-import-resume>'+esc(tr('Continuar importación','Continue import'))+'</button>';
    footer.querySelector('[data-nexo-import-close]').onclick=closeLayer;
    footer.querySelector('[data-nexo-import-resume]').onclick=()=>{
      footer.innerHTML='';
      parent.postMessage({type:'NEXO_DM_IMPORT_CONFIRM',payload:{code:importCode}},'*');
    };
  }
}

function previewAck(payload){
  if(!importOpen)return;
  const validation=document.querySelector('[data-nexo-import-validation]');
  if(validation)validation.innerHTML=importSpinner(
    payload?.message||tr('Código recibido. Cargando resumen del paquete…','Code received. Loading package summary…')
  );
  clearTimeout(previewWatchdog);
  previewWatchdog=setTimeout(()=>{
    if(importOpen&&!importPreview){
      previewError({message:tr(
        'El código llegó al servidor, pero el resumen tardó demasiado. Reintenta; no se modificaron datos.',
        'The code reached the server, but the summary took too long. Retry; no data was changed.'
      )});
    }
  },15000);
}

function previewError(payload){
  if(!importOpen)return;
  clearTimeout(previewWatchdog);
  previewWatchdog=0;
  const validation=document.querySelector('[data-nexo-import-validation]');
  const button=document.querySelector('[data-nexo-import-preview]');
  if(validation)validation.innerHTML='<div class="nexoImportFailure">⚠ '+esc(payload?.message||tr('No se pudo validar el paquete.','Package could not be validated.'))+'</div>';
  if(button){button.disabled=false;button.textContent=tr('Revisar paquete','Review package')}
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
  if(m.type==='NEXO_DM_IMPORT_PREVIEW_ACK')previewAck(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_PREVIEW')renderImportPreview(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_PREVIEW_ERROR')previewError(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_BEGIN')importBegin(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_ITEM_START')importItemStart(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_ITEM_DONE')importItemDone(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_PROGRESS')progress(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_DONE')importDone(m.payload||{});
  if(m.type==='NEXO_DM_IMPORT_ERROR')importError(m.payload||{});
  if(m.type==='MENU_DATA_LOADED')setTimeout(enhanceRoot,0);
});

setTimeout(enhanceRoot,0);
})();