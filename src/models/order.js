const mongoose = require('mongoose');
const Product = require('./product');
const User = require('./user');
const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    invoice_id: {
        type: Number,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    payment_type: {
        type: String,
        require: true
    },
    status: {
        type: Number,
    },
    tax_type: {
        type: String,
        required: true
    },
    details: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
        qty: {
            type: Number,
            required: true
        },
        rate: {
            type: Number,
            required: true
        },
        tax_per: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        }
    }]
});

orderSchema.methods.toJSON = function(){
    const order = this.toObject();
    delete order.user_id.password;
    delete order.user_id.tokens;
    delete order.details.owner;
    console.log(order)
    return order;
}

const Order = new mongoose.model("Order",orderSchema);

module.exports = Order;