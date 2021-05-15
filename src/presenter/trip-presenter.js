import NoRoutePoints from '../view/no-route-points';
import CostInfo from '../view/cost-info';
import TripInfo from '../view/trip-info';
import SortOptions from '../view/sort-options';
import NewRoutePoint from '../view/new-route-point';
import RoutePointPresenter from './route-point-presenter';
import {render,remove} from '../utils/render';
import {RenderPosition, SortOption, UpdateType, UserAction} from '../utils/const';
import dayjs from 'dayjs';

export default class Trip {
  constructor(tripEventsContainer, tripInfoContainer, routePointsModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripInfoContainer = tripInfoContainer;
    this._routePointsModel = routePointsModel;
    this._tripEventsList = document.createElement('ul');
    this._tripEventsList.classList.add('trip-events__list');
    this._tripEventsContainer.appendChild(this._tripEventsList);
    this._newEventButton = document.querySelector('.trip-main__event-add-btn');

    this._routePointPresenter = {};
    this._currentSortType = SortOption.DEFAULT.value;

    this._tripInfoComponent = new TripInfo();
    this._costInfoComponent = new CostInfo();
    this._sortComponent = null;
    this._noRoutePointsComponent = new NoRoutePoints();
    this._newRoutePointComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._newEventFormOpenHandler = this._newEventFormOpenHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleNewRoutePointSubmit = this._handleNewRoutePointSubmit.bind(this);
    this._handleNewRoutePointCancelClick = this._handleNewRoutePointCancelClick.bind(this);

    this._routePointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
    this._setNewEventButtonClickHandler();
  }

  _getRoutePoints() {
    switch (this._currentSortType) {
      case SortOption.TO_SHORTEST_TIME.value:
        return this._routePointsModel.getRoutePoints().slice().sort((a, b) => {
          const aDuration = dayjs.duration(dayjs(a.dateTo).diff(dayjs(a.dateFrom))).asMilliseconds();
          const bDuration = dayjs.duration(dayjs(b.dateTo).diff(dayjs(b.dateFrom))).asMilliseconds();
          return bDuration - aDuration;
        });
      case SortOption.TO_LOWEST_PRICE.value:
        return this._routePointsModel.getRoutePoints().slice().sort((a, b) => b.basePrice - a.basePrice);
      case SortOption.DEFAULT.value:
        return this._routePointsModel.getRoutePoints().slice().sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
    }

    return this._routePointsModel.getRoutePoints();
  }

  _clearRoutePoints() {
    Object
      .values(this._routePointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._routePointPresenter = {};
  }

  _clearTrip(resetSortType = false) {
    this._clearRoutePoints();

    remove(this._sortComponent);
    remove(this._noRoutePointsComponent);
    remove(this._tripInfoComponent);
    remove(this._costInfoComponent);

    if (resetSortType) {
      this._currentSortType = SortOption.DEFAULT.value;
    }
  }

  _setNewEventButtonClickHandler() {
    this._newEventButton.addEventListener('click', this._newEventFormOpenHandler);
  }

  _newEventFormOpenHandler() {
    this._newRoutePointComponent = new NewRoutePoint();
    render(this._tripEventsList, this._newRoutePointComponent, RenderPosition.AFTERBEGIN);
    this._newRoutePointComponent.setDatepickers();
    this._newEventButton.setAttribute('disabled', 'disabled');
    this._newRoutePointComponent.setFormSubmitHandler(this._handleNewRoutePointSubmit);
    this._newRoutePointComponent.setCancelButtonClickHandler(this._handleNewRoutePointCancelClick);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleNewRoutePointSubmit() {
    this._closeNewRoutePointForm();
  }

  _handleNewRoutePointCancelClick() {
    this._closeNewRoutePointForm();
  }

  _closeNewRoutePointForm() {
    this._newRoutePointComponent.removeDatepickers();
    remove(this._newRoutePointComponent);
    this._newRoutePointComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._newEventButton.removeAttribute('disabled');
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeNewRoutePointForm();
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
      case UpdateType.MINOR:
        // обновить список точек маршрута
        this._clearRoutePoints();
        this._renderRoutePoints();
        break;
        //обновить весь маршрут
      case UpdateType.MAJOR:
        this._clearTrip(true);
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
    const routePointPresenter = new RoutePointPresenter(eventsList, this._handleViewAction, this._handleModeChange);
    routePointPresenter.init(routePoint);
    this._routePointPresenter[routePoint.id] = routePointPresenter;
  }

  _renderRoutePoints(routePoints) {
    routePoints.forEach((routePoint) => {
      this._renderRoutePoint(routePoint, this._tripEventsList);
    });
  }

  _renderNoRoutePoints() {
    render(this._tripEventsContainer, this._noRoutePointsComponent());
  }

  _renderTrip() {
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
