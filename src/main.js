import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter';
import RoutePoints from './model/route-points';
import Filter from './model/filter';
import Destinations from './model/destinations';
import Offers from './model/offers';
import SiteMenu from './view/site-menu';
import Statistics from './view/statistics';
import Error from './view/error';
import {render, remove} from './utils/render';
import {MenuItem, UpdateType} from './utils/const';
import Api from './api.js';

const AUTHORIZATION = 'Basic R82kiopHJg';
const END_POINT = 'https://13.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const routePointsModel = new RoutePoints();
const filterModel = new Filter();

const destinationsModel = new Destinations();
const offersModel = new Offers();

const siteHeaderElement = document.querySelector('.page-header');
const siteHeaderContainer = siteHeaderElement.querySelector('.page-header__container');

const tripInfoContainer = siteHeaderElement.querySelector('.trip-main');
const navigationContainer = tripInfoContainer.querySelector('.trip-controls__navigation');
const filterOptionsContainer = tripInfoContainer.querySelector('.trip-controls__filters');

const siteMainElement = document.querySelector('.page-main');
const siteMainContainer = siteMainElement.querySelector('.page-body__container');
const tripEventsContainer = siteMainElement.querySelector('.trip-events');

const newEventButton = document.querySelector('.trip-main__event-add-btn');

const siteMenuComponent = new SiteMenu();
const filterPresenter = new FilterPresenter(filterOptionsContainer, filterModel, routePointsModel);
const tripPresenter = new TripPresenter(tripEventsContainer, tripInfoContainer, routePointsModel, filterModel, destinationsModel, offersModel);

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
      siteMainContainer.classList.remove('no-after');
      siteHeaderContainer.classList.remove('no-after');
      break;
    case MenuItem.STATISTICS:
      tripPresenter.hideTrip();
      filterPresenter.setDisable();
      statisticsComponent = new Statistics(routePointsModel.getRoutePoints());
      render(siteMainContainer, statisticsComponent);
      siteMenuComponent.setMenuItem(MenuItem.STATISTICS);
      siteMainContainer.classList.add('no-after');
      siteHeaderContainer.classList.add('no-after');
      break;
  }
};

const helpInitApp = () => {
  render(navigationContainer, siteMenuComponent);
  tripPresenter._newRoutePointPresenter.setActive();

  newEventButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    tripPresenter.createNewRoutePoint();
  });

  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
};

Promise.all([api.getOffers(), api.getDestinations()])
  .then((response) => {
    const [offers, destinations] = response;
    destinationsModel.setDestinations(destinations);
    offersModel.setOffers(offers);
    filterPresenter.init();
    tripPresenter.init();
  })
  .then(() => {
    api.getRoutePoints()
      .then((routePoints) => {
        routePointsModel.setRoutePoints(UpdateType.INIT, routePoints);
        helpInitApp();
      })
      .catch(() => {
        //приложение без данных
        routePointsModel.setRoutePoints(UpdateType.INIT, []);
        helpInitApp();
      });
  })
  .catch(() => {
    //блокировка
    render(tripEventsContainer, new Error());
  });
