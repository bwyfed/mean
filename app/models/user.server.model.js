const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    index: true,
    match: /.+\@.+\..+/
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    validate: [
      function (password) {
        return password.length >= 6;
      },
      "Password should be longer"
    ]
  },
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
  if (process.env.NODE_ENV === "development") {
    next();
  } else {
    next(new Error("An Error Occurred."));
  }
});
UserSchema.post("save", function (next) {
  if (this.isNew) {
    console.log("A new user was created.");
  } else {
    console.log("A user updated is details");
  }
});
mongoose.model("User", UserSchema);
