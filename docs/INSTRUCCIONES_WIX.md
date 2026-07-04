# Cómo conectar esta página con Wix

1. Publica este repositorio con GitHub Pages.
2. Copia la URL pública generada por GitHub Pages.
3. En Wix, selecciona el componente HTML/iFrame.
4. Elige "Dirección web".
5. Pega la URL pública de GitHub Pages.
6. Mantén el código Velo en la página Wix.
7. Asegúrate de que el componente HTML tenga ID `inventoryHtml`.

El HTML externo no accede directamente a Wix Data. La página Wix recibe mensajes del HTML y usa Velo para consultar o guardar en `UserInventory`.
