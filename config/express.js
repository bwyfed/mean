const express = require("express");

module.exports = function () {
  const app = express();
  require("../app/routes/index.server.routes")(app);
  return app;
};
