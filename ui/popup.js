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
  window.open(url);

}

function closePopup() {
  body.style.overflow = "";
  popup.style.display = "none";
  body.classList.toggle('scroll-lock');
}

