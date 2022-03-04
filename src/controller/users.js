const User = require('../models/user');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');

const signUpUser = async (req, res, next) => {
    try {
        const user = new User(req.body);
        const token = await user.generateToken();
        next(ApiSuccess.created({ user, token }));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const userLogin = async (req, res, next) => {
    try {
        const credential = req.body;
        const user = await User.confirmCredential(credential.email, credential.password);
        const token = await user.generateToken();
        next(ApiSuccess.accepted({ user, token }));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const userLogout = async (req, res, next) => {
    try {
        const tokens = req.user.tokens;
        req.user.tokens = tokens.filter(token => token.token !== req.token);
        await req.user.save();
        next(ApiSuccess.ok());
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const userLogoutAll = async (req, res, next) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        next(ApiSuccess.ok());
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

const getUserDetail = async (req, res, next) => {
    next(ApiSuccess.ok(req.user));
}

const updateUser = async (req, res, next) => {
    const allowedFields = ['name', 'email', 'contact', 'password', 'role', 'address'];
    const user = await User.findById(req.user._id);
    allowedFields.forEach(field => {
        if (user.toObject().hasOwnProperty(field)) {
            user[field] = req.body[field];
        }
    });
    await user.save();
    next(ApiSuccess.ok(user));
}

const deletedUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        if (!deletedUser) throw new Error("User cannot be deleted");
        next(ApiSuccess.ok(deletedUser));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

module.exports = {
    signUpUser,
    userLogin,
    userLogout,
    userLogoutAll,
    getUserDetail,
    updateUser,
    deletedUser
}