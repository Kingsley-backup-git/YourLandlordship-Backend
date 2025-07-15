const PropertyCollection = require("../../models/property/createProperty")
const  cloudinary = require("../../config/cloudinary")

const createProperty = async (req,res)=> {
  const {propertyName} = req.body
  const {_id} = req.user
console.log(req.cookies)
    try {
    const property = await PropertyCollection.findOne({propertyName, owner : _id})
    if(property) {
      console.log(property)
     return res.status(400).json({error : "A Property with this name Exists"})
    }
    const uploadResults = [];
     for (const file of req.files) {

        const result = await cloudinary.uploader.upload(file.path, {
        upload_preset: 'ml_default',
   
      });
        uploadResults.push(result.url);
      
     }

const newProperty = new PropertyCollection({...req.body, owner:_id, attachments: uploadResults})
await newProperty.save()
  res.status(200).json(newProperty)
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
 
}
module.exports = {
    createProperty
}