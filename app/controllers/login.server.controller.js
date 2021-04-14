const User = require("mongoose").model("User");

const getErrorMessage = function (err) {
  var message = "";
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = "Username already exists";
        break;
      case 401:
        message = "User Doesn't Exist!";
      default:
        message = "Something went wrong!";
    }
  } else {
    for (const errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

exports.index = function (req, res) {
  res.render("index", {
    heading: "Express REST API",
  });
};

exports.create = function (req, res) {
  const user = new User(req.body);
  user.provider = "local";
  user.verified = true;
  user.save((err) => {
    if (err) {
      const message = getErrorMessage(err);
      req.flash("error", message); 
      return res.send({
        screen: "error",
        message: "Username already exist!",
      });
    } else {
      return res.json(user);
    }
  });
};

exports.welcome = function (req, res) {
  if (!req.user) {
    return res.send({ screen: "auth" }).end();
  }
  res.status(200).send({
    screen: req.user.username,
  });
};

exports.error = function (req, res) {
  console.log("error - no username");
  if (!req.user) {
    return res.status(200).send({
      screen: "error",
      message: "Username does not exist!",
    });
  }
};

exports.signout = function (req, res) {
  req.logout();
  req.session.destroy();
  return res.status("200").json({ message: "Signed Out!" });
};

exports.isSignedIn = (req, res) => {
  if (!req.user) {
    return res.send({ screen: "auth", role: "auth" }).end();
  }
  return res.send({ screen: req.user._id, role: req.user.role }).end();
};

exports.requiresLogin = function (req, res, next) {
  if (!req.user) {
    return res.send({ screen: "auth" }).end();
  }
  next();
};

exports.isPatient = function (req, res, next) {
  if (req.user && req.user.role === "patient") {
    next();
  } else {
    return res.status(403).send({
      message: "User is not able to create Daily Info",
    });
  }
};

exports.isNurse = function (req, res, next) {
  if (req.user && req.user.role === "nurse") {
    next();
  } else {
    return res.status(403).send({
      message: "User is not able to create Daily Info",
    });
  }
};
