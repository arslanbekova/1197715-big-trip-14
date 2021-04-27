import RoutePoint from '../view/route-point';
import EditRoutePoint from '../view/edit-route-point';
import {render, replace, remove} from '../utils/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class RoutePointPresenter {
  constructor(eventsList, addToFavorites, changeMode) {
    this._eventsList = eventsList;
    this._addToFavorites = addToFavorites;
    this._changeMode = changeMode;

    this._routePointComponent = null;
    this._editRoutePointComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleRoutePointArrowClick = this._handleRoutePointArrowClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleEditFormArrowClick = this._handleEditFormArrowClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(routePoint) {
    this._routePoint = routePoint;

    const prevRoutePointComponent = this._routePointComponent;
    const prevEditRoutePointComponent = this._editRoutePointComponent;

    this._routePointComponent = new RoutePoint(routePoint);
    this._editRoutePointComponent = new EditRoutePoint(routePoint);

    this._routePointComponent.setArrowClickHandler(this._handleRoutePointArrowClick);
    this._routePointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editRoutePointComponent.setArrowClickHandler(this._handleEditFormArrowClick);
    this._editRoutePointComponent.setFormSubmitHandler(this._handleEditFormSubmit);

    if (prevRoutePointComponent === null || prevEditRoutePointComponent === null) {
      render(this._eventsList, this._routePointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._routePointComponent, prevRoutePointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._editRoutePointComponent, prevEditRoutePointComponent);
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

  _openEditRoutePointForm() {
    replace(this._editRoutePointComponent, this._routePointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _closeEditRoutePointForm() {
    replace(this._routePointComponent, this._editRoutePointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeEditRoutePointForm();
    }
  }

  _handleRoutePointArrowClick() {
    this._openEditRoutePointForm();
  }

  _handleEditFormArrowClick() {
    this._closeEditRoutePointForm();
  }

  _handleEditFormSubmit() {
    this._closeEditRoutePointForm();
  }

  _handleFavoriteClick() {
    this._addToFavorites(
      Object.assign(
        {},
        this._routePoint,
        {
          isFavorite: !this._routePoint.isFavorite,
        },
      ),
    );
  }
}
