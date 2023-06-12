let buttonColor = '#fff';
let buttonScale = 'scale(1)';
let buttonHoverColor = '#ff0';
let buttonHoverScale = 'scale(1.03)';

document.addEventListener('DOMContentLoaded', function () {
  // Actions
  let noneButton = document.getElementById('none-btn');
  noneButton.addEventListener('click', () => {
    changeButtonAfterClick(noneButton);
  });

  let spawnPlanetButton = document.getElementById('spawnPlanet-btn');
  spawnPlanetButton.addEventListener('click', () => {
    changeButtonAfterClick(spawnPlanetButton);
  });

  let gravityWellButton = document.getElementById('gravityWell-btn');
  gravityWellButton.addEventListener('click', () => {
    changeButtonAfterClick(gravityWellButton);
  });

  //Pages
  let homeButton = document.getElementById('home-btn');
  homeButton.addEventListener('click', () => {
    changeButtonAfterClick(homeButton);
  });

  let project1Button = document.getElementById('project1-btn');
  project1Button.addEventListener('click', () => {
    changeButtonAfterClick(project1Button);
  });

  let project2Button = document.getElementById('project2-btn');
  project2Button.addEventListener('click', () => {
    changeButtonAfterClick(project2Button);
  });

  let project3Button = document.getElementById('project3-btn');
  project3Button.addEventListener('click', () => {
    changeButtonAfterClick(project3Button);
  });

  const actionButtons = [noneButton, spawnPlanetButton, gravityWellButton];
  const nagButtons = [homeButton, project1Button, project2Button, project3Button];
  function changeButtonAfterClick(button) {
    button.style.color = buttonHoverColor;
    button.style.transform = buttonHoverScale;
    
    if (actionButtons.find(i => i === button) != null) {
      actionButtons.forEach((item) => {
        if (item !== button) {
          item.style.color = buttonColor;
          item.style.transform = buttonScale;
         }
      });
    }

    if (nagButtons.find(i => i === button) != null) {
      nagButtons.forEach((item) => {
        console.log(item !== button);
        if (item !== button) {
          item.style.color = buttonColor;
          item.style.transform = buttonScale;
        }
      });
    }
  }
});
