const mongoose = require('mongoose');
const Address = require('../models/Address');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');
// ✅ Create Address
// ✅ Create Address for Admin or Customer
exports.createAddress = async (req, res) => {
  try {
    const { cityVillage, pincode, state, country, streetOrSociety, ownerId, ownerModel } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid Owner ID" });
    }
    
    if (!["Admin", "Customer"].includes(ownerModel)) {
      return res.status(400).json({ message: "Invalid ownerModel. Must be 'Admin' or 'Customer'." });
    }
    
    const address = new Address({
      cityVillage,
      pincode,
      state,
      country,
      streetOrSociety,
      ownerId: mongoose.Types.ObjectId(ownerId),
      ownerModel,
    });
    
    await address.save();
    
    // ✅ Assign address to the respective model
    if (ownerModel === "Customer") {
      await Customer.findByIdAndUpdate(ownerId, { $push: { CustomerAddress: address._id } });
    } else if (ownerModel === "Admin") {
      await Admin.findByIdAndUpdate(ownerId, { adminAddress: address._id });
    }
    
    res.status(201).json({ message: "Address created successfully", address });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Address
exports.updateAddress = async (req, res) => {
  try {
    const { ownerModel } = req.body;

    if (ownerModel && !["Admin", "Customer"].includes(ownerModel)) {
      return res.status(400).json({ message: "Invalid ownerModel. Must be 'Admin' or 'Customer'." });
    }

    const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    
    // ✅ Remove address reference from Admin or Customer
    if (deletedAddress.ownerModel === "Customer") {
      await Customer.findByIdAndUpdate(deletedAddress.ownerId, { $pull: { CustomerAddress: deletedAddress._id } });
    } else if (deletedAddress.ownerModel === "Admin") {
      await Admin.findByIdAndUpdate(deletedAddress.ownerId, { adminAddress: null });
    }
    
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Addresses by User ID (Customer)
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authentication middleware
    console.log("User ID from token:", userId);

    // Step 1: Find the customer linked to this userId
    const customer = await Customer.findOne({ user: userId });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    console.log("Customer ID:", customer._id);

    // Step 2: Fetch addresses associated with this customer
    const addresses = await Address.find({ ownerId: customer._id, ownerModel: "Customer" });

    console.log("Addresses found:", addresses);
    res.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
