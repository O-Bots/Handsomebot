
# Discord Bot Project

This project is a personal endeavor aimed at revamping an old Discord bot I originally created following a tutorial. The purpose of the original bot was to prevent unauthorized bots from joining a Discord server by implementing an entry check system. This project served as an excellent opportunity to deepen my knowledge of JavaScript and explore various APIs.

## Features

#### Core Functionalities
- Twitch API Integration: Enables chat integration and command recognition within the Twitch platform.
- Google Sheets API: Facilitates data storage for games completed and viewer requests, making it easy to track and manage information.
- HowLongToBeat API: Provides game completion times, helping users estimate how long it will take to finish a game.
- Reddit API: Posts randomized memes to the Discord server, ensuring fresh and entertaining content.

#### Discord-Specific Functionalities
- Entry Verification: Implements a check to verify new users and prevent bots from joining the server.
- Command and Interaction Handling: Supports various commands and interactions within the Discord server, enhancing user engagement.
- Role Management: Handles Discord roles, allowing for organized and structured server management.

## Technologies Used
- JavaScript: The primary programming language used to develop the bot.
- Node.js: A runtime environment that enables server-side JavaScript execution.
- Axios: A promise-based HTTP client used for making API requests.
- Discord.js: A powerful library for interacting with the Discord API.
- dotenv: A module for loading environment variables from a .env file.
- Google APIs: Utilized for interacting with Google Sheets.
- HowLongToBeat API: Used to retrieve game completion times.
- nodemon: A tool that helps develop Node.js applications by automatically restarting the server upon detecting changes.
- Reddit API: Allows interaction with Reddit to fetch and post memes.
- Tmi.js: A library for connecting to Twitch chat and handling chat interactions.
## Setup and Installation

1. Clone the Repository:

```bash
git clone https://github.com/your-username/discord-bot-project.git
cd discord-bot-project
```
2. Install Dependencies:
```bash
npm install
```
3. Environment Variables:
Add API keys an token information to the .env file in the root directory:
```env
DISCORD_BOT_TOKEN = Token Here
DISCORD_GUILD_ID = Discord Server Id Here
DISCORD_BOT_ID = Discord Bot Id Here

REDDIT_USERNAME = 
REDDIT_PASSWORD = 
REDDIT_APP_ID = 
REDDIT_APP_SECRET = 

TWITCH_BOT_ID = 
TWITCH_BOT_SECRET = 
TWITCH_USERNAME = 
TWITCH_BOT_USERNAME = 
TWITCH_BOT_OAUTH_TOKEN = 

GOOGLE_SPREADSHEET_ID = 
GOOGLE_SERVICE_ACCOUNT_KEYFILE = 
```
4. Run the Bot:
```bash
nodemon
```
