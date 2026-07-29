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
async function  register (req, res) {
  try {
    const { name, phone, password, gender } = req.body;
 
    if (!name || !phone || !password || !gender) {
      return res.status(400).json({ message: 'name, phone, password and gender are required' });
    }
 
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      gender,
    });
 
    const token = generateToken(user._id);
 
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
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

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