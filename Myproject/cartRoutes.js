const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

router
  .route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router
  .route('/:itemId')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

module.exports = router;