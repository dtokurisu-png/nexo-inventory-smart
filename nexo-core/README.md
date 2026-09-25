# Nexo Core — Etapa 1

Versión canónica: `nexo-core-v1`

Esta carpeta documenta el núcleo común de identidad y espacios de Nexo Group.

## Invariantes

- La identidad del usuario es su `Wix Member ID`.
- Toda cuenta Nexo tiene exactamente un espacio personal.
- Un usuario puede pertenecer a cero, uno o muchos Workspaces.
- El rol se define por relación usuario↔Workspace, no por la cuenta global.
- Un mismo usuario puede tener roles distintos en diferentes Workspaces.
- El contexto activo es `personal` o `workspace`.
- Cambiar de contexto no cambia la identidad del usuario.
- Los datos crudos de Nexo Core son ADMIN-only; el acceso de miembros debe pasar por lógica backend autorizada.
- No se mezclan datos personales con datos de un Workspace.

## Colecciones Wix CMS

- `NexoUserProfiles`
- `NexoPersonalSpaces`
- `NexoWorkspaces`
- `NexoWorkspaceMembers`
- `NexoInvitations`
- `NexoContextState`
- `NexoCoreRoles`
- `NexoCoreConfig`

## IDs estables

- Perfil: `<memberId>`
- Espacio personal: `personal-<memberId>`
- Estado de contexto: `context-<memberId>`
- Membership recomendado: `membership-<workspaceId>-<memberId>`

## Roles del sistema

- `owner`
- `admin`
- `manager`
- `collaborator`
- `viewer`

## Flujo de cuenta

1. Wix Members autentica la identidad.
2. Nexo obtiene el Member ID.
3. Si no existe perfil Nexo, se provisiona de forma idempotente:
   - NexoUserProfiles
   - NexoPersonalSpaces
   - NexoContextState con contexto personal
4. El Home personal consulta memberships activas.
5. Cada membership habilita un botón “Ir al espacio de trabajo”.
6. Al entrar en un Workspace se actualiza NexoContextState.
7. Al volver a “Mi espacio”, el contexto vuelve a `personal`.

La Etapa 1 no define todavía suscripciones, cobros ni planes. Eso se conectará después mediante entitlements sin cambiar el modelo de identidad.
