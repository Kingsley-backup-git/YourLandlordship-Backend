const express = require("express")
const {SignUpHandler, LoginHandler, ForgotPasswordHandler, ValidateOtpHandler, ChangePasswordHandler} = require("../../controllers/auth/auth")
const router = express.Router()
const verifyResetToken = require("../../middleware/verifyResetToken")
router.post("/register", SignUpHandler)
router.post("/login", LoginHandler)
router.post("/forgot-password", ForgotPasswordHandler)
router.post("/validate-otp", ValidateOtpHandler)
router.post("/reset-password", verifyResetToken, ChangePasswordHandler)

module.exports = router