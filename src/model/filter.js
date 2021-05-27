import Observer from '../utils/observer.js';
import {FilterOption} from '../utils/const.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterOption.EVERYTHING;
  }

  set(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._activeFilter;
  }
}
