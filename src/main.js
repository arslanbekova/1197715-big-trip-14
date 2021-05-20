import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter';
import RoutePoints from './model/route-points';
import Filter from './model/filter';
import SiteMenu from './view/site-menu';
import Statistics from './view/statistics';
import {generateRoutePoint} from './mock/route-point';
import {render, remove} from './utils/render';
import {MenuItem} from './utils/const';

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
const siteMenuComponent = new SiteMenu();
render(navigationContainer, siteMenuComponent);

const filterOptionsContainer = tripInfoContainer.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter(filterOptionsContainer, filterModel, routePointsModel);
filterPresenter.init();

// Добавляет точки маршрута
const siteMainElement = document.querySelector('.page-main');
const siteMainContainer = siteMainElement.querySelector('.page-body__container');
const tripEventsContainer = siteMainElement.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripEventsContainer, tripInfoContainer, routePointsModel, filterModel);
tripPresenter.init();

//Добавляет обработчик для создания новой точки маршрута
document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createNewRoutePoint();
});

//Переключение экранов
let statisticsComponent = null;
const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.showTrip();
      filterPresenter.setActive();
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
        statisticsComponent = null;
      }
      break;
    case MenuItem.STATISTICS:
      tripPresenter.hideTrip();
      filterPresenter.setDisable();
      statisticsComponent = new Statistics(routePointsModel.getRoutePoints());
      render(siteMainContainer, statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.STATISTICS);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
