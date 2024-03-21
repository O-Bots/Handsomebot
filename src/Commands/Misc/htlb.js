const howLongToBeat = require('./../../Utility/howLongToBeat');
const {ApplicationCommandOptionType, GuildTextThreadManager} = require('discord.js');

module.exports = {
    //deleted: Boolean,
    name: 'hltb',
    description: 'checks how long it takes to beat the game requested!',
    devOnly: true,
    // testOnly: Boolean,
    options: [{
        name: 'game',
        description: 'name of the game you are trying to look up.',
        type: ApplicationCommandOptionType.String,
    },
    ],
    callback: async (bot, interaction) => {
        const message = interaction.options.data[0].value;
        const interactionReplyMsg = await interaction.reply({ content: 'Check the thread!', fetchReply: true });
        const thread = await interactionReplyMsg.startThread({
            name: `Completion times for ${message}`,
            autoArchiveDuration: 60,
            reason: 'Shits n Giggs',
        });

        await thread.join();
        
        thread.send(`Completion times for the game ${message}\n ${await howLongToBeat(message)}`);
    },
};