const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, unique: true },
  isPremiumMember: { type: Boolean, default: false },
  name: { type: String, required: true, trim: true, maxlength: 50 },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateSchema(customer) {
  const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    isPremiumMember: Joi.boolean(),
    name: Joi.string().trim().min(3).required(),
    phone: Joi.number().required(),
  });
  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateSchema;
