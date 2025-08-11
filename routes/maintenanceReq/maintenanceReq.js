const express = require("express");
const router = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
})
  const upload = multer({ storage})
const requireAuth = require("../../middleware/middleware") 
const {createRequest, getRequest} = require("../../controllers/maintenance/maintenanceReq")
router.post("/request/create", requireAuth, upload.none(), createRequest)
router.get("/requests", requireAuth, getRequest)

module.exports = router