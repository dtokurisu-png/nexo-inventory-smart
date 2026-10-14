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


## Clasificación visible de fichas

La biblioteca usa tres clasificaciones visibles:

- **Producto final**: receta cuyo `recipeType === "DISH"`. `DISH` queda únicamente como identificador técnico heredado.
- **Preparación**: receta reutilizable cuyo `recipeType !== "DISH"`.
- **Insumo**: entidad base de `DMIngredients` / `SUPPLY`.

Los contenedores de una colección se muestran como **Productos finales**, **Preparaciones** e **Insumos** y se calculan automáticamente a partir del tipo de cada entidad.

No mostrar al usuario las etiquetas heredadas **Plato/Platos** ni **Producto/Productos** cuando esta última se refiera a un Insumo.

Los contenedores son vistas de agrupación: no crean copias de las fichas.

Para **Recetario de Olhicory**, si la membresía histórica enumera únicamente `DMRecipes`, los Insumos del mismo Workspace también se muestran dentro del contenedor Insumos para conservar la estructura funcional del recetario histórico.


## Indicador visual de Insumos

Las tarjetas del grupo **Insumos** muestran un indicador visual pequeño, sin texto visible:

- **Procesable** → icono de Preparaciones.
- **Consumible** → icono de Completado.

El significado debe exponerse mediante `title` y `aria-label`.

La clasificación primaria viene de `DMIngredients.supplyMode` con valores `PROCESSABLE` o `CONSUMABLE`. Para compatibilidad con registros viejos sin ese campo, una relación activa en `supplyProcesses` o una transformación heredada en `DMPreparations` implica `PROCESSABLE`; en ausencia de ambas se considera `CONSUMABLE`.


## Barra de herramientas interna

La franja interna histórica de Fichas Técnicas deja de ser un segundo header y se convierte en una **barra de herramientas contextual**.

Reglas:

- Fondo fijo: `#2A3157`.
- No muestra marca N, nombre Nexo Group, nombre de herramienta ni navegación global.
- No muestra Mi espacio, Workspace, Fichas técnicas, Centro de desarrollo ni Volver al Workspace.
- No contiene Idioma ni Apariencia; esas opciones pertenecen exclusivamente al header global.
- Las herramientas permanecen visibles y ocupan posiciones estables.
- Una herramienta no disponible para el contexto actual permanece visible, deshabilitada y visualmente atenuada.
- Guía de colores y Calculadora están disponibles desde cualquier vista.
- Temporizador y Sugerir cambio se habilitan únicamente dentro de una ficha de Producto final o Preparación.
- Sugerir cambio además requiere contexto de Workspace.
- Volver es navegación interna de Fichas y nunca debe sacar al usuario al Workspace desde la raíz.
- Herramientas nuevas propias de Fichas Técnicas se incorporan a esta barra, no al header global.


### Compatibilidad de la barra con Taxonomy Core

La barra contextual no expone el antiguo botón `#home`. Ningún módulo interno puede depender de ese nodo.

`taxonomy-core-v3.js` usa exclusivamente `#back` para navegación interna de categorías y no controla visibilidad mediante la clase `hidden`; solo puede ajustar el estado `disabled` cuando la taxonomía posee la navegación. La raíz de la biblioteca mantiene Volver deshabilitado.
