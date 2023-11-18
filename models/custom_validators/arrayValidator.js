exports.lengthEquals = (length) => {
  return [
    (val) => {
      return val.length === length;
    },
    `Array.length must be equal to ${length}`,
  ];
};
