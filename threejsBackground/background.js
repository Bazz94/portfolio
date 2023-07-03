import * as THREE from 'three';
import { GravitationalBody, makeStars } from './GravitationalBody.js';
import LineTrail from './effects.js';
import { handleOnResize, getCameraY, handleUpdateHitscan } from './events.js';
import { updatePerformanceSwitch } from './handleUI.js';
import { handleActions } from './handleActions.js';


const isDesktopView = window.innerWidth > 600;

// these vars are used to lock the animationg loop to 30fps
let clock = new THREE.Clock();
let delta = 0;
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
camera.up.set(0, -1, 0);
camera.position.set(0,0,-40); 
if (!isDesktopView) {
  camera.position.set(0,0,-54);
}
camera.lookAt(0,0,0);

// set up a dim ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.04);
scene.add(ambientLight);

// add stars
scene.add(makeStars(700));


// Create planets and set initial values
let sun = new GravitationalBody(scene, 2, 0xffdb61, true);
scene.add(sun.mesh);
sun.velocity.add(new THREE.Vector3(0, 0, 0));

let planet = new GravitationalBody(scene, 0.1, 0xcfcd87);
scene.add(planet.mesh);
planet.mesh.position.set(3, 0, 0);
planet.velocity.add(new THREE.Vector3(0, 0.378, 0));

let planet2 = new GravitationalBody(scene, 0.15, 0xfa7f7b);
scene.add(planet2.mesh);
planet2.mesh.position.set(7, 0, 0);
planet2.velocity.add(new THREE.Vector3(0, -0.243, 0));

let planet3 = new GravitationalBody(scene, 0.25, 0x35c9d1);
scene.add(planet3.mesh);
planet3.mesh.position.set(-13, 0, 0);
planet3.velocity.add(new THREE.Vector3(0, -0.182, 0));

let moon = new GravitationalBody(scene, 0.03, 0xcccccc);
scene.add(moon.mesh);
moon.mesh.position.set(-13.7, 0, 0);
moon.velocity.add(new THREE.Vector3(-0.015, -0.27, 0.00));

let planet4 = new GravitationalBody(scene, 0.31, 0xb6a1e2);
scene.add(planet4.mesh);
planet4.mesh.position.set(24, 0, 0);
planet4.velocity.add(new THREE.Vector3(0, 0.135, 0));

let moon2 = new GravitationalBody(scene, 0.031, 0xcccccc);
scene.add(moon2.mesh);
moon2.mesh.position.set(25, 0, 0);
moon2.velocity.add(new THREE.Vector3(0, 0.23, 0.00));

let planet5 = new GravitationalBody(scene, 0.26, 0xfb6247);
scene.add(planet5.mesh);
planet5.mesh.position.set(-36, 0, 0);
planet5.velocity.add(new THREE.Vector3(0, -0.112, 0));


let gravityWell = new GravitationalBody(scene, 0.5, 0x101010, false, true);
scene.add(gravityWell.mesh);
gravityWell.mesh.material.transparent = true;
gravityWell.mesh.material.opacity = 0.4;
gravityWell.mesh.position.set(0,0,0);

// the spawnable planet 
let newPlanet = new GravitationalBody(scene, 0.20, 0xf0ba81, false, false, true);
scene.add(newPlanet.mesh);
newPlanet.mesh.position.set(0, 0, 0);

// set the world array used when calculating each gravitational bodies gravity
let world = [sun, planet, planet2, planet3, moon, planet4, moon2, gravityWell, planet5, newPlanet];
sun.gravityArray = world;
planet.gravityArray = world;
planet2.gravityArray = world;
planet3.gravityArray = world;
moon.gravityArray = world;
planet4.gravityArray = world;
moon2.gravityArray = world;
planet5.gravityArray = world;
newPlanet.gravityArray = world;


// Creates particle lines that follow the planets
planet.lineTrail = new LineTrail(scene, planet);
planet2.lineTrail = new LineTrail(scene, planet2, 4);
planet3.lineTrail = new LineTrail(scene, planet3, 6);
moon.lineTrail = new LineTrail(scene, moon, 0.4);
planet4.lineTrail = new LineTrail(scene, planet4, 8);
moon2.lineTrail = new LineTrail(scene, moon2, 0.4);
planet5.lineTrail = new LineTrail(scene, planet5, 12);
newPlanet.lineTrail = new LineTrail(scene, newPlanet, 4);

// A single render for incase the animation loop has been turned off
renderer.render(scene, camera);

// Animation loop locked to 30fps
function animate() {
  requestAnimationFrame(animate);
  delta += clock.getDelta();
  if (delta > interval) {
    // Animation loop start

    // Get the Performance Mode value and pause loop if true
    const performanceSwitch = updatePerformanceSwitch();
    if (performanceSwitch === true) {
      camera.position.y = getCameraY();
      renderer.render(scene, camera);
      delta = delta % interval;
      return false;
    }

    // Apply gravity effects to the velocities of the planets
    sun.applyGravity();
    sun.mesh.position.add(sun.velocity.clampLength(0, 1));
    planet.lineTrail.updateLines();
    planet.applyGravity();
    planet.mesh.position.add(planet.velocity.clampLength(0, 1));
    planet2.lineTrail.updateLines();
    planet2.applyGravity();
    planet2.mesh.position.add(planet2.velocity.clampLength(0, 1));
    planet3.lineTrail.updateLines();
    planet3.applyGravity();
    planet3.mesh.position.add(planet3.velocity.clampLength(0, 1));
    moon.lineTrail.updateLines();
    moon.applyGravity();
    moon.mesh.position.add(moon.velocity.clampLength(0, 1));
    planet4.lineTrail.updateLines();
    planet4.applyGravity();
    planet4.mesh.position.add(planet4.velocity.clampLength(0, 1));
    moon2.lineTrail.updateLines();
    moon2.applyGravity();
    moon2.mesh.position.add(moon2.velocity.clampLength(0, 1));
    planet5.lineTrail.updateLines();
    planet5.applyGravity();
    planet5.mesh.position.add(planet5.velocity.clampLength(0, 1));
    
    // Handles Planet Spawn and GravityWell actions
    handleActions(hitscan, mouse, sun, gravityWell, newPlanet);
    
    // Apply gravity effects for the spawnable planet
    newPlanet.applyGravity();
    newPlanet.mesh.position.add(newPlanet.velocity.clampLength(0, 1));
    newPlanet.lineTrail.updateLines();

    // set scene camera depending on scroll position
    camera.position.y = getCameraY();

    // Animation loop end
    renderer.render(scene, camera);
    delta = delta % interval;
  }
}
animate();

// Resizes renderer when the view window changes
handleOnResize(renderer, scene, camera);

// Get hitscan value, used in handleActions
let hitscan = new THREE.Vector3();
let mouse = { x: 0, y: 0 };
function updateHitscan(updatedHitscan, updatedMouse) {
  hitscan = updatedHitscan.clone();
  mouse = updatedMouse;
}
handleUpdateHitscan(camera, updateHitscan);