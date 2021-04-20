// import NewRoutePoint from './view/new-route-point';
import Trip from './presenter/trip';
import SiteMenu from './view/site-menu';
import FilterOptions from './view/filter-options';
import {generateRoutePoint} from './mock/route-point';
import {render} from './utils/render';

const EVENTS_COUNT = 20;
const routePoints = Array(EVENTS_COUNT).fill('route point').map(generateRoutePoint);

const siteHeaderElement = document.querySelector('.page-header');
const headerTripContainer = siteHeaderElement.querySelector('.trip-main');

// Добавляет меню и фильтры
const headerControlsContainer = headerTripContainer.querySelector('.trip-controls');
const headerNavigationContainer = headerControlsContainer.querySelector('.trip-controls__navigation');
render(headerNavigationContainer, new SiteMenu());

const headerFilterOptionsContainer = headerControlsContainer.querySelector('.trip-controls__filters');
render(headerFilterOptionsContainer, new FilterOptions());

const siteMainElement = document.querySelector('.page-main');
const mainTripEventsElement = siteMainElement.querySelector('.trip-events');

const tripPresenter = new Trip(mainTripEventsElement, headerTripContainer);
tripPresenter.init(routePoints);


//   // Добавляет форму создания
//   render(mainTripEventsList, new NewRoutePoint());

