const getChangedFields = (current, original) => {
  const changed = {};

  for (const key in current) {
    if (current[key] !== original[key]) {
      changed[key] = current[key];
    }
  }

  return changed;
};
export { getChangedFields }