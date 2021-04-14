const EmergencyAlert = require("mongoose").model("EmergencyAlert");

const getErrorMessage = function (err) {
  var message = "";
  if (err.code) {
    switch (err.code) {
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

exports.create = function (req, res) {
  const emergencyalert = new EmergencyAlert(req.body);

  emergencyalert.owner = req.user._id;
  emergencyalert.unread = true;
  emergencyalert.created = new Date();

  emergencyalert.save((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err),
      });
    } else {
      res.status(200).json(emergencyalert);
    }
  });
};

exports.list = function (req, res) {
  EmergencyAlert.find()
    .sort({ created: -1 })
    .sort("-owner")
    .exec((err, emergencyalerts) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        return res.status(200).json(emergencyalerts);
      }
    });
};

exports.infoByID = function (req, res, next, id) {
  EmergencyAlert.findById(id).exec((err, emergencyalert) => {
    if (err) return next(err);
    if (!emergencyalert) return next(new Error("Failed to load emergencyalert " + id));
    req.emergencyalert = emergencyalert;
    req.emergencyalertId = emergencyalert._id;
    next();
  });
};

exports.hasAuthorization = function (req, res, next) {
  if (!req.emergencyalert.owner === req.user._id) {
    return res.status(403).send({
      message: "You are not authorized",
    });
  }
  next();
};

exports.read = function (req, res) {
  EmergencyAlert.findByIdAndUpdate({ _id: req.emergencyalertId }, { unread: false }, function (
    err,
    emergencyalert
  ) {
    if (err) return next(err);
    res.json(emergencyalert);
  });
};


exports.update = function (req, res) {
  EmergencyAlert.findByIdAndUpdate({ _id: req.emergencyalertId }, req.body, function (
    err,
    emergencyalert
  ) {
    if (err) return next(err);
    res.json(emergencyalert);
  });
};

exports.delete = function (req, res) {
  EmergencyAlert.findOneAndRemove({ _id: req.emergencyalertId }, req.body, function (err, emergencyalert) {
    if (err) return next(err);
    res.json(emergencyalert);
  });
};
