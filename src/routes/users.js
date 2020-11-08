const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { clientValidation } = require("../utills/validations");
const { User } = require("../model/users");
const { transporter } = require("../utills/service");
const authMiddleware = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

// New user registration api
router.post("/register/", async (req, res) => {
    try {
        const { fname, lname, email, password } = req.body;
        const { error } = clientValidation(req.body, "register");
        if (error) {
            return res.status(400).send({ status: 400, message: error.details[0].message });
        }

        let userInfo = await User.findOne({ email: email });
        if (userInfo) {
            return res.status(400).send({ status: 400, message: "User already registered." });
        }

        user = new User({ fname: fname, lname: lname, email: email, password: password });
        user.password = await user.generateHashPassword(password);
        const tokens = await user.generateJwtToken();

        await user.save();
        await transporter.sendMail({
            from: "no-reply@gmail.com",
            to: req.body.email,
            subject: "Welcome to Ecommerce Site",
            html: `<p>Hello <b>${fname} ${lname}</b>, You have done your Registration successfully on Ecommerce site.</p>`
        })
        res.header({ "x-auth-tokens": tokens }).json({ status: 200, message: "User registered successfully." });
    } catch (error) {
        console.log("Error");
        console.log(error);
    }
});

// login api
router.post("/signin/", async (req, res) => {
    try {
        const { error } = clientValidation(req.body, "signin");
        if (error) {
            return res.status(400).send({ status: 400, message: error.details[0].message });
        }

        let userInfo = await User.findOne({ email: req.body.email });
        if (!userInfo) {
            return res.status(400).send({ status: 400, message: "Email address is not valid" });
        }

        const isPwdvalid = await bcrypt.compare(req.body.password, userInfo.password);
        if (!isPwdvalid) {
            return res.status(400).send({ status: 400, message: "Password is not valid" });
        }

        const tokens = await userInfo.generateJwtToken();
        res.status(200).send({ status: 200, token: tokens });
    } catch (error) {
        console.log("Error");
        console.log(error);
    }
});

// Forgot Password api
router.post("/reset-password/", async (req, res) => {
    try {
        const { error } = clientValidation(req.body, "reset-password");
        if (error) return res.status(400).send({ status: 400, message: error.details[0].message });

        let userInfo = await User.findOne({ email: req.body.email });
        if (!userInfo) {
            return res.status(400).send({ status: 400, message: "Email address is not valid" });
        }
        userInfo.resetToken = crypto.randomBytes(32).toString("hex");
        userInfo.expiredToken = Date.now() + 3600000;
        await userInfo.save();
        await transporter.sendMail({
            from: "no-reply@gmail.com",
            to: req.body.email,
            subject: "Password Reset",
            html: `
            <h3>Reset password request</h3>
            <p>Click this <a href="http://localhost:3001/reset/${userInfo.resetToken}">link</a> to reset password</p>
            `
        });
        res.status(200).json({ status: 200, message: "Email has been send successfully." });
    } catch (ex) {
        console.log(ex);
        res.send("Something went wrong");
    }
})

// Change Password api
router.post('/change-password', async (req, res) => {
    try {
        const { error } = clientValidation(req.body, "change-password");
        if (error) return res.status(400).send({ status: 400, message: error.details[0].message });

        let userInfo = await User.findOne({ resetToken: req.body.token });
        if (!userInfo) return res.status(400).send({ status: 400, message: `Try again, session has been expired.` });

        userInfo.password = await userInfo.generateHashPassword(req.body.password);
        userInfo.resetToken = undefined;
        userInfo.expiredToken = undefined;
        await userInfo.save();
        res.json({ status: 200, message: "password changed successfully." });
    } catch (ex) {
        console.log(ex);
        res.send("Something went wrong");
    }
});

// get all users api
router.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find().sort();
        res.status(200).send({ status: 200, data: users });
    } catch (error) {
        console.log(error);
        res.send({ message: "Something went wrong", error: error });
    }
});

module.exports = router;