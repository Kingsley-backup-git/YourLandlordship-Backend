const express = require("express")
const {SignUpHandler, LoginHandler, ForgotPasswordHandler, ValidateOtpHandler, ChangePasswordHandler} = require("../../controllers/auth/auth")
const {UpdateUser} = require("../../controllers/user/updateUser")
const requireAuth = require("../../middleware/middleware")
const router = express.Router()
const verifyResetToken = require("../../middleware/verifyResetToken")
router.post("/register", SignUpHandler)
router.post("/login", LoginHandler)
router.post("/forgot-password", ForgotPasswordHandler)
router.post("/validate-otp", ValidateOtpHandler)
router.post("/reset-password", verifyResetToken, ChangePasswordHandler)
router.patch("/setup", requireAuth, UpdateUser)

module.exports = router