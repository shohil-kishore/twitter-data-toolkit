const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Set view engine and body parser.
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// Global variable.
var bearerToken;

// Get index which allows public/private input.
app.get("/", (req, res) => {
  res.render("index.ejs", {
    bearerToken: bearerToken
  });
});

// Identify public/private key.
app.post("/generate-token", async (req, res) => {
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
    res.redirect("/");
  }, 1000);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
