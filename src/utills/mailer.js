const nodemailer = require("nodemailer");

module.exports = {
    transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "jobportalclient@gmail.com",
            pass: "TestUser@88"
        }
    }),
    CMS: {
        RegisterTitle: "Welcome to Job Portal",
        RegisterDescription: "Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum",
        ResetPwdTitle: "Password Reset"
    }
}