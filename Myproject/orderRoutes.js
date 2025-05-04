const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  createOrder,
  getOrder,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered
} = require('../controllers/orderController');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, authorize('admin'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, authorize('admin'), updateOrderToDelivered);

module.exports = router;