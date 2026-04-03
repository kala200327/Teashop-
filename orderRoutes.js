const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Admin: GET /api/orders/all - Get all orders system-wide
router.get('/all', authMiddleware, adminMiddleware, orderController.getAllOrdersAdmin);

// Admin: PUT /api/orders/:id/status - Update order status
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

// GET /api/orders - Get all orders
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id - Get single order details
router.get('/:id', orderController.getOrderById);

// PUT /api/orders/:id/cancel - Cancel order
router.put('/:id/cancel', orderController.cancelOrder);

// POST /api/orders/create - Create internal order
router.post('/create', async (req, res) => {
  try {
    const order = await orderController.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

module.exports = router;
