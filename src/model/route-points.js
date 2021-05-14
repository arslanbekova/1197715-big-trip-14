import Observer from '../utils/observer';

export default class RoutePoints extends Observer {
  constructor() {
    super();
    this._routePoints = [];
  }

  setRoutePoints(routePoints) {
    this._routePoints = routePoints.slice();
  }

  getRoutePoints() {
    return this._routePoints;
  }

  updateRoutePoint(updateType, update) {
    const index = this._routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting routePoint');
    }

    this._routePoints = [
      ...this._routePoints.slice(0, index),
      update,
      ...this._routePoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
