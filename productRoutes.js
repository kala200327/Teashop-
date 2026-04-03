const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products/tea
router.get('/tea', (req, res) => {
  req.params.category = 'tea';
  productController.getProductsByCategory(req, res);
});

// GET /api/products/coffee
router.get('/coffee', (req, res) => {
  req.params.category = 'coffee';
  productController.getProductsByCategory(req, res);
});

// GET /api/products/snacks
router.get('/snacks', (req, res) => {
  req.params.category = 'snacks';
  productController.getProductsByCategory(req, res);
});

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// POST /api/products
router.post('/', authMiddleware, adminMiddleware, productController.addProduct);

// PUT /api/products/:id
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
