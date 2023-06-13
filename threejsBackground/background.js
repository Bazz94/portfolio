// Colors
// sun: #ffdb61
// mercury: #cfcd87
// venus: #fa7f7b
// earth: #35c9d1
// mars: #fb6247
// jupiter: #8a550f
// saturn: #d5d5c0
// uranus: #43cfe1
// neptune: #b6a1e2
// background: #0b1a3b

import * as THREE from 'three';
import { OrbitControls }  from 'three/examples/jsm/controls/OrbitControls';
import Body from './body.js';
import LineTrail from './effects.js';
import { DOMAIN } from './../private.js';


const isDesktopView = window.innerWidth > 600;
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
camera.up.set(0, -1, 0);
camera.position.set(0,0,-40); //-40
if (!isDesktopView) {
  camera.position.set(0,0,-54);
}
camera.lookAt(0,0,0);
//camera.position.y = 32;

// temp controls
//const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false;
// controls.zoom0 = 10;
// controls.enableRotate = false;


// Set up helpers
const gridHelper = new THREE.GridHelper(200, 100);
gridHelper.rotateX(90 * (Math.PI / 180)); //grid is on z axis now
// scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.04);
scene.add(ambientLight);

addStars(700);

let sun = new Body(scene, 2, 0xffdb61, true);
scene.add(sun.mesh);
sun.velocity.add(new THREE.Vector3(0, 0, 0));

let planet = new Body(scene, 0.1, 0xcfcd87);
scene.add(planet.mesh);
planet.mesh.position.set(3, 0, 0);
planet.velocity.add(new THREE.Vector3(0, 0.378, 0));

let planet2 = new Body(scene, 0.15, 0xfa7f7b);
scene.add(planet2.mesh);
planet2.mesh.position.set(7, 0, 0);
planet2.velocity.add(new THREE.Vector3(0, -0.243, 0));

let planet3 = new Body(scene, 0.25, 0x35c9d1);
scene.add(planet3.mesh);
planet3.mesh.position.set(-13, 0, 0);
planet3.velocity.add(new THREE.Vector3(0, -0.182, 0));

let moon = new Body(scene, 0.03, 0xcccccc);
scene.add(moon.mesh);
moon.mesh.position.set(-13.7, 0, 0);
moon.velocity.add(new THREE.Vector3(-0.02, -0.275, 0.00));

let planet4 = new Body(scene, 0.31, 0xb6a1e2);
scene.add(planet4.mesh);
planet4.mesh.position.set(24, 0, 0);
planet4.velocity.add(new THREE.Vector3(0, 0.135, 0));

let moon2 = new Body(scene, 0.031, 0xcccccc);
scene.add(moon2.mesh);
moon2.mesh.position.set(25, 0, 0);
moon2.velocity.add(new THREE.Vector3(0, 0.23, 0.00));

let planet5 = new Body(scene, 0.26, 0xfb6247);
scene.add(planet5.mesh);
planet5.mesh.position.set(-36, 0, 0);
planet5.velocity.add(new THREE.Vector3(0, -0.112, 0));

let interaction = new Body(scene,0.5, 0x101010, false, true);
scene.add(interaction.mesh);
interaction.mesh.material.transparent = true;
interaction.mesh.material.opacity = 0.4;
interaction.mesh.position.set(0,0,0);

let world = [sun, planet, planet2, planet3, moon, planet4, moon2, interaction, planet5];
sun.gravityArray = world;
planet.gravityArray = world;
planet2.gravityArray = world;
planet3.gravityArray = world;
moon.gravityArray = world;
planet4.gravityArray = world;
moon2.gravityArray = world;
planet5.gravityArray = world;


const planetLineTrail = new LineTrail(scene, planet);
planet.lineTrail = planetLineTrail;
const planet2LineTrail = new LineTrail(scene, planet2, 4);
planet2.lineTrail = planet2LineTrail
const planet3LineTrail = new LineTrail(scene, planet3, 6);
planet3.lineTrail = planet3LineTrail
const moonLineTrail = new LineTrail(scene, moon, 0.4);
moon.lineTrail = moonLineTrail
const planet4LineTrail = new LineTrail(scene, planet4, 8);
planet4.lineTrail = planet4LineTrail
const moon2LineTrail = new LineTrail(scene, moon2, 0.4);
moon2.lineTrail = moon2LineTrail
const planet5LineTrail = new LineTrail(scene, planet5, 12);
planet5.lineTrail = planet5LineTrail

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('mousemove', handleMouseMove);
window.addEventListener('resize', onResize);
let actionSwitch = document.getElementById('action-switch');
let disableButton = document.getElementById('disabled');
let spawnPlanetButton = document.getElementById('spawnPlanet');
let gravityWellButton = document.getElementById('gravityWell');

const Actions = {
  NONE: 'none',
  GRAVITYWELL: 'gravityWell',
  CREATEPLANET: 'createPlanet',
} 
let action = Actions.NONE;

let mouseStart, mouseEnd, mouseTravel, mouseTravelDistance;
let newPlanet;
let newPlanetTrailLines;
let newPlanetVelocity;
let checked = localStorage.getItem('pMode');
if (checked === undefined) {
  localStorage.setItem('pMode', false);
  actionSwitch.checked = false;
  checked = false;
} else {
  actionSwitch.checked = checked === 'true' ? true : false;
}
if (!isDesktopView) {
  actionSwitch.checked = true;
}
renderer.render(scene, camera);
//render loop locked to 30fps
function animate() {
  requestAnimationFrame(animate);
  if (actionSwitch.checked) {
    if (checked != true) {
      checked = true;
      localStorage.setItem('pMode', true);
    } 
  } else {
    if (checked != false) {
      checked = false;
      localStorage.setItem('pMode', false);
    } 
  }
  if (actionSwitch.checked === true) {
    return false;
  }
  delta += clock.getDelta();
  if (delta > interval) {
    /////////////////////////////////////////////////////////////////////
    

    sun.applyGravity();
    sun.mesh.position.add(sun.velocity.clampLength(0, 1));
    planetLineTrail.updateLines();
    planet.applyGravity();
    planet.mesh.position.add(planet.velocity.clampLength(0, 1));
    planet2LineTrail.updateLines();
    planet2.applyGravity();
    planet2.mesh.position.add(planet2.velocity.clampLength(0, 1));
    planet3LineTrail.updateLines();
    planet3.applyGravity();
    planet3.mesh.position.add(planet3.velocity.clampLength(0, 1));
    moonLineTrail.updateLines();
    moon.applyGravity();
    moon.mesh.position.add(moon.velocity.clampLength(0, 1));
    planet4LineTrail.updateLines();
    planet4.applyGravity();
    planet4.mesh.position.add(planet4.velocity.clampLength(0, 1));
    moon2LineTrail.updateLines();
    moon2.applyGravity();
    moon2.mesh.position.add(moon2.velocity.clampLength(0, 1));
    planet5LineTrail.updateLines();
    planet5.applyGravity();
    planet5.mesh.position.add(planet5.velocity.clampLength(0, 1));
    
    if (disableButton.className === 'selected-action-button') {
      action = Actions.NONE;
    }
    if (spawnPlanetButton.className === 'selected-action-button') {
      action = Actions.CREATEPLANET;
    }
    if (gravityWellButton.className === 'selected-action-button') {
      action = Actions.GRAVITYWELL;
    }

    //console.log(action);
    if (action === Actions.GRAVITYWELL) {
      if (isMouseDown) { /* empty */ 
        interaction.mesh.position.set(hitscan.x, hitscan.y, 0);
        interaction.size = Math.min(interaction.size + 0.03, 1) ;
        interaction.mesh.material.opacity = Math.min(interaction.mesh.material.opacity + 0.01, 1);
      } else {
        interaction.size = Math.max(interaction.size - 0.06, 0.002);
        interaction.mesh.material.opacity = Math.max(interaction.mesh.material.opacity - 0.02, 0.1)
      }
    }
    if (action == Actions.CREATEPLANET) {
      if (isMouseDown) {
        if (!newPlanet) {
          mouseStart = hitscan.clone();
          newPlanet = new Body(scene, 0.20, 0xf0ba81);
          scene.add(newPlanet.mesh);
          newPlanet.mesh.position.set(hitscan.x, hitscan.y, 0);
          newPlanetTrailLines = new LineTrail(scene, newPlanet, 4);
          newPlanet.lineTrail = newPlanetTrailLines;
          world = [...world, newPlanet];
          newPlanet.gravityArray = world;
          // update other bodies
          sun.gravityArray = world;
          planet.gravityArray = world;
          planet2.gravityArray = world;
          planet3.gravityArray = world;
          moon.gravityArray = world;
          planet4.gravityArray = world;
          moon2.gravityArray = world;
        }
        mouseTravel = hitscan.clone();
        const distanceVector = new THREE.Vector3();
        distanceVector.subVectors(mouseTravel, mouseStart);
        const distance = distanceVector.length();
        mouseTravelDistance = distance;

      } else {
        if (newPlanet) {
          if (mouseStart != hitscan) {
            if (!newPlanetVelocity) {
              mouseEnd = hitscan.clone();
              newPlanetVelocity = new THREE.Vector3();
              newPlanetVelocity.subVectors(mouseEnd, mouseStart);
              newPlanetVelocity.normalize();
              const distanceMouseVector = new THREE.Vector3();
              distanceMouseVector.subVectors(mouseEnd, mouseStart);
              const distanceMouse = distanceMouseVector.length();
              const distanceVector = new THREE.Vector3();
              distanceVector.subVectors(sun.mesh.position, newPlanet.mesh.position);
              const distance = distanceVector.length();
              newPlanetVelocity.multiplyScalar(distanceMouse / Math.sqrt(distance));
              newPlanetVelocity.divideScalar(10);
              newPlanetVelocity.clampLength(0, 0.3)
              newPlanet.velocity.add(newPlanetVelocity);
            }
          }
        }
      }
    }
    if (newPlanetVelocity) {
      newPlanet.applyGravity();
      newPlanet.mesh.position.add(newPlanet.velocity.clampLength(0, 1));
      newPlanetTrailLines.updateLines();
    }
    mouseActionLabel(action, isMouseDown);
    camera.position.y = getCameraY();
    //controls.update();

    /////////////////////////////////////////////////////////////////////
    renderer.render(scene, camera);
    delta = delta % interval;
  }
}
animate();


function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

function addStars(number) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const material = new THREE.PointsMaterial({size: 0.05});
  for (let i = 0; i < number; i++) {
    const MIN_DISTANCE = 21;
    let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));

    while (Math.sqrt(x * x + y * y + z * z) < MIN_DISTANCE) {
      [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));
    }
    vertices.push(x, y, z);
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
}


let isMouseDown = false;
function onMouseDown() {
  isMouseDown = true;
  //console.log('Mouse click down');
}

// Mouse up event handler
function onMouseUp() {
  isMouseDown = false;
  //console.log('Mouse click up');
}

function getCameraY() {
  // top is 0, bottom is -2852 (2 pages)
  const scrollDistance = 96; // y from 0 to 32
  const scrollPosition = document.body.getBoundingClientRect().top;
  const maxScrollPosition = -2853;
  let y;
  y = scrollPosition * -1;
  y = scrollPosition / maxScrollPosition * scrollDistance;
  //console.log(y, scrollPosition);
  return y;
}

let vec = new THREE.Vector3(); // create once and reuse
let hitscan = new THREE.Vector3(); // create once and reuse
let mouse = {x: 0, y: 0};
function handleMouseMove(event) {
  // Get the mouse position relative to the element
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  vec.set(
    (mouse.x / window.innerWidth) * 2 - 1,
    - (mouse.y / window.innerHeight) * 2 + 1,
    0.5);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  let distance = - camera.position.z / vec.z;
  hitscan.copy(camera.position).add(vec.multiplyScalar(distance));
}

let pos = false; // set mouse position when mouse down
let firedOnce = null;  // makes sure create planet label only appears once
let actionLabel = document.getElementById('actionLabel');
function mouseActionLabel(action, mouseDown) {

  if (action === Actions.GRAVITYWELL) {
    if (interaction.size > 0.002) {
      actionLabel.style.opacity = '1';
      pos = mouse;
      if (mouseDown) {
        actionLabel.style.left = (pos.x - 20) + 'px';
        actionLabel.style.top = (pos.y - 50) + 'px';
      }
      if (planetLineTrail.count % 2) {
        actionLabel.innerText = 'Gravity ' + (interaction.size * 10).toFixed(2);
      }
    } else {
      actionLabel.style.opacity = '0';
    }
  } 

  if (action === Actions.CREATEPLANET) {
    if (mouseDown) {
      if (firedOnce === null) {
        firedOnce = false;
      }
      if (firedOnce === false) {
        actionLabel.style.opacity = '1';
        if (!pos) {
          pos = mouse;
          actionLabel.style.left = (pos.x - 20) + 'px';
          actionLabel.style.top = (pos.y - 50) + 'px';
        }
        if (newPlanet) {
          if (planetLineTrail.count % 2) {
            actionLabel.innerText = 'Velocity ' + (mouseTravelDistance).toFixed(2);
          }
        }
      }
    } else {
      if (firedOnce === false) {
        firedOnce = true;
      }
      pos = null;
      actionLabel.style.opacity = '0';
    }
  }
}