import * as THREE from 'three';

function handleUpdateMousePosInvalid(callback) {
  let switchContainer = document.getElementById('performance-switch-container');
  let projectList = document.getElementById('project-list');
  let actionList = document.getElementById('action-list');

  projectList.addEventListener('mouseover', onMouseOver);
  actionList.addEventListener('mouseover', onMouseOver);
  switchContainer.addEventListener('mouseover', onMouseOver);

  projectList.addEventListener('mouseout', onMouseOut);
  actionList.addEventListener('mouseout', onMouseOut);
  switchContainer.addEventListener('mouseout', onMouseOut);

  function onMouseOver() {
    callback(true);
  }
  function onMouseOut() {
    callback(false);
  }
}

function handleIsMouseDown(callback) {
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mouseup', onMouseUp, false);

  function onMouseDown() {
    callback(true);
  }
  function onMouseUp() {
    callback(false);
  }
}

function handleOnResize(renderer, scene, camera) {
  window.addEventListener('resize', onResize);
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
}

function getCameraY() {
  // top is 0, bottom is -2852 (2 pages)
  const scrollDistance = 96; // y from 0 to 32
  const scrollPosition = document.body.getBoundingClientRect().top;
  const maxScrollPosition = -2853;
  let y;
  y = scrollPosition * -1;
  y = scrollPosition / maxScrollPosition * scrollDistance;
  return y;
}

function handleUpdateHitscan(camera, callback) {
  document.addEventListener('mousemove', handleMouseMove);
  let vec = new THREE.Vector3();
  let hitscan = new THREE.Vector3();
  let mouse = { x: 0, y: 0 };
  function handleMouseMove(event) {
    // Get the mouse position relative to the element
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    vec.set(
      (mouse.x / window.innerWidth) * 2 - 1,
      - (mouse.y / window.innerHeight) * 2 + 1, 0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    let distance = - camera.position.z / vec.z;
    hitscan.copy(camera.position).add(vec.multiplyScalar(distance));
    callback(hitscan, mouse);
  }
}

export { handleUpdateMousePosInvalid, handleOnResize, getCameraY, handleIsMouseDown, handleUpdateHitscan };