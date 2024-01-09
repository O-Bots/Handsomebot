module.exports = (bot, member) => {
        //Created a Variable to hold the channel "isolation-chamber"
        const channel = member.guild.channels.find(channel => channel.name === "isolation-chamber");
        if (!channel) return;
        
        member.send(`Welcome to the Fold ${member}, you will remain in "Quarantine" until you are classed as a Harmless.\nType "Yes" to confirm`)
};