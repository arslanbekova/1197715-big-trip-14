import Abstract from './abstract';
import {FilterOption} from '../utils/const.js';

const createFilterOptionsTemplate = (currentFilterType = FilterOption.EVERYTHING) => {
  return `<form class="trip-filters" action="#" method="get">
    ${Object.values(FilterOption).map((filterType) =>
    `<div class="trip-filters__filter">
      <input id="filter-${filterType}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filterType}"
        ${currentFilterType === filterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType}</label>
    </div>`,
  ).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FilterOptions extends Abstract {

  getTemplate() {
    return createFilterOptionsTemplate();
  }
}
