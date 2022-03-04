const express = require('express');
const User = require('../models/user');
const { signUpUser, userLogin, userLogout, userLogoutAll, getUserDetail, updateUser, deletedUser } = require('../controller/users');
const router = new express.Router;
const { auth } = require('../middleware/auth');
const { error } = require('../errors/apiError');

router.post('/user/signup', signUpUser);

router.post('/user/login', userLogin);

router.post('/user/logout', auth, userLogout);

router.post('/user/logoutall', auth, userLogoutAll);

router.get('/user/detail', auth, getUserDetail);

router.patch('/user/update', auth, updateUser);

router.delete('/user/delete', auth, deletedUser);


module.exports = router;