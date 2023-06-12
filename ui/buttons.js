document.addEventListener('DOMContentLoaded', function () {
  const actionButtons = document.querySelectorAll('.action-button');

  for (let i = 0; i < actionButtons.length; i++) {
    actionButtons[i].addEventListener('click', function () {
      // Change the color of the clicked button and reset others
      for (let j = 0; j < actionButtons.length; j++) {
        if (j === i) {
          actionButtons[j].classList.remove('action-button');
          actionButtons[j].classList.add('selected-action-button');
        } else {
          actionButtons[j].classList.remove('selected-action-button');
          actionButtons[j].classList.add('action-button');
        }
      }
    });
  }
  // set the first element to already be selected
  actionButtons[0].click();

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
    });
  }
  // set the first element to already be selected
  navButtons[0].click();
});