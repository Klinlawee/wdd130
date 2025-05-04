const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  oldPrice: Number,
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'kids', 'accessories', 'electronics']
  },
  subCategory: String,
  images: [String],
  colors: [String],
  sizes: [String],
  brand: String,
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  badge: {
    type: String,
    enum: ['new', 'sale', 'popular', 'featured', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);