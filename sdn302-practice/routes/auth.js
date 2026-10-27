const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');

router.post('/tokens', (req, res) => {
  const { name, pass } = req.body;

  let members = [];
  try {
    members = JSON.parse(fs.readFileSync('./members.json', 'utf-8'));
  } catch (err) {
    members = [{ name: 'storeadmin', pass: 'Store@123' }];
  }

  const user = members.find(m => m.name === name && m.pass === pass);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return res.status(200).json({ token });
});

module.exports = router;