import './style.css';
import * as THREE from 'three';
import { OrbitControls }  from 'three/examples/jsm/controls/OrbitControls';

// Set up scene
const scene = new THREE.Scene();

// Set up renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(30);

// temp controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set up helpers
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// add sun
const sun = createSun(15,0xffff00);
scene.add(sun.light, sun.mesh);

// add Mercury
const mercury = createPlanet(1, 0xA9A9A9);
scene.add(mercury);

//render loop
function animate() {
  requestAnimationFrame(animate);

  sun.mesh.rotation.x += 0.01

  orbit(mercury, 25, 0.0001);
  controls.update();

  renderer.render(scene, camera);
}
animate();


// helper methods

function orbit(object ,radius, speed) {
  const angle = Date.now() * speed;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  object.position.set(x,0,z);
}

function createSun(size, color) {
  // Create Sun
  const sunGeometry = new THREE.SphereGeometry(size, 32, 16);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  // Set up Sun Lighting
  const pointLight = new THREE.PointLight(0xffffff);
  return {mesh: sun, light: pointLight};
}

//create planet 
function createPlanet(size, color) {
  const mercuryGeometry = new THREE.SphereGeometry(size, 32, 16);
  const mercuryMaterial = new THREE.MeshStandardMaterial({ color: color});
  const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
  return mercury;
} 