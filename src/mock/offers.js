import {getRandomElement, getRandomInt} from '../utils/general';
import {ROUTE_POINT_TYPES, MaxCount, Price} from '../utils/const';

const OFFERS = [
  'Upgrade to a business class',
  'Choose the radio station',
  'Add meal',
  'Choose seats',
  'Switch to comfort',
  'Order uber',
];

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

export const restructuredOffers = generateOffers().reduce((result, item) => {
  result[item.type] = item.offers;
  return result;
}, {});
