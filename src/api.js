import RoutePointsModel from './model/route-points';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

const Url = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getRoutePoints() {
    return this._load({url: Url.POINTS})
      .then(Api.toJSON)
      .then((routePoints) => routePoints.map(RoutePointsModel.adaptToClient));
  }

  getOffers() {
    return this._load({url: Url.OFFERS})
      .then(Api.toJSON);
  }

  getDestinations() {
    return this._load({url: Url.DESTINATIONS})
      .then(Api.toJSON);
  }

  updateRoutePoint(RoutePoint) {
    return this._load({
      url: `points/${RoutePoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(RoutePointsModel.adaptToServer(RoutePoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(RoutePointsModel.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
