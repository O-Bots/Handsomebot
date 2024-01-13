const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');
module.exports = {
    //deleted: Boolean,
    name: 'ban',
    description: 'Bans a member from the server.',
    devOnly: true,
    // testOnly: Boolean,
    options: [{
        name: 'target-user',
        description: 'The user to ban.',
        required: true,
        type: ApplicationCommandOptionType.Mentionable,
    },
    {
        name: 'reason',
        description: 'The reason for banning.',
        type: ApplicationCommandOptionType.String,
    },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: (bot, interaction) => {
        interaction.reply('ban..');
    },
};