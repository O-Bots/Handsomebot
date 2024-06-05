const axios = require('axios');

const grantType = 'client_credentials';
const scope = "";
const tokenEndpoint = "https://id.twitch.tv/oauth2/token"
const clipsEndpoint = "https://api.twitch.tv/helix/clips"
const channelEndpoint = "https://api.twitch.tv/helix/channels"
const userEndpoint = "https://api.twitch.tv/helix/users"
const streamsEndpoint = "https://api.twitch.tv/helix/streams"

module.exports = {
    currentGame: async () => {
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
            
            const gameName = channelResponse.data.data[0].game_name;

            return gameName;
            
        } catch (error) {
            console.error(error);
            return null;
        };
    },
    isLive: async () => {
        try {

            //Post request to get Twitch Api access token
            const tokenResponse = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_BOT_ID}&client_secret=${process.env.TWITCH_BOT_SECRET}&grant_type=${grantType}&scope=${scope}`);
    
            //Filtered data to only show access token
            const accessToken = tokenResponse.data.access_token;
            
            //Template for generic header use
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': process.env.TWITCH_BOT_ID
            };
            
            const userResponse = await axios.get(userEndpoint, {
                params: {
                    login: process.env.TWITCH_USERNAME,
                },
                headers: headers,
            });

            const streamsResponse = await axios.get(streamsEndpoint, {
                params: {
                    user_login: process.env.TWITCH_USERNAME,
                },
                headers: headers,
            });
            
            if (streamsResponse.data.data.length === 0) return [];

            const channelInfo = {
                user_name: streamsResponse.data.data[0].user_name,
                stream_title: streamsResponse.data.data[0].title,
                game_name: streamsResponse.data.data[0].game_name,
                status: streamsResponse.data.data[0].type,
                stream_thumbnail: streamsResponse.data.data[0].thumbnail_url,
                profile_thumbnail: userResponse.data.data[0].profile_image_url,
            }
    
            return channelInfo;
            
        } catch (error) {
            console.error(error);
            return null;
        };
    },
};