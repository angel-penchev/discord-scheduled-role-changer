import {Client} from 'discord.js';
import config from './config';
import scheduleRename from './events/scheduleRename';

const client = new Client();
client.login(config.discordBotToken);

client.on('ready', () => console.log(`${client.user?.username} has started.`));

client.on('message', (message) => {
  if (message.author.bot) return;

  // !bs rename - Schedules a role rename
  if (message.content.startsWith(config.discordCommandPrefix + ' rename')) {
    const parameters = String(message)
        .replace(config.discordCommandPrefix + ' rename ', '')
        .split(/\b(?:to|on|every|once)+\b/i)
        .map((param) => param.trim())
        .filter((param) => param != '');

    // Wrong amount of parameters
    if (parameters.length !== 3 && parameters.length !== 4) {
      message.channel.send(`Hmmm... Are you sure you got the command ` +
                                 `right? The format should be \`!bs rename ` +
                                 `<Role1> to <Role2> on <Date> {once | ` +
                                 `every {day, week, year}}\`.`);
      return -1;
    }
    // Non-existent role check
    if (!message.guild?.roles.cache.some(
        (role) => role.name === parameters[0],
    )) {
      message.channel.send(`Hmmm... I don't seem to find a role named ` +
                                 `'${parameters[0]}'... Are you sure you ` +
                                 `got all right? :thinking:`);
      return -1;
    }

    // Date validation
    if (Number.isNaN(Date.parse(parameters[2]))) {
      message.channel.send(`Hmmm... That date you've send doesn't ` +
                                 `seem right. Are you sure that ` +
                                 `'${parameters[2]}' is a date? :thinking:`);
      return -1;
    }

    // Schedule period validation
    if (parameters.length === 4 && !parameters[3].match(
        /^(day|week|year)$/,
    )) {
      message.channel.send(`Hmmm... You can't schedule every ` +
                                 `'${parameters[3]}'. It should be either ` +
                                 `\`day\`, \`week\` or \`year\`. :)`);
      return -1;
    }

    scheduleRename(
        message,
        parameters[0],
        parameters[1],
        new Date(parameters[2]),
        parameters[3],
    );

    // Success message
    if (parameters.length === 4) {
      message.channel.send(`Sure, I scheduled a rename for ` +
                                `\`${parameters[0]}\` to ` +
                                `\`${parameters[1]}\` for every ` +
                                `${parameters[3]} starting from ` +
                                `${parameters[2]}. :smile:`);
    } else {
      message.channel.send(`Sure, I scheduled a rename for ` +
                                `\`${parameters[0]}\` to ` +
                                `\`${parameters[1]}\` on the ` +
                                `${parameters[2]}. :smile:`);
    }
  }
});
