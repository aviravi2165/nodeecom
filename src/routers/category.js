const express = require('express');
const Category = require('../models/category');
const { auth } = require('../middleware/auth');
const { addCategory, updateCategory, listCategory, getCategory } = require('../controller/category');

const router = new express.Router;

router.post('/category/add', auth, addCategory);

router.patch('/category/update/:id', auth, updateCategory);

router.get('/category/list', auth, listCategory);

router.get('/category/:id', auth, getCategory);

module.exports = router;