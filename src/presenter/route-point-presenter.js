import RoutePoint from '../view/route-point';
import EditRoutePoint from '../view/edit-route-point';
import {render, replace, remove} from '../utils/render';
import {UserAction, UpdateType} from '../utils/const';
import {isEscEvent} from '../utils/general';
import dayjs from 'dayjs';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ABORTING: 'ABORTING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
};
export default class RoutePointPresenter {
  constructor(eventsList, changeData, changeMode, destinationsModel, offersModel) {
    this._eventsList = eventsList;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._routePointComponent = null;
    this._editRoutePointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleRoutePointArrowClick = this._handleRoutePointArrowClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditFormArrowClick = this._handleEditFormArrowClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(routePoint) {
    this._routePoint = routePoint;

    const prevRoutePointComponent = this._routePointComponent;
    const prevEditRoutePointComponent = this._editRoutePointComponent;

    this._routePointComponent = new RoutePoint(routePoint);
    this._editRoutePointComponent = new EditRoutePoint(routePoint, this._destinationsModel, this._offersModel);

    this._routePointComponent.setArrowClickHandler(this._handleRoutePointArrowClick);
    this._routePointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editRoutePointComponent.setArrowClickHandler(this._handleEditFormArrowClick);
    this._editRoutePointComponent.setFormSubmitHandler(this._handleEditFormSubmit);
    this._editRoutePointComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevRoutePointComponent === null || prevEditRoutePointComponent === null) {
      render(this._eventsList, this._routePointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._routePointComponent, prevRoutePointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._routePointComponent, prevEditRoutePointComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevRoutePointComponent);
    remove(prevEditRoutePointComponent);
  }

  destroy() {
    remove(this._routePointComponent);
    remove(this._editRoutePointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeEditRoutePointForm();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._editRoutePointComponent.updateState({
        stateIsDisabled: false,
        stateIsSaving: false,
        stateIsDeleting: false,
      });
    };
    switch (state) {
      case State.SAVING:
        this._editRoutePointComponent.updateState({
          stateIsDisabled: true,
          stateIsSaving: true,
        });
        break;
      case State.DELETING:
        this._editRoutePointComponent.updateState({
          stateIsDisabled: true,
          stateIsDeleting: true,
        });
        break;
      case State.ABORTING:
        this._routePointComponent.shake(resetFormState);
        this._editRoutePointComponent.shake(resetFormState);
        break;
    }
  }

  _openEditRoutePointForm() {
    replace(this._editRoutePointComponent, this._routePointComponent);
    this._editRoutePointComponent.setDatepickers();
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _closeEditRoutePointForm() {
    this._editRoutePointComponent.resetState(this._routePoint);
    this._editRoutePointComponent.removeDatepickers();
    replace(this._routePointComponent, this._editRoutePointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _handleRoutePointArrowClick() {
    this._openEditRoutePointForm();
  }

  _handleEditFormArrowClick() {
    this._closeEditRoutePointForm();
  }

  _handleEditFormSubmit(update) {
    const isDatesEqual = (dateA, dateB) => {
      return dayjs(dateA).isSame(dateB);
    };

    const isMinorUpdate =
      !isDatesEqual(this._routePoint.dateFrom, update.dateFrom) ||
      !isDatesEqual(this._routePoint.dateTo, update.dateTo) ||
      this._routePoint.basePrice !== update.basePrice ||
      this._routePoint.offers.length !== update.offers.length ||
      this._routePoint.destination.name !== update.destination.name;

    this._changeData(
      UserAction.UPDATE_ROUTE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this._editRoutePointComponent.removeDatepickers();
  }

  _handleDeleteClick(routePoint) {
    this._changeData(
      UserAction.DELETE_ROUTE_POINT,
      UpdateType.MINOR,
      routePoint,
    );
    this._editRoutePointComponent.removeDatepickers();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_ROUTE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._routePoint,
        {
          isFavorite: !this._routePoint.isFavorite,
        },
      ),
    );
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._closeEditRoutePointForm();
    }
  }
}
