# Etapa 2 — Mi espacio

Esta etapa implementa la experiencia personal de Nexo sobre el núcleo de Etapa 1.

## Incluye

- Aprovisionamiento perezoso e idempotente del usuario al primer acceso.
- Dashboard personal.
- Herramientas personales desde `NexoToolCatalog`.
- Lista de Workspaces donde el miembro tiene una membresía activa.
- Botón **Ir al espacio de trabajo →**.
- Cambio real de contexto `personal → workspace`.
- Botón **← Mi espacio** para volver al contexto personal.
- Invitaciones pendientes.
- Aceptar o rechazar invitaciones.
- Validación backend para impedir abrir Workspaces ajenos.
- Datos Core protegidos: el iframe nunca consulta CMS directamente.

## Archivos

- `mi-espacio.html/css/js`: interfaz embebible.
- `../wix/backend/nexo-core.web.js`: servicio backend para miembro autenticado.
- `../wix/page-code/mi-espacio.js`: puente Wix ↔ iframe.

## HTML component esperado

En la página Wix **Mi espacio**, el componente HTML debe usar el ID:

`#nexoMiEspacioHtml`

y cargar:

`https://dtokurisu-png.github.io/nexo-inventory-smart/nexo-core/stage-2/mi-espacio.html`

Para previsualizar únicamente el diseño fuera de Wix:

`...?demo=1`

El modo demo no consulta datos reales.

## Seguridad

La identidad se resuelve en backend con `currentMember`. Ningún método recibe un `memberId` desde el navegador. Las colecciones Nexo Core siguen con permisos ADMIN-only y se consultan en backend con supresión de permisos.
