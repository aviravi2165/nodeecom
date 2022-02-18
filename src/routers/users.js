const express = require('express');
const User = require('../models/user');
const router = new express.Router;
const bcrypt = require('bcrypt');
const { auth } = require('../middleware/auth');
const { route } = require('express/lib/application');

router.post('/user/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/user/login', async (req, res) => {
    try {
        const credential = req.body;
        const user = await User.confirmCredential(credential.email, credential.password);
        const token = await user.generateToken();
        res.status(202).send({ user, token });
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/user/logout', auth, async (req, res) => {
    try {
        const tokens = req.user.tokens;
        req.user.tokens = tokens.filter(token => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/user/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.get('/user/detail', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/user/update', auth, async (req, res) => {
    const allowedFields = ['name', 'email', 'contact', 'password', 'role', 'address'];
    const curUser = req.user.toObject();
    let user = {};
    allowedFields.forEach(field => {
        if (curUser.hasOwnProperty(field)) {
            user[field] = curUser[field];
        }
    });
    console.log('new user',user)

});

module.exports = router;