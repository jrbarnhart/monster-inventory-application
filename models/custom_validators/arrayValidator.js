exports.lengthEquals = (length) => {
  return [
    (val) => {
      if (!Number.isInteger(length)) return false;
      return val.length === length;
    },
    `Array.length must be equal to length param (must be int).`,
  ];
};

exports.lengthWithin = (minLength, maxLength) => {
  return [
    (val) => {
      if (!Number.isInteger(minLength) || !Number.isInteger(maxLength)) {
        return false;
      }
      if (minLength > maxLength) return false;
      if (val.length >= minLength && val.length <= maxLength) return true;
      return false;
    },
    `Array.length must be equal to or within min/maxLength params (must be ints).`,
  ];
};
