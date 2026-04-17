const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";
const USE_MEMORY_STORE = !process.env.MONGO_URI;
const memoryUsers = new Map();
let memoryUserCounter = 1;

const sanitizeUser = (user) => {
  if (!user) return null;

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    password: user.password,
  };
};

const findUserByEmail = async (email) => {
  if (USE_MEMORY_STORE) {
    return Array.from(memoryUsers.values()).find((user) => user.email === email) || null;
  }

  return User.findOne({ email });
};

const findUserById = async (userId) => {
  if (USE_MEMORY_STORE) {
    return memoryUsers.get(String(userId)) || null;
  }

  return User.findById(userId);
};

const saveUser = async (user) => {
  if (USE_MEMORY_STORE) {
    const storedUser = { ...user };
    memoryUsers.set(String(storedUser._id), storedUser);
    return storedUser;
  }

  return user.save();
};

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (USE_MEMORY_STORE) {
      const user = {
        _id: `mem-${memoryUserCounter++}`,
        firstName,
        lastName,
        email,
        mobile,
        password: hashedPassword,
      };

      await saveUser(user);
      return res.status(201).json({ message: "User registered successfully!", user: sanitizeUser(user) });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    await saveUser(user);
    res.status(201).json({ message: "User registered successfully!", user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

router.get("/validate", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.json({ message: "Token is valid", user: decoded });
  });
});

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      const user = await findUserById(decoded.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(sanitizeUser(user));
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
});

router.put("/profile/edit", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      const { firstName, lastName, mobile } = req.body;
      let updatedUser;

      if (USE_MEMORY_STORE) {
        const currentUser = await findUserById(decoded.userId);
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        updatedUser = {
          ...currentUser,
          firstName: firstName ?? currentUser.firstName,
          lastName: lastName ?? currentUser.lastName,
          mobile: mobile ?? currentUser.mobile,
        };

        memoryUsers.set(String(updatedUser._id), updatedUser);
      } else {
        updatedUser = await User.findByIdAndUpdate(
          decoded.userId,
          { firstName, lastName, mobile },
          { new: true, runValidators: true }
        );
      }

      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      res.json({ message: "Profile updated successfully!", user: sanitizeUser(updatedUser) });
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (USE_MEMORY_STORE) {
      return res.json({ message: "Password reset is unavailable in local memory mode." });
    }

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

module.exports = router;
