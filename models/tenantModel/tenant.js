const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TenantSchema = new Schema({
    email : {
        type : String,
      
        required:true
    },
    landlordId : {
      type : mongoose.Schema.Types.ObjectId,
        ref : "AuthCollection",
        default: null
    },
    tenantId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "AuthCollection",
        default: null
    },
    propertyIds : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "PropertyCollection"
    }]
})

module.exports = mongoose.model("TenantCollection", TenantSchema)