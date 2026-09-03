(()=>{'use strict';
if(window.__NEXO_DETAIL_CLASSIFICATION_V2__)return;
window.__NEXO_DETAIL_CLASSIFICATION_V2__=true;
function apply(){
  const rv=document.querySelector('.recipeView');
  if(!rv)return;
  rv.classList.remove('nexoDetailDish','nexoDetailPrep');
  if(rv.querySelector('.tagDish')){
    rv.classList.add('nexoDetailDish');
    return;
  }
  if(rv.querySelector('.tagPrep')){
    rv.classList.add('nexoDetailPrep');
    return;
  }
  const title=String(rv.querySelector('.heroText h1')?.textContent||rv.querySelector('h1')?.textContent||'').trim().toLowerCase();
  const recipes=(window.__NEXO_DM_DATA__?.recipes||[]).filter(r=>[r.titleEn,r.titleEs].some(v=>String(v||'').trim().toLowerCase()===title));
  if(recipes.length===1){
    rv.classList.add(String(recipes[0].recipeType||'').toUpperCase()==='DISH'?'nexoDetailDish':'nexoDetailPrep');
  }
}
let timer;
const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,25)});
obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('languagechange',()=>setTimeout(apply,25));
setTimeout(apply,25);
})();
