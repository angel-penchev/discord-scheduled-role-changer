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
  let rule: object = {
    second: date.getSeconds(),
    minute: date.getMinutes(),
    hour: date.getHours(),
  };

  switch (period) {
    case 'day':
      break;
    case 'month':
      rule = {...rule, ...{
        'date': date.getDate()}}; // Once a month
      break;
    case 'year':
      rule = {
        ...rule,
        ...{'date': date.getDate(), 'month': date.getMonth()},
      }; // Once a year
      break;
    default:
      rule = {
        ...rule,
        ...{
          'date': date.getDate(),
          'month': date.getMonth(),
          'fullYear': date.getFullYear(),
        },
      }; // Once
  }

  const job = scheduleJob(rule, function(savedMessage: Message) {
    const role = savedMessage.guild?.roles.cache.find(
        (role) => role.name === roleOriginalName,
    );

    role?.edit({name: roleNewName})
        .then(() => {
          savedMessage.channel.send(`Renamed role \`${roleOriginalName}\`` +
                                    ` to \`${roleNewName}\` successfully! ` +
                                    `:smile:`);
        })
        .catch(() => {
          savedMessage.channel.send(`Something went wrong! Failed to ` +
                                    `rename role \`${roleOriginalName}\` ` +
                                    `to \`${roleNewName}\`. :cry:`);
        });
  }.bind(null, message));

  if (!job) {
    throw new Error('Failed scheduling task.');
  }
}
