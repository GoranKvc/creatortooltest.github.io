import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshLambertMaterial } from 'three';
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
const geometry = new THREE.TorusGeometry( .5, .02, 64, 64, );
const geometry2 = new THREE.TorusGeometry( .5, .01, 64, 64, );

// Materials

const redMaterial = new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 0.5,
    color: 0xff0000,
    // envMap: texture
})

const blackMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.1,
    metalness: 0.5,
    color: 0x000000,
    // envMap: texture
})

// material.color = new THREE.Color(0xffcccc)

// Mesh
const sphere = new THREE.Mesh(geometry,redMaterial);
scene.add(sphere);

const sphere2 = new THREE.Mesh(geometry,redMaterial);
sphere2.scale.set(0.8, 0.8,0.8);
scene.add(sphere2);

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
    canvas: canvas,
    antialias: true
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
// const fbxPath = "../../src/models/DR1VER-CLOSED.fbx";

// const torusFolder = gui.addFolder('Torus');
// torusFolder.add(sphere.tube, 'x', 0, 1);
// torusFolder.open();

const cubeFolder = gui.addFolder('Helmet Rotation');

const fbxPath = "DR1VER-CLOSED.fbx";

const fbxloader = new FBXLoader();
const textureLoader = new THREE.TextureLoader();


//Load helmet
fbxloader.load(fbxPath, async function(fbxobj){
    const baseColorMap = await textureLoader.load("Dynasty_BaseColor.png");
    const metallicMap = await textureLoader.load("Dynasty_Metallic.png");
    // const normalMap = await textureLoader.load("Mesh_RoughnessGL.png");
    const roughnessMap = await textureLoader.load("Dynasty_Roughness.png");
    const helmetMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
        // map: baseColorMap, 
    //   displacementMap: heightMap,
      metalnessMap: metallicMap,
    //   normalMap: normalMap,
      roughnessMap
    });
    // window.alert("Reading FBX.. please accept and wait");
    fbxobj.traverse(function(child){
        if(child.isMesh)
        {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = helmetMaterial;

            // textureLoader.load( 'hackatao.PNG', ( texture ) => {
            //     // window.alert(texture);
            //     // console.log(texture);
            //     child.material.map = texture;
            //     child.material.needsupdate = true;
            
            // });
        }
    });

    
    
    let s = 0.01;
    scene.add(fbxobj);

    cubeFolder.add(fbxobj.rotation, 'x', 0, Math.PI * 2).name("Rot X");
    cubeFolder.add(fbxobj.rotation, 'y', 0, Math.PI * 2).name("Rot Y");
    cubeFolder.add(fbxobj.rotation, 'z', 0, Math.PI * 2).name("Rot Z");
    cubeFolder.open();
    
    fbxobj.scale.set(s, s, s);

});

//Load env
const fbxPathEnv = "table.fbx";
const tableFolder = gui.addFolder('Table');
fbxloader.load(fbxPathEnv, async function(fbxobj2){
    const baseColorMap = await textureLoader.load("Sci-fi_Box_AlbedoTransparency.png");
    const metallicMap = await textureLoader.load("Sci-fi_Box_MetallicSmoothness.png");
    const normalMap = await textureLoader.load("Sci-fi_Box_Normal_OpenGL.png");
    // const roughnessMap = await textureLoader.load("fi_Box_MetallicSmoothness.png");
    const minigunMaterial = new THREE.MeshStandardMaterial({
      map: baseColorMap, 
    //   displacementMap: heightMap,
      metalnessMap: metallicMap,
      normalMap: normalMap,
      roughness: 0.1
    //   roughnessMap
    });

    for (let child of fbxobj2.children) {
      child.material = minigunMaterial;
    };
    
    // window.alert("Reading FBX.. please accept and wait");
    fbxobj2.traverse(function(child){
        if(child.isMesh)
        {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = minigunMaterial;

            // textureLoader.load( 'hackatao.PNG', ( texture ) => {
            //     // window.alert(texture);
            //     // console.log(texture);
            //     child.material.map = texture;
            //     child.material.needsupdate = true;
            
            // });
        }
    });

    
    
    let s = 0.01;
    scene.add(fbxobj2);

    tableFolder.add(fbxobj2.position, 'x', -10, 10).name("Pos X");
    tableFolder.add(fbxobj2.position, 'y', -10, 10).name("Pos Y");
    tableFolder.add(fbxobj2.position, 'z', -10, 10).name("Pos Z");
    tableFolder.open();
    
    fbxobj2.scale.set(s, s, s);
    fbxobj2.position.set(0, -0.6, -15);

});


//Load env
const fbxPathEnv2 = "env.fbx";
const labFolder = gui.addFolder('Lab');
fbxloader.load(fbxPathEnv2, function(fbxobj3){
    
    // window.alert("Reading FBX.. please accept and wait");
    fbxobj3.traverse(function(child){
        if(child.isMesh)
        {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = blackMaterial;

            // textureLoader.load( 'hackatao.PNG', ( texture ) => {
            //     // window.alert(texture);
            //     // console.log(texture);
            //     child.material.map = texture;
            //     child.material.needsupdate = true;
            
            // });
        }
    });

    
    
    let s = 0.01;
    scene.add(fbxobj3);

    labFolder.add(fbxobj3.position, 'x', -10, 10).name("Pos X");
    labFolder.add(fbxobj3.position, 'y', -10, 10).name("Pos Y");
    labFolder.add(fbxobj3.position, 'z', -10, 10).name("Pos Z");
    labFolder.open();
    
    fbxobj3.scale.set(s, s, s);
    fbxobj3.position.set(0, -0.6, 5);

});

// //----------------



const gltfLoader = new GLTFLoader();
gltfLoader.load("./box.gltf", (objectModel) => {
    objectModel.position.x = 3;
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

    sphere2.rotation.z = .4 * elapsedTime;
    sphere2.rotation.y = .8 * elapsedTime;
    sphere2.rotation.x = .6 * elapsedTime;

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()