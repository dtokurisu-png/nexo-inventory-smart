(function(){
if(window.__nexoFichasApp)return;window.__nexoFichasApp=true;

const ACCESS_REVISION='fichas-theme-contract-20261001-26';
const ENGINE_REVISION='theme-unified-20261001-24';
const NUMA_CSS='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/numa-overlay.css?v=numa-deep-search-20260930-1';
const THEME_RUNTIME_URL='https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/theme-runtime.js?v=20261001-theme-runtime-1';
const freeSite=/\.(wixstudio|wixsite)\.com$/i.test(location.hostname);
const apiBase=freeSite?'/'+location.pathname.split('/').filter(Boolean)[0]:'';
const API=apiBase+'/_functions/nexoFichasUi';
const ENGINE='https://dtokurisu-png.github.io/nexo-inventory-smart/menu-dinamico/live.html?nexo=1&v='+encodeURIComponent(ENGINE_REVISION);

let accessStage='WAITING_PAGE';
let sessionToken='';
let frame=null;
let loadingData=false;
let importing=false;
let importPreview=null;
let importCode='';
let numaState=null;
let numaContextKey='';
let numaLoading=false;
let numaSending=false;
let requestedSheetOpened=false;
let engineDataCache=null;
const launchQuery=new URLSearchParams(location.search);
const workspaceLabel=launchQuery.get('nxoBackLabel')||'Workspace';
const workspaceToolName=String(launchQuery.get('nxoToolName')||'Fichas Técnicas Dinámicas').trim()||'Fichas Técnicas Dinámicas';
const workspaceToolDescription=String(launchQuery.get('nxoToolDescription')||'').trim();
let workspaceTheme=launchQuery.get('nxoTheme')==='night'?'night':'day';
let UI_THEME=null;

function ensureThemeRuntime(){
  const ready=()=>window.NEXO_THEME_RUNTIME?.ready?.then(()=>{
    window.NEXO_THEME_RUNTIME.setTheme(workspaceTheme,{persist:false,notify:false});
    UI_THEME=window.NEXO_THEME_RUNTIME.getThemeTokens();
    if(!UI_THEME)throw new Error('NEXO_THEME_TOKENS_UNAVAILABLE');
    return UI_THEME;
  });
  if(window.NEXO_THEME_RUNTIME)return ready();
  return new Promise((resolve,reject)=>{
    let script=document.getElementById('nexo-theme-runtime-script');
    if(script){
      script.addEventListener('load',()=>ready().then(resolve,reject),{once:true});
      script.addEventListener('error',()=>reject(new Error('NEXO_THEME_RUNTIME_LOAD_FAILED')),{once:true});
      return;
    }
    script=document.createElement('script');
    script.id='nexo-theme-runtime-script';
    script.src=THEME_RUNTIME_URL;
    script.async=false;
    script.onload=()=>ready().then(resolve,reject);
    script.onerror=()=>reject(new Error('NEXO_THEME_RUNTIME_LOAD_FAILED'));
    document.head.appendChild(script);
  });
}
function applyImportThemeVars(host=document.getElementById('nx-import-host')){
  if(!host||!UI_THEME)return;
  const vars={
    '--nx-bg':UI_THEME.background,'--nx-surface':UI_THEME.surface,'--nx-raised':UI_THEME.surfaceRaised,
    '--nx-border':UI_THEME.border,'--nx-border-strong':UI_THEME.borderStrong,'--nx-text':UI_THEME.textPrimary,
    '--nx-soft':UI_THEME.textSecondary,'--nx-muted':UI_THEME.textMuted,'--nx-accent':UI_THEME.accent,
    '--nx-accent-soft':UI_THEME.accentSoft,'--nx-accent-contrast':UI_THEME.accentContrast,'--nx-positive':UI_THEME.positive,
    '--nx-positive-contrast':UI_THEME.positiveContrast,'--nx-interaction':UI_THEME.interaction,
    '--nx-interaction-contrast':UI_THEME.interactionContrast,'--nx-danger':UI_THEME.danger,'--nx-overlay':UI_THEME.overlay,
    '--nx-btn-bg':UI_THEME.buttonSecondaryBg,'--nx-btn-text':UI_THEME.buttonSecondaryText,'--nx-btn-border':UI_THEME.buttonSecondaryBorder
  };
  Object.entries(vars).forEach(([key,value])=>host.style.setProperty(key,value));
}
function applyWorkspaceTheme(theme,{persist=true,notifyEngine=true}={}){
  workspaceTheme=theme==='night'?'night':'day';
  if(window.NEXO_THEME_RUNTIME){
    window.NEXO_THEME_RUNTIME.setTheme(workspaceTheme,{persist,notify:false});
    UI_THEME=window.NEXO_THEME_RUNTIME.getThemeTokens()||UI_THEME;
  }
  const root=document.getElementById('nx-fichas-app');
  if(root&&UI_THEME){root.style.background=UI_THEME.background;root.style.color=UI_THEME.textPrimary}
  if(frame&&UI_THEME)frame.style.background=UI_THEME.background;
  const launcher=document.getElementById('nma-launcher'),panel=document.getElementById('nma-panel');
  if(launcher)launcher.dataset.theme=workspaceTheme;
  if(panel)panel.dataset.theme=workspaceTheme;
  applyImportThemeVars();
  try{
    const u=new URL(location.href);
    u.searchParams.set('nxoTheme',workspaceTheme);
    history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
  }catch(_){}
  if(notifyEngine)postToEngine('NEXO_WORKSPACE_CONTEXT',{workspaceMode:true,workspaceLabel,toolName:workspaceToolName,toolDescription:workspaceToolDescription,theme:workspaceTheme,language:workspaceLanguage});
}
let workspaceLanguage=launchQuery.get('nxoLang')==='en'?'en':'es';
const requestedSheetId=launchQuery.get('numaSheet')||'';
const requestedSheetTitle=launchQuery.get('numaSheetTitle')||'';

function ensureNumaCss(){
  if(document.getElementById('nma-overlay-css'))return;
  const link=document.createElement('link');
  link.id='nma-overlay-css';
  link.rel='stylesheet';
  link.href=NUMA_CSS;
  document.head.appendChild(link);
}
function numaContextInput(){
  return {
    currentToolKey:'dynamic-specs',
    currentToolLabel:workspaceToolName
  };
}
function numaSearchNorm(value){
  try{
    return String(value??'')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g,' ')
      .trim();
  }catch(_){return String(value??'').toLowerCase().trim()}
}
function numaExtractSheetQuery(message){
  let q=String(message||'').trim();
  const related=q.match(/(?:fichas?|recetas?).*?(?:relacionad[oa]s?\s+con|sobre|que\s+tengan?)\s+(.+)$/i);
  if(related?.[1])q=related[1];
  else{
    q=q.replace(/^.*?\b(?:abre|abrir|busca|buscar|encuentra|encontrar|muestra|mostrar|ve\s+a|ir\s+a)\b\s*/i,'');
    q=q.replace(/^(?:la|el|los|las|una|un)\s+/i,'');
    q=q.replace(/^(?:ficha(?:\s+t[eé]cnica)?|receta|plato|preparaci[oó]n)\s*(?:de|llamada?|que\s+se\s+llama)?\s*/i,'');
  }
  q=q.replace(/\s+(?:en\s+)?(?:fichas(?:\s+t[eé]cnicas)?|recetario)\s*$/i,'');
  q=q.replace(/\s+(?:o\s+no|por\s+favor|porfa|si\s+puedes|si\s+puede)\s*[?!.]*$/i,'');
  q=q.replace(/^[¿?¡!.,;:\s]+|[¿?¡!.,;:\s]+$/g,'');
  return q.slice(0,300);
}
function numaLocalSheetContext(message){
  const data=engineDataCache;
  const recipes=Array.isArray(data?.recipes)?data.recipes:[];
  const query=numaExtractSheetQuery(message);
  const sample=recipes.slice(0,10).map(row=>row?.titleEs||row?.titleEn||row?._id).filter(Boolean);
  if(!query)return {query:'',matches:[],total:recipes.length,sample};

  const sectionsByRecipe=new Map();
  for(const section of Array.isArray(data?.sections)?data.sections:[]){
    const recipeId=String(section?.recipeId||'');
    if(!recipeId)continue;
    if(!sectionsByRecipe.has(recipeId))sectionsByRecipe.set(recipeId,[]);
    sectionsByRecipe.get(recipeId).push(section);
  }
  const ingredients=new Map((Array.isArray(data?.ingredients)?data.ingredients:[]).map(row=>[String(row?._id||''),row]));
  const preparations=new Map((Array.isArray(data?.preparations)?data.preparations:[]).map(row=>[String(row?._id||''),row]));
  const recipesById=new Map(recipes.map(row=>[String(row?._id||''),row]));
  const q=numaSearchNorm(query);
  const tokens=q.split(' ').filter(Boolean);
  const matches=[];

  for(const recipe of recipes){
    const id=String(recipe?._id||'');
    if(!id)continue;
    const titleEs=numaSearchNorm(recipe?.titleEs);
    const titleEn=numaSearchNorm(recipe?.titleEn);
    const sections=sectionsByRecipe.get(id)||[];
    const sectionIds=new Set(sections.map(section=>String(section?._id||'')).filter(Boolean));
    const corpus=[
      recipe?.titleEs,recipe?.titleEn,recipe?.category,recipe?.recipeType,
      recipe?.notesEs,recipe?.notesEn,recipe?.methodEs,recipe?.methodEn
    ];
    for(const section of sections)corpus.push(section?.titleEs,section?.titleEn,section?.sectionType);
    for(const component of Array.isArray(data?.components)?data.components:[]){
      if(String(component?.recipeId||'')!==id&&!sectionIds.has(String(component?.sectionId||'')))continue;
      corpus.push(component?.displayEs,component?.displayEn,component?.noteEs,component?.noteEn);
      const ingredient=ingredients.get(String(component?.targetIngredientId||''));
      if(ingredient)corpus.push(ingredient?.nameEs,ingredient?.nameEn,ingredient?.descriptionEs,ingredient?.descriptionEn);
      const preparation=preparations.get(String(component?.targetPreparationId||''));
      if(preparation)corpus.push(preparation?.nameEs,preparation?.nameEn,preparation?.descriptionEs,preparation?.descriptionEn);
      const subRecipe=recipesById.get(String(component?.targetRecipeId||''));
      if(subRecipe)corpus.push(subRecipe?.titleEs,subRecipe?.titleEn);
    }

    let score=0;
    if(titleEs===q||titleEn===q)score+=120;
    else if(titleEs.startsWith(q)||titleEn.startsWith(q))score+=90;
    else if(titleEs.includes(q)||titleEn.includes(q))score+=75;

    const hay=numaSearchNorm(corpus.filter(Boolean).join(' '));
    const matched=tokens.filter(token=>hay.includes(token)).length;
    if(tokens.length&&matched===tokens.length)score+=45;
    else score+=matched*8;
    if(numaSearchNorm(recipe?.category).includes(q))score+=12;
    if(score<=0)continue;

    matches.push({
      id,
      title:recipe?.titleEs||recipe?.titleEn||id,
      titleEs:recipe?.titleEs||'',
      titleEn:recipe?.titleEn||'',
      score,
      exact:titleEs===q||titleEn===q
    });
  }

  matches.sort((a,b)=>
    Number(b.exact)-Number(a.exact)||
    Number(b.score)-Number(a.score)||
    String(a.title).localeCompare(String(b.title),'es')
  );
  return {query,matches:matches.slice(0,8),total:recipes.length,sample};
}
function numaTime(value){
  try{return new Date(value||Date.now()).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}catch(_){return''}
}
function numaRenderMessages(messages=[]){
  const zone=document.getElementById('nma-messages');
  if(!zone)return;
  if(!messages.length){
    zone.innerHTML='<div class="nma-empty"><strong>Hola, soy Numa.</strong><span>Estoy dentro de Fichas Técnicas Dinámicas. Puedo buscar, listar y abrir fichas visibles sin consumir API.</span><small>Prueba: “¿Cuántas fichas tengo?”, “Busca la sopa de cebolla” o “Regresa”.</small></div>';
    return;
  }
  zone.innerHTML=messages.map(m=>
    '<div class="nma-message '+(m.role==='user'?'user':'assistant')+'">'+
      '<div class="nma-message-body">'+esc(m.content||'')+'</div>'+
      '<small>'+esc(numaTime(m.at))+'</small>'+
    '</div>'
  ).join('');
  requestAnimationFrame(()=>{zone.scrollTop=zone.scrollHeight});
}
function numaSetStatus(value,state=''){
  const el=document.getElementById('nma-status');
  if(!el)return;
  el.textContent=value||'';
  el.dataset.state=state;
}
function numaSyncHeader(){
  const ctx=numaState?.context;
  const title=document.getElementById('nma-context');
  if(title){
    title.textContent=ctx
      ?((ctx.workspaceName?ctx.workspaceName+' · ':'')+workspaceToolName)
      :workspaceToolName;
  }
  const role=document.getElementById('nma-role');
  if(role){
    role.textContent=ctx?.roleName||'';
    role.hidden=!ctx?.roleName;
  }
}
async function numaLoad(force=false){
  if(!sessionToken||numaLoading)return;
  const key='dynamic-specs|'+workspaceLabel;
  if(!force&&numaState&&numaContextKey===key){
    numaSyncHeader();
    numaRenderMessages(numaState.messages||[]);
    return;
  }
  numaLoading=true;
  numaSetStatus('Cargando contexto…','loading');
  try{
    const data=await api('numa.bootstrap',{input:numaContextInput()});
    numaState=data||null;
    numaContextKey=key;
    numaSyncHeader();
    numaRenderMessages(data?.messages||[]);
    numaSetStatus(data?.providerMode==='local_only'?'Modo local · sin consumo API':(data?.providerConfigured?'API configurada':'Búsqueda local activa'),'local');
  }catch(error){
    numaSetStatus(error?.message||String(error),'error');
  }finally{
    numaLoading=false;
  }
}
function numaOpen(){
  const panel=document.getElementById('nma-panel');
  if(!panel)return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');
  document.getElementById('nma-launcher')?.setAttribute('aria-expanded','true');
  numaLoad(false);
  setTimeout(()=>document.getElementById('nma-input')?.focus(),80);
}
function numaClose(){
  document.getElementById('nma-panel')?.classList.remove('open');
  document.getElementById('nma-panel')?.setAttribute('aria-hidden','true');
  document.getElementById('nma-launcher')?.setAttribute('aria-expanded','false');
}
function toolUrl(routePath){
  const route=String(routePath||'').trim();
  if(!route)return'';
  try{
    const u=new URL(siteBase()+(route.startsWith('/')?route:'/'+route),location.href);
    u.searchParams.set('nxoBack',location.href);
    u.searchParams.set('nxoBackLabel',workspaceToolName);
    u.searchParams.set('nxoTheme',workspaceTheme);
    return u.href;
  }catch(_){return''}
}
function numaPerformAction(action){
  if(!action)return;
  if(action.type==='openWorkspace'){
    if(!action.workspaceId){numaSetStatus('Numa no recibió un Workspace válido.','error');return}
    numaClose();
    try{
      const u=new URL(siteBase()+'/blank-8',location.href);
      u.searchParams.set('nxoWorkspace',String(action.workspaceId));
      u.searchParams.set('nxoTheme',workspaceTheme);
      location.assign(u.href);
    }catch(_){openPersonalSpace()}
    return;
  }
  if(action.type==='goBack'){
    numaClose();
    if(history.length>1){history.back();return}
    openPersonalSpace();
    return;
  }
  if(action.type==='openTechnicalSheet'){
    if(!action.sheetId){numaSetStatus('La ficha no tiene un identificador válido.','error');return}
    postToEngine('NUMA_OPEN_RECIPE',{sheetId:String(action.sheetId),title:String(action.title||'')});
    numaSetStatus('Ficha abierta','local');
    numaClose();
    return;
  }
  if(action.type!=='navigate')return;
  if(action.target==='mi-espacio'){openPersonalSpace();return}
  if(action.target==='centro-desarrollo'){openDevelopmentCenter();return}
  const url=toolUrl(action.routePath);
  if(url)location.assign(url);
}
async function numaSend(){
  if(numaSending)return;
  const input=document.getElementById('nma-input');
  const button=document.getElementById('nma-send');
  const message=String(input?.value||'').trim();
  if(!message)return;
  numaSending=true;
  if(input){input.value='';input.disabled=true}
  if(button)button.disabled=true;
  const optimistic=[
    ...(numaState?.messages||[]),
    {role:'user',content:message,at:new Date().toISOString()}
  ];
  numaRenderMessages(optimistic);
  numaSetStatus('Numa está buscando…','loading');
  try{
    const localSheetContext=numaLocalSheetContext(message);
    const data=await api('numa.send',{input:{...numaContextInput(),message,localSheetContext}});
    numaState={
      ...(numaState||{}),
      context:data?.context||numaState?.context||null,
      messages:[...optimistic,(data?.message||{role:'assistant',content:'Listo.',at:new Date().toISOString()})]
    };
    numaSyncHeader();
    numaRenderMessages(numaState.messages);
    numaSetStatus(data?.provider==='openai'?'IA conectada':(data?.provider==='openai_error'?'OpenAI requiere atención':(data?.provider==='local_only'?'Modo local · sin consumo API':'Búsqueda local activa')),data?.provider==='openai'?'online':(data?.provider==='openai_error'?'error':'local'));
    if(data?.action)setTimeout(()=>numaPerformAction(data.action),350);
  }catch(error){
    const failed=[...optimistic,{role:'assistant',content:'No pude completar esa solicitud: '+(error?.message||String(error)),at:new Date().toISOString()}];
    numaState={...(numaState||{}),messages:failed};
    numaRenderMessages(failed);
    numaSetStatus('No se pudo completar la solicitud','error');
  }finally{
    numaSending=false;
    if(input){input.disabled=false;input.focus()}
    if(button)button.disabled=false;
  }
}
function mountNuma(){
  if(!sessionToken)return;
  ensureNumaCss();
  let launcher=document.getElementById('nma-launcher');
  if(!launcher){
    launcher=document.createElement('button');
    launcher.id='nma-launcher';
    launcher.className='nma-launcher';
    launcher.dataset.theme=workspaceTheme;
    launcher.type='button';
    launcher.setAttribute('aria-label','Abrir Numa');
    launcher.setAttribute('aria-expanded','false');
    launcher.innerHTML='<span class="nma-orb" aria-hidden="true">N</span><strong>Numa</strong>';
    document.body.appendChild(launcher);
    launcher.onclick=()=>document.getElementById('nma-panel')?.classList.contains('open')?numaClose():numaOpen();
  }
  let panel=document.getElementById('nma-panel');
  if(!panel){
    panel=document.createElement('aside');
    panel.id='nma-panel';
    panel.className='nma-panel';
    panel.dataset.theme=workspaceTheme;
    panel.setAttribute('aria-hidden','true');
    panel.innerHTML=
      '<div class="nma-head">'+
        '<div class="nma-identity"><span class="nma-orb" aria-hidden="true">N</span><div><strong>Numa</strong><small id="nma-context">'+esc(workspaceToolName)+'</small></div></div>'+
        '<div class="nma-head-actions"><span class="nma-role" id="nma-role" hidden></span><button id="nma-close" class="nma-icon-btn" type="button" aria-label="Cerrar Numa">✕</button></div>'+
      '</div>'+
      '<div class="nma-status-row"><span class="nma-status-dot"></span><span id="nma-status">Preparando Numa…</span></div>'+
      '<div class="nma-messages" id="nma-messages"></div>'+
      '<div class="nma-compose"><textarea id="nma-input" rows="2" maxlength="8000" placeholder="Busca una ficha o pregúntale a Numa…"></textarea><button id="nma-send" type="button" aria-label="Enviar mensaje">➤</button></div>';
    document.body.appendChild(panel);
    panel.querySelector('#nma-close').onclick=numaClose;
    panel.querySelector('#nma-send').onclick=numaSend;
    panel.querySelector('#nma-input').addEventListener('keydown',event=>{
      if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();numaSend()}
      if(event.key==='Escape')numaClose();
    });
  }
  numaSyncHeader();
}
function clearRequestedSheetParams(){
  try{
    const u=new URL(location.href);
    u.searchParams.delete('numaSheet');
    u.searchParams.delete('numaSheetTitle');
    history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
  }catch(_){}
}
function openRequestedSheet(){
  if(requestedSheetOpened||!requestedSheetId)return;
  postToEngine('NUMA_OPEN_RECIPE',{sheetId:requestedSheetId,title:requestedSheetTitle});
}
function accessError(code){
  return new Error('No se pudo completar el acceso ('+ACCESS_REVISION+' / '+accessStage+' / '+code+'). Reintenta.');
}
function esc(v){
  return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function mountRoot(){
  document.body.style.overflow='hidden';
  let root=document.getElementById('nx-fichas-app');
  if(!root){
    root=document.createElement('div');
    root.id='nx-fichas-app';
    root.style.cssText='position:fixed;inset:0;z-index:2147483500;background:'+UI_THEME.background+';color:'+UI_THEME.textPrimary+';display:block;';
    document.body.appendChild(root);
  }
  return root;
}
function loading(text='Preparando '+workspaceToolName+'…'){
  mountRoot().innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:'+UI_THEME.background+';color:'+UI_THEME.textPrimary+';font:600 14px Inter,Arial,sans-serif"><div style="text-align:center"><div style="width:34px;height:34px;border:3px solid '+UI_THEME.border+';border-top-color:'+UI_THEME.accent+';border-radius:50%;margin:0 auto 14px;animation:nxspin .8s linear infinite"></div><strong>'+esc(text)+'</strong><style>@keyframes nxspin{to{transform:rotate(360deg)}}</style></div></div>';
}
function showError(error){
  const message=String(error?.message||error||'Error desconocido');
  mountRoot().innerHTML='<div style="position:absolute;inset:0;display:grid;place-items:center;background:'+UI_THEME.background+';color:'+UI_THEME.textPrimary+';font:14px Inter,Arial,sans-serif;padding:24px"><div style="max-width:560px;border:1px solid '+UI_THEME.border+';border-radius:18px;background:'+UI_THEME.surfaceRaised+';padding:22px"><h2 style="margin:0 0 10px">No se pudo abrir '+esc(workspaceToolName)+'</h2><p style="color:'+UI_THEME.textMuted+';line-height:1.55">'+esc(message)+'</p><button id="nx-engine-retry" style="border:1px solid '+UI_THEME.borderStrong+';background:'+UI_THEME.accent+';color:'+UI_THEME.accentContrast+';border-radius:10px;padding:10px 14px;font-weight:800">Reintentar</button></div></div>';
  document.getElementById('nx-engine-retry')?.addEventListener('click',retryAccess);
}
function loginVisible(visible){
  const root=document.getElementById('nx-fichas-app');
  if(root)root.style.display=visible?'none':'block';
}
function retryAccess(){
  const u=new URL(location.href);
  ['nxb','nxbe','nxbs','nxav'].forEach(k=>u.searchParams.delete(k));
  location.replace(u.href);
}
async function api(action,payload={}){
  const headers={'Content-Type':'application/json','Accept':'application/json'};
  if(sessionToken)headers.Authorization='Bearer '+sessionToken;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),30000);
  try{
    const response=await fetch(API,{
      method:'POST',
      cache:'no-store',
      signal:controller.signal,
      headers,
      body:JSON.stringify({action,...payload})
    });
    let data=null;
    try{data=await response.json()}catch(_){}
    if(!response.ok){
      if(data?.error)throw new Error(String(data.error));
      throw new Error('No se pudo completar '+action+' (HTTP_'+response.status+').');
    }
    if(!data)throw new Error('Respuesta inválida en '+action+'.');
    if(data?.ok===false)throw new Error(data.error||'Operación no disponible');
    return data?.data??data;
  }catch(error){
    if(error?.name==='AbortError')throw accessError('REQUEST_TIMEOUT');
    throw error;
  }finally{
    clearTimeout(timer);
  }
}
function stripBoot(){
  try{
    const u=new URL(location.href);
    ['nxb','nxbe','nxbs','nxav'].forEach(k=>u.searchParams.delete(k));
    history.replaceState(history.state||{},'',u.pathname+u.search+u.hash);
  }catch(_){}
}
async function waitBoot(){
  let previous='',deadline=Date.now()+30000;
  try{
    while(Date.now()<deadline){
      const q=new URLSearchParams(location.search);
      const token=q.get('nxb');
      const error=q.get('nxbe');
      const state=q.get('nxbs')||'WAITING_PAGE';
      if(state!==previous){
        previous=state;
        accessStage=state;
        deadline=Date.now()+(state==='LOGIN'?310000:30000);
        loginVisible(state==='LOGIN');
      }
      if(error)throw accessError(error);
      if(token&&(state==='READY'||state==='WAITING_PAGE'))return token;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw accessError('PAGE_TIMEOUT');
  }finally{
    loginVisible(false);
  }
}
function workspaceReturnUrl(){
  const q=new URLSearchParams(location.search);
  const raw=q.get('nxoBack')||'';
  if(raw){
    try{
      const u=new URL(raw,location.href);
      if(u.origin===location.origin){
        u.searchParams.set('nxoLang',workspaceLanguage);
        u.searchParams.set('nxoTheme',workspaceTheme);
        return u.href
      }
    }catch(_){}
  }
  const parts=location.pathname.replace(/\/+$/,'').split('/').filter(Boolean);
  const siteRoot=location.origin+(parts.length?'/'+parts[0]:'');
  const u=new URL(siteRoot+'/blank-8');
  u.searchParams.set('nxoLang',workspaceLanguage);
  u.searchParams.set('nxoTheme',workspaceTheme);
  return u.href;
}
function exitToWorkspace(){
  location.assign(workspaceReturnUrl());
}
function siteBase(){
  const p=location.pathname.replace(/\/+$/,'');
  return (location.origin+p.replace(/\/blank-4$/,'')).replace(/\/$/,'');
}
function openPersonalSpace(){
  const u=new URL(siteBase()+'/blank-8',location.href);
  u.searchParams.set('nxoLang',workspaceLanguage);
  u.searchParams.set('nxoTheme',workspaceTheme);
  location.assign(u.href);
}
function openDevelopmentCenter(){
  const u=new URL(siteBase()||location.origin,location.href);
  u.searchParams.set('nxoLang',workspaceLanguage);
  u.searchParams.set('nxoTheme',workspaceTheme);
  location.assign(u.href);
}
function postToEngine(type,payload={}){
  try{frame?.contentWindow?.postMessage({type,payload},'*')}catch(_){}
}
async function pushEngineData(){
  if(loadingData)return;
  loadingData=true;
  try{
    const data=await api('engine.data');
    engineDataCache=data||null;
    postToEngine('DM_MENU_DATA',{ok:true,...data});
  }catch(error){
    postToEngine('DM_MENU_DATA',{ok:false,error:String(error?.message||error)});
    throw error;
  }finally{
    loadingData=false;
  }
}
function ensureImportHostStyles(){
  if(document.getElementById('nx-import-host-style'))return;
  const style=document.createElement('style');
  style.id='nx-import-host-style';
  style.textContent=
    '#nx-import-host{position:fixed;inset:0;z-index:2147483646;background:var(--nx-overlay);display:grid;place-items:center;padding:18px;font-family:Inter,Arial,sans-serif;color:var(--nx-text)}'+
    '#nx-import-host .box{width:min(660px,calc(100vw - 36px));max-height:88vh;overflow:auto;background:var(--nx-raised);color:var(--nx-text);border:1px solid var(--nx-border-strong);border-radius:20px;box-shadow:0 28px 70px rgba(0,0,0,.28)}'+
    '#nx-import-host .head{display:flex;align-items:center;justify-content:space-between;padding:15px 17px;border-bottom:1px solid var(--nx-border);position:sticky;top:0;background:var(--nx-surface);z-index:2}'+
    '#nx-import-host .head strong{font-size:17px}#nx-import-host .close{width:36px;height:36px;border:1px solid var(--nx-btn-border);border-radius:10px;background:var(--nx-btn-bg);color:var(--nx-btn-text);font-size:22px;cursor:pointer}#nx-import-host .close:hover{background:var(--nx-interaction);color:var(--nx-interaction-contrast);border-color:var(--nx-interaction)}'+
    '#nx-import-host .body{padding:17px}#nx-import-host p{color:var(--nx-muted);line-height:1.5}'+
    '#nx-import-host input{width:100%;box-sizing:border-box;border:1px solid var(--nx-border);border-radius:11px;padding:12px 13px;font:inherit;background:var(--nx-surface);margin:6px 0 12px;color:var(--nx-text);outline:none}#nx-import-host input::placeholder{color:var(--nx-muted)}#nx-import-host input:focus{border-color:var(--nx-interaction);box-shadow:0 0 0 3px var(--nx-accent-soft)}'+
    '#nx-import-host .btn{border:1px solid var(--nx-btn-border);background:var(--nx-btn-bg);color:var(--nx-btn-text);border-radius:11px;padding:10px 13px;font-weight:850;cursor:pointer;transition:transform .14s ease,background .14s ease,color .14s ease,box-shadow .14s ease}'+
    '#nx-import-host .btn.primary{background:var(--nx-positive);color:var(--nx-positive-contrast);border-color:var(--nx-positive)}#nx-import-host .btn:hover,#nx-import-host .btn:focus-visible{background:var(--nx-interaction);color:var(--nx-interaction-contrast);border-color:var(--nx-interaction);transform:translateY(-1px);box-shadow:0 8px 16px rgba(0,0,0,.18);outline:none}#nx-import-host .btn:active{transform:translateY(0) scale(.99)}#nx-import-host .btn:disabled{opacity:.55;cursor:default;transform:none;box-shadow:none}'+
    '#nx-import-host .wide{width:100%}.nx-imp-spin{display:flex;align-items:center;gap:9px;color:var(--nx-muted);font-size:12px;min-height:24px;margin-bottom:10px}'+
    '.nx-imp-spin:before{content:"";width:15px;height:15px;border:2px solid var(--nx-border);border-top-color:var(--nx-accent);border-radius:50%;animation:nxImpSpin .8s linear infinite}@keyframes nxImpSpin{to{transform:rotate(360deg)}}'+
    '.nx-imp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}.nx-imp-stat{background:var(--nx-surface);border:1px solid var(--nx-border);border-radius:12px;padding:11px}.nx-imp-stat strong{display:block;font-size:20px}.nx-imp-stat span{font-size:10px;color:var(--nx-muted)}'+
    '.nx-imp-group{display:flex;justify-content:space-between;gap:12px;padding:10px 11px;border:1px solid var(--nx-border);border-radius:11px;margin:7px 0;background:var(--nx-surface)}.nx-imp-group span{color:var(--nx-muted);font-size:11px}'+
    '.nx-imp-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.nx-imp-resume{padding:10px 11px;border:1px solid var(--nx-border);background:var(--nx-accent-soft);border-radius:11px;color:var(--nx-soft);font-size:11px;line-height:1.45;margin:12px 0}'+
    '.nx-imp-bar{height:10px;background:var(--nx-accent-soft);border-radius:999px;overflow:hidden;margin:14px 0 5px}.nx-imp-bar span{display:block;height:100%;background:var(--nx-accent);border-radius:999px;transition:width .2s ease}'+
    '.nx-imp-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.nx-imp-current{border:1px solid var(--nx-border);background:var(--nx-surface);border-radius:11px;padding:10px 11px;margin:11px 0;font-size:12px}'+
    '.nx-imp-log{max-height:250px;overflow:auto;border:1px solid var(--nx-border);border-radius:12px;background:var(--nx-surface);padding:7px}.nx-imp-row{padding:7px 8px;border-bottom:1px solid var(--nx-border);font-size:11px;line-height:1.4}.nx-imp-row:last-child{border-bottom:0}.nx-imp-row.ok{color:var(--nx-positive)}.nx-imp-row.err{color:var(--nx-danger);background:var(--nx-accent-soft)}'+
    '.nx-imp-error{color:var(--nx-danger);font-size:12px;line-height:1.45;margin:8px 0}.nx-imp-success{color:var(--nx-positive);font-weight:850}'+
    '@media(max-width:560px){.nx-imp-stats{grid-template-columns:1fr 1fr}.nx-imp-actions{display:grid;grid-template-columns:1fr 1fr}.nx-imp-actions .btn{width:100%}}';
  document.head.appendChild(style);
}

function closeImportHost(){
  document.getElementById('nx-import-host')?.remove();
}

function importHostShell(){
  ensureImportHostStyles();
  closeImportHost();
  const host=document.createElement('div');
  host.id='nx-import-host';
  applyImportThemeVars(host);
  host.innerHTML='<div class="box"><div class="head"><strong>Importar paquete</strong><button class="close" type="button">×</button></div><div class="body"></div></div>';
  host.querySelector('.close').onclick=closeImportHost;
  host.onclick=e=>{if(e.target===host)closeImportHost()};
  document.body.appendChild(host);
  return host.querySelector('.body');
}

function countWord(n,singular,plural){return Number(n)===1?singular:plural}

function renderImportCodeStage(){
  const body=importHostShell();
  body.innerHTML='<p>Ingresa el código entregado por Nexo Group. Primero revisaremos el paquete; no se modificará ningún dato hasta que confirmes.</p>'+
    '<input id="nx-import-code-input" placeholder="NEXO-…" autocomplete="off" autocapitalize="characters">'+
    '<div id="nx-import-host-status"></div>'+
    '<button id="nx-import-review" class="btn primary wide" type="button">Revisar paquete</button>';
  const input=body.querySelector('#nx-import-code-input');
  const button=body.querySelector('#nx-import-review');
  input.focus();
  button.onclick=async()=>{
    const code=String(input.value||'').trim();
    if(!code)return;
    importCode=code;
    button.disabled=true;
    const status=body.querySelector('#nx-import-host-status');
    status.innerHTML='<div class="nx-imp-spin">Validando código y cargando resumen…</div>';
    try{
      const preview=await Promise.race([
        api('import.preview',{code}),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('La validación tardó demasiado. No se modificaron datos.')),15000))
      ]);
      importPreview=preview;
      renderImportPreviewStage(preview);
    }catch(error){
      status.innerHTML='<div class="nx-imp-error">⚠ '+esc(error?.message||error)+'</div>';
      button.disabled=false;
      button.textContent='Revisar paquete';
    }
  };
}

function renderImportPreviewStage(preview){
  const body=document.querySelector('#nx-import-host .body');
  if(!body)return;
  const groups=Array.isArray(preview?.collections)?preview.collections:[];
  const total=Number(preview?.totalCount||0);
  const current=Number(preview?.alreadyCurrentCount??preview?.alreadyCompleteCount??0);
  const updates=Number(preview?.updateCount||0);
  const creates=Number(preview?.createCount||0);
  const pending=Number(preview?.pendingCount??Math.max(0,total-current));
  const itemSingular=preview?.itemLabelSingular||'elemento';
  const itemPlural=preview?.itemLabelPlural||'elementos';
  const containerSingular=preview?.containerLabelSingular||'colección';
  const containerPlural=preview?.containerLabelPlural||'colecciones';
  const rows=groups.map(g=>{
    const n=Number(g?.count||0);
    return '<div class="nx-imp-group"><strong>'+esc(g?.name||'—')+'</strong><span>'+n+' '+esc(countWord(n,g?.itemLabelSingular||itemSingular,g?.itemLabelPlural||itemPlural))+(g?.importMode==='linked'?' · vinculados':'')+'</span></div>';
  }).join('');
  const resume=current
    ? '<div class="nx-imp-resume">✓ '+current+' de '+total+' '+esc(itemPlural)+' ya están al día en la versión '+Number(preview?.version||0)+'.</div>'
    :'';
  const changes=pending
    ? '<div class="nx-imp-resume">↻ Esta sincronización actualizará '+updates+' y creará '+creates+' '+esc(itemPlural)+'. No se crearán duplicados de fichas existentes.</div>'
    : '<div class="nx-imp-resume">✓ Este paquete ya está completamente actualizado.</div>';
  const actionLabel=updates>0?'Sí, actualizar':(creates>0?'Sí, importar':'Cerrar');
  body.innerHTML='<div class="nx-imp-top"><div><small>PAQUETE VERIFICADO</small><h2 style="margin:3px 0 0">'+esc(preview?.packageName||'Paquete Nexo')+'</h2></div></div>'+
    (preview?.packageDescription?'<p>'+esc(preview.packageDescription)+'</p>':'')+
    '<div class="nx-imp-stats">'+
      '<div class="nx-imp-stat"><strong>'+total+'</strong><span>'+esc(countWord(total,itemSingular,itemPlural))+'</span></div>'+
      '<div class="nx-imp-stat"><strong>'+current+'</strong><span>al día</span></div>'+
      '<div class="nx-imp-stat"><strong>'+updates+'</strong><span>por actualizar</span></div>'+
      '<div class="nx-imp-stat"><strong>'+creates+'</strong><span>por crear</span></div>'+
    '</div>'+
    rows+resume+changes+
    (pending?'<p><strong>¿Deseas sincronizar el paquete con este Workspace?</strong></p>':'')+
    '<div class="nx-imp-actions"><button id="nx-import-cancel" class="btn" type="button">'+(pending?'No, cancelar':'Cerrar')+'</button>'+
    (pending?'<button id="nx-import-confirm" class="btn primary" type="button">'+actionLabel+'</button>':'')+'</div>';
  body.querySelector('#nx-import-cancel').onclick=closeImportHost;
  const confirm=body.querySelector('#nx-import-confirm');
  if(confirm)confirm.onclick=()=>runImportHost();
}

function pendingImportItems(limit=5){
  return (importPreview?.items||[]).filter(item=>item?.complete!==true).slice(0,limit);
}

function itemLine(item,done=false){
  const label=item?.itemLabelSingular||importPreview?.itemLabelSingular||'elemento';
  const title=item?.title||item?.titleEs||item?.titleEn||item?.id||'—';
  const container=importPreview?.containerLabelSingular||'colección';
  const group=item?.collectionName||'Sin colección';
  const action=String(item?.action||'create');
  const verb=action==='update'?(done?'Actualizada':'Actualizando'):(done?'Importada':'Importando');
  return (done?'✓ ':'')+verb+' '+label+' «'+title+'» '+(done?'· ':'en ')+container+' «'+group+'»'+(done?'':'…');
}

async function runImportHost(){
  if(importing)return;
  importing=true;
  const body=document.querySelector('#nx-import-host .body');
  if(!body){importing=false;return}
  const total=Number(importPreview?.totalCount||0);
  let done=Number(importPreview?.alreadyCompleteCount||0);
  let percent=total?Math.round((done/total)*100):0;
  body.innerHTML='<div class="nx-imp-top"><div><small>IMPORTANDO PAQUETE</small><h2 style="margin:3px 0 0">'+esc(importPreview?.packageName||'')+'</h2></div><strong id="nx-import-pct">'+percent+'%</strong></div>'+
    '<div class="nx-imp-bar"><span id="nx-import-bar" style="width:'+percent+'%"></span></div><div id="nx-import-count" style="text-align:right;color:#756e63;font-size:11px">'+done+' / '+total+'</div>'+
    '<div id="nx-import-current" class="nx-imp-current"><div class="nx-imp-spin">Preparando importación…</div></div>'+
    '<div id="nx-import-log" class="nx-imp-log"></div><div id="nx-import-footer" class="nx-imp-actions"></div>';
  const current=body.querySelector('#nx-import-current');
  const log=body.querySelector('#nx-import-log');
  const bar=body.querySelector('#nx-import-bar');
  const pct=body.querySelector('#nx-import-pct');
  const count=body.querySelector('#nx-import-count');
  const footer=body.querySelector('#nx-import-footer');
  let stagnant=0,lastDone=done;
  try{
    let result=null;
    for(let step=0;step<120;step++){
      const batch=pendingImportItems(5);
      if(batch.length){
        const batchText=batch.map(item=>{
          const label=item?.itemLabelSingular||importPreview?.itemLabelSingular||'elemento';
          const title=item?.title||item?.titleEs||item?.titleEn||item?.id||'—';
          const group=item?.collectionName||'Sin colección';
          return label+' «'+title+'» → «'+group+'»';
        }).join(' · ');
        current.innerHTML='<div class="nx-imp-spin">Procesando lote de '+batch.length+': '+esc(batchText)+'</div>';
      }
      result=await api('import.code',{code:importCode});
      done=Number(result?.processedCount||0);
      percent=total?Math.round((done/total)*100):0;
      bar.style.width=percent+'%';pct.textContent=percent+'%';count.textContent=done+' / '+total;
      const processed=Array.isArray(result?.processedItems)?result.processedItems:[];
      for(const finished of processed){
        const match=(importPreview?.items||[]).find(x=>x?.id===finished?.id);
        if(match)match.complete=true;
        const row=document.createElement('div');
        row.className='nx-imp-row ok';
        row.textContent=itemLine(finished,true);
        log.appendChild(row);log.scrollTop=log.scrollHeight;
      }
      if(result?.complete===true){
        current.innerHTML='<div class="nx-imp-success">✓ Importación completada. Actualizando biblioteca…</div>';
        await pushEngineData();
        setTimeout(closeImportHost,1200);
        importPreview=null;importCode='';
        break;
      }
      stagnant=done===lastDone?stagnant+1:0;
      lastDone=done;
      if(stagnant>=3)throw new Error('La importación no está avanzando. Se conservó el progreso y el código sigue disponible.');
      await new Promise(resolve=>setTimeout(resolve,450));
    }
  }catch(error){
    current.innerHTML='<div class="nx-imp-error">⚠ '+esc(error?.message||error)+'</div>';
    const batch=pendingImportItems(5);
    if(batch.length){
      const row=document.createElement('div');row.className='nx-imp-row err';
      row.textContent='✕ Lote detenido ('+batch.map(item=>item?.title||item?.titleEs||item?.titleEn||item?.id||'—').join(', ')+') — '+String(error?.message||error);
      log.appendChild(row);
    }
    footer.innerHTML='<button id="nx-import-close" class="btn" type="button">Cerrar</button><button id="nx-import-resume" class="btn primary" type="button">Continuar importación</button>';
    footer.querySelector('#nx-import-close').onclick=closeImportHost;
    footer.querySelector('#nx-import-resume').onclick=()=>{importing=false;runImportHost()};
  }finally{
    importing=false;
  }
}

async function savePhotoFromEngine(payload={}){
  const requestId=String(payload.requestId||'');
  const file=payload.file;
  const entityType=String(payload.entityType||'');
  const entityId=String(payload.entityId||'');
  const fileName=String(payload.fileName||file?.name||'foto.jpg');
  const mimeType=String(payload.mimeType||file?.type||'image/jpeg');
  const sizeInBytes=Number(payload.sizeInBytes||file?.size||0);

  if(!file||typeof file.arrayBuffer!=='function'){
    throw new Error('PHOTO_FILE_MISSING');
  }

  const ticket=await api('photo.upload-url',{
    input:{entityType,entityId,fileName,mimeType,sizeInBytes}
  });
  const uploadUrl=String(ticket?.uploadUrl||'');
  if(!uploadUrl)throw new Error('PHOTO_UPLOAD_URL_MISSING');

  const uploadResponse=await fetch(uploadUrl,{
    method:'PUT',
    headers:{'Content-Type':mimeType},
    body:file
  });
  let uploadBody={};
  try{uploadBody=await uploadResponse.json()}catch(_){}
  if(!uploadResponse.ok){
    throw new Error(
      String(uploadBody?.message||uploadBody?.error||('PHOTO_UPLOAD_HTTP_'+uploadResponse.status))
    );
  }

  const fileId=String(
    uploadBody?.file?.id||
    uploadBody?.file?._id||
    uploadBody?.id||
    uploadBody?._id||
    ''
  );
  if(!fileId)throw new Error('PHOTO_UPLOAD_FILE_ID_MISSING');

  const saved=await api('photo.commit',{
    input:{
      entityType:ticket?.entityType||entityType,
      entityId:ticket?.entityId||entityId,
      fileId
    }
  });
  const image=saved?.image;
  if(!image?.id||!image?.url)throw new Error('PHOTO_COMMIT_INVALID_IMAGE');

  postToEngine('DM_PHOTO_SAVED',{
    ok:true,
    requestId,
    entityType:saved?.entityType||ticket?.entityType||entityType,
    entityId:saved?.entityId||ticket?.entityId||entityId,
    image
  });
  pushEngineData().catch(()=>{});
  return image;
}

function handleEngineMessage(event){
  if(!frame||event.source!==frame.contentWindow)return;
  let message=event.data;
  if(typeof message==='string'){
    try{message=JSON.parse(message)}catch(_){return}
  }
  if(!message?.type)return;
  const payload=message.payload||{};
  if(message.type==='NUMA_RECIPE_OPENED'){
    const openedId=String(payload.sheetId||payload.recipeId||'');
    if(!requestedSheetId||openedId===String(requestedSheetId)){
      requestedSheetOpened=true;
      clearRequestedSheetParams();
      numaSetStatus('Ficha abierta','local');
    }
    return;
  }
  if(message.type==='NUMA_RECIPE_OPEN_FAILED'){
    numaSetStatus(payload.error||'No se pudo abrir la ficha solicitada.','error');
    return;
  }
  if(message.type==='NEXO_THEME_CHANGED'){
    applyWorkspaceTheme(payload.theme==='night'?'night':'day',{persist:true,notifyEngine:true});
    return;
  }
  if(message.type==='NEXO_LANGUAGE_CHANGED'){
    workspaceLanguage=String(payload.language||payload.lang||'').toLowerCase()==='en'?'en':'es';
    api('profile.locale.set',{locale:workspaceLanguage}).catch(()=>{});
    return;
  }
  if(message.type==='DM_LOAD_MENU_DATA'){
    pushEngineData().catch(showError);
    return;
  }
  if(message.type==='NEXO_DM_OPEN_IMPORT'){
    renderImportCodeStage();
    return;
  }
  if(message.type==='NEXO_DM_RECIPE_COMMENT'){
    const requestId=String(payload.requestId||'');
    api('comment.create',{
      input:{
        technicalSheetId:payload.technicalSheetId,
        recipeTitle:payload.recipeTitle,
        comment:payload.comment
      }
    }).then(data=>{
      postToEngine('NEXO_DM_RECIPE_COMMENT_RESULT',{
        ok:true,
        requestId,
        comment:data
      });
    }).catch(error=>{
      postToEngine('NEXO_DM_RECIPE_COMMENT_RESULT',{
        ok:false,
        requestId,
        error:String(error?.message||error)
      });
    });
    return;
  }
  if(message.type==='NEXO_APP_EXIT_TO_WORKSPACE'){
    exitToWorkspace();
    return;
  }
  if(message.type==='NEXO_APP_OPEN_PERSONAL'){
    openPersonalSpace();
    return;
  }
  if(message.type==='NEXO_APP_OPEN_DEVELOPMENT'){
    openDevelopmentCenter();
    return;
  }
  if(message.type==='DM_SAVE_PHOTO_FILE'){
    savePhotoFromEngine(payload).catch(error=>{
      postToEngine('DM_PHOTO_ERROR',{
        requestId:payload.requestId,
        error:String(error?.message||error||'PHOTO_SAVE_FAILED')
      });
    });
    return;
  }
}
function mountEngine(){
  const root=mountRoot();
  root.innerHTML='';
  frame=document.createElement('iframe');
  frame.id='nexo-dm-engine';
  frame.src=ENGINE+'&nxoLang='+encodeURIComponent(workspaceLanguage)+'&nxoTheme='+encodeURIComponent(workspaceTheme);
  frame.title=workspaceToolName;
  frame.allow='camera; notifications';
  frame.style.cssText='display:block;width:100%;height:100%;border:0;background:'+UI_THEME.background+';';
  frame.addEventListener('load',()=>{
    postToEngine('NEXO_WORKSPACE_CONTEXT',{workspaceMode:true,workspaceLabel,toolName:workspaceToolName,toolDescription:workspaceToolDescription,theme:workspaceTheme,language:workspaceLanguage});
    setTimeout(openRequestedSheet,180);
  });
  root.appendChild(frame);
  window.addEventListener('message',handleEngineMessage);
}
async function start(){
  await ensureThemeRuntime();
  applyWorkspaceTheme(workspaceTheme,{persist:false,notifyEngine:false});
  loading();
  const bootToken=await waitBoot();
  accessStage='EXCHANGE';
  stripBoot();
  const exchange=await api('exchange',{bootToken});
  sessionToken=exchange?.sessionToken||'';
  if(!sessionToken)throw accessError('NO_SESSION_TOKEN');
  accessStage='ENGINE';
  mountEngine();
  mountNuma();
}
start().catch(showError);
})();