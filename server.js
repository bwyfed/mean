process.env.NODE_ENV = process.env.NODE_ENV || "development";

const mongoose = require("./config/mongoose"),
  express = require("./config/express");

const db = mongoose();
const app = express();
app.listen(3000);
module.exports = app;

console.log("Server running at http://localhost:3000/");
