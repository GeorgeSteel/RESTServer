const express = require('express');
const app = express();
const UserSchema = require('../models/user');

app.get('/usuario', (req, res) => {
    res.json('getUsuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let user = new UserSchema({
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });

    // if (body.name === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         msg: 'The name is required'
    //     })
    // }else {
    //     res.json({
    //         person: body
    //     });
    // }    
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

module.exports = app;
