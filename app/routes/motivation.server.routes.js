var motivation = require("../controllers/motivation.server.controller.js");
var login = require("../controllers/login.server.controller");

module.exports = function (app) {
  app
    .route("/api/motivation/create")
    .post(login.requiresLogin, login.isPatient, motivation.create);

  app.route("/api/motivations").get(motivation.list);

  app
    .route("/api/motivation/:motivationId")
    .get(motivation.read)
    .put(login.requiresLogin, motivation.hasAuthorization, motivation.update)
    .delete(login.requiresLogin, motivation.hasAuthorization, motivation.delete);
  app.param("motivationId", motivation.infoByID);
};
