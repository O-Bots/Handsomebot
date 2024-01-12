require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'played',
        description: 'Shares link to google doc listing the games that TwelveGauge has completed',
    }
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async() => {
    try {
    console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        );
    console.log('Slash command were registerd successfully')
    }catch(error) {
        console.log(`there was an error:${error}`);
    }
})();