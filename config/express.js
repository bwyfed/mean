var config = require("./config"),
  http = require("http"),
  socketio = require("socket.io"),
  express = require("express"),
  morgan = require("morgan"),
  compress = require("compression"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  session = require("express-session"),
  MongoStore = require("connect-mongo"),
  flash = require("connect-flash"),
  passport = require("passport");

module.exports = function (db) {
  const app = express();
  const server = http.createServer(app);
  const io = socketio(server);

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else if (process.env.NODE_ENV === "production") {
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  const mongoStore = MongoStore.create({ mongoUrl: config.db });

  app.use(
    session({
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret,
      store: mongoStore
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

  // 配置socket.io模块
  require("./socketio")(server, io, mongoStore);
  return server;
};
