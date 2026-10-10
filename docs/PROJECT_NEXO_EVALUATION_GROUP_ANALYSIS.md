# Nexo Evaluación + Análisis de Grupos

Estado: **PLANNED / no implementado**

## Nexo Evaluación
Herramienta independiente del Centro de Desarrollo para cargar una evaluación, respuesta/clave de referencia, material de apoyo y evidencias de cada participante.

Flujo previsto:
1. Definir o cargar evaluación maestra.
2. Confirmar preguntas, puntajes y criterios.
3. Registrar participantes y capturar/subir sus respuestas.
4. IA propone correcciones con nivel de confianza.
5. Respuestas dudosas o incorrectas pasan a revisión humana.
6. La persona responsable confirma la calificación final.

Principio: la IA recomienda; la decisión final permanece en manos del evaluador.

Uso de IA: medido por consumo. Las comprobaciones determinísticas deben resolverse sin IA cuando sea posible.

## Análisis de Grupos
Herramienta independiente que consume resultados ya evaluados para detectar:
- fortalezas y dificultades observadas;
- errores recurrentes;
- evolución individual y grupal;
- conceptos con mayor o menor dominio;
- preguntas potencialmente problemáticas;
- agrupaciones por necesidades de apoyo;
- recomendaciones prácticas.

No debe presentar inferencias psicológicas ni diagnósticos. Los perfiles se describen como **patrones observados en los datos disponibles**.

## Integración futura
Las herramientas permanecen separadas.

Contrato previsto:
Camino Editorial / Taller de Creación -> Nexo Evaluación -> Análisis de Grupos -> recomendaciones reutilizables en Camino Editorial.

No compartir lógica interna entre productos; conectarlos mediante datos estructurados y contratos versionados.
