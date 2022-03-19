const express = require('express');
const Product = require('../models/product');
const { auth } = require('../middleware/auth');
const { addNewProduct, listProducts, updateProduct, deleteProduct, getSpecificProduct, uploadProductImage, showProductImage } = require('../controller/products');
const router = new express.Router;
const multer = require('multer');
const { route } = require('express/lib/application');

const upload = multer();

router.post('/product', auth, addNewProduct);

router.get('/products', auth, listProducts);

router.patch('/product/:id', auth, updateProduct);

router.delete('/product/:id', auth, deleteProduct);

router.get('/product/:id', auth, getSpecificProduct);

router.post('/product/image/:id', auth, upload.single('productImage'), uploadProductImage);

router.get('/product/image/:id/preview', showProductImage);

module.exports = router;