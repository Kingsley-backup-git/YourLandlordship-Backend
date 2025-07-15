const PropertyCollection = require("../../models/property/createProperty")
const getAllProperty = async(req,res)=> {
    const {_id} = req.user
    if(!_id) {
        return res.status(401).json({error : "User not found"})
    }
    try {
const properties = await PropertyCollection.find({owner : _id}).sort({createdAt : -1})
return res.status(200).json({data : properties})
    } catch(error) {
      return res.status(500).json({error: error.message})  
    }

}

const paginatedProperties = async(req,res)=> {
     const {_id} = req.user
    const page = parseInt(req.query.page) || 1
     const limit = parseInt(req.query.limit)|| 5
   
     const skip = (page - 1) * limit
try {
    const properties = await PropertyCollection.find({owner : _id}).skip(skip).limit(limit).populate("tenantId")
    const totalDocument = await PropertyCollection.countDocuments({ owner: _id });
      const hasMore = skip + properties.length < totalDocument;
     return res.status(200).json({
        data:properties,
        totalSize : totalDocument,
        numberOfPages : Math.ceil(totalDocument/limit),
        page,
        hasMore,
        limit
     })
} catch (error) {
 return res.status(500).json({error : error?.message})
}
 

     
}

module.exports = {
    getAllProperty,
    paginatedProperties
}