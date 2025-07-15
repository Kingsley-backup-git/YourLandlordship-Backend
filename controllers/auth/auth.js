require("dotenv").config()
const AuthCollection = require("../../models/authModel/authSchema")
const OtpCollection = require("../../models/authModel/otpSchema")
const {generateOtp} = require("../../utils/function")
const {sendEmail} = require("../../services/mailService")

const jwt = require("jsonwebtoken")
const generateRefreshToken =  (id)=> {
const token =  jwt.sign({id}, process.env.REFRESHTOKEN_SECRET, {expiresIn: "7d"})
return token
}
const generateAccessToken = (id)=> {
const token =  jwt.sign({id}, process.env.ACCESSTOKEN_SECRET, {expiresIn: "30m"})
return token
}

const generateResetToken = (id)=> {
const token =  jwt.sign({id}, process.env.RESET_SECRET, {expiresIn: "30m"})
return token
}
const SignUpHandler = async(req, res)=> {
const {email, password} = req.body
try {
   
const user =await AuthCollection.signup(email, password)
 const accessToken = await generateAccessToken(user._id)
 const refreshToken = await generateRefreshToken(user._id)
const sanitizedUser = {
  _id: user._id,
  email: user.email,
  createdAt: user.createdAt
};
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, 
});
res.status(201).json({ user: sanitizedUser, accessToken });


} catch(error) {
res.status(400).json({error : error?.message})
}
}

const LoginHandler = async(req, res)=> {
const {email, password} = req.body
try {
const user =await AuthCollection.login(email, password)
 const accessToken = await generateAccessToken(user._id)
 const refreshToken = await generateRefreshToken(user._id)
const sanitizedUser = {
  _id: user._id,
  email: user.email,
  createdAt: user.createdAt
};
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, 
});
res.status(200).json({ user: sanitizedUser, accessToken });


} catch(error) {
res.status(400).json({error : error?.message})
}
}


const ForgotPasswordHandler = async(req,res)=> {
const {email} = req.body
try {
if(!email) {
   return res.status(400).json({error : "Email is required"})
}
const user = await AuthCollection.findOne({email})
if(!user) {
 return res.status(404).json({error : "User not found"})
}
const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
const otp =  generateOtp()
await sendEmail({email, otp})


await OtpCollection.deleteMany({email})

const userOtp = await OtpCollection.create({email, otp, expiresAt})

return res.status(200).json({message:"OTP successfully sent"})
} catch(error) {
return res.status(500).json({error : "failed to send otp"})

}

}

const ValidateOtpHandler = async(req,res)=> {
  const {email, otp} = req.body
try {
if(!email) {
   return res.status(400).json({error : "Email is required"})
}

if(!otp) {
   return res.status(400).json({errror : "Otp is required"})
}
const user = await OtpCollection.findOne({email, otp})
const userId = await AuthCollection.findOne({email})
if(!userId) {
   return res.status(404).json({error : "User not found"})
}
if(!user) {
 return res.status(404).json({error : "Invalid OTP"})
}
if(user.expiresAt < new Date()) {
  return res.status(410).json({error : "OTP exipred"})
}
const resetToken = generateResetToken(userId)

await OtpCollection.deleteOne({_id : user._id})


return res.status(200).json({message :  "OTP verified", resetToken})

} catch(error) {
return res.status(500).json({error : "OTP validation failed"})

}

}


const ChangePasswordHandler = async(req,res)=> {
  const {email, password} = req.body
try {
const user = await AuthCollection.resetPassword(email, password)
return res.status(200).json({message :  "Password Changed Successfully", user})

} catch(error) {
  if(error?.message === "Email is required" || error?.message === "Password is required") {
    return res.status(400).json({error : error?.message})
  }
   if(error?.message === "password not strong  enough") {
    return res.status(400).json({error : error?.message})
  }
   if(error?.message === "User not found") {
    return res.status(404).json({error : error?.message})
  } else {
return res.status(500).json({error : "Request Failed"})
  }


}

}

const RefreshTokenHandler = async(req,res)=> {

  const refreshToken = req.cookies.refreshToken
  console.log(refreshToken)
try {
 if(!refreshToken) {
return res.status(401).json({error : "No Token found"})

  }

  const decodedToken = jwt.verify(refreshToken,  process.env.REFRESHTOKEN_SECRET)

  if(decodedToken) {
     const accessToken = await generateAccessToken(decodedToken.id)
 

 res.status(200).json({accessToken})
 
  }
} catch (error) {
 res.status(401).json({ message: 'Invalid or expired token'})
}
 
}

module.exports = {
    SignUpHandler,
    LoginHandler,
    ForgotPasswordHandler,
    ValidateOtpHandler,
    ChangePasswordHandler,
    RefreshTokenHandler
}