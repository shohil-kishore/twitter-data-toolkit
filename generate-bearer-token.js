// Install Node.js and the request package before running.
// 'npm install request' 
// Code implements steps from here: https://developer.twitter.com/en/docs/basics/authentication/overview/application-only.html

// Imports.
var request = require('request');

// Insert key/secret constants here. This is all that needs to be changed.
var CONSUMER_KEY = '';
var CONSUMER_SECRET_KEY = '';

// Encode key and secret key.
var ENCODED_KEY = new Buffer(CONSUMER_KEY + ':' + CONSUMER_SECRET_KEY).toString('base64');

// As per documentation.
var options = {
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
        'Authorization': 'Basic ' + ENCODED_KEY,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
    body: 'grant_type=client_credentials'
};

// A string is returned from the request, so the body must be parsed. 
request.post(options, function(error, response, body) {
    body = JSON.parse(body);

    // Basic error handling.
    if (body.token_type === "bearer") {
      console.log("Success! Bearer token:");
      console.log(body.access_token);
    } else {
      console.log("Sorry, something went wrong. Here's the error: ");
      console.log(error); 
    }
});