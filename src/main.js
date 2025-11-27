import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Make THREE available globally
window.THREE = THREE

// Load AR.js dynamically after THREE is available
const script = document.createElement('script')
script.src = 'https://raw.githack.com/AR-js-org/AR.js/master/three.js/build/ar-threex.js'
script.onload = initAR
script.onerror = () => {
    console.error('Failed to load AR.js')
    alert('Error al cargar AR.js. Por favor recarga la página.')
}
document.head.appendChild(script)

function initAR() {
    console.log('AR.js loaded, initializing...')

    // Initialize scene
    const scene = new THREE.Scene()

    // Setup camera
    const camera = new THREE.Camera()
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
    renderer.domElement.style.left = '0px'
    document.body.appendChild(renderer.domElement)

    // Setup OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.screenSpacePanning = false
    controls.minDistance = 0.1
    controls.maxDistance = 100

    // Setup AR.js source
    const arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    })

    arToolkitSource.init(() => {
        console.log('Camera initialized successfully')
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
    const arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/camera_para.dat',
        detectionMode: 'mono',
    })

    arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
        console.log('AR.js context initialized successfully')
    })



    // Create marker root
    const markerRoot = new THREE.Group()
    scene.add(markerRoot)

    // Setup marker controls
    new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: 'pattern',
        patternUrl: import.meta.env.BASE_URL + 'markers/patts.patt',
    })

    // Create a simple rotating cube
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
        color: 0x4CAF50,
        metalness: 0.3,
        roughness: 0.4
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 0.5, 0)
    markerRoot.add(cube)

    // Store cube reference for animation
    window.rotatingCube = cube

    console.log('Cube created successfully')

    // Add lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2) // Increased intensity
    directionalLight.position.set(0, 5, 5)
    scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 1) // Increased intensity
    scene.add(ambientLight)

    // Hide info overlay after delay
    setTimeout(() => {
        const info = document.getElementById('info')
        if (info) {
            info.classList.add('hide')
        }
    }, 5000)

    // Animation loop
    const clock = new THREE.Clock()

    function animate() {
        requestAnimationFrame(animate)

        const delta = clock.getDelta()

        if (arToolkitSource.ready !== false) {
            arToolkitContext.update(arToolkitSource.domElement)
        }

        // Update controls
        controls.update()

        // Rotate cube on Z axis
        if (window.rotatingCube) {
            window.rotatingCube.rotation.z += 0.01
        }

        // Update animations if any
        if (window.mixers) {
            window.mixers.forEach(mixer => mixer.update(delta))
        }

        renderer.render(scene, camera)
    }

    animate()
    console.log('AR application started successfully')
}

console.log('Loading AR.js...')
