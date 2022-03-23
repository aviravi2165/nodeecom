const express = require('express');
const Product = require('../models/product');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const { addNewProduct, listProducts, updateProduct, deleteProduct, getSpecificProduct, showProductImage, uploadProductImage, uploadProductImageLoc } = require('../controller/products');
const router = new express.Router;
const uploadBuffer = multer(); 

router.post('/product', auth, addNewProduct);

router.get('/products', auth, listProducts);

router.patch('/product/:id', auth, updateProduct);

router.delete('/product/:id', auth, deleteProduct);

router.get('/product/:id', auth, getSpecificProduct);

router.post('/product/image/:id', auth, uploadBuffer.single('productImage'), uploadProductImage);

router.post('/product/imageloc/:id', auth, uploadProductImageLoc);

router.get('/product/image/:id/preview', showProductImage);

module.exports = router;