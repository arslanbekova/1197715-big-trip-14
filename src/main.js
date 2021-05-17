import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter';
import RoutePoints from './model/route-points';
import Filter from './model/filter';
import SiteMenu from './view/site-menu';
import {generateRoutePoint} from './mock/route-point';
import {render} from './utils/render';

const EVENTS_COUNT = 20;
const routePoints = Array(EVENTS_COUNT)
  .fill('route point')
  .map(generateRoutePoint);

const routePointsModel = new RoutePoints();
routePointsModel.setRoutePoints(routePoints);

const filterModel = new Filter();

const siteHeaderElement = document.querySelector('.page-header');
const tripInfoContainer = siteHeaderElement.querySelector('.trip-main');

// Добавляет меню и фильтры
const navigationContainer = tripInfoContainer.querySelector('.trip-controls__navigation');
render(navigationContainer, new SiteMenu());

const filterOptionsContainer = tripInfoContainer.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter(filterOptionsContainer, filterModel, routePointsModel);
filterPresenter.init();

// Добавляет точки маршрута
const siteMainElement = document.querySelector('.page-main');
const tripEventsContainer = siteMainElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripEventsContainer, tripInfoContainer, routePointsModel, filterModel);
tripPresenter.init();

