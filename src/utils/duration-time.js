import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const calculateDurationTime = (startTime, endTime) => {
  return dayjs.duration(dayjs(endTime).diff(dayjs(startTime)));
};


export const formatEventDuration = (eventDuration) => {

  const DurationBreakpoint = {
    LESS_HOUR: 1,
    MORE_DAY: 24,
  };
  let formattedEventDuration;
  switch (true) {
    case eventDuration.as('hours') < DurationBreakpoint.LESS_HOUR:
      formattedEventDuration = eventDuration.format('mm[M]');
      break;
    case eventDuration.as('hours') > DurationBreakpoint.LESS_HOUR && eventDuration.as('hours') < DurationBreakpoint.MORE_DAY:
      formattedEventDuration = eventDuration.format('HH[H] mm[M]');
      break;
    case eventDuration.as('hours') > DurationBreakpoint.MORE_DAY:
      formattedEventDuration = eventDuration.format('DD[D] HH[H] mm[M]');
      break;
    default:
      formattedEventDuration = eventDuration.format('HH[H]');
  }

  return formattedEventDuration;
};
