const express = require("express");
const router = express.Router();

const { Category } = require("../models/category");
const { Item, validate } = require("../models/item");

router.get("/", async (req, res) => {
  const items = await Item.find().sort({ name: 1 });
  res.send(items);
});

router.get("/:id", async (req, res) => {
  //Check if item with given ID exists
  const item = await Item.findById(req.params.id);
  if (!item)
    return res
      .status(404) //Not found status
      .send("Error, the item with given ID is not found.");

  res.send(item);
});

router.post("/", async (req, res) => {
  //Validate input from POST request
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400) //Bad Request status
      .send(error.details[0].message);

  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return res
      .status(400) //Bad Request status
      .send("Invalid Category.");

  //Create new item
  let item = new Item({
    name: req.body.name,
    //For selective properties from category
    category: {
      _id: category._id,
      name: category.name,
    },
    description: req.body.description,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  item = await item.save();

  res.send(item);
});

router.put("/:id", async (req, res) => {
  //Validate given input
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400) //Bad Request status
      .send(error.details[0].message);

  //Check if item with given ID exists
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!item)
    return res
      .status(404) //Not found status
      .send("Error, the item with given ID is not found.");

  //Send updated item
  res.send(item);
});

router.delete("/:id", async (req, res) => {
  //Find and delete given item
  const item = await Item.findByIdAndRemove(req.params.id);
  if (!item)
    return res
      .status(404) //Not found status
      .send("Error, the item with given ID is not found.");

  res.send(item);
});

module.exports = router;
