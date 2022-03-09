const Order = require('../models/order');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');
const placeOrder = async (req, res, next) => {
    try {
        const allowedFieldsHead = ['invoice_id', 'address', 'payment_type', 'status', 'tax_type'];
        const allowedFieldsItems = ['product_id', 'qty', 'rate', 'tax_per', 'discount'];
        let data = { details: [] };

        allowedFieldsHead.forEach(f => {
            if (req.body.hasOwnProperty(f)) {
                data[f] = req.body[f];
            }
        });
        req.body.details.forEach(row => {
            let temp = {};
            allowedFieldsItems.forEach(f => {
                if (row.hasOwnProperty(f)) {
                    temp[f] = row[f];
                }
            });
            data.details.push(temp);
        });
        const order = new Order({ ...data, user_id: req.user._id });
        await order.save();
        next(ApiSuccess.created(order));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
};

//sort=fieldName_ASC/DSC
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
        }).sort(sortParams);

        if (order.length < 1) throw new Error("No Records Found!");
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
        let sortParams = {};
        let limit = {};
        let skip = {};
        if (req.query.sort) {
            const sortOn = req.query.sort.split(":");
            sortParams[sortOn[0]] = sortOn[1] === 'DSC' ? -1 : 1;
            console.log(sortParams)
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        if (req.query.skip) {
            skip = (req.query.skip - 1) * limit;
        }
        const orders = await Order.find({ user_id: req.user._id }).populate('user_id').populate('details.product_id').sort(sortParams).limit(limit).skip(skip);
        next(ApiSuccess.ok(orders));
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