const mongoose = require("mongoose");

const isIntValidator = require("./custom_validators/isIntValidator");
const arrayValidator = require("./custom_validators/arrayValidator");

const MonsterSchema = new mongoose.Schema({
  name: { type: String, minLength: 2, maxLength: 20, required: true },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true,
  },
  info: { type: String, maxLength: 200, required: true },
  innate_skills: {
    type: [mongoose.Schema.Types.ObjectId],
    validate: arrayValidator.lengthEquals(3),
    required: true,
  },
  stock: { type: Number, min: 0, required: true, validate: isIntValidator },
});

MonsterSchema.virtual("url").get(function () {
  return `/inventory/monster/${this._id}`;
});

module.exports = mongoose.model("Monster", MonsterSchema);
