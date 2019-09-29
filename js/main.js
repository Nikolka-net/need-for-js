const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    music = document.createElement('embed');


let topScore = localStorage.getItem('topScore');
let topResult = document.querySelector('.topResult');

music.setAttribute('type', 'audio/mp3');
music.classList.add('music');

const crash = new Audio('./music/crash.mp3');
let allow = false;
crash.addEventListener('loadeddata', () => {
    allow = true;
});

car.classList.add('car');



const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
    level: 0
};


const keys = {
    'ArrowUp': false,
    'ArrowDown': false,
    'ArrowRight': false,
    'ArrowLeft': false
};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function getQuantityElements(heightElement) {
    return Math.ceil(gameArea.offsetHeight / heightElement);
}

function startGame(event) {

    if (event.target.classList.contains('start')) {
        return;
    }
    if (event.target.classList.contains('easy')) {
        setting.speed = 3;
        setting.traffic = 3;
    }
    if (event.target.classList.contains('medium')) {
        setting.speed = 5;
        setting.traffic = 3;
    }
    if (event.target.classList.contains('hard')) {
        setting.speed = 7;
        setting.traffic = 2;
    }

    start.classList.add('hide');
    gameArea.innerHTML = '';
    topResult.style.display = 'none';

    for (let i = 0; i < getQuantityElements(100) + 1; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }


    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        let enemyImg = Math.floor((Math.random() * 5) + 1);
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./images/enemy${enemyImg}.png) no-repeat center / cover`;
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    gameArea.appendChild(music);
    let audioChoice = Math.floor((Math.random() * 9) + 1);
    music.setAttribute('src', `./music/audio${audioChoice}.mp3`);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.score > 3000 && setting.level == 0) {
        ++setting.speed;
        ++setting.level;
    }
    else if (setting.score > 6000 && setting.level == 1) {
        ++setting.speed;
        ++setting.level;
    }
    else if (setting.score > 12000 && setting.level == 2) {
        ++setting.speed;
        ++setting.level;
    }
    setting.score += setting.speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && setting.x > 0) {
        setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
        setting.x += setting.speed;
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
        setting.y += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
        setting.y -= setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    if (setting.start) {
        requestAnimationFrame(playGame);
    } else {
        music.remove();
    }
}

function startRun(event) {
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
}

function stopRun(event) {
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
}

/* Метод hasOWnProperty(исключает попадание др. клавиш в keys) можно заменить на см. ниже */
/* if (event.key in keys) {
    keys[event.key] = false;
} */

/* if (keys.hasOwnProperty(event.key)) { 
    keys[event.key] = true;
} */




function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= gameArea.offsetHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top - 3 <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom - 5 >= enemyRect.top) {
            setting.start = false;
            console.warn('ДТП');

            if (topScore < setting.score) {
                localStorage.setItem('topScore', setting.score);
                topResult.style.display = 'block';
                topResult.innerHTML = 'Рекорд побит!';
            }

            if (allow) {
                crash.play();
            }
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= gameArea.offsetHeight) {
            let enemyImg = Math.floor((Math.random() * 5) + 1);
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            item.style.background = `transparent url(./images/enemy${enemyImg}.png) no-repeat center / cover`;
        }
    });

}