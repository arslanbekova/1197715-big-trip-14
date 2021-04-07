import {nanoid} from 'nanoid';
import {getRandomElement, getRandomInt, generateDate} from '../utils/general';
import {ROUTE_POINT_TYPES, MaxCount, Price} from '../utils/const';
import {generateDestinations} from './destinations';
import {restructuredOffers} from './offers';

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
    offers: restructuredOffers[type],
    type,
  };
};
