const mongoose = require('mongoose');

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
        type: mongoose.Schema.Types.ObjectId
    }
});


const Category = new mongoose.model("Category", categorySchema);


module.exports = Category;