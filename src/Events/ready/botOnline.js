const { ActivityType } = require("discord.js");

module.exports = (bot) => {
    console.log(`I am now online, You can call me ${bot.user.username}`);

    bot.user.setActivity({
        name: "Human trial 0.3.1",
        type: ActivityType.Watching,
    });
};