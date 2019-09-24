const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'), /* игровое поле */
    car = document.createElement('div'); /* создаём новый элемент div, машину */

car.classList.add('car'); //созданному div добавляем класс car

const setting = { /* объект: количество очков, скорость */
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

/* Названия клавиш */
const keys = {
    'ArrowUp': false,  //свойства и их значения
    'ArrowDown': false,
    'ArrowRight': false,
    'ArrowLeft': false
};

start.addEventListener('click', startGame);   // обработчик события click, слушатель событий
document.addEventListener('keydown', startRun);   //при нажатии на любую клавишу
document.addEventListener('keyup', stopRun);   //при отпускании клавиши

function getQuantityElements(heightElement) { /* возвр. коли-во эл.(линий), необходимых для стр. */
    return document.documentElement.clientHeight / heightElement + 1; /* высоту стр. / на параметр, чтобы узнать коли-во линий */
}

function startGame() {
    start.classList.add('hide'); //запуск функции

    for (let i = 0; i < getQuantityElements(100); i++) {/* добавл. линии на дороге через цикл, 100px длина линии */
        const line = document.createElement('div'); /* созд. линию */
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';    /* в стили добавл. высоту между линиями 100px */
        line.y = i * 100; /* добавл. свойство элементу line y */
        gameArea.appendChild(line); /* + класс в gameArea */
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {/* созд. др. cars, сложность зависит от traffic */
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1); /* расстояние м/у др. cars в зависимости от сложности - traffic */
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; /* случайное положение от ширины дороги; округляем это значение; 50 ширина авто, чтобы не выезжал за край */
        enemy.style.top = enemy.y + 'px'; /* расстояние от верха игрового пространства */
        enemy.style.background = 'transparent url(./images/enemy2.png) no-repeat center / cover';
        gameArea.appendChild(enemy);
    }

    setting.start = true;    /* смена при старте */
    gameArea.appendChild(car); /* вставляем в поле дочер. элемент - машину */
    setting.x = car.offsetLeft;  /* добавляем свойство left, x координата по гориз. оси  */
    setting.y = car.offsetTop;  /* добавляем свойство top, y координата по вертик. оси  */

    requestAnimationFrame(playGame); /* вызов функции playGame - отрисовка в браузере след. шага */
}

function playGame() {
    if (setting.start) {   /* (setting.start === true) пока true, игра будет выполняться, (setting.start) */
        moveRoad();   /* функция движение дороги */
        moveEnemy(); /* запуск др. машин */
        if (keys.ArrowLeft && setting.x > 0) { /* при нажатии налево < на единицу, зависит от скорости; ширина > 0*/
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) { /* не < шир. дороги - шир. car>; на 1 */
            setting.x += setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) { /* < высоты дороги и авто */
            setting.y += setting.speed; /* при нажатии вниз сдвиг будет по вертикали */
        }
        if (keys.ArrowUp && setting.y > 0) { /* car не должен упир. в верх. */
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + 'px';  /* передаём в стили изменение left в px */
        car.style.top = setting.y + 'px'; /* изменения в top */
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


function moveRoad() { /* для движения линий */
    let lines = document.querySelectorAll('.line'); /* получаем все линии на стр. */
    lines.forEach(function (line) {       /* перебор элементов внутри функции */
        line.y += setting.speed; /* меняем линии */
        line.style.top = line.y + 'px';

        if (line.y >= document.documentElement.clientHeight) { /* если y > высоты страницы */
            line.y = -100; /* поднимаем y наверх так, чтобы не видно было как появл. линии*/
        }
    });
}

function moveEnemy() { /* для появления др. машин */
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function (item) {
        item.y += setting.speed / 2; /* + скорость; "/2" чтобы cars двигались, < их скорость */
        item.style.top = item.y + 'px'; /* присваиваем значение */
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic; /*возврат cars вверх с сохра-м traffic(плотности движения)  */
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; /* Чтобы авто выстраивались рандомно(случайно) */
        }
    });

}