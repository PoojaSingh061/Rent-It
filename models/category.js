const Joi = require("joi");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 50 },
});

const Category = mongoose.model("Category", categorySchema);

function validateSchema(category) {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
  });
  return schema.validate(category);
}

module.exports.categorySchema = categorySchema;
module.exports.Category = Category;
module.exports.validate = validateSchema;
