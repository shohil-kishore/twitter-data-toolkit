const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/generate-token", (req, res) => {
  var secretKey = req.query.secret;
  var publicKey = req.query.public;
  res.render("token-generator.ejs", {
    secretKey: secretKey,
    publicKey: publicKey
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
