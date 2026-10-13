# Fichas Técnicas — modelo de datos canónico

Este documento define el modelo de dominio que debe leerse antes de modificar creación, edición, importación, búsqueda o persistencia de Fichas Técnicas.

## Entidades canónicas

### Insumo (`SUPPLY`)

Es una entrada reutilizable que puede consumirse directamente o someterse a procesos antes de utilizarse.

Estados:

- `CONSUMABLE`: se usa como está.
- `PROCESSABLE`: admite una o más formas de procesamiento.

Cantidad y unidad predeterminadas son opcionales.

La colección física heredada `DMIngredients` continúa siendo la fuente de los insumos para no romper los datos existentes.

### Preparación (`PREPARATION`)

Es una ficha técnica reutilizable completa, con composición y método propios.

Las preparaciones existentes viven actualmente en `DMRecipes` como fichas cuyo `recipeType` no es `DISH`.

**Una preparación no es un corte ni una transformación de un insumo.**

### Proceso (`PROCESS`)

Describe una transformación reutilizable que puede aplicarse a diferentes insumos.

Ejemplos conceptuales: Juliana, Rodajas, Dados pequeños, Rallado, Molido, Derretido.

Un proceso existe una sola vez en el catálogo y puede relacionarse con muchos insumos.

Persistencia nueva: `DMProcesses`.

### Insumo + Proceso (`SUPPLY_PROCESS`)

Es la relación entre un insumo concreto y un proceso reutilizable.

Ejemplos:

- Chalota + Dados pequeños.
- Cebolla blanca + Dados pequeños.
- Jabón azul + Rallado.

La relación puede guardar datos específicos de esa combinación, como imagen, notas y orden.

Persistencia nueva: `DMSupplyProcesses`.

### Elemento de composición (`COMPOSITION_ITEM`)

Una línea de composición debe señalar exactamente uno de estos tipos canónicos:

- `SUPPLY`
- `SUPPLY_PROCESS`
- `PREPARATION`
- `TEXT`

## Compatibilidad con el modelo anterior

La colección histórica `DMPreparations` contiene realmente cortes o transformaciones vinculadas a un ingrediente. Su nombre es ambiguo frente al concepto nuevo de Preparación.

No se elimina ni se reescribe destructivamente.

La capa `menu-dinamico/fichas-domain-model-v1.js` convierte esos registros al cargar:

1. deduplica el nombre del proceso y crea un `PROCESS` reutilizable;
2. crea la asociación `SUPPLY_PROCESS` con el insumo original;
3. conserva `legacyPreparationId` para rastrear el registro histórico;
4. mantiene las colecciones antiguas disponibles para que la interfaz existente siga funcionando.

Ejemplo: tres registros históricos de `Small Dice` para fennel, onion y shallot se convierten en un solo proceso `Small Dice` y tres relaciones Insumo↔Proceso.

## Reglas obligatorias para código nuevo

- No crear nuevos cortes o procesos en `DMPreparations`.
- No representar una preparación completa como un ingrediente.
- No duplicar un proceso por cada insumo.
- Los componentes nuevos deben poder resolverse a Insumo, Insumo+Proceso, Preparación o Texto.
- La UI puede seguir leyendo campos heredados durante la migración, pero las nuevas funciones deben basarse en las entidades canónicas.
- Las etapas internas de desarrollo nunca deben aparecer como pasos de producto salvo solicitud explícita del owner.

## Persistencia física

Se mantienen:

- `DMIngredients`
- `DMRecipes`
- `DMSections`
- `DMComponents`

Se incorporan:

- `DMProcesses`
- `DMSupplyProcesses`

`DMPreparations` queda como colección de compatibilidad para datos históricos.

El contrato legible por máquina está en `nexo-core/fichas-domain-schema-v1.json`.
