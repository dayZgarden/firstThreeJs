import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();

// Camera mimics what human eyeballs would see
// Takes 3 arguments

                                        // Field of View        // Aspect Ratio           // View Frustum, everything should be visible from the camera lens
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)

// Need a render to render out the graphics --- Needs to know which DOM element to use
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
})

// 
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

// currently the camera is set to the middle of the screen
// move the camera along the z-axis
camera.position.setZ(30);

// blank black screen
renderer.render( scene, camera );

// Need to add an object to it
// Three things to an object -- Geometry: the x,y,z points that makeup a shape
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 )

// Needs a material, the wrapping paper for an object
// in this case no light source is needed because it is a basic material
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347} );

// Combine the geometry with the material
const torus = new THREE.Mesh( geometry, material );

// Add it to scene, wireframe doesn't need a light source
scene.add(torus)

// Need a light source to light it up 
// Point light emits light in every direction, like a lightbulb in the scene
const pointLight = new THREE.PointLight(0xffffff)

// Position light &&& add to the scene
pointLight.position.set(5,5,5)

// Ambient light will light up the entire scene -- like a floodlight in the room -- ADD TO SCENE
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add( pointLight, ambientLight )

// Shows the position of the point light because they are confusing
const lightHelper = new THREE.PointLightHelper(pointLight)

// Adds a grid to the screen
const gridHelper = new THREE.GridHelper(200 ,50)
// scene.add( lightHelper, gridHelper )

// Use math helpers to add a large amount of objects to the scene

// Make the orbit controls class -- Pass it the camera and the renderer dom element
const controls = new OrbitControls( camera, renderer.domElement );

controls.update();

// Create a function to add stars to the background of space
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
    const star = new THREE.Mesh( geometry, material );

    // randomly generate an xyz position for each star
    // randFloatSpread generates a random number between -100 and 100
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ));

    // set the position of the star -- Add to scene
    star.position.set(x, y, z)
    scene.add(star)
}

// Generate an x amount of "addStar"
Array(200).fill().forEach(addStar)

// Load a space texture into the scene, can pass a callback function to notify when the scene is done loading
const spaceTexture = new THREE.TextureLoader().load('space.jpg');

// set the background of the scene to this space texture
scene.background = spaceTexture;

// Make a cube of this picture on every face
const cubeTexture = new THREE.TextureLoader().load('ghost.jpg');

// Create a mesh of a box geometry and a 
const whore = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial( {map : cubeTexture } )
)

scene.add(whore)

// Create a more interesting map with the moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg')
const bumpyTexture = new THREE.TextureLoader().load('bumpy.jpg')

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial( {
        map: moonTexture,
        normalMap: bumpyTexture
    })
);

scene.add(moon)

// Move the moon down because we are scrolling towards it
moon.position.z = 10;
moon.position.x = -10;

whore.position.x=15;

// move the camera
function moveCamera() {
    // calculate where the user is currently scrolled to
    // the top property will tell you how far you are from the top
    const t = document.body.getBoundingClientRect().top;

    // start animating / rotating in the event hanlder
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;



    // move the camera -- the t value will always be negative because going down
    // so multiply by a negative number
    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}

// assign the move camera function for the on scroll event handler
document.body.onscroll = moveCamera

// add it to the scene


// setup a recursive function so your scene can keep calling,
// like an animation
function animate() {
    // Tells the browser you want to perform an animation
    requestAnimationFrame( animate );

    // Every shape created has different properites -- rotation / position / scale
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    whore.rotation.y += 0.01;
    whore.rotation.z += 0.01;

    // Keep updating the UI
    renderer.render( scene, camera )
}

animate();