const express = require('express');
const User = require('../models/user');
const router = new express.Router;


router.get('/user', (req, res) => {
    const user = new User({
        name: "Ravi",
        email: "ravi@gmail.com",
        contact: "987654321",
        password: "123",
        role: "1",
        address: "Nakoda Nagar"
    });
    user.save();
    res.send("user");
});


module.exports = router;