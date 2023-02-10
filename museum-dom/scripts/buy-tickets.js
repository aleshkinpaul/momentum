const BASIC_TICKET_AMOUNT = 20,
      SENIOR_TICKET_AMOUNT = 10,
      TYPE_COEFFS = [1, 1.25, 2],
      RIPPLE_CIRCLE_LIFE_TIME = 1000;

const inputTimeValuesArray = [ '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'
                             , '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
                             , '16:00', '16:30', '17:00', '17:30', '18:00' ]

const currentDate = new Date;
const rippleButtons = document.querySelectorAll('.ripple');

const reducerButtons = document.querySelectorAll('.ticket-reducer-button');
const increaserButtons = document.querySelectorAll('.ticket-increaser-button');
const ticketTypeInputs = Array.from(document.querySelectorAll('.ticket-type-item-container input'));
const buyTicketsButton = document.querySelector('.buy-tickets-button');

const popupContainer = document.querySelector('.container-form-popup');
const popupForm = document.querySelector('.buy-tickets-form-popup');
const popupCloseButton = document.querySelector('.close-button');
const popupTicketInfoReducerButtons = document.querySelectorAll('.card-date-reducer-button');
const popupTicketInfoIncreaserButtons = document.querySelectorAll('.card-date-increaser-button');
const popupSelectTagOptionsArray = Array.from(document.querySelectorAll('.form-popup-fields-ticket-type-option'));
const popupTicketTypeOptions = Array.from(document.querySelectorAll('.ticket-type-option-item'));
const popupTicketTypeSelectTitle = document.querySelector('.ticket-type-option-title');
const popupTicketTypeWrapper = document.querySelector('.form-popup-fields-ticket-type-select-wrapper');
const popupTicketInfoType = document.querySelector('.ticket-info-type');
const popupDateInput = document.querySelector('.form-popup-field-date');
const popupTimeInput = document.querySelector('.form-popup-field-time');
const popupInputTimeWrapper = document.querySelector('.form-popup-fields-input-time-select-wrapper');
const popupInputTimeSelect = document.querySelector('.input-time-select');
const popupTicketInfoTime = document.querySelector('.ticket-info-time');
const popupInputTimeOptionTitle = document.querySelector('.input-time-option-title');
const popupInputDateButton = document.querySelector('.form-popup-field-date');
const popupTicketInfoDate = document.querySelector('.ticket-info-date');
const popupInputName = document.querySelector('.js-field-input-name');
const popupInputEmail = document.querySelector('.js-field-input-email');
const popupInputPhone = document.querySelector('.js-field-input-phone');

popupTicketTypeWrapper.setAttribute('isopen', 0);
popupInputTimeWrapper.setAttribute('isopen', 0);

setValuesFromLocalStorage('all');
initInputTimeSelect();
popupDateInput.min = currentDate.toISOString().split('T')[0];


popupTicketInfoReducerButtons.forEach(button => button.addEventListener('click', (e) => { reduceValue(e, true) }));
popupTicketInfoIncreaserButtons.forEach(button => button.addEventListener('click', (e) => { increaseValue(e, true) }));
reducerButtons.forEach(button => button.addEventListener('click', reduceValue));
increaserButtons.forEach(button => button.addEventListener('click', increaseValue));

buyTicketsButton.addEventListener('click', () => {
  popupContainer.classList.remove('hidden-popup-form');
})

popupInputDateButton.addEventListener('change', (e) => { saveValueInLocalStorage(e.target) });
popupInputName.addEventListener('input', (e) => { inputValidation(e, new RegExp('^[a-zA-Z\\s]{3,15}$', 'gm')) });
popupInputEmail.addEventListener('input', (e) => { inputValidation(e, new RegExp(`^[a-zA-Z\\d\\_\\-]{3,15}@[a-z]{4,}\.[a-z]{2,}$`, 'gm')) });
popupInputPhone.addEventListener('input', (e) => { inputValidation(e, new RegExp(`(^\\d?(\\d{2})?[\\-\\s]?(\\d{3})?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{2})?$)|(^\\d?(\\d{2})?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{3})?[\\-\\s]?(\\d{2})?$)|(^\\d?(\\d{2})?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{3})?$)|(^\\d?(\\d{1})?[\\-\\s]?(\\d{3})?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{3})?$)|(^\\d?(\\d{1})?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{3})?[\\-\\s]?(\\d{3})?$)|(^\\d?(\\d{1})?[\\-\\s]?(\\d{3})?[\\-\\s]?(\\d{3})?[\\-\\s]?(\\d{2})?$)|(^\\d?(\\d)?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{2})?[\\-\\s]?(\\d{2})?$)`, 'gm')) });

popupTicketTypeWrapper.addEventListener('click', toggleList);
popupInputTimeWrapper.addEventListener('click', toggleList);

popupTicketTypeOptions.forEach(option => option.addEventListener('click', chooseTicketType));
ticketTypeInputs.forEach(input => input.addEventListener('click', chooseTicketType));

popupContainer.addEventListener('click', closePopup);
popupCloseButton.addEventListener('click', closePopup);

rippleButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    const xCoord = e.clientX - this.getBoundingClientRect().left;
    const yCoord = e.clientY - this.getBoundingClientRect().top;
    const circle = document.createElement('span');

    circle.classList.add('circle');
    circle.style.left = `${xCoord}px`;
    circle.style.top = `${yCoord}px`;

    this.appendChild(circle);

    setTimeout(() => circle.remove(), RIPPLE_CIRCLE_LIFE_TIME);
  })
})

document.addEventListener('click', (e) => {
  const listContainer = e.target.closest('div');
  if (listContainer) {
    if (!listContainer.classList.contains('form-popup-fields-input-time-select-wrapper')) popupInputTimeWrapper.setAttribute('isopen', 0);
    if (!listContainer.classList.contains('form-popup-fields-ticket-type-select-wrapper')) popupTicketTypeWrapper.setAttribute('isopen', 0);
  }
});

function inputValidation(e, regexp) {
  if (regexp.test(e.target.value)) {
    e.target.classList.add('valid-input');
    e.target.classList.remove('invalid-input');
  }
  else {
    e.target.classList.add('invalid-input');
    e.target.classList.remove('valid-input');
  }
}

function initInputTimeSelect() {
  inputTimeValuesArray.forEach((timeValue, ind) => {
    const timeValuesListItem = document.createElement('li');
    timeValuesListItem.className = 'form-popup-fields-item input-time-option input-time-option-item js-input-time-option';
    timeValuesListItem.value = ind;
    timeValuesListItem.textContent = timeValue;

    timeValuesListItem.addEventListener('click', function(e) {
      popupTicketInfoTime.innerHTML = e.target.innerHTML;
      popupInputTimeOptionTitle.innerHTML = e.target.innerHTML;
      saveValueInLocalStorage(e.target);
    });

    popupInputTimeSelect.append(timeValuesListItem);
  })
}

function reduceValue(event, isTwoDigits = false) {
  const input = event.target.closest('div').querySelector('input') || event.target.closest('div').previousElementSibling;
  if (parseInt(input.value) > parseInt(input.min)) {
    const resultValue = parseInt(input.value) - 1;
    input.value = addZeroForDigit(resultValue, isTwoDigits);
  };
  saveValueInLocalStorage(input);  
}

function increaseValue(event, isTwoDigits = false) {
  const input = event.target.closest('div').querySelector('input') || event.target.closest('div').previousElementSibling;
  if (parseInt(input.value) < parseInt(input.max)) {
    const resultValue = parseInt(input.value) + 1;
    input.value = addZeroForDigit(resultValue, isTwoDigits);
  }
  saveValueInLocalStorage(input);
}

function chooseTicketType(event) {
  saveValueInLocalStorage(event.target);
  popupTicketTypeSelectTitle.textContent = popupTicketTypeOptions[event.target.value].textContent;
  popupTicketInfoType.textContent = popupTicketTypeOptions[event.target.value].textContent;
}

function toggleList(event) {
  const listContainer = event.target.closest('div');
  const isOpen = parseInt(listContainer.getAttribute('isopen'));
  listContainer.setAttribute('isopen', 1 - isOpen);
}

function closePopup(e) {
  if (e.target.classList.contains('container-form-popup') || e.target.classList.contains('close-button')) {
    popupContainer.classList.add('hidden-popup-form')
    setValuesFromLocalStorage();
  }
}

function formatDate(date) {
  const daysOfWeekArray = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
  const monthArray = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

  return `${daysOfWeekArray[date.getDay()]}, ${monthArray[date.getMonth()]} ${date.getDate()}`;
}

function saveValueInLocalStorage(elem) {
  if (elem.classList.contains('js-basic-ticket-count')) {
    localStorage.setItem('louvre-basic-ticket-count', elem.value);
    setValuesFromLocalStorage('ticket-basic');
    setValuesFromLocalStorage('tickets-total-amount-value');
  }
  if (elem.classList.contains('js-senior-ticket-count')) {
    localStorage.setItem('louvre-senior-ticket-count', elem.value);
    setValuesFromLocalStorage('ticket-senior');
    setValuesFromLocalStorage('tickets-total-amount-value');
  }
  if (elem.classList.contains('js-ticket-type-option')) {
    localStorage.setItem('louvre-ticket-type', elem.value);
    setValuesFromLocalStorage('ticket-type');
    setValuesFromLocalStorage('ticket-basic');
    setValuesFromLocalStorage('ticket-senior');
    setValuesFromLocalStorage('tickets-total-amount-value');
  }
  if (elem.classList.contains('js-input-time-option')) {
    localStorage.setItem('louvre-ticket-info-time', elem.innerHTML);
    setValuesFromLocalStorage('ticket-info-time');
  }
  if (elem.classList.contains('js-input-date')) {
    localStorage.setItem('louvre-ticket-info-date', elem.value);
    setValuesFromLocalStorage('ticket-info-date');
  }
}

function setValuesFromLocalStorage(type) {
  let ticketsAmountValue, ticketCount, ticketTypeInd;

  switch (type) {
    case 'ticket-basic':
      const inputBasicTicketsCount = Array.from(document.querySelectorAll('.js-basic-ticket-count'));
      ticketsAmountValue = document.querySelector('.js-basic-tickets-amount-value');
      ticketCount = localStorage.getItem('louvre-basic-ticket-count') || 1;
      ticketTypeInd = localStorage.getItem('louvre-ticket-type');

      inputBasicTicketsCount.forEach(input =>{
        if ( input.classList.contains('js-ticket-count-span') ) {
          input.innerHTML = ticketCount;
        }
        else input.value = addZeroForDigit(ticketCount);
      })
      ticketsAmountValue.innerHTML = ( ticketTypeInd !== null ) ? ticketCount * TYPE_COEFFS[ticketTypeInd] * BASIC_TICKET_AMOUNT : 0;
      break;

    case 'ticket-senior':
      const inputSeniorTicketsCount = Array.from(document.querySelectorAll('.js-senior-ticket-count'));
      ticketsAmountValue = document.querySelector('.js-senior-tickets-amount-value');
      ticketCount = localStorage.getItem('louvre-senior-ticket-count') || 1;
      ticketTypeInd = localStorage.getItem('louvre-ticket-type');

      inputSeniorTicketsCount.forEach(input =>{
        if ( input.classList.contains('js-ticket-count-span') ) {
          input.innerHTML = ticketCount;
        }
        else input.value = addZeroForDigit(ticketCount);
      })
      ticketsAmountValue.innerHTML = ( ticketTypeInd !== null ) ? ticketCount * TYPE_COEFFS[ticketTypeInd] * SENIOR_TICKET_AMOUNT : 0;
      break;

    case 'ticket-type':
      const oneBasicTicketAmount = Array.from(document.querySelectorAll('.one-basic-ticket-amount'));
      const oneSeniorTicketAmount = Array.from(document.querySelectorAll('.one-senior-ticket-amount'));
      ticketTypeInd = localStorage.getItem('louvre-ticket-type');

      popupSelectTagOptionsArray.forEach((option, ind) => {
        option.checked = false;
        ticketTypeInputs[ind].checked = false;
        popupTicketTypeOptions[ind].checked = false;
        if (ind === parseInt(ticketTypeInd)) {
          option.checked = true;
          ticketTypeInputs[ind].checked = true;
          popupTicketTypeOptions[ind].checked = true;
        }
      })

      oneBasicTicketAmount.forEach(elem => elem.textContent = ( ticketTypeInd !== null ) ? BASIC_TICKET_AMOUNT * TYPE_COEFFS[ticketTypeInd] : BASIC_TICKET_AMOUNT);
      oneSeniorTicketAmount.forEach(elem => elem.textContent = ( ticketTypeInd !== null ) ? SENIOR_TICKET_AMOUNT * TYPE_COEFFS[ticketTypeInd] : SENIOR_TICKET_AMOUNT);
      break;

    case 'tickets-total-amount-value':
      const ticketsTotalAmountArray = Array.from(document.querySelectorAll('.js-tickets-total-amount-value'));
      const basicTicketsAmountValue = Number(document.querySelector('.js-basic-tickets-amount-value').innerHTML);
      const seniorTicketsAmountValue = Number(document.querySelector('.js-senior-tickets-amount-value').innerHTML);
      const totalAmountValue = basicTicketsAmountValue + seniorTicketsAmountValue;

      ticketsTotalAmountArray.forEach(elem => elem.innerHTML = totalAmountValue);
      break;

    case 'ticket-info-time':
      const time = localStorage.getItem('louvre-ticket-info-time') || 'Time';
      popupTicketInfoTime.innerHTML = time;
      popupInputTimeOptionTitle.innerHTML = time;
      break;

    case 'ticket-info-date':
      const date = localStorage.getItem('louvre-ticket-info-date') || 'Date';
      popupTicketInfoDate.innerHTML = (date === 'Date') ? 'Date' : formatDate(new Date(date));
      popupInputDateButton.value = date;
      break;

    case 'all':
      setValuesFromLocalStorage('ticket-type');
      setValuesFromLocalStorage('ticket-basic');
      setValuesFromLocalStorage('ticket-senior');
      setValuesFromLocalStorage('tickets-total-amount-value');
      setValuesFromLocalStorage('ticket-info-time');
      setValuesFromLocalStorage('ticket-info-date');
      break;

    default:
      break;
  }
}

function addZeroForDigit(number, isAdd = false) {
  return ( isAdd && number > 0 && number < 10 ) ? '0' + number : number;
}