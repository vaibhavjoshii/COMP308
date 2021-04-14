const DailyInfo = require("mongoose").model("DailyInfo");

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
  var dailyInfo = new DailyInfo(req.body);
  console.log(dailyInfo);
  dailyInfo.lastModified = dailyInfo.created;

  dailyInfo.save((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err),
      });
    } else {
      res.status(200).json(dailyInfo);
    }
  });
};

exports.list = function (req, res) {
  DailyInfo.find()
    .sort("-owner")
    .sort("-created")
    .exec((err, dailyInfo) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err),
        });
      } else {
        return res.status(200).json(dailyInfo);
      }
    });
};

exports.infoByID = function (req, res, next, id) {
  DailyInfo.findById(id).exec((err, dailyInfo) => {
    if (err) return next(err);
    if (!dailyInfo) return next(new Error("Failed to load daily info " + id));
    req.dailyInfo = dailyInfo;
    req.dailyInfoId = dailyInfo._id;
    next();
  });
};

exports.hasAuthorization = function (req, res, next) {
  if (!req.dailyInfo.owner === req.user._id) {
    return res.status(403).send({
      message: "You are not authorized",
    });
  }
  next();
};

exports.read = function (req, res) {
  res.status(200).json(req.dailyInfo);
};

exports.update = function (req, res) {
  DailyInfo.findByIdAndUpdate({ _id: req.dailyInfoId }, req.body, function (
    err,
    dailyInfo
  ) {
    if (err) return next(err);
    res.json(dailyInfo);
  });
};

exports.delete = function (req, res) {
  DailyInfo.findOneAndRemove({ _id: req.dailyInfoId }, req.body, function (
    err,
    dailyInfo
  ) {
    if (err) return next(err);
    res.json(dailyInfo);
  });
};
