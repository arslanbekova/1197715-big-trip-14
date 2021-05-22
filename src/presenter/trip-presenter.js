import NoRoutePoints from '../view/no-route-points';
import Loading from '../view/loading';
import CostInfo from '../view/cost-info';
import TripInfo from '../view/trip-info';
import SortOptions from '../view/sort-options';
import RoutePointPresenter from './route-point-presenter';
import NewRoutePointPresenter from './new-route-point-presenter';
import {render,remove} from '../utils/render';
import {filter} from '../utils/filter.js';
import {RenderPosition, SortOption, UpdateType, UserAction, FilterOption} from '../utils/const';
import dayjs from 'dayjs';

export default class Trip {
  constructor(tripEventsContainer, tripInfoContainer, routePointsModel, filterModel, destinationsModel, offersModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._routePointsModel = routePointsModel;
    this._filterModel = filterModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._tripEventsList = document.createElement('ul');
    this._tripEventsList.classList.add('trip-events__list');
    this._tripEventsContainer.appendChild(this._tripEventsList);

    this._routePointPresenter = {};
    this._currentSortType = SortOption.DEFAULT.value;
    this._hiddenClassName = 'trip-events--hidden';
    this._isLoading = true;

    this._tripInfoComponent = new TripInfo();
    this._costInfoComponent = new CostInfo();
    this._loadingComponent = new Loading();
    this._sortComponent = null;
    this._noRoutePointsComponent = null;
    this._newRoutePointComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._routePointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newRoutePointPresenter = new NewRoutePointPresenter(this._tripEventsList, this._handleViewAction, this._destinationsModel, this._offersModel);
  }

  init() {
    this._renderTrip();
  }

  showTrip() {
    this._handleSortTypeChange(SortOption.DEFAULT.value);
    this._tripEventsContainer.classList.remove(this._hiddenClassName);
    this._newRoutePointPresenter.setActive();
  }

  hideTrip() {
    this._tripEventsContainer.classList.add(this._hiddenClassName);
    this._newRoutePointPresenter.setDisable();
  }

  createNewRoutePoint() {
    this._currentSortType = SortOption.DEFAULT.value;
    this._handleModeChange();
    this._filterModel.setFilter(UpdateType.MAJOR, FilterOption.EVERYTHING);
    this._newRoutePointPresenter.init();
  }

  _getRoutePoints() {
    const filterType = this._filterModel.getFilter();
    const routePoints = this._routePointsModel.getRoutePoints();
    const filtredRoutePoints = filter[filterType](routePoints);
    switch (this._currentSortType) {
      case SortOption.TO_SHORTEST_TIME.value:
        return filtredRoutePoints.sort((a, b) => {
          const aDuration = dayjs.duration(dayjs(a.dateTo).diff(dayjs(a.dateFrom))).asMilliseconds();
          const bDuration = dayjs.duration(dayjs(b.dateTo).diff(dayjs(b.dateFrom))).asMilliseconds();
          return bDuration - aDuration;
        });
      case SortOption.TO_LOWEST_PRICE.value:
        return filtredRoutePoints.sort((a, b) => b.basePrice - a.basePrice);
      case SortOption.DEFAULT.value:
        return filtredRoutePoints.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
    }

    return filtredRoutePoints;
  }

  _clearRoutePoints() {
    Object
      .values(this._routePointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._routePointPresenter = {};
  }

  _clearTrip(resetSortType = false) {
    this._newRoutePointPresenter.destroy();
    this._clearRoutePoints();

    remove(this._sortComponent);
    remove(this._tripInfoComponent);
    remove(this._costInfoComponent);
    remove(this._noRoutePointsComponent);

    if (resetSortType) {
      this._currentSortType = SortOption.DEFAULT.value;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    remove(this._sortComponent);
    this._renderSort();
    this._clearRoutePoints();
    this._renderRoutePoints(this._getRoutePoints());
  }

  _handleModeChange() {
    Object
      .values(this._routePointPresenter)
      .forEach((presenter) => presenter.resetView());

    this._newRoutePointPresenter.destroy();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_ROUTE_POINT:
        this._routePointsModel.updateRoutePoint(updateType, update);
        break;
      case UserAction.ADD_ROUTE_POINT:
        this._routePointsModel.addRoutePoint(updateType, update);
        break;
      case UserAction.DELETE_ROUTE_POINT:
        this._routePointsModel.deleteRoutePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // обновить конкретную точку маршрута
        this._routePointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR: {
        // обновить список точек маршрута
        const routePoints = this._getRoutePoints();
        if (!routePoints.length) {
          this._clearTrip();
          this._renderNoRoutePoints();
          return;
        }
        this._clearRoutePoints();
        this._renderRoutePoints(routePoints);
        break;
      }
      //обновить весь маршрут
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _renderTripInfo() {
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCostInfo() {
    const tripInfoElement = this._tripInfoComponent.getElement();
    render(tripInfoElement, this._costInfoComponent);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortOptions(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderRoutePoint(routePoint, eventsList) {
    const routePointPresenter = new RoutePointPresenter(eventsList, this._handleViewAction, this._handleModeChange, this._destinationsModel, this._offersModel);
    routePointPresenter.init(routePoint);
    this._routePointPresenter[routePoint.id] = routePointPresenter;
  }

  _renderRoutePoints(routePoints) {
    routePoints.forEach((routePoint) => {
      this._renderRoutePoint(routePoint, this._tripEventsList);
    });
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent);
  }

  _renderNoRoutePoints() {
    this._noRoutePointsComponent = new NoRoutePoints();
    render(this._tripEventsContainer, this._noRoutePointsComponent);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const routePoints = this._getRoutePoints();

    if (!routePoints.length) {
      this._renderNoRoutePoints();
      return;
    }

    this._renderTripInfo();
    this._renderCostInfo();
    this._renderSort();
    this._renderRoutePoints(routePoints);
  }
}
