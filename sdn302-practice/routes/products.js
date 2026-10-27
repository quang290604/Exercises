const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: 'Product not found' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  const { name, price, category, stock } = req.body;
  if (!name || price === undefined || !category || stock === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const product = new Product({ name, price, category, stock });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id - Trả về 409 nếu sản phẩm nằm trong Order
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const referencedOrder = await Order.findOne({ 'items.product_id': productId });
    
    if (referencedOrder) {
      return res.status(409).json({ message: 'Cannot delete product referenced by existing orders' });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;