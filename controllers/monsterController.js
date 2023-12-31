const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.monster_create_post = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be between 2 and 20 characters."),
  body("family").escape(),
  body("info")
    .trim()
    .isLength({ max: 200 })
    .escape()
    .withMessage("Info must be 200 characters for less."),
  body("skill-1", "skill-2", "skill-3").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const errorsArray = errors.array();

    const selectedSkills = [
      req.body.skill_0,
      req.body.skill_1,
      req.body.skill_2,
    ];
    const skillsAreUnique = selectedSkills.every((value) => {
      return (
        selectedSkills.indexOf(value) === selectedSkills.lastIndexOf(value)
      );
    });

    if (!skillsAreUnique) {
      errorsArray.push({ msg: "Skills must be unique." });
    }

    const monster = new Monster({
      name: req.body.name,
      family: req.body.family,
      info: req.body.info,
      innate_skills: selectedSkills,
      stock: 0,
    });

    if (!errors.isEmpty() || !skillsAreUnique) {
      const [allFamilies, allSkills] = await Promise.all([
        Family.find({}).sort({ name: 1 }).exec(),
        Skill.find({}).sort({ name: 1 }).exec(),
      ]);

      res.render("monster_create", {
        title: "Create a Monster",
        family_list: allFamilies,
        skill_list: allSkills,
        monster: monster,
        errors: errorsArray,
      });
    } else {
      await monster.save();
      res.redirect(monster.url);
    }
  }),
];

// Display delete monster form on GET
exports.monster_delete_get = asyncHandler(async (req, res, next) => {
  const monster = await Monster.findById(req.params.id).exec();

  if (monster === null) {
    const err = new Error("Monster not found");
    err.status = 404;
    return next(err);
  }

  res.render("delete_record", {
    title: "Delete Monster",
    record: monster,
  });
});

// Handle delete monster form on POST
exports.monster_delete_post = [
  body("password")
    .matches(process.env.DELETE_PASSWORD)
    .withMessage("Password is incorrect."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const errorsArray = errors.array();

    const monster = await Monster.findById(req.params.id);
    const instancesUsingMonster = await MonsterInstance.find({
      monster: monster._id,
    }).exec();

    if (instancesUsingMonster.length > 0) {
      errorsArray.push({
        msg: "Monster in use by monster instances. Delete these instances first.",
      });

      instancesUsingMonster.forEach((instance) => {
        errorsArray.push({
          msg: `- ${instance.nickname}`,
        });
      });
    }

    if (monster === null) {
      const err = new Error("Monster not found");
      err.status = 404;
      return next(err);
    }

    if (errorsArray.length > 0) {
      res.render("delete_record", {
        title: "Delete Monster",
        record: monster,
        errors: errorsArray,
      });
    } else {
      await Monster.findByIdAndDelete(req.params.id);
      res.render("delete_successful", {
        title: `${monster.name} Deleted`,
      });
    }
  }),
];

// Display update monster form on GET
exports.monster_update_get = asyncHandler(async (req, res, next) => {
  const [monster, allFamilies, allSkills] = await Promise.all([
    Monster.findById(req.params.id).populate("family").exec(),
    Family.find({}).sort({ name: 1 }).exec(),
    Skill.find({}).sort({ name: 1 }).exec(),
  ]);

  if (monster === null) {
    const err = new Error("Monster not found");
    err.status = 404;
    return next(err);
  }

  res.render("monster_create", {
    title: "Update Monster",
    monster: monster,
    family_list: allFamilies,
    skill_list: allSkills,
  });
});

// Handle update monster form on POST
exports.monster_update_post = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be between 2 and 20 characters."),
  body("family").escape(),
  body("info")
    .trim()
    .isLength({ max: 200 })
    .escape()
    .withMessage("Info must be 200 characters for less."),
  body("skill-1", "skill-2", "skill-3").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const errorsArray = errors.array();

    const selectedSkills = [
      req.body.skill_0,
      req.body.skill_1,
      req.body.skill_2,
    ];
    const skillsAreUnique = selectedSkills.every((value) => {
      return (
        selectedSkills.indexOf(value) === selectedSkills.lastIndexOf(value)
      );
    });

    if (!skillsAreUnique) {
      errorsArray.push({ msg: "Skills must be unique." });
    }

    const monster = new Monster({
      name: req.body.name,
      family: req.body.family,
      info: req.body.info,
      innate_skills: selectedSkills,
      _id: req.params.id,
    });

    if (!errors.isEmpty() || !skillsAreUnique) {
      const [allFamilies, allSkills] = await Promise.all([
        Family.find({}).sort({ name: 1 }).exec(),
        Skill.find({}).sort({ name: 1 }).exec(),
      ]);

      res.render("monster_create", {
        title: "Update Monster",
        family_list: allFamilies,
        skill_list: allSkills,
        monster: monster,
        errors: errorsArray,
      });
    } else {
      const updatedMonster = await Monster.findByIdAndUpdate(
        req.params.id,
        monster,
        {}
      );
      res.redirect(updatedMonster.url);
    }
  }),
];
