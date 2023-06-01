import './style.css';
import * as THREE from 'three';
import { OrbitControls }  from 'three/examples/jsm/controls/OrbitControls';

// Set up scene
const scene = new THREE.Scene();
//const spaceTexture = new THREE.TextureLoader().load('/8k_stars_milky_way.jpg');
const space360Texture = new THREE.TextureLoader().load('/eso0932a.jpg');
space360Texture.colorSpace = THREE.SRGBColorSpace;
space360Texture.anisotropy = 4;
space360Texture.matrixAutoUpdate = true;

  

var backgroundSphere = new THREE.Mesh(
  new THREE.SphereGeometry(300, 64, 64),
  new THREE.MeshBasicMaterial({
    map: space360Texture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.8,
    color: 0x555555
  })
);
scene.add(backgroundSphere);

// Set up renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set up camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(30);
camera.position.setX(10);
camera.position.setY(10);

// temp controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set up helpers
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

// add stars

Array(1000).fill().forEach(addStar);

// add sun
const sun1 = createSun(14.5, 1, 0xdddd00);
const sun4 = createSun(14.6, 0.5, 0xeeee00);
const sun2 = createSun(14.8, 0.5, 0xaaaa00);
const sun3 = createSun(15, 0.5, 0xffee00);
scene.add( sun1,  sun2,  sun3,  sun4);

// add sunlight
const sunLight = new THREE.PointLight(0xffffff);
scene.add(sunLight);

const sizeFactor = 1;

// add Mercury
const mercury = createPlanet(0.75 * sizeFactor , "2k_mercury.jpg");
scene.add(mercury);

const venus = createPlanet(0.93 * sizeFactor, "2k_venus_surface.jpg");
scene.add(venus);

const earth = createPlanet(1 * sizeFactor, "2k_earth_daymap.jpg");
scene.add(earth);

const mars = createPlanet(0.83 * sizeFactor, "2k_mars.jpg");
scene.add(mars);

const jupiter = createPlanet(1.26 * sizeFactor, "2k_jupiter.jpg");
scene.add(jupiter);

const saturn = createPlanet(1.21 * sizeFactor, "2k_saturn.jpg");
scene.add(saturn);

const uranus = createPlanet(1.09 * sizeFactor, "2k_uranus.jpg");
scene.add(uranus);

const neptune = createPlanet(1.08 * sizeFactor, "2k_neptune.jpg");
scene.add(neptune);



//

//render loop
function animate() {
  requestAnimationFrame(animate);

  sun1.rotation.y -= 0.001
  sun2.rotation.z += 0.001
  sun3.rotation.x += 0.001
  sun4.rotation.z += 0.001
  sun4.rotation.y += 0.001

  const distanceFactor = 50;
  const sunRadius = 0;
  const speedFactor = 0.0001;

  orbit(mercury, sunRadius + (0.57 * distanceFactor), speedFactor / 0.62);
  orbit(venus, sunRadius + (0.77 * distanceFactor), speedFactor / 0.2);
  orbit(earth, sunRadius + (1 * distanceFactor), speedFactor / 1);
  orbit(mars, sunRadius + (1.27 * distanceFactor), speedFactor / 2.3);
  orbit(jupiter, sunRadius + (1.71 * distanceFactor), speedFactor / 3.82);
  orbit(saturn, sunRadius + (2.23 * distanceFactor), speedFactor / 4.80);
  orbit(uranus, sunRadius + (2.95 * distanceFactor), speedFactor / 6.9);
  orbit(neptune, sunRadius + (3.5 * distanceFactor), speedFactor / 6.9);

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

function createSun(size, opacity, color) {
  const sunTexture = new THREE.TextureLoader().load("/2k_sun.jpg");
  // Create Sun
  const sunGeometry = new THREE.SphereGeometry(size, 64, 64);
  const sunMaterial = new THREE.MeshBasicMaterial({ opacity: opacity, transparent: true, map: sunTexture, color: color });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  return sun;
}

//create planet 
function createPlanet(size, texture_url, ) {
  const texture = new THREE.TextureLoader().load(`/${texture_url}`);
  const geometry = new THREE.SphereGeometry(size, 64, 64);
  const material = new THREE.MeshStandardMaterial({ map: texture});
  const planet = new THREE.Mesh(geometry, material);
  return planet;
} 

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: THREE.MathUtils.randFloatSpread(0.5) + 0.5, transparent: true});
  const star = new THREE.Mesh(geometry, material);

  const MIN_DISTANCE = 200;
  let [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));

  while (Math.sqrt(x * x + y * y + z * z) < MIN_DISTANCE) {
    [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
  }


  
  

  star.position.set(x,y,z);
  scene.add(star);
}