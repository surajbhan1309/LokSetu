import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Signup (citizen/admin) with email/password
// @route   POST /api/auth/signup
// @access  Public
export const signupCitizen = async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedRole = role === 'admin' ? 'admin' : 'citizen';

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists with this email' });
  }

  const user = await User.create({
    email: normalizedEmail,
    password,
    role: normalizedRole,
  });
  const token = generateToken(user._id.toString(), user.role);

  return res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token,
  });
};

// @desc    Login (citizen/admin) with email/password
// @route   POST /api/auth/login
// @access  Public
export const authCitizen = async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedRole = role === 'admin' ? 'admin' : 'citizen';

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (user.role !== normalizedRole) {
    return res.status(401).json({ message: 'Invalid role for this account' });
  }

  const token = generateToken(user._id.toString(), user.role);

  return res.json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token,
  });
};

