import Abstract from './abstract';
import dayjs from 'dayjs';

const getRoute = (routePoints) => {
  const MAX_RENDERED_CITIES = 3;
  const cities = routePoints.map((routePoint) => routePoint.destination.name);
  if (cities.length > MAX_RENDERED_CITIES) {
    const firstCity = cities.shift();
    const secondCity = cities.pop();
    return `${firstCity} &mdash; ... &mdash; ${secondCity}`;
  } else {
    const [firstCity, secondCity, thirdCity] = cities;
    return `${firstCity} &mdash; ${secondCity} &mdash; ${thirdCity}`;
  }
};

const getDates = (routePoints) => {
  const fisrtRoutePoint = routePoints.shift();
  const lastRoutePoint = routePoints.pop();
  return `${dayjs(fisrtRoutePoint.dateFrom).format('DD MMM')} &mdash; ${dayjs(lastRoutePoint.dateTo).format('DD MMM')}`;
};

const createTripInfoTemplate = (routePoints) => {
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getRoute(routePoints)}</h1>

      <p class="trip-info__dates">${getDates(routePoints)}</p>
    </div>
  </section>`;
};

export default class TripInfo extends Abstract {
  constructor(routePointsModel) {
    super();
    this._routePointsModel = routePointsModel;
    this._routePoints = this._routePointsModel.getSortedByDefault().slice();
  }

  getTemplate() {
    return createTripInfoTemplate(this._routePoints);
  }
}
