const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto
} = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/photo').put(protect, authorize('admin'), uploadProductPhoto);

module.exports = router;