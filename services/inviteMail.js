const transporter = require("../config/mailer")
require("dotenv").config
const sendEmail = async({email, token, landlordEmail}) => {
    try {
 const mailOptions = {
        from : process.env.GMAIL,
        to: email,
        subject: "Invitation Link",
        // text : `This is your Invitation link http://localhost:3000/${token}/invite sent from ${landlordEmail}`
          html: `
        <p>Hello,</p>
        <p>You have been invited to join the property portal by your landlord.</p>
        <p>To accept the invitation and access your tenant dashboard, please click the link below:</p>
        <p>
          👉 <a href="http://localhost:3000/invite/${token}">Join Now</a>
        </p>
        <p>If you did not expect this invitation, you can safely ignore this message.</p>
        <br />
        <p>Best regards,</p>
    <br/>
        Landlord<br/>
        ${landlordEmail}</p>
      `
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
        
       throw error
       
    }
   
}


module.exports = {sendEmail}