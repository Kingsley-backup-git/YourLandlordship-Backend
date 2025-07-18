const express = require("express")
const {SignUpHandler, LoginHandler, ForgotPasswordHandler, ValidateOtpHandler, ChangePasswordHandler, RefreshTokenHandler} = require("../../controllers/auth/auth")
const {UpdateUser} = require("../../controllers/user/updateUser")
const  {getUser} = require("../../controllers/user/getUser")
const requireAuth = require("../../middleware/middleware")
const router = express.Router()
const verifyResetToken = require("../../middleware/verifyResetToken")
router.post("/register", SignUpHandler)
router.post("/login", LoginHandler)
router.post("/forgot-password", ForgotPasswordHandler)
router.post("/validate-otp", ValidateOtpHandler)
router.post("/reset-password", verifyResetToken, ChangePasswordHandler)
router.patch("/setup", requireAuth, UpdateUser)
router.get("/me",requireAuth, getUser)
router.post("/refresh-token", RefreshTokenHandler)
module.exports = router