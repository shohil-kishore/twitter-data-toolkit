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

  collectData(token, start, finish, endpoint, maxTweets, query, maxRequests);
  /*
  This function compiles the request and makes multiple requests based on a user-defined limit. It then writes the response to a file to be combined later on.
  */
  async function collectData(
    token,
    start,
    finish,
    endpoint,
    maxTweets,
    query,
    maxRequests
  ) {
    const fs = require("fs");

    for (let index = 0; index < Number(maxRequests); index++) {
      var json = await twitterSearch(
        token,
        start,
        finish,
        endpoint,
        maxTweets,
        query,
        index
      );
      fs.writeFile(
        "response-" + (index + 1) + "-" + start + ".json",
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

  function twitterSearch(
    token,
    start,
    finish,
    endpoint,
    maxTweets,
    query,
    index
  ) {
    const request = require("request");

    // Setup variables.
    const url = endpoint + "?";
    const completedQuery = "(" + query + ")";
    const bearerToken = "Bearer " + token;
    var queryObject;

    // For loop, keeps running based on a user-defined limit.
    if (index === 0) {
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
        toDate: finish,
        next: nextToken
      };
    }
    // Structure request (JSON content).
    return new Promise(function(resolve, reject) {
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
            nextToken = body.next;
            console.log(nextToken);
            var json = JSON.stringify(body);
            resolve(json);
          }
        }
      );
    });
  }

  // Should be a promise.
  setTimeout(() => {
    res.redirect("/collect");
  }, 10000);
});

// Export to App.
module.exports = router;
