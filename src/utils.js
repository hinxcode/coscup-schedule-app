import config from '../config';
import * as cst from './constants';

// get date time diff in minutes
export const getDateDiff = (start, end) => (end.getTime() - start.getTime()) / 1000 / 60;
export const getWidthByTime = minutes => minutes * cst.HOUR_WIDTH / 60;

export const getScheduleData = async () => {
  try {
    const response = await fetch(config.url);
    const json = await response.json();
    const result = {};

    for (let i = 0; i < json.length; i++) {
      const date = new Date(json[i].start).getDate();

      if (!result[date]) {
        result[date] = {};
      }
      if (!result[date][json[i].room]) {
        result[date][json[i].room] = [];
      }
      result[date][json[i].room].push(json[i]);
    }

    for (let date of Object.keys(result)) {
      for (let room of Object.keys(result[date])) {
        result[date][room].sort((a, b) => {
          return new Date(a.start).getTime() - new Date(b.start).getTime();
        })
      }
    }

    return result;
  } catch(e) {
    console.log('Error: ', err);
  }
}
