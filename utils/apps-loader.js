const db2 = require("../helpers/database.js")
const end = require("../helpers/end.js")
const Discord = require('discord.js')
const moment = require('moment')
const {Collection} = require("discord.js"),
      {readdirSync} = require("fs")
      const db = require("croxydb") 
module.exports = async(client, interaction) => {
    if (!interaction.isCommand() && !interaction.isContextMenu()) return;
    var cmdsInteract = {
      tr: allCommands.tr.find(a => a.name === interaction.commandName),
      en: allCommands.en.find(a => a.name === interaction.commandName)
    }
    var theCMD;
    interaction.selectedValue = (interaction.options._hoistedOptions[0]) ? interaction.options._hoistedOptions[0].value : undefined
    if (cmdsInteract.tr) {
      if(db.fetch(`kara_liste_${interaction.user.id}`) === "evet") {
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Destek Sunucusu')
.setURL('https://discord.gg/KZfAEjrPUF') 
) 
let sebep = db.fetch(`kara_liste_sebep_${interaction.user.id}`) 
      interaction.reply({content: `<:sgs_error:921392927568195645> Hey, korkarım **${sebep}** nedenleriyle kara listeye alındınız! Şikayetiniz varsa, aşağıdaki butondan destek sunucumuzu ziyaret edin.`, components: [row]}) 
      } else {
      theCMD = client.commands.find(a => a.tr.name === interaction.commandName)
      await client.komuttr.add(`komut_${interaction.commandName}`,1)
      db.add(`bot_using_tr`,1)
      theCMD.run(client, interaction)
} 
    } else if (cmdsInteract.en) {
      if(db.fetch(`kara_liste_${interaction.user.id}`) === "evet") {
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Support Server')
.setURL('https://discord.gg/KZfAEjrPUF') 
) 
let sebep = db.fetch(`kara_liste_sebep_${interaction.user.id}`) 
      interaction.reply({content: `<:sgs_error:921392927568195645> Hey, I\'m afraid you\'re blacklisted for **${sebep}** reasons! If you have a complaint, visit our support server from the button below.`, components: [row]}) 
      } else {
      theCMD = client.commands.find(a => a.en.name === interaction.commandName)
      await client.komuten.add(`komut_${interaction.commandName}`,1)
      db.add(`bot_using_en`,1)
      theCMD.run(client, interaction)
      } 
    }
}
