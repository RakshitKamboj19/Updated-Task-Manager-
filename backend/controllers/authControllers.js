const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/token");
const { validateEmail } = require("../utils/validation");
const {sendMail} = require("../utils/nodemailer");
require("dotenv").config();

// Sample call to sendMail (Test the function to see if it works)
// sendMail("ranveerwalia76@gmail.com", "Test Email", "<h1>Test Email</h1>").catch(console.error);


// Signup logic with email sending
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ msg: "Please send string values only" });
    }

    if (password.length < 4) {
      return res.status(400).json({ msg: "Password length must be at least 4 characters" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "This email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, otp });

    // Sending confirmation email to the user
    const emailBody = `
      <html>
        <head><title>Your OTP Code</title></head>
        <body>
          <h2>Hello, ${name}!</h2>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>This code is valid for the next 5 minutes. If you didn't request this, please ignore this email.</p>
          <p>Best Regards,</p>
          <p>Task Manager Team</p>
        </body>
      </html>
    `;

    console.log("Sending confirmation email...");
    sendMail(email, "Welcome to Task Manager", emailBody);
    res.status(200).json({ msg: "Congratulations! Account has been created for you.." });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Login logic with email sending (optional notification after login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, msg: "Please enter all details!" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false, msg: "This email is not registered!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, msg: "Password incorrect!" });

    const token = createAccessToken({ id: user._id });
    delete user.password;

    // Optional: send login alert email
    const emailBody = `
      <html>
        <head><title>Login Alert - Task Manager</title></head>
        <body>
          <h2>Hello, ${user.name}!</h2>
          <p>You have successfully logged into your Task Manager account.</p>
          <p>If this was not you, please reset your password immediately.</p>
          <p>Best Regards,</p>
          <p>Task Manager Team</p>
        </body>
      </html>
    `;

    console.log("Sending login alert email...");
    sendMail(user.email, "Login Alert - Task Manager", emailBody);

    res.status(200).json({ token, user, status: true, msg: "Login successful." });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};

exports.otp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "This email is not registered!" });
    }

    // Check OTP validity
    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ msg: "OTP has expired" });
    }

    // Clear OTP fields
    user.otp = null;
    user.isverified = true;
    await user.save();

    return res.status(200).json({ msg: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
