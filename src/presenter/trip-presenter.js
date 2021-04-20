import NoRoutePoints from '../view/no-route-points';
import CostInfo from '../view/cost-info';
import TripInfo from '../view/trip-info';
import SortOptions from '../view/sort-options';
import RoutePointPresenter from './route-point-presenter';
import {render} from '../utils/render';
import {RenderPosition} from '../utils/const';

export default class Trip {
  constructor(tripEventsContainer, tripInfoContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._tripInfoContainer = tripInfoContainer;

    this._tripInfoComponent = new TripInfo();
    this._costInfoComponent = new CostInfo();
    this._sortComponent = new SortOptions();
    this._noRoutePointsComponent = new NoRoutePoints();
  }

  init(routePoints) {
    this._routePoints = routePoints.slice();
    this._renderTrip();
  }

  _renderTripInfo() {
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCostInfo() {
    const tripInfoElement = this._tripInfoComponent.getElement();
    render(tripInfoElement, this._costInfoComponent);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent);
  }

  _renderRoutePoint(routePoint, eventsList) {
    const routePointPresenter = new RoutePointPresenter(eventsList);
    routePointPresenter.init(routePoint);
  }

  _renderRoutePoints() {
    const tripEventsList = document.createElement('ul');
    tripEventsList.classList.add('trip-events__list');

    this._routePoints.forEach((routePoint) => {
      this._renderRoutePoint(routePoint, tripEventsList);
    });
    this._tripEventsContainer.appendChild(tripEventsList);
  }

  _renderNoRoutePoints() {
    render(this._tripEventsContainer, this._noRoutePointsComponent());
  }

  _renderTrip() {
    if (!this._routePoints.length) {
      this._renderNoRoutePoints();
      return;
    }
    this._renderTripInfo();
    this._renderCostInfo();
    this._renderSort();
    this._renderRoutePoints();
  }
}
