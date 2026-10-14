# Fichas Técnicas Dinámicas — biblioteca principal canónica

Este documento define la reconstrucción de la vista principal de Fichas Técnicas Dinámicas.

## Separación obligatoria

La biblioteca tiene dos vistas principales:

### Colecciones

Una colección es un **contenedor organizativo** del Workspace.

- Tiene identidad propia: `id`, `name`, descripción opcional y estado.
- Agrupa fichas técnicas.
- No sustituye ni duplica una ficha.
- La colección no equivale a las categorías históricas Platos / Preparaciones / Productos.
- La navegación antigua de taxonomía no debe utilizarse como vista de Colecciones.

Contrato de creación ya existente:

```js
NEXO_DM_CREATE_COLLECTION
{ input: { name, description } }
```

El backend devuelve la colección creada con al menos `id` y `name`.

### Fichas técnicas

Es el catálogo reutilizable de fichas individuales.

- Las fichas siguen existiendo como entidades propias.
- La pertenencia canónica se guarda en `NexoTechnicalSheetCollectionItems` mediante `collectionId + technicalSheetId + sourceCollection`.
- Durante la migración, `DMRecipes.collectionId` puede mantenerse como espejo de compatibilidad para clientes antiguos, pero no sustituye la tabla de vínculos.
- Abrir una ficha desde una colección y abrirla desde el catálogo global debe llevar a la misma ficha, no a copias distintas.
- La búsqueda global de Fichas técnicas puede buscar por nombre y por contenido/ingredientes.

## Navegación

Vista inicial → Colecciones.

Colecciones → abrir colección → ver únicamente sus fichas → abrir ficha.

El usuario puede volver desde el detalle de colección a la lista de Colecciones sin salir de Fichas Técnicas Dinámicas.

La pestaña Fichas técnicas muestra el catálogo global, independientemente de la colección seleccionada.

## Creación

- Colecciones tiene una acción propia **Nueva colección**.
- La creación usa el contrato real `{name, description}`.
- Crear ficha sigue siendo una acción distinta.
- La persistencia nueva de Insumos/Preparaciones permanece pendiente y se probará primero en una colección aislada; ver Issue #2.

## Regla de migración visual

No reutilizar `.taxonomyGrid` como biblioteca de Colecciones.

Las categorías heredadas Platos / Preparaciones / Productos pueden seguir existiendo para compatibilidad interna o vistas antiguas, pero no representan las colecciones del Workspace.

## Regla de producto

Las etapas internas de desarrollo nunca se muestran en esta biblioteca.


## Colección principal de Olhicory

La colección histórica `nexo-collection-332129eeaf581385111ce8e12011` es el contenedor principal del proyecto y su nombre visible es **Recetario de Olhicory**.

Las asociaciones existentes viven en `NexoTechnicalSheetCollectionItems`. No inferir un conteo cero únicamente porque una receta antigua no tenga `collectionId`.


### Compatibilidad de colecciones importadas

Durante la migración puede ocurrir que el payload de `engine.data` todavía no entregue `NexoTechnicalSheetCollectionItems` ni el espejo `collectionId` aunque los vínculos sí existan en Wix.

En ese caso, y **solo para colecciones importadas**, la biblioteca puede reconstruir temporalmente la pertenencia usando:

1. `sourcePackageKey` idéntico entre colección y ficha; o
2. `sourceKey` de la colección contenido en el `sourcePackageKey` de la ficha, limitado al mismo `workspaceId`.

Esta inferencia no aplica a colecciones creadas manualmente y nunca sustituye la tabla canónica de vínculos.
