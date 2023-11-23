const asyncHandler = require("express-async-handler");

const Monster = require("../models/monster");
const Family = require("../models/family");
const Skill = require("../models/skill");
const MonsterInstance = require("../models/monsterinstance");

// Inventory home page
exports.monster_metrics = asyncHandler(async (req, res, next) => {
  const [familyCount, monsterCount, skillCount, monsterInstanceCount] =
    await Promise.all([
      Family.countDocuments({}).exec(),
      Monster.countDocuments({}).exec(),
      Skill.countDocuments({}).exec(),
      MonsterInstance.countDocuments({}).exec(),
    ]);

  res.render("monster_metrics", {
    title: "Monster Inventory",
    family_count: familyCount,
    monster_count: monsterCount,
    skill_count: skillCount,
    monster_instance_count: monsterInstanceCount,
  });
});

// List all monsters
exports.monster_list = asyncHandler(async (req, res, next) => {
  const allMonsters = await Monster.find({}).populate("family").exec();

  res.render("monster_list", {
    title: "Monster List",
    monster_list: allMonsters,
  });
});

// Display details for specific monster
exports.monster_detail = asyncHandler(async (req, res, next) => {
  const monster = await Monster.findById(req.params.id)
    .populate("family")
    .populate("innate_skills")
    .exec();

  res.render("monster_detail", {
    title: "Monster Details",
    monster: monster,
  });
});

// Display create monster form on GET
exports.monster_create_get = asyncHandler(async (req, res, next) => {
  const [allFamilies, allSkills] = await Promise.all([
    Family.find({}).sort({ name: 1 }).exec(),
    Skill.find({}).sort({ name: 1 }).exec(),
  ]);

  res.render("monster_create", {
    title: "Create a Monster",
    family_list: allFamilies,
    skill_list: allSkills,
  });
});

// Handle create monster form on POST
exports.monster_create_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Create monster POST");
});

// Display delete monster form on GET
exports.monster_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: Delete monster GET");
});

// Handle delete monster form on POST
exports.monster_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Delete monster POST");
});

// Display update monster form on GET
exports.monster_update_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: update monster GET");
});

// Handle update monster form on POST
exports.monster_update_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: update monster POST");
});
