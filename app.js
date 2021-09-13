// Import relevant packages.
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const port = 8080;

// Setup EJS view engine and body parser (for responses).
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Connect routes.
const collectRoutes = require("./routes/collect.js");
const countRoutes = require("./routes/count.js");
const mergeRoutes = require("./routes/merge.js");
app.use(collectRoutes);
app.use(countRoutes);
app.use(mergeRoutes);

// Listen on Port 8080.
app.listen(port, () => {
  console.log("Twitter Data Toolkit is running on http://localhost:" + port);
});
