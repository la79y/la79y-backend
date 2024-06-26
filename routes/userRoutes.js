const express = require("express");
const router = express.Router();
const { models } = require("../database");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
require("dotenv").config();

const saltRounds = 10; // for bcrypt hashing

sgMail.setApiKey(process.env.SENDGRID_KEY);

router.post("/signup", async (req, res) => {
  try {
    const newUser = await models.User.create(req.body);
    const token = jwt.sign(newUser.email, process.env.JWT_SECRET);

    const to = req.body.email;
    const subject = "Verify Email";
    const from = 'Bander From La79y App <bandr1994@gmail.com>';
    const html = `
        <p>Hi there,</p>
        <p>Thank you for signing up. Please verify your email address by clicking on the link below:</p>
        <p>Click <a href="${process.env.WEB_PROTO}://${process.env.WEB_HOST}:${process.env.WEB_PORT}/verify?email=${newUser.email}&token=${token}">here</a>
        <p>Have a great day!</p>
      `;
    // const msg = {
    //   from,
    //   to,
    //   subject,
    //   html,
    // };
    //
    // await sgMail.send(msg);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'bandr1994@gmail.com', // Your Gmail address
        clientId: process.env.GCP_CLIENT_ID,
        clientSecret: process.env.GCP_CLIENT_SECRET,
        refreshToken: process.env.GCP_REFRESH_TOKEN
      }
    });
    // Email options
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html
    };
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent:', info.response);
        return res.status(201).json({
          message: "Account created successfully. Please verify your email.",
          data: newUser,
        });
      }
    });

    // res.status(201).json({
    //   message: "Account created successfully. Please verify your email.",
    //   data: newUser,
    // });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/verify", async (req, res) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).json({ error: "Email and token are required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded !== email) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Token is valid, proceed with email verification
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update emailVerified field to true
    await user.update({ emailVerified: true });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { username: req.body.username },
    });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Check if the user is verified
    if (!user.emailVerified) {
      return res
        .status(401)
        .json({ error: "Email not verified. Please verify your email." });
    }

    // Verify password
    if (await user.verifyPassword(req.body.password)) {
      // Create the token payload
      const payload = {
        userId: user.id,
        username: user.username,
      };

      // Generate a token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({
        message: "Authentication successful!",
        token: token,
      });
    } else {
      return res.status(401).json({ error: "Authentication failed" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/reset-password-request", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await models.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign(user.email, process.env.JWT_SECRET);

    const msg = {
      to: email,
      from: 'Bander From La79y App <bandr1994@gmail.com>',
      subject: "Reset Password",
      html: `
        <p>Hi there,</p>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <p>Click <a href="${process.env.WEB_PROTO}://${process.env.WEB_HOST}:${process.env.WEB_PORT}/reset-password?email=${user.email}&token=${token}">here</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };
    // await sgMail.send(msg);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'bandr1994@gmail.com', // Your Gmail address
        clientId: process.env.GCP_CLIENT_ID,
        clientSecret: process.env.GCP_CLIENT_SECRET,
        refreshToken: process.env.GCP_REFRESH_TOKEN
      }
    });
    // Email options
    const mailOptions = {
      from: msg.from,
      to: msg.to,
      subject: msg.subject,
      html: msg.html
    };
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return     res.status(200).json({ message: "Reset password link sent successfully" });
      } else {
        console.log('Email sent:', info.response);
        return res.status(201).json({
          message: "Account created successfully. Please verify your email.",
          data: newUser,
        });
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.query;

    if (!token || !email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token, email, and new password are required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded !== email) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Token is valid, proceed with email verification
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
