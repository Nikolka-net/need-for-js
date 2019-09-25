const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'), /* игровое поле */
    car = document.createElement('div'), /* создаём новый элемент div, машину */
    music = document.createElement('embed'); /* + музыку */

music.setAttribute('src', './audio.mp3');
music.setAttribute('type', 'audio/mp3');
music.classList.add('music');

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
    return Math.ceil(gameArea.offsetHeight / heightElement); /* высоту стр. / на параметр, чтобы узнать коли-во линий */
}

function startGame() {
    start.classList.add('hide'); //запуск функции
    gameArea.innerHTML = ''; /* очистка поля перед след. стартом */

    for (let i = 0; i < getQuantityElements(100) + 1; i++) {/* добавл. линии на дороге через цикл, 100px длина линии */
        const line = document.createElement('div'); /* созд. линию */
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';    /* в стили добавл. высоту между линиями 100px */
        line.y = i * 100; /* добавл. свойство элементу line y */
        gameArea.appendChild(line); /* + класс в gameArea */
    }


    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {/* созд. др. cars, сложность зависит от traffic */
        const enemy = document.createElement('div');
        let enemyImg = Math.floor((Math.random() * 2) + 1); /* для выбора случайных машин */
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1); /* расстояние м/у др. cars в зависимости от сложности - traffic */
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; /* случайное положение от ширины дороги; округляем это значение; 50 ширина авто, чтобы не выезжал за край */
        enemy.style.top = enemy.y + 'px'; /* расстояние от верха игрового пространства */
        enemy.style.background = `transparent url(./images/enemy${enemyImg}.png) no-repeat center / cover`;
        gameArea.appendChild(enemy);
    }

    setting.score = 0; /* изначально 0 очков */
    setting.start = true;    /* смена при старте */
    gameArea.appendChild(car); /* вставляем в поле дочер. элемент - машину */
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2; /* задаём расположение нашего авто, высч. его центр */
    car.style.top = 'auto'; /* задаём расположение нашего авто */
    car.style.bottom = '10px';
    gameArea.appendChild(music); /* вставляем в поле дочер. элемент - music */
    setting.x = car.offsetLeft;  /* добавляем свойство left, x координата по гориз. оси  */
    setting.y = car.offsetTop;  /* добавляем свойство top, y координата по вертик. оси  */

    requestAnimationFrame(playGame); /* вызов функции playGame - отрисовка в браузере след. шага */
}

function playGame() {
    if (setting.start) {   /* (setting.start === true) пока true, игра будет выполняться, (setting.start) */
        setting.score += setting.speed; /* увеличиваем очки в зависи-и от скорости */
        score.innerHTML = 'SCORE<br>' + setting.score; /* выводим значение на стр. */
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
    } else {
        music.remove();
    }
}

function startRun(event) {
    event.preventDefault(); //чтобы при нажатии клавиши не скролить страницу
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;//key узнаём какая клавиша, передаём ей значение true в const keys
    }
}

function stopRun(event) {
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;  //при отпускании клавиши опять falce, машина останавливается
    }
}

/* Метод hasOWnProperty(исключает попадание др. клавиш в keys) можно заменить на см. ниже */
/* if (event.key in keys) {
    keys[event.key] = false;
} */

/* if (keys.hasOwnProperty(event.key)) { 
    keys[event.key] = true;
} */




function moveRoad() { /* для движения линий */
    let lines = document.querySelectorAll('.line'); /* получаем все линии на стр. */
    lines.forEach(function (line) {       /* перебор элементов внутри функции */
        line.y += setting.speed; /* меняем линии */
        line.style.top = line.y + 'px';

        if (line.y >= gameArea.offsetHeight) { /* если y > высоты страницы */
            line.y = -100; /* поднимаем y наверх так, чтобы не видно было как появл. линии*/
        }
    });
}

function moveEnemy() { /* для появления др. машин */
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect(); /* обращаемся к др. авто */

        if (carRect.top <= enemyRect.bottom && /* до переда car < чем до багажника enemy от верх. края дороги */
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false; /* при этих условиях останавливаем игру */
            console.warn('ДТП');
            start.classList.remove('hide'); /* удаляем класс hide, чтобы появ. начать игру */
            start.style.top = score.offsetHeight; /* сдвигаем очки вниз на высоту кнопки старта */
        }

        item.y += setting.speed / 2; /* + скорость; "/2" чтобы cars двигались, < их скорость */
        item.style.top = item.y + 'px'; /* присваиваем значение */
        if (item.y >= gameArea.offsetHeight) {
            item.y = -100 * setting.traffic; /*возврат cars вверх с сохра-м traffic(плотности движения)  */
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'; /* Чтобы авто выстраивались рандомно(случайно) */
        }
    });

}