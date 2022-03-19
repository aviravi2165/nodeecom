const User = require('../models/user');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');
const mailNow = require('../mail/mailer');
const jwt = require('jsonwebtoken');

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
const addAvatar = async (req, res, next) => {
    try {
        if (!['image/jpg', 'image/png'].some(mime => mime === req.file.mimetype)) {
            throw new Error('Only JPG and PNG allowed');
        }
        if (req.file.size > 5000000) {
            throw new Error('make to upload file less than 5MB');
        }
        const user = await User.findByIdAndUpdate(req.user._id, { profileImage: req.file.buffer });
        if (!user) throw new Error("User cannot be changed");
        next(ApiSuccess.ok(user));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}
const showAvatar = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).select('name profileImage');
    let image;
    if (!user) throw new Error("User not found!");
    if (user.profileImage) {
        image = user.profileImage;
    }
    else {
        image = user.profileImage;
    }
    res.set('Content-Type', 'image/jpg');
    res.send(image);
}
const sendForgotPasswordLink = async (req, res, next) => {
    try {
        if (!req.body.email) {
            throw new Error("Email field cannot be empty");
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error("User not found");
        }
        const forgotToken = jwt.sign({ _id: user._id.toString() }, process.env.JWTTOKEN);
        const body = `<h1>Hi ${user.name}!</h1><div><a href="">Click Here!</a> to proceed for reseting password</div><div>Cheers</div><div>NodeEcom</div>`;
        const subject = "Request for Password Reset";
        const to = user.email;
        const from = "NodeECom<no Reply>";
        const mailStatus = mailNow(from, to, subject, body);
        if (!mailStatus) {
            throw new Error("Something went wrong. Please Contact your administrator.");
        }
        const userTokenSaved = await User.findByIdAndUpdate(user.id, { forgot: forgotToken });
        if(!userTokenSaved) {
            throw new Error("Something went wrong. Please Contact your administrator.");
        }
        next(ApiSuccess.ok("Forgot Password Link Sent"));
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
    deletedUser,
    addAvatar,
    showAvatar,
    sendForgotPasswordLink
}