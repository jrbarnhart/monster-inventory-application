const asyncHandler = require("express-async-handler");

const MonsterInstance = require("../models/monsterinstance");
const Monster = require("../models/monster");
const Skill = require("../models/skill");

// List all MonsterInstances
exports.monsterinstance_list = asyncHandler(async (req, res, next) => {
  const allMonsterInstances = await MonsterInstance.find({})
    .populate("monster")
    .populate("skills")
    .sort({ nickname: 1 })
    .exec();

  res.render("monsterinstance_list", {
    title: "Monster Instance List",
    monsterinstance_list: allMonsterInstances,
  });
});

// Display details for specific monsterinstance
exports.monsterinstance_detail = asyncHandler(async (req, res, next) => {
  const monsterInstance = await MonsterInstance.findById(req.params.id)
    .populate("monster")
    .populate("skills")
    .exec();

  res.render("monsterinstance_detail", {
    title: "Monster Instance Details",
    monsterinstance: monsterInstance,
  });
});

// Display create monsterinstance form on GET
exports.monsterinstance_create_get = asyncHandler(async (req, res, next) => {
  const [allMonsters, allSkills] = await Promise.all([
    Monster.find({}).sort({ name: 1 }).exec(),
    Skill.find({}).sort({ name: 1 }).exec(),
  ]);

  res.render("monsterinstance_create", {
    title: "Create a Monster Instance",
    monster_list: allMonsters,
    skill_list: allSkills,
  });
});

// Handle create monsterinstance form on POST
exports.monsterinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Create monsterinstance POST");
});

// Display delete monsterinstance form on GET
exports.monsterinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: Delete monsterinstance GET");
});

// Handle delete monsterinstance form on POST
exports.monsterinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Delete monsterinstance POST");
});

// Display update monsterinstance form on GET
exports.monsterinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NYI: update monsterinstance GET");
});

// Handle update monsterinstance form on POST
exports.monsterinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: update monsterinstance POST");
});
