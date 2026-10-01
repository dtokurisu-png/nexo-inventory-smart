(function(){
'use strict';
if(window.NEXO_THEME_RUNTIME)return;

const script=document.currentScript;
const source=script?.src||location.href;
const tokenUrl=new URL('./theme-tokens.json?v=20261001-v3-1',source).href;
const STORAGE_KEY='nexoTheme:v1';
const query=new URLSearchParams(location.search);
let tokenDocument=null;
let currentTheme=query.get('nxoTheme')==='night'?'night':query.get('nxoTheme')==='day'?'day':storedTheme();

const THEME_VARS={
  background:'--nxo-background',
  backgroundAlt:'--nxo-background-alt',
  surface:'--nxo-surface',
  surfaceRaised:'--nxo-surface-raised',
  surfaceGlass:'--nxo-surface-glass',
  surfaceGlassHover:'--nxo-surface-glass-hover',
  controlBackground:'--nxo-control-background',
  border:'--nxo-border',
  borderStrong:'--nxo-border-strong',
  textPrimary:'--nxo-text-primary',
  textSecondary:'--nxo-text-secondary',
  textMuted:'--nxo-text-muted',
  accent:'--nxo-accent',
  accentSoft:'--nxo-accent-soft',
  accentContrast:'--nxo-accent-contrast',
  positive:'--nxo-positive',
  positiveSoft:'--nxo-positive-soft',
  positiveContrast:'--nxo-positive-contrast',
  interaction:'--nxo-interaction',
  interactionContrast:'--nxo-interaction-contrast',
  danger:'--nxo-danger',
  dangerSoft:'--nxo-danger-soft',
  dangerContrast:'--nxo-danger-contrast',
  warning:'--nxo-warning',
  warningSoft:'--nxo-warning-soft',
  warningContrast:'--nxo-warning-contrast',
  overlay:'--nxo-overlay',
  headerBackground:'--nxo-header-background',
  headerBorder:'--nxo-header-border',
  headerText:'--nxo-header-text',
  headerMuted:'--nxo-header-muted',
  headerActive:'--nxo-header-active',
  focusRing:'--nxo-focus-ring',
  shadow:'--nxo-shadow',
  mediaBackground:'--nxo-media-background',
  roleText:'--nxo-role-text',
  roleBackground:'--nxo-role-background',
  roleBorder:'--nxo-role-border',
  buttonSecondaryBg:'--nxo-button-secondary-bg',
  buttonSecondaryText:'--nxo-button-secondary-text',
  buttonSecondaryBorder:'--nxo-button-secondary-border'
};
const SYSTEM_VARS={
  contrast:'--nxo-semantic-contrast',
  dish:'--nxo-taxonomy-dish',
  preparation:'--nxo-taxonomy-preparation',
  cut:'--nxo-taxonomy-cut',
  product:'--nxo-taxonomy-product',
  metricMass:'--nxo-unit-metric-mass',
  imperialMass:'--nxo-unit-imperial-mass',
  metricVolume:'--nxo-unit-metric-volume',
  count:'--nxo-unit-count',
  spoon:'--nxo-unit-spoon',
  cup:'--nxo-unit-cup',
  bunch:'--nxo-unit-bunch',
  instruction:'--nxo-unit-instruction',
  other:'--nxo-unit-other'
};

function storedTheme(){
  try{
    const value=localStorage.getItem(STORAGE_KEY);
    return value==='night'?'night':'day';
  }catch(_){
    return 'day';
  }
}
function normalizeTheme(value){
  return value==='night'?'night':'day';
}
function applyDatasets(theme){
  const root=document.documentElement;
  root.dataset.theme=theme;
  root.dataset.nxoTheme=theme;
  if(document.body)document.body.dataset.nxoTheme=theme;
}
function applyVars(theme){
  if(!tokenDocument)return;
  const values=tokenDocument.themes?.[theme];
  if(!values)throw new Error('NEXO_THEME_MISSING_'+theme.toUpperCase());
  const root=document.documentElement.style;
  Object.entries(THEME_VARS).forEach(([key,varName])=>{
    if(values[key]!=null)root.setProperty(varName,String(values[key]));
  });
  const tech=tokenDocument.systems?.technicalSheets||{};
  const taxonomy=tech.taxonomy||{};
  const units=tech.units||{};
  const semanticValues={contrast:tech.contrast,...taxonomy,...units};
  Object.entries(SYSTEM_VARS).forEach(([key,varName])=>{
    if(semanticValues[key]!=null)root.setProperty(varName,String(semanticValues[key]));
  });
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta&&values.headerBackground)meta.setAttribute('content',String(values.headerBackground));
}
function setTheme(value,{persist=true,notify=true}={}){
  currentTheme=normalizeTheme(value);
  applyDatasets(currentTheme);
  if(tokenDocument)applyVars(currentTheme);
  if(persist){
    try{localStorage.setItem(STORAGE_KEY,currentTheme)}catch(_){}
  }
  if(notify){
    window.dispatchEvent(new CustomEvent('nexo-theme-change',{detail:{theme:currentTheme}}));
  }
  return currentTheme;
}
function getTheme(){return currentTheme}
function getThemeTokens(){
  return tokenDocument?.themes?.[currentTheme]||null;
}
function getDocument(){return tokenDocument}

applyDatasets(currentTheme);

const ready=fetch(tokenUrl,{cache:'no-store'})
  .then(response=>{
    if(!response.ok)throw new Error('NEXO_THEME_HTTP_'+response.status);
    return response.json();
  })
  .then(documentTokens=>{
    if(!documentTokens?.themes?.day||!documentTokens?.themes?.night)throw new Error('NEXO_THEME_INVALID_DOCUMENT');
    tokenDocument=documentTokens;
    applyVars(currentTheme);
    document.documentElement.dataset.nexoThemeReady='1';
    window.dispatchEvent(new CustomEvent('nexo-theme-ready',{detail:{theme:currentTheme,version:documentTokens.version||''}}));
    return documentTokens;
  })
  .catch(error=>{
    document.documentElement.dataset.nexoThemeReady='error';
    console.error('[Nexo theme runtime]',error);
    throw error;
  });

window.NEXO_THEME_RUNTIME={
  version:'2026-10-01-v2',
  tokenUrl,
  ready,
  setTheme,
  toggleTheme(options){return setTheme(currentTheme==='night'?'day':'night',options)},
  getTheme,
  getThemeTokens,
  getDocument
};
})();
