const express = require('express');
const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  const { id } = req.user;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) {
    logger.error('Failed to fetch user profile');
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
  res.json(data);
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { id } = req.user;
  const { full_name, phone } = req.body;
  
  const { error } = await supabase.from('users').update({ full_name, phone }).eq('id', id);
  if (error) {
    logger.error('Failed to update profile');
    return res.status(500).json({ error: 'Failed to update profile' });
  }

  logger.info(`User ${id} updated profile`);
  res.json({ message: 'Profile updated successfully' });
});

module.exports = router;
