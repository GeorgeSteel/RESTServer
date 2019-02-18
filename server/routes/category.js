const express = require('express');
const app = express();
const { checkToken, checkRole } = require('../middlewares/authentication');
const CategorySchema = require('../models/category');

app.get('/categories', checkToken, (req, res) => {
    CategorySchema.find({})
                  .sort('description')
                  .populate('user', 'name email')
                  .exec((err, categories) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        categories
                    });
                   });
});

app.get('/category/:id', checkToken, (req, res) => {
    let id = req.params.id;
    CategorySchema.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'The ID is not valid'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

app.post('/category', checkToken, (req, res) => {
    let body = req.body;
    let category = new CategorySchema({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

app.put('/category/:id', checkToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategory = {
        description: body.description
    };

    CategorySchema.findByIdAndUpdate(id, descCategory, {new: true, runValidators: true}, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })
});

app.delete('/category/:id', [checkToken, checkRole], (req, res) => {
    let id = req.params.id;

    CategorySchema.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: `The id doesn't exists`
                }
            });
        }

        res.json({
            ok: true,
            msg: 'Category has been deleted'
        })
    });
});

module.exports = app;