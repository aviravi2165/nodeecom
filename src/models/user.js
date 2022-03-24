const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        unique: true,
        validate(val) {
            if (!validator.isEmail(val)) throw new Error("Email is invalid.");
        }
    },
    contact: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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
        type: String,
        required: true,
        trim: true,
        enum: ['Admin', 'User']
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    profileImage: {
        type: String
    },
    rating: {
        type: Number,
        trim: true,
        enum: [1, 2, 3, 4, 5]
    },
    forgot:{
        type:String
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

userSchema.methods.toJSON = function(){
    const updatedUser = this.toObject();
    delete updatedUser.tokens;
    delete updatedUser.password;
    delete updatedUser.profileImage;
    delete updatedUser.forgot;
    return updatedUser;
};

userSchema.methods.generateToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWTTOKEN);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

userSchema.statics.confirmCredential = async function (email, password) {
    const user = await User.findOne({ email });
    if(!user) throw new Error("Email Not Registered");
    const passMatch = await bcrypt.compare(password,user.password);
    if(!passMatch) throw new Error("Password Does Not Match");
    return user;
};

userSchema.pre('save', async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;