const express = require("express");
const router = express.Router();
const { models } = require("../database");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    const newUser = await models.User.create(req.body);
    res.status(201).json({
      message: "Account created successfully",
      data: newUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { username: req.body.username },
    });

    if (user && (await user.verifyPassword(req.body.password))) {
      // Create the token payload
      const payload = {
        userId: user.id,
        username: user.username,
      };

      // Generate a token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        message: "Authentication successful!",
        token: token,
      });
    } else {
      res.status(401).json({ error: "Authentication failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
