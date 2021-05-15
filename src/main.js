import TripPresenter from './presenter/trip-presenter';
import RoutePoints from './model/route-points';
import SiteMenu from './view/site-menu';
import FilterOptions from './view/filter-options';
import {generateRoutePoint} from './mock/route-point';
import {render} from './utils/render';

const EVENTS_COUNT = 20;
const routePoints = Array(EVENTS_COUNT)
  .fill('route point')
  .map(generateRoutePoint);

const routePointsModel = new RoutePoints();
routePointsModel.setRoutePoints(routePoints);

const siteHeaderElement = document.querySelector('.page-header');
const tripInfoContainer = siteHeaderElement.querySelector('.trip-main');

// Добавляет меню и фильтры
const navigationContainer = tripInfoContainer.querySelector('.trip-controls__navigation');
render(navigationContainer, new SiteMenu());

const filterOptionsContainer = tripInfoContainer.querySelector('.trip-controls__filters');
render(filterOptionsContainer, new FilterOptions());

// Добавляет точки маршрута
const siteMainElement = document.querySelector('.page-main');
const tripEventsContainer = siteMainElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripEventsContainer, tripInfoContainer, routePointsModel);
tripPresenter.init();

