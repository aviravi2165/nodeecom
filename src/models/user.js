const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if (!validator.isEmail(val)) throw new Error("Email is invalid.");
        }
    },
    contact: {
        type: String,
        required: true,
        trim: true,
        validate(val) {
            if (!validator.isNumeric(val)) throw new Error("Contact Number must be Numeric.");
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: Number,
        required: true,
        trim: true,
        enum: [1, 2]
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    profileImage: {
        type: Buffer
    },
    rating: {
        type: Number,
        trim: true,
        enum: [1, 2, 3, 4, 5]
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamp: true
});


const User = mongoose.model("User", userSchema);

module.exports = User;