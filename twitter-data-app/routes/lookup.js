// Import packages.
const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");

// Define variables used in multiple routes.
var token;
var endpoint;
var maxResults;
var maxRequests;
var id;
var nextToken;

// Pass through variables to GET route.
router.get("/lookup", (req, res) => {
  res.render("lookup", {
    token: token,
    endpoint: endpoint,
    maxRequests: maxRequests,
    maxResults: maxResults,
    id: id,
  });
});

// Extract form data from POST route.
router.post("/lookup", (req, res) => {
  token = req.body.token;
  endpoint = req.body.endpoint;
  maxRequests = req.body.maxRequests;
  maxResults = req.body.maxResults;
  id = req.body.id;

  // Call count function.
  lookupAndSave(token, endpoint, maxRequests, maxResults, id);

  // Async function awaits for each response from the Twitter API. Makes multiple requests based on a user-defined limit (maxRequests). Generates a JSON file containing each response.
  async function lookupAndSave(token, endpoint, maxRequests, maxResults, id) {
    for (let index = 0; index < Number(maxRequests); index++) {
      // Insert request parameters and await response.
      var json = await generateRequest(token, endpoint, maxResults, id);
      // Writes JSON response to file, both data and backup directory.
      fs.writeFile(
        "../data/lookup-" + (index + 1) + "-" + id + ".json",
        json,
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      fs.writeFile(
        "../backup-data/lookup-" + (index + 1) + "-" + id + ".json",
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
          "Success! Data collection complete. Data did not exceed request limitations."
        );
        return;
      }
    }
    console.log(
      "Error: Data collection incomplete. If there was an error, it will be logged below. If nothing is logged, data exceeded request limitations."
    );
  }

  // Compiles and sends the request as a Promise.
  function generateRequest(token, endpoint, maxResults, id) {
    // Setup variables.
    const url = endpoint + id + "/following?";
    const bearerToken = "Bearer " + token;
    var queryObject;

    // Checks if nextToken is not blank.
    if (!nextToken) {
      queryObject = {
        max_results: maxResults,
      };
    } else if (nextToken) {
      queryObject = {
        max_results: maxResults,
        pagination_token: nextToken,
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
            if (body.errors) {
              console.log("There was an error with your request, check below:");
              console.log(body.errors);
            } else if (body.meta.next_token) {
              nextToken = body.meta.next_token;
            } else {
              nextToken = "";
            }
            console.log("Token" + nextToken);
            console.log("err" + err);
            console.log("res" + res);
            console.log("body" + body);
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
