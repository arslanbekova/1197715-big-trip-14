import Abstract from './abstract';
// import {FilterOption} from '../utils/const.js';

const createFilterOptionsTemplate = (filters, currentFilterType) => {
  // const {type, name, count} = filter;
  return `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) =>
    `<div class="trip-filters__filter">
      <input id="filter-${filter.type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}"

        ${currentFilterType === filter.type ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.name}</label>
    </div>`,
  ).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FilterOptions extends Abstract {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterOptionsTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
