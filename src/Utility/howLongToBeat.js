const {noGames} = require('./../../config.json')
const hltb = require('howlongtobeat');
const levenshtein = require('./../Utility/levenshteinDistance');
const hltbService = new hltb.HowLongToBeatService();

module.exports = {
    
    hltbGeneral: async (gameName) => {
        
        let gameGeneralInforArr = [];
        
        const searchError = noGames;
    
        try {
            const response = await hltbService.search(gameName);
            const games = await response;

            for (const game of games){
                
                if (!game.name.toLocaleLowerCase().startsWith(gameName.toLocaleLowerCase())) continue;

                if (game.gameplayMain + game.gameplayMainExtra + game.gameplayCompletionist === 0) continue;

                const gameInfo = {
                    Game:game.name,
                    MainStory: game.gameplayMain+"hrs",
                    MainStoryExtra: game.gameplayMainExtra+"hrs",
                    Completionist: game.gameplayCompletionist+"hrs",
                };
                gameGeneralInforArr.push(gameInfo)

            };
            
        } catch (error) {
            console.error(error);
        };

        if (gameGeneralInforArr.length === 0) return searchError;
        
        const gameInfoString = await JSON.stringify(gameGeneralInforArr).replace(/{|}/g, '').replace(/"/g, '').replace(/,/g, '\n').replace(/(Completionist:\d+hrs)/g, '$1\n').replace(/\[|\]/g, '');

        return gameInfoString
        
    },
    hltbFullName: async (gameName) => {
        
        let gameInforArr = [];
        let gameTimeFilterArr = [];
        
        const searchError = noGames;
    
        try {
            const response = await hltbService.search(gameName);
            const games = await response;

            for (const game of games){
                
                if ((levenshtein(gameName.toLocaleLowerCase(), game.name.toLocaleLowerCase()) > 2) && (gameName.length - game.name.length < 2)) continue;
    
                if (game.gameplayMain + game.gameplayMainExtra + game.gameplayCompletionist === 0) continue;
    
                gameTimeFilterArr.push(game.name);
                
                if (game.gameplayMain > 0) {
                    gameTimeFilterArr.push(game.gameplayMain);
    
                } else if (game.gameplayMainExtra > 0) {
                    gameTimeFilterArr.push(game.gameplayMainExtra);
    
                } else {
                    gameTimeFilterArr.push(game.gameplayCompletionist);
    
                };
    
                gameInforArr.push(gameTimeFilterArr);
    
            };
            
        } catch (error) {
            console.error(error);
        };
    
        if (gameInforArr.length === 0) return searchError;

        return gameInforArr
    },
};