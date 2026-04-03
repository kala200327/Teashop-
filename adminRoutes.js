const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get Dashboard Analytics
router.get('/analytics', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let dailySales = 0;
    let weeklySales = 0;
    let monthlySales = 0;
    let activeOrdersCount = 0;

    const productSales = {};

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const amount = order.totalAmount || 0;

      // Sales
      if (orderDate >= today) dailySales += amount;
      if (orderDate >= firstDayOfWeek) weeklySales += amount;
      if (orderDate >= firstDayOfMonth) monthlySales += amount;

      // Active Orders
      if (['Pending', 'Packed', 'Shipped', 'Out for Delivery'].includes(order.orderStatus)) {
        activeOrdersCount++;
      }

      // Top Products
      order.products.forEach(p => {
        if (!productSales[p.productId]) {
          productSales[p.productId] = { id: p.productId, name: p.name, sold: 0 };
        }
        productSales[p.productId].sold += p.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    // Low Stock
    const lowStockProducts = await Product.find({ stockQuantity: { $lt: 10 } })
      .select('name stockQuantity category image');

    res.json({
      success: true,
      sales: { daily: dailySales, weekly: weeklySales, monthly: monthlySales },
      activeOrders: activeOrdersCount,
      topProducts,
      lowStockProducts
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

module.exports = router;
