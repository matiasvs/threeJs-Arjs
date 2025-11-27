# Guía de Configuración de GitHub Pages

## Pasos para configurar el despliegue automático:

### 1. Crear repositorio en GitHub

Si aún no tienes un repositorio, créalo en GitHub:
- Ve a https://github.com/new
- Nombre: `threejs-arjs`
- Visibilidad: Público (requerido para GitHub Pages gratis)
- No inicialices con README (ya tenemos uno)

### 2. Conectar repositorio local con GitHub

```bash
# Reemplaza <tu-usuario> con tu nombre de usuario de GitHub
git remote add origin https://github.com/<tu-usuario>/threejs-arjs.git
git branch -M main
git push -u origin main
```

### 3. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source** (Fuente), selecciona **GitHub Actions**
5. ¡Listo! El workflow se ejecutará automáticamente

### 4. Verificar el despliegue

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Una vez completado (✓), tu sitio estará disponible en:
   ```
   https://<tu-usuario>.github.io/threejs-arjs/
   ```

### 5. Actualizar la base URL en vite.config.js (si es necesario)

Si tu repositorio tiene un nombre diferente a `threejs-arjs`, actualiza `vite.config.js`:

```javascript
export default defineConfig({
  base: '/nombre-de-tu-repo/',
  // ...
})
```

## Despliegues futuros

Cada vez que hagas push a la rama `main`, el sitio se actualizará automáticamente:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

## Troubleshooting

### El workflow falla con error de permisos

1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona "Read and write permissions"
3. Guarda los cambios y vuelve a ejecutar el workflow

### El sitio muestra 404

1. Verifica que la configuración de Pages esté en "GitHub Actions"
2. Asegúrate de que el workflow se haya completado exitosamente
3. Espera unos minutos, GitHub Pages puede tardar en actualizar

### Los assets no cargan (404 en CSS/JS)

Verifica que la `base` en `vite.config.js` coincida con el nombre de tu repositorio.
