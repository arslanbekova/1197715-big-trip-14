export const getCostsByType = (uniqTypes, routePoints) => uniqTypes.reduce((result, uniqType, index) => {
  let total = 0;
  routePoints.forEach((routePoint) => {
    if (routePoint.type === uniqType) {
      total += routePoint.basePrice;
      result[index] = {type: uniqType, total};
    }
    return;
  });
  return result;
}, []);

export const getTypesByUsageCount = (uniqTypes, routePoints) => uniqTypes.reduce((result, uniqType, index) => {
  const count = routePoints.filter((routePoint) => routePoint.type === uniqType).length;
  result[index] = {type: uniqType, count};
  return result;
}, []);
