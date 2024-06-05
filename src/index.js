require('dotenv').config();
const {Client, IntentsBitField } = require('discord.js');
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
const videosEndpoint = "https://api.twitch.tv/helix/videos"

bot.on('ready', async () => {
    try {

        //Post request to get Twitch Api access token
        const tokenResponse = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_BOT_ID}&client_secret=${process.env.TWITCH_BOT_SECRET}&grant_type=${grantType}&scope=${scope}`);

        //Filtered data to only show access token
        const accessToken = tokenResponse.data.access_token;
        
        //Template for generic header use
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Client-Id': process.env.TWITCH_BOT_ID
        }

        //Get request to the Twitch Api users' broadcaster Id
        const userResponse = await axios.get(userEndpoint, {
            params: {
                login: process.env.TWITCH_USERNAME,
            },
            headers: headers,
        });
        //Filtered data to only show the broadcaster
        const userId = userResponse.data.data[0].id
        
        const channelResponse = await axios.get(channelEndpoint, {
            params: {
                broadcaster_id: userId,
            },
            headers: headers,
        });
        
        const gameId = channelResponse.data.data[0].game_id;

        const videosResponse = await axios.get(videosEndpoint, {
            params: {
                game_id: gameId,
            },
            headers: headers,
        });

        // console.log(videosResponse.data.data);

        // return gameName;
        
    } catch (error) {
        console.error(error);
        return null;
    };
});

eventHandler(bot);

bot.login(process.env.DISCORD_BOT_TOKEN);