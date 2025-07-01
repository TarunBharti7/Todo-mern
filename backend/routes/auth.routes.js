const express = require("express");
const User = require("../models/user.model.js");
const router = express.Router();
const { generateToken } = require("../jwt.js");
const passport = require("passport");

// login with google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/error" }),
  async (req, res) => {
    try {
      const { displayName, emails } = req.user;
      console.log(displayName,emails);
      
      const email = emails[0].value;

      // Check if the user already exists in the database
      let user = await User.findOne({ email });

      if (!user) {
        // Create a new user if not found
        user = new User({
          username: displayName,
          email: email,
          password: null, // No password for Google users
        });

        await user.save();
      }

      const token = generateToken(email);
      // ✅ Prevent duplicate response by using `return`
      return res.redirect(`http://localhost:5173/?token=${token}`);

      // return res.status(200).json({ msg: "You are logged in", token });
    } catch (error) {
      console.error("Google OAuth Error:", error);
      res.redirect("http://localhost:5173/?error=auth_failed");
    }
  }
);

module.exports = router;
