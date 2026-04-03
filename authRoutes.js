const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');

const JWT_SECRET = process.env.JWT_SECRET || 'teashop_jwt_secret_2024';

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Registration successful! Please log in.' });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// GET /api/auth/profile  – fetch profile + order stats
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    const recentOrders = orders.slice(0, 3);
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;

    res.json({
      success: true,
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        profilePic: user.profilePic,
        favorites: user.favorites,
        notifications: user.notifications,
        loyaltyPoints: user.loyaltyPoints,
        createdAt: user.createdAt 
      },
      stats: { totalOrders, totalSpent, cancelledOrders },
      recentOrders
    });
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/auth/profile  – update username or password
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { 
      username, 
      fullName, 
      phone, 
      address, 
      profilePic, 
      favorites, 
      notifications,
      currentPassword, 
      newPassword 
    } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ success: false, message: 'Username already taken' });
      user.username = username;
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (favorites !== undefined) user.favorites = favorites;
    if (notifications !== undefined) user.notifications = notifications;

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ success: false, message: 'Current password required' });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        profilePic: user.profilePic,
        favorites: user.favorites,
        notifications: user.notifications,
        loyaltyPoints: user.loyaltyPoints
      }
    });
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
