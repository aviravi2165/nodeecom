const User = require('../models/user');
const ApiError = require('../errors/apiError');
const ApiSuccess = require('../success/apiSuccess');
const mailNow = require('../mail/mailer');
const jwt = require('jsonwebtoken');
const uploadFileMulter = require('../uploader/fileupload');
const fs = require('fs');

const upload = uploadFileMulter('./uploads/users', 'profileImage_', 'profileImage');


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
    const id = req.user._id;
    upload(req, res, async function (err) {
        try {
            if (err) {
                throw new Error(err);
            }
            const user = await User.findById(id);
            if (!user) {
                throw new Error('User Not found');
            }
            const userUpdated = await User.findByIdAndUpdate(id, { profileImage: req.file.filename });
            if (!userUpdated) {
                throw new Error("Something went wrong");
            }
            next(ApiSuccess.ok("Avatar Uploaded"));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    });
}
const showAvatar = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).select('name profileImage');
    let image;
    if (!user) throw new Error("User not found!");
    if (!user.profileImage) {
    }
    fs.readFile(`./uploads/users/${user.profileImage}`, function (err, data) {
        const ext = user.profileImage.slice(user.profileImage.lastIndexOf('.') + 1);
        res.set('Content-Type', `image/${ext}`);
        res.send(data);
    });
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
        const forgotToken = jwt.sign({ _id: user._id.toString() }, process.env.JWTFORGOT, { expiresIn: '7d' });
        const body = `<h1>Hi ${user.name}!</h1>
                        <div><a href="${req.headers.host}/resetpassword/${user._id}/${forgotToken}">Click Here!</a> to proceed for reseting password</div>
                        <div>If link doesn't work copy this link and paste it to address bar - ${req.headers.host}/user/resetpassword/${user._id}/${forgotToken}</div>
                        <div>Cheers</div>
                    <div>NodeEcom</div>`;
        const subject = "Request for Password Reset";
        const to = req.body.email;
        const from = "no-reply@fivesdigital.com";
        const mailStatus = await mailNow(from, to, subject, body);
        if (!mailStatus) {
            throw new Error("Something went wrong. Please Contact your administrator.");
        }
        const userTokenSaved = await User.findByIdAndUpdate(user.id, { forgot: forgotToken });
        if (!userTokenSaved) {
            throw new Error("Something went wrong. Please Contact your administrator.");
        }
        next(ApiSuccess.ok("Forgot Password Link Sent"));
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}
const resetPassword = async (req, res, next) => {
    try {
        if (req.body.password !== req.body.confirm) {
            throw new Error("Password and Confirm password does not match.");
        }
        const verifyJWTToken = jwt.verify(req.body.token, process.env.JWTTOKEN);
        if (!verifyJWTToken) {
            throw new Error("Token Expired");
        }
        const user = await User.findById(verifyJWTToken._id).select('-profileImage');
        if (user.forgot !== req.body.token) {
            throw new Error("Token does not match");
        }

        user.password = req.body.password;
        user.forgot = "";

        if (!user.save()) {
            throw new Error("Something went wrong. Please contact administrator.");
        }
        next(ApiSuccess.ok(user));
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
    sendForgotPasswordLink,
    resetPassword
}