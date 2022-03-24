const mongoose = require('mongoose');
const Category = require('./category');
const User = require('./user');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        validate(val) {
            if (val < 1) throw new Error("Price must be higher that 1");
        }
    },
    discount: {
        type: Number,
        default: 0,
        validate(val) {
            if (val < 0) throw new Error("Discount must be a positive number");
        }
    },
    rating: {
        type: Number,
        default: 0
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    description: {
        type: String
    },
    uom: {
        type: String,
        required: true
    },
    tax: {
        type: Number,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

productSchema.methods.toJSON = function(){
    const updatedProduct = this.toObject();
    return updatedProduct;
}

const Product = mongoose.model("Product", productSchema);

module.exports = Product;