import  axios  from 'axios';
import  console  from 'console';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../model/User');




function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}
 
// POST /api/auth/register  -> create user
async function register(req, res) {
  try {
    // 1. Safe destructuring in case req.body is undefined
    const { name, phone, password, gender } = req.body || {};

    // 2. Validation check
    if (!name || !phone || !password || !gender) {
      return res.status(400).json({ 
        message: 'name, phone, password and gender are required' 
      });
    }

    // 3. Check for existing user
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create user in DB
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      gender,
    });

    // 6. Generate JWT token
    const token = generateToken(user._id);

    // 7. Success response
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        profileStatus: user.profileStatus,
      },
    });
  } catch (err) {
    console.error('Registration Error:', err);

    // 8. Proper error formatting so details show up in Postman/Client
    return res.status(500).json({ 
      message: err.message || 'Server error',
      errorName: err.name,
      stack: err.stack 
    });
  }
}
// POST /api/auth/login
async function  login (req, res) {
  try {
    const { phone, password } = req.body;
 
    if (!phone || !password) {
      return res.status(400).json({ message: 'phone and password are required' });
    }
 
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }
 
    const token = generateToken(user._id);
 
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        profileStatus: user.profileStatus,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};


export {
  register,
  login
};