// Import packages.
const express = require("express");
const router = express.Router();
const fs = require("fs-extra");

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
    fs.readdirSync(dir).forEach(file => {
      files.push(dir + file);
    });

    // Process each file indivdually. Read, parse into JSON, remove irrelevant characters and append to a file in the correct format.
    for (let i = 0; i < files.length; i++) {
      let raw = fs.readFileSync(files[i]);
      let json = JSON.parse(raw);
      // Remove characters that invalidate JSON format.
      let processedData = JSON.stringify(json.results)
        .substr(1)
        .slice(0, -1);
      // Add characters that validate JSON format.
      if (i === 0) {
        processedData = "[" + processedData + ",";
      } else if (i === files.length - 1) {
        processedData = processedData + "]";
      } else {
        processedData = processedData + ",";
      }
      // Append to an existing file. File should be cleared at some stage.
      fs.appendFile("result.json", processedData, err => {
        if (err) throw err;
      });
    }
    console.log("Complete data file generated successfully.");
    res.render("merge");
  }
});

// Output location of complete file.

// Export to App.
module.exports = router;
