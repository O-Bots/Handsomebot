const hltb = require('howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();

module.exports = async (gameName) => {
    
    let gameInforArr = [];
    
    const searchError = "No Games";

    try {
        const response = await hltbService.search(gameName);
        const games = await response;

        for (const game of games){
            
            if (game.name.startsWith(gameName)) {
                const gameInfo = {
                    Game:game.name,
                    MainStory: game.gameplayMain+"hrs",
                    MainStoryExtra: game.gameplayMainExtra+"hrs",
                    Completionist: game.gameplayCompletionist+"hrs",
                };
                gameInforArr.push(gameInfo)
            }else{
                continue;
            };
        };
        
    } catch (error) {
        console.error(error);
    };

    if (gameInforArr.length === 0) {
        
        return searchError;
        
    }else{
        const gameInfoString = await JSON.stringify(gameInforArr).replace(/{|}/g, '').replace(/"/g, '').replace(/,/g, '\n').replace(/(Completionist:\d+hrs)/g, '$1\n').replace(/\[|\]/g, '');
        
        return gameInfoString
    }
};