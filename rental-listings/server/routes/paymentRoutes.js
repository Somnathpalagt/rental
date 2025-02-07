const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { listingId } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `http://localhost:3000/success?listingId=${listingId}`,
      cancel_url: 'http://localhost:3000/cancel`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Premium Listing' },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
    });

    logger.info(`Payment initiated for listing ${listingId}`);
    res.json({ sessionId: session.id });
  } catch (error) {
    logger.error(`Stripe Error: ${error.message}`);
    res.status(500).json({ error: 'Payment failed' });
  }
});

module.exports = router;
