const mongoose = require('mongoose');
const Schema = mongoose.Schema; // подключение сх

// модель бд
const filmsSchema = new Schema({
    name: { // название фильма 
        type: String, // тип данных
        required: true // обязательное поле
    },
    genre: { // жанр фильма
        type: String,
        required: true
    },
    country: { // страна выпуска фильма
        type: String,
        required: true
    },
    pic: { // обложка фильма
        type: String,
        required: true
    },
    description: { // описание фильма
        type: String,
        required: true
    },
    rating: { // рейтинг фильма 
        type: Number
    },
    agelimit: { // возрастной огран
        type: Number
    }
}, { timestamps: true });

const Film = mongoose.model('Films', filmsSchema); 

module.exports = Film;