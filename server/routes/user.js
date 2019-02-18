const express = require('express');
const app = express();
const UserSchema = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { checkToken, checkRole } = require('../middlewares/authentication');

app.get('/usuario', checkToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 10;
    limit = Number(limit);

    UserSchema.find({status:true}, 'name email role status google')
              .skip(from)
              .limit(limit)
              .exec((err, users) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                UserSchema.count({status:true}, (err, count) => {
                    res.json({
                        ok: true,
                        users,
                        count
                    });
                });                
              });
});

app.post('/usuario', [checkToken, checkRole], (req, res) => {
    let body = req.body;

    let user = new UserSchema({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/usuario/:id', [checkToken, checkRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    UserSchema.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });

    });

});

app.delete('/usuario/:id', [checkToken, checkRole], (req, res) => {
    let id = req.params.id;

    UserSchema.findByIdAndUpdate(id, {status:false}, {new: true},(err, deleteUser) => {
        if (err) {
            return  res.status(400).json({
                ok: false,
                err
            });
        }

        if (!deleteUser) {
            return res.status(400).json({
                ok: false,
                err: {message: `User don't finded`}
            });
        }

        res.json({
            ok: true,
            user: deleteUser
        });
    });

    // UserSchema.findByIdAndRemove(id, (err, deleteUser) => {
    //     if (err) {
    //         res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!deleteUser) {
    //         res.status(400).json({
    //             ok: false,
    //             err: {message: `User don't finded`}
    //         });
    //     }

    //     res.json({
    //         ok:true,
    //         user:deleteUser
    //     });
    // });
});

module.exports = app;
