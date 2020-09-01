const Joi = require("joi");
const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  description: { type: String, trim: true },
  numberInStock: { type: Number, default: 0, min: 0, max: 255 },
  dailyRentalRate: { type: Number, min: 0, max: 500, required: true },
});

const Item = mongoose.model("Item", itemSchema);

function validateSchema(item) {
  const schema = Joi.object({
    categoryId: Joi.string().required(),
    dailyRentalRate: Joi.number().min(0).max(500).required(),
    description: Joi.string(),
    name: Joi.string().trim().minlength(3).maxlength(255).required(),
    numberInStock: Joi.number().min(0).max(255),
  });
  return schema.validate(item);
}

module.exports.Item = Item;
module.exports.validate = validateSchema;
