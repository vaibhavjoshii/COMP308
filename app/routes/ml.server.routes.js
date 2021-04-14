module.exports = function (app) {
    const ml = require("../controllers/ml.server.controller");
  
    app.route("/api/ml/heartdisease").post(ml.heartdiseasepredict);
  };
  