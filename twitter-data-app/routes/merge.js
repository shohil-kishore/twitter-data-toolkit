// Import packages.
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
  fs.unlink("../data/.DS_Store", (err) => {});
  fs.unlink("../backup-data/.DS_Store", (err) => {});
  // Redirect to Generate page.
  res.redirect("generate");
});

// Merge GET route.
router.get("/merge", (req, res) => {
  res.render("merge");
});

// Merge POST route.
router.post("/merge", (req, res) => {
  mergeAndDeleteFiles();

  // Merge files in the correct format.
  function mergeAndDeleteFiles() {
    // Generate array of paths to JSON files to use for processing.
    var files = [];
    var dir = "../data/";
    var deletedFiles = 0;
    fs.readdirSync(dir).forEach((file) => {
      files.push(dir + file);
    });
    // console.log(files);
    // console.log(files.length);

    // Process each file indivdually. Read, parse into JSON, and iteratively removes all files with errors. Needed to create a new file length.
    for (let i = 0; i < files.length; i++) {
      let raw = fs.readFileSync(files[i]);
      let json = JSON.parse(raw);
      if (json.errors) {
        deletedFiles++;
        fs.unlink(files[i], function (err) {
          if (err) {
            throw err;
          }
        });
      }
    }
    console.log("Deleted a total of " + deletedFiles + " files.");

    // Generate array of cleaned paths to JSON files to use for processing.
    var newFiles = [];
    fs.readdirSync(dir).forEach((file) => {
      newFiles.push(dir + file);
    });

    // Process each file indivdually. Read, parse into JSON, remove irrelevant characters and append to a file in the correct format.
    for (let i = 0; i < newFiles.length; i++) {
      let raw = fs.readFileSync(newFiles[i]);
      let json = JSON.parse(raw);
      // Skips files beginning with JSON.error.
      if (json.data) {
        // Remove characters that invalidate JSON format.
        let processedData = JSON.stringify(json.data).substr(1).slice(0, -1);
        // Add characters that validate JSON format.
        if (i === 0) {
          processedData = "[" + processedData + ",";
          // } else if (i === newFiles.length - 1) {
          //   processedData = processedData + "]";
        } else {
          processedData = processedData + ",";
        }
        // Append to an existing file. File should be cleared at some stage.
        let writer = fs.createWriteStream("result.json", { flags: "a" });
        writer.write(processedData);
        i++;
      }
    }
    console.log(
      "Data merged successfully. Safely store 'result.json' before clearing data."
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
