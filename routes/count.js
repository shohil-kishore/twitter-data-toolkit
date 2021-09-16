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
var granularity;
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
    granularity: granularity,
    query: query,
  });
});

// Extract form data from POST route.
router.post("/count", (req, res) => {
  token = req.body.token;
  start = req.body.start;
  finish = req.body.finish;
  endpoint = req.body.endpoint;
  granularity = req.body.granularity;
  maxRequests = req.body.maxRequests;
  query = req.body.query;

  // Call count function.
  countAndSave(token, start, finish, endpoint, granularity, query, maxRequests);

  // Async function awaits for each response from the Twitter API. Makes multiple requests based on a user-defined limit (maxRequests). Generates a JSON file containing each response.
  async function countAndSave(
    token,
    start,
    finish,
    endpoint,
    granularity,
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
        granularity,
        query
      );
      // Writes JSON response to file, both data and backup directory.
      fs.writeFile(
        "./data/count-" + (index + 1) + ".json",
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
          "Success! Data collection did not exceed request limitations."
        );
        return;
      }
    }
    console.log(
      "Error, data collection incomplete. If there was an error, it is logged below. If nothing is logged, data collection exceeded request limitations."
    );
  }

  // Compiles and sends the request as a Promise.
  function generateRequest(token, start, finish, endpoint, granularity, query) {
    // Setup variables.
    const url = endpoint + "?";
    const completedQuery = "(" + query + ")";
    const bearerToken = "Bearer " + token;
    var queryObject;

    // Checks if nextToken is not blank.
    if (!nextToken) {
      queryObject = {
        query: completedQuery,
        granularity: granularity,
        start_time: start,
        end_time: finish,
      };
    } else if (nextToken) {
      queryObject = {
        query: completedQuery,
        granularity: granularity,
        start_time: start,
        end_time: finish,
        next_token: nextToken,
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
            "User-Agent": "v2FullArchiveJS",
          },
        },
        // Saves the next token for further processing. Returns the response in a JSON format.
        (err, res, body) => {
          if (err) {
            console.log(err);
          } else if (res && body) {
            // Returns blank, exiting for loop if no more requests to be made.
            if (body.errors || body.meta === undefined) {
              setTimeout(() => {
                console.log(
                  "Rate limited, waiting 10 seconds before trying again... "
                );
                console.log(body.error);
                nextToken = nextToken;
                var json = JSON.stringify(body); // Resolves JSON early to end loop.
                resolve(json);
              }, 10000);
            } else if (body.meta.next_token) {
              nextToken = body.meta.next_token;
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
