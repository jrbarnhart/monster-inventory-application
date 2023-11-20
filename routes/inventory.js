const express = require("express");
const router = express.Router();

const family_controller = require("../controllers/familyController");

/* GET home page. */
router.get("/inventory", family_controller.family_list);

module.exports = router;
