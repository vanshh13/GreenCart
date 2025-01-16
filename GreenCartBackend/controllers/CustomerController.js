const Customer = require('../models/Customer');
const Address = require('../models/Address');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Create a Customer with Address
exports.createCustomer = async (req, res) => {
  try {
    const { CustomerName, CustomerEmail, CustomerContact, Image, CustomerAddress, user } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(user.Password, 10); // 10 is the salt rounds
    
        const newuser = new User({
          UserName: CustomerName,
          UserEmail: CustomerEmail,
          UserType: 'Customer',
          Password: hashedPassword,
        });
        await newuser.save();

    // Check for existing customer email
    const existingCustomer = await Customer.findOne({ CustomerEmail });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }

    // Create Address
    const newAddress = new Address({ 
      ...CustomerAddress,
       ownerId: newuser._id, 
       ownerModel: 'Customer' 
      });
    await newAddress.save();

    // Create Customer
    const newCustomer = new Customer({
      CustomerName,
      CustomerEmail,
      CustomerContact,
      Image,
      CustomerAddress: newAddress._id,
      user: newuser._id
    });

    await newCustomer.save();
    res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
    .populate('user')
    .populate('CustomerAddress');
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: 'No customers found' });
    }
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Customer by ID
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    .populate('CustomerAddress');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Customer and Address
exports.updateCustomer = async (req, res) => {
  try {
    const { CustomerName, CustomerEmail, CustomerContact, Image, CustomerAddress,user } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.Password, 10); // 10 is the salt rounds
    
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Update Address if provided
    if (CustomerAddress) {
      const address = await Address.findByIdAndUpdate(customer.CustomerAddress, CustomerAddress, { new: true });
      if(!address)
      {
        const address = new Address({
          cityVillage: CustomerAddress.cityVillage,
          pincode: CustomerAddress.pincode,
          state: CustomerAddress.state,
          country: CustomerAddress.country,
          streetOrSociety: CustomerAddress.streetOrSociety,
          ownerId: CustomerAddress.ownerId,
          ownerModel: "Customer",
        });
        address.save();
        customer.CustomerAddress = address._id;
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
          await User.findByIdAndUpdate(customer.user, updateduser,{ new: true });
    }
    // Update Customer fields
    customer.CustomerName = CustomerName || customer.CustomerName;
    customer.CustomerEmail = CustomerEmail || customer.CustomerEmail;
    customer.CustomerContact = CustomerContact || customer.CustomerContact;
    customer.Image = Image || customer.Image;
    
    await customer.save();

    res.status(200).json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Customer and Address
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Delete the associated address
    await Address.findByIdAndDelete(customer.CustomerAddress);
    await User.findByIdAndDelete(customer.user);

    // Delete the customer
    await customer.deleteOne();

    res.status(200).json({ message: 'Customer and associated address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};