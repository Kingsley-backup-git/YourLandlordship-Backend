const mongoose = require("mongoose")
const PropertySchema = mongoose.Schema

const PropertyModel = new PropertySchema({
propertyName : String,
yearBuilt : Number,
uniqueId : String,
stateAddress : String,
city:String,
region:String,
zip:String,
country : String,
propertyType : {
    type:String,
    enum : ["individual", "multi-unit"]
},
amenities : [String],
features : [String],
attachments : [String]
}, {timestamps:true})

module.exports = mongoose.model("PropertyCollection", PropertyModel)