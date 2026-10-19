/*
 * Nexo Group | Learning enrollment policy (SERVER ONLY)
 * Source contract for the existing Velo backend. NOT loaded by browsers.
 * Only pass memberId resolved from a verified Wix member session on the server.
 * NexoEntitlements is authoritative; LearningEnrollments is a private projection.
 * A client payload, course card, or Wix plan name NEVER constitutes a grant.
 */
const COURSES=Object.freeze({
  'english-adaptive':{productKey:'course:english-adaptive',title:'Inglés adaptable'},
  'excel-adaptive':{productKey:'course:excel-adaptive',title:'Excel adaptable'}
});
const ACTIVE=new Set(['ACTIVE','TRIALING']);
const VALID_SOURCE=new Set(['PURCHASE','ORDER','SUBSCRIPTION','PLAN','ADMIN','PROMOTION','TRIAL']);
function dateValue(v){const t=Date.parse(String(v||''));return Number.isFinite(t)?t:null}
function validGrant(ent,memberId,slug,at=Date.now()){
  if(!COURSES[slug]||!ent||String(ent.memberId)!==String(memberId))return false;
  if(String(ent.ownerType||'MEMBER').toUpperCase()!=='MEMBER')return false;
  if(ent.active!==true||!ACTIVE.has(String(ent.status||'').toUpperCase()))return false;
  if(String(ent.productKey)!==COURSES[slug].productKey)return false;
  const start=dateValue(ent.startsAt),end=dateValue(ent.expiresAt);
  if(start!==null&&at<start)return false;
  if(end!==null&&at>=end)return false;
  // No sourceType fallback or plan-name inference.
  return VALID_SOURCE.has(String(ent.sourceType||'').toUpperCase())&&Boolean(ent.sourceId||ent.sourcePlanId||ent.sourceSubscriptionId);
}
function enrolledCourses(entitlements,memberId,at=Date.now()){
  if(typeof memberId!=='string'||!memberId.trim())throw Error('VERIFIED_MEMBER_REQUIRED');
  return Object.keys(COURSES).filter(slug=>(entitlements||[]).some(e=>validGrant(e,memberId,slug,at)));
}
function reconcileRows({memberId,entitlements,existingRows,at=Date.now()}){
  const enabled=enrolledCourses(entitlements,memberId,at);
  const updates=[];
  for(const slug of Object.keys(COURSES)){
    const row=(existingRows||[]).find(r=>r.courseSlug===slug&&r.memberId===memberId);
    const grant=(entitlements||[]).find(e=>validGrant(e,memberId,slug,at));
    if(!row&&!grant)continue;
    const status=grant?'ACTIVE':'INACTIVE';
    if(row?.status===status&&row?.entitlementKey===(grant?.entitlementKey||''))continue;
    updates.push({
      ...(row?{_id:row._id}:{}),
      memberId,courseSlug:slug,status,
      entitlementKey:grant?.entitlementKey||'',
      sourceType:grant?.sourceType||'',
      sourceId:grant?.sourceId||grant?.sourceSubscriptionId||grant?.sourcePlanId||'',
      enrolledAt:row?.enrolledAt||(grant?new Date(at):undefined),
      expiresAt:grant?.expiresAt||null,lastSyncedAt:new Date(at)
    });
  }
  return {enabledCourses:enabled,learningCoreVisible:enabled.length>0,updates};
}
if(typeof module!=='undefined')module.exports={COURSES,validGrant,enrolledCourses,reconcileRows};
