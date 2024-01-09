module.exports = (bot, message) =>{
    if (message.content === "mansam") {
        message.reply('What? Did you call me handsome?!!');
    }
        //Looking for a message in a specific channel, represented by the Channel ID
    if (message.channel.id === '620317483848695829') {
        //Searching if message content is "Yes"
        if(message.author.bot) return;
        if (message.content == 'Yes' || message.content == 'yes') {
            //Created a Variable to hold the Role "Watchers"
            let viewer = message.member.guild.roles.find(role => role.name === 'Watchers');
            //Adds the role to the member that sent the message
            message.member.addRole(viewer);
            message.member.send('You have passed Quarantine\nEnjoy')
            //This deletes the message after 20 secs
            .then(message => message.delete(20000))
            .catch(console.error);
            message.delete();
        }else{
            // If the message is incorrect, The bot sends a PM to the message author
            message.author.send('Comply with the Quarantine check to progress')
            //This deletes the message after 20 secs
            .then(message => message.delete(20000))
            .catch(console.error);
            if(message.author.bot) return;
            else
            message.delete(1000)
        };
    };
};
