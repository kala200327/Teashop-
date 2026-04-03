const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Profile Fields
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  profilePic: { type: String, default: '' }, // Base64 or URL
  
  // Preferences
  favorites: [{ type: String }],
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  
  // Loyalty
  loyaltyPoints: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
