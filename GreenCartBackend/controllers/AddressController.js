const Address = require('../models/Address');

// Create Address
exports.createAddress = async (req, res) => {
  try {
    const { cityVillage, pincode, state, country, streetOrSociety,ownerId,ownerModel } = req.body;

    const newAddress = new Address({
      cityVillage,
      pincode,
      state,
      country,
      streetOrSociety,
      ownerId,
      ownerModel
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address created successfully', address: newAddress });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Address by ID
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Address
exports.updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
