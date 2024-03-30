const {google} = require('googleapis');

module.exports = {
    
    checkForGame: async(game, sheetName = "Played") => {
        
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
        
            const gamesCompleted = gameNameData.data.values.flat().includes(game);
        
            return gamesCompleted
            
        } catch (error) {
            console.error(error);
        };
    },
    addGame: async(game, sheetName = "Played") => {
        
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
                range: `played!A:B`,
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
    
};