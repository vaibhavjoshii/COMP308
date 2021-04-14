module.exports = function (app) {
    const login = require("../controllers/login.server.controller");
    const passport = require("passport");
  
    app.route("/").get(login.index);

    app.route("/api/signup").post(login.create);
  
    app.route("/api/signin").post(
      passport.authenticate("local", {
        successRedirect: "/api/welcome",
        failureRedirect: "/api/error",
        failureFlash: true,
      })
    );

    app.route("/api/read_cookie").get(login.isSignedIn);
  
    app.route("/api/welcome").get(login.welcome);
    app.route("/api/error").get(login.error);

    app.route("/api/signout").get(login.signout);

    app.route("/users/:username")
        .get(login.read)
        .put(login.update)
        .delete(login.delete);

    app.param("username", login.userByID);
  
  };
  