// Import packages.
const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");

// Define variables used in multiple routes.
var token;
var endpoint;
var id = [];

// Pass through variables to GET route.
router.get("/lookup", (req, res) => {
  res.render("lookup", {
    token: token,
    endpoint: endpoint,
  });
});

// Extract form data from POST route.
router.post("/lookup", (req, res) => {
  token = req.body.token;
  endpoint = req.body.endpoint;

  lookupAndSaveLoop(token, endpoint, id);

  // Loops over all passed IDs and awaits for each response before proceeding. Takes next_token and rate limiting into account.
  async function lookupAndSaveLoop(token, endpoint, id) {
    console.log("Length of initial IDs array: " + id.length);
    var perChunk = 99; // endpoint can handle up to 100 at a time.
    var result = id.reduce((splitIDs, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);
      if (!splitIDs[chunkIndex]) {
        splitIDs[chunkIndex] = []; // start a new chunk.
      }
      splitIDs[chunkIndex].push(item);
      return splitIDs;
    }, []);

    // console.log(result);

    // After splitting IDs, iterate over x requests for each ID.
    for (let i = 0; i < result.length; i++) {
      idStr = result[i].toString();
      idStr = idStr.replace('"', "");
      idStr = idStr.replace("'", "");
      // console.log(idStr);
      // Generates request and JSON file containing each response.
      await lookupAndSave(token, endpoint, idStr, i);
      console.log("Success! User request did not exceed request limitations.");
    }
  }

  // Awaits for each response. Generates a JSON file containing each response.
  async function lookupAndSave(token, endpoint, id, i) {
    // Inserts request parameters and await response, takes rate limiting into account.
    var json = await generateRequest(token, endpoint, id);
    // Writes JSON response to file, both data and backup directory.
    fs.writeFile(
      "../data/lookup-" + (i + 1) + "-" + id.charAt(0) + ".json",
      json,
      "utf8",
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    fs.writeFile(
      "../backup-data/lookup-" + (i + 1) + "-" + id.charAt(0) + ".json",
      json,
      "utf8",
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    // Exits loop if next_token is not returned.
    console.log("Success! Request complete.");
    return;
  }

  // Compiles and sends the request as a Promise.
  function generateRequest(token, endpoint, id) {
    // Setup variables.
    const url = endpoint + "?ids=" + id;
    // console.log(url);
    const bearerToken = "Bearer " + token;
    var queryObject;
    // console.log(queryObject);

    queryObject = {
      "user.fields":
        "created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld",
    };

    // Return request as a Promise (required for async/await).
    return new Promise(function (resolve, reject) {
      // Added timeout to deal with 300 requests per 15 minute window rate limiting.
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
                // console.log(body.errors);
                var json = JSON.stringify(body); // Resolves JSON early to end loop.
                resolve(json);
              }
              var json = JSON.stringify(body);
              resolve(json);
            }
          }
        );
      }, 3500);
    });
  }

  // Redirect to refreshed page.
  setTimeout(() => {
    res.redirect("/lookup");
  }, 2000);
});

// Export to App.
module.exports = router;
