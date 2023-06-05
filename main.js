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

// Set up renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
});
renderer.frustumCulling = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set up camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,-20);

// temp controls
const controls = new OrbitControls(camera, renderer.domElement);
//controls.enableZoom = false;
// controls.zoom0 = 10;
// controls.enableRotate = false;

// Set up helpers
const gridHelper = new THREE.GridHelper(200, 100);
gridHelper.rotateX(90 * (Math.PI / 180)); //grid is on z axis now
//scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.09);
scene.add(ambientLight);

addStars(300);

var sun = new Body(1, 0xffdb61, true);
scene.add(sun.mesh);
sun.velocity.add(new THREE.Vector3(0, 0, 0));

var planet = new Body(0.1, 0xcfcd87);
scene.add(planet.mesh);
planet.mesh.position.set(3, 0, 0);
planet.velocity.add(new THREE.Vector3(0, 0.2, 0));

var planet2 = new Body(0.15, 0xfa7f7b);
scene.add(planet2.mesh);
planet2.mesh.position.set(7, 0, 0);
planet2.velocity.add(new THREE.Vector3(0, -0.137, 0));

var planet3 = new Body(0.25, 0x35c9d1);
scene.add(planet3.mesh);
planet3.mesh.position.set(12, 0, 0);
planet3.velocity.add(new THREE.Vector3(0, 0.1049, 0));

var moon = new Body(0.03, 0xcccccc);
scene.add(moon.mesh);
moon.mesh.position.set(1.4, 0, 0);
moon.velocity.add(new THREE.Vector3(0.07, 0.25, 0.05));
planet3.mesh.add(moon.mesh);

var planet4 = new Body(0.4, 0xb6a1e2);
scene.add(planet4.mesh);
planet4.mesh.position.set(17, 0, 0);
planet4.velocity.add(new THREE.Vector3(0, 0.09, 0));

let world = [sun, planet, planet2, planet3];
sun.gravityArray = world;
planet.gravityArray = world;
planet2.gravityArray = world;
planet3.gravityArray = world;
moon.gravityArray = world;
planet4.gravityArray = world;

const planetLineTrail = new LineTrail(scene, planet);
const planet2LineTrail = new LineTrail(scene, planet2, 4);
const planet3LineTrail = new LineTrail(scene, planet3, 6);
const moonLineTrail = new LineTrail(scene, moon, 0.08);
const planet4LineTrail = new LineTrail(scene, planet4, 8);

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
    const MIN_DISTANCE = 20;
    let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(50));

    while (Math.sqrt(x * x + y * y + z * z) < MIN_DISTANCE) {
      [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(50));
    }
    vertices.push(x, y, z);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function particleTrail(obj, time = 1) {
  //const count = time;
  const vertices = [];
  vertices.push(0, 0, 0);
  const position = obj.mesh.position;
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({ size: 0.001 });
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const particle = new THREE.Points(geometry, material);
  particle.position.set(position.x, position.y, position.z);
  scene.add(particle);
  setTimeout(function () {
    scene.remove(particle);
    if (particle.material.map) {
      particle.material.map.dispose();
    }
  }, time * 1000);
} 



// Controls

// let deltaX;
// let deltaY;
// let tempx = 0;
// let tempy = 0;
// function onMouseMove(event) {
//   // Calculate normalized device coordinates
//   const mouse = new THREE.Vector2();
//   mouse.x = event.clientX;
//   mouse.y = event.clientY;
//   if (mouseDown) {
//     if (mouse.x > tempx) {
//       deltaX = -1;
//     } else {
//       deltaX = 1;
//     }
//     tempx = mouse.x;
//     if (mouse.y < tempy) {
//       deltaY = 1;
//     } else {
//       deltaY = -1;
//     }
//     tempy = mouse.y;
//   }
// }

// let mouseDown = false;
// function onMouseDown(event) {
//   mouseDown = true;
//   console.log(mouseDown);
// }
// function onMouseUp(event) {
//   mouseDown = false;
//   console.log(mouseDown);
// }

// let trip = 0;
// function onScroll(event) {
//   // Get the scroll wheel delta
//   const delta = event.deltaY;
//   console.log(trip);
//   // Do something with the scroll wheel delta
//   // For example, you can zoom the camera based on the scroll direction
//   if (delta < 0) {
//     // Zoom in
//     trip += 1;
//   } else {
//     // Zoom out
//     trip -= 1;
//   }
// }

