const express = require('express');
const Category = require('../models/category');
const { auth } = require('../middleware/auth');


const router = new express.Router;

router.post('/category/add', auth, async (req, res) => {
    try {
        const category = new Category({
            ...req.body,
            createdBy: req.user._id
        });
        await category.save();
        res.status(201).send(category);
    } catch (e) {
        console.log(e)
    }
});

router.patch('/category/update/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const { name, parent } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name, parent });
        res.send(category);
    } catch (e) {
        console.log(e)
    }
});

router.get('/category/list', auth, async (req, res) => {
    try {
        const list = await Category.find({});
        res.send(list);
    } catch (e) {
        console.log(e);
    }
});

router.get('/category/:id', auth, async (req, res) => {
    try {
        const id= req.params.id;
        const category = await Category.findById(id);
        res.send(category);
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;