import {Message} from 'discord.js';
import {scheduleJob} from 'node-schedule';

/**
 * Schedules a role rename.
 *
 * @export
 * @param {Message} message
 * @param {string} roleOriginalName
 * @param {string} roleNewName
 * @param {string} date
 * @param {string} [period]
 */
export default function scheduleRename(
    message: Message,
    roleOriginalName: string,
    roleNewName: string,
    date: Date,
    period?: string,
) {
  let rule: string = '';
  switch (period) {
    case 'day':
      rule = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ` +
             `* * *`; // Once a day
      break;
    case 'month':
      rule = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ` +
             `${date.getDate()} * *`; // Once a month
      break;
    case 'year':
      rule = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ` +
             `${date.getDate()} ${date.getMonth() + 1} *`; // Once a month
      break;
    default:
      rule = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ` +
             `${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear}`;
  }

  scheduleJob(rule, function() {
    console.log('ToDo: Do sth productive here.');
  });
};
