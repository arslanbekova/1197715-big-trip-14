export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * Math.floor(array.length))];
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const toUpperCaseFirstSymbol = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const removeArrayElement = (element, array) => {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
};
