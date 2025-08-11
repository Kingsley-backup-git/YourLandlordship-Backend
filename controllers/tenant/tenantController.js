const crypto = require("crypto");
// const bcrypt = require('bcrypt');
const { sendEmail } = require("../../services/inviteMail");
const AuthCollection = require("../../models/authModel/authSchema");
const TenantAssignment = require("../../models/property/invite");
const TenantCollection = require("../../models/tenantModel/tenant");
const PropertyCollection = require("../../models/property/createProperty");
const InviteTenantHandler = async (req, res) => {
  const { email } = req.body;
  const { _id } = req.user;
  const { id } = req.params;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!id) {
    return res.status(400).json({ error: "Property Id is required" });
  }
  const findInvitee = await AuthCollection.findById(_id).select("email");

  const findTenant = await TenantAssignment.findOne({ email, property: id });

  try {
    if (!findInvitee) {
      return res.status(401).json({ error: "User not found" });
    }
    const token = crypto.randomBytes(5).toString("hex");

    await sendEmail({ email, token, landlordEmail: findInvitee.email });
    if (!findTenant) {
      const newAssignedTenant = new TenantAssignment({
        email,
        token,
        property: id,
        invitee: _id,
      });
      await newAssignedTenant.save();
      const Alltenant = await TenantAssignment.find({
        invitee: _id,
        status: "pending",
      })
        .populate("property")
        .sort({ createdAt: -1 });
      return res
        .status(200)
        .json({ message: "Invite Sent Successfully", data: Alltenant });
    }
    if (findTenant) {
      findTenant.token = token;

      // await findProperty.save()
      await findTenant.save();
      const Alltenant = await TenantAssignment.find({
        invitee: _id,
        status: "pending",
      })
        .populate("property")
        .sort({ createdAt: -1 });
      return res
        .status(200)
        .json({ message: "Invite Sent Successfully", data: Alltenant });
    }
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

const getInviteHandler = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "No Token Found" });
  }
  try {
    const assignedTenant = await TenantAssignment.findOne({ token });
    const IfTenantIsAssigned = await TenantCollection.findOne({
      email: assignedTenant?.email,
    });
    if (!assignedTenant) {
      return res.status(404).json({ error: "Invalid Token" });
    }
    if (!IfTenantIsAssigned) {
      return res.status(200).json({
        data: {
          email: assignedTenant.email,
          status: assignedTenant.status,
          landlord: assignedTenant.invitee?.email,
          isAssigned: false,
        },
      });
    }
    if (
      IfTenantIsAssigned &&
      String(IfTenantIsAssigned.landlordId) !== String(assignedTenant.invitee)
    ) {
      return res.status(200).json({
        data: {
          email: assignedTenant.email,
          status: assignedTenant.status,
          isAssigned: true,
          invitee: assignedTenant.invitee,
          id: IfTenantIsAssigned.landlordId,
        },
      });
    } else {
      return res.status(200).json({
        data: {
          email: assignedTenant.email,
          status: assignedTenant.status,
          isAssigned: false,
          invitee: assignedTenant.invitee,
          id: IfTenantIsAssigned.landlordId,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

const AcceptInviteHandler = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "No Id found" });
  }

  try {
    const assignedTenant = await TenantAssignment.findOne({ token });
    if (!assignedTenant) {
      return res.status(404).json({ error: "Invalid Id" });
    }
    const findUser = await AuthCollection.findOne({
      email: assignedTenant.email,
    });

    const IfTenantIsAssigned = await TenantCollection.findOne({
      email: assignedTenant?.email,
    });
    if (
      IfTenantIsAssigned &&
      String(IfTenantIsAssigned.landlordId) !== String(assignedTenant.invitee)
    ) {
      return res
        .status(409)
        .json({ error: "email is already assigned a landlord" });
    }

    const thisProperty = await PropertyCollection.findOne({
      _id: assignedTenant?.property,
    });

    let newTenant = IfTenantIsAssigned;
    if (!newTenant) {
      newTenant = new TenantCollection({
        email: assignedTenant?.email,
        propertyId: assignedTenant.property,
        landlordId: assignedTenant.invitee,
      });
    }

if (findUser) {
  newTenant.tenantId = findUser._id;

 
  if (!Array.isArray(thisProperty.tenantId)) {
    thisProperty.tenantId = [];
  }

  if (!thisProperty.tenantId.includes(findUser._id)) {
    thisProperty.tenantId.push(findUser._id);
  }
}

    assignedTenant.status = "success";

    await assignedTenant.save();
    await newTenant.save();

    return res
      .status(200)
      .json({ message: "Successfully accepted invite", newTenant });
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

const GetTenantHandler = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    return res.status(401).json({ error: "User not found" });
  }

  const tenant = await TenantCollection.findOne({ tenantId: _id })
    .populate("landlordId", "name email")
    .select("email")
    .populate("propertyId").populate("tenantId");

  if (!tenant) {
    return res.status(200).json({ data: { tenant: null } });
  }

  return res.status(200).json({ data: { tenant } });
};


const getAllTenant = async(req,res)=> {
    const {_id} = req.user
    if(!_id) {
        return res.status(401).json({error : "User not found"})
    }
    try {
const tenants = await TenantCollection.find({landlordId : _id}).sort({createdAt : -1})
return res.status(200).json({data : tenants})
    } catch(error) {
      return res.status(500).json({error: error.message})  
    }

}

module.exports = {
  InviteTenantHandler,
  getInviteHandler,
  AcceptInviteHandler,
  GetTenantHandler,
  getAllTenant
};
