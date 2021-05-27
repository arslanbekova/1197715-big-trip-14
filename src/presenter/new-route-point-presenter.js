import NewRoutePoint from '../view/new-route-point';
import {remove, render} from '../utils/render';
import {UserAction, UpdateType, RenderPosition} from '../utils/const';
import {isEscEvent} from '../utils/general';

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

  setDisable() {
    this._newEventButton.setAttribute('disabled', 'disabled');
  }

  setActive() {
    this._newEventButton.removeAttribute('disabled');
  }

  setSaving() {
    this._newRoutePointComponent.updateState({
      stateIsDisabled: true,
      stateIsSaving: true,
      stateIsSaveButtonDisabled: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._newRoutePointComponent.updateState({
        stateIsDisabled: false,
        stateIsSaving: false,
        stateIsDeleting: false,
        stateIsSaveButtonDisabled: false,
      });
    };

    this._newRoutePointComponent.shake(resetFormState);
  }

  _handleNewRoutePointSubmit(newRoutePoint) {
    this._changeData(
      UserAction.ADD_ROUTE_POINT,
      UpdateType.MAJOR,
      newRoutePoint,
    );
  }

  _handleNewRoutePointCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
