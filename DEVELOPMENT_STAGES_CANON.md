# Regla canónica prioritaria — Etapas de desarrollo

**Prioridad:** alta. Esta regla debe leerse antes de crear o modificar interfaces, formularios, flujos, herramientas o componentes de Nexo Inventory Smart.

## Principio

Cuando durante el desarrollo se diga **“etapa 1”, “etapa 2”, “etapa 3”**, “fase”, “bloque” o una división similar, esas etapas describen **cómo vamos a organizar internamente el trabajo de desarrollo**.

No significan, por defecto, que el producto, formulario o experiencia del cliente deba tener etapas visibles.

## Regla de producto

Las etapas internas de desarrollo **no deben trasladarse automáticamente a la interfaz**.

Por lo tanto:

- No agregar textos como “Etapa 1”, “Etapa 2”, “Fase 1”, “Paso 1 de 3” o equivalentes solo porque el trabajo técnico se haya dividido en etapas.
- No crear barras de progreso, steppers, wizard steps, pestañas numeradas ni pantallas intermedias basadas únicamente en nuestro plan de desarrollo.
- No convertir formularios que pueden completarse de forma directa en recorridos por etapas.
- No mostrar al cliente nuestra estructura interna de implementación.
- No renombrar componentes, secciones o acciones del producto con el número de la etapa técnica en la que fueron construidos.

## Formularios y creadores

En formularios, creadores, editores y herramientas de captura de datos, la prioridad es que el usuario pueda completar la tarea de forma natural y directa.

Si el desarrollo se divide internamente en varias etapas, cada etapa puede añadir o perfeccionar partes del mismo formulario sin que el usuario vea ninguna referencia a esas etapas.

## Única excepción

Una experiencia por pasos o etapas puede existir **solo cuando sea un requisito explícito del producto solicitado por el owner**.

No debe inferirse a partir de frases como:

- “dividámoslo en etapas”;
- “hagamos primero la etapa 1”;
- “seguimos con la etapa 2”;
- “vamos por bloques”.

Esas expresiones, salvo indicación explícita en contrario, se refieren al **orden de desarrollo**, no a la UX final.

## Criterio de revisión

Antes de publicar cualquier cambio, verificar:

1. ¿Aparece en la interfaz alguna etapa, fase, paso o numeración que provenga únicamente de nuestro proceso de desarrollo?
2. ¿Se añadió un flujo de progreso o wizard sin que el owner lo pidiera como característica del producto?
3. ¿Un formulario se fragmentó visualmente solo porque nosotros lo desarrollamos en partes?

Si cualquiera de las respuestas es “sí”, el cambio debe corregirse antes de publicarse.

## Interpretación por defecto

**Etapas de trabajo = etapas internas de desarrollo.**

**Etapas visibles para el cliente = solo por solicitud explícita del owner.**
