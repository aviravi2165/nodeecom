const Category = require('../models/category');
const mongoose = require('mongoose');
const { userId1, userId2 } = require('./user-seeder');

const catId1 = new mongoose.Types.ObjectId;
const catId2 = new mongoose.Types.ObjectId;

const categories = [new Category({
    name: "Apparel",
    parent: "",
    createdBy:userId1
}),
new Category({
    name: "Electonics",
    parent: "",
    createdBy:userId1
}),
new Category({
    _id: catId1,
    name: "Shoes",
    parent: "Apparel",
    createdBy:userId2
}),
new Category({
    _id: catId2,
    name: "Mobiles",
    parent: "Electronics",
    createdBy:userId2
})
];

module.exports = { categories, catId1, catId2 };