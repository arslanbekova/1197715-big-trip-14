import CostInfo from './view/cost-info';
import TripInfo from './view/trip-info';
import RoutePoint from './view/route-point';
import NewRoutePoint from './view/new-route-point';
import EditRoutePoint from './view/edit-route-point';
import SiteMenu from './view/site-menu';
import FilterOptions from './view/filter-options';
import SortOptions from './view/sort-options';
import {generateRoutePoint} from './mock/route-point';
import {renderElement} from './utils/general';
import {RenderPosition} from './utils/const';

const EVENTS_COUNT = 20;
const routePoints = Array(EVENTS_COUNT).fill('route point').map(generateRoutePoint);

// Добавляет информацию о маршруте: города, даты, стоимость
const siteHeaderElement = document.querySelector('.page-header');
const headerTripContainer = siteHeaderElement.querySelector('.trip-main');

renderElement(headerTripContainer, new TripInfo().getElement(), RenderPosition.AFTERBEGIN);

const headerTripInfoElement = headerTripContainer.querySelector('.trip-info');
renderElement(headerTripInfoElement, new CostInfo().getElement());

// Добавляет меню и фильтры
const headerControlsContainer = headerTripContainer.querySelector('.trip-controls');
const headerNavigationContainer = headerControlsContainer.querySelector('.trip-controls__navigation');
renderElement(headerNavigationContainer, new SiteMenu().getElement());

const headerFilterOptionsContainer = headerControlsContainer.querySelector('.trip-controls__filters');
renderElement(headerFilterOptionsContainer, new FilterOptions().getElement());

// Добавляет сортировку
const siteMainElement = document.querySelector('.page-main');
const mainTripEventsElement = siteMainElement.querySelector('.trip-events');

renderElement(mainTripEventsElement, new SortOptions().getElement());

// Добавляет список событий и события
const mainTripEventsList = document.createElement('ul');
mainTripEventsList.classList.add('trip-events__list');

const [firstRoutePoint, ...otherRoutePoints] = routePoints;

otherRoutePoints.forEach((routePoint) => {
  renderElement(mainTripEventsList, new RoutePoint(routePoint).getElement());
});

mainTripEventsElement.appendChild(mainTripEventsList);

// Добавляет формы редактирования и создания
renderElement(mainTripEventsList, new EditRoutePoint(firstRoutePoint).getElement(), RenderPosition.AFTERBEGIN);
renderElement(mainTripEventsList, new NewRoutePoint().getElement());
