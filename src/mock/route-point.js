import {nanoid} from 'nanoid';
import {getRandomElement, shuffle, getRandomInt, generateDate} from '../utils/general';

const ROUTE_POINT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const OFFERS = [
  'Upgrade to a business class',
  'Choose the radio station',
  'Add meal',
  'Choose seats',
  'Switch to comfort',
  'Order uber',
];

const DESTINATIONS = [
  'Chamonix',
  'Amsterdam',
  'Geneva',
  'Rome',
  'Lisbon',
];

const PICTURE_DESCRIPTIONS = [
  'Chamonix parliament buildin',
  'Rome Trevi fountain',
  'Amsterdam canal view',
  'Geneva st.Peter`s basilica',
  'Lisbon Jerónimos Monastery',
];

const MaxCount = {
  ID_SYMBOLS: 5,
  OFFERS: 5,
  DESTINATION_DESCRIPTION_SENTENCES: 5,
  DESTINATION_PICTURES: 5,
};

const Price = {
  MIN_PRICE: 15,
  MAX_PRICE: 150,
};

const generateDestinationDescription = () => {
  const destinationDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';
  const destinationDescriptionInStrings = destinationDescription.split('.');

  return shuffle(destinationDescriptionInStrings).slice(0, getRandomInt(MaxCount.DESTINATION_DESCRIPTION_SENTENCES)).join('. ');
};

const generateDestination = () => {
  return {
    description: generateDestinationDescription(),
    name: getRandomElement(DESTINATIONS),
    pictures: Array(getRandomInt(MaxCount.DESTINATION_PICTURES)).fill('picture').map(() => {
      return {
        src: 'http://picsum.photos/248/152?r=' + `${getRandomInt(MaxCount.DESTINATION_PICTURES)}`,
        description: getRandomElement(PICTURE_DESCRIPTIONS),
      };
    }),
  };
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
  return {
    basePrice: getRandomInt(Price.MIN_PRICE, Price.MAX_PRICE),
    dateFrom,
    dateTo,
    destination: generateDestination(),
    id: nanoid(MaxCount.ID_SYMBOLS),
    isFavorite: Boolean(getRandomInt()),
    offers: restructuredOffers[type],
    type,
  };
};
