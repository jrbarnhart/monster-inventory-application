const express = require("express");
const router = express.Router();

const family_controller = require("../controllers/familyController");
const monster_controller = require("../controllers/monsterController");
const skill_controller = require("../controllers/skillController");

// GET inventory index (currently using monster metrics)
router.get("/", monster_controller.monster_metrics);

/// Monster Routes ///

// GET create monster form
router.get("/monster/create", monster_controller.monster_create_get);

// POST create monster form
router.post("/monster/create", monster_controller.monster_create_post);

// GET delete monster form
router.get("/monster/:id/delete", monster_controller.monster_delete_get);

// POST delete monster form
router.post("/monster/:id/delete", monster_controller.monster_delete_post);

// GET update monster form
router.get("/monster/:id/update", monster_controller.monster_update_get);

// POST update monster form
router.post("/monster/:id/update", monster_controller.monster_update_post);

// GET monster details
router.get("/monster/:id", monster_controller.monster_detail);

// GET monster list
router.get("/monsters", monster_controller.monster_list);

/// Family Routes ///

// GET create family form
router.get("/family/create", family_controller.family_create_get);

// POST create family form
router.post("/family/create", family_controller.family_create_post);

// GET delete family form
router.get("/family/:id/delete", family_controller.family_delete_get);

// POST delete family form
router.post("/family/:id/delete", family_controller.family_delete_post);

// GET update family form
router.get("/family/:id/update", family_controller.family_update_get);

// POST update family form
router.post("/family/:id/update", family_controller.family_update_post);

// GET family details
router.get("/family/:id", family_controller.family_detail);

// GET family list
router.get("/families", family_controller.family_list);

/// Skill Routes ///

// GET create skill form
router.get("/skill/create", skill_controller.skill_create_get);

// POST create skill form
router.post("/skill/create", skill_controller.skill_create_post);

// GET delete skill form
router.get("/skill/:id/delete", skill_controller.skill_delete_get);

// POST delete skill form
router.post("/skill/:id/delete", skill_controller.skill_delete_post);

// GET update skill form
router.get("/skill/:id/update", skill_controller.skill_update_get);

// POST update skill form
router.post("/skill/:id/update", skill_controller.skill_update_post);

// GET skill details
router.get("/skill/:id", skill_controller.skill_detail);

// GET skill list
router.get("/skills", skill_controller.skill_list);

module.exports = router;
