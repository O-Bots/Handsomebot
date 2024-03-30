const {clipsServer} = require('./../../../config.json');
const axios = require('axios');

module.exports = async (bot) => {
    try {
        const grantType = 'client_credentials';
        const scope = "";
        const clipsEndpoint = "https://api.twitch.tv/helix/clips"
        const userEndpoint = "https://api.twitch.tv/helix/users"
        
        const today = new Date()
        const tempToday = new Date()
        const yesterday = new Date(tempToday.setDate(tempToday.getDate() -1))

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
        
        const clipsResponse = await axios.get(clipsEndpoint, {
            params: {
                broadcaster_id: userId,
                first: 5,
                started_at: yesterday,
                ended_at: today
            },
            headers: headers,
        });
        const clipsData = clipsResponse.data.data
        
        let clipArr = [];

        await clipsData.forEach((clip) => {
            Name = clip.title
            Created = clip.created_at
            Url = clip.url
            Id = clip.id

            clipArr.push({Id, Name, Created, Url})
        })
        
        
        const channel = await bot.channels.cache.get(clipsServer);
        const getMessages = await channel.messages.fetch({limit: 10});
        
        let msgArr = [];
        await getMessages.forEach(msg => {
            msgContent = msg.content;
            msgArr.push(msgContent)
        });

        for (let i = 0; i < clipArr.length; i++) {
            const clip = clipArr[i];
            if (!msgArr.includes(clip.Url)) {
                channel.send(clip.Url)
            }
        }

    } catch (error) {
        console.error(error);
        return null;
    }
};