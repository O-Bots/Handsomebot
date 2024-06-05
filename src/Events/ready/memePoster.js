const {discordMemeServer} = require('./../../../config.json');
const redditArr = require('./../../Utility/commandArray')
const redditService = require('reddit');

const reddit = new redditService({
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    appId: process.env.REDDIT_APP_ID,
    appSecret: process.env.REDDIT_APP_SECRET,
});
module.exports = async (bot, message) => {
    
    setInterval(async () => {
        try {
            const today = new Date();
            const yesterday = new Date(today.setDate(today.getDate() -1));
        
            const channel = await bot.channels.cache.get(discordMemeServer);
            
            if(!channel) return;
            
            const getLastMsg = await channel.messages.fetch({limit: 1});
            
            await getLastMsg.forEach(msg => {
                dateCreated = new Date(msg.createdTimestamp);
        
                if (dateCreated < yesterday) {      
                    postMemes();
                };
            });
    
            async function postMemes() {
    
                const getMessages = await channel.messages.fetch({limit: 20});
                
                const randomSubreddit = Math.floor(Math.random()* redditArr.redditSubreddit.length);
                const randomFilter = Math.floor(Math.random()* redditArr.redditFilter.length);
    
                const info = await reddit.get(`/r/${redditArr.redditSubreddit[randomSubreddit]}/${redditArr.redditFilter[randomFilter]}`, params = {
                    "limit": 10,
                    "count": 1
                });
        
                let msgArr = [];
                await getMessages.forEach(msg => {
                    msgContent = msg.content;
                    msgArr.push(msgContent)
                });
        
                let postArr = [];
                await info.data.children.forEach(post => {
                    postUrl = post.data.url,
                    postHint = post.data.post_hint
                    postArr.push({url:postUrl,hint:postHint})
        
                });
                for (let i = 0; i < postArr.length; i++) {
                    const post = postArr[i]
                    if ((post.hint !== undefined) && (!msgArr.includes(post.url))) {
                        channel.send(post.url);
                    }
                };
            };
            
        } catch (error) {
            console.error(error);
        };
    }, 300000);
};