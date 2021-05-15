import NoRoutePoints from '../view/no-route-points';
import CostInfo from '../view/cost-info';
import TripInfo from '../view/trip-info';
import SortOptions from '../view/sort-options';
import NewRoutePoint from '../view/new-route-point';
import RoutePointPresenter from './route-point-presenter';
import {render,remove} from '../utils/render';
import {updateItem} from '../utils/general';
import {RenderPosition, SortOption} from '../utils/const';
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
    this._sortComponent = new SortOptions();
    this._noRoutePointsComponent = new NoRoutePoints();
    this._newRoutePointComponent = null;

    this._handleAddToFavorites = this._handleAddToFavorites.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._newEventFormOpenHandler = this._newEventFormOpenHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleNewRoutePointSubmit = this._handleNewRoutePointSubmit.bind(this);
    this._handleNewRoutePointCancelClick = this._handleNewRoutePointCancelClick.bind(this);
  }

  init() {
    this._renderTrip();
    this._setNewEventButtonClickHandler();
  }

  _getRoutePoints() {
    switch (this._currentSortType) {
      case SortOption.TO_SHORTEST_TIME.value:
        this._routePointsModel.getRoutePoints().slice().sort((a, b) => {
          const aDuration = dayjs.duration(dayjs(a.dateTo).diff(dayjs(a.dateFrom))).asMilliseconds();
          const bDuration = dayjs.duration(dayjs(b.dateTo).diff(dayjs(b.dateFrom))).asMilliseconds();
          return bDuration - aDuration;
        });
        break;
      case SortOption.TO_LOWEST_PRICE.value:
        this._routePointsModel.getRoutePoints().slice().sort((a, b) => b.basePrice - a.basePrice);
        break;
      case SortOption.DEFAULT.value:
        this._routePointsModel.getRoutePoints().slice().sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
        break;
    }

    return this._routePointsModel.getRoutePoints();
  }

  _clearRoutePoints() {
    Object
      .values(this._routePointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._routePointPresenter = {};
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
    this._clearRoutePoints();
    this._renderRoutePoints();
  }

  _handleModeChange() {
    Object
      .values(this._routePointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleAddToFavorites(updatedRoutePoint) {
    this._routePoints = updateItem(this._routePoints, updatedRoutePoint);
    this._sourcedRoutePoints = updateItem(this._sourcedRoutePoints, updatedRoutePoint);
    this._routePointPresenter[updatedRoutePoint.id].init(updatedRoutePoint);
  }

  _renderTripInfo() {
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCostInfo() {
    const tripInfoElement = this._tripInfoComponent.getElement();
    render(tripInfoElement, this._costInfoComponent);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderRoutePoint(routePoint, eventsList) {
    const routePointPresenter = new RoutePointPresenter(eventsList, this._handleAddToFavorites, this._handleModeChange);
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
