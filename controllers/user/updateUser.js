const AuthCollection = require("../../models/authModel/authSchema")
const UpdateUser = async(req, res)=> {
const {type} = req.body
const {_id} = req.user

try {
if(!type) {
    return res.status(400).json({error: "Type is required"})
}

if(!["tenant", "landlord"].includes(type)) {
      return res.status(400).json({error: "Type must be either tenant or landlord"})
}

const updateduser = await AuthCollection.findByIdAndUpdate(_id, {$set : {accountType : type}}, {new : true})
return res.status(201).json(updateduser)
} catch (error) {
return res.status(500).json({error: "Account update failed"})
}

}
module.exports = {
    UpdateUser
}