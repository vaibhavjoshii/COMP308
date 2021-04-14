// Load the module dependencies
const passport = require("passport");
const mongoose = require("mongoose");

// Define the Passport configuration method
module.exports = function() {
    const User = mongoose.model("User");
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
      User.findOne({
          _id: id
        },
        "-password -salt",
        (err, user) => {
          done(err, user);
        });
    });
  
    // Load Passport's strategies configuration files
    require("./strategies/local.js")();
};