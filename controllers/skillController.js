const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Skill = require("../models/skill");
const Monster = require("../models/monster");
const MonsterInstance = require("../models/monsterinstance");

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
exports.skill_create_post = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be between 2 and 20 characters."),
  body("info")
    .trim()
    .isLength({ max: 200 })
    .escape()
    .withMessage("Info must be 200 characters or less."),
  body("magic_cost")
    .trim()
    .isInt({ min: 0, max: 99 })
    .escape()
    .withMessage("Magic Cost must be an int between 0-99."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const skill = new Skill({
      name: req.body.name,
      info: req.body.info,
      magic_cost: req.body.magic_cost,
    });

    if (!errors.isEmpty()) {
      res.render("skill_create", {
        title: "Create a Skill",
        skill: skill,
        errors: errors.array(),
      });
    } else {
      await skill.save();
      res.redirect(skill.url);
    }
  }),
];

// Display delete skill form
exports.skill_delete_get = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id).exec();

  if (skill === null) {
    const err = new Error("Skill not found");
    err.status = 404;
    return next(err);
  }

  res.render("delete_record", {
    title: "Delete Skill",
    record: skill,
  });
});

// Handle delete skill form
exports.skill_delete_post = [
  body("password")
    .matches(process.env.DELETE_PASSWORD)
    .withMessage("Password is incorrect."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const errorsArray = errors.array();

    const skill = await Skill.findById(req.params.id).exec();
    const [monstersUsingSkill, monsterInstancesUsingSkill] = await Promise.all([
      Monster.find({ innate_skills: skill._id }).exec(),
      MonsterInstance.find({ skills: skill._id }).exec(),
    ]);

    if (monstersUsingSkill.length > 0) {
      errorsArray.push({
        msg: "Family in use by monsters. Delete these monsters first.",
      });

      monstersUsingSkill.forEach((monster) => {
        errorsArray.push({
          msg: `- ${monster.name}`,
        });
      });
    }

    if (monsterInstancesUsingSkill.length > 0) {
      errorsArray.push({
        msg: "Family in use by monster instances. Delete these instances first.",
      });

      monsterInstancesUsingSkill.forEach((instance) => {
        errorsArray.push({
          msg: `- ${instance.nickname}`,
        });
      });
    }

    if (skill === null) {
      const err = new Error("Skill not found");
      err.status = 404;
      return next(err);
    }

    if (errorsArray.length > 0) {
      res.render("delete_record", {
        title: "Delete Skill",
        record: skill,
        errors: errorsArray,
      });
    } else {
      await Skill.findByIdAndDelete(req.params.id, {});
      res.render("delete_successful", {
        title: `${skill.name} Deleted`,
      });
    }
  }),
];

// Display update skill form
exports.skill_update_get = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id).exec();

  if (skill === null) {
    const err = new Error("Skill not found");
    err.status = 404;
    return next(err);
  }

  res.render("skill_create", {
    title: "Update Skill",
    skill: skill,
  });
});

// Handle update skill form
exports.skill_update_post = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be between 2 and 20 characters."),
  body("info")
    .trim()
    .isLength({ max: 200 })
    .escape()
    .withMessage("Info must be 200 characters or less."),
  body("magic_cost")
    .trim()
    .isInt({ min: 0, max: 99 })
    .escape()
    .withMessage("Magic Cost must be an int between 0-99."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const skill = new Skill({
      name: req.body.name,
      info: req.body.info,
      magic_cost: req.body.magic_cost,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("skill_create", {
        title: "Update Skill",
        skill: skill,
        errors: errors.array(),
      });
    } else {
      const updatedSkill = await Skill.findByIdAndUpdate(
        req.params.id,
        skill,
        {}
      );
      res.redirect(updatedSkill.url);
    }
  }),
];
