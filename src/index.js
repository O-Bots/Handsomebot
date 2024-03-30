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

const axios = require('axios');

const grantType = 'client_credentials';
const scope = "";
const tokenEndpoint = "https://id.twitch.tv/oauth2/token"
const clipsEndpoint = "https://api.twitch.tv/helix/clips"
const channelEndpoint = "https://api.twitch.tv/helix/channels"
const userEndpoint = "https://api.twitch.tv/helix/users"

bot.on('ready', async (bot) => {

    // let gameName = ""
    // await currentGame().then(res => gameName = res)
        
            
    // if (await checkForGame(gameName) === false) {
    //     addGame(gameName);
        
    // } else {
    //     console.log("The game already exists");
    // }

});

const tmi = require('tmi.js');
const { currentGame } = require('./Utility/twitch');
const {checkForGame, addGame} = require('./Utility/googleSheets')

bot.on('ready', async (bot) => {
    
    try {
        const prefix ="!"

        const twitchBot = new tmi.Client({
            options: { debug: false },
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: process.env.TWITCH_BOT_USERNAME,
                password: process.env.TWITCH_BOT_OAUTH_TOKEN
            },
            channels: [process.env.TWITCH_USERNAME]
        });
        
        twitchBot.connect();

        twitchBot.on('message',  async (channel, tags, message, self) => {
            if(self || !message.startsWith('!')) return;
            
            const messageArr = message.slice(1).split(' ');

            const [command, ...gameInfo] = messageArr
            
            const gameName = gameInfo.join().replace(/,/g, " ");
        
            if ((await checkForGame(gameName) === false) && (command == "Finished")) {
                addGame(gameName);
                
                twitchBot.say(channel, `@${tags.username}, ${gameName} has been added to the list of completed games!`);
                return;
            }
            else{
                twitchBot.say(channel, `@${tags.username}, ${gameName} is already in the list, did you enter the correct name?`);
                return;
            };
        });
        
    } catch (error) {
        console.error(error);
        return null;
    };
});

eventHandler(bot);

bot.login(process.env.DISCORD_BOT_TOKEN);