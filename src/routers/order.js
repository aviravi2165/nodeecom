const express = require('express');
const Order = require('../models/order');
const { auth } = require('../middleware/auth');
const router = new express.Router;

router.post('/order', auth, async (req, res) => {
    try {
        const order = new Order({ ...req.body, user_id: req.user._id });
        await order.save();
        res.send(order);
    } catch (e) {
        console.log(e);
    }
});

router.get('/order/:id', auth, async (req, res) => {
    try {
        const order = await Order.find({ _id: req.params.id, user_id: req.user._id }).populate('user_id');
        if (order.length < 1) throw new Error("No order found!");
        res.send(order);
    } catch (e) {
        console.log(e);
    }
});

router.delete('/order/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, user_id: req.user._id }).populate('user_id');
        if (order.length < 1) throw new Error("No order found!");
        res.send(order);
    } catch (e) {
        console.log(e);
    }
});

router.get('/orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id }).populate('user_id');
        res.send(orders);
    } catch (e) {
        console.log(e)
    }
})

router.post('/order/status/:id', auth, async (req, res) => {
    try {
        await Order.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { status: req.body.status }).populate('user_id');
        const order = await Order.find({ _id: req.params.id, user_id: req.user._id });
        res.send(order);
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;