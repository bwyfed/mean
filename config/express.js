var config = require("./config"),
  express = require("express"),
  morgan = require("morgan"),
  compress = require("compression"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  session = require("express-session"),
  flash = require("connect-flash"),
  passport = require("passport");

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

  app.use(
    session({
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret
    })
  );

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  // 将 EJS 设置为默认的模板引擎
  app.set("views", "./app/views");
  app.set("view engine", "ejs");

  require("../app/routes/index.server.routes")(app);
  require("../app/routes/users.server.routes")(app);
  // 实现静态文件服务
  app.use(express.static("./public"));
  return app;
};
