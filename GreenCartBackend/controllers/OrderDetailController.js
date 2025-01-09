const OrderDetail = require('../models/OrderDetail');

// Create Order Detail
exports.createOrderDetail = async (req, res) => {
  try {
    const orderDetail = new OrderDetail(req.body);
    await orderDetail.save();
    res.status(201).json({ message: 'Order detail created successfully', orderDetail });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read Order Detail by ID
exports.getOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findById(req.params.id);
    if (!orderDetail) return res.status(404).json({ message: 'Order detail not found' });
    res.status(200).json(orderDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Order Detail
exports.updateOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!orderDetail) return res.status(404).json({ message: 'Order detail not found' });
    res.status(200).json({ message: 'Order detail updated successfully', orderDetail });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Order Detail
exports.deleteOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findByIdAndDelete(req.params.id);
    if (!orderDetail) return res.status(404).json({ message: 'Order detail not found' });
    res.status(200).json({ message: 'Order detail deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Order Detail
exports.getOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetail.find();
    if (!orderDetails) return res.status(404).json({ message: 'Order details not found' });
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};