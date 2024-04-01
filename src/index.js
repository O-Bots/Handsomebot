require('dotenv').config();
const {Client, IntentsBitField, GuildChannel, time} = require('discord.js');
const eventHandler = require('./Handlers/eventHandler');
const tmi = require('tmi.js');
const { currentGame } = require('./Utility/twitchUtils');
const {checkForGame, addFinishedGame, addGame, gamesList} = require('./Utility/googleSheets');
const {hltbFullName} = require('./Utility/howLongToBeat');
const {noGames} = require('./../config.json');
const commands = require('./Utility/commandArray')

const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

let lastSheetCmdTime = 0;
let lastCmdTime = 0;

bot.on('ready', async () => {
    
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
                console.log(commands.twitch.toLocaleString().replace(".,", "\n"));
                twitchBot.say(channel, `@${tags.username}, ${commands.twitch.toLocaleString().replace(".,", "......")}`);
                return;
            };
            if (tags.username === process.env.TWITCH_USERNAME) {
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
            };
            
            if (gameNameMsg !== "played") {
                //Check how long it will take to comeplete the requested games
                if ((command.toLocaleLowerCase() === "Hltb".toLocaleLowerCase()) && (gameNameMsg.toLocaleLowerCase() === "Requests".toLocaleLowerCase() || gameNameMsg.toLocaleLowerCase() === "Playlist".toLocaleLowerCase())) {
                    
                    const sheetsTimeNow = new Date().getTime()

                    if (sheetsTimeNow - lastSheetCmdTime > 60 * 1000) {
                        
                        lastSheetCmdTime = sheetsTimeNow

                        const spreadhsheetList = await gamesList(gameNameMsg)
                        let spreadhsheetGames = []
                        
                        for (let i = 0; i < spreadhsheetList.length; i++) {
                            // const element = spreadhsheetList[i];
                            spreadhsheetGames.push(await hltbFullName(spreadhsheetList[i]))
                        }
                        const sheetData = await spreadhsheetGames.flat()
        
                        let filteredSheetData = [];
                        
                        for (const data of sheetData) {
                            if (data !== noGames) {
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

                    } else {
                        twitchBot.say(channel, `@${tags.username}, the ${command} is on cooldown and will be useable again in ${Math.floor(60-((sheetsTimeNow - lastSheetCmdTime)/1000))}secs `);
                        return;
                    }
                };
            }
            else{
                twitchBot.say(channel, `@${tags.username}, the ${gameNameMsg} list of games are already complete, feel free to check any of the other sheets`);
                return;

            };

            // Check how long it will take complete a game
            if (command.toLocaleLowerCase() === "Hltb".toLocaleLowerCase()) {
    
                const timeNow = new Date().getTime()

                if (timeNow - lastCmdTime > 60 * 1000) {
                    
                    // lastCmdTime = timeNow
                    const hltbGameInfo = await hltbFullName(gameNameMsg)

                    if (hltbGameInfo !== noGames) {
                        const formattedHltbData = await hltbGameInfo.flat();
                        
                        twitchBot.say(channel, `@${tags.username}, It with take ${Number(formattedHltbData[1])}hrs to complete ${formattedHltbData[0]}.`);
                        // console.log(finalData.Game);
                    } 
                    else if (hltbGameInfo === noGames) {
                        twitchBot.say(channel, `@${tags.username}, Please enter the full name of the game you are searching for.`);
                        return;
                    };

                }
                else {
                    twitchBot.say(channel, `@${tags.username}, the ${command} is on cooldown and will be useable again in ${Math.floor(60-((timeNow - lastCmdTime)/1000))}secs `);
                    return;
                }
            };
        });
        
    } catch (error) {
        console.error(error);
        return null;
    };
});

eventHandler(bot);

bot.login(process.env.DISCORD_BOT_TOKEN);