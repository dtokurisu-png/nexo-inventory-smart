/*
Nexo Owner test plan — backend-only policy, not a checkout product.
This module is not loaded in public pages and grants nothing on its own.
The caller must resolve roleKey AND Wix member identity from a trusted server
session, then verify ownership against canonical Nexo authorization records.
Never take isOwner, roleKey, memberId, or planKey from request JSON.
*/
const OWNER_PLAN_KEY='nexo-owner';
const TEST_PRODUCTS=Object.freeze([
 'inventory-smart','dynamic-specs','gear-library','learning-core',
 'work-center','schedules','task-lists','multichannel-notifications',
 'numa-assistant','maria-editorial','camino-editorial-agents',
 'course:english-adaptive','course:excel-adaptive'
]);
function ownerContextIsVerified(context){
 return !!(context&&context.authenticated===true&&context.ownerVerifiedByServer===true&&
  typeof context.memberId==='string'&&context.memberId.length>0&&
  context.roleKey==='owner');
}
function visiblePlansForSession(plans,context){
 return (Array.isArray(plans)?plans:[]).filter(p=>p.planKey!==OWNER_PLAN_KEY||ownerContextIsVerified(context));
}
function mayUseOwnerTrial(context,productKey){
 return ownerContextIsVerified(context)&&TEST_PRODUCTS.includes(productKey);
}
function ownerAccessDecision(context,productKey){
 const allowed=mayUseOwnerTrial(context,productKey);
 return {allowed,source:allowed?'OWNER_TEST':null,planKey:allowed?OWNER_PLAN_KEY:null,
  billable:false,grantPersisted:false};
}
if(typeof module!=='undefined')module.exports={
 OWNER_PLAN_KEY,TEST_PRODUCTS,ownerContextIsVerified,visiblePlansForSession,mayUseOwnerTrial,ownerAccessDecision
};
