const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.send("NYI: GET delete skill form");
});

// Handle delete skill form
exports.skill_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NYI: Post delete skill form");
});

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
