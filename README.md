# Three.js + AR.js Project

Proyecto de realidad aumentada usando Three.js y AR.js con Vite como bundler y despliegue automático a GitHub Pages.

## 🚀 Características

- ✨ Realidad aumentada basada en marcadores con AR.js
- 🎨 Renderizado 3D con Three.js
- ⚡ Build rápido con Vite
- 🤖 Despliegue automático con GitHub Actions
- 📱 Compatible con dispositivos móviles

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Cámara web o dispositivo móvil con cámara

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa del build
npm preview
```

## 🎯 Uso

1. **Desarrollo local**: Ejecuta `npm run dev` y abre `http://localhost:5173`
2. **Marcador AR**: Descarga e imprime el [marcador Hiro](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)
3. **Probar AR**: Apunta tu cámara al marcador para ver el cubo 3D

## 🚢 Despliegue

El proyecto se despliega automáticamente a GitHub Pages cuando haces push a la rama `main`.

### Configuración inicial de GitHub Pages:

1. Ve a Settings → Pages en tu repositorio
2. En "Source", selecciona "GitHub Actions"
3. Haz push a la rama `main` para activar el despliegue

La aplicación estará disponible en: `https://<tu-usuario>.github.io/threejs-arjs/`

## 📁 Estructura del Proyecto

```
threejs-arjs/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   └── markers/
│       └── hiro.png           # Marcador AR de referencia
├── src/
│   ├── main.js                # Código principal de la aplicación
│   └── style.css              # Estilos CSS
├── index.html                 # HTML principal
├── package.json               # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
└── README.md                  # Este archivo
```

## 🎨 Personalización

### Cambiar el objeto 3D

Edita `src/main.js` y modifica la geometría del cubo:

```javascript
// Cambiar por otra geometría
const geometry = new THREE.SphereGeometry(0.5, 32, 32)
// o cargar un modelo GLB/GLTF
```

### Usar otro marcador

Cambia la URL del patrón en `src/main.js`:

```javascript
const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
  type: 'pattern',
  patternUrl: 'ruta/a/tu/marcador.patt'
})
```

## 🔧 Tecnologías

- [Three.js](https://threejs.org/) - Librería 3D para WebGL
- [AR.js](https://ar-js-org.github.io/AR.js-Docs/) - Realidad aumentada para la web
- [Vite](https://vitejs.dev/) - Build tool y dev server
- [GitHub Actions](https://github.com/features/actions) - CI/CD

## 📝 Notas

- AR.js requiere HTTPS o localhost para acceder a la cámara
- Para mejor rendimiento en móviles, usa modelos 3D optimizados
- El marcador Hiro es el más común para testing

## 🐛 Troubleshooting

**La cámara no se activa:**
- Verifica que estés usando HTTPS o localhost
- Permite el acceso a la cámara en tu navegador

**El marcador no se detecta:**
- Asegúrate de tener buena iluminación
- El marcador debe estar completamente visible
- Mantén una distancia de 20-50cm del marcador

**Build falla:**
- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas
- Verifica que estés usando Node.js 18+

## 📄 Licencia

MIT
