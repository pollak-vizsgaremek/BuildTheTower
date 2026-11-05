export function removeData(inputArray, excludeFields) {
  if (excludeFields.length === 0) return inputArray;

  return inputArray.map((item) => {
    const newItem = { ...item };

    excludeFields.forEach((field) => {
      delete newItem[field];
    });

    return newItem;
  });
}
