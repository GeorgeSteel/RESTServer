require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse JSON
app.use(bodyParser.json());

app.use(require('./routes/user'));

mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true }, (err, res) => {
    if(err) throw err;
    console.log('mongoDB Connected');
});

app.listen(process.env.PORT, () => {
    console.log('Waiting for connections at port: ', process.env.PORT);
});