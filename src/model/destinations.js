import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  set(destinations) {
    this._destinations = destinations;
  }

  get() {
    return this._destinations.reduce((result, item) => {
      const {name, description, pictures} = item;
      return {...result, [name]: {...(result[name] || {}), description, pictures}};
    }, {});
  }
}
