const mongoose = require("mongoose")
const Schema = mongoose.Schema

const OtpSchema = new Schema({
    email : {
        type : String,
        required:true
    },
    otp : {
        type : String,
        required:true
    },
    expiresAt : {
        type : Date,
        required:true

    }
}, {timestamps : true})

module.exports = mongoose.model("OtpCollection", OtpSchema)