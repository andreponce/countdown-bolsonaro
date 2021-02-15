'use strict';
const moment = require('moment-timezone');
const express = require('express');
const app = express();
const router = express.Router();

const zone = 'America/Sao_Paulo';

app.disable('view cache');
app.use(express.static('public'));
app.set('view engine','ejs');
app.set('views', './public');
app.get('/', function(req, res) {
    res.render('./index',{currentTime:Date.now()});
});
app.post('/gettime', function(req, res) {    
    let time = (moment.tz("2023-01-01 00:00", zone).valueOf()-moment().tz(zone).valueOf());
    console.log('getting time',time);
    res.json({time:Math.max(0,time)});
});
app.post('/result', function(req, res) {
    let time = (moment.tz("2023-01-01 00:00", zone).valueOf()-moment().tz(zone).valueOf());
    console.log('getting result',time);
    if(time<=10000){

    }else res.send(`<script>function showResult(){console.log('Você é um viajante do tempo? Ainda não estamos em 2023.')}</script>`);
});

app.listen(3004);