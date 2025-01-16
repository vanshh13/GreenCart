const OrderDetail = require('../models/OrderDetail');
const Address = require('../models/Address');

// Create OrderDetail with Address
exports.createOrderDetail = async (req, res) => {
  try {
    const { order, deliveryAddress, totalPrice, deliveryStatus, finalPrice } = req.body;

    // Step 1: Create Delivery Address
    const newAddress = new Address({ ...deliveryAddress, ownerId: order, ownerModel: 'OrderDetail' });
    await newAddress.save();

    // Step 2: Create OrderDetail
    const newOrderDetail = new OrderDetail({
      order,
      deliveryAddress: newAddress._id,
      totalPrice,
      deliveryStatus,
      finalPrice
    });

    await newOrderDetail.save();
    res.status(201).json({ message: 'Order detail created successfully', orderDetail: newOrderDetail });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Order Details
exports.getOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetail.find().populate('deliveryAddress');

    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).json({ message: 'No order details found' });
    }

    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get OrderDetail by ID
exports.getOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findById(req.params.id).populate('deliveryAddress');

    if (!orderDetail) {
      return res.status(404).json({ message: 'Order detail not found' });
    }

    res.status(200).json(orderDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update OrderDetail and Address
exports.updateOrderDetail = async (req, res) => {
  try {
    const { deliveryAddress, totalPrice, deliveryStatus, finalPrice } = req.body;

    // Step 1: Find the OrderDetail
    const orderDetail = await OrderDetail.findById(req.params.id);
    if (!orderDetail) {
      return res.status(404).json({ message: 'Order detail not found' });
    }

    // Step 2: Update Delivery Address if provided
    if (deliveryAddress) {
      await Address.findByIdAndUpdate(orderDetail.deliveryAddress, deliveryAddress, { new: true });
    }

    // Step 3: Update OrderDetail fields
    orderDetail.totalPrice = totalPrice || orderDetail.totalPrice;
    orderDetail.deliveryStatus = deliveryStatus || orderDetail.deliveryStatus;
    orderDetail.finalPrice = finalPrice || orderDetail.final;
    await orderDetail.save();

    res.status(200).json({ message: 'Order detail updated successfully', orderDetail });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete OrderDetail and Associated Address
exports.deleteOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findById(req.params.id);
    if (!orderDetail) {
      return res.status(404).json({ message: 'Order detail not found' });
    }

    // Step 1: Delete Associated Delivery Address
    await Address.findByIdAndDelete(orderDetail.deliveryAddress);

    // Step 2: Delete OrderDetail
    await orderDetail.deleteOne();

    res.status(200).json({ message: 'Order detail and associated address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
