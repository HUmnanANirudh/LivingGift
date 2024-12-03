const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  imgUrl: { type: String, required: true },
});
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
