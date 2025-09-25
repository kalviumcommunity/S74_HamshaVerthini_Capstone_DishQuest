const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const userrouter = express.Router();

userrouter.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('[SIGNUP] Request body:', req.body);
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'dev_secret', {
      expiresIn: '7d',
    });
    console.log('[SIGNUP] User created:', newUser);
    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });
  } catch (err) {
    console.error('[SIGNUP] Error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});


//
userrouter.get('/signup',async(req, res) => {
    const users =await User.find()
    if(!users){
        return res.status(404).json({
            error:"No Users Found"
        })
    }
  return res.status(200).json({
     message: 'Signup endpoint is ready. Use POST to register.',data:users });
});


// Login
userrouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[LOGIN] Request body:', req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev_secret', {
      expiresIn: '7d',
    });
    console.log('[LOGIN] User logged in:', user);
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('[LOGIN] Error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});


//
userrouter.get('/login', async(req, res) => {
    const loginusers= await User.find()
    if(!loginusers){
        return res.status(404).json({
            error:"No Users Found"
        })
    }
  return res.status(200).json({ message: 'Login endpoint is ready. Use POST to login.',data:loginusers });
});

module.exports = userrouter;
