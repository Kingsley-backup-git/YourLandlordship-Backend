const AuthCollection = require("../../models/authModel/authSchema")
const UpdateUser = async(req, res)=> {
const {type} = req.body
const {_id} = req.user

try {
if(!type) {
    return res.status(400).json({message: "Type is required"})
}

if(!["tenant", "landlord"].includes(type)) {
      return res.status(400).json({message: "Type must be either tenant or landlord"})
}

const updateduser = await AuthCollection.findByIdAndUpdate(_id, {$set : {accountType : type}}, {new : true})
return res.status(201).json(updateduser)
} catch (error) {
return res.status(500).json({message: "Account update failed"})
}

}
module.exports = {
    UpdateUser
}