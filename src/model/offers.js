import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  set(offers) {
    this._offers = offers;
  }

  get() {
    return this._offers.reduce((result, item) => {
      result[item.type] = item.offers;
      return result;
    }, {});
  }
}
