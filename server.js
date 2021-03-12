process.env.NODE_ENV = process.env.NODE_ENV || "development";

const mongoose = require("./config/mongoose"),
  express = require("./config/express"),
  Passport = require("./config/passport");

// Create a new Mongoose connection instance
const db = mongoose();

// Create a new Express application instance
const app = express();

// Configure the Passport middleware
const passport = Passport();
app.listen(3000);
module.exports = app;

console.log("Server running at http://localhost:3000/");
