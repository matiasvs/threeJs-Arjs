# Cómo Crear y Cambiar Marcadores Personalizados

Para cambiar el marcador "Hiro" por uno propio (como tu logo o una imagen específica), sigue estos pasos:

## 1. Preparar la Imagen
Elige una imagen que cumpla con estos requisitos para un mejor funcionamiento:
- **Alto contraste**: Blanco y negro funciona mejor, o colores muy diferentes.
- **Asimétrica**: La imagen no debe verse igual si la rotas (para que la AR sepa cuál es "arriba").
- **Bordes simples**: Evita detalles muy finos o complejos.
- **Formato**: JPG o PNG cuadrada.

## 2. Generar los Archivos del Marcador
Usaremos la herramienta oficial de AR.js:

1. Ve al **[AR.js Marker Training](https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html)**.
2. Haz clic en **"Upload"** y selecciona tu imagen.
3. Verás una vista previa de tu marcador (tu imagen dentro de un borde negro).
4. Haz clic en **"Download Marker"**: Esto descargará un archivo `.patt` (ej: `pattern-marker.patt`).
5. Haz clic en **"Download Image"**: Esto descargará la imagen `.png` para imprimir.

## 3. Agregar al Proyecto
1. Copia el archivo `.patt` descargado a la carpeta `public/markers/` de tu proyecto.
2. (Opcional) Copia también la imagen `.png` para tenerla de referencia o para descargarla desde la web.

## 4. Actualizar el Código
Edita el archivo `src/main.js` para usar tu nuevo patrón.

Busca esta parte del código:

```javascript
// Setup marker controls
new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    // Cambia esta línea por la ruta de tu nuevo archivo .patt
    patternUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro',
})
```

Y cámbiala para que apunte a tu archivo local (asegúrate de usar la ruta correcta con el nombre de tu repo si estás en GitHub Pages):

```javascript
// Setup marker controls
new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    // IMPORTANTE: Usa la ruta relativa o absoluta correcta
    // Para desarrollo local y producción (si usas la base correcta en vite.config.js):
    patternUrl: import.meta.env.BASE_URL + 'markers/pattern-marker.patt',
})
```

> **Nota:** Usar `import.meta.env.BASE_URL` asegura que funcione tanto en `localhost` como en GitHub Pages (`/threeJs-Arjs/`).

## 5. Probar
1. Imprime tu nueva imagen `.png` o ábrela en tu celular.
2. Ejecuta `npm run dev` o despliega los cambios.
3. Apunta la cámara a tu nuevo marcador.

## Consejos de Solución de Problemas
- **El marcador no se detecta:** Asegúrate de que el borde negro alrededor de tu imagen sea visible al imprimir. El borde es crucial para la detección.
- **Error de carga:** Verifica que el nombre del archivo `.patt` sea exacto en el código.
