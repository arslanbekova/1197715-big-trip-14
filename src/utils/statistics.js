import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import {calculateDurationTime} from '../utils/duration-time';

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

export const getSpendedTimeByType = (uniqTypes, routePoints) => uniqTypes.reduce((result, uniqType, index) => {
  let spendedTime = null;
  routePoints.forEach((routePoint) => {
    if (routePoint.type === uniqType) {
      const durationTime = calculateDurationTime(routePoint.dateFrom, routePoint.dateTo);
      if (spendedTime === null) {
        spendedTime = durationTime;
      } else {
        spendedTime = spendedTime.add(durationTime);
      }
      result[index] = {type: uniqType, spendedTime};
    }
    return;
  });
  return result;
}, []);
