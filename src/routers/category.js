const express = require('express');
const Category = require('../models/category');
const { auth } = require('../middleware/auth');
const { addCategory, updateCategory, listCategory, getCategory, uploadCategory, showCategoryImage } = require('../controller/category');
const multer = require('multer');
const upload = multer();

const router = new express.Router;

router.post('/category/add', auth, addCategory);

router.patch('/category/update/:id', auth, updateCategory);

router.get('/category/list', auth, listCategory);

router.get('/category/:id', auth, getCategory);

router.post('/category/image/:id', auth, upload.single('categoryUpload'), uploadCategory);

router.get('/category/image/:id/preview',  showCategoryImage);

module.exports = router;