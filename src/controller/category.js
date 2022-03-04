const Category = require('../models/category');
const User = require('../models/user');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');

const addCategory = async (req, res, next) => {
    try {
        const category = new Category({
            ...req.body,
            createdBy: req.user._id
        });
        await category.save();

        next(ApiSuccess.created(category));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, parent } = req.body;
        await Category.findByIdAndUpdate(id, { name, parent }).populate('createdBy');
        const category = await Category.findById(id);
        next(ApiSuccess.ok(category));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const listCategory = async (req, res, next) => {
    try {
        const list = await Category.find({}).populate('createdBy');
        next(ApiSuccess.ok(list));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const getCategory = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id).populate('createdBy');
        next(ApiSuccess.ok(category));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}
module.exports = {
    addCategory,
    updateCategory,
    listCategory,
    getCategory
}