// Load the module dependencies
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("mongoose").model("User");

// Create the Local strategy configuration method
module.exports = function () {
    // Use the Passport's Local strategy
    passport.use(new LocalStrategy(function (username, password, done) {
        User.findOne({
            username: username,
          },(err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false, {
                message: "Unknown user",
              });
            }
            if (!user.authenticate(password)) {
              return done(null, false, {
                message: "Invalid password",
              });
            }
            return done(null, user);
          });
      }));
  };
  