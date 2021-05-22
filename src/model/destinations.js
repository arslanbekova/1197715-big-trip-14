import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations.reduce((result, item) => {
      const {name, description, pictures} = item;
      return {...result, [name]: {...(result[name] || {}), description, pictures}};
    }, {});
  }
}
