const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Gear Rental",
    message: "Welcome to outdoor pursuits gear rental",
  });
});

module.exports = router;
