import {nanoid} from 'nanoid';
import {getRandomElement, getRandomInt, generateDate} from '../utils/general';
import {ROUTE_POINT_TYPES, MaxCount} from '../utils/const';
import {generateDestinations} from './destinations';

const OFFERS = [
  'Upgrade to a business class',
  'Choose the radio station',
  'Add meal',
  'Choose seats',
  'Switch to comfort',
  'Order uber',
];

const Price = {
  MIN_PRICE: 15,
  MAX_PRICE: 150,
};

const generateOffers = () => {
  return ROUTE_POINT_TYPES.map((value, index) => {
    return {
      type: ROUTE_POINT_TYPES[index],
      offers: Array(getRandomInt(MaxCount.OFFERS)).fill('offer').map(() => {
        return {
          title: getRandomElement(OFFERS),
          price: getRandomInt(Price.MIN_PRICE, Price.MAX_PRICE),
        };
      }),
    };
  });
};

const restructuredOffers = generateOffers().reduce((result, item) => {
  result[item.type] = item.offers;
  return result;
}, {});

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
