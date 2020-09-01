const express = require("express");
const router = express.Router();

const { Category, validate } = require("../models/category");

router.get("/", async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  //Check if category with given ID exists
  const category = await Category.findById(req.params.id);
  if (!category)
    return res
      .status(404) //Not found status
      .send("Error, the category with given ID is not found.");

  res.send(category);
});

router.post("/", async (req, res) => {
  //Validate input from POST request
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400) //Bad Request status
      .send(error.details[0].message);

  //Create new category
  let category = new Category({
    name: req.body.name,
  });
  category = await category.save();

  res.send(category);
});

router.put("/:id", async (req, res) => {
  //Validate given input
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400) //Bad Request status
      .send(error.details[0].message);

  //Check if category with given ID exists
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!category)
    return res
      .status(404) //Not found status
      .send("Error, the category with given ID is not found.");

  //Send updated category
  res.send(category);
});

router.delete("/:id", async (req, res) => {
  //Find and delete given category
  const category = await Category.findByIdAndRemove(req.params.id);
  if (!category)
    return res
      .status(404) //Not found status
      .send("Error, the category with given ID is not found.");

  res.send(category);
});

module.exports = router;
