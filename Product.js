const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['tea', 'coffee', 'snacks'] },
  image: { type: String, required: true },
  stockQuantity: { type: Number, default: 20 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
