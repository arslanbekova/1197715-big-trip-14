import {createCostInfoTemplate} from './view/cost-info';
import {createTripInfoTemplate} from './view/trip-info';
import {createRoutePointTemplate} from './view/route-point';
import {createNewRoutePointTemplate} from './view/new-route-point';
import {createEditRoutePointTemplate} from './view/edit-route-point';
import {createSiteMenuTemplate} from './view/site-menu';
import {createFilterOptionsTemplate} from './view/filter-options';
import {createSortOptionsTemplate} from './view/sort-options';
import {generateRoutePoint} from './mock/route-point';

const EVENTS_COUNT = 20;
const routPoints = Array(EVENTS_COUNT).fill('route point').map(generateRoutePoint);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

// Добавляет информацию о маршруте: города, даты, стоимость
const siteHeaderElement = document.querySelector('.page-header');
const headerTripContainer = siteHeaderElement.querySelector('.trip-main');

render (headerTripContainer, createTripInfoTemplate(), 'afterbegin');

const headerTripInfoElement = headerTripContainer.querySelector('.trip-info');
render (headerTripInfoElement, createCostInfoTemplate());

// Добавляет меню и фильтры
const headerControlsContainer = headerTripContainer.querySelector('.trip-controls');
const headerNavigationContainer = headerControlsContainer.querySelector('.trip-controls__navigation');
render(headerNavigationContainer, createSiteMenuTemplate());

const headerFilterOptionsContainer = headerControlsContainer.querySelector('.trip-controls__filters');
render(headerFilterOptionsContainer, createFilterOptionsTemplate());

// Добавляет сортировку
const siteMainElement = document.querySelector('.page-main');
const mainTripEventsElement = siteMainElement.querySelector('.trip-events');

render(mainTripEventsElement, createSortOptionsTemplate());

// Добавляет список событий и события
const mainTripEventsList = document.createElement('ul');
mainTripEventsList.classList.add('trip-events__list');

routPoints.forEach((routPoint) => {
  render(mainTripEventsList, createRoutePointTemplate(routPoint));
});

mainTripEventsElement.appendChild(mainTripEventsList);

// Добавляет формы редактирования и создания
render(mainTripEventsList, createEditRoutePointTemplate(), 'afterbegin');
render(mainTripEventsList, createNewRoutePointTemplate());
