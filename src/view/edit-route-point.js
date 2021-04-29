import dayjs from 'dayjs';
import {restructuredDestinations} from '../mock/destinations';
import {restructuredOffers} from '../mock/offers';
import {ROUTE_POINT_TYPES} from '../utils/const';
import {toUpperCaseFirstSymbol} from '../utils/general';
import Smart from './smart';

const createOfferTemplate = (offers, offerType) => {
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers.map((offer, index) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerType}-${index+1}" type="checkbox" name="event-offer-${offerType}">
      <label class="event__offer-label" for="event-offer-${offerType}-${index+1}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('')}
    </div>
  </section>`;
};

const createEventTypeTemplate = (eventTypes) => {
  return eventTypes.map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
      <label class="event__type-label  event__type-label--${eventType}"
        data-event-type="${eventType}"
        for="event-type-${eventType}-1">${toUpperCaseFirstSymbol(eventType)}</label>
    </div>`,
  ).join('');
};

const createEventDestinationTemplate = (destinations) => {
  return Object.keys(destinations).map((destination) =>
    `<option value="${destination}"></option>`,
  ).join('');
};

const createEventDescriptionTemplate = (destination) => {
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${destination.pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>
  </section>`;
};

const createEditRoutePointTemplate = (routePoint) => {
  const {dateFrom, dateTo, type, destination, basePrice, offers, stateIsDescription, stateIsOffers} = routePoint;
  const offersTemplate = createOfferTemplate(offers, type);
  const eventTypesTemplate = createEventTypeTemplate(ROUTE_POINT_TYPES);
  const eventDestinationsTemplate = createEventDestinationTemplate(restructuredDestinations);
  const eventDescriptionTemplate = createEventDescriptionTemplate(destination, stateIsDescription);

  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${eventTypesTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${eventDestinationsTemplate}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${stateIsOffers ? offersTemplate : ''}
      ${stateIsDescription ? eventDescriptionTemplate : ''}
    </section>
  </form>`;
};

export default class EditRoutePoint extends Smart {
  constructor(routePoint) {
    super();
    this._state = EditRoutePoint.parseDataToState(routePoint);
    this._currentEventType = this._state.type;

    this._arrowClickHandler = this._arrowClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditRoutePointTemplate(this._state);
  }

  _arrowClickHandler(evt) {
    evt.preventDefault();
    this._callback.arrowClick();
  }

  setArrowClickHandler(callback) {
    this._callback.arrowClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._arrowClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditRoutePoint.parseSateToData(this._state));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  _eventTypeChangeHandler(evt) {
    if (evt.target.hasAttribute('data-event-type')) {
      const eventType = evt.target.dataset.eventType;

      if (this._currentEventType === eventType) {
        return;
      }

      this.updateState({
        type: eventType,
        offers: restructuredOffers[eventType],
        stateIsOffers: Boolean(restructuredOffers[eventType].length),
      });
      //очистить список ранее выбранных опций
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .addEventListener('click', this._eventTypeChangeHandler);
  }

  //данные в состояние
  static parseDataToState(routePoint) {
    return Object.assign(
      {},
      routePoint,
      {
        stateIsOffers: Boolean(routePoint.offers.length),
        stateIsDescription: Boolean(routePoint.destination.description.length),
      },
    );
  }
}
