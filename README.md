# Nexo Inventory Smart - GitHub Pages

Este proyecto contiene el HTML del inventario dinámico para alojarlo en GitHub Pages y usarlo dentro de Wix mediante un componente HTML/iFrame.

## Archivo principal

- `index.html`: página que debe publicar GitHub Pages.

## Código Velo

El archivo de referencia está en:

- `wix/velo_bridge_userinventory_debug_v6.txt`

Ese código NO se ejecuta en GitHub. Debe pegarse en la página Wix donde está el componente HTML con ID `inventoryHtml`.

## Flujo

GitHub Pages aloja el HTML.
Wix carga ese HTML por URL.
El HTML se comunica con Wix usando `postMessage`.
Velo lee y escribe en la colección Wix `UserInventory`.

## Colección Wix esperada

Collection ID:

- `UserInventory`

Field keys esperados:

- `productName`
- `supplier`
- `presentation`
- `unidadCosto`
- `unitOfMeasure`
- `costPerUnit`
- `totalCost`
- `maxStock`
- `itemType`
- `productImage`
- `expira`
- `fechaMod`

## Nota

Para pruebas, la colección debe permitir lectura al usuario que está cargando la página. Si no, Wix mostrará error de permisos.
