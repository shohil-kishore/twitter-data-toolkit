// Import packages.
const express = require("express");
const router = express.Router();
const concat = require("json-concat");
const fs = require('fs-extra')

// Merge GET route.
router.get("/merge", (req, res) => {
  res.render("merge");
});

// Merge POST route.
router.post("/merge", (req, res) => {
  
  // Loop through file, add each JS object to a new file.
  concat(
    {
      src: "../data",
      dest: "../result.json"
    },
    () => {
      console.log("JSON files combined successfully.");
      // Empty data directory.
      fs.emptyDir("../data", err => {
        if (err) return console.error(err);
        console.log("Data directory emptied successfully (data still exists in backup-data folder).");
      });
      res.render("merge");
    }
  );
});

// Output location of complete file.

// Export to App.
module.exports = router;
