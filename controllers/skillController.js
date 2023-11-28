const asyncHandler = require("express-async-handler");

const Skill = require("../models/skill");

// List all skills
exports.skill_list = asyncHandler(async (req, res, next) => {
  const allSkills = await Skill.find({}).sort({ name: 1 }).exec();

  res.render("skill_list", {
    title: "Skill List",
    skill_list: allSkills,
  });
});

// Get skill details
exports.skill_detail = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id).exec();

  res.render("skill_detail", {
    title: "Skill Details",
    skill: skill,
  });
});

// Display create skill form
exports.skill_create_get = asyncHandler(async (req, res, next) => {
  res.render("skill_create", {
    title: "Create a Skill",
  });
});

// Handle create skill form
exports.skill_create_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: POST create skill form");
});

// Display delete skill form
exports.skill_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: GET delete skill form");
});

// Handle delete skill form
exports.skill_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Post delete skill form");
});

// Display update skill form
exports.skill_update_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: GET update skill form");
});

// Handle update skill form
exports.skill_update_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: POST update skill form");
});
