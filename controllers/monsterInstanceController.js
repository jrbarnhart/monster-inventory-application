const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

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
exports.monsterinstance_create_post = [
  body("nickname")
    .trim()
    .isLength({ min: 1, max: 5 })
    .escape()
    .withMessage("Nickname must be between 1 and 5 characters."),
  body("monster").escape(),
  body("gender").trim().toLowerCase().escape(),
  body("level")
    .trim()
    .isInt({ min: 1, max: 99 })
    .escape()
    .withMessage("Level must be an int between 1-99"),
  body("health", "magic", "attack", "defense", "agility", "intelligence")
    .trim()
    .isInt({ min: 0, max: 999 })
    .escape()
    .withMessage("Stats must be an int between 0-999."),
  body(
    "skill_0",
    "skill_1",
    "skill_2",
    "skill_3",
    "skill_4",
    "skill_5",
    "skill_6",
    "skill_7"
  ).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const errorsArray = errors.array();

    const selectedSkills = [
      req.body.skill_0,
      req.body.skill_1,
      req.body.skill_2,
      req.body.skill_3,
      req.body.skill_4,
      req.body.skill_5,
      req.body.skill_6,
      req.body.skill_7,
    ].filter((value) => value !== "");

    console.log(selectedSkills);

    const skillsAreUnique = selectedSkills.every((value) => {
      return (
        selectedSkills.indexOf(value) === selectedSkills.lastIndexOf(value)
      );
    });

    if (!skillsAreUnique) {
      errorsArray.push({ msg: "Skills must be unique." });
    }

    const monsterinstance = new MonsterInstance({
      monster: req.body.monster,
      nickname: req.body.nickname,
      level: req.body.level,
      health: req.body.health,
      magic: req.body.magic,
      attack: req.body.attack,
      defense: req.body.defense,
      agility: req.body.agility,
      intelligence: req.body.intelligence,
      gender: req.body.gender,
      skills: selectedSkills,
    });

    if (!errors.isEmpty() || !skillsAreUnique) {
      const [allMonsters, allSkills] = await Promise.all([
        Monster.find({}).sort({ name: 1 }).exec(),
        Skill.find({}).sort({ name: 1 }).exec(),
      ]);

      res.render("monsterinstance_create", {
        title: "Create a Monster Instance",
        monster_list: allMonsters,
        skill_list: allSkills,
        monsterinstance: monsterinstance,
        errors: errorsArray,
      });
    } else {
      const monster = await Monster.findById(req.body.monster).exec();
      const instancesUsingMonster = await MonsterInstance.find({
        monster: monster._id,
      }).exec();

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const updatedMonster = new Monster({
          ...monster,
          stock: instancesUsingMonster.length + 1,
          _id: req.body.monster,
        });

        await Monster.findByIdAndUpdate(req.body.monster, updatedMonster, {
          session,
        });
        await monsterinstance.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.redirect(monsterinstance.url);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).send("Internal server error. Transaction aborted.");
      }
    }
  }),
];

// Display delete monsterinstance form on GET
exports.monsterinstance_delete_get = asyncHandler(async (req, res, next) => {
  const monsterInstance = await MonsterInstance.findById(req.params.id).exec();

  if (monsterInstance === null) {
    const err = new Error("Monster Instance not found");
    err.status = 404;
    return next(err);
  }

  res.render("delete_record", {
    title: "Delete Monster Instance",
    record: monsterInstance,
  });
});

// Handle delete monsterinstance form on POST
exports.monsterinstance_delete_post = [
  body("password")
    .matches(process.env.DELETE_PASSWORD)
    .withMessage("Password is incorrect."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const monsterInstance = await MonsterInstance.findById(
      req.params.id
    ).exec();

    if (monsterInstance === null) {
      const err = new Error("Monster Instance not found");
      err.status = 404;
      return next(err);
    }

    if (!errors.isEmpty()) {
      res.render("delete_record", {
        title: "Delete Monster Instance",
        record: monsterInstance,
        errors: errors.array(),
      });
    } else {
      const monster = await Monster.findById(monsterInstance.monster).exec();
      const instancesUsingMonster = await MonsterInstance.find({
        monster: monster._id,
      }).exec();

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const updatedMonster = new Monster({
          ...monster,
          stock: instancesUsingMonster.length - 1,
          _id: monsterInstance.monster,
        });

        await Monster.findByIdAndUpdate(
          monsterInstance.monster,
          updatedMonster,
          {
            session,
          }
        );
        await MonsterInstance.findByIdAndDelete(req.params.id);
        await session.commitTransaction();
        session.endSession();

        res.render("delete_successful", {
          title: `${monsterInstance.nickname} Deleted`,
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        res.status(500).send("Internal server error. Transaction aborted.");
      }
    }
  }),
];

// Display update monsterinstance form on GET
exports.monsterinstance_update_get = asyncHandler(async (req, res, next) => {
  const [monsterInstance, allMonsters, allSkills] = await Promise.all([
    MonsterInstance.findById(req.params.id).exec(),
    Monster.find({}).sort({ name: 1 }).exec(),
    Skill.find({}).sort({ name: 1 }).exec(),
  ]);

  if (monsterInstance === null) {
    const err = new Error("Monster Instance not found");
    err.status = 404;
    return next(err);
  }

  res.render("monsterinstance_create", {
    title: "Update Monster Instance",
    monsterinstance: monsterInstance,
    monster_list: allMonsters,
    skill_list: allSkills,
  });
});

// Handle update monsterinstance form on POST
exports.monsterinstance_update_post = [
  body("nickname")
    .trim()
    .isLength({ min: 1, max: 5 })
    .escape()
    .withMessage("Nickname must be between 1 and 5 characters."),
  body("monster").escape(),
  body("gender").trim().toLowerCase().escape(),
  body("level")
    .trim()
    .isInt({ min: 1, max: 99 })
    .escape()
    .withMessage("Level must be an int between 1-99"),
  body("health", "magic", "attack", "defense", "agility", "intelligence")
    .trim()
    .isInt({ min: 0, max: 999 })
    .escape()
    .withMessage("Stats must be an int between 0-999."),
  body(
    "skill_0",
    "skill_1",
    "skill_2",
    "skill_3",
    "skill_4",
    "skill_5",
    "skill_6",
    "skill_7"
  ).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const errorsArray = errors.array();

    const selectedSkills = [
      req.body.skill_0,
      req.body.skill_1,
      req.body.skill_2,
      req.body.skill_3,
      req.body.skill_4,
      req.body.skill_5,
      req.body.skill_6,
      req.body.skill_7,
    ].filter((value) => value !== "");

    console.log(selectedSkills);

    const skillsAreUnique = selectedSkills.every((value) => {
      return (
        selectedSkills.indexOf(value) === selectedSkills.lastIndexOf(value)
      );
    });

    if (!skillsAreUnique) {
      errorsArray.push({ msg: "Skills must be unique." });
    }

    const monsterinstance = new MonsterInstance({
      monster: req.body.monster,
      nickname: req.body.nickname,
      level: req.body.level,
      health: req.body.health,
      magic: req.body.magic,
      attack: req.body.attack,
      defense: req.body.defense,
      agility: req.body.agility,
      intelligence: req.body.intelligence,
      gender: req.body.gender,
      skills: selectedSkills,
      _id: req.params.id,
    });

    if (!errors.isEmpty() || !skillsAreUnique) {
      const [allMonsters, allSkills] = await Promise.all([
        Monster.find({}).sort({ name: 1 }).exec(),
        Skill.find({}).sort({ name: 1 }).exec(),
      ]);

      res.render("monsterinstance_create", {
        title: "Update Monster Instance",
        monster_list: allMonsters,
        skill_list: allSkills,
        monsterinstance: monsterinstance,
        errors: errorsArray,
      });
    } else {
      const updatedMonsterInstance = await MonsterInstance.findByIdAndUpdate(
        req.params.id,
        monsterinstance,
        {}
      );
      res.redirect(updatedMonsterInstance.url);
    }
  }),
];
