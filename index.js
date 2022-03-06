const discord = require('discord.js')
const fs = require('fs')
const config = require('./config')
const slash_load = require('./modules/slash-create')
const statcheck = require('./modules/status-check')
const updatecheck = require('./modules/update-checker')

process.on('uncaughtException', (error) => { console.log(error) });

const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_MESSAGES]});

client.logger = require('./modules/logger')
client.commands = new discord.Collection();
client.config = config

client.on("ready", () => {
    client.logger.success("Bot is ready!")
    slash_load(client)
    statcheck(client)
    updatecheck(client)

    const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of events) {
        client.logger.cmds(`Loading discord.js event ${file}`);
        const event = require(`./events/${file}`);
        client.on(file.split(".")[0], event.bind(null, client));
    }
});

client.login(config.discord.token)

