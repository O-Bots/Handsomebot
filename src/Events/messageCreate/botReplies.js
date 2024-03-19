const replyArray = require("../../Utility/replyArray");
const prefix = "!"
module.exports = (bot, message) => {

    if (message.author.id !== process.env.CLIENT_ID) {
        for (let i = 0; i < replyArray.length; i++) {
            const reply = replyArray[i];

            if(message.content === prefix+reply.msg) {

                if(Array.isArray(reply.msgReply)) {

                    rngReply = Math.floor(Math.random()* reply.msgReply.length);
                    message.reply({
                        content: reply.msgReply[rngReply]
                    });
                    return;

                }else{

                    message.reply({
                        content: reply.msgReply
                    });
                };
            };
        };
    };
};