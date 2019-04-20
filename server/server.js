require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse JSON
app.use(bodyParser.json());

// use public folder
app.use(express.static(path.resolve(__dirname, '../public')));

// Routes
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if(err) throw err;
    console.log('mongoDB Connected');
});

app.listen(process.env.PORT, () => {
    console.log('Waiting for connections at port: ', process.env.PORT);
});