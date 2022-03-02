const Order = require('../models/order');

const placeOrder = async (req, res) => {
    try {
        const order = new Order({ ...req.body, user_id: req.user._id });
        await order.save();
        res.send(order);
    } catch (e) {
        console.log(e);
    }
};
const getOrderDetail = async (req, res) => {
    try {
        const order = await Order.find({ _id: req.params.id, user_id: req.user._id }).populate('user_id').populate({
            path: 'details.product_id',
            populate: {
                path: 'categoryId',
                populate: {
                    path: 'parent'
                }
            }
        });
        if (order.length < 1) throw new Error("No order found!");
        res.send(order);
    } catch (e) {
        console.log(e);
    }
};
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, user_id: req.user._id }).populate('user_id').populate('details.product_id');
        if (order.length < 1) throw new Error("No order found!");
        res.send(order);
    } catch (e) {
        console.log(e);
    }
};
const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id }).populate('user_id').populate('details.product_id');
        res.send(orders);
    } catch (e) {
        console.log(e)
    }
};
const updateOrder = async (req, res) => {
    try {
        await Order.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { status: req.body.status }).populate('user_id');
        const order = await Order.find({ _id: req.params.id, user_id: req.user._id });
        res.send(order);
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    placeOrder,
    getOrderDetail,
    deleteOrder,
    getAllOrder,
    updateOrder
}