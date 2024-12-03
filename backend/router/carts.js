const express = require('express');
const router = express.Router()
const Carts = require('../Models/cart');

router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const product = await findProductById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  let cart = await Carts.findOne({ userId: userId });

  if (!cart) {
    cart = new Carts({ userId: userId, items: [] });
  }

  const existingItem = cart.items.find(item => item.productId.equals(productId));

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: productId,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imgUrl: product.imgUrl
    });
  }

  await cart.save();
  res.json({ message: 'Product added to cart', cart });
});

router.post('/remove', async (req, res) => {
  const { userId, productId } = req.body;

  const cart = await Carts.findOne({ userId: userId });

  if (!cart) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  cart.items = cart.items.filter(item => !item.productId.equals(productId));

  await cart.save();
  res.json({ message: 'Item removed from cart', cart });
});

router.get('/items', async (req, res) => {
  const { userId } = req.query;

  const cart = await Carts.findOne({ userId: userId });
  if (!cart) {
    return res.json({ cart: [] });
  }

  res.json({ cart });
});
module.exports = router