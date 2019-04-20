const express = require('express');
const app = express();
const UserSchema = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, 
    });
    const payload = ticket.getPayload();

    const { name, picture, email } = payload;
    return {
        name,
        img: picture,
        email,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
                            .catch(e => {
                                return res.status(403).json({
                                    ok: false,
                                    error: e
                                });
                            });

    UserSchema.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: { message: "Autentiquese de manera normal" }
                });                
            } else {
                let token = jwt.sign({
                    userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRES });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            let user = new UserSchema();
            const { name, img, email, google } = googleUser;
            user.name = name;
            user.img = img;
            user.email = email;
            user.google = google;
            user.password = 'lol';

            user.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRES });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });
});

module.exports = app;