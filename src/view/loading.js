import Abstract from './abstract.js';

const createLoadingTemplate = () => {
  return `<p class="trip-events__msg">
    Loading...
  </p>`;
};

export default class Loading extends Abstract {
  getTemplate() {
    return createLoadingTemplate();
  }
}
