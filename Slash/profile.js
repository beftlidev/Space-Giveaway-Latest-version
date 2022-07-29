const Discord = require('discord.js');
const {MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 

module.exports = {
  en: {
    name: "profile", 
    options: [{
            name: 'user',
            description: 'Whose profile will you look at?',
            type: 'USER',
            required: false
           }], 
    description: "🤔 You can look at someone\'s profile or your own.",
  },
    run: async (client, interaction) => {

const user = interaction.options.getUser('user') || interaction.user

let u;
 var d = await client.users.fetch(user.id, {force: true}) 
let banner = d.banner
if(banner) {
u = `${d.bannerURL({ dynamic: true, size: 2048 })}`;
} else {
u = "https://media.discordapp.net/attachments/973462223383064586/994627983463686244/Picsart_22-06-19_13-20-01-167.jpg";
}

let mesaj = await client.mesaj.fetch(`toplam_mesaj_${interaction.guild.id}_${user.id}`) 

const embed = new Discord.MessageEmbed()
.setTitle(`${user.tag} ( ${user.id} )`)
.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
.setDescription(`💭 Total messages you sent: ${mesaj || "He never texted me."}`) 
.setColor('BLUE')
.setImage(`${u}`)

interaction.reply({embeds: [embed]})

} 
}
