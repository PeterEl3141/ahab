const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/mailer');


const prisma = new PrismaClient();

// REGISTER
const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password); // note lowercase
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// GET PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user profile', details: error.message });
  }
};

const crypto = require('crypto');


  const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPassword },
      });
  
      res.status(200).json({ message: 'Password changed successfully' });
  
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password', details: error.message });
    }
  };

  // POST /users/forgot-password { email }
  // POST /users/forgot-password { email }
   const forgotPassword = async (req, res) => {
    console.log('POST /users/forgot-password → body=', req.body);
    const { email } = req.body || {};
    const inputEmail = String(email || '').trim();          // normalize
    if (!email) return res.status(400).json({ error: 'Email is required' });
  
    let user = null;
    try {
      user = await prisma.user.findFirst({
      where: { email: { equals: inputEmail, mode: 'insensitive' } },
       select: { id: true, email: true }, // keep it light
      });
      console.log('[forgot] user exists?', !!user, 'id=', user?.id);
    } catch (e) {
      console.error('[forgot] prisma findUnique failed:', e);
    }
  
    // Always 200 to avoid enumeration
    if (!user) {
      console.log('[forgot] no user — returning OK (no email sent).');
      return res.json({ ok: true });
    }
  
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: tokenHash, resetTokenExpiry: expires },
      });
      console.log('[forgot] token stored for user id', user.id);
    } catch (e) {
      console.error('[forgot] prisma update failed:', e);
    }
  
    const base = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${base}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
  
    // Respond immediately
    res.json({ ok: true });
  
    // Background email
    console.log('[forgot] dispatching email to', user.email);
    sendMail({
      to: email,
      from: process.env.MAIL_FROM || 'no-reply@localhost',
      subject: 'Reset your Ahab’s Dream password',
      html: `
        <p>We got a request to reset your password.</p>
        <p><a href="${resetUrl}">Click here to reset</a>. This link expires in 1 hour.</p>
        <p>If you didn’t request this, just ignore this email.</p>
      `,
    })
      .then(({ previewUrl }) => {
        console.log('[forgot] email sent.');
        if (previewUrl) console.log('🔗 Ethereal preview:', previewUrl);
        else console.log('[forgot] Sent via real SMTP (no preview URL).');
      })
      .catch((e) => {
        console.error('[forgot] email failed:', e);
      });
  };

// POST /users/reset-password { token, email, password }
 const resetPassword = async (req, res) => {
  const { token, email, password } = req.body || {};
  if (!token || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  // Basic strength check (tweak as you like)
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const now = new Date();

  const user = await prisma.user.findFirst({
    where: { email, resetToken: tokenHash, resetTokenExpiry: { gt: now } },
  });
  if (!user) return res.status(400).json({ error: 'Invalid or expired reset link' });

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.json({ ok: true });
};
  
  

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  forgotPassword,
  resetPassword
};
