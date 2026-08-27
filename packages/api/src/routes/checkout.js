const express = require('express');
const CheckoutController = require('../controllers/checkoutController');

const router = express.Router();

router.post('/session', CheckoutController.createSession);
router.get('/success', CheckoutController.getSuccess);

module.exports = router;