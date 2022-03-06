import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Intents } from 'discord.js';
import { GClient } from 'gcommands';
import config from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = new GClient({
  dirs: [path.join(__dirname, 'commands'), path.join(__dirname, 'events')],
  devGuildId: config.discord.guildId,
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(config.discord.token);
