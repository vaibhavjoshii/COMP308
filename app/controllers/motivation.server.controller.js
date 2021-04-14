const Motivation = require("mongoose").model("Motivation");

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
  const motivation = new Motivation(req.body);

  motivation.owner = req.user._id;
  motivation.unread = true;
  motivation.created = new Date();

  motivation.save((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err),
      });
    } else {
      res.status(200).json(motivation);
    }
  });
};

exports.list = function (req, res) {
    Motivation.find()
    .sort({ created: -1 })
    .sort("-owner")
    .exec((err, motivations) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        return res.status(200).json(motivations);
      }
    });
};

exports.infoByID = function (req, res, next, id) {
    Motivation.findById(id).exec((err, motivation) => {
    if (err) return next(err);
    if (!motivation) return next(new Error("Failed to load motivation " + id));
    req.motivation = motivation;
    req.motivationtId = motivation._id;
    next();
  });
};

exports.hasAuthorization = function (req, res, next) {
  if (!req.motivation.owner === req.user._id) {
    return res.status(403).send({
      message: "You are not authorized",
    });
  }
  next();
};

exports.read = function (req, res) {
    Motivation.findByIdAndUpdate({ _id: req.motivationId }, { unread: false }, function (
    err,
    motivation
  ) {
    if (err) return next(err);
    res.json(motivation);
  });
};


exports.update = function (req, res) {
    Motivation.findByIdAndUpdate({ _id: req.motivationId }, req.body, function (
    err,
    motivation
  ) {
    if (err) return next(err);
    res.json(motivation);
  });
};

exports.delete = function (req, res) {
    Motivation.findOneAndRemove({ _id: req.motivationId }, req.body, function (err, motivation) {
    if (err) return next(err);
    res.json(motivation);
  });
};
