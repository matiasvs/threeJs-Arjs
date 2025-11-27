import './style.css'
import * as THREE from 'three'

// Initialize Three.js scene
const scene = new THREE.Scene()

// Camera setup
const camera = new THREE.Camera()
scene.add(camera)

// Renderer setup
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

// AR.js setup
const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
})

arToolkitSource.init(() => {
    onResize()
}, (error) => {
    console.error('Error initializing AR source:', error)
    alert('No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara y recarga la página.')
})

// Handle resize
window.addEventListener('resize', onResize)

function onResize() {
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
}

// AR.js context
const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/camera_para.dat',
    detectionMode: 'mono'
})

arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
    console.log('AR.js initialized successfully')
})

// Marker setup
const markerRoot = new THREE.Group()
scene.add(markerRoot)

const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro'
})

// Add 3D object (rotating cube)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
})
const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0.5
markerRoot.add(cube)

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 5, 5)
scene.add(light)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Hide info overlay after delay
setTimeout(() => {
    const info = document.getElementById('info')
    if (info) {
        info.classList.add('hide')
    }
}, 1000)

// Animation loop
function animate() {
    requestAnimationFrame(animate)

    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement)
    }

    // Rotate cube
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
}

animate()
