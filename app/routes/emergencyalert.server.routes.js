var emergencyalert = require("../controllers/emergencyalert.server.controller");
var login = require("../controllers/login.server.controller");

module.exports = function (app) {
  app
    .route("/api/emergencyalert/create")
    .post(login.requiresLogin, login.isPatient, emergencyalert.create);

  app.route("/api/emergencyalerts").get(emergencyalert.list);

  app
    .route("/api/emergencyalert/:emergencyalertId")
    .get(emergencyalert.read)
    .put(login.requiresLogin, emergencyalert.hasAuthorization, emergencyalert.update)
    .delete(login.requiresLogin, emergencyalert.hasAuthorization, emergencyalert.delete);
  app.param("emergencyalertId", emergencyalert.infoByID);
};
