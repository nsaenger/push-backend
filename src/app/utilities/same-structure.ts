export const SameStructure = (a: Object, b: Object) => {
  if (a === undefined || b === undefined || a === null || b === null) {
    return false;
  }


  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  if (aKeys.join() !== bKeys.join()) {
    return false;
  }

  return aKeys.every(key => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === null) {
      return bValue === null;
    }
    const aType = typeof aValue;
    const bType = typeof bValue;

    if (aType !== bType) {
      return false;
    }

    return aType === 'object' ? SameStructure(aValue, bValue) : true;
  });
};
