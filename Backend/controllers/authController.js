const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/emailSender');

const getFrontendUrl = () => {
  const url = process.env.FRONTEND_URL || 'http://localhost:5173';
  return url.replace(/\/+$/, '');
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};


exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const user = await User.create({
      name,
      username,
      email,
      password,
      verificationToken,
      isVerified: true // Auto-verified (email verification bypassed)
    });

    const verifyUrl = `${getFrontendUrl()}/verify-email/${verificationToken}`;
    const message = `Please verify your email by clicking: \n\n ${verifyUrl}`;

    // Send email asynchronously so we don't block the response
    sendEmail({
      email: user.email,
      subject: 'LearnLog - Email Verification',
      message
    }).catch(err => console.log('Email could not be sent (background process):', err));

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Email verification bypassed — users are auto-verified on register
    // if (!user.isVerified) {
    //   return res.status(401).json({ success: false, message: 'Please verify your email first' });
    // }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${getFrontendUrl()}/reset-password/${resetToken}`;

    const message = `Hi ${user.name},\n\nYou requested a password reset for your LearnLog account.\n\nClick the link below to reset your password (valid for 10 minutes):\n\n${resetUrl}\n\nIf you did not request this, please ignore this email — your password will remain unchanged.\n\nThe LearnLog Team`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
        <h2 style="color: #4f46e5;">🔐 Reset Your Password</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>You requested a password reset for your <strong>LearnLog</strong> account.</p>
        <p>Click the button below to reset your password. This link is valid for <strong>10 minutes</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 13px;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${resetUrl}">${resetUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
        <p style="color: #888; font-size: 12px;">If you did not request a password reset, please ignore this email — your password will remain unchanged.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'LearnLog - Reset Your Password',
        message,
        html
      });
      res.status(200).json({ success: true, message: 'Password reset link sent to your email! Please check your inbox.' });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent. Please try again later.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
