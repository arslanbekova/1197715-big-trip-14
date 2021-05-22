import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers.reduce((result, item) => {
      result[item.type] = item.offers;
      return result;
    }, {});
  }
}
