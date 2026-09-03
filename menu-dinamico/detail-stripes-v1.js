(()=>{'use strict';
if(window.__NEXO_DETAIL_STRIPES_V1__)return;
window.__NEXO_DETAIL_STRIPES_V1__=true;
const norm=s=>String(s||'').trim().toLowerCase();
function markRecipe(){
  const rv=document.querySelector('.recipeView');
  if(!rv)return;
  rv.classList.remove('nexoDetailDish','nexoDetailPrep');
  const title=norm(rv.querySelector('.heroText h1')?.textContent||rv.querySelector('h1')?.textContent);
  const data=window.__NEXO_DM_DATA__||{};
  const recipes=data.recipes||[];
  const r=recipes.find(x=>[x.titleEn,x.titleEs].some(v=>norm(v)===title))||recipes.find(x=>[x.titleEn,x.titleEs].some(v=>title&&norm(v).includes(title)));
  if(!r)return;
  rv.classList.add(String(r.recipeType||'').toUpperCase()==='DISH'?'nexoDetailDish':'nexoDetailPrep');
}
function apply(){
  markRecipe();
}
const obs=new MutationObserver(()=>{clearTimeout(obs.t);obs.t=setTimeout(apply,0)});
obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('languagechange',apply);
setTimeout(apply,0);
})();
