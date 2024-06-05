const tmi = require('tmi.js');
const { currentGame } = require('./../../Utility/twitchUtils');
const {checkForGame, addFinishedGame, addGame, getSheetNames, deleteGame, gamesList} = require('./../../Utility/googleSheets');
const {hltbFullName} = require('./../../Utility/howLongToBeat');
const {noGames, completedGamesSheetName, prefix} = require('./../../../config.json');
const commands = require('./../../Utility/commandArray');
const totalGameTimeFromSheet = require('./../../Utility/totalGameTimeFromSheet');
const twitchReplies = require('./../../Utility/replyArray');

let lastCmdTime = 0;

module.exports = async  () => {
    try {
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

            const gameNameMsg = gameInfo.join().replace(/,([^,]|$)/g, " $1");

            const sheetNamesArr = await getSheetNames();

            const lowerCaseCommands = commands.twitch.map(cmd => cmd.toLocaleLowerCase());

            const twitchCmds = []

            for (let i = 0; i < twitchReplies.length; i++) {
                if (twitchReplies[i].msg === undefined) continue;
                twitchCmds.push(twitchReplies[i].msg);
            };

            //Checks if it's a valid command
            if (!lowerCaseCommands.includes(command.toLocaleLowerCase()) && (!sheetNamesArr.includes(command.toLocaleLowerCase())) && (!twitchCmds.includes(command.toLocaleLowerCase()))) {
    
                twitchBot.say(channel, `@${tags.username}, The command "${command}" is not a useable command for this channel.`);
                return;
            };

            //Command cooldown
            if (tags.username !== process.env.TWITCH_USERNAME) {
                const timeNow = new Date().getTime()
    
                if (timeNow - lastCmdTime < 10 * 1000) {

                    for (let i = 0; i < twitchReplies.length; i++) {
                        const reply = twitchReplies[i];

                        if (!reply.cooldownReply) continue;
                            
                        rngRply = Math.floor(Math.random()* reply.cooldownReply.length)
                        const cooldownFormattedReply = reply.cooldownReply[rngRply].replace(/USER/, `@${tags.username}`).replace(/CMD/, `${command}`).replace(/TIME/, `${Math.floor(60-((timeNow - lastCmdTime)/1000))}secs`);
    
                        twitchBot.say(channel, cooldownFormattedReply);
                        return;
                    };
                };
                lastCmdTime = timeNow
            };

            //Check if the game is already in a list
            if ((command.toLocaleLowerCase() !== commands.twitchObject.hltb.toLocaleLowerCase()) && (sheetNamesArr.includes(command.toLocaleLowerCase())) && (gameNameMsg.length !== 0)) {
                
                if (await checkForGame(gameNameMsg.toLocaleLowerCase(), command.toLocaleLowerCase()) === true) {
                    twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} is already in the list, did you enter the correct name?`);
                    return;
                };
            };

            //This is to stop people from running the Played list through the hltb function
            if (gameNameMsg.toLocaleLowerCase() === completedGamesSheetName.toLocaleLowerCase()) {
                twitchBot.say(channel, `@${tags.username}, the ${gameNameMsg} list of games are already complete, feel free to check any of the other sheets`);
                return;
            };

            //List all the games waiting to be played
            if ((sheetNamesArr.includes(command.toLocaleLowerCase())) && (gameNameMsg.length === 0)) {
                const listOfGames = await gamesList(command)
                const cleanedList = listOfGames.toSpliced(0, 1).toString().replace(/,/g, ' | ')
                
                twitchBot.say(channel, `@${tags.username}, Here are all games from the ${command.toLocaleUpperCase()} list....... ${await cleanedList} `);
                return;
            };
            
            //Finished game command
            if (await checkForGame(currentGameName) === false && command.toLocaleLowerCase() === commands.twitchObject.finished.toLocaleLowerCase() && tags.username === process.env.TWITCH_USERNAME) {
                await deleteGame(currentGameName)
                await addFinishedGame(currentGameName);
                
                twitchBot.say(channel, `@${tags.username}, ${currentGameName} has been added to the list of completed games!`);
                return;
            }else if (await checkForGame(currentGameName) === true && command.toLocaleLowerCase() === commands.twitchObject.finished.toLocaleLowerCase() && tags.username === process.env.TWITCH_USERNAME) {

                twitchBot.say(channel, `@${tags.username}, ${currentGameName} is already on the list of completed games!`);
                return;
            };

            //Update the list of games to be played
            if ((sheetNamesArr.includes(command.toLocaleLowerCase())) && (tags.username === process.env.TWITCH_USERNAME) && (gameNameMsg.length !== 0)) {

                addGame(gameNameMsg, command.toLocaleLowerCase());
                
                twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} has been added to the list!`);
                return;
            };

            if (gameNameMsg.toLocaleLowerCase() === completedGamesSheetName.toLocaleLowerCase()) return;
            //Check how long it will take to comeplete the requested games
            if ((command.toLocaleLowerCase() === commands.twitchObject.hltb.toLocaleLowerCase()) && (sheetNamesArr.includes(gameNameMsg.toLocaleLowerCase()))) {
                
                const totalTime = await totalGameTimeFromSheet(gameNameMsg)

                twitchBot.say(channel, `@${tags.username}, It's going to take ${totalTime}hrs to get through the games on the ${gameNameMsg.toLocaleUpperCase()} list!`);
                return;
            };

            // Check how long it will take complete a game
            if (command.toLocaleLowerCase() === commands.twitchObject.hltb.toLocaleLowerCase() && (gameNameMsg.length !== 0)) {
    
                const hltbGameInfo = await hltbFullName(gameNameMsg)

                if (hltbGameInfo === noGames) {
                    for (let i = 0; i < twitchReplies.length; i++) {
                        const reply = twitchReplies[i];
    
                        if (!reply.hltbNoGamesReply) continue;
                            
                        rngRply = Math.floor(Math.random()* reply.hltbNoGamesReply.length);
                        const noGamesFormattedReply = reply.hltbNoGamesReply[rngRply].replace(/{USER}/, `@${tags.username}`);
    
                        twitchBot.say(channel, noGamesFormattedReply);
                        return;
                    };
                };
                const formattedHltbData = await hltbGameInfo.flat();

                for (let i = 0; i < twitchReplies.length; i++) {
                    const reply = twitchReplies[i];

                    if (!reply.hltbReply) continue;
                        
                    rngRply = Math.floor(Math.random()* reply.hltbReply.length);
                    const hltbFormattedReply = reply.hltbReply[rngRply].replace(/{USER}/, `@${tags.username}`).replace(/{GAME}/, `${formattedHltbData[0]}`).replace(/{TIME}/, `${Number(formattedHltbData[1])}hr/s`);

                    twitchBot.say(channel, hltbFormattedReply);
                    return;
                };
            };
            //Commands from reply array
            if (gameNameMsg.length === 0 && !lowerCaseCommands.includes(command.toLocaleLowerCase())) {
                for (let i = 0; i < twitchReplies.length; i++) {
                    if (command.toLocaleLowerCase() !== twitchReplies[i].msg.toLocaleLowerCase()) continue;
                    
                    if(Array.isArray(twitchReplies[i].msgReply)) {
                
                        rngReply = Math.floor(Math.random()* twitchReplies[i].msgReply.length);

                        twitchBot.say(channel, `@${tags.username}, ${twitchReplies[i].msgReply[rngReply]}`);
                        return;
                    };
                    twitchBot.say(channel, `@${tags.username}, ${twitchReplies[i].msgReply}`);
                    return;
                };
            };
        });
        
    } catch (error) {
        console.error(error);
        return null;
    };
};