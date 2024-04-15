// npm i express mongodb mongoose body-parser
const express = require('express'); // импорт express
const app = express() // инициализация
const mongoose = require('mongoose'); // импорт mongoose
const db = 'mongodb+srv://nezuma:cKhkwGHJ2rRSX1Bq@films.ykhypmh.mongodb.net/?retryWrites=true&w=majority&appName=Films'; // строка подключения к mongodb
const PORT = 3000 // порт на котором работает сервер
const Film = require('./data/Films.js'); // импорт модели
const path = require('path'); // пути
const bodyParser = require('body-parser'); // бодипарсер
const temp = path.join(__dirname, 'index.html'); // путь где хранится index
//middleware
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, './')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



mongoose
    .connect(db) // подключение
    .then((res) => console.log('Connect to DB')) // успешное подключение
    .catch((error) => console.log(error)); // отлов ошибки

app.get('/:page', (req,res) => { //ропись страниц
    switch (req.params.page) { // берет из строки /
        case '/home': 
            res.sendFile(temp);
            break;
        case '/avatar':
            res.sendFile(temp); // собственно можно прописать что-то по типу сессий, для этого потребуется express-sessions
            break;
        default:
            res.redirect('/home');
            break;
    }
})

app.get('/films', async (req,res) => { // по этой ссылке можно обратится с любой страницы со стороны клиента.
    try {                              // и собственно с этой страницы и получить нужные данные.
        const films = await Film.find({});
        res.json(films);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'Server error'});
    }
});

app.post('/films/create', async (req, res) => { // создание фильма, через условную админку
    const { name, genre, country, pic, description, agelimit } = req.body // запрос с клиента
    /* 
    так как оценки скорее всего ставятся самими пользователями, мы их не присылаем, либо можно сделать запрос на imdb например,
    помимо этого, можно отдельно сделать свою систему оценивания, создав отдельный кластер с оценками и вычислять среднее.
     */
    const film = new Film({
        name, genre, country, pic, description, agelimit
    });
    film
        .save()
        .then((result) => res.send({message: 'Фильм успешно создан'})) // если успешно, на сайт придет ответ в виде message, который обработается на клиенте
        .catch((error) => {
            console.log(error); // при ошибке, та выведится в консоль
            res.render(createPath('error'), { title: 'Error' }) // и произойдет редирект на страницу ошибки, я бы конечно не делал так...
        })
});
app.listen(PORT, () => {
    console.log('...server started'); // колбэк, если сервер запущен
}); // запуск сервера