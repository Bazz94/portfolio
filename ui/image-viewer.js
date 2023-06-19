const prevButtons = document.getElementsByClassName("prev");
const nextButtons = document.getElementsByClassName("next");

const slidesIndex = [0,0,0];

const slides = [document.getElementsByClassName("mySlides 1"),
document.getElementsByClassName("mySlides 2"),
document.getElementsByClassName("mySlides 3")
];

for (let i = 0; i < prevButtons.length; i++) {
  prevButtons[i].addEventListener('click', () => {
    let newIndex = slidesIndex[i] - 1;
    newIndex = newIndex % slides[i].length;
    newIndex = Math.abs(newIndex);
    slidesIndex[i] = newIndex;
    showSlides(newIndex, slides[i]);
  });
}

for (let i = 0; i < nextButtons.length; i++) {
  nextButtons[i].addEventListener('click', () => {
    let newIndex = slidesIndex[i] + 1;
    newIndex = newIndex % slides[i].length;
    slidesIndex[i] = newIndex;
    showSlides(newIndex, slides[i]);
  });
}

for (let i = 0; i < slides.length; i++) {
  showSlides(slidesIndex[i], slides[i]);
}

function showSlides(n, slides) {
  let i;
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[n].style.display = "block";
}
