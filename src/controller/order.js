const Order = require('../models/order');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');

const placeOrder = async (req, res, next) => {
    try {
        const order = new Order({ ...req.body, user_id: req.user._id });
        await order.save();
        next(ApiSuccess.created(order));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
};
const getOrderDetail = async (req, res, next) => {
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
        next(ApiSuccess.ok(order));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
};
const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, user_id: req.user._id }).populate('user_id').populate('details.product_id');
        if (order.length < 1) throw new Error("No order found!");
        next(ApiSuccess.ok(order));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
};
const getAllOrder = async (req, res, next) => {
    try {
        const orders = await Order.find({ user_id: req.user._id }).populate('user_id').populate('details.product_id');
        next(ApiSuccess.ok(order));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
};
const updateOrder = async (req, res, next) => {
    try {
        await Order.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { status: req.body.status }).populate('user_id');
        const order = await Order.find({ _id: req.params.id, user_id: req.user._id });
        next(ApiSuccess.ok(order));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
};

module.exports = {
    placeOrder,
    getOrderDetail,
    deleteOrder,
    getAllOrder,
    updateOrder
}