const User = require('../models/user');
const mongoose = require('mongoose');
const userId1 = new mongoose.Types.ObjectId;
const userId2 = new mongoose.Types.ObjectId;


const users = [
    new User({
        "_id": userId1,
        "name": "Aarif",
        "email": "aarif@gmail.com",
        "contact": "9876543210",
        "password": "123",
        "role": "Admin",
        "address": "Sec 14"
    }),
    new User({
        "_id": userId2,
        "name": "Ravi Kumar Asari",
        "email": "ravi@gmail.com",
        "contact": "9929997234",
        "password": "123",
        "role": "Admin",
        "address": "Nakoda Nagar 2"
    })
];

module.exports = { users, userId1, userId2 };