// Import packages.
const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

// Homepage route.
router.get("/", (req, res) => {
  // Remove Git files.
  fs.unlink("../data/.gitkeep", (err) => {});
  fs.unlink("../backup-data/.gitkeep", (err) => {});
  // Redirect to Generate page.
  res.redirect("generate");
});

// Merge GET route.
router.get("/merge", (req, res) => {
  res.render("merge");
});

// Merge POST route.
router.post("/merge", (req, res) => {
  mergeFiles();

  // Merge files in the correct format.
  function mergeFiles() {
    // Generate array of paths to JSON files to use for processing.
    var dir = "../data/";

    // File arrays.
    var data = [];
    var users = [];
    var extTweets = [];
    var places = [];

    // Creating new arrays for each twitter object (data, users, extended tweets and places).
    fs.readdirSync(dir).forEach((file) => {
      let raw = fs.readFileSync(dir + file);
      let json = JSON.parse(raw);

      if (json.data) {
        data.push(dir + file);
      }
      if (json.includes.users) {
        users.push(dir + file);
      }
      if (json.includes.tweets) {
        extTweets.push(dir + file);
      }
      if (json.includes.places) {
        places.push(dir + file);
      }
    });

    // For main data object.
    // Create new write stream, parse relevant data files, add opening/closing brackets, end write stream.
    var writer = fs.createWriteStream("tweets.json", { flags: "a" });
    writer.write("[");

    for (let i = 0; i < data.length; i++) {
      let raw = fs.readFileSync(data[i]);
      let json = JSON.parse(raw);
      // Skips files beginning with JSON.error.
      if (json.data) {
        // Remove characters that invalidate JSON format.
        let processedData = JSON.stringify(json.data).substr(1).slice(0, -1);
        // Adds comma or bracket between JSON files to maintain format.
        if (i === data.length - 1) {
          processedData = processedData + "]";
        } else {
          processedData = processedData + ",";
        }
        // Append to an existing file. File should be cleared at some stage.
        writer.write(processedData);
      }
    }
    writer.end();

    // For users object.
    // Create new write stream, parse relevant data files, add opening/closing brackets, end write stream.
    writer = fs.createWriteStream("users.json", { flags: "a" });
    writer.write("[");

    for (let i = 0; i < users.length; i++) {
      let raw = fs.readFileSync(users[i]);
      let json = JSON.parse(raw);
      // Skips files beginning with JSON.error.
      if (json.includes.users) {
        // Remove characters that invalidate JSON format.
        let processedData = JSON.stringify(json.includes.users)
          .substr(1)
          .slice(0, -1);
        // Add characters that validate JSON format.
        if (i === users.length - 1) {
          processedData = processedData + "]";
        } else {
          processedData = processedData + ",";
        }
        // Append to an existing file. File should be cleared at some stage.
        writer.write(processedData);
      }
    }
    writer.end();

    // For extended tweets object.
    // Create new write stream, parse relevant data files, add opening/closing brackets, end write stream.
    writer = fs.createWriteStream("ext-tweets.json", { flags: "a" });
    writer.write("[");

    for (let i = 0; i < extTweets.length; i++) {
      let raw = fs.readFileSync(extTweets[i]);
      let json = JSON.parse(raw);
      // Skips files beginning with JSON.error.
      if (json.includes.tweets) {
        // Remove characters that invalidate JSON format.
        let processedData = JSON.stringify(json.includes.tweets)
          .substr(1)
          .slice(0, -1);
        // Add characters that validate JSON format.
        if (i === extTweets.length - 1) {
          processedData = processedData + "]";
        } else {
          processedData = processedData + ",";
        }
        // Append to an existing file. File should be cleared at some stage.
        writer.write(processedData);
      }
    }
    writer.end();

    // For places object.
    // Create new write stream, parse relevant data files, add opening/closing brackets, end write stream.
    writer = fs.createWriteStream("places.json", { flags: "a" });
    writer.write("[");

    for (let i = 0; i < places.length; i++) {
      let raw = fs.readFileSync(places[i]);
      let json = JSON.parse(raw);
      // Skips files beginning with JSON.error.
      if (json.includes.places) {
        // Remove characters that invalidate JSON format.
        let processedData = JSON.stringify(json.includes.places)
          .substr(1)
          .slice(0, -1);
        // Add characters that validate JSON format.
        if (i === places.length - 1) {
          processedData = processedData + "]";
        } else {
          processedData = processedData + ",";
        }
        // Append to an existing file. File should be cleared at some stage.
        writer.write(processedData);
      }
    }
    writer.end();

    console.log(
      "Data merged successfully. Safely store JSON files before clearing data."
    );
    res.render("merge");
  }
});

router.delete("/merge", (req, res) => {
  // Clears results.json file and empties data directory.
  fs.writeFile("result.json", "", () => {
    fs.emptyDir("../data/");
    console.log(
      "Merged data file cleared and data directory emptied successfully. Data is still available in the 'backup-data' directory."
    );
  });
  res.redirect("/merge");
});

// Export to App.
module.exports = router;
