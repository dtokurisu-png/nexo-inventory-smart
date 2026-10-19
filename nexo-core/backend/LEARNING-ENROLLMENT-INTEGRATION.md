# Learning Core: entitlement -> enrollment integration

## Status (2026-10-18)
Wix CMS LearningEnrollments exists with ADMIN-only CRUD.
LearningCatalog contains english-adaptive and excel-adaptive as inactive/planned.
Policy source: learning-enrollment-policy.js. This source is committed but **not deployed to Wix Velo backend**.

## Required live backend wiring (not yet deployed)
1. Resolve the authenticated member ID in Wix Velo backend. Never accept memberId from JSON or the client.
2. Query NexoEntitlements for the exact member, using server-side data APIs with necessary authorized read access.
3. Apply enrolledCourses() / reconcileRows() from the server-only policy. Write the resulting rows to LearningEnrollments only from the backend. Deduplicate on memberId + courseSlug.
4. Add a session-protected endpoint returning only {learningCoreVisible, courses:[{slug,title,progress}]} to the authenticated member.
5. Return Learning Core as one environment in nexoMiEspacioUi personal.tools when learningCoreVisible is true; do not return individual course app tiles.
6. In the Learning Core runtime, use the same server endpoint to limit displayed course slugs. All lesson/session/progress write endpoints must verify that the member owns a valid entitlement to the selected track.
7. Payment success, subscription renewal, cancellation and refund must update NexoEntitlements via trusted Wix order lifecycle; never trust frontend checkout callbacks as grants.
8. Map course products to entitlement productKey values (course:english-adaptive, course:excel-adaptive). Learning or Complete plan access to courses needs an explicit, agreed coverage policy; a plan name alone does not grant all premium courses.
9. Only mark courses active and enable checkout when courses, offer identifiers, webhook reconciliation and access-control QA are ready.

## Negative checks
- Unauthenticated request must fail.
- Member A cannot read or enroll as member B.
- No entitlement => course absent and no Learning Core launcher.
- One qualifying course => exactly one Learning Core launcher.
- Two qualifying courses => still one Learning Core launcher.
- Expired/cancelled entitlement => course inaccessible without deleting historical LearningProgress.
- A browser-crafted membership/plan/callback must never create a NexoEntitlements record.

## Current scope
The policy file is source for backend integration, not a browser script or publicly accessible authorization endpoint. No enrollment rows or payments were created by this change.
