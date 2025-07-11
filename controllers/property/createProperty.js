const PropertyCollection = require("../../models/property/createProperty")
const  cloudinary = require("../../config/cloudinary")

const createProperty = async (req,res)=> {
  
    try {
    const uploadResults = [];
     for (const file of req.files) {

        const result = await cloudinary.uploader.upload(file.path, {
        upload_preset: 'ml_default',
   
      });
        uploadResults.push(result.url);
      
     }

const newProperty = new PropertyCollection({...req.body, attachments: uploadResults})
await newProperty.save()
  res.status(200).json(newProperty)
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
 
}
module.exports = {
    createProperty
}