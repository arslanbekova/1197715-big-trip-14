import Abstract from './abstract';

const createNoRoutePointsTemplate = () => {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
};

export default class NoRoutePoints extends Abstract {

  getTemplate() {
    return createNoRoutePointsTemplate();
  }
}
