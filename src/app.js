require('./db/mongoose');
const express = require('express');
const userRouter = require('./routers/users');
const orderRouter = require('./routers/order');
const cartRouter = require('./routers/cart');
const productRouter = require('./routers/product');

const app = express();

app.use(userRouter);
app.use(orderRouter);
app.use(productRouter);
app.use(cartRouter);

module.exports = app;