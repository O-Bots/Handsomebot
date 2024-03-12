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

    if (message.author.id !== process.env.CLIENT_ID) {
        for (let i = 0; i < replies.length; i++) {
            const reply = replies[i];

            if(message.content === reply.msg) {
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