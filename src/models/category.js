const mongoose = require('mongoose');
const User = require('./user');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        default: "0"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


const Category = new mongoose.model("Category", categorySchema);


module.exports = Category;