import Abstract from './abstract.js';

const createErrorTemplate = () => {
  return `<p class="trip-events__msg">
    Sorry, something went wrong...
    Please, try again later.
  </p>`;
};

export default class Error extends Abstract {
  getTemplate() {
    return createErrorTemplate();
  }
}
