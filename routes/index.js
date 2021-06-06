const express = require("express");
const router = express.Router();
//utilizing object destructoring
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Tip = require("../models/Tip");

// @desc    Login/Landing page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// @desc    Dashboard
// @route   GET /dashboard & Utilizes the TipSchema in models
// req = request then lean() allows data to pass in data using handlebar template, render it and read that data
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const tips = await Tip.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      tips,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
