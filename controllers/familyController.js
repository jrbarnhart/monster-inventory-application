const asyncHandler = require("express-async-handler");

const Family = require("../models/family");

// List all families
exports.family_list = asyncHandler(async (req, res, next) => {
  const allFamilies = await Family.find({}).sort({ name: 1 }).exec();

  res.render("family_list", {
    title: "Family List",
    family_list: allFamilies,
  });
});

// Display details for specific family
exports.family_detail = asyncHandler(async (req, res, next) => {
  const family = await Family.findById(req.params.id).exec();

  res.render("family_detail", {
    title: "Family Details",
    family: family,
  });
});

// Display create family form on GET
exports.family_create_get = asyncHandler(async (req, res, next) => {
  res.render("family_create", {
    title: "Create a Family",
  });
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
