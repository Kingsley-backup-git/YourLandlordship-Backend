const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MaintenanceReq = new Schema({
   category: {
      type: String,
      required: true,
      trim: true,
    },
     subCategory: {
      type: String,
     
      trim: true,
    },
    attachment: {
      type: String, 
      required: false,
  },
     description: {
      type: String,
      required: true,
      trim: true,
  },
      permissionToAccess: {
      type: Boolean,
      default: false,
  },
        urgency: {
      type: String,
      enum: ["Low", "Normal", "High", "Critical"],
      default: "normal",
  },
         pets: {
      dogs: { type: Boolean, default: false },
      cats: { type: Boolean, default: false },
      other: { type: Boolean, default: false },
    },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthCollection",
     required: [true, "Landlord ID is required"]
  },
  status: {
    type: String,
    enum: ["pending", "inprogress", "complete"],
    default: "pending", 
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PropertyCollection",
     required: [true, "Property ID is required"]
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TenantCollection",
    required : [true, "Tenant ID is required"]
  },
}, { timestamps: true }); 


module.exports = mongoose.model("MaintenanceCollection", MaintenanceReq)