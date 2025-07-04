const AuthCollection = require("../../models/authModel/authSchema")

const getUser = async(req, res)=> {
    const {_id} = req.user

try {
    console.log(_id)
     if(!_id) {
    return res.status(401).json({error: "User not found"})
}
 const user = await AuthCollection.findOne({_id})
 if(!user) {
    return res.status(401).json({error: "User does not exist"})
}
return res.status(200).json({data : {email :user.email, _id : user._id, type : user.accountType}, message : "Successfuly fetched user"})

} catch (error) {
    return res.status(500).json({error : "Failed to get User"})
}



}
module.exports = {getUser}
