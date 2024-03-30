const tmi = require('tmi.js');
const { currentGame } = require('./Utility/twitchUtils');
const {checkForGame, addFinishedGame, addGame, gamesList} = require('./Utility/googleSheets')
const {hltbFullName} = require('./Utility/howLongToBeat')

module.exports = (bot) => {
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

        twitchBot.on('message',  async (channel, tags, message, self) => {
            if(self || !message.startsWith(prefix)) return;
            
            const messageArr = message.slice(1).split(' ');

            const [command, ...gameInfo] = messageArr
            
            const currentGameName = await currentGame();

            const gameNameMsg = gameInfo.join().replace(/,/g, " ");
        
            //Finished game command
            if ((await checkForGame(currentGameName) === false) && (command.toLocaleLowerCase() === "Finished".toLocaleLowerCase())) {
                addFinishedGame(currentGameName);
                
                twitchBot.say(channel, `@${tags.username}, ${currentGameName} has been added to the list of completed games!`);
                return;
            };
            
            //Add a requested game command
            if (command.toLocaleLowerCase() === "Requests".toLocaleLowerCase()) {
                
                if (await checkForGame(gameNameMsg, command.toLocaleLowerCase()) === false) {
                    
                    addGame(gameNameMsg, command.toLocaleLowerCase());
                    
                    twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} has been added to the list of requested games!`);
                    return;
                }
                else{
                    twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} is already in the list, did you enter the correct name?`);
                    return;
                };
                
            };

            //Add the the games I want to play command
            if (command.toLocaleLowerCase() === "Playlist".toLocaleLowerCase()) {
                
                if (await checkForGame(gameNameMsg, command.toLocaleLowerCase()) === false) {
                    
                    addGame(gameNameMsg, command.toLocaleLowerCase());
                    
                    twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} has been added to the list of games you are interested in!`);
                    return;
                }
                else {
                    twitchBot.say(channel, `@${tags.username}, ${gameNameMsg} is already in the list, did you enter the correct name?`);
                    return;
                };
            };

            //Check how long it will take to comeplete the requested games
            if (command.toLocaleLowerCase() === "HowLongToBeat".toLocaleLowerCase()) {
                const spreadhsheetList = await gamesList(gameNameMsg)
                let spreadhsheetGames = []
                
                for (let i = 0; i < spreadhsheetList.length; i++) {
                    // const element = spreadhsheetList[i];
                    spreadhsheetGames.push(await hltbFullName(spreadhsheetList[i]))
                }
                const sheetData = await spreadhsheetGames.flat()

                let filteredSheetData = [];
                
                for (const data of sheetData) {
                    if (data !== "No Games") {
                        filteredSheetData.push(`${data}`)
                    }
                };

                const formattedSheetData = await filteredSheetData.flatMap(item => {

                    const [key, value] = item.split(',');

                    return {game:key, time:Number(value)};
                });
                
                const totalTime = formattedSheetData.reduce((total, gameTime) => {return total + gameTime.time}, 0);

                twitchBot.say(channel, `@${tags.username}, It's going to take ${totalTime}hrs to get through the games on the ${gameNameMsg.toLocaleUpperCase()} list!`);
                return;
            }
        });
        
    } catch (error) {
        console.error(error);
        return null;
    };
};