const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');

// Create an Order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read an Order by ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an Order
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find and delete the Order
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete associated OrderDetails
    await OrderDetail.deleteMany({ order: orderId });

    res.status(200).json({ message: 'Order and associated details deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getOrders = async (req,res) => {
  try{
    const orders = await Order.find();
    if(!orders) return res.status(404).json({ message:"Order not found"});
    res.status(200).json(orders);
  }
  catch (error) { 
    res.status(400).json({ error: error.message });
  }
};