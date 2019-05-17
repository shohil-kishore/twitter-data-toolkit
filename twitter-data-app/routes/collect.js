// All routes associated with data collection.
const express = require("express");
const router = express.Router();

// Define variables used in multiple routes.
var token;
var start;
var finish;
var endpoint;
var maxTweets;
var maxRequests;
var query;
var nextToken;

// Pass through variables.
router.get("/collect", (req, res) => {
  res.render("collect", {
    token: token,
    start: start,
    finish: finish,
    endpoint: endpoint,
    maxRequests: maxRequests,
    maxTweets: maxTweets,
    query: query
  });
});

// Extract form data.
router.post("/collect", (req, res) => {
  token = req.body.token;
  start = req.body.start;
  finish = req.body.finish;
  endpoint = req.body.endpoint;
  maxTweets = req.body.maxTweets;
  maxRequests = req.body.maxRequests;
  query = req.body.query;
  twitterSearch(token, start, finish, endpoint, maxTweets, maxRequests, query);

  /*
  This function compiles the request and makes multiple requests based on a user-defined limit. It then writes the response to a file to be combined later on.
  */
  function twitterSearch(
    token,
    start,
    finish,
    endpoint,
    maxTweets,
    maxRequests,
    query
  ) {
    const request = require("request");
    const fs = require("fs");

    // Setup variables.
    const url = endpoint + "?";
    const completedQuery = "(" + query + ")";
    const bearerToken = "Bearer " + token;
    var counter = 0;
    var queryObject;

    // While loop, keeps running based on a user-defined limit.
    while (counter < Number(maxRequests)) {
      if (counter === 0) {
        queryObject = {
          query: completedQuery,
          maxResults: maxTweets,
          fromDate: start,
          toDate: finish
        };
      } else {
        queryObject = {
          query: completedQuery,
          maxResults: maxTweets,
          fromDate: start,
          toDate: finish
        };
      }
      // Structure request (JSON content).
      request(
        {
          url: url,
          qs: queryObject,
          json: true,
          headers: {
            Authorization: bearerToken,
            "Content-Type": "application/json"
          }
        },
        // If there aren't any errors, the JSON object (data) will be written to a file.
        (err, res, body) => {
          if (err) {
            console.log(err);
          } else if (res && body) {
            counter++;
            console.log(body);
            console.log(body.next);
            var json = JSON.stringify(body);
            fs.writeFile(
              "response-" + counter + "-" + start + ".json",
              json,
              "utf8",
              err => {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        }
      );
    }
  }

  // Should be a promise.
  setTimeout(() => {
    res.redirect("/collect");
  }, 10000);
});

// Export to App.
module.exports = router;
