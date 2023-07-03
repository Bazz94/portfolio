
const actionButtons = document.querySelectorAll('.action-button');
const textRed1 = document.getElementById('delay1');
const textRed2 = document.getElementById('delay2');
const textRed3 = document.getElementById('delay3');
const homeMiddleSection = document.getElementById('home-middle');
const actionHints = document.getElementById('action-hints');
let actionSwitch = document.getElementById('action-switch');
let isLocalStorageAvailable = checkLocalStorageAvailability();
const actionSide = document.getElementById('actions-side');

let pMode;
if (isLocalStorageAvailable) {
  pMode = localStorage.getItem('pMode');
  if (pMode != null){
    if (pMode === 'true') {
      actionSide.style.visibility = 'hidden';
    } else {
      actionSide.style.visibility = '';
    }
  }
} 

actionSwitch.addEventListener('click', () => {
  actionButtons[0].click();
  if (actionSwitch.checked){
    actionSide.style.visibility = 'hidden';
  } else {
    actionSide.style.visibility = '';
  }
});

setTimeout(() => {
  textRed2.classList.add('red');
}, 100);
setTimeout(() => {
  textRed1.classList.add('red');
}, 200);
setTimeout(() => {
  textRed3.classList.add('red');
}, 300);

for (let i = 0; i < actionButtons.length; i++) {
  actionButtons[i].addEventListener('click', function () {
    // Change the color of the clicked button and reset others
    if (!actionSwitch.checked) {
      for (let j = 0; j < actionButtons.length; j++) {
        if (j === i) {
          actionButtons[j].classList.remove('action-button');
          actionButtons[j].classList.add('selected-action-button');
          if (isLocalStorageAvailable) {
            localStorage.setItem('action', j);
          }
        } else {
          actionButtons[j].classList.remove('selected-action-button');
          actionButtons[j].classList.add('action-button');
        }
      }
      if (i > 0) {
        homeMiddleSection.style.visibility = 'hidden';
        actionHints.style.visibility = '';
      } else {
        homeMiddleSection.style.visibility = '';
        actionHints.style.visibility = 'hidden';
      }
    }
  });
}
// set the first element to already be selected
setTimeout(() => {
  let action = null;
  if (isLocalStorageAvailable) {
    action = localStorage.getItem('action');
  } 
  if (action != null) {
    actionButtons[action].click();
  } else {
    actionButtons[0].click();
  }
}, 100);

const navButtons = document.querySelectorAll('.nav-button');

for (let i = 0; i < navButtons.length; i++) {
  navButtons[i].addEventListener('click', function () {
    // Change the color of the clicked button and reset others
    for (let j = 0; j < navButtons.length; j++) {
      if (j === i) {
        navButtons[j].classList.remove('nav-button');
        navButtons[j].classList.add('selected-nav-button');
      } else {
        navButtons[j].classList.remove('selected-nav-button');
        navButtons[j].classList.add('nav-button');
      }
    }
    if (i != 0) {
      const id = 'project' + i;
      const targetSection = document.getElementById(id);
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

}
// set the first element to already be selected
setTimeout(() => {
  navButtons[0].click();
}, 700);

window.addEventListener('scroll', () => {
  if (window.scrollY < 400) {
    for (let i = 0; i < navButtons.length; i++) {
      if( i === 0) {
        navButtons[i].classList.remove('nav-button');
        navButtons[i].classList.add('selected-nav-button');
      } else {
        navButtons[i].classList.remove('selected-nav-button');
        navButtons[i].classList.add('nav-button');
      }
    }
  } else {
    for (let i = 0; i < navButtons.length; i++) {
      if (i === 1) {
        navButtons[i].classList.remove('nav-button');
        navButtons[i].classList.add('selected-nav-button');
      } else {
        navButtons[i].classList.remove('selected-nav-button');
        navButtons[i].classList.add('nav-button');
      }
    }
    // Disable actions
    actionButtons[0].click();
  }
});

const backToTopButton = document.getElementById('backToTopButton');

backToTopButton.addEventListener('click', () => {
  const targetSection = document.getElementById('performance-switch-container');
  targetSection.scrollIntoView({ behavior: 'smooth' });
});


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
