var dailyInfo = require("../controllers/dailyinfo.server.controller");
var login = require("../controllers/login.server.controller");

module.exports = function (app) {

  app
    .route("/api/dailyInfo/create")
    .post(login.requiresLogin, login.isPatient, dailyInfo.create);

  app.route("/api/dailyInfos").get(dailyInfo.list);

  app
    .route("/api/dailyInfo/:dailyInfoId")
    .get(dailyInfo.read)
    .put(login.requiresLogin, dailyInfo.hasAuthorization, dailyInfo.update)
    .delete(login.requiresLogin, dailyInfo.hasAuthorization, dailyInfo.delete);
  app.param("dailyInfoId", dailyInfo.infoByID);
};