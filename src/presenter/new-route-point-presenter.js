import NewRoutePoint from '../view/new-route-point';
import {nanoid} from 'nanoid';
import {remove, render} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition} from '../utils/const.js';

export default class NewRoutePointPresenter {
  constructor(tripEventsList, changeData, destinationsModel, offersModel) {
    this._tripEventsList = tripEventsList;
    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._newRoutePointComponent = null;
    this._newEventButton = document.querySelector('.trip-main__event-add-btn');

    this._handleNewRoutePointSubmit = this._handleNewRoutePointSubmit.bind(this);
    this._handleNewRoutePointCancelClick = this._handleNewRoutePointCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._newRoutePointComponent !== null) {
      return;
    }

    this._newRoutePointComponent = new NewRoutePoint(this._destinationsModel, this._offersModel);
    this._newRoutePointComponent.setFormSubmitHandler(this._handleNewRoutePointSubmit);
    this._newRoutePointComponent.setCancelButtonClickHandler(this._handleNewRoutePointCancelClick);

    render(this._tripEventsList, this._newRoutePointComponent, RenderPosition.AFTERBEGIN);
    this._newRoutePointComponent.setDatepickers();

    this.setDisable();

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  setDisable() {
    this._newEventButton.setAttribute('disabled', 'disabled');
  }

  setActive() {
    this._newEventButton.removeAttribute('disabled');
  }

  destroy() {
    if (this._newRoutePointComponent === null) {
      return;
    }
    this._newRoutePointComponent.removeDatepickers();
    remove(this._newRoutePointComponent);
    this._newRoutePointComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
    this.setActive();
  }

  _handleNewRoutePointSubmit(newRoutePoint) {
    this._changeData(
      UserAction.ADD_ROUTE_POINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, newRoutePoint),
    );
    this.destroy();
  }

  _handleNewRoutePointCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
