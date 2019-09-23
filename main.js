const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'), /* игровое поле */
    car = document.createElement('div'); /* создаём новый элемент, машину */

car.classList.add('car');

const setting = { /* объект: количество очков, скорость */
    start: false,
    score: 0,
    speed: 3
};


start.addEventListener('click', startGame);   // обработчик события
document.addEventListener('keydown', startRun);   //при нажатии на любую клавишу
document.addEventListener('keyup', stopRun);   //при отпускании клавиши


function startGame() {
    start.classList.add('hide');  //запуск функции
    setting.start = true;  /* смена при старте */
    gameArea.appendChild(car); /* вставляем в поле дочер. элемент - машину */
    requestAnimationFrame(playGame); /* вызов функции playGame - отрисовка в браузере след. шага */
}

function playGame() {
    console.log('Play game!');
    if (setting.start) { /* (setting.start === true) пока true, игра будет выполняться, (setting.start) */
        requestAnimationFrame(playGame); /* игра запускалась вновь - рекурсия */
    }
}

function startRun(event) {
    event.preventDefault(); //чтобы при нажатии клаиши не скролить страницу
    keys[event.key] = true;   //key узнаём какая клавиша, передаём ей значение true в const keys
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;  //при отпускании клавиши опять falce, машина останавливается
}

/* Названия клавиш */
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};