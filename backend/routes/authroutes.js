const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



const userrouter = express.Router();

userrouter.post('/signup', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ fullName, email, password: hashedPassword });
    

    res.status(201).json({ message: 'User created successfully',data:newUser });
  } catch (err) {
    res.status(500).json({ error: 'Server error', err: err.message });
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

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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
