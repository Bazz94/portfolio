import * as THREE from 'three';
import { handleUpdateMousePosInvalid, handleIsMouseDown } from './events.js';
import { mouseActionLabel } from './handleUI.js';

const Actions = {
  NONE: 'none',
  GRAVITYWELL: 'gravityWell',
  CREATEPLANET: 'createPlanet',
} 

const disableButton = document.getElementById('disabled');
const spawnPlanetButton = document.getElementById('spawnPlanet');
const gravityWellButton = document.getElementById('gravityWell');
const actionHints = document.getElementById('action-hints');

let hasSpawned = false;
let hasSpawnedAndBeenReleased = false;
let mouseStart, mouseEnd, mouseTravel, mouseTravelDistance, newPlanetVelocity;
let action = Actions.NONE;
function handleActions( hitscan, mouse, sun, gravityWell, newPlanet){
  if (disableButton.className === 'selected-action-button') {
    action = Actions.NONE;
  }
  if (spawnPlanetButton.className === 'selected-action-button') {
    action = Actions.CREATEPLANET;
    actionHints.innerText = 'Hint: Click and drag.';
    if (newPlanet) {
      actionHints.innerText = 'Hint: Refresh the page';
    }
  }
  if (gravityWellButton.className === 'selected-action-button') {
    action = Actions.GRAVITYWELL;
    actionHints.innerText = 'Hint: Click and hold';
  }

  if (action === Actions.GRAVITYWELL && !mousePosInvalid) {
    if (isMouseDown) { /* empty */
      gravityWell.mesh.position.set(hitscan.x, hitscan.y, 0);
      gravityWell.size = Math.min(gravityWell.size + 0.03, 1);
      gravityWell.mesh.material.opacity = Math.min(gravityWell.mesh.material.opacity + 0.01, 1);
    } else {
      gravityWell.size = Math.max(gravityWell.size - 0.06, 0.002);
      gravityWell.mesh.material.opacity = Math.max(gravityWell.mesh.material.opacity - 0.02, 0.1)
    }
  }
  if (action == Actions.CREATEPLANET && !mousePosInvalid) {
    if (isMouseDown) {
      if (!hasSpawned) {
        hasSpawned = true;
        mouseStart = hitscan.clone();
        newPlanet.mesh.position.copy(hitscan.clone());
      }
      if (hasSpawnedAndBeenReleased === false) {
        mouseTravel = hitscan.clone();
        const distanceVector = new THREE.Vector3();
        distanceVector.subVectors(mouseTravel, mouseStart);
        const distance = distanceVector.length();
        mouseTravelDistance = distance;
      }
    } else {
      if (hasSpawned) {
        if (mouseStart != hitscan) {
          if (hasSpawnedAndBeenReleased === false) {
            newPlanet.disabled = false;
            hasSpawnedAndBeenReleased = true; 
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
            newPlanetVelocity.clampLength(0, 0.3);
            newPlanet.velocity.add(newPlanetVelocity);
          }
        }
      }
    }
  }
  
  mouseActionLabel(mouse, isMouseDown, action, mousePosInvalid, gravityWell,
    newPlanet, mouseTravelDistance);
}
export { handleActions, Actions };


let isMouseDown = false;
function updateIsMouseDown(updatedValue) {
  isMouseDown = updatedValue;
}
handleIsMouseDown(updateIsMouseDown);


let mousePosInvalid = false;
function updateMousePosInvalid(updatedValue) {
  mousePosInvalid = updatedValue;
}
handleUpdateMousePosInvalid(updateMousePosInvalid);