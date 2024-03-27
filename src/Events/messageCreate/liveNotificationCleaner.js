const {streamNotification} = require('./../../../config.json');

module.exports = async (bot, message) => {
    const dateToday = new Date();
    const weekOld = new Date(dateToday.setDate(dateToday.getDate() -7));
    
    const channel = await bot.channels.cache.get(streamNotification);
    
    if(!channel) return;
    
    const getMessages = await channel.messages.fetch();
    
    await getMessages.forEach(msg => {

        dateCreated = new Date(msg.createdTimestamp);

        if (dateCreated < weekOld) {            

            msg.delete();

        };
    });
};