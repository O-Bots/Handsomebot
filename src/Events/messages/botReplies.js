module.exports = (bot, message) => {

    const replies = [
        {
            msg: "mansam",
            msgReply: "What? Did you call me Handsome?!!",
        },
        {
            msg: "throw",
            msgReply: "Josh never threw! FACTS",
        },
        {
            msg: "multi",
            msgReply: ["one", "two", "three"],
        },
    ];
    for(const reply of replies) {        
        if(!message.author.bot && message.content === reply.msg) {
            if(reply.msgReply.length > 1) {
                rngReply = Math.floor(Math.random()* reply.msgReply.length);
                message.reply({
                    content: rngReply
                });
                return;
            }
            message.reply({
                content: reply.msgReply
            });
        };
    }
};