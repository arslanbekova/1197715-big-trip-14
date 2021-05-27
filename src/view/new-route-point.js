import Smart from './smart';
import dayjs from 'dayjs';
import he from 'he';
import _ from 'lodash';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
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
  isFavorite: false,
  offers: [],
  type: DEFAULT_EVENT_TYPE,
};

const createEventTypeTemplate = (eventTypes, stateIsDisabled) => {
  return eventTypes.map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
        value="${eventType}" ${stateIsDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${eventType}"
        data-event-type="${eventType}"
        for="event-type-${eventType}-1">${toUpperCaseFirstSymbol(eventType)}</label>
    </div>`,
  ).join('');
};

const createOfferTemplate = (eventType, isOffers, choosedOffers, avaliableOffers, stateIsDisabled) => {
  if (isOffers) {
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
          ${stateIsDisabled ? 'disabled' : ''}
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
  }
  return '';
};

const createEventDestinationTemplate = (avaliableDestinations) => {
  return Object.keys(avaliableDestinations).map((destination) =>
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
  }
  return '';
};

export const createNewRoutePointTemplate = (newRoutePoint, destinationsModel, offersModel) => {
  const {
    dateFrom,
    dateTo,
    type,
    destination,
    basePrice,
    offers,
    stateIsDateFrom,
    stateIsDateTo,
    stateIsBasePrice,
    stateIsDestinationName,
    stateIsDescription,
    stateIsOffers,
    stateIsDisabled,
    stateIsSaveButtonDisabled,
    stateIsSaving,
  } = newRoutePoint;
  const avaliableOffers = offersModel.get()[type];
  const avaliableDestinations = destinationsModel.get();
  const offersTemplate = createOfferTemplate(type, stateIsOffers, offers, avaliableOffers, stateIsDisabled);
  const eventTypesTemplate = createEventTypeTemplate(ROUTE_POINT_TYPES, stateIsDisabled);
  const eventDestinationsTemplate = createEventDestinationTemplate(avaliableDestinations);
  const eventDescriptionTemplate = createEventDescriptionTemplate(destination, stateIsDescription);

  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${stateIsDisabled ? 'disabled' : ''}>

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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
          value="${stateIsDestinationName ? he.encode(destination.name) : ''}" list="destination-list-1"
          ${stateIsDisabled ? 'disabled' : ''} required>
        <datalist id="destination-list-1">
          ${eventDestinationsTemplate}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
          value="${stateIsDateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : ''}"
          ${stateIsDisabled ? 'disabled' : ''} required>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
          value="${stateIsDateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}"
          ${stateIsDisabled ? 'disabled' : ''} required>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price"
          value="${stateIsBasePrice ? basePrice : ''}"
          ${stateIsDisabled ? 'disabled' : ''} required>
      </div>

      <button class="event__save-btn  btn  btn--blue" ${stateIsSaveButtonDisabled ? 'disabled' : ''} type="submit">${stateIsSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" ${stateIsDisabled ? 'disabled' : ''} type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${offersTemplate}
      ${eventDescriptionTemplate}
    </section>
  </form>`;
};

export default class NewRoutePoint extends Smart {
  constructor(destinationsModel, offersModel) {
    super();
    this._state = NewRoutePoint.parseDataToState(INITIAL_STATE, offersModel);
    this._currentEventType = this._state.type;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._cancelButtonClickHandler = this._cancelButtonClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._basePriceChangeHandler = this._basePriceChangeHandler.bind(this);
    this._extraOptionChangeHandler = this._extraOptionChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createNewRoutePointTemplate(this._state, this._destinationsModel, this._offersModel);
  }

  setDatepickers() {
    if (this._dateFromPicker || this._dateToPicker) {
      this.removeDatepickers();
    }
    this._setDateFromPicker();
    this._setDateToPicker();
  }

  removeDatepickers() {
    this._dateFromPicker.destroy();
    this._dateToPicker.destroy();
    this._dateFromPicker = null;
    this._dateToPicker = null;
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  setCancelButtonClickHandler(callback) {
    this._callback.cancelButtonClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._cancelButtonClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCancelButtonClickHandler(this._callback.cancelButtonClick);
  }

  _isFormValid() {
    if (this._state.destination.name !== ''
      && this._state.dateFrom
        && this._state.dateTo
          && this._state.basePrice) {
      this.updateState({
        stateIsSaveButtonDisabled: false,
      });
      return;
    }
    this.updateState({
      stateIsSaveButtonDisabled: true,
    });
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._eventTypeChangeHandler);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationChangeHandler);

    ['change', 'paste'].forEach((evt) =>
      this.getElement()
        .querySelector('.event__input--destination').addEventListener(evt, this._destinationChangeHandler, false),
    );

    if (this._state.stateIsOffers) {
      this.getElement()
        .querySelectorAll('.event__offer-checkbox')
        .forEach((element) => element.addEventListener('change', this._extraOptionChangeHandler));
    }

    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._basePriceChangeHandler);
  }

  _setDateToPicker() {
    this._dateToPicker = flatpickr(this.getElement().querySelector('#event-end-time-1'), {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      'time_24hr': true,
      defaultDate: null,
      minDate: this._state.dateFrom,
      onChange: this._dateToChangeHandler,
    });
  }

  _setDateFromPicker() {
    this._dateFromPicker = flatpickr(this.getElement().querySelector('#event-start-time-1'), {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      'time_24hr': true,
      defaultDate: null,
      onChange: this._dateFromChangeHandler,
    });
  }

  _removeEqualOption(choosedOffer, choosedOffers) {
    const equalOffer = choosedOffers.find((element) => _.isEqual(element, choosedOffer));
    removeArrayElement(equalOffer, choosedOffers);
    this.updateState({
      offers: choosedOffers,
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(NewRoutePoint.parseStateToData(this._state));
  }

  _cancelButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelButtonClick();
  }

  _eventTypeChangeHandler(evt) {
    if (evt.target.hasAttribute('data-event-type')) {
      const newEventType = evt.target.dataset.eventType;

      if (this._currentEventType === newEventType) {
        return;
      }

      this._currentEventType = newEventType;
      const avaliableOffers = this._offersModel.get()[newEventType];

      this.updateState({
        type: newEventType,
        offers: [],
        stateIsOffers: Boolean(avaliableOffers.length),
      });
      this._isFormValid();
    }
  }

  _destinationChangeHandler(evt) {
    const destinationNameElement = evt.target;
    const destinationName = destinationNameElement.value;
    const selectedOption = document.querySelector('option[value="' + destinationName + '"]');

    if (selectedOption !== null) {
      const newDestination = this._destinationsModel.get()[destinationName];
      this.updateState({
        destination: {
          name: destinationName,
          description: newDestination.description,
          pictures: newDestination.pictures,
        },
        stateIsDescription: Boolean(newDestination.description.length),
        stateIsDestinationName: true,
      });
    } else {
      this.updateState({
        destination: {
          name: '',
          description: '',
          pictures: [],
        },
        stateIsDescription: false,
        stateIsDestinationName: false,
      });
    }
    this._isFormValid();
  }

  _dateFromChangeHandler([userDate]) {
    this.updateState({
      dateFrom: userDate,
      stateIsDateFrom: true,
    }, true);

    this._setDateToPicker();
    this._isFormValid();
  }

  _dateToChangeHandler([userDate]) {
    this.updateState({
      dateTo: userDate,
      stateIsDateTo: true,
    }, true);
    this._isFormValid();
  }

  _basePriceChangeHandler(evt) {
    const basePrice = evt.target.value !== '' ? Number(evt.target.value) : null;
    this.updateState({
      basePrice,
      stateIsBasePrice: true,
    }, true);
    this._isFormValid();
  }

  _extraOptionChangeHandler(evt) {
    const offerTitle = evt.target.dataset.offerTitle;
    const offerPrice = Number(evt.target.dataset.offerPrice);
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

  static parseDataToState(newRoutePoint, offersModel) {
    const eventType = newRoutePoint.type;
    const avaliableOffers = offersModel.get()[eventType];
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
        stateIsDisabled: false,
        stateIsSaveButtonDisabled: true,
        stateIsSaving: false,
        stateIsDeleting: false,
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
    delete state.stateIsDisabled;
    delete state.stateIsSaveButtonDisabled;
    delete state.stateIsSaving;
    delete state.stateIsDeleting;

    return state;
  }

}
