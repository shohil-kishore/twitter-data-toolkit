const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.locals.generateBearerToken = (consumerKey, consumerSecretKey) => {
  var request = require("request");

  // Assign key and secret key.
  var CONSUMER_KEY = consumerKey;
  var CONSUMER_SECRET_KEY = consumerSecretKey;

  // Encode key and secret key.
  var ENCODED_KEY = new Buffer(
    CONSUMER_KEY + ":" + CONSUMER_SECRET_KEY
  ).toString("base64");

  // Configure request.
  var options = {
    url: "https://api.twitter.com/oauth2/token",
    headers: {
      Authorization: "Basic " + ENCODED_KEY,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: "grant_type=client_credentials"
  };

  // Request returns string, so it must be parsed.
  request.post(options, function(error, response, body) {
    body = JSON.parse(body);

    // Returning the key or handling the error.
    if (body.token_type === "bearer") {
      console.log("Success! Bearer token: " + body.access_token);
      return body.access_token;
    } else {
      console.log("Sorry, something went wrong. Here's the error: " + error);
      return error;
    }
  });
};

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
