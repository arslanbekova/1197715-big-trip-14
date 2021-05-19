import Abstract from './abstract';
import {SortOption} from '../utils/const';

const createSortOptionsTemplate = (currentSortType) => {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${Object.values(SortOption).map((sortType) =>
    `<div class="trip-sort__item  trip-sort__item--${sortType.value}">
      <input id="sort-${sortType.value}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortType.value}"
        ${currentSortType === sortType.value ? 'checked' : ''}
        ${sortType.isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn"
        data-sort-type="${sortType.value}"
        for="sort-${sortType.value}">${sortType.value}</label>
    </div>`,
  ).join('')}
  </form>`;
};

export default class SortOptions extends Abstract {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortOptionsTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.hasAttribute('data-sort-type')) {
      evt.preventDefault();
      this._callback.sortTypeChange(evt.target.dataset.sortType);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
