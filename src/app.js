require('./db/mongoose');
const express = require('express');
const userRouter = require('./routers/users');
const orderRouter = require('./routers/order');
const cartRouter = require('./routers/cart');
const productRouter = require('./routers/product');
const categoryRouter = require('./routers/category');
const welcomeRouter = require('./routers/welcome');
const apiErrorHandler = require('./errors/apiErrorHandler');
const apiSuccessHandler = require('./success/apiSuccessHandler');
const ApiError = require('./errors/apiError');

const app = express();

app.use(express.json());

app.use(welcomeRouter);
app.use(userRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(orderRouter);
app.use(cartRouter);

app.use(function (req, res, next) {
    const e = new Error("No Api Found");
    
    next(ApiError.notFound(e.message));
});
app.use(apiSuccessHandler);
app.use(apiErrorHandler);

module.exports = app;