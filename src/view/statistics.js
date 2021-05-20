import Smart from './smart';
import {makeItemsUniq} from '../utils/general';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getCostsByType, getTypesByUsageCount} from '../utils/statistics';

const renderMoneyChart = (moneyCtx, routePoints, uniqTypes) => {
  const costsByType = getCostsByType(uniqTypes, routePoints)
    .sort((a, b) => b.total - a.total);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: costsByType.map((cost) => cost.type.toUpperCase()),
      datasets: [{
        data: costsByType.map((cost) => cost.total),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',

        categoryPercentage: .8,
        barPercentage: 1,

        minBarLength: 50,
        minBarThickness: 44,
      }],
    },
    options: {
      indexAxis: 'y',
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, routePoints, uniqTypes) => {

  const typesByUsageCount = getTypesByUsageCount(uniqTypes, routePoints)
    .sort((a, b) => b.count - a.count);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typesByUsageCount.map((type) => type.type.toUpperCase()),
      datasets: [{
        data: typesByUsageCount.map((type) => type.count),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',

        categoryPercentage: .8,
        barPercentage: 1,

        minBarThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      indexAxis: 'y',
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

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
