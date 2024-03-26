require('dotenv').config();
const {Client, IntentsBitField, GuildChannel} = require('discord.js');
const eventHandler = require('./Handlers/eventHandler');

const redditService = require('reddit');

const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const reddit = new redditService({
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    appId: process.env.REDDIT_APP_ID,
    appSecret: process.env.REDDIT_APP_SECRET,
});

bot.on('ready', async (bot) => {

    const info = await reddit.get("/r/wholesomememes/hot");

    console.log(info);
});

eventHandler(bot);

bot.login(process.env.DISCORD_BOT_TOKEN);