const Product = require('../models/product');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');
const uploadFileMulter = require('../uploader/fileupload');
const upload = uploadFileMulter('./uploads/products', 'product_name_', 'productImage');
const fs = require('fs');
const path = require('path');

const addNewProduct = async (req, res, next) => {
    try {
        const product = new Product({ ...req.body, owner: req.user._id });
        await product.save();
        next(ApiSuccess.created(product));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}


// sort=fieldName_ASC/DSC
//limit=50
//skip=2
//match=fieldName_value
const listProducts = async (req, res, next) => {
    try {
        let limit;
        let skip = {};
        let sortParam = {};
        let match = {};

        if (req.query.sort) {
            const sortOn = req.query.sort.split('_');
            sortParam[sortOn[0]] = sortOn[1] === 'D' ? -1 : 1;
        }
        if (req.query.limit) {
            limit = Number(req.query.limit);
        }
        if (req.query.skip) {
            skip = (Number(req.query.skip) - 1) * limit;
        }
        if (req.query.match) {
            const allowedFields = ['name', 'uom', 'owner', 'categoryId'];
            const matchOn = req.query.match.split("_");
            if (!allowedFields.some(field => field === matchOn[0]))
                throw new Error("Match field is not allowed");
            match[matchOn[0]] = matchOn[1];
        }
        // const products = await Product.find(match)
        //     .populate('owner')
        //     .populate('categoryId')
        //     .sort(sortParam)
        //     .limit(limit)
        //     .skip(skip);

        const products = await Product.find()
            .populate('owner')
            .populate('categoryId')
            .sort(sortParam)
            .limit(limit)
            .skip(skip);


        // const products = await Product.aggregate.lookup({
        //     from: 'categories',
        //     localField: 'categoryId',
        //     foreignField: '_id',
        //     as: 'cat_name'
        // });

        // const products = await Product.aggregate([
        //     { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'catName' } },
        //     { $match: {} },
        //     { $group: { _id: '$catName.name', total: { $sum: '$price' } } },
        //     { $project: { 'Category Name': '$_id', 'Total': '$total', _id: 0 } }
        // ]);

        if (products.length < 1) throw new Error("No Records Found");
        next(ApiSuccess.ok(products));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const allowedFields = ["name", "price", "discount", "rating", "description", "uom", "tax", "taxType", "seller"];
        const id = req.params.id;
        const product = await Product.findById(id).populate('categoryId').populate('owner');
        allowedFields.forEach(field => {
            if (product.toObject().hasOwnProperty(field)) {
                product[field] = req.body[field] || product[field];
            }
        });
        product.save();
        next(ApiSuccess.ok(product));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id).populate('categoryId').populate('owner');
        next(ApiSuccess.ok(product));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const getSpecificProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id).populate('categoryId').populate('owner');
        next(ApiSuccess.ok(product));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const uploadProductImage = async (req, res, next) => {
    const id = req.params.id;
    upload(req, res, async function (err) {
        try {
            if (err) {
                throw new Error(err);
            }
            const product = await Product.findById(id);
            if (!product) {
                throw new Error("User Not found.");
            }

            const isUpdated = await Product.findByIdAndUpdate(id, { image: req.file.filename });
            if (!isUpdated) {
                throw new Error("Something went wrong.");
            }
            next(ApiSuccess.ok(res.json(isUpdated)));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    });
}

const showProductImage = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).select('image');
    let image = "";
    if (!product.image) {
    }
    fs.readFile(`./uploads/products/${product.image}`, function (err, data) {
        const ext = product.image.slice(product.image.lastIndexOf('.')+1);
        res.set('Content-Type', `image/${ext}`);
        res.send(data);
    });
}

module.exports = {
    addNewProduct,
    listProducts,
    updateProduct,
    deleteProduct,
    getSpecificProduct,
    uploadProductImage,
    showProductImage
};