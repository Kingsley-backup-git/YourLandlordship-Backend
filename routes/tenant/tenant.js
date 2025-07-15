const express = require("express");
const router = express.Router()
const app = express()
const requireAuth = require("../../middleware/middleware") 
const {InviteTenantHandler, AcceptInviteHandler, getInviteHandler} = require("../../controllers/tenant/tenantController")
router.post("/invite/:id",requireAuth,InviteTenantHandler)
router.post("/getinvite", getInviteHandler)
router.post("/acceptinvite", AcceptInviteHandler)
module.exports = router