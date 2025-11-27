import './style.css'
import * as THREE from 'three'

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
    document.body.appendChild(renderer.domElement)

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
        patternUrl: 'https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/patt.hiro',
    })

    // Create 3D object - animated cube
    // Cube 40% smaller (0.6 instead of 1)
    const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)
    const material = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    })
    const cube = new THREE.Mesh(geometry, material)
    // Position cube centered on marker but pushed back
    cube.position.set(0, 0.3, -0.5) // x, y, z
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

        // Rotate cube 20% slower (0.008 instead of 0.01)
        cube.rotation.x += 0.008
        cube.rotation.y += 0.008

        renderer.render(scene, camera)
    }

    animate()
    console.log('AR application started successfully')
}

console.log('Loading AR.js...')
