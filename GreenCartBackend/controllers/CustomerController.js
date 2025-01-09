const Customer = require('../models/Customer');

// Create a Customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read a Customer by ID
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('user');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCustomers = async (req,res) => {
  try{
    const customers = await Customer.find();
    if(!customers) return res.status(404).json({ message:"Customer not found"});
    res.status(200).json(customers);
  }
  catch (error) { 
    res.status(400).json({ error: error.message });
  }
};