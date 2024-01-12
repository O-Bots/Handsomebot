module.exports = {
    name: 'ping',
    description: 'Pong!',
    // devOnly: Boolean,
    testOnly: true,
    // options: Object[],
    // deleted: Boolean,

    callback: (bot, interaction) => {
        interaction.reply(`Pong! ${bot.ws.ping}ms`);
    },
};