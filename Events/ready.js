module.exports = bot =>{
    console.log(`I am now online, You can call me ${bot.user.username}`);
    bot.user.setPresence({
        status: "online",
        game: {
            name: "human Trial 0.3",
            type: "WATCHING"
        }
    });
};