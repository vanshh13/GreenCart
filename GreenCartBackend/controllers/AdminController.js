const Admin = require('../models/Admin');

// Create an Admin
exports.createAdmin = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read an Admin by ID
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('user');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an Admin
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAdmins = async (req,res) => {
  try{
    const admins = await Admin.find();
    if(!admins) return res.status(404).json({ message:"Admin not found"});
    res.status(200).json(admins);
  }
  catch (error) { 
    res.status(400).json({ error: error.message });
  }
};