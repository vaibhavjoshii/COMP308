var clinicalvisit = require("../controllers/clinicalvisit.server.controller");
var login = require("../controllers/login.server.controller");

module.exports = function (app) {
  app
    .route("/api/clinicalvisit/create")
    .post(login.requiresLogin, login.isNurse, clinicalvisit.create);

  app.route("/api/clinicalvisits").get(clinicalvisit.list);

  app
    .route("/api/clinicalvisit/:clinicalvisitId")
    .get(clinicalvisit.read)
    .put(login.requiresLogin, clinicalvisit.hasAuthorization, clinicalvisit.update)
    .delete(login.requiresLogin, clinicalvisit.hasAuthorization, clinicalvisit.delete);
  app.param("clinicalvisitId", clinicalvisit.infoByID);
};