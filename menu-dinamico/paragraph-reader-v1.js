(()=>{'use strict';
if(window.__NEXO_PARAGRAPH_READER_V1__)return;window.__NEXO_PARAGRAPH_READER_V1__=true;

document.getElementById('nexoReadingMagnifier')?.remove();
document.getElementById('nexo-reading-magnifier-style')?.remove();

const ua=navigator.userAgent||'';
const touchDevice=/Android|iPhone|iPad|iPod|Mobile/i.test(ua)||navigator.maxTouchPoints>0;
if(!touchDevice)return;

const view=document.getElementById('view');
const backButton=document.getElementById('back');
if(!view)return;

const style=document.createElement('style');
style.id='nexo-paragraph-reader-style';
style.textContent=`
#nexoParagraphReader{position:fixed;z-index:2147483646;inset:0;display:none;align-items:center;justify-content:center;padding:14px;background:var(--nxo-overlay)}
#nexoParagraphReader[data-open="1"]{display:flex}
.nexoParagraphReaderPanel{width:min(94vw,780px);max-height:88dvh;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;border:1px solid var(--nxo-border-strong);border-radius:22px;background:var(--nxo-surface-raised);color:var(--nxo-text-primary);box-shadow:0 24px 80px var(--nxo-shadow)}
.nexoParagraphReaderHead{display:flex;align-items:center;gap:10px;padding:11px 12px;border-bottom:1px solid var(--nxo-border);background:var(--nxo-surface-raised)}
.nexoParagraphReaderTitle{flex:1;font-size:13px;font-weight:900;letter-spacing:.02em;color:var(--nxo-text-primary)}
.nexoParagraphReaderClose{appearance:none;-webkit-appearance:none;width:36px;height:36px;min-width:36px;display:grid;place-items:center;padding:0;border:1px solid var(--nxo-button-secondary-border);border-radius:10px;background:var(--nxo-button-secondary-bg);color:var(--nxo-button-secondary-text);font:900 21px/1 system-ui,-apple-system,"Segoe UI",sans-serif}
.nexoParagraphReaderBody{overflow:auto;-webkit-overflow-scrolling:touch;padding:22px 20px 26px;overscroll-behavior:contain}
.nexoParagraphReaderText{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font:750 44px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--nxo-text-primary)}
.nexoParagraphReaderFooter{padding:10px 12px 12px;border-top:1px solid var(--nxo-border);background:var(--nxo-surface-raised)}
.nexoParagraphReaderDone{width:100%;min-height:42px;border:1px solid var(--nxo-positive);border-radius:11px;background:var(--nxo-positive);color:var(--nxo-positive-contrast);font:900 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif}
.nexoParagraphReaderClose:hover,.nexoParagraphReaderClose:focus-visible,.nexoParagraphReaderDone:hover,.nexoParagraphReaderDone:focus-visible{background:var(--nxo-interaction);border-color:var(--nxo-interaction);color:var(--nxo-interaction-contrast);outline:none}
html.nexoParagraphReaderOpen,html.nexoParagraphReaderOpen body{overflow:hidden!important;overscroll-behavior:none!important}
@media(max-width:420px){.nexoParagraphReaderPanel{width:calc(100vw - 12px);max-height:92dvh;border-radius:14px}.nexoParagraphReaderBody{padding:18px 14px 22px}.nexoParagraphReaderText{font-size:44px;line-height:1.28}}
`;
document.head.appendChild(style);

const layer=document.createElement('div');
layer.id='nexoParagraphReader';
layer.setAttribute('role','dialog');
layer.setAttribute('aria-modal','true');
layer.setAttribute('aria-hidden','true');
layer.innerHTML=`
  <div class="nexoParagraphReaderPanel">
    <div class="nexoParagraphReaderHead">
      <div class="nexoParagraphReaderTitle">Lectura ampliada</div>
      <button type="button" class="nexoParagraphReaderClose" aria-label="Cerrar">×</button>
    </div>
    <div class="nexoParagraphReaderBody">
      <p class="nexoParagraphReaderText"></p>
    </div>
    <div class="nexoParagraphReaderFooter">
      <button type="button" class="nexoParagraphReaderDone">Cerrar</button>
    </div>
  </div>`;
document.body.appendChild(layer);

const panel=layer.querySelector('.nexoParagraphReaderPanel');
const readerText=layer.querySelector('.nexoParagraphReaderText');
const readerTitle=layer.querySelector('.nexoParagraphReaderTitle');
const closeButton=layer.querySelector('.nexoParagraphReaderClose');
const doneButton=layer.querySelector('.nexoParagraphReaderDone');
let timer=null,pendingBlock=null,startX=0,startY=0,opened=false,suppressClickUntil=0,previousFocus=null;

const candidateSelector='[data-nexo-reader-paragraph],.mopStepText,.mop,.row .nameProduct,.note,.reviewAlert,.modalText,.photoBody p,.nexoBatchIntro,.nexoBatchHint,p';
const blockedSelector='input,textarea,select,[contenteditable="true"],.miseCheck,.mopCheck,.icon,.lang,.installBtn,.taxonomyImageClose,.taxonomyProductPhotoBtn,.heroPhotoBtn,[data-photo-target],#nexoPhotoLayer,#nexoBatchLayer,#nexoParagraphReader,.unitBtn,.nexoProgressReset';

function currentLang(){return document.documentElement.lang==='en'?'en':'es'}
function syncCopy(){
  const en=currentLang()==='en';
  readerTitle.textContent=en?'Expanded reading':'Lectura ampliada';
  closeButton.setAttribute('aria-label',en?'Close':'Cerrar');
  doneButton.textContent=en?'Close':'Cerrar'
}
function recipeOpen(){return !!view.querySelector('.recipeView')}
function paragraphBlock(target){
  if(!recipeOpen()||!target||target.nodeType!==1)return null;
  if(target.closest(blockedSelector))return null;
  const block=target.closest(candidateSelector);
  if(!block)return null;
  if(!block.closest('.recipeView,#modal .modal'))return null;
  const text=String(block.innerText||block.textContent||'').trim();
  if(!text)return null;
  return block
}
function blockText(block){return String(block?.innerText||block?.textContent||'').trim()}
function clearPending(){if(timer){clearTimeout(timer);timer=null}pendingBlock=null}
function openReader(block){
  const text=blockText(block);
  if(!text)return;
  clearPending();
  syncCopy();
  previousFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  readerText.textContent=text;
  layer.dataset.open='1';
  layer.setAttribute('aria-hidden','false');
  document.documentElement.classList.add('nexoParagraphReaderOpen');
  opened=true;
  suppressClickUntil=Date.now()+650;
  requestAnimationFrame(()=>{layer.querySelector('.nexoParagraphReaderBody').scrollTop=0;closeButton.focus({preventScroll:true})});
  if(navigator.vibrate)try{navigator.vibrate(18)}catch(_){}
}
function closeReader(){
  clearPending();
  if(!opened)return;
  opened=false;
  layer.dataset.open='0';
  layer.setAttribute('aria-hidden','true');
  document.documentElement.classList.remove('nexoParagraphReaderOpen');
  readerText.textContent='';
  const focus=previousFocus;previousFocus=null;
  if(focus&&document.contains(focus))try{focus.focus({preventScroll:true})}catch(_){}
}
function activate(){timer=null;const block=pendingBlock;pendingBlock=null;if(block&&document.contains(block))openReader(block)}

closeButton.addEventListener('click',closeReader);
doneButton.addEventListener('click',closeReader);
panel.addEventListener('click',e=>e.stopPropagation());
layer.addEventListener('click',e=>{if(e.target===layer){e.preventDefault();e.stopPropagation()}});
document.addEventListener('keydown',e=>{if(opened&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeReader()}},true);
if(backButton)backButton.addEventListener('click',e=>{if(opened){e.preventDefault();e.stopImmediatePropagation();closeReader()}},true);

document.addEventListener('touchstart',e=>{
  if(opened||e.touches.length!==1)return;
  const block=paragraphBlock(e.target);
  if(!block)return;
  clearPending();
  const t=e.touches[0];
  pendingBlock=block;
  startX=t.clientX;startY=t.clientY;
  timer=setTimeout(activate,450)
},{passive:true,capture:true});

document.addEventListener('touchmove',e=>{
  if(opened)return;
  if(!timer||e.touches.length!==1){clearPending();return}
  const t=e.touches[0];
  if(Math.hypot(t.clientX-startX,t.clientY-startY)>12)clearPending()
},{passive:true,capture:true});

document.addEventListener('touchend',()=>clearPending(),{passive:true,capture:true});
document.addEventListener('touchcancel',()=>clearPending(),{passive:true,capture:true});
document.addEventListener('contextmenu',e=>{if(opened||timer){e.preventDefault();e.stopPropagation()}},{capture:true});
document.addEventListener('click',e=>{
  if(layer.contains(e.target))return;
  if(Date.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation()}
},{capture:true});
})();