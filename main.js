// Colors
// sun: #feca50
// mercury: #cfcd87
// venus: #fa7f7b
// earth: #35c9d1
// mars: #fb6247
// jupiter: #8a550f
// saturn: #d5d5c0
// uranus: #43cfe1
// neptune: #b6a1e2
// background: #0b1a3b

import './style.css';
import * as THREE from 'three';
import { OrbitControls }  from 'three/examples/jsm/controls/OrbitControls';
import Body from './body.js';
import LineTrail from './effects.js';

let clock = new THREE.Clock();
let delta = 0;
// 30 fps
let interval = 1 / 30;

// Set up scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x071126);

// Set up renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
  antialias: true,
});
renderer.frustumCulling = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set up camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,-40);

// temp controls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false;
// controls.zoom0 = 10;
// controls.enableRotate = false;

// Set up helpers
const gridHelper = new THREE.GridHelper(200, 100);
gridHelper.rotateX(90 * (Math.PI / 180)); //grid is on z axis now
// scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.04);
scene.add(ambientLight);

addStars(600);

let sun = new Body(2, 0xffdb61, true);
scene.add(sun.mesh);
sun.velocity.add(new THREE.Vector3(0, 0, 0));

let planet = new Body(0.1, 0xcfcd87);
scene.add(planet.mesh);
planet.mesh.position.set(3, 0, 0);
planet.velocity.add(new THREE.Vector3(0, 0.378, 0));

let planet2 = new Body(0.15, 0xfa7f7b);
scene.add(planet2.mesh);
planet2.mesh.position.set(7, 0, 0);
planet2.velocity.add(new THREE.Vector3(0, -0.243, 0));

let planet3 = new Body(0.25, 0x35c9d1);
scene.add(planet3.mesh);
planet3.mesh.position.set(-12.5, 0, 0);
planet3.velocity.add(new THREE.Vector3(0, -0.183, 0));

let moon = new Body(0.03, 0xcccccc);
scene.add(moon.mesh);
moon.mesh.position.set(1.4, 0, 0);
moon.velocity.add(new THREE.Vector3(0.045, 0.45, 0.01));
planet3.mesh.add(moon.mesh);

let planet4 = new Body(0.3, 0xb6a1e2);
scene.add(planet4.mesh);
planet4.mesh.position.set(22, 0, 0);
planet4.velocity.add(new THREE.Vector3(0, 0.138, 0));

let interaction = new Body(0.5, 0x101010);
scene.add(interaction.mesh);
interaction.mesh.material.transparent = true;
interaction.mesh.material.opacity = 0.4;
interaction.mesh.position.set(0,0,0);

let world = [sun, planet, planet2, planet3, moon, planet4, interaction];
sun.gravityArray = world;
planet.gravityArray = world;
planet2.gravityArray = world;
planet3.gravityArray = world;
moon.gravityArray = world;
planet4.gravityArray = world;


const planetLineTrail = new LineTrail(scene, planet);
const planet2LineTrail = new LineTrail(scene, planet2, 4);
const planet3LineTrail = new LineTrail(scene, planet3, 6);
const moonLineTrail = new LineTrail(scene, moon, 0.06);
const planet4LineTrail = new LineTrail(scene, planet4, 8);

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);


//render loop locked to 30fps
function animate() {
  requestAnimationFrame(animate);
  delta += clock.getDelta();
  if (delta > interval) {
    ////////////////////////////
    
    sun.applyGravity();
    sun.mesh.position.add(sun.velocity.clampLength(0, 1));

    planet.applyGravity();
    planet.mesh.position.add(planet.velocity.clampLength(0, 1));

    planet2.applyGravity();
    planet2.mesh.position.add(planet2.velocity.clampLength(0, 1));

    planet3.applyGravity();
    planet3.mesh.position.add(planet3.velocity.clampLength(0, 1));

    moon.applyGravity();
    moon.mesh.position.add(moon.velocity.clampLength(0, 1));

    planet4.applyGravity();
    planet4.mesh.position.add(planet4.velocity.clampLength(0, 1));
    
    planetLineTrail.updateLines();
    planet2LineTrail.updateLines();
    planet3LineTrail.updateLines();
    planet4LineTrail.updateLines();
    moonLineTrail.updateLines(true);

    if (isMouseDown) { /* empty */ 
      interaction.mesh.position.set(hitscan.x, hitscan.y, 0);
      interaction.size = Math.min(interaction.size + 0.03, 1) ;
      interaction.mesh.material.opacity = Math.min(interaction.mesh.material.opacity + 0.008, 1);
    } else {
      interaction.size = Math.max(interaction.size - 0.06, 0.002);
      interaction.mesh.material.opacity = Math.max(interaction.mesh.material.opacity - 0.008, 0.4)
    }
    console.log(interaction.size);

    controls.update();
    //////////////////////////////
    renderer.render(scene, camera);
    delta = delta % interval;
  }
}
animate();

function addStars(number) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const material = new THREE.PointsMaterial({size: 0.05});
  for (let i = 0; i < number; i++) {
    const MIN_DISTANCE = 21;
    let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

    while (Math.sqrt(x * x + y * y + z * z) < MIN_DISTANCE) {
      [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
    }
    vertices.push(x, y, z);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

var vec = new THREE.Vector3(); // create once and reuse
var hitscan = new THREE.Vector3(); // create once and reuse
let isMouseDown = false;
function onMouseDown() {
  isMouseDown = true;

  vec.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    - (event.clientY / window.innerHeight) * 2 + 1,
    0.5);

  vec.unproject(camera);

  vec.sub(camera.position).normalize();

  var distance = - camera.position.z / vec.z;

  hitscan.copy(camera.position).add(vec.multiplyScalar(distance));
  // Call a function or perform actions when the mouse click is down
  console.log('Mouse click down');
}

// Mouse up event handler
function onMouseUp() {
  isMouseDown = false;
  // Call a function or perform actions when the mouse click is up
  console.log('Mouse click up');
}
