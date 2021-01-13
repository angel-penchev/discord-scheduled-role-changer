import {Client} from 'discord.js';
import config from './config';
import renameHandler from './handlers/renameHandler';

const client = new Client();
client.login(config.discordBotToken);

client.on('ready', () => console.log(`${client.user?.username} has started.`));

client.on('message', (message) => {
  if (message.author.bot) return;
  // if(!message.guild).hasPermission('MANAGE_ROLES')) return;

  // !bs rename - Schedules a role rename
  if (message.content.startsWith(config.discordCommandPrefix + ' rename')) {
    renameHandler(message);
  }
});
