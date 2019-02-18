const express = require('express');
const app = express();
const { checkToken, checkRole } = require('../middlewares/authentication');
const ProductSchema = require('../models/product');

app.get('/products', checkToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 10;
    limit = Number(limit);

    ProductSchema.find({disponible: true})
                 .skip(from)
                 .limit(limit)
                 .populate('user', 'name email')
                 .populate('category', 'description')
                 .exec((err, products) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        products
                    });
                 })
});

app.get('/product/:id', checkToken, (req, res) => { 
    let id = req.params.id;

    ProductSchema.findById(id)
                 .populate('user', 'name email')
                 .populate('category', 'description')
                 .exec((err, productDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
            
                    if (!productDB) {
                        return res.status(400).json({
                            ok: false,
                            err: {
                                msg: 'The ID is not valid'
                            }
                        });
                    }
            
                    res.json({
                        ok: true,
                        product: productDB
                    });
                 });
});

app.post('/product', checkToken, (req, res) => {
    let body = req.body;
    let product = new ProductSchema({
        user: req.user._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    product.save((err,productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            product: productDB
        });
    })
});

app.put('/product/:id', checkToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    ProductSchema.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: `The product don't exists`
                }
            });
        }

        productDB.nombre = body.nombre;
        productDB.precioUni = body.precioUni;
        productDB.categoria = body.categoria;
        productDB.disponible = body.disponible;
        productDB.descripcion = body.descripcion;

        productDB.save((err, productSaved) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: productSaved
            });
        });

    });
});

app.delete('/product/:id', checkToken, (req, res) => { 
    let id = req.params.id;
    ProductSchema.findById(id, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'The ID is not valid'
                }
            });
        }

        productDB.disponible = false;

        productDB.save((err, deletedProduct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: deletedProduct,
                msg: 'Deleted Product'
            });
        });

    });
});

module.exports = app;