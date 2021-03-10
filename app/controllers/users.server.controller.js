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
