const { gamesList } = require("./googleSheets");
const { hltbFullName } = require("./howLongToBeat");
const {noGames} = require('./../../config.json');

module.exports = async (sheetName) => {
    const spreadhsheetList = await gamesList(sheetName)
    let spreadhsheetGames = []
    
    for (let i = 0; i < spreadhsheetList.length; i++) {

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

    return totalTime;
};