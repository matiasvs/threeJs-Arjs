import './style.css'
import * as THREE from 'three'
import '@ar-js-org/ar.js/three.js/build/ar-threex-location-only'
import '@ar-js-org/ar.js'

// Make THREE available globally for AR.js
window.THREE = THREE

// Initialize scene
const scene = new THREE.Scene()

// Setup camera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
)
scene.add(camera)

// Setup renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
})
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild(renderer.domElement)

// Setup AR.js
const arToolkitSource = new window.THREEx.ArToolkitSource({
    sourceType: 'webcam',
})

arToolkitSource.init(() => {
    console.log('Camera initialized')
    onResize()
}, (error) => {
    console.error('Error initializing camera:', error)
    alert('No se pudo acceder a la cámara. Por favor, permite el acceso y recarga la página.')
})

// Handle window resize
window.addEventListener('resize', onResize)

function onResize() {
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
}

// Setup AR.js context
const arToolkitContext = new window.THREEx.ArToolkitContext({
    cameraParametersUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/camera_para.dat',
    detectionMode: 'mono',
})

arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
    console.log('AR.js context initialized')
})

// Create marker root
const markerRoot = new THREE.Group()
scene.add(markerRoot)

// Setup marker controls
new window.THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro',
})

// Create 3D object - animated cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
})
const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0.5
markerRoot.add(cube)

// Add lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 5, 5)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

// Hide info overlay after delay
setTimeout(() => {
    const info = document.getElementById('info')
    if (info) {
        info.classList.add('hide')
    }
}, 5000)

// Animation loop
function animate() {
    requestAnimationFrame(animate)

    if (arToolkitSource.ready !== false) {
        arToolkitContext.update(arToolkitSource.domElement)
    }

    // Rotate cube
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
}

animate()
console.log('AR application started')
