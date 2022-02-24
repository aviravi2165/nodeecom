const User = require('../models/user');

const signUpUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e.message);
    }
}

const userLogin = async (req, res) => {
    try {
        const credential = req.body;
        const user = await User.confirmCredential(credential.email, credential.password);
        const token = await user.generateToken();
        res.status(202).send({ user, token });
    } catch (e) {
        res.status(404).send(e.message);
    }
}

const userLogout = async (req, res) => {
    try {
        const tokens = req.user.tokens;
        req.user.tokens = tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(400).send(e.message);
    }
}

const userLogoutAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(400).send(e.message);
    }
}

const getUserDetail = async (req, res) => {
    res.send(req.user);
}

const updateUser = async (req, res) => {
    const allowedFields = ['name', 'email', 'contact', 'password', 'role', 'address'];
    const user = await User.findById(req.user._id);
    allowedFields.forEach(field => {
        if (user.toObject().hasOwnProperty(field)) {
            user[field] = req.body[field];
        }
    });
    await user.save();
    res.status(200).send(user);
}

const deletedUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        if (!deletedUser) throw new Error("User cannot be deleted");
        res.send(deletedUser);
    } catch (e) {
        res.status(400).send();
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