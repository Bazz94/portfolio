import { Actions } from './handleActions.js';

let pos = false; // set mouse position when mouse down
let firedOnce = null;  // makes sure create planet label only appears once
let actionLabel = document.getElementById('actionLabel');

function mouseActionLabel(mouse, isMouseDown, action, mousePosInvalid, interaction,
  newPlanet, mouseTravelDistance
) {
  if (action === Actions.GRAVITYWELL && !mousePosInvalid) {
    if (interaction.size > 0.1) {
      actionLabel.style.opacity = '1';
      pos = mouse;
      if (isMouseDown) {
        actionLabel.style.left = (pos.x - 20) + 'px';
        actionLabel.style.top = (pos.y - 50) + 'px';
      }
      actionLabel.innerText = 'Gravity ' + (interaction.size * 10).toFixed(2);
    } else {
      actionLabel.style.opacity = '0';
    }
  }

  if (action === Actions.CREATEPLANET && !mousePosInvalid) {
    if (isMouseDown) {
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
          actionLabel.innerText = 'Velocity ' + (mouseTravelDistance).toFixed(2);
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

let actionSwitch = document.getElementById('action-switch');
let checked;
let isLocalStorageAvailable = checkLocalStorageAvailability();
if (isLocalStorageAvailable) {
  checked = localStorage.getItem('pMode') === 'true' ? true : false;
  actionSwitch.checked = checked;
} else {
  checked = false;
  actionSwitch.checked = false;
}
function updatePerformanceSwitch() {
  if (actionSwitch.checked) {
    if (checked === false) {
      checked = true;
      if (isLocalStorageAvailable) {
        localStorage.setItem('pMode', true);
      }
    }
    return checked;
  }
  if (checked === true) {
    checked = false;
    if (isLocalStorageAvailable) {
      localStorage.setItem('pMode', false);
    }
  }
  return checked;
}

function checkLocalStorageAvailability() {
  try {
    var testKey = 'test';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export { Actions, mouseActionLabel, updatePerformanceSwitch }