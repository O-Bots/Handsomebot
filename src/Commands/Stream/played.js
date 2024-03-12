const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'played',
    description: 'Shares link to google doc listing the games that TwelveGauge has completed',
    // devOnly: true,
    // testOnly: true,
    //deleted: Boolean,

    callback: (bot, interaction) => {
        const embed = new EmbedBuilder()
        .setTitle("Games played")
        .setAuthor({name: 'TwelveGaug3'})
        .setDescription('This is a list of games I have completed on/off stream, refer to this list when deciding what games to request.')
        .setColor("#2fb830")
        .setURL('https://docs.google.com/spreadsheets/d/1rkqvS9VylMbCOl6C-_HHUReX4R1Kv2STfDz_lRsIO6A/edit#gid=0')
        .setThumbnail('https://mailmeteor.com/logos/assets/PNG/Google_Sheets_Logo_512px.png');
        interaction.reply({embeds: [embed]});
    },
};