(function(){
'use strict';
const VERSION='20261018-retired-1';

function removeLegacy(){
  document.getElementById('nxo-shared-header')?.remove();
  document.getElementById('nxo-dev-header')?.remove();
}

function mount(container,options={}){
  removeLegacy();
  if(window.NEXO_GLOBAL_HEADER?.mount){
    return window.NEXO_GLOBAL_HEADER.mount(container||document.body,options)
  }
  return null
}

function markup(){
  removeLegacy();
  return ''
}

function bind(){removeLegacy()}
function sync(){removeLegacy()}
function ensureStyle(){removeLegacy()}
async function loadNavigation(){return {personal:{name:'Mi espacio',tools:[]},workspaces:[]}}

removeLegacy();
window.NEXO_SHARED_HEADER={version:VERSION,retired:true,markup,bind,mount,sync,ensureStyle,loadNavigation};
})();