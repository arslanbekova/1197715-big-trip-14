export const toUpperCaseFirstSymbol = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeArrayElement = (element, array) => {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
};

export const makeItemsUniq = (items) => [...new Set(items)];
