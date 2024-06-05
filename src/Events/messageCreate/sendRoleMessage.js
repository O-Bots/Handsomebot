const {discordRoleServer, devs, ignoreRoles, prefix} = require('../../../config.json');
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = async (bot, message) => {
    
    if ((devs.includes(message.author.id)) && (message.content.toLocaleLowerCase() === prefix+"updateRoles".toLocaleLowerCase())) {
        updateRoleMessage();

        message.reply({
            content: `The roles in <#${discordRoleServer}> have been updated`,
        });
    };

    async function updateRoleMessage() {
        try {
            const channel = await bot.channels.cache.get(discordRoleServer);
            if (!channel) return;
    
            let lastMessage = ""
            
            const row = new ActionRowBuilder();
            const roleMessage = "Claim or remove a Role"
    ;
            const serverRoles = await bot.guilds.cache.flatMap((guild) => guild.roles.cache).map((role) => `${role.name}, ${role.id}`)
            
            const splitRoles = await serverRoles.map(item => {
                const [key, value] = item.split(', ');
        
                return {label:key, id:value}
            });
        
            await splitRoles.forEach(role => {
                if (ignoreRoles.includes(role.label)) {
                    delete role.id;
                    delete role.label;
                };
            });
            const cleanedRoles = await splitRoles.filter(value => Object.keys(value).length !== 0);
    
            await channel.messages.fetch({ limit: 1}).then(msg =>{
                lastMessage = msg.first()
            })
    
            if ((lastMessage !== undefined) && (lastMessage.author.bot)) {
                
                if (lastMessage.components[0].components.length === cleanedRoles.length) return;

                cleanedRoles.forEach((role) => {
                    row.components.push(
                        new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
                    )
                })
        
                await lastMessage.edit({
                    content: roleMessage,
                    components: [row]
                });
                
            } else {
    
                cleanedRoles.forEach((role) => {
                    row.components.push(
                        new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
                    )
                })
        
                await channel.send({
                    content: roleMessage,
                    components: [row]
                });
    
            };
    
        } catch (error) {
            console.error(error);
        };
        
    };
};