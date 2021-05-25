import Abstract from './abstract';

const getTotalCosts = (routePoints) => {
  let totalCosts = 0;
  for (const routePoint of routePoints) {
    totalCosts += routePoint.basePrice;
    routePoint.offers.forEach((offer) => totalCosts += offer.price);
  }
  return totalCosts.toLocaleString('eng');
};

const createCostInfoTemplate = (routePoints) => {
  const totalCosts = getTotalCosts(routePoints);
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCosts}</span>
  </p>`;
};

export default class CostInfo extends Abstract {
  constructor(routePoints) {
    super();
    this._routePoints = routePoints;
  }

  getTemplate() {
    return createCostInfoTemplate(this._routePoints);
  }
}
