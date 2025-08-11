const MaintenanceCollection = require("../../models/MaintenanceReq/maintenanceReq");

const createRequest = async (req, res) => {
  let pets;
    let permissionToAccess;

 
    try {
      pets = JSON.parse(req.body.pets);
    } catch {
      return res.status(400).json({ error: "Invalid pets format. Must be JSON." });
    }

    try {
      permissionToAccess = JSON.parse(req.body.permissionToAccess);
    } catch {
      return res.status(400).json({ error: "Invalid permissionToAccess format. Must be JSON boolean." });
    }
  const {
    subCategory,
    category,
    
    urgency,
    description,
    propertyId,
    tenantId,
    landlordId,
  } = req.body;
console.log(req.body, pets,permissionToAccess )
    if (
      !category ||
      typeof permissionToAccess !== "boolean" ||
      !urgency ||
      !description ||
      !pets ||
      !propertyId ||
      !tenantId ||
      !landlordId
    ) {
      return res.status(400).json({ error: "All required fields must be provided and valid." });
    }

  try {
    const request = new MaintenanceCollection({
      category,
      subCategory,
      permissionToAccess,
      urgency,
      pets,
      description,
      propertyId,
      tenantId,
      landlordId,
    });

    await request.save();

    return res.status(201).json({
      message: "Maintenance request created successfully",
      data : request,
    });
  } catch (error) {
    console.log(error?.message)
    return res.status(500).json({ error: 'Internal Server error' });
  }
};


const getRequest = async(req, res) => {
  const { _id } = req.user
  try {
    if (!_id) {
      return res.status(401).json({error : "Unauthorized user"})
    }
    const landlordMaintenanceReq = await MaintenanceCollection.find({ landlordId: _id }).populate("propertyId")
    if (landlordMaintenanceReq.length > 0) {
      return res.status(200).json({data : landlordMaintenanceReq})
    } else {
         return res.status(200).json({data : []})
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({error: "Internal Server Error"})
  }
}

module.exports = {
  createRequest,
  getRequest
};
