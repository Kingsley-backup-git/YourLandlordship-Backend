const jwt = require("jsonwebtoken")
const AuthCollection = require("../models/authModel/authSchema")
async function verifyResetToken(req,res,next) {
    const {authorization} = req.headers
    if(!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({error : "Authorization token required"})
    }

       const token = authorization.split(' ')[1];

         try {
       const decodedToken = await jwt.verify(token,process.env.RESET_SECRET)
    
        const user = await AuthCollection.findById(decodedToken.id).select("_id");
    
    
      
           if (!user) {
             return res.status(401).json({error: 'User not found' });
           }
           req.user = user;
          
       next()
           } catch(error) {
          return res.status(401).json({error: 'Invalid or expired token' });
           }
}
module.exports = verifyResetToken