const Discord = require('discord.js');
const bot = new Discord.Client();
const { prefix, token } = require('./config.json');
const fs = require('fs');

//bot.on("message", (message) => {
//    if (message.content === "Hello") {
//        message.channel.send('Hello my name is Handsomebot, thank you for joining the server.\n\nYou have been placed in Quarantine, and will remain so while we run some checks on your humanity levels. Type the word inside the quotation marks (these things >"") to gain access to the server.\n\nIs there going to be free food at the event? "Yes" there will also be beverages.')
//    }
//});

fs.readdir('./Events',(err, files) => {
    files.forEach(file => {
        const eventHandler = require(`./Events/${file}`)
        const eventName = file.split(".")[0]
        bot.on(eventName, (...args) => eventHandler(bot, ...args))
    })
});

//Error listener
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

bot.login(token);