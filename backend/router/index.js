const express = require('express');
const router = express.Router();  

const userRouter = require('./user')
const productRouter = require('./products')
const articleRouter = require('./articles')
const cartRouter = require('./carts')

router.use('/user',userRouter);
router.use('/products',productRouter);
router.use('/articles',articleRouter);
router.use('/cart', cartRouter);

module.exports = router;
