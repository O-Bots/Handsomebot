const tmi = require('tmi.js');
const { currentGame } = require('./../../Utility/twitchUtils');
const {checkForGame, addFinishedGame, addGame, gamesList} = require('./../../Utility/googleSheets');
const {hltbFullName} = require('./../../Utility/howLongToBeat');
const {noGames} = require('./../../../config.json');
const commands = require('./../../Utility/commandArray');
const totalGameTimeFromSheet = require('./../../Utility/totalGameTimeFromSheet');

let lastSheetCmdTime = 0;
let lastCmdTime = 0;
module.exports = () => {
    try {
        const prefix ="!"

        const twitchBot = new tmi.Client({
            options: { debug: false },
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: process.env.TWITCH_BOT_USERNAME,
                password: process.env.TWITCH_BOT_OAUTH_TOKEN
            },
            channels: [process.env.TWITCH_USERNAME]
        });
        
        twitchBot.connect();

        twitchBot.on('message',  async (channel, tags, message, self, user) => {
            if(self || !message.startsWith(prefix)) return;
            
            const messageArr = message.slice(1).split(' ');

            const [command, ...gameInfo] = messageArr;
            
            const currentGameName = await currentGame();

            const gameNameMsg = gameInfo.join().replace(/,/g, " ");
            
            //Add the the games I want to play command
            if (command.toLocaleLowerCase() === "Help".toLocaleLowerCase()) {
                
                twitchBot.say(channel, `@${tags.username}, ${commands.twitch.toLocaleString().replace(".,", "......")}`);
                return;
            };

            //Check if the game is already in a list
            if (command.toLocaleLowerCase() !== "Hltb".toLocaleLowerCase()) {
                
                if (await checkForGame(gameNameMsg.toLocaleLowerCase(), command.toLocaleLowerCase()) === true) {
                    twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} is already in the list, did you enter the correct name?`);
                    return;
                };
            };

            //This is to stop people from running the Played list through the hltb function
            if (gameNameMsg.toLocaleLowerCase() === "Played".toLocaleLowerCase()) {
                twitchBot.say(channel, `@${tags.username}, the ${gameNameMsg} list of games are already complete, feel free to check any of the other sheets`);
                return;
            };

            //Finished game command
            if ((await checkForGame(currentGameName) === false) && (command.toLocaleLowerCase() === "Finished".toLocaleLowerCase()) && (tags.username === process.env.TWITCH_USERNAME)) {
                addFinishedGame(currentGameName);
                
                twitchBot.say(channel, `@${tags.username}, ${currentGameName} has been added to the list of completed games!`);
                return;
            };

            //Add a requested game command
            if ((command.toLocaleLowerCase() === "Requests".toLocaleLowerCase()) && (tags.username === process.env.TWITCH_USERNAME)) {

                addGame(gameNameMsg, command.toLocaleLowerCase());
                
                twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} has been added to the list of requested games!`);
                return;
            };

            //Add the the games I want to play command
            if ((command.toLocaleLowerCase() === "Playlist".toLocaleLowerCase()) && (tags.username === process.env.TWITCH_USERNAME)) {
                
                addGame(gameNameMsg, command.toLocaleLowerCase());
                
                twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} has been added to the list of games you are interested in!`);
                return;
            };

            //Check how long it will take to comeplete the requested games
            if ((command.toLocaleLowerCase() === "Hltb".toLocaleLowerCase()) && (gameNameMsg.toLocaleLowerCase() === "Requests".toLocaleLowerCase() || gameNameMsg.toLocaleLowerCase() === "Playlist".toLocaleLowerCase())) {
                
                const sheetsTimeNow = new Date().getTime()

                if (sheetsTimeNow - lastSheetCmdTime < 60 * 1000) {
                    twitchBot.say(channel, `@${tags.username}, the ${command} is on cooldown and will be useable again in ${Math.floor(60-((sheetsTimeNow - lastSheetCmdTime)/1000))}secs `);
                    return;
                };

                lastSheetCmdTime = sheetsTimeNow
                const totalTime = await totalGameTimeFromSheet(gameNameMsg)

                twitchBot.say(channel, `@${tags.username}, It's going to take ${totalTime}hrs to get through the games on the ${gameNameMsg.toLocaleUpperCase()} list!`);
                return;
            };

            // Check how long it will take complete a game
            if (command.toLocaleLowerCase() === "Hltb".toLocaleLowerCase()) {
    
                const timeNow = new Date().getTime()

                if (timeNow - lastCmdTime < 60 * 1000) {
                    twitchBot.say(channel, `@${tags.username}, the ${command} is on cooldown and will be useable again in ${Math.floor(60-((timeNow - lastCmdTime)/1000))}secs `);
                    return;
                };
                lastCmdTime = timeNow
                const hltbGameInfo = await hltbFullName(gameNameMsg)

                if (hltbGameInfo === noGames) {
                    twitchBot.say(channel, `@${tags.username}, Please enter the full name of the game you are searching for.`);
                    return;
                };

                const formattedHltbData = await hltbGameInfo.flat();
                    
                twitchBot.say(channel, `@${tags.username}, It with take ${Number(formattedHltbData[1])}hrs to complete ${formattedHltbData[0]}.`);
                return;
            };
        });
        
    } catch (error) {
        console.error(error);
        return null;
    };
};