const config = require("./config"),
  mongoose = require("mongoose");

module.exports = function () {
  const db = mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  require("../app/models/user.server.model");
  return db;
};
