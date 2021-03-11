const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: {
    type: String,
    trim: true
  },
  password: String,
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
  }
});

UserSchema.set("toJSON", { getters: true });

mongoose.model("User", UserSchema);
