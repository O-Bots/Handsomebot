const hltb = require('howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();

module.exports = async (gameName) => {

    try {
        const response = await hltbService.search(gameName);
        const games = await response;

        for (const game of games){
            const gameInfo = {
                Game:game.name,
                MainStory: game.gameplayMain+"hrs",
                MainStoryExtra: game.gameplayMainExtra+"hrs",
                Completionist: game.gameplayCompletionist+"hrs",
            };
            const gameInfoString = JSON.stringify(gameInfo).replace(/{|}/g, '').replace(/"/g, '').replace(/,/g, '\n').replace(/(Completionist:\d+hrs)/g, '$1\n');
            
            return gameInfoString
        };
        
    } catch (error) {
        console.error(error);
    };
};