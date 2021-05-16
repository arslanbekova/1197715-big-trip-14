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
  },
  BY_EVENT: {
    value: 'event',
    isDisabled: true,
  },
  TO_SHORTEST_TIME: {
    value: 'time',
    isDisabled: false,
  },
  TO_LOWEST_PRICE: {
    value: 'price',
    isDisabled: false,
  },
  BY_OFFER: {
    value: 'offer',
    isDisabled: true,
  },
};

export const UserAction = {
  UPDATE_ROUTE_POINT: 'UPDATE_ROUTE_POINT',
  ADD_ROUTE_POINT: 'ADD_ROUTE_POINT',
  DELETE_ROUTE_POINT: 'DELETE_ROUTE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterOption = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

