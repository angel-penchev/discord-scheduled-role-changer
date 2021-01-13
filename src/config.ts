import dotenv from 'dotenv';

dotenv.config();

const config = Object.freeze({
  discordBotToken: String(process.env.DISCORD_BOT_TOKEN),
  discordCommandPrefix: String(process.env.DISCORD_COMMAND_PREFIX),
});

export default config;
