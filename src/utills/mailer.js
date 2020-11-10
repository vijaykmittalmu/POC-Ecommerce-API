const nodemailer = require("nodemailer");
module.exports = {
    transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }),
    CMS: {
        RegisterTitle: "Welcome to Job Portal",
        RegisterDescription: "Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum",
        ResetPwdTitle: "Password Reset"
    }
}