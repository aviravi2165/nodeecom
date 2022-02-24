const Product = require('../models/product');

const addNewProduct = async (req, res) => {
    try {
        const product = new Product({ ...req.body, owner: req.user._id });
        await product.save();
        res.status(201).send(product);
    } catch (e) {
        console.log(e);
    }
}



const listProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        .populate('owner')
        .populate('categoryId')
        .exec((err, results) => {
                if (err) throw new Error("Something Went Wrong");
                res.send(results);
            });
            
        } catch (e) {
            console.log(e);
        }
    }

    const updateProduct = async (req, res) => {
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
            res.send(product);
        } catch (e) {
            console.log(e);
        }
    }

    const deleteProduct =  async (req, res) => {
        try {
            const id = req.params.id;
            const product = await Product.findByIdAndDelete(id).populate('categoryId').populate('owner');
            res.send(product);
        } catch (e) {
            console.log(e);
        }
    }

    const getSpecificProduct =  async (req, res) => {
        try {
            const id = req.params.id;
            const product = await Product.findById(id).populate('categoryId').populate('owner');
            res.send(product);
        } catch (e) {
            console.log(e);
        }
    }

    module.exports = {
        addNewProduct,
        listProducts,
        updateProduct,
        deleteProduct,
        getSpecificProduct
    };