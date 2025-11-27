import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

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
        patternUrl: import.meta.env.BASE_URL + 'markers/patts.patt',
    })

    // Load GLB Model
    const loader = new GLTFLoader()
    loader.load(
        import.meta.env.BASE_URL + 'models/model.glb',
        (gltf) => {
            const model = gltf.scene
            // Adjust scale if needed (you might need to change this depending on your model size)
            model.scale.set(0.3, 0.3, 0.3)
            // Center the model
            model.position.set(0, 0, 0)
            model.rotation.set(0, 0, 90)
            markerRoot.add(model)
            console.log('Model loaded successfully')

            // Optional: Add animation mixer if model has animations
            if (gltf.animations && gltf.animations.length) {
                const mixer = new THREE.AnimationMixer(model)
                const action = mixer.clipAction(gltf.animations[0])
                action.play()
                // Add mixer to a global array or variable to update in animate loop
                window.mixers = window.mixers || []
                window.mixers.push(mixer)
            }
        },
        (progress) => {
            console.log('Loading model...', (progress.loaded / progress.total * 100) + '%')
        },
        (error) => {
            console.error('An error happened loading the model:', error)
        }
    )

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
