exports.lengthEquals = (length) => {
  return [
    (val) => {
      return val.length === length;
    },
    `Array.length must be equal to ${length}`,
  ];
};

exports.lengthWithin = (minLength, maxLength) => {
  return [
    (val) => {
      if (val.length >= minLength && val.length <= maxLength) return true;
      return false;
    },
    `Array.length must be >= ${minLength} and <= ${maxLength}.`,
  ];
};
