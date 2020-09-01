const express = require("express");
const router = express.Router();

const { Rental, validate } = require("../models/rental");
const { Item } = require("../models/item");
const { Customer } = require("../models/customer");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort({ dateOut: -1 });
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const item = await Item.findById(req.body.itemId);
  if (!item) return res.status(400).send("Invalid item.");

  if (item.numberInStock === 0)
    return res.status(400).send("Item not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    item: {
      _id: item._id,
      title: item.title,
      dailyRentalRate: item.dailyRentalRate,
    },
  });
  rental = await rental.save();

  item.numberInStock--;
  item.save();

  res.send(rental);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res
      .status(404)
      .send("Error, the rental with given ID is not found.");

  res.send(rental);
});

module.exports = router;
