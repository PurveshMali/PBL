const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

router.get("/validate", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.json({ message: "Token is valid", user: decoded });
  });
});

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
});

router.put("/profile/edit", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      const { firstName, lastName, mobile } = req.body; // Editable fields

      const updatedUser = await User.findByIdAndUpdate(
        decoded.userId,
        { firstName, lastName, mobile },
        { new: true, runValidators: true }
      );

      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      res.json({ message: "Profile updated successfully!", user: updatedUser });
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});

// Forgot Password (Email Link)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Send Reset Email (Dummy Example)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: "your-email@gmail.com", pass: "your-password" },
    });
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject: "Reset Password",
      text: "Click the link to reset password: http://localhost:3000/reset-password",
    });

    res.json({ message: "Password reset email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
});

const REPORTS_DIR = path.join(__dirname, "data", "");

router.get("/reports/:reportId/download", (req, res) => {
  const reportId = req.params.reportId;
  const format = req.query.format || "pdf"; // Default format is PDF
  const filename = `Co2_Emissions_by_Sectors.csv`;
  const filePath = path.join(REPORTS_DIR, filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  // Serve the file as an attachment
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).json({ error: "Failed to download file" });
    }
  });
});

module.exports = router;
