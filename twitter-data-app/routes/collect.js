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
var maxTweets;
var maxRequests;
var query;
var nextToken;
var fields;

// Pass through variables to GET route.
router.get("/collect", (req, res) => {
  res.render("collect", {
    token: token,
    start: start,
    finish: finish,
    endpoint: endpoint,
    maxRequests: maxRequests,
    maxTweets: maxTweets,
    query: query,
    fields: fields,
  });
});

// Extract form data from POST route.
router.post("/collect", (req, res) => {
  token = req.body.token;
  start = req.body.start;
  finish = req.body.finish;
  endpoint = req.body.endpoint;
  maxTweets = req.body.maxTweets;
  maxRequests = req.body.maxRequests;
  query = req.body.query;
  fields = req.body.fields;

  // Call data collection function.
  collectAndSaveData(
    token,
    start,
    finish,
    endpoint,
    maxTweets,
    query,
    maxRequests,
    fields
  );

  // Async function awaits for each response from the Twitter API. Makes multiple requests based on a user-defined limit (maxRequests). Generates a JSON file containing each response.
  async function collectAndSaveData(
    token,
    start,
    finish,
    endpoint,
    maxTweets,
    query,
    maxRequests,
    fields
  ) {
    for (let index = 0; index < Number(maxRequests); index++) {
      // Insert request parameters and await response.
      var json = await generateRequest(
        token,
        start,
        finish,
        endpoint,
        maxTweets,
        query,
        fields
      );
      // Writes JSON response to file, both data and backup directory.
      fs.writeFile(
        "../data/res-" + (index + 1) + "-" + start + ".json",
        json,
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      fs.writeFile(
        "../backup-data/res-" + (index + 1) + "-" + start + ".json",
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
  function generateRequest(
    token,
    start,
    finish,
    endpoint,
    maxTweets,
    query,
    fields
  ) {
    // Setup variables.
    const url = endpoint + "?";
    const completedQuery = "(" + query + ")";
    const bearerToken = "Bearer " + token;
    var queryObject;
    var tweetFields = "";
    var userFields = "";
    var placeFields = "";
    var mediaFields = "";

    // v2 endpoint adjustment, allows users to select fields from a list and adds it to the request. If they select one field only,
    if (fields) {
      // Checks if fields selected is an array or single selection i.e. string.
      if (Array.isArray(fields)) {
        for (let i = 0; i < fields.length; i++) {
          selectFields(i);
        }
      } else if (typeof fields === "string") {
        selectFields(fields);
      }

      // Changes fields if selected.
      function selectFields(i) {
        if (fields[i] === "tweet") {
          // console.log("Tweet");
          tweetFields =
            // "attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld";
            // Removed context annotations as that was limited to 100 responses.
            "attachments,author_id,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld";
        } else if (fields[i] === "user") {
          // console.log("User");
          userFields =
            "created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld";
        } else if (fields[i] === "place") {
          // console.log("Place");
          placeFields =
            "contained_within,country,country_code,full_name,geo,id,name,place_type";
        } else if (fields[i] === "media") {
          // console.log("Media");
          mediaFields =
            "duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics";
        }
      }
    }

    // Checks if nextToken is not blank then builds query.
    if (!nextToken) {
      queryObject = {
        query: completedQuery,
        "tweet.fields": tweetFields,
        "user.fields": userFields,
        "place.fields": placeFields,
        "media.fields": mediaFields,
        // expansions:
        //   "attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id",
        max_results: maxTweets,
        start_time: start,
        end_time: finish,
      };
    } else if (nextToken) {
      queryObject = {
        query: completedQuery,
        max_results: maxTweets,
        "tweet.fields": tweetFields,
        "user.fields": userFields,
        "place.fields": placeFields,
        "media.fields": mediaFields,
        start_time: start,
        end_time: finish,
        next_token: nextToken,
      };
    }

    // Return request as a Promise (required for async/await). Submission of each request.
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
            // console.log(body.meta); Check if there are errors with next_token being undefined.
            // Returns blank, exiting for loop if no more requests to be made.
            if (body.errors) {
              console.log("There was an error with your request, check below:");
              console.log(body.errors);
            } else if (body.meta.next_token) {
              nextToken = body.meta.next_token;
            } else if (body.errors) {
              console.log(body.errors);
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
    res.redirect("/collect");
  }, 2000);
});

// Export to App.
module.exports = router;
