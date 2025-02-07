const express = require('express');
const supabase = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// Get all listings
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('listings').select('*');
  if (error) {
    logger.error('Failed to fetch listings');
    return res.status(500).json({ error: 'Failed to fetch listings' });
  }
  res.json(data);
});

// Create a listing
router.post('/', authMiddleware, async (req, res) => {
  const { title, location, price, description, images } = req.body;
  const { id: userId } = req.user;

  const { error } = await supabase.from('listings').insert({
    title,
    location,
    price,
    description,
    images,
    posted_by: userId,
  });

  if (error) {
    logger.error('Failed to create listing');
    return res.status(500).json({ error: 'Failed to create listing' });
  }

  logger.info(`Listing created by user ${userId}`);
  res.json({ message: 'Listing created successfully' });
});

// Delete a listing
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) {
    logger.error(`Failed to delete listing ${id}`);
    return res.status(500).json({ error: 'Failed to delete listing' });
  }

  logger.info(`Listing ${id} deleted`);
  res.json({ message: 'Listing deleted successfully' });
});

module.exports = router;
