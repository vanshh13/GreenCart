const Order = require('../models/Order');
const mongoose = require('mongoose');
const OrderDetail = require('../models/OrderDetail');
const Address = require('../models/Address');
const ShoppingCart = require('../models/ShoppingCart');
const CartItem = require('../models/CartItem');
// Create an Order
exports.createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // ✅ Start a transaction for data integrity

  try {
    const user = req.user.id; 
    const { orderItems, totalPrice, orderStatus, OrderDetail: orderDetailData } = req.body;

    // ✅ Validate required fields
    if (!orderItems || !totalPrice || !orderDetailData?.deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // ✅ Validate delivery address
    const addressExists = await Address.findById(orderDetailData.deliveryAddress);
    if (!addressExists) {
      return res.status(400).json({ success: false, message: 'Invalid delivery address' });
    }

    // ✅ Create OrderDetail
    const orderDetail = new OrderDetail({
      deliveryAddress: orderDetailData.deliveryAddress,
      totalPrice,
      tax: orderDetailData.tax || 0,
      discount: orderDetailData.discount || 0,
      finalPrice: orderDetailData.finalPrice || totalPrice,
    });

    const savedOrderDetail = await orderDetail.save({ session });

    // ✅ Create Order
    const newOrder = new Order({
      user,
      orderItems,
      totalPrice,
      orderStatus: orderStatus || 'pending',
      orderDate: new Date(),
      OrderDetail: savedOrderDetail._id,
    });

    const savedOrder = await newOrder.save({ session });

    // ✅ Remove ordered items from the shopping cart
    const shoppingCart = await ShoppingCart.findOne({ user }).populate('cartItems');

    if (shoppingCart) {
      const orderedProductIds = orderItems.map(item => item.product.toString());

      // ✅ Filter out ordered items from cart
      shoppingCart.cartItems = shoppingCart.cartItems.filter(
        (cartItem) => !orderedProductIds.includes(cartItem.product.toString())
      );

      // ✅ Update cart's total price
      shoppingCart.totalPrice = shoppingCart.cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

      await shoppingCart.save({ session });

      // ✅ Delete removed cart items from CartItem collection
      await CartItem.deleteMany({ product: { $in: orderedProductIds } }, { session });
    }

    // ✅ Update OrderDetail with order reference
    savedOrderDetail.order = savedOrder._id;
    await savedOrderDetail.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, message: 'Order placed successfully', order: savedOrder });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};


// Read an Order by ID
exports.getOrder = async (req, res) =>  
{
    try {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate("OrderDetail");

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.json({
    success: true,
    orderStatus: {
      currentStep: order.orderStatus, // e.g., "shipped"
      expectedDelivery: new Date(order.orderDate).setDate(new Date(order.orderDate).getDate() + 3),
      timestamps: {
        ordered: order.orderDate,
        packed: order.OrderDetail.packedDate || null,
        shipped: order.OrderDetail.shippedDate || null,
        in_transit: order.OrderDetail.inTransitDate || null,
        delivered: order.OrderDetail.deliveredDate || null,
      },
    },
  });
} catch (error) {
  console.error("Error fetching order tracking:", error);
  res.status(500).json({ success: false, message: "Internal Server Error" });
}
};


// Update an Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Order status is required" });
    }

    // Find the existing order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Define timestamp updates based on new status
    const timestampUpdates = {};
    if (status === "processing") timestampUpdates["timestamps.packed"] = new Date();
    if (status === "shipped") timestampUpdates["timestamps.shipped"] = new Date();
    if (status === "in_transit") timestampUpdates["timestamps.in_transit"] = new Date();
    if (status === "delivered") timestampUpdates["timestamps.delivered"] = new Date();
    if (status === "cancelled") timestampUpdates["timestamps.cancelled"] = new Date(); // New field for cancellations

    // Update order status and timestamps
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status, ...timestampUpdates }, // Merge updates
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Delete an Order
// exports.deleteOrder = async (req, res) => {
//   try {
//     const orderId = req.params.id;

//     // Find and delete the Order
//     const order = await Order.findByIdAndDelete(orderId);
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Delete associated OrderDetails
//     await OrderDetail.deleteMany({ order: orderId });

//     res.status(200).json({ message: 'Order and associated details deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find Order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Delete OrderDetail if exists
    await OrderDetail.deleteOne({ order: orderId });

    // Delete Order
    await Order.findByIdAndDelete(orderId);

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

exports.getOrderByUser = async (req,res) => {
  try{
    const userId = req.user.id;
    const orders = await Order.find({ user: userId});
    if(!orders) return res.status(404).json({ message:"Order not found"});
    res.status(200).json(orders);
  }
  catch (error) { 
    res.status(400).json({ error: error.message });
  }
};

exports.OrderTracking = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    console.log("Order ID from params:", orderId);
    // ✅ Find order by its _id
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ orderStatus: order.orderStatus, timestamps: order.timestamps });
  } catch (error) {
    console.error("Error fetching order tracking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
