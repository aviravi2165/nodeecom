const ApiSuccess = require('./apiSuccess');

const apiSuccessHandler = function (suc, req, res, next) {

    if (suc instanceof ApiSuccess) {
        const responseData = {
            status:suc.status,
            message:suc.message,
            response:suc.response || []
        }
        res.status(suc.status).send(responseData);
        return;
    }
    next(suc);
}

module.exports = apiSuccessHandler;