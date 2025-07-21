const express = require("express");
const router = express.Router()

const requireAuth = require("../../middleware/middleware") 
const {InviteTenantHandler, AcceptInviteHandler, getInviteHandler, GetTenantHandler} = require("../../controllers/tenant/tenantController")
router.post("/invite/:id",requireAuth,InviteTenantHandler)
router.post("/getinvite", getInviteHandler)
router.post("/acceptinvite", AcceptInviteHandler)
router.get("/",requireAuth, GetTenantHandler)
module.exports = router