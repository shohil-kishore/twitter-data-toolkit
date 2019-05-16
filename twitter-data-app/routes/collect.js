// All routes associated with data collection.
const express = require("express");
const router = express.Router();

var token;
var start;
var finish;
var endpoint;
var maxTweets;
var maxRequests;
var query;
var nextToken;

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

router.post("/collect", (req, res) => {
  token = req.body.token;
  start = req.body.start;
  finish = req.body.finish;
  endpoint = req.body.endpoint;
  maxTweets = req.body.maxTweets;
  maxRequests = req.body.maxRequests;
  query = req.body.query;

  twitterSearch(token, start, finish, endpoint, maxTweets, maxRequests, query);

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

    // Question mark allows query below.
    const url = endpoint + "?";
    const completedQuery = "(" + query + ")";
    const bearerToken = "Bearer " + token;
    var counter = 0;
    var queryObject;

    // while (counter < Number(maxRequests)) {
    if (counter === 0) {
      queryObject = {
        query: completedQuery,
        maxResults: Number(maxTweets),
        fromDate: start,
        toDate: finish
      };
    } else {
      queryObject = {
        query: completedQuery,
        maxResults: Number(maxTweets),
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
      (err, res, body) => {
        if (err) {
          console.log("error:", err);
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
    // }
  }

  // Should be a promise.
  setTimeout(() => {
    res.redirect("/collect");
  }, 10000);
});

module.exports = router;
