const Admin = require('../models/Admin');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create an Admin along with Address
exports.createAdmin = async (req, res) => {
  try {
    const { adminName, adminEmail, adminContact, adminAddress,user } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.Password, 10); // 10 is the salt rounds

    const newuser = new User({
      UserName: adminName,
      UserEmail: adminEmail,
      UserType: 'Admin',
      Password: hashedPassword,
    });
    await newuser.save();

    // Step 1: Create the Address linked to Admin
    const newAddress = new Address({
      ...adminAddress,
      ownerId: newuser._id,  // Assuming user is authenticated
      ownerModel: 'Admin'
    });
    await newAddress.save();

    // Step 2: Create Admin with linked Address
    const newAdmin = new Admin({
      adminName,
      adminEmail,
      adminContact,
      adminAddress: newAddress._id,
      user: newuser._id
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created with Address', admin: newAdmin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get Admin by ID with Address populated
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id)
      .populate('user')         // Populate user details
      .populate('adminAddress'); // Populate address details

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Admin and Address
exports.updateAdmin = async (req, res) => {
  try {
    const { adminName, adminEmail, adminContact, Image, adminAddress,user } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.Password, 10); // 10 is the salt rounds
    // Step 1: Find the Admin
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Step 2: Update the Address if provided
    if (adminAddress) {
        const address = await Address.findByIdAndUpdate(admin.adminAddress, adminAddress, { new: true });
        if(!address)
        {
          const address = new Address({
            cityVillage: adminAddress.cityVillage,
            pincode: adminAddress.pincode,
            state: adminAddress.state,
            country: adminAddress.country,
            streetOrSociety: adminAddress.streetOrSociety,
            ownerId: adminAddress.ownerId,
            ownerModel: "Admin",
          });
          address.save();
          admin.adminAddress = address._id;
        }
      }
    if(user){
          const updateduser = new User({
            _id: user._id,
            UserName: user.UserName,
            UserEmail: user.UserEmail,
            UserType: user.UserType,
            Password: hashedPassword,
          });
          await User.findByIdAndUpdate(admin.user, updateduser,{ new: true });
    }
    // Step 3: Update Admin fields
    admin.adminName = adminName || admin.adminName;
    admin.adminEmail = adminEmail || admin.adminEmail;
    admin.adminContact = adminContact || admin.adminContact;
    admin.Image = Image || admin.Image;

    await admin.save();

    res.status(200).json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Admin and its Address
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    await User.findByIdAndDelete(admin.user);
    await Address.findByIdAndDelete(admin.adminAddress);
    // Delete associated Address
    await Address.deleteOne({ _id: admin.adminAddress });

    // Delete Admin
    await admin.deleteOne();

    res.status(200).json({ message: 'Admin and Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all Admins with their Addresses
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .populate('user')
      .populate('adminAddress');

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }

    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
