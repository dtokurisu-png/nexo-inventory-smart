(()=>{'use strict';
if(window.NEXO_FICHAS_DOMAIN_MODEL)return;

const VERSION='fichas-domain-v1';
const SUPPLY_MODES=Object.freeze({CONSUMABLE:'CONSUMABLE',PROCESSABLE:'PROCESSABLE'});
const COMPONENT_TYPES=Object.freeze({
  SUPPLY:'SUPPLY',
  SUPPLY_PROCESS:'SUPPLY_PROCESS',
  PREPARATION:'PREPARATION',
  TEXT:'TEXT'
});

const arr=value=>Array.isArray(value)?value:[];
const clean=value=>String(value??'').trim();
const fold=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slug=value=>{
  const out=fold(value).replace(/\s+/g,'-').replace(/^-+|-+$/g,'');
  return out||'unnamed'
};
const mergeById=(base,extra)=>{
  const map=new Map();
  for(const row of [...arr(base),...arr(extra)]){
    if(!row)continue;
    const id=clean(row._id||row.id);
    if(!id)continue;
    map.set(id,{...(map.get(id)||{}),...row,_id:id})
  }
  return [...map.values()]
};
const processKey=row=>{
  const explicit=clean(row?.processKey);
  if(explicit)return fold(explicit);
  return fold(row?.nameEn||row?.nameEs||row?.titleEn||row?.titleEs||row?._id)
};
const normalizeSupplyMode=value=>{
  const mode=clean(value).toUpperCase();
  return mode===SUPPLY_MODES.PROCESSABLE?SUPPLY_MODES.PROCESSABLE:SUPPLY_MODES.CONSUMABLE
};
const processIdFrom=row=>{
  const explicit=clean(row?.processId);
  if(explicit)return explicit;
  return 'process-'+slug(row?.nameEn||row?.nameEs||row?.titleEn||row?.titleEs||row?._id)
};

function deriveProcesses(legacyPreparations=[],explicitProcesses=[]){
  const map=new Map();
  for(const row of arr(explicitProcesses)){
    const id=clean(row?._id||row?.id);
    if(!id)continue;
    const normalized={...row,_id:id,domainType:'PROCESS',schemaVersion:row.schemaVersion||VERSION};
    map.set(processKey(normalized)||id,normalized)
  }
  for(const legacy of arr(legacyPreparations)){
    if(!legacy)continue;
    const key=processKey(legacy)||clean(legacy._id);
    if(!key)continue;
    const existing=map.get(key);
    const id=existing?._id||processIdFrom(legacy);
    const legacyId=clean(legacy._id);
    const sourceLegacyIds=[...new Set([...(arr(existing?.sourceLegacyIds)),legacyId].filter(Boolean))];
    map.set(key,{
      ...(existing||{}),
      _id:id,
      domainType:'PROCESS',
      processKey:key,
      nameEs:existing?.nameEs||legacy.nameEs||'',
      nameEn:existing?.nameEn||legacy.nameEn||'',
      descriptionEs:existing?.descriptionEs||legacy.descriptionEs||'',
      descriptionEn:existing?.descriptionEn||legacy.descriptionEn||'',
      active:existing?.active!==false&&legacy.active!==false,
      sourceLegacyIds,
      schemaVersion:existing?.schemaVersion||VERSION
    })
  }
  return [...map.values()]
}

function deriveSupplyProcesses(legacyPreparations=[],processes=[],explicitRelations=[]){
  const processByKey=new Map(processes.map(row=>[processKey(row),row]));
  const derived=[];
  for(const legacy of arr(legacyPreparations)){
    if(!legacy)continue;
    const supplyId=clean(legacy.supplyId||legacy.ingredientId);
    if(!supplyId)continue;
    const process=processByKey.get(processKey(legacy));
    const processId=clean(legacy.processId)||clean(process?._id)||processIdFrom(legacy);
    const legacyId=clean(legacy._id);
    const id=clean(legacy.supplyProcessId)||('supply-process-'+slug(supplyId)+'-'+slug(processId));
    derived.push({
      _id:id,
      domainType:'SUPPLY_PROCESS',
      supplyId,
      processId,
      image:legacy.image||null,
      notesEs:legacy.notesEs||legacy.descriptionEs||'',
      notesEn:legacy.notesEn||legacy.descriptionEn||'',
      sortOrder:Number.isFinite(Number(legacy.sortOrder))?Number(legacy.sortOrder):0,
      active:legacy.active!==false,
      legacyPreparationId:legacyId,
      schemaVersion:VERSION
    })
  }
  return mergeById(derived,explicitRelations).map(row=>({
    ...row,
    domainType:'SUPPLY_PROCESS',
    supplyId:clean(row.supplyId||row.ingredientId),
    processId:clean(row.processId),
    active:row.active!==false,
    schemaVersion:row.schemaVersion||VERSION
  }))
}

function deriveSupplies(ingredients=[],explicitSupplies=[],relations=[]){
  const relationSupplyIds=new Set(arr(relations).map(row=>clean(row?.supplyId)).filter(Boolean));
  const base=arr(ingredients).map(row=>{
    const id=clean(row?._id||row?.id);
    const explicitMode=clean(row?.supplyMode||row?.supplyBehavior);
    return {
      ...row,
      _id:id,
      domainType:'SUPPLY',
      supplyMode:explicitMode?normalizeSupplyMode(explicitMode):(relationSupplyIds.has(id)?SUPPLY_MODES.PROCESSABLE:SUPPLY_MODES.CONSUMABLE),
      defaultQuantity:row?.defaultQuantity??null,
      defaultUnit:clean(row?.defaultUnit),
      schemaVersion:row?.schemaVersion||VERSION
    }
  });
  return mergeById(base,explicitSupplies).map(row=>{
    const id=clean(row._id);
    const explicitMode=clean(row.supplyMode||row.supplyBehavior);
    return {
      ...row,
      _id:id,
      domainType:'SUPPLY',
      supplyMode:explicitMode?normalizeSupplyMode(explicitMode):(relationSupplyIds.has(id)?SUPPLY_MODES.PROCESSABLE:SUPPLY_MODES.CONSUMABLE),
      defaultQuantity:row.defaultQuantity??null,
      defaultUnit:clean(row.defaultUnit),
      schemaVersion:row.schemaVersion||VERSION
    }
  })
}

function deriveTechnicalSheets(recipes=[],explicitPreparationSheets=[]){
  const technicalSheets=arr(recipes).map(row=>{
    const kind=String(row?.recipeType||'').toUpperCase()==='DISH'?'FINAL_PRODUCT':'PREPARATION';
    return {...row,domainType:'TECHNICAL_SHEET',sheetKind:kind,schemaVersion:row?.schemaVersion||VERSION}
  });
  const derivedPreparations=technicalSheets.filter(row=>row.sheetKind==='PREPARATION').map(row=>({...row,domainType:'PREPARATION'}));
  const preparationSheets=mergeById(derivedPreparations,explicitPreparationSheets).map(row=>({
    ...row,
    domainType:'PREPARATION',
    sheetKind:'PREPARATION',
    schemaVersion:row.schemaVersion||VERSION
  }));
  return {
    technicalSheets,
    preparationSheets,
    finalProductSheets:technicalSheets.filter(row=>row.sheetKind==='FINAL_PRODUCT')
  }
}

function deriveCompositionItems(components=[],relations=[],preparationSheets=[]){
  const relationByLegacy=new Map();
  for(const row of arr(relations)){
    if(row?.legacyPreparationId)relationByLegacy.set(String(row.legacyPreparationId),row)
  }
  const prepIds=new Set(arr(preparationSheets).map(row=>String(row._id)));
  return arr(components).map(row=>{
    const legacyType=String(row?.componentType||'TEXT').toUpperCase();
    let componentType=COMPONENT_TYPES.TEXT;
    let supplyId=clean(row?.supplyId||row?.targetIngredientId);
    let supplyProcessId=clean(row?.supplyProcessId);
    let preparationSheetId=clean(row?.preparationSheetId||row?.targetRecipeId);

    if(row?.targetPreparationId){
      componentType=COMPONENT_TYPES.SUPPLY_PROCESS;
      const relation=relationByLegacy.get(String(row.targetPreparationId));
      if(relation)supplyProcessId=relation._id
    }else if(preparationSheetId||legacyType==='SUBRECIPE'){
      componentType=COMPONENT_TYPES.PREPARATION
    }else if(supplyId||legacyType==='INGREDIENT'){
      componentType=COMPONENT_TYPES.SUPPLY
    }
    if(componentType===COMPONENT_TYPES.PREPARATION&&!prepIds.has(preparationSheetId)&&!preparationSheetId){
      componentType=COMPONENT_TYPES.TEXT
    }
    return {
      ...row,
      domainType:'COMPOSITION_ITEM',
      canonicalComponentType:componentType,
      supplyId,
      supplyProcessId,
      preparationSheetId,
      schemaVersion:row?.schemaVersion||VERSION
    }
  })
}

function diagnostics(model){
  const supplyIds=new Set(arr(model.supplies).map(row=>String(row._id)));
  const processIds=new Set(arr(model.processes).map(row=>String(row._id)));
  const prepIds=new Set(arr(model.preparationSheets).map(row=>String(row._id)));
  const relationIds=new Set(arr(model.supplyProcesses).map(row=>String(row._id)));
  const warnings=[];
  for(const relation of arr(model.supplyProcesses)){
    if(relation.supplyId&&!supplyIds.has(String(relation.supplyId)))warnings.push({code:'ORPHAN_SUPPLY_PROCESS_SUPPLY',id:relation._id,supplyId:relation.supplyId});
    if(relation.processId&&!processIds.has(String(relation.processId)))warnings.push({code:'ORPHAN_SUPPLY_PROCESS_PROCESS',id:relation._id,processId:relation.processId})
  }
  for(const item of arr(model.compositionItems)){
    if(item.canonicalComponentType===COMPONENT_TYPES.SUPPLY&&item.supplyId&&!supplyIds.has(String(item.supplyId)))warnings.push({code:'ORPHAN_COMPONENT_SUPPLY',id:item._id,supplyId:item.supplyId});
    if(item.canonicalComponentType===COMPONENT_TYPES.SUPPLY_PROCESS&&item.supplyProcessId&&!relationIds.has(String(item.supplyProcessId)))warnings.push({code:'ORPHAN_COMPONENT_SUPPLY_PROCESS',id:item._id,supplyProcessId:item.supplyProcessId});
    if(item.canonicalComponentType===COMPONENT_TYPES.PREPARATION&&item.preparationSheetId&&!prepIds.has(String(item.preparationSheetId)))warnings.push({code:'ORPHAN_COMPONENT_PREPARATION',id:item._id,preparationSheetId:item.preparationSheetId})
  }
  return {
    version:VERSION,
    counts:{
      supplies:arr(model.supplies).length,
      preparationSheets:arr(model.preparationSheets).length,
      processes:arr(model.processes).length,
      supplyProcesses:arr(model.supplyProcesses).length,
      compositionItems:arr(model.compositionItems).length
    },
    warnings
  }
}

function normalizePayload(input={}){
  const source=input&&typeof input==='object'?input:{};
  const legacyPreparations=arr(source.preparations);
  const processes=deriveProcesses(legacyPreparations,source.processes);
  const supplyProcesses=deriveSupplyProcesses(legacyPreparations,processes,source.supplyProcesses);
  const supplies=deriveSupplies(source.ingredients,source.supplies,supplyProcesses);
  const sheets=deriveTechnicalSheets(source.recipes,source.preparationSheets);
  const compositionItems=deriveCompositionItems(source.components,supplyProcesses,sheets.preparationSheets);
  const model={
    ...source,
    domainModelVersion:VERSION,
    supplies,
    preparationSheets:sheets.preparationSheets,
    processes,
    supplyProcesses,
    technicalSheets:sheets.technicalSheets,
    finalProductSheets:sheets.finalProductSheets,
    compositionItems
  };
  model.domainDiagnostics=diagnostics(model);
  return model
}

window.NEXO_FICHAS_DOMAIN_MODEL=Object.freeze({
  VERSION,
  SUPPLY_MODES,
  COMPONENT_TYPES,
  normalizePayload,
  diagnostics
})
})();