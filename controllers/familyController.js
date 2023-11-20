const Family = require("../models/family");

const asyncHandler = require("express-async-handler");

// List all families
exports.family_list = asyncHandler(async (req, res, next) => {
  res.send("NYI: List families GET");
});

// Display details for specific family
exports.family_detail = asyncHandler(async (req, res, next) => {
  res.send(`NYI: Family details for: ${req.params.id}`);
});

// Display create family form on GET
exports.family_create_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: Create family GET");
});

// Handle create family form on POST
exports.family_create_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Create family POST");
});

// Display delete family form on GET
exports.family_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: Delete family GET");
});

// Handle delete family form on POST
exports.family_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Delete family POST");
});

// Display update family form on GET
exports.family_update_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: Update family GET");
});

// Handle update family form on POST
exports.family_update_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Update family POST");
});
