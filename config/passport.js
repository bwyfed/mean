const passport = require("passport"),
  mongoose = require("mongoose");

module.exports = function () {
  const User = mongoose.model("User");

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne(
      {
        _id: id
      },
      "-passport -salt",
      function (err, user) {
        done(err, user);
      }
    );
  });

  require("./strategies/local")();
};
