const express = require('express');
const Product = require('../models/product');
const { auth } = require('../middleware/auth');

const router = new express.Router;


router.post('/product', auth, async (req, res) => {
    try {
        const product = new Product({ ...req.body, seller: req.user._id });
        await product.save();
        res.status(201).send(product);
    } catch (e) {
        console.log(e);
    }
});

router.get('/products', auth, async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('owner')
            .populate('categoryId')
            .exec((err, results) => {
                if (err) throw new Error("Something Went Wrong");
                res.send(results);
            });

    } catch (e) {
        console.log(e);
    }
});

router.patch('/product/:id', auth, async (req, res) => {
    try {
        const allowedFields = ["name", "price", "discount", "rating", "description", "uom", "tax", "taxType", "seller"];
        const id = req.params.id;
        const product = await Product.findById(id);
        allowedFields.forEach(field => {
            if (product.toObject().hasOwnProperty(field)) {
                product[field] = req.body[field] || product[field];
            }
        });
        product.save();
        res.send(product);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/product/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        res.send(product);
    } catch (e) {
        console.log(e);
    }
});

router.get('/product/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.send(product);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;