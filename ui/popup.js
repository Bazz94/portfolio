import { SITES } from '../private.js';

const continueButton = document.getElementById("continueButton");
const xbtn = document.getElementById("x-btn");

continueButton.addEventListener('click', () => {
  goToLink();
});

xbtn.addEventListener('click', () => {
  closePopup();
});

const popup = document.getElementById("popup");
const body = document.querySelector('body');
let url;

function openPopup(_url) {
  url = _url
  popup.style.display = "block";
  body.style.overflow = "hidden";
}

function goToLink() {
  closePopup();
  if (url != null) {
    window.open(url);
  }
}

function closePopup() {
  body.style.overflow = "";
  popup.style.display = "none";
  body.classList.toggle('scroll-lock');
}

const toSiteButtons = document.getElementsByClassName('chip purple');
const popupMessageP = document.getElementById('popup-message');

const popupMessages = [
 // site 1
  `You will need to login to access the site. You can sign up with a fake email (just make sure it has the format of an email address).
  
  Since there may not be others users to chat to, you can pick 'AI is Dangerous' and 'For' to debateChatGPT for demo purposes`,
 // site 2
 `The community ranking page is available without logging in but to create your own list and affect the community ranking, you will need to create an account. 
 
 You can use a fake email (just make sure it has the format of an email address)`,
 // site 3
 `You will need to login to access the site. You can sign up with a fake email (just make sure it has the format of an email address). `,
];

for (let i = 0; i < toSiteButtons.length; i++) {
  toSiteButtons[i].addEventListener('click', () => { 
    popupMessageP.innerText = popupMessages[i];
    openPopup(SITES[i]);
  });
}


