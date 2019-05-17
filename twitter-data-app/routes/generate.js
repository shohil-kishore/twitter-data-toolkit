// All routes associated with bearer token generation.
const express = require("express");
const router = express.Router();

// Define variables used in multiple routes.
var bearerToken;

// Pass through token.
router.get("/generate", (req, res) => {
  res.render("generate", {
    bearerToken: bearerToken
  });
});

// Identify public/private key entered in form.
router.post("/generate", (req, res) => {
  var consumerSecretKey = req.body.secretKey;
  var consumerKey = req.body.publicKey;
  generateToken(consumerKey, consumerSecretKey);

  /* 
  This function compiles the public and private key and submits a request to the Twitter API to generate the bearer token. This token is required when interacting with the Twitter API.
  */
  function generateToken(consumerKey, consumerSecretKey) {
    var request = require("request");

    // Encode public key and secret key.
    var encodedKey = new Buffer(consumerKey + ":" + consumerSecretKey).toString(
      "base64"
    );

    // Configure request.
    var options = {
      url: "https://api.twitter.com/oauth2/token",
      headers: {
        Authorization: "Basic " + encodedKey,
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
  }, 2000);
});

// Export to App.
module.exports = router;
