(()=>{'use strict';
if(window.__NEXO_RECIPE_WORKFLOW_V1__)return;window.__NEXO_RECIPE_WORKFLOW_V1__=true;

const STORAGE='nexo_recipe_progress_v1';
const view=document.getElementById('view');
const modalRoot=document.getElementById('modal');
if(!view||!modalRoot)return;

const norm=v=>String(v||'').trim().toLocaleLowerCase();
const lang=()=>document.documentElement.lang==='en'?'en':'es';
const tr=(es,en)=>lang()==='en'?en:es;
const text=(o,enKey,esKey)=>lang()==='en'?(o?.[enKey]||o?.[esKey]||''):(o?.[esKey]||o?.[enKey]||'');
const data=()=>window.__NEXO_DM_DATA__||{recipes:[],sections:[],components:[]};

function loadProgress(){try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch(_){return {}}}
function saveProgress(x){try{localStorage.setItem(STORAGE,JSON.stringify(x))}catch(_){}}
function recipeState(recipeId){const all=loadProgress();all[recipeId] ||= {mise:{},mop:{}};all[recipeId].mise ||= {};all[recipeId].mop ||= {};return {all,state:all[recipeId]}}
function setProgress(recipeId,kind,key,value){const {all,state}=recipeState(recipeId);state[kind][key]=!!value;saveProgress(all)}

function currentRecipe(){
  const h=view.querySelector('.recipeView .heroText h1');if(!h)return null;
  const n=norm(h.textContent),D=data();
  return (D.recipes||[]).find(r=>norm(r.titleEn)===n||norm(r.titleEs)===n)||null;
}
function reviewish(v){return /review|revisi[oó]n|pending|pendiente|inconsisten|discrep|ambig|verify|verific|conflict|conflicto|printed sheet reads|impreso como/i.test(String(v||''))}

function installReviewNote(recipe){
  const hero=view.querySelector('.recipeView .heroText');if(!hero)return;
  let note='';
  if(recipe.reviewNote)note=recipe.reviewNote;
  else {const candidate=text(recipe,'notesEn','notesEs');if(reviewish(candidate))note=candidate}
  const existing=hero.querySelector('.reviewAlert[data-workflow]');
  if(!note){if(existing)existing.remove();return}
  const wanted=`⚠ ${note}`;
  if(existing){if(existing.textContent!==wanted)existing.textContent=wanted;return}
  const box=document.createElement('div');box.className='reviewAlert';box.dataset.workflow='1';box.textContent=wanted;hero.appendChild(box);
}
function markReviewNotes(){
  view.querySelectorAll('.recipeView .note').forEach(n=>n.classList.toggle('nexoReviewNote',reviewish(n.textContent)));
}

function installMise(recipe){
  const D=data();
  const secs=(D.sections||[]).filter(s=>s.recipeId===recipe._id).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
  const domSections=[...view.querySelectorAll('.recipeView .sections>.section')].filter(s=>s.querySelector('.row'));
  const {state}=recipeState(recipe._id);
  domSections.forEach((sectionEl,i)=>{
    const s=secs[i];if(!s)return;
    const rows=(D.components||[]).filter(c=>c.sectionId===s._id).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
    const h=sectionEl.querySelector('h2');
    if(h&&!h.querySelector('.progressLegend')){const l=document.createElement('span');l.className='progressLegend';l.textContent='Mise en place';h.appendChild(l)}
    [...sectionEl.querySelectorAll(':scope>.row')].forEach((rowEl,j)=>{
      const c=rows[j];if(!c)return;
      rowEl.dataset.componentId=c._id;
      let check=rowEl.querySelector('.miseCheck');
      if(!check){
        check=document.createElement('span');check.className='miseCheck';check.setAttribute('role','checkbox');check.setAttribute('tabindex','0');check.textContent='✓';rowEl.appendChild(check);
        const toggle=e=>{e.preventDefault();e.stopPropagation();const next=check.getAttribute('aria-checked')!=='true';check.setAttribute('aria-checked',String(next));rowEl.classList.toggle('is-mise-done',next);setProgress(recipe._id,'mise',c._id,next)};
        check.addEventListener('click',toggle);check.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter')toggle(e)});
      }
      const done=!!state.mise[c._id];check.setAttribute('aria-checked',String(done));check.setAttribute('aria-label',`Mise en place: ${text(c,'displayEn','displayEs')||''}`);rowEl.classList.toggle('is-mise-done',done);
    });
  });
}

function splitNumberedSteps(raw){
  const re=/^\s*\d+[.)]\s+/gm,matches=[...raw.matchAll(re)];if(matches.length<2)return null;
  return matches.map((m,i)=>raw.slice(m.index,i+1<matches.length?matches[i+1].index:raw.length).replace(/\s+$/,'')).filter(Boolean);
}
function installMop(recipe){
  const mop=view.querySelector('.recipeView .mop');if(!mop)return;
  const source=mop.dataset.workflowSource||mop.textContent||'';if(!mop.dataset.workflowSource)mop.dataset.workflowSource=source;
  const steps=splitNumberedSteps(source);if(!steps)return;
  if(mop.querySelector('.mopSteps'))return;
  const {state}=recipeState(recipe._id);mop.textContent='';const wrap=document.createElement('div');wrap.className='mopSteps';
  steps.forEach((step,i)=>{
    const line=document.createElement('div');line.className='mopStep';
    const check=document.createElement('span');check.className='mopCheck';check.setAttribute('role','checkbox');check.setAttribute('tabindex','0');check.textContent='✓';check.setAttribute('aria-label',tr(`Marcar paso ${i+1} completado`,`Mark step ${i+1} complete`));
    const body=document.createElement('div');body.className='mopStepText';body.textContent=step;
    const done=!!state.mop[i];check.setAttribute('aria-checked',String(done));line.classList.toggle('is-mop-done',done);
    const toggle=e=>{e.preventDefault();e.stopPropagation();const next=check.getAttribute('aria-checked')!=='true';check.setAttribute('aria-checked',String(next));line.classList.toggle('is-mop-done',next);setProgress(recipe._id,'mop',String(i),next)};
    check.addEventListener('click',toggle);check.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter')toggle(e)});
    line.append(check,body);wrap.appendChild(line);
  });mop.appendChild(wrap);
  const section=mop.closest('.section'),h=section?.querySelector('h2');if(h&&!h.querySelector('.progressLegend')){const l=document.createElement('span');l.className='progressLegend';l.textContent=tr('Completado','Completed');h.appendChild(l)}
}

function updateNaming(){
  const brand=document.querySelector('.brandText');if(brand&&brand.textContent!=='Recetario Dinámico')brand.textContent='Recetario Dinámico';
  const root=view.querySelector('[data-taxonomy-view="root"] .taxonomyIntro .subtitle');if(root){const wanted=tr('Menú 9:26 a 12:26 · Platos, preparaciones y productos organizados por categoría.','Menu 9:26 to 12:26 · Dishes, preparations and products organized by category.');if(root.textContent!==wanted)root.textContent=wanted}
}

function applyRecipe(){const r=currentRecipe();if(!r)return;installReviewNote(r);markReviewNotes();installMise(r);installMop(r)}
function apply(){updateNaming();applyRecipe();attachSwipe()}

function requestClose(shade){
  const closer=shade.querySelector('#close,#taxonomyClose');if(closer){closer.click();return}
  shade.dispatchEvent(new MouseEvent('click',{bubbles:true}))
}
function bindSwipe(card,shade){
  if(card.dataset.nexoSwipe==='1')return;card.dataset.nexoSwipe='1';
  let startX=0,startY=0,lastX=0,startT=0,drag=false,horiz=false,pid=null;
  const reset=()=>{card.classList.remove('nexoDragging');card.classList.add('nexoSnapBack');card.style.transform='translate3d(0,0,0)';card.style.opacity='1';setTimeout(()=>card.classList.remove('nexoSnapBack'),190)};
  card.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;if(e.target.closest('button,input,a,[role="checkbox"]'))return;pid=e.pointerId;startX=lastX=e.clientX;startY=e.clientY;startT=performance.now();drag=true;horiz=false;try{card.setPointerCapture(pid)}catch(_){}});
  card.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==pid)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(!horiz){if(Math.abs(dx)<10)return;if(Math.abs(dx)<=Math.abs(dy)+5){drag=false;return}horiz=true;card.classList.add('nexoDragging')}lastX=e.clientX;card.style.transform=`translate3d(${dx}px,0,0) rotate(${dx*.012}deg)`;card.style.opacity=String(Math.max(.36,1-Math.abs(dx)/(innerWidth*.9)));e.preventDefault()});
  const end=e=>{if(!drag||e.pointerId!==pid)return;drag=false;if(!horiz)return;const dx=lastX-startX,dt=Math.max(1,performance.now()-startT),velocity=Math.abs(dx)/dt;const dismiss=Math.abs(dx)>Math.min(120,innerWidth*.28)||velocity>.75;if(!dismiss){reset();return}const dir=dx>=0?1:-1;card.classList.remove('nexoDragging');card.classList.add('nexoDismiss');card.style.transform=`translate3d(${dir*(innerWidth+card.offsetWidth)}px,0,0) rotate(${dir*8}deg)`;card.style.opacity='0';setTimeout(()=>requestClose(shade),190)};
  card.addEventListener('pointerup',end);card.addEventListener('pointercancel',e=>{if(drag&&e.pointerId===pid){drag=false;reset()}});
}
function attachSwipe(){
  const shade=modalRoot.querySelector('.modalShade');if(shade){const card=shade.querySelector('.modal');if(card)bindSwipe(card,shade)}
  const tax=modalRoot.querySelector('.taxonomyImageShade');if(tax){const card=tax.querySelector('.taxonomyImageViewer');if(card)bindSwipe(card,tax)}
}

let timer=0;const observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,24)});observer.observe(document.body,{childList:true,subtree:true});
window.addEventListener('message',()=>setTimeout(apply,30));
setTimeout(apply,50);setTimeout(apply,500);
})();
