import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import fbxmodel from './fbxloader';
// import { Vector3 } from 'three';
// import Stats from 'three/examples/jsm/libs/stats.module'



// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const sphereObj = new THREE.TorusKnotGeometry(0.5, 64, 64)
const geometry = new THREE.TorusGeometry( .5, .2, 64, 64, );

// Materials

const material = new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 0.5,
    color: 0xff0000,
    // envMap: texture
})
// material.color = new THREE.Color(0xffcccc)

// Mesh
const sphere = new THREE.Mesh(geometry,material);
scene.add(sphere);

// Lights

// const pointLight = new THREE.PointLight(0xffffff, 0.8)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})




/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//images
const hdriTex = new URL("img/artist_workshop_4k.hdr", import.meta.url);

const imgLoader = new RGBELoader();
imgLoader.load(hdriTex, function(texture){
    
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
                // window.alert(texture.toJSON);
                // console.log("hi");
});


// fbxmodel.then(object=>{
//     window.alert("hi");

//     let s = 0.001;
//     scene.add(object);
//     object.scale.set(s, s, s);
// });

// const fbxPath = new URL("img/box.fbx", import.meta.url);





///FBXXXXXXXXXXXXX
const fbxPath = "../src/models/DR1VER-CLOSED.fbx";

const fbxloader = new FBXLoader();
    fbxloader.load(fbxPath, function(fbxobj){
        fbxobj.traverse(function(child){
            if(child.isMesh)
            {
                child.castShadow = true;
                child.receiveShadow = true;

                
    window.alert("hi");
            }
        });
        let s = 0.01;
        scene.add(fbxobj);
        fbxobj.scale.set(s, s, s);
    });

// //----------------



const gltfLoader = new GLTFLoader();
gltfLoader.load("./models/box.gltf", (objectModel) => {
    scene.add(objectModel);
});



/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.z = .5 * elapsedTime;
    sphere.rotation.x = .8 * elapsedTime;

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()