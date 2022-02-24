const express = require('express');
const Product = require('../models/product');
const { auth } = require('../middleware/auth');
const { addNewProduct, listProducts, updateProduct, deleteProduct, getSpecificProduct } = require('../controller/products');
const router = new express.Router;


router.post('/product', auth, addNewProduct);

router.get('/products', auth, listProducts);

router.patch('/product/:id', auth, updateProduct);

router.delete('/product/:id', auth, deleteProduct);

router.get('/product/:id', auth, getSpecificProduct);

module.exports = router;