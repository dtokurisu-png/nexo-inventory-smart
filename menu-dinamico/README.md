# Nexo Group — Menú Dinámico v1

Nueva sección independiente dentro del proyecto existente **Nexo Group**.

## Objetivo

Gestor bilingüe EN/ES de fichas técnicas de cocina con navegación jerárquica:

- Plato principal → secciones (`To Plate`, `Set 1`, `Set 2`, etc.).
- Componentes → subrecetas reutilizables.
- Ingredientes básicos → ficha global reutilizable.
- Preparaciones/cortes → ficha propia (`Minced`, `Brunoise`, `Julienne`, `Small Dice`, etc.).
- Cada entidad subordinada puede recibir una foto tomada/cargada desde el teléfono.
- La foto se guarda en la entidad global y se refleja en todas las recetas que la utilicen.
- La receta principal usa `heroImage` como foto guía inicial.
- Selector EN/ES persistente en toda la interfaz.

## Frontend

`menu-dinamico/index.html`

Es una aplicación HTML/CSS/JS responsive preparada para incrustarse en Wix mediante un componente HTML Embed.

### ID requerido del componente Wix

`dynamicMenuHtml`

### Mensajes HTML → Wix

- `MENU_HTML_READY`
- `LOAD_MENU_DATA`
- `REQUEST_MEDIA_UPLOAD_URL`
- `SAVE_ENTITY_IMAGE`
- `PING_WIX`

### Mensajes Wix → HTML

- `WIX_READY`
- `MENU_DATA_LOADED`
- `MEDIA_UPLOAD_URL`
- `ENTITY_IMAGE_SAVED`
- `ERROR`

## Wix CMS

Las colecciones de v1 son:

1. `DMRecipes` — platos y subrecetas.
2. `DMSections` — grupos/etapas dentro de una receta.
3. `DMComponents` — líneas de ingredientes/componentes dentro de las secciones.
4. `DMIngredients` — ingredientes base globales.
5. `DMPreparations` — cortes/procesos específicos de cada ingrediente.

Las relaciones se guardan mediante IDs de texto para permitir componentes polimórficos sin duplicar entidades.

### Convención de `componentType`

- `SUBRECIPE`
- `INGREDIENT`
- `PREPARATION`
- `TEXT`

Un `SUBRECIPE` usa `targetRecipeId`.
Un `INGREDIENT` usa `targetIngredientId`.
Un `PREPARATION` usa `targetIngredientId` + `targetPreparationId`.

## Fotografías

Campos globales:

- `DMRecipes.heroImage`
- `DMIngredients.baseImage`
- `DMPreparations.image`

El frontend solicita una URL firmada de Wix Media Manager, sube el archivo directamente y luego ordena al puente Velo guardar la referencia `MEDIA_IMAGE` en la entidad correspondiente.

La entrada móvil usa `accept="image/*"` y `capture="environment"`, permitiendo abrir la cámara en dispositivos compatibles.

## Puente Velo

Código preparado en:

`wix/velo_bridge_dynamic_menu_v1.txt`

Debe colocarse en el código de la nueva página Wix que contenga el HTML Embed `#dynamicMenuHtml`.

## Seguridad v1

Colecciones creadas como internas para miembros del sitio:

- read: `SITE_MEMBER`
- insert: `SITE_MEMBER`
- update: `SITE_MEMBER`
- remove: `ADMIN`

La página debe mantenerse restringida al personal/miembros autorizados. En una etapa posterior se puede endurecer la edición de fotos mediante roles específicos si hace falta.

## Estado

La arquitectura base está creada sin modificar el `index.html` principal del proyecto de inventario existente.
