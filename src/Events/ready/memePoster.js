const {memeServer} = require('./../../../config.json');
const redditService = require('reddit');

const reddit = new redditService({
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    appId: process.env.REDDIT_APP_ID,
    appSecret: process.env.REDDIT_APP_SECRET,
});
module.exports = async (bot, message) => {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() -1));

    const channel = await bot.channels.cache.get(memeServer);
    
    if(!channel) return;
    
    const getMessages = await channel.messages.fetch({limit: 1});
    
    await getMessages.forEach(msg => {
        lastMsgContent = msg.content;
        dateCreated = new Date(msg.createdTimestamp);

        if (dateCreated < yesterday) {      
            postMemes();
        };
    });
    

    async function postMemes() {
        const info = await reddit.get("/r/wholesomememes/hot", params = {
            "limit": 1,
            "count": 1
        });
        await info.data.children.forEach(post => {
            postUrl = post.data.url,
            postHint = post.data.post_hint

            if ((postHint !== undefined) && (lastMsgContent !== postUrl)) {
                channel.send(postUrl)
            };
        });
    };
};