require('dotenv').config();
const {Client, IntentsBitField, Guild, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleManager } = require('discord.js');
const eventHandler = require('./Handlers/eventHandler');


const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});


// bot.on( 'ready', async (bot) => {
    
//     // const ignoreRoles = ["HandsomeBot", "HandsomeStreamBot", "Free Stuff", "@everyone", "The Black Order", "Doom Bots", "S.H.I.E.L.D", "Twitch Subscriber", "Twitch Subscriber: Tier 1", "Twitch Subscriber: Tier 2", "Twitch Subscriber: Tier 3"];
//     // const serverRoles = bot.guilds.cache.flatMap((guild) => guild.roles.cache).map((role) => `${role.name}, ${role.id}`)
    
//     // const splitRoles = serverRoles.map(item => {
//     //     const [key, value] = item.split(', ');

//     //     return {label:key, id:value}
//     // });

//     // splitRoles.forEach(role => {
//     //     if (ignoreRoles.includes(role.label)) {
//     //         delete role.id;
//     //         delete role.label;
//     //     };
//     // });
//     // const cleanedRoles = splitRoles.filter(value => Object.keys(value).length !== 0);
//     // console.log(cleanedRoles);
// });

// bot.on('ready', async (bot) => {
//     try {
//         const channel = await bot.channels.cache.get('1217198268929278044');
//         if (!channel) return;

//         let lastMessage = ""
        
//         const row = new ActionRowBuilder();
//         const roleMessage = "Claim or remove a Role"

//         const ignoreRoles = ["HandsomeBot", "HandsomeStreamBot", "Free Stuff", "@everyone", "The Black Order", "Doom Bots", "S.H.I.E.L.D", "Twitch Subscriber", "Twitch Subscriber: Tier 1", "Twitch Subscriber: Tier 2", "Twitch Subscriber: Tier 3"];
//         const serverRoles = await bot.guilds.cache.flatMap((guild) => guild.roles.cache).map((role) => `${role.name}, ${role.id}`)
        
//         const splitRoles = await serverRoles.map(item => {
//             const [key, value] = item.split(', ');
    
//             return {label:key, id:value}
//         });
    
//         await splitRoles.forEach(role => {
//             if (ignoreRoles.includes(role.label)) {
//                 delete role.id;
//                 delete role.label;
//             };
//         });
//         const cleanedRoles = await splitRoles.filter(value => Object.keys(value).length !== 0);

//         await channel.messages.fetch({ limit: 1}).then(msg =>{
//             lastMessage = msg.first()
//         })

//         if ((lastMessage !== undefined) && (lastMessage.author.bot)) {
//             if (lastMessage.components[0].components.length !== cleanedRoles.length) {

//                 cleanedRoles.forEach((role) => {
//                     row.components.push(
//                         new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
//                     )
//                 })
        
//                 await lastMessage.edit({
//                     content: roleMessage,
//                     components: [row]
//                 });
//             };

//         } else {

//             cleanedRoles.forEach((role) => {
//                 row.components.push(
//                     new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
//                 )
//             })
    
//             await channel.send({
//                 content: roleMessage,
//                 components: [row]
//             });

//         };

//     } catch (error) {
//         console.error(error);
//     };
// });

// bot.on('interactionCreate', async (interaction) => {
//     try {
//         if (!interaction.isButton()) return;
        
//         await interaction.deferReply({ ephemeral: true });

//         const role = interaction.guild.roles.cache.get(interaction.customId);
    
//         if (!role) {
//             interaction.editReply({
//                 content: "I couldn't find that role!",
//             })
//             return;
//         }

//         const hasRole = interaction.member.roles.cache.has(role.id);

//         if (hasRole) {
//             await interaction.member.roles.remove(role);
//             await interaction.editReply({
//                 content: `The role ${role} has been removed.`,
//                 ephemeral: true,
//             });
//         }else{

//             await interaction.member.roles.add(role);
//             await interaction.editReply({
//                 content: `The role ${role} has been added.`,
//                 ephemeral: true,
//             });
//         };

//     } catch (error) {
//         console.error(error);
//     }
// });

eventHandler(bot);


bot.login(process.env.TOKEN);