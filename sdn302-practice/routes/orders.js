const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer_id')
      .populate('items.product_id');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer_id')
      .populate('items.product_id');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(404).json({ message: 'Order not found' });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { customer_id, items, payment_method, status, order_date } = req.body;

    if (!customer_id || !items || !Array.isArray(items) || items.length === 0 || !payment_method || !status) {
      return res.status(400).json({ message: 'Missing required order fields' });
    }

    const customer = await Customer.findById(customer_id);
    if (!customer) return res.status(400).json({ message: 'Invalid customer_id' });

    let total_amount = 0;
    const processedItems = [];

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return res.status(400).json({ message: 'Invalid product item format or quantity' });
      }

      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product_id}` });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({ message: `Quantity for ${product.name} exceeds available stock (${product.stock})` });
      }

      // Giá và tổng tiền được tính toán trên server
      const itemTotal = product.price * item.quantity;
      total_amount += itemTotal;

      processedItems.push({
        product_id: product._id,
        quantity: item.quantity,
        price_at_order: product.price,
        total: itemTotal
      });
    }

    const order = new Order({
      customer_id,
      items: processedItems,
      total_amount,
      payment_method,
      status,
      order_date: order_date || new Date()
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;