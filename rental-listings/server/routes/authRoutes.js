const express = require('express');
const supabase = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
  const { email, password, full_name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from('users').insert({ email, password: hashedPassword, full_name });

  if (error) {
    logger.error('Signup failed');
    return res.status(500).json({ error: 'Signup failed' });
  }

  logger.info(`User signed up: ${email}`);
  res.json({ message: 'Signup successful' });
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (error || !data) {
    logger.warn('Invalid login attempt');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordMatch = await bcrypt.compare(password, data.password);
  if (!passwordMatch) {
    logger.warn('Invalid login attempt');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  logger.info(`User logged in: ${email}`);
  res.json({ token });
});

module.exports = router;
