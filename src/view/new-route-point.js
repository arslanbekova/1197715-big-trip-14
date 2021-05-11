import Smart from './smart';
import dayjs from 'dayjs';
import _ from 'lodash';
import {restructuredDestinations} from '../mock/destinations';
import {restructuredOffers} from '../mock/offers';
import {ROUTE_POINT_TYPES} from '../utils/const';
import {toUpperCaseFirstSymbol, removeArrayElement} from '../utils/general';

const DEFAULT_EVENT_TYPE = 'flight';
const INITIAL_STATE = {
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  id: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_EVENT_TYPE,
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

const createOfferTemplate = (eventType, isOffers, choosedOffers) => {
  if (isOffers) {
    const avaliableOffers = restructuredOffers[eventType];
    return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${avaliableOffers.map((offer, index) =>
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden"
          data-offer-title="${offer.title}"
          data-offer-price="${offer.price}"
          id="event-offer-${eventType}-${index+1}"
          type="checkbox"
          ${choosedOffers.some((choosedOffer) => choosedOffer.title === offer.title) ? 'checked' : ''}
          name="event-offer-${eventType}">
        <label class="event__offer-label" for="event-offer-${eventType}-${index+1}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('')}
      </div>
    </section>`;
  } else {
    return '';
  }
};

const createEventDestinationTemplate = (destinations) => {
  return Object.keys(destinations).map((destination) =>
    `<option value="${destination}"></option>`,
  ).join('');
};

const createEventDescriptionTemplate = (destination, isDescription) => {
  if (isDescription) {
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
  } else {
    return '';
  }
};

export const createNewRoutePointTemplate = (newRoutePoint) => {
  const {dateFrom, dateTo, type, destination, basePrice, offers,
    stateIsDateFrom, stateIsDateTo, stateIsBasePrice, stateIsDestinationName, stateIsDescription, stateIsOffers} = newRoutePoint;
  const offersTemplate = createOfferTemplate(type, stateIsOffers, offers);
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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${stateIsDestinationName ? destination.name : ''}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${eventDestinationsTemplate}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${stateIsDateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : ''}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${stateIsDateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${stateIsBasePrice ? basePrice : ''}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${offersTemplate}
      ${eventDescriptionTemplate}
    </section>
  </form>`;
};

export default class NewRoutePoint extends Smart {
  constructor(newRoutePoint = INITIAL_STATE) {
    super();
    this._state = NewRoutePoint.parseDataToState(newRoutePoint);
    this._currentEventType = this._state.type;

    this._cancelButtonClickHandler = this._cancelButtonClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._addExtraOption = this._addExtraOption.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewRoutePointTemplate(this._state);
  }

  _cancelButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelButtonClick();
  }

  setCancelButtonClickHandler(callback) {
    this._callback.cancelButtonClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._cancelButtonClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(NewRoutePoint.parseStateToData(this._state));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  _eventTypeChangeHandler(evt) {
    if (evt.target.hasAttribute('data-event-type')) {
      const newEventType = evt.target.dataset.eventType;

      if (this._currentEventType === newEventType) {
        return;
      }

      this._currentEventType = newEventType;
      const avaliableOffers = restructuredOffers[newEventType];

      this.updateState({
        type: newEventType,
        offers: [],
        stateIsOffers: Boolean(avaliableOffers.length),
      });
    }
  }

  _destinationChangeHandler(evt) {
    const newDestinationName = evt.target.value;
    const newDestination = restructuredDestinations[newDestinationName];

    this.updateState({
      destination: {
        name: newDestinationName,
        description: newDestination.description,
        pictures: newDestination.pictures,
      },
      stateIsDescription: Boolean(newDestination.description.length),
      stateIsDestinationName: true,
    });
  }

  _removeEqualOption(choosedOffer, choosedOffers) {
    const equalOffer = choosedOffers.find((element) => _.isEqual(element, choosedOffer));
    removeArrayElement(equalOffer, choosedOffers);
    this.updateState({
      offers: choosedOffers,
    }, true);
  }

  _addExtraOption(evt) {
    const offerTitle = evt.target.dataset.offerTitle;
    const offerPrice = evt.target.dataset.offerPrice;
    const choosedOffer = {
      title: offerTitle,
      price: offerPrice,
    };
    const choosedOffers = this._state.offers.slice();
    const isEqualOffer = choosedOffers.some((element) => _.isEqual(element, choosedOffer));

    if (isEqualOffer) {
      this._removeEqualOption(choosedOffer, choosedOffers);
      return;
    }

    choosedOffers.push(choosedOffer);

    this.updateState({
      offers: choosedOffers,
    }, true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCancelButtonClickHandler(this._callback.cancelButtonClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._eventTypeChangeHandler);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);

    if (this._state.stateIsOffers) {
      this.getElement()
        .querySelectorAll('.event__offer-checkbox')
        .forEach((element) => element.addEventListener('change', this._addExtraOption));
    }
  }

  //данные в состояние
  static parseDataToState(newRoutePoint) {
    const eventType = newRoutePoint.type;
    const avaliableOffers = restructuredOffers[eventType];
    return Object.assign(
      {},
      newRoutePoint,
      {
        stateIsDateFrom: newRoutePoint.dateFrom !== null,
        stateIsDateTo: newRoutePoint.dateTo !== null,
        stateIsBasePrice: newRoutePoint.basePrice !== null,
        stateIsDestinationName: newRoutePoint.destination.name !== '',
        stateIsOffers: Boolean(avaliableOffers.length),
        stateIsDescription: Boolean(newRoutePoint.destination.description.length),
      },
    );
  }

  static parseStateToData(state) {
    state = Object.assign({}, state);

    if (!state.stateIsDestinationName) {
      Object.assign({}, state.destination,
        {
          name: '',
        });
    }

    if (!state.stateIsDateFrom) {
      state.dateFrom = null;
    }

    if (!state.stateIsDateTo) {
      state.dateTo = null;
    }

    if (!state.stateIsBasePrice) {
      state.basePrice = null;
    }

    if (!state.stateIsDescription) {
      Object.assign({}, state.destination,
        {
          description: '',
          pictures: [],
        });
    }

    delete state.stateIsDestinationName;
    delete state.stateIsDateFrom;
    delete state.stateIsDateTo;
    delete state.stateIsBasePrice;
    delete state.stateIsOffers;
    delete state.stateIsDescription;

    return state;
  }

}
