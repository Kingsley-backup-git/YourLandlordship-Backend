require("dotenv").config()
const nodeMailer = require("nodemailer")
const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
    port: 587, 
  secure: false,

 
    requireTLS:true,
    auth : {
        user : process.env.GMAIL,
        pass : process.env.GMAIL_PASS
    },

})

module.exports = transporter