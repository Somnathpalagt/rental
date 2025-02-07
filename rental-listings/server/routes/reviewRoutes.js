const express = require('express');
const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// Get all reviews for a listing
router.get('/:listingId', async (req, res) => {
  const { listingId } = req.params;
  const { data, error } = await supabase.from('reviews').select('*').eq('listing_id', listingId);
  if (error) {
    logger.error(`Failed to fetch reviews for listing ${listingId}`);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
  res.json(data);
});

// Post a review
router.post('/:listingId', authMiddleware, async (req, res) => {
  const { listingId } = req.params;
  const { rating, comment } = req.body;
  const { id: userId } = req.user;

  const { error } = await supabase.from('reviews').insert({
    listing_id: listingId,
    user_id: userId,
    rating,
    comment,
  });

  if (error) {
    logger.error(`Failed to post review for listing ${listingId}`);
    return res.status(500).json({ error: 'Failed to post review' });
  }

  logger.info(`User ${userId} reviewed listing ${listingId}`);
  res.json({ message: 'Review submitted successfully' });
});

module.exports = router;
