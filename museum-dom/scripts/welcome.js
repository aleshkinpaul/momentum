const welcomeSliderWrapper = document.querySelector('.slider-container-wrapper');
const welcomeSlider = document.querySelector('.section-welcome .slider-container');
const welcomeSliderArrowLeft = document.querySelector('.section-welcome .slider-arrows .left-arrow');
const welcomeSliderArrowRight = document.querySelector('.section-welcome .slider-arrows .right-arrow');
const sliderCounterElems = Array.from(document.querySelectorAll('.slider-pages-block .slider-page-num'));
const currentSlideNum = sliderCounterElems[0];
const slidesCount = sliderCounterElems[1];
const sliderPaginationDiv = document.querySelector('.slider-carousel-pagination');
let translationComplete = true;

let startTouchX = 0;
let startTouchY = 0;
let endTouchX = 0;
let endTouchY = 0;

const welcomeSliderElems = initSlider();
const bulletButtons = Array.from(document.querySelectorAll('.slide-pagination-button'));

welcomeSliderArrowLeft.addEventListener('click', moveSlidesLeft);
welcomeSliderArrowRight.addEventListener('click', moveSlidesRight);

bulletButtons.forEach((button, ind) => {
  button.addEventListener('click', (e) => {
    if (ind + 1 === parseInt(currentSlideNum.innerHTML)) return;

    setTransitionClassToTheNextSlide('bullet', ind + 1);
    moveToNextIndex(ind + 1);
    setQniqueClassInArray(bulletButtons, 'slide-pagination-button-active', ind + 1);
    calculateNewCurrentSlideNum(ind + 1);
  });
});

welcomeSliderWrapper.addEventListener("touchstart", (e) => {
  startTouchX = e.changedTouches[0].screenX;
  startTouchY = e.changedTouches[0].screenY;
});

welcomeSliderWrapper.addEventListener("touchend", (e) => {
  endTouchX = e.changedTouches[0].screenX;
  endTouchY = e.changedTouches[0].screenY;
  if (endTouchX > startTouchX) moveSlidesLeft();
  if (endTouchX < startTouchX) moveSlidesRight();
});

welcomeSliderWrapper.addEventListener("mousedown", (e) => {
  e.stopPropagation();
  e.preventDefault();
  startTouchX = e.screenX;
  startTouchY = e.screenY;
  welcomeSliderWrapper.style.cursor = 'grabbing';
});

welcomeSliderWrapper.addEventListener("mouseup", (e) => {
  e.stopPropagation();
  endTouchX = e.screenX;
  endTouchY = e.screenY;
  welcomeSliderWrapper.style.cursor = 'grab';
  if (endTouchX > startTouchX) moveSlidesLeft();
  if (endTouchX < startTouchX) moveSlidesRight();
});

function initSlider() {
  const sliderImageLinks = [
    './assets/img/welcome-slider/1.jpg',
    './assets/img/welcome-slider/2.jpg',
    './assets/img/welcome-slider/3.jpg',
    './assets/img/welcome-slider/4.jpg',
    './assets/img/welcome-slider/5.jpg'
  ];

  welcomeSlider.append(createSlideElement('slider-image', sliderImageLinks[sliderImageLinks.length - 1]));
  sliderImageLinks.forEach((link, ind) => {
    const imgElem = createSlideElement('slider-image', link);
    const paginationButton = document.createElement('button');

    paginationButton.classList.add('slide-pagination-button');
    if (ind === 0) paginationButton.classList.add('slide-pagination-button-active');

    welcomeSlider.append(imgElem);
    sliderPaginationDiv.append(paginationButton);
  });
  welcomeSlider.append(createSlideElement('slider-image', sliderImageLinks[0]));
  const welcomeSlidesArray = Array.from(welcomeSlider.children);

  welcomeSlidesArray.forEach((slide, ind) => {
    slide.style.left = `${100 * (ind - 1)}%`;

    slide.addEventListener("transitionend", () => {
      translationComplete = true;
      setQniqueClassInArray(welcomeSlidesArray, 'slider-image-transition');
      moveSlidesFromLimitIndex(ind);
    }, true);
  });

  slidesCount.innerHTML = (sliderImageLinks.length > 0 && sliderImageLinks.length < 10) ? `0${sliderImageLinks.length}` : sliderImageLinks.length;

  return welcomeSlidesArray;
}

function createSlideElement(imgClass, link, alt = '') {
  const imgElem = document.createElement('img');
  imgElem.classList.add(imgClass);
  imgElem.alt = alt;
  imgElem.src = link;
  return imgElem;
}

function moveSlidesLeft() {
  if (translationComplete) {
    translationComplete = false;
    const nextInd = setTransitionClassToTheNextSlide('left');
    moveToNextIndex(nextInd);
    calculateNewCurrentSlideNum(nextInd);
  }
}

function moveSlidesRight() {
  if (translationComplete) {
    translationComplete = false;
    const nextInd = setTransitionClassToTheNextSlide('right');
    moveToNextIndex(nextInd);
    calculateNewCurrentSlideNum(nextInd);
  }
}

function setTransitionClassToTheNextSlide(type, bulletInd = 0) {
  let currentInd = 0;
  let nextInd = 0;

  for (let i = 0; i < welcomeSliderElems.length; i++) {
    if (parseInt(welcomeSliderElems[i].style.left) === 0) {
      currentInd = i;
      break;
    }
  };

  nextInd = (type === 'bullet') ? bulletInd : calculateNextInd(currentInd, type);

  welcomeSliderElems[currentInd].classList.add('slider-image-transition');
  welcomeSliderElems[nextInd].classList.add('slider-image-transition');

  return nextInd;
}

function moveSlidesFromLimitIndex(currentInd) {
  if (currentInd === 0) {
    currentInd = welcomeSliderElems.length - 2;
    moveToNextIndex(currentInd);
  }
  else if (currentInd === welcomeSliderElems.length - 1) {
    currentInd = 1;
    moveToNextIndex(currentInd);
  }
  return currentInd;
}

function moveToNextIndex(newInd) {
  welcomeSliderElems.forEach((slide, slideInd) => {
    slide.style.left = `${100 * (slideInd - newInd)}%`;
  });
}

function calculateNewCurrentSlideNum(nextInd) {
  let newCurrentSlideNum = nextInd;
  if (nextInd === 0) newCurrentSlideNum = welcomeSliderElems.length - 2;
  if (nextInd === welcomeSliderElems.length - 1) newCurrentSlideNum = 1;
  currentSlideNum.innerHTML = (newCurrentSlideNum < 10) ? `0${newCurrentSlideNum}` : `${newCurrentSlideNum}`;
  setQniqueClassInArray(bulletButtons, 'slide-pagination-button-active', newCurrentSlideNum - 1);
}

function calculateNextInd(currentInd, type) {
  if (type === 'right') return currentInd + 1;
  if (type === 'left') return currentInd - 1;
  return currentInd;
}

function setQniqueClassInArray (arr, className, i = undefined) {
  arr.forEach((elem, ind) => {
    elem.classList.remove(className);
    if (ind === i) elem.classList.add(className);
  });
}