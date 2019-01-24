/* 
This code allows users to generate a bearer token.

generateBearerToken requires two parameters (Consumer Key and Consumer Secret Key) which can be obtained from Twitter.

More information can be found here: https://developer.twitter.com/en/docs/basics/authentication/overview/application-only.html
*/

// Replace each string with the relevant key. Enclose each key in quotation marks as below.
generateBearerToken("CONSUMER_KEY", "CONSUMER_SECRET_KEY");

function generateBearerToken(consumerKey, consumerSecretKey) {
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
      console.log("Success! Bearer token: ");
      console.log(body.access_token);
      return body.access_token;
    } else {
      console.log("Sorry, something went wrong. Here's the error: ");
      console.log(error);
    }
  });
}
