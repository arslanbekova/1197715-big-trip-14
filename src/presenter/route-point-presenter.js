import RoutePoint from '../view/route-point';
import EditRoutePoint from '../view/edit-route-point';
import {render, replace} from '../utils/render';

export default class RoutePointPresenter {
  constructor(eventsList) {
    this._eventsList = eventsList;

    this._routePointComponent = null;
    this._editRoutePointComponent = null;

    this._handleRoutePointArrowClick = this._handleRoutePointArrowClick.bind(this);
    this._handleEditFormArrowClick = this._handleEditFormArrowClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(routePoint) {
    this._routePoint = routePoint;

    this._routePointComponent = new RoutePoint(routePoint);
    this._editRoutePointComponent = new EditRoutePoint(routePoint);

    this._routePointComponent.setArrowClickHandler(this._handleRoutePointArrowClick);
    this._editRoutePointComponent.setArrowClickHandler(this._handleEditFormArrowClick);
    this._editRoutePointComponent.setFormSubmitHandler(this._handleEditFormSubmit);

    render(this._eventsList, this._routePointComponent);
  }

  _openEditRoutePointForm() {
    replace(this._editRoutePointComponent, this._routePointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _closeEditRoutePointForm() {
    replace(this._routePointComponent, this._editRoutePointComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
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
}
