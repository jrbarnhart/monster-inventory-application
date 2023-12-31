const mongoose = require("mongoose");

const isIntValidator = require("./custom_validators/isIntValidator");
const arrayValidator = require("./custom_validators/arrayValidator");

const MonsterInstanceSchema = new mongoose.Schema({
  monster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Monster",
    required: true,
  },
  nickname: { type: String, minLength: 1, maxLength: 5, required: true },
  level: {
    type: Number,
    min: 1,
    max: 99,
    validate: isIntValidator,
    required: true,
  },
  health: {
    type: Number,
    min: 1,
    max: 999,
    validate: isIntValidator,
    required: true,
  },
  magic: {
    type: Number,
    min: 1,
    max: 999,
    validate: isIntValidator,
    required: true,
  },
  attack: {
    type: Number,
    min: 1,
    max: 999,
    validate: isIntValidator,
    required: true,
  },
  defense: {
    type: Number,
    min: 1,
    max: 999,
    validate: isIntValidator,
    required: true,
  },
  agility: {
    type: Number,
    min: 1,
    max: 999,
    validate: isIntValidator,
    required: true,
  },
  intelligence: {
    type: Number,
    min: 1,
    max: 999,
    validate: isIntValidator,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "none"],
    default: "none",
  },
  skills: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Skill",
    required: true,
    validate: arrayValidator.lengthWithin(0, 8),
  },
});

MonsterInstanceSchema.virtual("url").get(function () {
  return `/inventory/monsterinstance/${this._id}`;
});

module.exports = mongoose.model("MonsterInstance", MonsterInstanceSchema);
