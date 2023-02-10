const langDictionary = {
  'en': {
    'locale': 'en-EN',
    'greeting': [ 'Good', 'Good', 'Good', 'Good' ],
    'timeOfDay': [ 'morning', 'afternoon', 'evening', 'night'],
    'greetingPlaceholder': 'Enter your name',
    'city': 'Minsk',
    'windSpeedName': 'Wind speed',
    'windSpeedProperty': 'm/s',
    'humidityName': 'Humidity',
    'tagPlaceholder': 'Enter tag...',
    'tagLabel': 'Tag:',
    'todoTitle': 'Todo List',
    'newTodoPlaceholder': 'Enter todo name...',
    'errorInput': 'ENTER VALID VALUE',
    'settings': {
      'Language': {
        name: 'Language',
        values: [ 'English', 'Russian' ],
        valueNames: [ 'en', 'ru' ],
      },
      'Source': {
        name: 'Image source',
        values: [ 'GitHub', 'Unsplash', 'Flickr' ],
      },
      'Elements': {
        name: 'App elements',
        values: [ 'Time', 'Date', 'Greeting', 'Quote', 'Weather', 'Audio Player', 'Playlist', 'Todo List' ]
      }
    }
  },
  'ru': {
    'locale': 'ru-RU',
    'greeting': [ 'Доброе', 'Добрый', 'Добрый', 'Доброй' ],
    'timeOfDay': [ 'утро', 'день', 'вечер', 'ночи'],
    'greetingPlaceholder': 'Введите ваше имя',
    'city': 'Минск',
    'windSpeedName': 'Скорость ветра',
    'windSpeedProperty': 'м/с',
    'humidityName': 'Влажность',
    'tagPlaceholder': 'Укажите тэг...',
    'tagLabel': 'Тэг:',
    'todoTitle': 'Список дел',
    'newTodoPlaceholder': 'Введите название дела...',
    'errorInput': 'УКАЖИТЕ КОРРЕКТНЫЕ ДАННЫЕ',
    'settings': {
      'Language': {
        name: 'Язык',
        values: [ 'Английский', 'Русский' ],
        valueNames: [ 'en', 'ru' ],
      },
      'Source': {
        name: 'Источник изображений',
        values: [ 'GitHub', 'Unsplash', 'Flickr' ],
      },
      'Elements': {
        name: 'Элементы приложения',
        values: [ 'Время', 'Дата', 'Приветствие', 'Цитата', 'Погода', 'Аудиоплеер', 'Плейлист', 'Список дел' ],
      }
    }
  }
}
export default langDictionary;