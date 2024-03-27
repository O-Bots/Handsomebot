require('dotenv').config();
const {Client, IntentsBitField, GuildChannel} = require('discord.js');
const eventHandler = require('./Handlers/eventHandler');

const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});


eventHandler(bot);

bot.login(process.env.DISCORD_BOT_TOKEN);