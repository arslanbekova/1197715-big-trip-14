import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {RenderPosition} from './const';

export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * Math.floor(array.length))];
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateDate = (date = undefined) => {
  dayjs.extend(duration);
  const gap = 7;
  const daysGap = getRandomInt(gap);
  const hoursGap = getRandomInt(gap);
  const minutesGap = getRandomInt(gap);

  return dayjs(date).add(dayjs.duration({days: daysGap, hours: hoursGap, minutes: minutesGap})).toDate().toISOString();
};

export const toUpperCaseFirstSymbol = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const renderElement = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
