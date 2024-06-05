const replyArray = require("../../Utility/replyArray");
const secretReplyArray = require("../../Utility/secretReplyArray");
const {prefix} = require("../../../config.json")

module.exports = (bot, message) => {
    
    if (message.author.id === process.env.DISCORD_BOT_ID) return;

    for (let i = 0; i < secretReplyArray.length; i++) {
        const secret = secretReplyArray[i];
        if (message.content.includes(secret.msg)) {
            message.reply({
                content: secret.msgReply
            });
            return;
        }
    };
    for (let i = 0; i < replyArray.length; i++) {
        const reply = replyArray[i];
        
        if(message.content === prefix+reply.msg) {
            if(Array.isArray(reply.msgReply)) {
                
                rngReply = Math.floor(Math.random()* reply.msgReply.length);
                message.reply({
                    content: reply.msgReply[rngReply]
                });
                return;
                
            };
            
            message.reply({
                content: reply.msgReply
            });
            return;
        }
    };
};