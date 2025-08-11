const mongoose = require("mongoose")
const PropertySchema = mongoose.Schema

const PropertyModel = new PropertySchema({
propertyName : {
    type:String
},
yearBuilt : Number,
uniqueId : String,
stateAddress : String,
city:String,
region:String,
zip:String,
owner :{
type: mongoose.Schema.Types.ObjectId,
ref: "AuthCollection"
},
country : String,
propertyType : {
    type:String,
    enum : ["individual", "multi-unit"]
},
amenities : [String],
features : [String],
attachments : [String],
tenantId : [{
    type:mongoose.Schema.Types.ObjectId,
    ref : "AuthCollection",
    default:[]
}]
}, {timestamps:true})

module.exports = mongoose.model("PropertyCollection", PropertyModel)