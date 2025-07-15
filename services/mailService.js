const transporter = require("../config/mailer")
require("dotenv").config
const sendEmail = async({email, otp}) => {
    try {
 const mailOptions = {
        from : process.env.GMAIL,
        to: email,
        subject: "OTP Code",
        text : `This is your One Time Pass ${otp}`
    }
const info = await transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error("❌ Failed to send:", err);
  } else {
    console.log("✅ Mail sent:", info);
  }
})
return info
    } catch(error) {
        console.log(error)
       throw error
       
    }
   
}


module.exports = {sendEmail}