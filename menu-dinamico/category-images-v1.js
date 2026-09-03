(()=>{'use strict';
if(window.__NEXO_CATEGORY_IMAGES_V1__)return;window.__NEXO_CATEGORY_IMAGES_V1__=true;
const IMAGES={
  dish:'https://static.wixstatic.com/media/8b64a8_0d1f764e2bba4e179dd4f2422d29aeae~mv2.png',
  prep:'https://static.wixstatic.com/media/8b64a8_345b5afd3bb646bc836c65a9f98d9dad~mv2.png',
  product:'https://static.wixstatic.com/media/8b64a8_9dab7d0cb081429e84b8396a64c20f6e~mv2.png'
};
const style=document.createElement('style');style.id='nexo-category-images-v1-style';style.textContent=`
.taxonomyMaster{padding:0 0 28px!important;display:flex!important;flex-direction:column!important;min-height:330px!important}
.taxonomyMasterImage{width:100%;aspect-ratio:16/9;background:#e9e3d8;overflow:hidden;flex:none}
.taxonomyMasterImage img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.taxonomyMasterBody{position:relative;display:flex;flex:1;flex-direction:column;padding:18px 22px 8px}
.taxonomyMaster .taxonomyLabel{align-self:flex-start}
.taxonomyMaster h2{margin:20px 0 6px!important}
.taxonomyMaster p{margin:0!important}
.taxonomyMaster .taxonomyCount{top:calc((100% - 28px)*0.48);transform:translateY(-50%);background:rgba(255,253,250,.93);box-shadow:0 4px 14px rgba(25,20,14,.12)}
@media(max-width:720px){.taxonomyMaster{min-height:0!important;padding-bottom:21px!important}.taxonomyMasterImage{aspect-ratio:16/7}.taxonomyMasterBody{padding:14px 16px 4px}.taxonomyMaster h2{margin:12px 0 4px!important}.taxonomyMaster .taxonomyCount{top:18px;right:14px;transform:none}}
`;
document.head.appendChild(style);
function apply(){
 document.querySelectorAll('.taxonomyMaster[data-taxonomy-open]').forEach(card=>{
   const key=card.dataset.taxonomyOpen;
   const url=IMAGES[key]; if(!url||card.querySelector('.taxonomyMasterImage'))return;
   const kids=[...card.children];
   const img=document.createElement('div');img.className='taxonomyMasterImage';img.innerHTML=`<img src="${url}" alt="">`;
   const body=document.createElement('div');body.className='taxonomyMasterBody';
   kids.forEach(k=>{if(!k.classList.contains('taxonomyCount'))body.appendChild(k)});
   card.insertBefore(img,card.firstChild);card.appendChild(body);
 }
 )
}
const obs=new MutationObserver(()=>{clearTimeout(window.__nexoCatImgTimer);window.__nexoCatImgTimer=setTimeout(apply,0)});obs.observe(document.body,{childList:true,subtree:true});setTimeout(apply,0);
})();