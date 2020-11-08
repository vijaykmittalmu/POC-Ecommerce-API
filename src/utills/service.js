const nodemailer = require("nodemailer");

module.exports = {
    transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "jobportalclient@gmail.com",
            pass: "TestUser@88"
        }
    }),

}