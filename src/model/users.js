const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        maxlength: 255
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    resetToken: String,
    expiredToken: Date
},
    {
        timestamps: true
    }
);

// generate hash password methods
userSchema.methods.generateHashPassword = async (data) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
}

// generate jwt tokens methods
userSchema.methods.generateJwtToken = async function () {
    return await jwt.sign({ _id: this.id, email: this.email, role: this.role }, config.get("jwtprivatekey"), { expiresIn: '1h' });
}

const User = mongoose.model("User", userSchema);



exports.User = User;