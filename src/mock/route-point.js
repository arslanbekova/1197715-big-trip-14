import {nanoid} from 'nanoid';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {getRandomElement, getRandomInt} from '../utils/general';
import {ROUTE_POINT_TYPES, MaxCount, Price} from '../utils/const';
import {generateDestinations} from './destinations';

const generateDate = (date = undefined) => {
  dayjs.extend(duration);
  const gap = 7;
  const daysGap = getRandomInt(gap);
  const hoursGap = getRandomInt(gap);
  const minutesGap = getRandomInt(gap);

  return dayjs(date).add(dayjs.duration({days: daysGap, hours: hoursGap, minutes: minutesGap})).toDate().toISOString();
};

export const generateRoutePoint = () => {
  const dateFrom = generateDate();
  const dateTo = generateDate(dateFrom);
  const type = getRandomElement(ROUTE_POINT_TYPES);
  const destinations = generateDestinations();
  return {
    basePrice: getRandomInt(Price.MIN_PRICE, Price.MAX_PRICE),
    dateFrom,
    dateTo,
    destination: getRandomElement(destinations),
    id: nanoid(MaxCount.ID_SYMBOLS),
    isFavorite: Boolean(getRandomInt()),
    offers: [],
    type,
  };
};
