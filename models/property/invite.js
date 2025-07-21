const mongoose = require("mongoose")
const Schema = mongoose.Schema
const inviteSchema = new Schema({
    email : {
        type : String,
required:true
    },
    token : {
        type : String,
        required : true
    },
    property : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "PropertyCollection"
    },
    tenantId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "AuthCollection",
        default : null
    },
    status : {
        type : String,
        enum : ["pending", "success"],
        default: "pending"
    },
    invitee : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "AuthCollection"
    },
    landlord : {
        type : String,
        default : null
    }
},{timestamps: true})

module.exports = mongoose.model("TenantAssignment", inviteSchema)