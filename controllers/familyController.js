const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Family = require("../models/family");

// List all families
exports.family_list = asyncHandler(async (req, res, next) => {
  const allFamilies = await Family.find({}).sort({ name: 1 }).exec();

  res.render("family_list", {
    title: "Family List",
    family_list: allFamilies,
  });
});

// Display details for specific family
exports.family_detail = asyncHandler(async (req, res, next) => {
  const family = await Family.findById(req.params.id).exec();

  res.render("family_detail", {
    title: "Family Details",
    family: family,
  });
});

// Display create family form on GET
exports.family_create_get = asyncHandler(async (req, res, next) => {
  res.render("family_create", {
    title: "Create a Family",
  });
});

// Handle create family form on POST
exports.family_create_post = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be between 2 and 20 characters."),
  body("info")
    .trim()
    .isLength({ max: 200 })
    .escape()
    .withMessage("Info must be 200 characters for less."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const family = new Family({
      name: req.body.name,
      info: req.body.info,
    });

    if (!errors.isEmpty()) {
      res.render("family_create", {
        title: "Create a Family",
        family: family,
        errors: errors.array(),
      });
      return;
    } else {
      await family.save();
      res.redirect(family.url);
    }
  }),
];

// Display delete family form on GET
exports.family_delete_get = asyncHandler(async (req, res, next) => {
  const family = await Family.findById(req.params.id).exec();

  if (family === null) {
    const err = new Error("Family not found");
    err.status = 404;
    return next(err);
  }

  res.render("delete_record", {
    title: "Delete Family",
    record: family,
  });
});

// Handle delete family form on POST
exports.family_delete_post = [
  body("password").matches(process.env.DELETE_PASSWORD),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const family = await Family.findById(req.params.id).exec();

    if (family === null) {
      const err = new Error("Family not found");
      err.status = 404;
      return next(err);
    }

    if (!errors.isEmpty()) {
      res.render("delete_record", {
        title: "Delete Family",
        record: family,
        errors: errors.array(),
      });
    } else {
      await Family.findByIdAndDelete(req.params.id, {});
      res.redirect("delete_successful", {
        title: "Record Deleted",
      });
    }
  }),
];

// Display update family form on GET
exports.family_update_get = asyncHandler(async (req, res, next) => {
  const family = await Family.findById(req.params.id).exec();

  if (family === null) {
    const err = new Error("Family not found");
    err.status = 404;
    return next(err);
  }

  res.render("family_create", {
    title: "Update Family",
    family: family,
  });
});

// Handle update family form on POST
exports.family_update_post = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 20 })
    .escape()
    .withMessage("Name must be between 2 and 20 characters."),
  body("info")
    .trim()
    .isLength({ max: 200 })
    .escape()
    .withMessage("Info must be 200 characters for less."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const family = new Family({
      name: req.body.name,
      info: req.body.info,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("family_create", {
        title: "Update Family",
        family: family,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedFamily = await Family.findByIdAndUpdate(
        req.params.id,
        family,
        {}
      );
      res.redirect(updatedFamily.url);
    }
  }),
];
