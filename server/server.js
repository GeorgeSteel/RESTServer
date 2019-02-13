require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse JSON
app.use(bodyParser.json());

app.get('/usuario', (req, res) => {
    res.json('getUsuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            msg: 'The name is required'
        })
    }else {
        res.json({
            person: body
        });
    }    
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('deleteUsuario');
});

app.listen(process.env.PORT, () => {
    console.log('Waiting for connections at port: ', process.env.PORT);
});