import FilterOptions from '../view/filter-options';
import {render, replace, remove} from '../utils/render';
import {UpdateType, FilterOption} from '../utils/const';
import {filter} from '../utils/filter';

export default class Filter {
  constructor(filterContainer, filterModel, routePointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._routePointsModel = routePointsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._routePointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevFilterComponent = this._filterComponent;
    const filters = this._getFilters();
    this._filterComponent = new FilterOptions(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  setDisable() {
    this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input')
      .forEach((input) => input.setAttribute('disabled', 'disabled'));
  }

  setActive() {
    this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input')
      .forEach((input) => input.removeAttribute('disabled', 'disabled'));
  }

  _getFilters() {
    const routePoints = this._routePointsModel.getRoutePoints();

    return [
      {
        type: FilterOption.EVERYTHING,
        name: 'Everything',
        count: filter[FilterOption.EVERYTHING](routePoints).length,
      },
      {
        type: FilterOption.FUTURE,
        name: 'Future',
        count: filter[FilterOption.FUTURE](routePoints).length,
      },
      {
        type: FilterOption.PAST,
        name: 'Past',
        count: filter[FilterOption.PAST](routePoints).length,
      },
    ];
  }
}
