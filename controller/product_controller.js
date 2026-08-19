import  axios  from 'axios';
import  console  from 'console';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import connectDB from "../config/db.js";
import Admin from "../model/admin_user_model.js";
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
      return res.status(200).json({ 
        status: 0,
        message: 'name, phone, password and gender are required' 
      });
    }

    // 3. Check for existing user
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(200).json({status: 0, message: 'Phone number already registered' });
    }

    // 4. Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create user in DB
    const user = await User.create({
      name,
      phone,
      password,
      gender,
    });

    // 6. Generate JWT token
    const token = generateToken(user._id);

    // 7. Success response
return res.status(200).json({
      status: 1,
      message: 'Account created successfully',
      token,
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



async function registerAdmin(req, res) {
  try {
     await connectDB();

    const {
      name,
      email,
      mobile,
      password,
      role,
      permissions,
    } = req.body || {};

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(200).json({
        status: 0,
        message: "name, email and password are required",
      });
    }

    // 2. Check existing admin
    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(200).json({
        status: 0,
        message: "Email already registered",
      });
    }

    // // 3. Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create admin
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      mobile,
      password: password,
      role: role || "STAFF",
      permissions: permissions || [],
    });

    // 5. Generate JWT
    const token = generateToken(admin._id);

    // 6. Success response
    return res.status(200).json({
      status: 1,
      message: "Admin account created successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (err) {
    console.error("Admin Registration Error:", err);

    return res.status(500).json({
      status: 0,
      message: err.message || "Server error",
      errorName: err.name,
    });
  }
}
// POST /api/auth/login
// async function  login (req, res) {
//   try {
//     const { phone, password } = req.body;
 
//     if (!phone || !password) {
//       return res.status(200).json({status: 0, message: 'phone and password are required' });
//     }
 
//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(200).json({status: 0, message: 'Invalid phone number or password' });
//     }
 
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(200).json({status: 0 ,message: 'Invalid phone number or password' });
//     }
 
//     const token = generateToken(user._id);
 
//     return res.status(200).json({
//       status: 1,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone,
//         gender: user.gender,
//         password:user.password,
//         profileStatus: user.profileStatus,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

async function login(req, res) { 
  try {
    // 1. MUST Connect to DB first (fixes 500 buffering timeout in serverless)
    await connectDB();

    // 2. Safe destructuring in case req.body is undefined
    const { phone, password } = req.body || {};

    // 3. Validation check
    if (!phone || !password) {
      return res.status(200).json({ 
        status: 0, 
        message: 'phone and password are required' 
      });
    }

    // 4. Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(200).json({ 
        status: 0, 
        message: 'Invalid phone number' 
      });
    }

    // 5. Compare entered password with stored bcrypt hash
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = (password === user.password);
    if (!isMatch) {
      return res.status(200).json({ 
        status: 0, 
        message: 'Invalid phone number or password' 
      });
    }

    // 6. Generate JWT token using numeric user._id
    const token = generateToken(user._id);

    // 7. Success response
    return res.status(200).json({
      status: 1,
      message: 'Login successful',
      token,
      user: {
        id: user._id, // Will return numeric ID (101, 102, etc.)
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        // REMOVED: password field for security
        profileStatus: user.profileStatus,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);

    // 8. Output error details in response for easier debugging in Postman
    return res.status(500).json({ 
      status: 0,
      message: err.message || 'Server error',
      errorName: err.name,
      stack: err.stack 
    });
  }
}


 async function adminLogin(req, res) {
  try {
    // 1. Connect DB
    await connectDB();

    // 2. Get request data
    const { email, password } = req.body || {};

    // 3. Validation
    if (!email || !password) {
      return res.status(200).json({
        status: 0,
        message: "email and password are required",
      });
    }

    // 4. Find admin
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(200).json({
        status: 0,
        message: "Invalid email or password",
      });
    }

    // 5. Check account active
    if (!admin.isActive) {
      return res.status(200).json({
        status: 0,
        message: "Admin account is inactive",
      });
    }

    // // 6. Check password
    // const isMatch = await bcrypt.compare(
    //   password,
    //   admin.password
    // );

    // if (!isMatch) {
    //   return res.status(200).json({
    //     status: 0,
    //     message: "Invalid email or password",
    //   });
    // }

    // 7. Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    // 8. Generate JWT
    const token = generateToken(admin._id);

    // 9. Success
    return res.status(200).json({
      status: 1,
      message: "Login successful",
      token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
      },
    });
  } catch (err) {
    console.error("Admin Login Error:", err);

    return res.status(500).json({
      status: 0,
      message: err.message || "Server error",
      errorName: err.name,
    });
  }
}


export {
  register,
  registerAdmin,
  login,
  adminLogin
};