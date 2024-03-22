const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const roles = require('../../Utility/rolesArray');


module.exports = async (bot) => {
    
    try {
        const channel = await bot.channels.cache.get('1217198268929278044');
        if (!channel) return;

        let lastMessage = ""
        
        const row = new ActionRowBuilder();
        const roleMessage = "Claim or remove a Role"

        await channel.messages.fetch({ limit: 1}).then(msg =>{
            lastMessage = msg.first()
        })

        if ((lastMessage !== undefined) && (lastMessage.author.bot)) {
            if (lastMessage.components[0].components.length !== roles.length) {

                roles.forEach((role) => {
                    row.components.push(
                        new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
                    )
                })
        
                await lastMessage.edit({
                    content: roleMessage,
                    components: [row]
                });
            } else {
                return;
            };
            
        } else {

            roles.forEach((role) => {
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