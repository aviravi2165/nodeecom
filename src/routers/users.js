const express = require('express');
const User = require('../models/user');
const { signUpUser, userLogin, userLogout, userLogoutAll, getUserDetail, updateUser, deletedUser, addAvatar, showAvatar, sendForgotPasswordLink, resetPassword } = require('../controller/users');
const router = new express.Router;
const { auth } = require('../middleware/auth');

router.post('/user/signup', signUpUser);

router.post('/user/login', userLogin);

router.get('/user/logout', auth, userLogout);

router.get('/user/logoutall', auth, userLogoutAll);

router.get('/user/detail', auth, getUserDetail);

router.patch('/user/update', auth, updateUser);

router.delete('/user/delete', auth, deletedUser);

router.post('/user/avatar', auth, addAvatar);

router.get('/user/:id/avatar', showAvatar);

router.post('/user/forgot', sendForgotPasswordLink);

router.post('/user/resetpassword', resetPassword);

module.exports = router;