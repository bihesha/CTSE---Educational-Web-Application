const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('./models/student');
const jwt = require('jsonwebtoken');
require("dotenv").config(); // Ensure this is at the top

if (!process.env.USER_MANAGEMENT_CLIENT_ID || !process.env.USER_MANAGEMENT_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

passport.use(new GoogleStrategy({
  clientID: process.env.USER_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.USER_MANAGEMENT_CLIENT_SECRET,
  callbackURL: "/google-auth/google/callback", 
  scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ Email: profile.emails[0].value });

    if (!user) {
      user = new User({
        googleId: profile.id,
        Fullname: profile.displayName,
        Email: profile.emails[0].value,
        Type: 'student',
        Password: ''
      });
      await user.save();
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport; // Ensure passport is exported properly
