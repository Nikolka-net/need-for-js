const url = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: require('path').join(__dirname, 'index.html')
});

const { app, BrowserWindow } = require('electron'); /* получение констате при подкл. электрона */

let win; /* отвеч. за состояние нашего приложения */

function createWindow() { /* помещаем объект на основе BrowserWindow */
    win = new BrowserWindow({
        width: 500, /* размеры окна */
        height: 850
    });

    win.loadURL(url); /* передаем в win наш url */

    win.on('closed', function () { /* при нажатии на закрыть передаём пустоту, ничего в ней не будет */
        win = null;
    });
}

app.on('ready', createWindow); /* обращаемся к app для запуска приложения */

app.on('window-all-closed', function () {
    app.quit(); /* запуск функции для linux and mac, чтоб при закрытии приложение закрывалось, а не уходило в спящий режим */
});