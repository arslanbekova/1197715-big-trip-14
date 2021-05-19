import {FilterOption} from './const';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

//Точки маршрута, у которых дата начала меньше текущей даты, а дата окончания — больше,
//отображаются во всех трёх списках
const isMatchToAll = (routePoint) => {
  return dayjs().isAfter(routePoint.dateFrom) && dayjs().isBefore(routePoint.dateTo);
};

export const filter = {
  //все
  [FilterOption.EVERYTHING]: (routePoints) => routePoints,

  //дата начала события больше или равна текущей дате
  [FilterOption.FUTURE]: (routePoints) => routePoints.filter((routePoint) => dayjs().isSameOrBefore(routePoint.dateFrom) || isMatchToAll(routePoint)),

  //дата окончания маршрута меньше, чем текущая.
  [FilterOption.PAST]: (routePoints) => routePoints.filter((routePoint) => dayjs().isAfter(routePoint.dateTo) || isMatchToAll(routePoint)),
};
