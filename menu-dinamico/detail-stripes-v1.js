(()=>{'use strict';
if(window.__NEXO_DETAIL_STRIPES_V1__)return;
window.__NEXO_DETAIL_STRIPES_V1__=true;
function apply(){
  const rv=document.querySelector('.recipeView');
  if(!rv)return;
  const dish=!!rv.querySelector('.heroText .tagDish,.tagDish');
  const prep=!!rv.querySelector('.heroText .tagPrep,.tagPrep');
  const wanted=dish?'nexoDetailDish':prep?'nexoDetailPrep':'';
  if(!wanted)return;
  if(!rv.classList.contains(wanted)||rv.classList.contains(wanted==='nexoDetailDish'?'nexoDetailPrep':'nexoDetailDish')){
    rv.classList.remove('nexoDetailDish','nexoDetailPrep');
    rv.classList.add(wanted);
  }
}
let timer=0;
const obs=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,16)});
obs.observe(document.documentElement,{subtree:true,childList:true});
setTimeout(apply,20);
})();
