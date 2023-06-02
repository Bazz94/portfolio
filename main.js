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
import Body from './body.js' 

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
camera.position.set(0,0,-10);

// temp controls
const controls = new OrbitControls(camera, renderer.domElement);
//controls.enableZoom = false;
// controls.zoom0 = 10;
// controls.enableRotate = false;

// Set up helpers
const gridHelper = new THREE.GridHelper(200, 100);
gridHelper.rotateX(90 * (Math.PI / 180)); //grid is on z axis now
scene.add(gridHelper);

  var sun = new Body(0.5);
  var planet = new Body(0.2);
  scene.add(sun.mesh, planet.mesh);
  planet.mesh.position.set(4, 0, 0);
  let world = [sun, planet];
  sun.gravityArray = world;
  planet.gravityArray = world;
  sun.velocity.add(new THREE.Vector3(0, 0, 0));
  planet.velocity.add(new THREE.Vector3(0, 0.05, 0));

//render loop
function animate() {
  requestAnimationFrame(animate);
  delta += clock.getDelta();
  if (delta > interval) {
    ////////////////////////////
    
    sun.applyGravity();
    planet.applyGravity();
    sun.mesh.position.add(sun.velocity.clampLength(0, 1));
    planet.mesh.position.add(planet.velocity.clampLength(0, 1));
    
    controls.update();
    //////////////////////////////
    renderer.render(scene, camera);
    delta = delta % interval;
  }
}
animate();

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
//     //console.log(deltaY);
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

