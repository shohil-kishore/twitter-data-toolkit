// All routes associated with bearer token generation.
const express = require("express");
const router = express.Router();
var request = require("request");

// Define variables used in multiple routes.
var bearerToken;

// Pass through token.
router.get("/generate", (req, res) => {
  res.render("generate", {
    bearerToken: bearerToken,
  });
});

// Identify public/private key entered in form.
router.post("/generate", (req, res) => {
  var consumerSecretKey = req.body.secretKey;
  var consumerKey = req.body.publicKey;
  saveToken(consumerKey, consumerSecretKey);

  // Async function that awaits for response from Twitter API.
  async function saveToken(consumerKey, consumerSecretKey) {
    // Generate token.
    var json = await generateToken(consumerKey, consumerSecretKey);
    // Return key or handle the error.
    if (json.token_type === "bearer") {
      bearerToken = "Success! Copy the token below: " + json.access_token;
    } else {
      bearerToken = "Sorry, something went wrong. Here's the error: " + err;
    }
    // Redirect to refreshed page.
    res.redirect("/generate");
  }

  // This function compiles the public and private key and submits a request to the Twitter API to generate the bearer token. This token is required when interacting with the Twitter API.
  function generateToken(consumerKey, consumerSecretKey) {
    // Encode public key and secret key.
    var encodedKey = new Buffer(consumerKey + ":" + consumerSecretKey).toString(
      "base64"
    );

    // Configure request.
    var options = {
      url: "https://api.twitter.com/oauth2/token",
      headers: {
        Authorization: "Basic " + encodedKey,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: "grant_type=client_credentials",
    };

    // Submit request then parse body and resolve Promise.
    return new Promise((resolve, reject) => {
      request.post(options, function (err, res, body) {
        json = JSON.parse(body);
        resolve(json);
      });
    });
  }
});

// Export to App.
module.exports = router;
