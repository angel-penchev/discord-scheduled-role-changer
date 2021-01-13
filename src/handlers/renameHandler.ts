import {Message} from 'discord.js';
import config from '../config';
import scheduleRename from '../events/scheduleRename';

/**
 * Handles "!bs rename" command.
 *
 * @export
 * @param {Message} message
 * @return {*}
 */
export default function renameHandler(
    message: Message,
): Promise<Message> {
  const parameters = String(message)
      .replace(config.discordCommandPrefix + ' rename ', '')
      .split(/\b(?:to|on|every|once)+\b/i)
      .map((param) => param.trim())
      .filter((param) => param != '');

  // Wrong amount of parameters
  if (parameters.length !== 3 && parameters.length !== 4) {
    return message.channel.send(`Hmmm... Are you sure you got the command ` +
                                 `right? The format should be \`!bs rename ` +
                                 `<Role1> to <Role2> on <Date> {once | ` +
                                 `every {day, week, year}}\`.`);
  }
  // Non-existent role check
  if (!message.guild?.roles.cache.some(
      (role) => role.name === parameters[0],
  )) {
    return message.channel.send(`Hmmm... I don't seem to find a role named ` +
                                 `'${parameters[0]}'... Are you sure you ` +
                                 `got all right? :thinking:`);
  }

  // Date validation
  if (Number.isNaN(Date.parse(parameters[2]))) {
    return message.channel.send(`Hmmm... That date you've send doesn't ` +
                                 `seem right. Are you sure that ` +
                                 `'${parameters[2]}' is a date? :thinking:`);
  }

  // Schedule period validation
  if (parameters.length === 4 && !parameters[3].match(
      /^(day|week|year)$/,
  )) {
    return message.channel.send(`Hmmm... You can't schedule every ` +
                                 `'${parameters[3]}'. It should be either ` +
                                 `\`day\`, \`week\` or \`year\`. :)`);
  }

  // Scheduling the rename
  try {
    scheduleRename(
        message,
        parameters[0],
        parameters[1],
        new Date(parameters[2]),
        parameters[3],
    );
  } catch (e) {
    return message.channel.send(e.message);
  }

  // Success message
  if (parameters.length === 4) {
    return message.channel.send(`Sure, I scheduled a rename for ` +
                                `\`${parameters[0]}\` to ` +
                                `\`${parameters[1]}\` for every ` +
                                `${parameters[3]} starting from ` +
                                `${parameters[2]}. :smile:`);
  } else {
    return message.channel.send(`Sure, I scheduled a rename for ` +
                                `\`${parameters[0]}\` to ` +
                                `\`${parameters[1]}\` on the ` +
                                `${parameters[2]}. :smile:`);
  }
}
