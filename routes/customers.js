const express = require("express");
const router = express.Router();

const { Customer, validate } = require("../models/customer");

router.get("/", async (req, res) => {
  const categories = await Customer.find().sort({ name: 1 });
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  //Check if customer with given ID exists
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res
      .status(404) //Not found status
      .send("Error, the user with given ID is not found.");

  res.send(customer);
});

router.post("/", async (req, res) => {
  //Validate input from POST request
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400) //Bad Request status
      .send(error.details[0].message);

  //Create new customer
  let customer = new Customer({
    email: req.body.email,
    isPremiumMember: req.body.isPremiumMember,
    name: req.body.name,
    phone: req.body.phone,
  });
  customer = await customer.save();

  res.send(customer);
});

router.put("/:id", async (req, res) => {
  //Validate given input
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400) //Bad Request status
      .send(error.details[0].message);

  //Check if customer with given ID exists
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      email: req.body.email,
      isPremiumMember: req.body.isPremiumMember,
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!customer)
    return res
      .status(404) //Not found status
      .send("Error, the user with given ID is not found.");

  //Send updated customer
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  //Find and delete given customer
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res
      .status(404) //Not found status
      .send("Error, the user with given ID is not found.");

  res.send(customer);
});

module.exports = router;
