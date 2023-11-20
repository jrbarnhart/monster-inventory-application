var express = require("express");
var router = express.Router();

const family_controller = require("../controllers/familyController");

/* GET home page. */
router.get("/", family_controller.family_list);

module.exports = router;
