const mongoose = require("mongoose"),
  crypto = require("crypto"),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    index: true,
    match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: "Username is required"
  },
  password: {
    type: String,
    validate: [
      function (password) {
        return password && password.length >= 6;
      },
      "Password should be longer"
    ]
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: "Provider is required"
  },
  providerId: String,
  providerData: {},
  created: {
    type: Date,
    default: Date.now
  },
  website: {
    type: String,
    set: function (url) {
      console.log("set website:", url);
      if (!url) {
        return url;
      } else {
        if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
          url = "http://" + url;
        }
        return url;
      }
    },
    get: function (url) {
      if (!url) {
        return url;
      } else {
        if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
          url = "http://" + url;
        }
        return url;
      }
    }
  },
  role: {
    type: String,
    enum: ["Admin", "Owner", "User"]
  }
});
// 增加虚拟属性
UserSchema.virtual("fullName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (fullName) {
    const splitName = fullName.split(" ");
    this.firstName = splitName[0] || "";
    this.lastName = splitName[1] || "";
  });
UserSchema.set("toJSON", { getters: true, virtuals: true });

// 自定义静态方法
UserSchema.statics.findOneByUsername = function (username, callback) {
  this.findOne({ username: new RegExp(username, "i") }, callback);
};
// 自定义实例方法
UserSchema.methods.authenticate = function (password) {
  return this.password === password;
};

// 预处理中间件
UserSchema.pre("save", function (next) {
  // if (process.env.NODE_ENV === "development") {
  //   next();
  // } else {
  //   next(new Error("An Error Occurred."));
  // }
  if (this.password) {
    this.salt = Buffer.from(
      crypto.randomBytes(16).toString("base64"),
      "base64"
    );
    this.password = this.hashPassword(this.password);
  }

  next();
});

UserSchema.methods.hashPassword = function (password) {
  return crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, null)
    .toString("base64");
};

UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  const _this = this;
  const possibleUsername = username + (suffix || "");

  _this.findOne({ username: possibleUsername }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

UserSchema.post("save", function (next) {
  if (this.isNew) {
    console.log("A new user was created.");
  } else {
    console.log("A user updated is details");
  }
});
mongoose.model("User", UserSchema);
