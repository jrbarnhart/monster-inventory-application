const isIntValidator = [
  (val) => {
    return Number.isInteger(val);
  },
  "Number must be an integer.",
];

module.exports = isIntValidator;
