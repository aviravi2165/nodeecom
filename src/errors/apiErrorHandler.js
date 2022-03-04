const ApiError = require('./apiError');

const apiErrorHandler = function (err, req, res, next) {

    if (err instanceof ApiError) {
        const respose = {
            status: err.status,
            errorMessage:err.msg
        }
        res.status(err.status).send(respose);
        return;
    }
    res.status(500).send("Something Went Wrong");
}

module.exports = apiErrorHandler;