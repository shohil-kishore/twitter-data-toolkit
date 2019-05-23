// Import packages.
const express = require("express");
const router = express.Router();
const fs = require("fs");
const request = require("request");

// Merge route.
router.get("/merge", (req, res) => {
  res.render("merge", {});
});

// Find all the files in a specific directory

// Open each file

// Loop through file, add each JS object to a new file

// Delete/move files from directoy

// Output location of complete file

// Export to App.
module.exports = router;
