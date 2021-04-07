import {getRandomElement, getRandomInt, shuffle} from '../utils/general';
import {MaxCount, DESTINATIONS} from '../utils/const';

const PICTURE_DESCRIPTIONS = [
  'Chamonix parliament buildin',
  'Rome Trevi fountain',
  'Amsterdam canal view',
  'Geneva st.Peter`s basilica',
  'Lisbon Jerónimos Monastery',
];

const generateDestinationDescription = () => {
  const destinationDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';
  const destinationDescriptionInStrings = destinationDescription.split('.');

  return shuffle(destinationDescriptionInStrings).slice(0, getRandomInt(MaxCount.DESTINATION_DESCRIPTION_SENTENCES)).join('. ');
};

export const generateDestinations = () => {
  return DESTINATIONS.map((value) => {
    return {
      description: generateDestinationDescription(),
      name: value,
      pictures: Array(getRandomInt(MaxCount.DESTINATION_PICTURES)).fill('picture').map(() => {
        return {
          src: 'http://picsum.photos/248/152?r=' + `${getRandomInt(MaxCount.DESTINATION_PICTURES)}`,
          description: getRandomElement(PICTURE_DESCRIPTIONS),
        };
      }),
    };
  });
};

export const restructuredDestinations = generateDestinations().reduce((result, item) => {
  const {name, description, pictures} = item;
  return {...result, [name]: {...(result[name] || {}), description, pictures}};
}, {});
