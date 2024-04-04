const {google} = require('googleapis');
const {completedGamesSheetName} = require('./../../config.json');

module.exports = {
    
    checkForGame: async(game, sheetName = completedGamesSheetName) => {
        
        try {
            const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
            const auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE,
                scopes: "https://www.googleapis.com/auth/spreadsheets"
            });
        
            const client = await auth.getClient();
        
            const sheets = google.sheets({ version: "v4", auth: client});
    
            const gameNameData = await sheets.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: `${sheetName.toLocaleLowerCase()}!A:A`
            });
        
            const gamesCompleted = await gameNameData.data.values.flat().toLocaleString().toLocaleLowerCase().includes(game);
        
            return gamesCompleted
            
        } catch (error) {
            console.error(error);
        };
    },
    addFinishedGame: async(game, sheetName = completedGamesSheetName) => {
        
        try {
            const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
            const auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE,
                scopes: "https://www.googleapis.com/auth/spreadsheets"
            });
            
            const year = new Date().getFullYear();

            const client = await auth.getClient();
        
            const sheets = google.sheets({ version: "v4", auth: client});
    
            const addData = await sheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: `${sheetName.toLocaleLowerCase()}!A:B`,
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: [
                        [
                            game, year
                        ],
                    ]
                },
            });

            return addData;

        } catch (error) {
            console.error(error);
        };
    },
    addGame: async(game, sheetName) => {
        
        try {
            const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
            const auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE,
                scopes: "https://www.googleapis.com/auth/spreadsheets"
            });
            
            const year = new Date().getFullYear();

            const client = await auth.getClient();
        
            const sheets = google.sheets({ version: "v4", auth: client});
    
            const addData = await sheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: `${sheetName.toLocaleLowerCase()}!A1`,
                valueInputOption: "USER_ENTERED",
                resource: {
                    values: [
                        [
                            game
                        ],
                    ]
                },
            });

            return addData;

        } catch (error) {
            console.error(error);
        };
    },
    gamesList: async(sheetName) => {
        
        try {
            const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
            const auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE,
                scopes: "https://www.googleapis.com/auth/spreadsheets"
            });
        
            const client = await auth.getClient();
        
            const sheets = google.sheets({ version: "v4", auth: client});
    
            const gameNameData = await sheets.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: `${sheetName}!A:A`
            });
        
            const gameData = gameNameData.data.values.flat();
        
            return gameData
            
        } catch (error) {
            console.error(error);
        };
    },
    getSheetNames: async () => {
        try {
            let sheetNames = [];
            const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
            const auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE,
                scopes: "https://www.googleapis.com/auth/spreadsheets"
            });
        
            const client = await auth.getClient();
        
            const sheets = google.sheets({ version: "v4", auth: client});
    
            const sheetData = await sheets.spreadsheets.get({
                auth,
                spreadsheetId,
            });
            
            for (let i = 0; i < sheetData.data.sheets.length; i++) {
                sheetNames.push(sheetData.data.sheets[i].properties.title)
            };
            
            return sheetNames
            
        } catch (error) {
            console.error(error);
        };
    }
    
};