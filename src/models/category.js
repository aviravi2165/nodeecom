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
    image: {
        type: Buffer
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

categorySchema.methods.toJSON = function(){
    const updatedCategory = this.toObject();
    return updatedCategory;
}

const Category = new mongoose.model("Category", categorySchema);


module.exports = Category;