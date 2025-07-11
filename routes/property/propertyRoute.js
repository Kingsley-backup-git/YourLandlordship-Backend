const express = require("express");
const router = express.Router()
const app = express()
const requireAuth = require("../../middleware/middleware") 
const {createProperty} = require("../../controllers/property/createProperty")
const multer  = require('multer')
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

app.use(requireAuth)
router.post("/create", upload.array("attachments"), createProperty)
module.exports = router