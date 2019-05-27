// Import relevant packages.
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Setup EJS view engine and body parser (for responses).
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Connect routes.
const collectRoutes = require("./routes/collect.js");
const generateRoutes = require("./routes/generate.js");
const mergeRoutes = require("./routes/merge.js");
app.use(collectRoutes);
app.use(generateRoutes);
app.use(mergeRoutes);

// Listen on Port 8080.
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
