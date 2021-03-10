const User = require("mongoose").model("User");

exports.create = function (req, res, next) {
  const user = new User(req.body);

  user.save(function (err) {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

exports.list = function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      return next(err);
    } else {
      res.json(users);
    }
  });
};

exports.read = function (req, res) {
  console.log("read");
  res.json(req.user);
};

exports.userByID = function (req, res, next, id) {
  console.log("userByID");
  User.findOne({ _id: id }, function (err, user) {
    if (err) {
      return next(err);
    } else {
      req.user = user;
      next();
    }
  });
};
