# Fichas Técnicas — creación anidada canónica

Este documento define el comportamiento interno obligatorio cuando una ficha crea otra entidad desde su propio editor.

## Principio

Una ficha hija nunca sustituye, serializa ni destruye a la ficha padre.

La ficha padre permanece montada con todo su estado de edición intacto. Mientras exista una hija por encima, la padre queda inactiva e inaccesible para interacción. Al cerrar o completar la hija, la padre vuelve a ser la ficha activa.

## Pila de editores

Los editores forman una pila LIFO:

- la primera ficha es la raíz;
- una creación iniciada desde esa ficha abre una hija;
- una hija puede abrir otra hija si una función futura lo requiere;
- únicamente la ficha superior puede cerrarse o completarse;
- cerrar una hija jamás cierra su padre.

No debe volver a implementarse un editor singleton.

## Propiedad del estado

Cada editor posee exclusivamente:

- identidad del borrador;
- tipo de ficha;
- referencias a su capa DOM;
- título y descripción;
- archivos y Object URLs temporales;
- composición;
- MOP y su historial;
- selección/caret;
- listeners y funciones de limpieza.

Los recursos de una hija se limpian al cerrarla. Los recursos de su padre no se tocan.

## Suspensión de la ficha padre

Al abrir una hija:

1. se conserva el elemento que tenía foco en la padre;
2. la capa padre permanece en el DOM;
3. la capa padre queda `inert` y con `aria-hidden`;
4. pickers flotantes de la padre se ocultan;
5. la hija pasa a ser el único editor activo.

Al cerrar la hija:

1. se eliminan únicamente su capa, listeners y recursos temporales;
2. la padre vuelve a ser activa;
3. se restaura el foco anterior cuando sigue disponible.

## Completar una hija

La infraestructura ofrece un callback `onComplete(payload, context)`.

El guardado real de Insumos y Preparaciones se conectará a ese callback en sus respectivas implementaciones. El orden obligatorio será:

1. la entidad hija termina su persistencia;
2. se cierra la hija;
3. se reactiva la padre;
4. el callback recibe el resultado persistido;
5. la ficha padre puede incorporarlo a su composición.

No insertar entidades provisionales en la composición para simular este flujo.

## Cierre y navegación

- Botón cerrar, fondo y Escape afectan únicamente al editor superior.
- Una ficha inferior nunca responde a eventos de teclado, selección o resize mientras no sea la activa.
- Los listeners globales deben registrarse por editor y eliminarse al destruir ese editor.

## Regla visual

Esta arquitectura es interna. No mostrar al usuario números de profundidad, “Etapa 2”, jerarquías técnicas ni otros detalles del proceso de desarrollo.

Implementación canónica: `menu-dinamico/workspace-library-v1.js`, mediante `NEXO_FICHAS_NESTED_EDITOR`.
