const express = require('express');
const Order = require('../models/order');
const { auth } = require('../middleware/auth');
const { placeOrder, getOrderDetail, deleteOrder, getAllOrder,
    updateOrder } = require('../controller/order');

const router = new express.Router;

router.post('/order', auth, placeOrder);

router.get('/order/:id', auth, getOrderDetail);

router.delete('/order/:id', auth, deleteOrder);

router.get('/orders', auth, getAllOrder)

router.post('/order/status/:id', auth, updateOrder)

module.exports = router;