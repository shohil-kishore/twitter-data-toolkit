const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Setup EJS view engine and body parser (for responses).
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Connect routes.
const collectRoutes = require("./routes/collect.js");
const generateRoutes = require("./routes/generate.js");
app.use(collectRoutes);
app.use(generateRoutes);

// Homepage route.
app.get("/", (req, res) => {
  res.render("generate");
});

// Running on port 8080.
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
