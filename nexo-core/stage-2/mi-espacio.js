(()=>{'use strict';
const $=s=>document.querySelector(s);
const el={
  loading:$('#loadingState'),error:$('#errorState'),errorText:$('#errorText'),personal:$('#personalView'),workspace:$('#workspaceView'),
  contextLabel:$('#contextLabel'),welcome:$('#welcomeTitle'),initial:$('#avatarInitial'),toolGrid:$('#toolGrid'),toolEmpty:$('#toolEmpty'),
  inviteSection:$('#invitationSection'),inviteList:$('#invitationList'),inviteEmpty:$('#invitationEmpty'),inviteCount:$('#invitationCount'),
  workspaceGrid:$('#workspaceGrid'),workspaceEmpty:$('#workspaceEmpty'),workspaceCount:$('#workspaceCount'),back:$('#backPersonalBtn'),
  workspaceTitle:$('#workspaceTitle'),workspaceDescription:$('#workspaceDescription'),workspaceRole:$('#workspaceRole'),workspaceToolGrid:$('#workspaceToolGrid')
};
let state=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function send(type,payload={}){window.parent.postMessage({source:'nexo-mi-espacio',type,payload},'*')}
function show(node){node?.classList.remove('hidden')} function hide(node){node?.classList.add('hidden')}
function statusClass(status){const s=String(status||'').toUpperCase();return s==='ACTIVE'?'':s==='BUILDING'?'building':'planned'}
function toolCard(t){
  const usable=String(t.status||'').toUpperCase()==='ACTIVE';
  return '<article class="toolCard" data-tool="'+esc(t.toolKey)+'"><div class="toolTop"><span class="toolIcon">'+esc(t.icon||'◇')+'</span><span class="statusDot '+statusClass(t.status)+'">'+esc(t.status||'ACTIVE')+'</span></div><h3>'+esc(t.nameEs||t.nameEn||t.toolKey)+'</h3><p>'+esc(t.descriptionEs||t.descriptionEn||'')+'</p><div class="toolActions"><button class="primaryBtn" data-open-tool="'+esc(t.toolKey)+'" '+(usable?'':'disabled')+'>'+(usable?'Abrir':'Próximamente')+'</button></div></article>';
}
function workspaceCard(w){
  const name=w.name||'Workspace',role=w.role?.nameEs||w.roleKey||'Colaborador';
  return '<article class="workspaceCard"><div class="workspaceTop"><div><p class="eyebrow">WORKSPACE</p><h3>'+esc(name)+'</h3></div><span class="toolIcon">⌂</span></div><p>'+esc(w.description||'Espacio de trabajo de Nexo.')+'</p><div class="workspaceMeta"><span class="metaChip">'+esc(role)+'</span></div><div class="workspaceActions"><button class="primaryBtn" data-open-workspace="'+esc(w.workspaceId)+'">Ir al espacio de trabajo →</button></div></article>';
}
function inviteCard(i){
  const name=i.workspaceName||'Nuevo espacio de trabajo',role=i.role?.nameEs||i.roleKey||'Colaborador';
  return '<article class="inviteCard"><div><p class="eyebrow">INVITACIÓN</p><h3>'+esc(name)+'</h3><p>Te invitaron como '+esc(role)+'.</p></div><div class="inviteActions"><button class="secondaryBtn" data-invite="decline" data-id="'+esc(i.id)+'">Rechazar</button><button class="primaryBtn" data-invite="accept" data-id="'+esc(i.id)+'">Aceptar</button></div></article>';
}
function renderPersonal(data){
  state=data;hide(el.loading);hide(el.error);hide(el.workspace);show(el.personal);hide(el.back);
  el.contextLabel.textContent='Mi espacio';
  const name=data.profile?.displayName||'';
  el.welcome.textContent=name?'Hola, '+name.split(' ')[0]:'Hola';
  el.initial.textContent=(name.trim()[0]||'N').toUpperCase();
  const tools=data.tools||[];el.toolGrid.innerHTML=tools.map(toolCard).join('');tools.length?hide(el.toolEmpty):show(el.toolEmpty);
  const invites=data.invitations||[];el.inviteCount.textContent=String(invites.length);el.inviteList.innerHTML=invites.map(inviteCard).join('');invites.length?hide(el.inviteEmpty):show(el.inviteEmpty);
  const workspaces=data.workspaces||[];el.workspaceCount.textContent=String(workspaces.length);el.workspaceGrid.innerHTML=workspaces.map(workspaceCard).join('');workspaces.length?hide(el.workspaceEmpty):show(el.workspaceEmpty);
}
function renderWorkspace(data){
  state=data;hide(el.loading);hide(el.error);hide(el.personal);show(el.workspace);show(el.back);
  el.contextLabel.textContent=data.workspace?.name||'Workspace';
  el.workspaceTitle.textContent=data.workspace?.name||'Workspace';
  el.workspaceDescription.textContent=data.workspace?.description||'';
  el.workspaceRole.textContent=data.role?.nameEs||data.membership?.roleKey||'Colaborador';
  const tools=data.tools||[];el.workspaceToolGrid.innerHTML=tools.map(toolCard).join('');
}
function showError(message){hide(el.loading);hide(el.personal);hide(el.workspace);show(el.error);el.errorText.textContent=message||'Intenta nuevamente.'}
document.addEventListener('click',e=>{
  const tool=e.target.closest('[data-open-tool]');if(tool&&!tool.disabled){send('NEXO_OPEN_TOOL',{toolKey:tool.dataset.openTool});return}
  const ws=e.target.closest('[data-open-workspace]');if(ws){send('NEXO_OPEN_WORKSPACE',{workspaceId:ws.dataset.openWorkspace});return}
  const invite=e.target.closest('[data-invite]');if(invite){invite.disabled=true;send('NEXO_INVITATION_ACTION',{invitationId:invite.dataset.id,decision:invite.dataset.invite});return}
});
el.back.addEventListener('click',()=>send('NEXO_GO_PERSONAL'));
$('#retryBtn').addEventListener('click',()=>{hide(el.error);show(el.loading);send('NEXO_MY_SPACE_REQUEST')});
window.addEventListener('message',e=>{
  const m=e.data;if(!m||m.source!=='nexo-wix-bridge')return;
  if(m.type==='NEXO_PERSONAL_STATE')renderPersonal(m.payload||{});
  else if(m.type==='NEXO_WORKSPACE_STATE')renderWorkspace(m.payload||{});
  else if(m.type==='NEXO_MY_SPACE_ERROR')showError(m.payload?.message);
});
const demo=new URLSearchParams(location.search).get('demo')==='1';
if(demo){
  setTimeout(()=>renderPersonal({
    profile:{displayName:'Usuario Nexo'},
    tools:[{toolKey:'learning-core',nameEs:'Nexo Learning Core',descriptionEs:'Aprendizaje, rutas, práctica y progreso personal.',icon:'◈',status:'ACTIVE'}],
    invitations:[],
    workspaces:[{workspaceId:'workspace-nexo-group',name:'Nexo Group',description:'Workspace principal de Nexo Group.',roleKey:'owner',role:{nameEs:'Propietario'}}]
  }),250);
}else send('NEXO_MY_SPACE_READY');
})();