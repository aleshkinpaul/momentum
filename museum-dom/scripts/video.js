const progressBars = document.querySelectorAll('.progress-bar');
const videoSliderContainer = document.querySelector('.video-slider-watch-list');
const videoPaginationArrowButtons = Array.from(document.querySelectorAll('.video-slider-carousel-pagination .video-arrow-button'));
const videoPaginationDotButtons = Array.from(document.querySelectorAll('.video-slider-pagination-dots-container > .video-slider-pagination-button'));
let currentVideoInd;

const videoInfoArray = [
  {
    id: 'aWmJ5DgyWPI',
    name: `Exposition - Le Corps et l'Âme. De Donatello à Michel-Ange. Sculptures italiennes de la Renaissance`,
  },
  {
    id: 'Vi5D6FKhRmo',
    name: `Au Louvre ! La Vénus de Milo`,
  },
  {
    id: 'NOhDysLnTvY',
    name: `Promenade dans les collections mésopotamiennes avec Ariane Thomas`,
  },
  {
    id: '2OR0OCr6uRE',
    name: `Petits contes de Printemps - La ruse du Renard`,
  },
  {
    id: 'zp1BXPX8jcU',
    name: `Welcome to the Louvre - Bienvenue au Louvre - Musée du Louvre`,
  }
]

initVideoSlider();

const slider = tns({
  container: '.video-slider-watch-list',
  slideItems: '.video-slider-list-item',
  mode: 'carousel',
  hasControls: true,
  arrowKeys: true,  
  navContainer: ".video-slider-pagination-dots-container",
  navAsThumbnails: true,
  prevButton: '.video-arrow-left-button',
  nextButton: '.video-arrow-right-button',
  items: 2,
  slideBy: 1,
  responsive: {
     900: {
       items: 3,
     }
  }
});

const videoContainers = Array.from(document.querySelectorAll('.video-slider-list-item'));

videoContainers.forEach((container, ind) => {
  container.value = ind;
  container.addEventListener( 'click', () => {
    if (currentVideoInd !== ind) changeCurrentIframeToPreview();

    const videoHeaderElem = container.querySelector('.video-slider-list-item-header');
    const videoLinkElem = container.querySelector('.video-slider-list-item-link');
    const videoYoutubeButton = container.querySelector('.video-slider-list-item-youtube-button');

    let iframe = createIframe(videoInfoArray[ind % videoInfoArray.length].id);
    currentVideoInd = ind;

    videoHeaderElem.remove();
    videoLinkElem.remove();
    videoYoutubeButton.remove();

    console.log(currentVideoInd);

    container.appendChild(iframe);
  })
});

videoPaginationArrowButtons.forEach(button => button.addEventListener('click', () => {
  const nextInd = slider.getInfo().index % videoPaginationDotButtons.length;
  changeCurrentIframeToPreview();
  setQniqueClassInArray(videoPaginationDotButtons, 'video-circle-button-active', nextInd);
  updateMainVideo(nextInd);
}));

videoPaginationDotButtons.forEach((button, ind) => button.addEventListener('click', () => {
  changeCurrentIframeToPreview();
  setQniqueClassInArray(videoPaginationDotButtons, 'video-circle-button-active', ind);
  updateMainVideo(ind);
}));

progressBars.forEach(elem => {
  elem.addEventListener('input', function() {
    const value = this.value;
    this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #C4C4C4 ${value}%, #C4C4C4 100%)`;
  })
})

function initVideoSlider() {
  createMainVideoPreview(0);
  videoInfoArray.forEach((videoInfo, ind) => {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-slider-list-item');

    createVideoPreview(videoContainer, videoInfo, ind);
    videoSliderContainer.append(videoContainer);
  });
}

function createVideoPreview(videoContainer, videoInfo) {
  const videoLinkElem = document.createElement('a');
  const videoCoverElem = document.createElement('picture');
  const videoCoverSourceElem = document.createElement('source');
  const videoCoverImageElem = document.createElement('img');
  const videoYoutubeButton = document.createElement('button');
  const videoHeaderElem = document.createElement('div');
  const videoHeaderTitle = document.createElement('span');
  const videoHeaderIcon = document.createElement('img');

  videoHeaderTitle.textContent = `${videoInfo.name}`;
  videoHeaderTitle.classList.add('video-slider-list-item-header-title');
  videoHeaderIcon.src = './assets/favicon.ico';
  videoHeaderIcon.classList.add('video-slider-list-item-header-img');
  videoHeaderElem.classList.add('video-slider-list-item-header');
  videoCoverSourceElem.type = 'image/webp';
  videoCoverSourceElem.srcset = `https://i.ytimg.com/vi_webp/${videoInfo.id}/mqdefault.webp`;
  videoCoverImageElem.src = `https://i.ytimg.com/vi/${videoInfo.id}/mqdefault.jpg`;
  videoCoverImageElem.alt = '';
  videoCoverImageElem.classList.add('video-slider-list-item-cover');
  videoLinkElem.classList.add('video-slider-list-item-link');
  videoYoutubeButton.setAttribute('aria-label', 'Запустить видео');
  videoYoutubeButton.classList.add('video-slider-list-item-youtube-button');
  videoYoutubeButton.innerHTML = `<svg width="68" height="48" viewBox="0 0 68 48"><path class="video__button-shape" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path class="video__button-icon" d="M 45,24 27,14 27,34"></path></svg>`;

  videoHeaderElem.append(videoHeaderIcon);
  videoHeaderElem.append(videoHeaderTitle);

  videoCoverElem.append(videoCoverSourceElem);
  videoCoverElem.append(videoCoverImageElem);
  videoLinkElem.append(videoCoverElem);

  videoContainer.append(videoHeaderElem);
  videoContainer.append(videoLinkElem);
  videoContainer.append(videoYoutubeButton);

  return { videoHeaderElem, videoLinkElem, videoYoutubeButton };
}

function changeCurrentIframeToPreview() {
  if(currentVideoInd !== undefined) {
    const videoContainer = Array.from(document.querySelectorAll('.video-slider-list-item')).filter(video => video.value === parseInt(currentVideoInd))[0];
    const currentIframe = videoContainer.getElementsByTagName('iframe')[0];

    currentIframe.remove();
    createVideoPreview(videoContainer, videoInfoArray[currentVideoInd % videoInfoArray.length], currentVideoInd % videoInfoArray.length);
    currentVideoInd = undefined;
  }
}

function createMainVideoPreview(ind) {
  const mainContainer = document.querySelector('.main-video-container');
  const videoLinkElem = document.createElement('a');
  const videoCoverElem = document.createElement('picture');
  const videoCoverSourceElem = document.createElement('source');
  const videoCoverImageElem = document.createElement('img');

  const mainInd = (ind + videoInfoArray.length - 1) % videoInfoArray.length;

  videoCoverSourceElem.type = 'image/webp';
  videoCoverSourceElem.srcset = `https://i.ytimg.com/vi_webp/${videoInfoArray[mainInd].id}/maxresdefault.webp`;
  videoCoverImageElem.src = `https://i.ytimg.com/vi/${videoInfoArray[mainInd].id}/maxresdefault.jpg`;
  videoCoverImageElem.alt = '';
  videoCoverImageElem.classList.add('main-video');

  videoCoverElem.append(videoCoverSourceElem);
  videoCoverElem.append(videoCoverImageElem);
  videoLinkElem.append(videoCoverElem);

  mainContainer.append(videoLinkElem);
}

function updateMainVideo(ind) {
  const mainContainer = document.querySelector('.main-video-container');
  const videoCoverSourceElem = mainContainer.querySelector('img');
  const videoCoverImageElem = mainContainer.querySelector('source');

  const mainInd = (ind + videoInfoArray.length - 1) % videoInfoArray.length;

  videoCoverSourceElem.srcset = `https://i.ytimg.com/vi_webp/${videoInfoArray[mainInd].id}/maxresdefault.webp`;
  videoCoverSourceElem.src = `https://i.ytimg.com/vi_webp/${videoInfoArray[mainInd].id}/maxresdefault.webp`;
  videoCoverImageElem.srcset = `https://i.ytimg.com/vi/${videoInfoArray[mainInd].id}/maxresdefault.jpg`;
  videoCoverImageElem.src = `https://i.ytimg.com/vi/${videoInfoArray[mainInd].id}/maxresdefault.jpg`;
}

function createIframe(id) {
  let iframe = document.createElement('iframe');

  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay');
  iframe.setAttribute('src', `https://www.youtube.com/embed/${id}?rel=0&enablejsapi=1&showinfo=0&autoplay=1`);
  iframe.id = id;
  iframe.classList.add('video-slider-list-item-cover');

  return iframe;
}