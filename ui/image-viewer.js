
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

prevButton.addEventListener('click', function () {
  showSlides(slideIndex += -1);
});

nextButton.addEventListener('click', function () {
  showSlides(slideIndex += 1);
});

let slides1 = document.getElementsByClassName("mySlides 1");
let slides2 = document.getElementsByClassName("mySlides 2");
let slides3 = document.getElementsByClassName("mySlides 3");
let slideIndex = 1;
showSlides(slideIndex, slides1);
showSlides(slideIndex, slides2);
showSlides(slideIndex, slides3);

function showSlides(n, slides) {
  let i;
  
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}
