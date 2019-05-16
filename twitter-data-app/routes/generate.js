// All routes associated with Bearer Token Generation.
const express = require("express");
const router = express.Router();

var bearerToken;

// Get index which allows public/private input.
app.get("/generate", (req, res) => {
  res.render("generate", {
    bearerToken: bearerToken
  });
});

// Identify public/private key.
app.post("/generate", (req, res) => {
  var secretKey = req.body.secretKey;
  var publicKey = req.body.publicKey;

  // Makes HTTP request.
  generateToken(publicKey, secretKey);

  function generateToken(publicKey, secretKey) {
    var request = require("request");

    // Assign public key and secret key.
    var CONSUMER_KEY = publicKey;
    var CONSUMER_SECRET_KEY = secretKey;

    // Encode public key and secret key.
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
        bearerToken = "Success! Copy the token below: " + body.access_token;
      } else {
        bearerToken = "Sorry, something went wrong. Here's the error: " + error;
      }
    });
  }
  // Redirect to refreshed page.
  setTimeout(() => {
    res.redirect("/generate");
  }, 1000);
});

module.exports = router;
