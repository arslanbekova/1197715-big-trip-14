import Smart from './smart';
import {makeItemsUniq} from '../utils/general';

const createStatisticsTemplate = () => {
  return `<section class="statistics statistics--hidden">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};
export default class Statistics extends Smart {
  constructor(routePoints) {
    super();

    this._routePoints = routePoints;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;

    const routePointTypes = this._routePoints.map((routePoint) => routePoint.type);
    const uniqTypes = makeItemsUniq(routePointTypes);

    this._moneyChart = renderMoneyChart(moneyCtx, this._routePoints, uniqTypes);
    this._typeChart = renderTypeChart(typeCtx, this._routePoints, uniqTypes);
    this._timeChart = renderTimeChart(timeCtx, this._routePoints, uniqTypes);
  }
}
