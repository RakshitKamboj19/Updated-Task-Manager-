const express = require("express");
const router = express.Router();
const { signup, login, otp } = require("../controllers/authControllers");

// Routes beginning with /api/auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/otp", otp);

module.exports = router;
