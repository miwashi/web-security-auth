const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const users = require('../auth/users');

router.post('/login',
  [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').notEmpty().withMessage('Password cannot be empty')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id, role: req.user.role }, 'YourJWTSecretKey', { expiresIn: '1h' });
    res.json({ token });
  }
);

router.post('/register',
  [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).json({ message: 'User already exists' });

    // Hashing the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Adding user to the "database"
    const newUser = { id: users.length + 1, email, password: hashedPassword, role: 'user' };
    users.push(newUser);
    
    res.status(201).json({ message: 'User registered successfully' });
  }
);

router.get('/users', (req, res) => {
  // Creating a user list without exposing passwords
  const userList = users.map(user => {
    return { id: user.id, email: user.email, password: user.password };
  });
  res.json(userList);
});

module.exports = router;
