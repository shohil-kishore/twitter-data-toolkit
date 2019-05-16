const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Connect routes.
const router = require("./routes/collect.js");
const router = require("./routes/generate.js");
app.use(router);

// Homepage route.
app.get("/", (req, res) => {
  res.render("generate");
});

// Running on port 8080.
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
