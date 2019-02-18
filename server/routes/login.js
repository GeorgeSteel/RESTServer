const express = require('express');
const app = express();
const UserSchema = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    let body = req.body;

    UserSchema.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!user) {
            return res.status(400).json({
                ok: false,
                err: { msg: 'Incorrect user or password' }
            });            
        }

        if (!bcrypt.compareSync(body.password, user.password)){
            return res.status(400).json({
                ok: false,
                err: { msg: 'Incorrect user or password' }
            });
        }

        let token = jwt.sign({
            user
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRES });

        res.json({
            ok: true,
            user,
            token
        });
    });
});

module.exports = app;