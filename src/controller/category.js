const Category = require('../models/category');
const User = require('../models/user');
const addCategory = async (req, res) => {
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
}

const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, parent } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name, parent }).populate('createdBy');
        res.send(category);
    } catch (e) {
        console.log(e)
    }
}

const listCategory = async (req, res) => {
    try {
        const list = await Category.find({}).populate('createdBy');
        res.send(list);
    } catch (e) {
        console.log(e);
    }
}

const getCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id).populate('createdBy');
        res.send(category);
    } catch (e) {
        console.log(e)
    }
}
module.exports = {
    addCategory,
    updateCategory,
    listCategory,
    getCategory
}