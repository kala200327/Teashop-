const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest-user' // For simulation or until auth is fully implemented
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Razorpay', 'COD', 'Card', 'Simulation']
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  shippingAddress: {
    type: String,
    required: true
  },
  paymentId: {
    type: String
  },
  orderId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
