import Observer from '../utils/observer';
import dayjs from 'dayjs';

export default class RoutePoints extends Observer {
  constructor() {
    super();
    this._routePoints = [];
  }

  set(updateType, routePoints) {
    this._routePoints = routePoints.slice();
    this._notify(updateType);
  }

  get() {
    return this._routePoints;
  }

  getSortedByDefault() {
    const sourcedRoutePoints = this._routePoints.slice();
    return sourcedRoutePoints.sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
  }

  update(updateType, update) {
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

  add(updateType, update) {
    this._routePoints = [
      update,
      ...this._routePoints,
    ];

    this._notify(updateType, update);
  }

  delete(updateType, update) {
    const index = this._routePoints.findIndex((routePoint) => routePoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting routePoint');
    }

    this._routePoints = [
      ...this._routePoints.slice(0, index),
      ...this._routePoints.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(routePoint) {
    const adaptedRoutePoint = Object.assign(
      {},
      routePoint,
      {
        basePrice: routePoint.base_price,
        dateFrom: routePoint.date_from,
        dateTo: routePoint.date_to,
        isFavorite: routePoint.is_favorite,
      },
    );

    delete adaptedRoutePoint.base_price;
    delete adaptedRoutePoint.date_from;
    delete adaptedRoutePoint.date_to;
    delete adaptedRoutePoint.is_favorite;

    return adaptedRoutePoint;
  }

  static adaptToServer(routePoint) {
    const adaptedRoutePoint = Object.assign(
      {},
      routePoint,
      {
        'base_price': routePoint.basePrice,
        'date_from': routePoint.dateFrom,
        'date_to': routePoint.dateTo,
        'is_favorite': routePoint.isFavorite,
      },
    );

    delete adaptedRoutePoint.basePrice;
    delete adaptedRoutePoint.dateFrom;
    delete adaptedRoutePoint.dateTo;
    delete adaptedRoutePoint.isFavorite;

    return adaptedRoutePoint;
  }
}
