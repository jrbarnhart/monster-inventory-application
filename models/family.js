const mongoose = require("mongoose");

const FamilySchema = new mongoose.Schema({
  name: { type: String, minLength: 2, maxLength: 20, required: true },
  info: { type: String, maxLength: 200, required: true },
});

FamilySchema.virtual("url").get(function () {
  return `/inventory/family/${this._id}`;
});

module.exports = mongoose.model("Family", FamilySchema);
