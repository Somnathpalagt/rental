const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Rate Limiting (Prevent API abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
});
app.use(limiter);

// Middleware to Authenticate API Requests
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: user, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(403).json({ error: 'Invalid Token' });

  req.user = user;
  next();
};

// Handle Stripe Checkout Session
app.post('/api/create-checkout-session', authenticateUser, async (req, res) => {
  const { listingId } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `http://localhost:3000/success?listingId=${listingId}`,
    cancel_url: 'http://localhost:3000/cancel',
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

  res.json({ sessionId: session.id });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
