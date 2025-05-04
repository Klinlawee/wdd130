const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Middleware to protect routes
const protect = require('../middleware/auth');

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images');
    
    if (!cart) {
      return res.status(200).json({ items: [], total: 0 });
    }
    
    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', [
  protect,
  [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('quantity', 'Quantity must be at least 1').isInt({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId, quantity } = req.body;

  try {
    // Get product details
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    // Check if user already has a cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: req.user.id,
        items: [{
          product: productId,
          quantity,
          price: product.price
        }]
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );
      
      if (itemIndex > -1) {
        // Update quantity if product exists
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.items.push({
          product: productId,
          quantity,
          price: product.price
        });
      }
    }
    
    await cart.save();
    
    // Populate product details before sending response
    await cart.populate('items.product', 'name price images').execPopulate();
    
    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', [
  protect,
  [
    check('quantity', 'Quantity must be at least 1').isInt({ min: 1 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    await cart.save();
    
    // Populate product details before sending response
    await cart.populate('items.product', 'name price images').execPopulate();
    
    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    
    // Remove item from cart
    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );
    
    await cart.save();
    
    // Populate product details before sending response
    await cart.populate('items.product', 'name price images').execPopulate();
    
    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;