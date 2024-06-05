const {discordStreamServer} = require('./../../../config.json');

module.exports = async (bot) => {
    setInterval(async () => {
        const dateToday = new Date();
        const weekOld = new Date(dateToday.setDate(dateToday.getDate() -7));
        
        const channel = await bot.channels.cache.get(discordStreamServer);
        
        if(!channel) return;
        
        const getMessages = await channel.messages.fetch();
        
        await getMessages.forEach(msg => {
    
            dateCreated = new Date(msg.createdTimestamp);
    
            if (dateCreated < weekOld) {            
    
                msg.delete();
    
            };
        });
    }, 300000);
};