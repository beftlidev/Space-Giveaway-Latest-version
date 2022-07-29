const Discord = require('discord.js')
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 

module.exports = {
  en: {
    name: "links", 
    options: [], 
    description: "🔗 Discards the bot\'s links.",
  },
    run: async (client, interaction) => {

const embed = new Discord.MessageEmbed() 

.setDescription("You can go to any link you want from below! \nWith the links below, you can add the bot to your Server, come to the bot's support server, vote for the bot and check my site. 😇")
.setColor("GREEN")
const row = new MessageActionRow()
			.addComponents(
 new Discord.MessageButton() 
.setStyle("LINK") 
.setLabel("My invitation link") 
.setURL("https://discord.com/oauth2/authorize?client_id=765207268408033322&scope=bot+applications.commands&permissions=2147483656"), 
new Discord.MessageButton() 
.setStyle("LINK") 
.setLabel("My support server") 
.setURL("https://discord.gg/KZfAEjrPUF"), 
new Discord.MessageButton() 
.setStyle("LINK") 
.setLabel("My voting link") 
.setURL("https://top.gg/bot/765207268408033322/vote"), 
new Discord.MessageButton() 
.setStyle("LINK") 
.setLabel("Web Site") 
.setURL("https://spacegw.xyz/") 
); 
await interaction.reply({embeds: [embed], components: [row]})  

} 
}
