// Import packages.
const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");

// Define variables used in multiple routes.
var token;
var start;
var finish;
var endpoint;
var bucket;
var maxRequests;
var query;
var nextToken;

// Pass through variables to GET route.
router.get("/count", (req, res) => {
  res.render("count", {
    token: token,
    start: start,
    finish: finish,
    endpoint: endpoint,
    maxRequests: maxRequests,
    bucket: bucket,
    query: query,
  });
});

// Extract form data from POST route.
router.post("/count", (req, res) => {
  token = req.body.token;
  start = req.body.start;
  finish = req.body.finish;
  endpoint = req.body.endpoint;
  bucket = req.body.bucket;
  maxRequests = req.body.maxRequests;
  query = req.body.query;

  // Call count function.
  countAndSave(token, start, finish, endpoint, bucket, query, maxRequests);

  // Async function awaits for each response from the Twitter API. Makes multiple requests based on a user-defined limit (maxRequests). Generates a JSON file containing each response.
  async function countAndSave(
    token,
    start,
    finish,
    endpoint,
    bucket,
    query,
    maxRequests
  ) {
    for (let index = 0; index < Number(maxRequests); index++) {
      // Insert request parameters and await response.
      var json = await generateRequest(
        token,
        start,
        finish,
        endpoint,
        bucket,
        query
      );
      // Writes JSON response to file, both data and backup directory.
      fs.writeFile(
        "../data/count-" + (index + 1) + "-" + start + ".json",
        json,
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      fs.writeFile(
        "../backup-data/count-" + (index + 1) + "-" + start + ".json",
        json,
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      // Exits loop if next token is not returned.
      if (index > 0 && !nextToken) {
        // successMessage =
        //   "Success! Data collection is complete. You can now proceed to merging the data.";
        console.log(
          "Count data collection complete. Data did not exceed request limitations."
        );
        return;
      }
    }
    console.log(
      "Count data collection complete, however, data exceeded request limitations."
    );
  }

  // Compiles and sends the request as a Promise.
  function generateRequest(token, start, finish, endpoint, bucket, query) {
    // Setup variables.
    const url = endpoint + "?";
    const completedQuery = "(" + query + ")";
    const bearerToken = "Bearer " + token;
    var queryObject;

    // Checks if nextToken is not blank.
    if (!nextToken) {
      queryObject = {
        query: completedQuery,
        bucket: bucket,
        fromDate: start,
        toDate: finish,
      };
    } else if (nextToken) {
      queryObject = {
        query: completedQuery,
        bucket: bucket,
        fromDate: start,
        toDate: finish,
        next: nextToken,
      };
    }

    // Return request as a Promise (required for async/await).
    return new Promise(function (resolve, reject) {
      request(
        {
          url: url,
          qs: queryObject,
          json: true,
          headers: {
            Authorization: bearerToken,
            "Content-Type": "application/json",
          },
        },
        // Saves the next token for further processing. Returns the response in a JSON format.
        (err, res, body) => {
          if (err) {
            console.log(err);
          } else if (res && body) {
            // Returns blank, exiting for loop if no more requests to be made.
            if (body.next) {
              nextToken = body.next;
            } else {
              nextToken = "";
            }
            var json = JSON.stringify(body);
            resolve(json);
          }
        }
      );
    });
  }

  // Redirect to refreshed page.
  setTimeout(() => {
    res.redirect("/count");
  }, 2000);
});

// Export to App.
module.exports = router;
