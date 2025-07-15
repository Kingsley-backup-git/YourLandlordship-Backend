const crypto = require("crypto")
// const bcrypt = require('bcrypt');
const { sendEmail } = require("../../services/inviteMail")
const AuthCollection = require("../../models/authModel/authSchema")
const TenantAssignment = require("../../models/property/tenant")
const PropertyCollection = require("../../models/property/createProperty")
const validator = require("validator")
const InviteTenantHandler = async(req,res)=> {
    const {email} = req.body
    const {_id} = req.user
    const {id} = req.params
    if(!email) {
        return res.status(400).json({error : "Email is required"})
    }

    if(!id) {
        return res.status(400).json({error : "Property Id is required"})
    }
    const findInvitee = await AuthCollection.findById(_id).select("email")

    const findTenant = await TenantAssignment.findOne({email, property:id})

    const findProperty = await PropertyCollection.findOne({_id : id, owner : _id})
    try {
  if(!findInvitee) {
        return res.status(401).json({error : "User not found"})
    }
const token = crypto.randomBytes(5).toString('hex')

await sendEmail({email,token,landlordEmail : findInvitee.email})
if(!findTenant) {
const newAssignedTenant = new TenantAssignment({email, token, property : id, landlordId : _id})
findProperty.tenantId = newAssignedTenant._id
await findProperty.save()
await newAssignedTenant.save()
 const Alltenant = await TenantAssignment.find({landlordId : _id, status : "pending"}).populate("property").sort({createdAt:-1})
 return res.status(200).json({message : "Invite Sent Successfully", data : Alltenant})
} 
if(findTenant) {
findTenant.token = token

await findProperty.save()
await findTenant.save()
 const Alltenant = await TenantAssignment.find({landlordId : _id, status : "pending"}).populate("property").sort({createdAt:-1})
 return res.status(200).json({message : "Invite Sent Successfully", data : Alltenant})
}


 
    } catch (error) {
return res.status(500).json({error : error?.message})
    }
  
}

const getInviteHandler = async(req, res) => {
const {token} = req.body
if(!token) {
    return res.status(400).json({error: "No Token Found"})
}
try {
const assignedTenant = await TenantAssignment.findOne({token}).populate("landlordId")
if(!assignedTenant) {
        return res.status(404).json({error: "Invalid Token"})
}

return res.status(200).json({data : {email: assignedTenant.email, status : assignedTenant.status, landlord : assignedTenant.landlordId?.email}})
} catch(error) {
    return res.status(500).json({error: "Invalid Token"})
}

}

const AcceptInviteHandler = async(req,res)=> {
    const {token} = req.body
    if(!token) {
    return res.status(400).json({error: "No Id found"})
    }
  

try {
const assignedTenant = await TenantAssignment.findOne({token})
const findUser = await AuthCollection.findOne({email : assignedTenant.email})
if(!assignedTenant) {
        return res.status(404).json({error: "Invalid Id"})
}
// const salt = await bcrypt.genSalt(10)
// const hash = await bcrypt.hash(password, salt)
// if(!findUser) {
// const user = await AuthCollection.create({email : assignedTenant.email, accountType: "tenant", password:hash})
// assignedTenant.tenantId = user._id
// assignedTenant.save()
// }
if(findUser) {
    assignedTenant.tenantId = findUser._id
}
assignedTenant.status = "success"

assignedTenant.save()

return res.status(200).json({message : "Successfully accepted invite", assignedTenant})

} catch (error) {
return res.status(200).json({error : error?.message})
}
}

module.exports = {
    InviteTenantHandler,
    getInviteHandler,
    AcceptInviteHandler
}