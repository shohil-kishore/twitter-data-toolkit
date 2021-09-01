// Obtains a detailed list of the people an individual is following.
// If interested in obtaining user information (such as username, network, profile location, etc) see lookup2).

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
var splitIDs;

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

  lookupAndSaveLoop(token, endpoint, maxRequests, maxResults, id);

  // Loops over all passed IDs and awaits for each response before proceeding. Takes next_token and rate limiting into account.
  async function lookupAndSaveLoop(
    token,
    endpoint,
    maxRequests,
    maxResults,
    id
  ) {
    splitIDs = id.split(",");
    // After splitting IDs, iterate over x requests for each ID.
    for (const splitID of splitIDs) {
      // Generates request and JSON file containing each response.
      await lookupAndSave(token, endpoint, maxRequests, maxResults, splitID);
    }
    console.log("Done!");
  }

  // Awaits for each response. Makes multiple requests based on a user-defined limit (maxRequests). Generates a JSON file containing each response.
  async function lookupAndSave(token, endpoint, maxRequests, maxResults, id) {
    for (let j = 0; j < Number(maxRequests); j++) {
      // Inserts request parameters and await response, takes rate limiting into account.
      var json = await generateRequest(token, endpoint, maxResults, id);
      // Writes JSON response to file, both data and backup directory.
      fs.writeFile(
        "../data/lookup-" + (j + 1) + "-" + id + ".json",
        json,
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      fs.writeFile(
        "../backup-data/lookup-" + (j + 1) + "-" + id + ".json",
        json,
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      // Exits loop if next_token is not returned.
      if (j >= 0 && !nextToken) {
        // successMessage =
        //   "Success! Data collection is complete. You can now proceed to merging the data.";
        console.log(
          "Success! User request did not exceed request limitations."
        );
        return;
      }
    }
    console.log(
      "Error! Data collection incomplete. If there was an error, it will be logged below. If nothing is logged, data exceeded request limitations."
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
      // Added timeout to deal with 15 requests per 15 minute window rate limiting.
      setTimeout(() => {
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
              // Error catching, usually an issue when rate limit is reached.
              if (body.errors || body.meta === undefined) {
                console.log(body.errors);
                nextToken = "";
                var json = JSON.stringify(body); // Resolves JSON early to end loop.
                resolve(json);
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
      }, 65000);
    });
  }

  // Redirect to refreshed page.
  setTimeout(() => {
    res.redirect("/lookup");
  }, 2000);
});

// Export to App.
module.exports = router;
