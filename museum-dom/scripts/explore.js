const sliderButton = document.querySelector('.section-explore-slider');
const beforeImgElem = document.querySelector('.explore-before-image');
const sliderContainer = document.querySelector('.explore-before-after');

let buttonWidth = sliderButton.getBoundingClientRect().width;
let beforeImgElemWidth = beforeImgElem.getBoundingClientRect().width;
let containerWidth = sliderContainer.getBoundingClientRect().width;

let isActive = 0;
let minX = 0;
let maxX = 0;

sliderButton.addEventListener('mousedown', activateSlider);
sliderButton.addEventListener('touchstart', activateSlider);

window.addEventListener('mouseup', disactivateSlider);
window.addEventListener('touchend', disactivateSlider);

function activateSlider(event) {
  event.preventDefault;

  buttonWidth = sliderButton.offsetWidth;
  beforeImgElemWidth = beforeImgElem.getBoundingClientRect().width;
  containerWidth = sliderContainer.getBoundingClientRect().width;

  minX = sliderContainer.getBoundingClientRect().left - buttonWidth / 2;
  maxX = minX + containerWidth - buttonWidth / 2;

  isActive = 1;

  sliderContainer.addEventListener('mousemove', onMouseMove);
  sliderContainer.addEventListener('touchmove', onTouchMove);
}

function disactivateSlider() {
  isActive = 0;
  sliderContainer.removeEventListener('mousemove', onMouseMove);
  sliderContainer.removeEventListener('touchmove', onTouchMove);
}

function onTouchMove(event) {
  if (isActive) moveAtPoint(event.changedTouches[0]);
}

function onMouseMove(event) {
  if (isActive) moveAtPoint(event);
}

function moveAtPoint(e) {
  x = e.pageX - sliderContainer.getBoundingClientRect().left;
  x = x - window.pageXOffset;

  if (x < 0) x = 0;
  if (x > containerWidth) x = containerWidth;

  beforeImgElem.style.width = `${x}px`;
  sliderButton.style.left = `${parseInt(x) - buttonWidth / 2}px`;
}

