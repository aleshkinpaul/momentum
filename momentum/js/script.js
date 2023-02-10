import playList from './playList.js';
import langDictionary from './translate.js';

let settings = {
  'Language': 'en',
  'Source': 'GitHub',
  'Elements': {
    'Time': true,
    'Date': true,
    'Greeting': true,
    'Quote': true,
    'Weather': true,
    'Audio Player': true,
    'Playlist': true,
    'Todo List': true,
  }
}

const MIN_SLIDE_NUM = 1;
const MAX_SLIDE_NUM = 20;
let slideNum = MIN_SLIDE_NUM;
let qouteInd = 0;
let playListItemInd = 0;
let isPlay = false;
let isMute = 0;
let playingTimeout;
let timeOfDayInd = 0;
let imageType;

const body = document.querySelector('body');
const loading = document.querySelector('.loading');
const timeElem = document.querySelector('.time');
const dateElem = document.querySelector('.date');
const greetingContainer = document.querySelector('.greeting-container');
const greetingElem = document.querySelector('.greeting');
const nameElem = document.querySelector('.name');
const sliderNextButton = document.querySelector('.slide-next');
const sliderPrevButton = document.querySelector('.slide-prev');
const cityElem = document.querySelector('.city');
const weatherContainer = document.querySelector('.weather');
const weatherIconElem = document.querySelector('.weather-icon');
const temperatureElem = document.querySelector('.temperature');
const windElem = document.querySelector('.wind');
const humidityElem = document.querySelector('.humidity');
const weatherDescriptionElem = document.querySelector('.weather-description');
const quoteContainer = document.querySelector('.quote-container');
const quoteTextElem = document.querySelector('.quote');
const quoteAuthorElem = document.querySelector('.author');
const changeQuoteButton = document.querySelector('.change-quote');
const playerContainer = document.querySelector('.player');
const playListContainer = document.querySelector('.play-list');
const playAudioButton = document.querySelector('.play');
const nextAudioButton = document.querySelector('.play-next');
const prevAudioButton = document.querySelector('.play-prev');
const audioTitleElem = document.querySelector('.audio-title');
const currentTimeElem = document.querySelector('.current-time');
const durationTimeElem = document.querySelector('.duration-time');
const volumeAudioButton = document.querySelector('.volume');
const playVolumeRange = document.querySelector('.play-volume-range');
const playDurationRange = document.querySelector('.play-duration');
const audioProgressBars = Array.from(document.querySelectorAll('.progress-bar'));
const todoContainer = document.querySelector('.todo-container');
const settingContainer = document.querySelector('.setting-list');
const warningElem = document.querySelector('.error-input');
const warningContainer = document.querySelector('.error-input-container');
let tagElem, tagLabel;

const audioPlayer = new Audio();
audioPlayer.src = playList[playListItemInd].src;
audioPlayer.currentTime = 0;

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', startLoad);
sliderNextButton.addEventListener('click', getSlideNext);
sliderPrevButton.addEventListener('click', getSlidePrev);
cityElem.addEventListener('change', getWeatherInCity);
changeQuoteButton.addEventListener('click', getQuotes);
playAudioButton.addEventListener('click', managePlayButton);
nextAudioButton.addEventListener('click', playNextAudio);
prevAudioButton.addEventListener('click', playPrevAudio);
audioPlayer.addEventListener('loadstart', () => {
  audioPlayer.currentTime = 0;
  playDurationRange.value = 0;
  updateProgressBarBg(playDurationRange);
});
audioPlayer.addEventListener('ended', () => {
  if (isPlay) playNextAudio();
});
audioPlayer.addEventListener('loadedmetadata', updateDuration);
audioPlayer.addEventListener('play', updateAudioProgress);

volumeAudioButton.addEventListener('click', mutePlayer);
playDurationRange.addEventListener('input', updateAudioCurrentTime);
playVolumeRange.addEventListener('input', updateVolume);
audioProgressBars.forEach(elem => {
  elem.addEventListener('input', () => { updateProgressBarBg(elem) });
})

playList.forEach((item, ind) => {
  const listItemElem = document.createElement('li');

  listItemElem.classList.add('play-item');
  listItemElem.textContent = item.title;

  playListContainer.append(listItemElem);

  listItemElem.addEventListener('click', () => {
    playListItemInd = ind;
    playNewAudio();
  });
});

function startLoad() {
  getLocalStorage();
  updateTimeContent();
  updateWeather();
  getRandomSlideNum();
  setBackground();
  getQuotes();
  loadAudioPlayer();
  playNewAudio();
  createSettingsList();
}

function setLocalStorage() {
  localStorage.setItem('name', nameElem.value);
  localStorage.setItem('city', cityElem.value);

  if (playVolumeRange.value !== '0') localStorage.setItem('volume', playVolumeRange.value);
  localStorage.setItem('isMute', isMute);

  if (tagElem.value === '') localStorage.setItem('imageType', 'nature')
  else localStorage.setItem('imageType', tagElem.value);

  localStorage.setItem('settings', JSON.stringify(settings));
  localStorage.setItem('todoListArr', JSON.stringify(todoListArr));
  localStorage.setItem('filterTodoDoneInd', JSON.stringify(filterTodoDoneInd));
}

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    nameElem.value = localStorage.getItem('name');
  }
  cityElem.value = (localStorage.getItem('city')) ? localStorage.getItem('city') : '';
  playVolumeRange.value = (localStorage.getItem('volume')) ? localStorage.getItem('volume') : '50';
  isMute = (localStorage.getItem('isMute') !== null) ? localStorage.getItem('isMute') : 0;
  isMute = parseInt(isMute);
  imageType = localStorage.getItem('imageType');

  if (localStorage.getItem('settings') !== null) settings = JSON.parse(localStorage.getItem('settings'));

  cityElem.placeholder = langDictionary[settings['Language']]['city'];
  todoAddInput.placeholder = langDictionary[settings['Language']]['newTodoPlaceholder'];
  todoTitle.textContent = langDictionary[settings['Language']]['todoTitle'];
  warningElem.innerHTML = langDictionary[settings['Language']]['errorInput'];
}

function createSettingsList() {
  const settingObj = langDictionary[settings['Language']]['settings'];
  const settingEngObj = langDictionary['en']['settings'];

  settingContainer.innerHTML = '';

  for (let key in settingObj) {
    const settingItem = document.createElement('li');
    const settingSubList = document.createElement('div');

    settingItem.textContent = settingObj[key]['name'];
    settingItem.classList.add('setting-subtitle');
    settingSubList.classList.add('setting-sublist');

    settingObj[key]['values'].forEach((item, ind) => {
      const checkBox = document.createElement('input');
      const label = document.createElement('label');
      const checkmark = document.createElement('span');

      checkBox.name = key;
      checkBox.value = (key === 'Language') ? settingEngObj[key]['valueNames'][ind] : settingEngObj[key]['values'][ind];
      if (key === 'Elements') {
        checkBox.type = 'checkbox';
        checkBox.classList.add('setting-sublist-item-input-checkbox');
        checkmark.classList.add('checkmark-checkbox');
      } else {
        checkBox.type = 'radio';
        checkBox.classList.add('setting-sublist-item-input-ratio');
        checkmark.classList.add('checkmark');
      }
      label.textContent = item;
      label.classList.add('setting-sublist-item');
      label.append(checkBox);
      label.append(checkmark);
      settingSubList.append(label);

      if (key === 'Source' && ind === settingObj[key]['values'].length - 1) {
        tagLabel = document.createElement('label');
        tagElem = document.createElement('input');

        tagElem.type = 'text';
        tagElem.placeholder = langDictionary[settings['Language']]['tagPlaceholder'];
        tagElem.value = (imageType) ? imageType : '';
        tagElem.classList.add('setting-source-tag');
        tagLabel.textContent = langDictionary[settings['Language']]['tagLabel'];
        tagLabel.classList.add('setting-source-label');
        tagLabel.append(tagElem);

        if (settings['Source'] === 'GitHub') tagElem.disabled = true
        else tagElem.disabled = false;

        settingSubList.append(tagLabel);
      }

      if (key === 'Language'){
        if (settings[key] === checkBox.value) checkBox.checked = true;
        checkBox.addEventListener('click', () => {
          settings[key] = checkBox.value;
          updateTimeContent();
          updateWeather();
          todoAddInput.placeholder = langDictionary[settings['Language']]['newTodoPlaceholder'];
          todoTitle.textContent = langDictionary[settings['Language']]['todoTitle'];
          warningElem.textContent = langDictionary[settings['Language']]['errorInput'];
          getQuotes();
          createSettingsList();
        });
      }
      if (key === 'Source') {
        if (settings[key] === checkBox.value) {
          checkBox.checked = true;
        }
        checkBox.addEventListener('click', () => {
          settings[key] = checkBox.value;
          if (settings['Source'] === 'GitHub') tagElem.disabled = true
          else tagElem.disabled = false;
          setBackground();
        });
        if (tagElem) tagElem.addEventListener('keyup', (e) => {
          if (e.key === 'Enter') {
            imageType = tagElem.value;
            setBackground();
          }
        });
      }
      if (key === 'Elements') {
        if (settings[key][checkBox.value]) {
          checkBox.checked = true;
          if (checkBox.value === 'Time') timeElem.classList.add('visible');
          if (checkBox.value === 'Date') dateElem.classList.add('visible');
          if (checkBox.value === 'Greeting') greetingContainer.classList.add('visible');
          if (checkBox.value === 'Quote') quoteContainer.classList.add('visible');
          if (checkBox.value === 'Weather') weatherContainer.classList.add('visible');
          if (checkBox.value === 'Audio Player') playerContainer.classList.add('visible');
          if (checkBox.value === 'Playlist') playListContainer.classList.add('visible');
          if (checkBox.value === 'Todo List') todoContainer.classList.add('visible');          
        }
        else {
          checkBox.checked = false;
          if (checkBox.value === 'Time') timeElem.classList.add('hidden');
          if (checkBox.value === 'Date') dateElem.classList.add('hidden');
          if (checkBox.value === 'Greeting') greetingContainer.classList.add('hidden');
          if (checkBox.value === 'Quote') quoteContainer.classList.add('hidden');
          if (checkBox.value === 'Weather') weatherContainer.classList.add('hidden');
          if (checkBox.value === 'Audio Player') playerContainer.classList.add('hidden');
          if (checkBox.value === 'Playlist') playListContainer.classList.add('hidden');
          if (checkBox.value === 'Todo List') todoContainer.classList.add('hidden');
        }
        checkBox.addEventListener('click', () => {
          settings[key][checkBox.value] = checkBox.checked;
          if (checkBox.value === 'Time') changeContainerVisibility(timeElem);
          if (checkBox.value === 'Date') changeContainerVisibility(dateElem);
          if (checkBox.value === 'Greeting') changeContainerVisibility(greetingContainer);
          if (checkBox.value === 'Quote') changeContainerVisibility(quoteContainer);
          if (checkBox.value === 'Weather') changeContainerVisibility(weatherContainer);
          if (checkBox.value === 'Audio Player') changeContainerVisibility(playerContainer);
          if (checkBox.value === 'Playlist') changeContainerVisibility(playListContainer);
          if (checkBox.value === 'Todo List') changeContainerVisibility(todoContainer);
        });
      }
    });

    settingItem.append(settingSubList);
    settingContainer.append(settingItem);
  }
}

function changeContainerVisibility(container) {
  container.classList.toggle('hidden');
  container.classList.toggle('visible');
}

function updateTimeContent() {
  showDate();
  showTime();
  showGreeting();
  setTimeout(() => {
    updateTimeContent();
  }, 1000);
}

function updateWeather() {
  if (cityElem.value === '') getWeather()
  else getWeather(cityElem.value);
  
  setTimeout(() => {
    updateWeather();
  }, 60000);
}

function showTime() {
  const currentTime = new Date().toLocaleTimeString(langDictionary[settings['Language']]['locale'], { hour12: false });
  timeElem.textContent = currentTime;
}

function showDate() {
  const currentDate = new Date().toLocaleDateString(langDictionary[settings['Language']]['locale'], { weekday: 'long', month: 'long', day: 'numeric' });
  if (dateElem.textContent === '' || dateElem.textContent !== currentDate) dateElem.textContent = currentDate;
}

function showGreeting() {
  const greeting = langDictionary[settings['Language']]['greeting'];
  let currentTimeOfDay = getTimeOfDay();
  currentTimeOfDay = currentTimeOfDay[0].toUpperCase() + currentTimeOfDay.slice(1);
  nameElem.placeholder = langDictionary[settings['Language']]['greetingPlaceholder'];;

  if (greetingElem.textContent === '') {
    getRandomSlideNum();
    setBackground();
  }
  greetingElem.textContent = `${greeting[timeOfDayInd]} ${currentTimeOfDay}, `;
}

async function setBackground() {
  const imgElem = document.createElement('img');
  loading.classList.remove('hidden');

  try {
    imgElem.src = await getImageURL();
  }
  catch {
    showWarning();
  }

  imgElem.addEventListener('load', () => {
    body.style.backgroundImage = `url('${imgElem.src}')`;
      loading.classList.add('hidden');
  });
}

function showWarning() {
  warningContainer.classList.add('error-input-container-active');
  setTimeout(() => {
    warningContainer.classList.remove('error-input-container-active');
  }, 4000);
}

function getTimeOfDay(language = settings['Language']) {
  const currentHour = new Date().getHours();
  const timeOfDay = langDictionary[language]['timeOfDay'];

  timeOfDayInd = (currentHour >= 18) ? 2 :
                 (currentHour >= 12) ? 1 :
                 (currentHour >= 6)  ? 0 : 3;
  
  return `${timeOfDay[timeOfDayInd]}`;
}

async function getImageURL() {
  if (settings['Source'] === 'GitHub') {
    const currentTimeOfDay = getTimeOfDay('en');
    const newBgNum = slideNum;
    return `https://raw.githubusercontent.com/aleshkinpaul/stage1-tasks/assets/images/${currentTimeOfDay}/${newBgNum}.jpg`;
  }

  const urls = {
    'Unsplash' : `https://api.unsplash.com/photos/random?orientation=landscape&query=${imageType}&client_id=xG85uSrf0RYfHj7gooqeZX-WVqisft1R30QL39BL8CE`,
    'Flickr': `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=693f4df3b17cc452f1f0d50968223499&tags=${imageType}&extras=url_l&format=json&nojsoncallback=1&per_page=${MAX_SLIDE_NUM}`
  }

  const url = urls[settings['Source']];
  const res = await fetch(url);
  const data = await res.json();

  const link = (settings['Source'] === 'Unsplash') ? data.urls.full : data.photos.photo[parseInt(Math.random() * MAX_SLIDE_NUM)].url_l;

  return link;
}

function getRandomSlideNum() {
  slideNum = parseInt((Math.random() * (MAX_SLIDE_NUM - MIN_SLIDE_NUM))) + MIN_SLIDE_NUM;
  slideNum = formateSlideNum(slideNum);
}

function formateSlideNum(num) {
  return String(num).padStart(2, '0');
}

function getSlideNext() {
  slideNum++;
  if (slideNum > MAX_SLIDE_NUM) slideNum = MIN_SLIDE_NUM;
  slideNum = formateSlideNum(slideNum);
  setBackground();
}

function getSlidePrev() {
  slideNum--;
  if (slideNum < MIN_SLIDE_NUM) slideNum = MAX_SLIDE_NUM;
  slideNum = formateSlideNum(slideNum);
  setBackground();
}

function getWeatherInCity() {
  if (cityElem.value === '') getWeather()
  else getWeather(cityElem.value);
}

async function getWeather(city = langDictionary[settings['Language']]['city']) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${settings['Language']}&appid=f7328acbb74b3c06bd2112104ea64f45&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod !== '404') {
    weatherIconElem.className = 'weather-icon owf';
    weatherIconElem.classList.add(`owf-${data.weather[0].id}`);
    temperatureElem.textContent = `${parseInt(data.main.temp)}°C`;
    weatherDescriptionElem.textContent = data.weather[0].description;
    windElem.textContent = `${langDictionary[settings['Language']]['windSpeedName']}: ${data.wind.speed} ${langDictionary[settings['Language']]['windSpeedProperty']}`;
    humidityElem.textContent = `${langDictionary[settings['Language']]['humidityName']}: ${data.main.humidity}%`;
  } else {
    showWarning();
  }
}

async function getQuotes() {  
  const quotes = 'database/quotes.json';
  const res = await fetch(quotes);
  const data = await res.json();
  const langData = data[settings['Language']];
  let newQuoteInd = parseInt(Math.random() * langData.length);
  while (qouteInd === newQuoteInd) newQuoteInd = parseInt(Math.random() * langData.length);

  qouteInd = newQuoteInd;
  quoteTextElem.textContent = langData[qouteInd].text;
  quoteAuthorElem.textContent = langData[qouteInd].author;
}

function managePlayButton() {
  if (isPlay) audioPlayer.pause()
  else audioPlayer.play();

  playAudioButton.classList.toggle('pause');
  setActiveplayListItem();
  isPlay = !isPlay;
}

function playNextAudio() {
  playListItemInd++;
  if (playListItemInd > playList.length - 1) playListItemInd = 0;
  audioPlayer.currentTime = 0;
  playNewAudio();
}

function playPrevAudio() {
  playListItemInd--;
  if (playListItemInd < 0) playListItemInd = playList.length - 1;
  audioPlayer.currentTime = 0;  
  playNewAudio();
}

function playNewAudio() {
  clearTimeout(playingTimeout);  
  audioPlayer.src = playList[playListItemInd].src;
  updateAudioProgress();
  setActiveplayListItem();
  audioTitleElem.textContent = playList[playListItemInd].title;
  if (isPlay) {
    audioPlayer.play();
    if (!playAudioButton.classList.contains('pause')) playAudioButton.classList.add('pause');
  }
}

function updateAudioProgress() {
  const nowDate = new Date();
  updatePlayDurationRange();
  updateCurrentTime();

  if (isPlay) {
    playingTimeout = setTimeout(() => {
      updateAudioProgress()
    }, 1000 - (new Date() - nowDate));
  } else clearTimeout(playingTimeout);
}

function updateAudioCurrentTime() {
  audioPlayer.currentTime = playDurationRange.value / 100 * audioPlayer.duration;
  updateCurrentTime();
}

function updatePlayDurationRange() {
  playDurationRange.value = parseInt(audioPlayer.currentTime / audioPlayer.duration * 100);
  updateProgressBarBg(playDurationRange);
}

function updateCurrentTime() {
  const durationMs = audioPlayer.currentTime * 1000;
  const minutes = String(new Date(durationMs).getMinutes()).padStart(2, '0');
  const seconds = String(new Date(durationMs).getSeconds()).padStart(2, '0');
  currentTimeElem.textContent = `${minutes}:${seconds}`;
}

function updateDuration() {
  const durationMs = audioPlayer.duration * 1000;
  const minutes = String(new Date(durationMs).getMinutes()).padStart(2, '0');
  const seconds = String(new Date(durationMs).getSeconds()).padStart(2, '0');
  durationTimeElem.textContent = `${minutes}:${seconds}`;
}

function setActiveplayListItem() {
  const items = Array.from(document.querySelectorAll('.play-item'));

  items.forEach((item, ind) => {
    item.classList.remove('item-active');
    if (ind === playListItemInd) item.classList.add('item-active');
  });
}

function updateVolume() {
  if (playVolumeRange.value !== '0') {
    localStorage.setItem('volume', playVolumeRange.value);
    isMute = 0;
  }
  else isMute = 1;

  updateProgressBarBg(playVolumeRange);
  audioPlayer.volume = parseInt(playVolumeRange.value) / 100;
  
  if (parseInt(playVolumeRange.value) === 0) volumeAudioButton.classList = 'volume player-icon volume-mute'
  else if (parseInt(playVolumeRange.value) <= 33 ) volumeAudioButton.classList = 'volume player-icon volume-quiet'
  else if (parseInt(playVolumeRange.value) <= 66 ) volumeAudioButton.classList = 'volume player-icon volume-medium'
  else volumeAudioButton.classList = 'volume player-icon volume-loud';
}

function loadAudioPlayer() {
  playVolumeRange.value = (!isMute) ? localStorage.getItem('volume') : '0';
  updateVolume();
  playDurationRange.value = '0';
  audioProgressBars.forEach(item => updateProgressBarBg(item));
}

function mutePlayer() {
  isMute = 1 - isMute;
  playVolumeRange.value = !isMute ? localStorage.getItem('volume') : '0';
  updateVolume();
}

function updateProgressBarBg(bar) {
  bar.style.background = `linear-gradient(to right, #C5B358 0%, #C5B358 ${bar.value}%, #FFFFFF ${bar.value}%, #FFFFFF 100%)`;
}

console.log(`
Deadline: 26.10.2021 / 26.10.2021
Score: 150

Реализованы все пункты. В качестве доп. функционала реализован Todo List.

1. Часы и календарь +15
- время выводится в 24-часовом формате, например: 21:01:00 +5
- время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается) +5
- выводится день недели, число, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня" +5
2. Приветствие +10
- текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь) +5
- пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется, данные о нём хранятся в local storage +5
3. Смена фонового изображения +20
- ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20) +5
- изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке) +5
- изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке) +5
- при смене слайдов важно обеспечить плавную смену фоновых изображений +5
4. Виджет погоды +15
- при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage +5
- для указанного пользователем населённого пункта выводятся данные о погоде, если их возвращает API
данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел +5
- выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) +5
5. Виджет цитата дня +10
- при загрузке страницы приложения отображается рандомная цитата и её автор +5
- при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую) +5
6. Аудиоплеер +15
- при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause +3
- при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play +3
- треки можно пролистывать кнопками Play-next и Play-prev
треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev) +3
- трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем +3
- после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. +3
7. Продвинутый аудиоплеер (реализуется без использования библиотек) +20
- добавлен прогресс-бар в котором отображается прогресс проигрывания +3
- при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека +3
- над прогресс-баром отображается название трека +3
- отображается текущее и общее время воспроизведения трека +3
- есть кнопка звука при клике по которой можно включить/отключить звук +2
- добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука +3
- можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте +3
8. Перевод приложения на два языка (en/ru или en/be) +15
- переводится язык и меняется формат отображения даты +3
- переводится приветствие и placeholder +3
- переводится прогноз погоды в т.ч описание погоды (OpenWeatherMap API предоставляет такую возможность) и город по умолчанию +3
- переводится цитата дня (используйте подходящий для этой цели API, возвращающий цитаты на нужном языке или создайте с этой целью JSON-файл с цитатами на двух языках) +3
- переводятся настройки приложения. При переключении языка приложения в настройках, язык настроек тоже меняется +3
9. Получение фонового изображения от API +10
- в качестве источника изображений может использоваться Unsplash API +5
- в качестве источника изображений может использоваться Flickr API +5
10. Настройки приложения +20
- в настройках приложения можно указать язык приложения (en/ru или en/be) +3
- в настройках приложения можно указать источник получения фото для фонового изображения: коллекция изображений GitHub, Unsplash API, Flickr API +3
- если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото +3
- в настройках приложения можно скрыть/отобразить любой из блоков, которые находятся на странице: время, дата, приветствие, цитата дня, прогноз погоды, аудиоплеер, список дел/список ссылок/ваш собственный дополнительный функционал +3
- скрытие и отображение блоков происходит плавно, не влияя на другие элементы, которые находятся на странице, или плавно смещая их +3
- настройки приложения сохраняются при перезагрузке страницы +5
11. Дополнительный функционал на выбор +10
- ToDo List - список дел (как в оригинальном приложении) +10
`);