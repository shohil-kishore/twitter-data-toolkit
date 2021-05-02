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

  // Call data collection function.
  collectAndSaveData(
    token,
    start,
    finish,
    endpoint,
    maxTweets,
    query,
    maxRequests
  );

  // Async function awaits for each response from the Twitter API. Makes multiple requests based on a user-defined limit (maxRequests). Generates a JSON file containing each response.
  async function collectAndSaveData(
    token,
    start,
    finish,
    endpoint,
    maxTweets,
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
        maxTweets,
        query
      );
      // Writes JSON response to file, both data and backup directory.
      fs.writeFile(
        "../data/response-" + (index + 1) + "-" + start + ".json",
        json,
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      fs.writeFile(
        "../backup-data/response-" + (index + 1) + "-" + start + ".json",
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
          "Data collection complete. Data did not exceed request limitations."
        );
        return;
      }
    }
    console.log(
      "Data collection complete, however, data exceeded request limitations."
    );
  }

  // Compiles and sends the request as a Promise.
  function generateRequest(token, start, finish, endpoint, maxTweets, query) {
    // Setup variables.
    const url = endpoint + "?";
    const completedQuery = "(" + query + ")";
    const bearerToken = "Bearer " + token;
    var queryObject;

    // Checks if nextToken is not blank.
    if (!nextToken) {
      queryObject = {
        query: completedQuery,
        "tweet.fields":
          "attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld",
        "user.fields":
          "created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld",
        "place.fields":
          "contained_within,country,country_code,full_name,geo,id,name,place_type",
        "media.fields":
          "duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics",
        expansions:
          "attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id",
        max_results: maxTweets,
        start_time: start,
        end_time: finish,
      };
    } else if (nextToken) {
      queryObject = {
        query: completedQuery,
        max_results: maxTweets,
        "tweet.fields":
          "attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld",
        "user.fields":
          "created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld",
        "place.fields":
          "contained_within,country,country_code,full_name,geo,id,name,place_type",
        "media.fields":
          "duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics",
        expansions:
          "attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id",
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
            if (body.meta.next_token) {
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
    res.redirect("/collect");
  }, 2000);
});

// Export to App.
module.exports = router;
