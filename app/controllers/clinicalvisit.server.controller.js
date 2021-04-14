const ClinicalVisit = require("mongoose").model("ClinicalVisit");

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
    const visit = new ClinicalVisit(req.body);

    visit.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err),
            });
        } else {
            res.status(200).json(visit);
        }
    });
};

exports.list = function (req, res) {
    ClinicalVisit.find()
        .sort("-created")
        .exec((err, visits) => {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err),
                });
            } else {
                return res.status(200).json(visits);
            }
        });
};

exports.infoByID = function (req, res, next, id) {
    ClinicalVisit.findById(id).exec((err, visit) => {
        if (err) return next(err);
        if (!visit) return next(new Error("Failed to load clinical visit " + id));
        req.visit = visit;
        req.visitId = visit._id;
        next();
    });
};

exports.hasAuthorization = function (req, res, next) {
    if (!req.visit.nurse === req.user._id) {
        return res.status(403).send({
            message: "You are not authorized",
        });
    }
    next();
};

exports.read = function (req, res) {
    res.status(200).json(req.visit);
};

exports.update = function (req, res) {
    ClinicalVisit.findByIdAndUpdate({
        _id: req.visitId
    }, req.body, function (
        err,
        visit
    ) {
        if (err) return next(err);
        res.json(visit);
    });
};

exports.delete = function (req, res) {
    ClinicalVisit.findOneAndRemove({
        _id: req.visitId
    }, req.body, function (
        err,
        visit
    ) {
        if (err) return next(err);
        res.json(visit);
    });
};