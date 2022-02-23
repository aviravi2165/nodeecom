require('./db/mongoose');
const express = require('express');
const userRouter = require('./routers/users');
const orderRouter = require('./routers/order');
const cartRouter = require('./routers/cart');
const productRouter = require('./routers/product');
const categoryRouter = require('./routers/category');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(orderRouter);
app.use(cartRouter);

module.exports = app;