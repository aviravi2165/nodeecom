const Category = require('../models/category');
const User = require('../models/user');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');
const fs = require('fs');


const uploadFileMulter = require('../uploader/fileupload');
const upload = uploadFileMulter('./uploads/categories', 'category_image_', 'categoryUpload');

const addCategory = async (req, res, next) => {
    try {
        let data = {};
        const allowedFields = ['name', 'parent'];
        allowedFields.forEach(allowed => {
            if (req.body.hasOwnProperty(allowed)) {
                data[allowed] = req.body[allowed];
            }
        });
        const category = new Category({
            ...data,
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

//sort=fieldName:ARC/DSC
//limit=10
//skip=page number
const listCategory = async (req, res, next) => {
    try {
        let limit = {};
        let skip = {};
        let sort = {};
        if (req.query.limit) {
            limit = req.query.limit;
        }
        if (req.query.skip) {
            skip = (req.query.skip - 1) * limit;
        }
        if (req.query.sort) {
            const sortOn = req.query.sort.split(':');
            sort[sortOn[0]] = sortOn[1] == "DSC" ? -1 : 1;
        }
        const list = await Category.find({}).populate('createdBy').sort(sort).limit(limit).skip(skip);
        if (list.length < 1) {
            throw new Error("No Records Found")
        };
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

const uploadCategoryImage = async (req, res, next) => {
    const id = req.params.id;
    upload(req, res, async function (err) {
        try {
            if (err) {
                throw new Error(err);
            }
            const category = await Category.findById(id);
            if (!category) {
                throw new Error("Category not found");
            }
            const categoryUpdated = await Category.findByIdAndUpdate(id, { image: req.file.filename });
            if (!categoryUpdated) {
                throw new Error("Something went wrong");
            }
            next(ApiSuccess.ok("Category Image Uploaded"));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    });
}

const showCategoryImage = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findById(id).select('image');
    let image;
    if (!category.image) {

    }
    fs.readFile(`./uploads/categories/${category.image}`, function (err, data) {
        const ext = category.image.slice(category.image.lastIndexOf('.') + 1);
        res.set('Content-Type', `image/${ext}`);
        res.send(data);
    });
}


module.exports = {
    addCategory,
    updateCategory,
    listCategory,
    getCategory,
    uploadCategoryImage,
    showCategoryImage
}