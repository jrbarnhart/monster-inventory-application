const mongoose = require("mongoose");
const isIntValidator = require("./custom_validators/isIntValidator");

const SkillSchema = new mongoose.Schema({
  name: { type: String, minLength: 2, maxLength: 20, required: true },
  info: { type: String, maxLength: 200, required: true },
  magic_cost: {
    type: Number,
    min: 0,
    max: 99,
    required: true,
    validate: isIntValidator,
  },
});

module.exports = mongoose.model("Skill", SkillSchema);
