import CostInfo from './view/cost-info';
import TripInfo from './view/trip-info';
import RoutePoint from './view/route-point';
import NoRoutePoints from './view/no-route-points';
import NewRoutePoint from './view/new-route-point';
import EditRoutePoint from './view/edit-route-point';
import SiteMenu from './view/site-menu';
import FilterOptions from './view/filter-options';
import SortOptions from './view/sort-options';
import {generateRoutePoint} from './mock/route-point';
import {render, replace} from './utils/render';
import {RenderPosition} from './utils/const';

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

// Добавляет сортировку
const siteMainElement = document.querySelector('.page-main');
const mainTripEventsElement = siteMainElement.querySelector('.trip-events');

const renderRoutePoint = (eventListElement, routePoint) => {
  const RoutePointComponent = new RoutePoint(routePoint);
  const EditRoutePointComponent = new EditRoutePoint(routePoint);

  const openEditRoutePointForm = () => {
    replace(EditRoutePointComponent, RoutePointComponent);
  };

  const closeEditRoutePointForm = () => {
    replace(RoutePointComponent, EditRoutePointComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeEditRoutePointForm();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  RoutePointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    openEditRoutePointForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  EditRoutePointComponent.getElement().addEventListener('submit', (evt) => {
    evt.preventDefault();
    closeEditRoutePointForm();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  EditRoutePointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    closeEditRoutePointForm();
  });

  render(eventListElement, RoutePointComponent);
};

if (!routePoints.length) {
  render(mainTripEventsElement, new NoRoutePoints());
} else {
  // Добавляет информацию о маршруте: города, даты, стоимость
  render(headerTripContainer, new TripInfo(), RenderPosition.AFTERBEGIN);
  const headerTripInfoElement = headerTripContainer.querySelector('.trip-info');
  render(headerTripInfoElement, new CostInfo());

  // Добавляет сортировку
  render(mainTripEventsElement, new SortOptions());

  // Добавляет список событий и события
  const mainTripEventsList = document.createElement('ul');
  mainTripEventsList.classList.add('trip-events__list');

  routePoints.forEach((routePoint) => {
    renderRoutePoint(mainTripEventsList, routePoint);
  });

  mainTripEventsElement.appendChild(mainTripEventsList);

  // Добавляет форму создания
  render(mainTripEventsList, new NewRoutePoint());
}
