import Abstract from './abstract';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" data-menu-item="table" href="#">Table</a>
    <a class="trip-tabs__btn" data-menu-item="stats" href="#">Stats</a>
  </nav>`;
};

export default class SiteMenu extends Abstract {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const activeClass = 'trip-tabs__btn--active';
    const prevActiveItem = this.getElement().querySelector(`.${activeClass}`);
    const newActiveItem = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    if (newActiveItem !== null) {
      prevActiveItem.classList.remove(activeClass);
      newActiveItem.classList.add(activeClass);
    }
  }
}
