export const ROUTE_POINT_TYPES = [
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

export const DESTINATIONS = [
  'Chamonix',
  'Amsterdam',
  'Geneva',
  'Rome',
  'Lisbon',
];

export const MaxCount = {
  ID_SYMBOLS: 5,
  OFFERS: 5,
  DESTINATION_DESCRIPTION_SENTENCES: 5,
  DESTINATION_PICTURES: 5,
};

export const Price = {
  MIN_PRICE: 15,
  MAX_PRICE: 150,
};

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const SortOption = {
  DEFAULT: {
    value: 'day',
    isDisabled: false,
    isChecked: true,
  },
  BY_EVENT: {
    value: 'event',
    isDisabled: true,
    isChecked: false,
  },
  TO_SHORTEST_TIME: {
    value: 'time',
    isDisabled: false,
    isChecked: false,
  },
  TO_LOWEST_PRICE: {
    value: 'price',
    isDisabled: false,
    isChecked: false,
  },
  BY_OFFER: {
    value: 'offer',
    isDisabled: true,
    isChecked: false,
  },
};
