var express = require("express"),
  morgan = require("morgan"),
  compress = require("compression"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");

module.exports = function () {
  const app = express();

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else if (process.env.NODE_ENV === "production") {
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // 将 EJS 设置为默认的模板引擎
  app.set("views", "./app/views");
  app.set("view engine", "ejs");

  require("../app/routes/index.server.routes")(app);
  return app;
};
