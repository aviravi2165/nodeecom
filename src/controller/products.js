const Product = require('../models/product');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');

const addNewProduct = async (req, res, next) => {
    try {
        const product = new Product({ ...req.body, owner: req.user._id });
        await product.save();
        next(ApiSuccess.created(product));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}


// sort=field_ASC/DSC
//limit=50
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
        if(req.query.limit){
            limit = Number(req.query.limit);
        }
        if(req.query.skip){
            skip = Number(req.query.skip)-1;
        }


        const products = await Product.find({})
            .populate('owner')
            .sort(sortParam)
            .limit(limit)
            .skip(skip);

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

module.exports = {
    addNewProduct,
    listProducts,
    updateProduct,
    deleteProduct,
    getSpecificProduct
};