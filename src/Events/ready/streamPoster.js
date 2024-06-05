const {discordStreamServer} = require('./../../../config.json');
const { EmbedBuilder } = require("discord.js");
const {isLive} = require('./../../Utility/twitchUtils')
module.exports = async (bot) => {
    const channel = await bot.channels.cache.get(discordStreamServer);

    setInterval(async () => {
        let lastMsgTitle = ""
        const streamInfo = await isLive();
    
        if (streamInfo.length === 0) return;
        const getLastMsg = await channel.messages.fetch({limit: 1});
    
        getLastMsg.forEach(msg => {
            lastMsgTitle = msg.embeds[0].data.fields[0].value
        })
    
        if (lastMsgTitle == streamInfo.stream_title) return;
    
        const embed = new EmbedBuilder()
        .setTitle(`${streamInfo.user_name} is live streaming ${streamInfo.game_name}`)
        .addFields(
            {name: 'Stream Title', value: streamInfo.stream_title}
        )
        .setColor("#6333a6")
        .setURL(`https://www.twitch.tv/${streamInfo.user_name}`)
        .setThumbnail(streamInfo.profile_thumbnail)
        
        channel.send({embeds: [embed]});
    }, 300000);
}