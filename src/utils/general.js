import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * Math.floor(array.length))];
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateDate = (date = undefined) => {
  dayjs.extend(duration);
  const gap = 7;
  const daysGap = getRandomInt(gap);
  const hoursGap = getRandomInt(gap);
  const minutesGap = getRandomInt(gap);

  return dayjs(date).add(dayjs.duration({days: daysGap, hours: hoursGap, minutes: minutesGap})).toDate().toISOString();
};

export {getRandomElement, shuffle, getRandomInt, generateDate};
