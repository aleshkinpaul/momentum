const backToTopButton = document.querySelector('.back-to-top-button');
const buyTicketsImagesArray = ['0.png', '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];
const buyTicketsFrontImageElem = document.querySelector('.front-tickets-image');
const buyTicketsBackImageElem = document.querySelector('.back-tickets-image');
let currentFrontImageInd = 0;
let ticketsImagetranslationComplete = true;

if (window.scrollY > window.innerHeight / 2) backToTopButton.classList.remove('hidden');

document.addEventListener('scroll', () => {
  if (window.scrollY > window.innerHeight / 2) backToTopButton.classList.remove('hidden')
  else backToTopButton.classList.add('hidden');
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo(window.pageXOffset, 0);
});

buyTicketsFrontImageElem.addEventListener("transitionend", changeImages)

setInterval(() => {
  console.log(1);
  buyTicketsFrontImageElem.classList.add('ticket-image-hidden');
}, 5000);

function changeImages() {
  let currentBackImageInd = (currentFrontImageInd + 2) % buyTicketsImagesArray.length;
  currentFrontImageInd = (currentFrontImageInd + 1) % buyTicketsImagesArray.length;
  ticketsImagetranslationComplete = true;
  buyTicketsFrontImageElem.classList.remove('ticket-image-hidden');
  buyTicketsFrontImageElem.src = `./assets/img/buy-ticket/${buyTicketsImagesArray[currentFrontImageInd]}`;
  buyTicketsBackImageElem.src = `./assets/img/buy-ticket/${buyTicketsImagesArray[currentBackImageInd]}`;
}