const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const currentToken = req.header('Authorization').slice(7);
        const decodeToken = jwt.verify(currentToken, process.env.JWTTOKEN);
        const user = await User.findOne({ _id: decodeToken._id, 'tokens.token': currentToken });
        if (!user) throw new Error("Please Authenticate");
        req.token = currentToken;
        req.user = user;
    } catch (e) {
        res.status(401).send(e.message);
    }
    next();
}


module.exports = { auth }