const Discord = require('discord.js');
const { Op } = require("sequelize")
const { bold } = require("@discordjs/builders")
const { userMention, time: timestamp } = require("@discordjs/builders")
const { v4: uuidv4 } = require("uuid")
const db2 = require("../helpers/database.js") 
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 
module.exports = {
  en: {
    name: "giveaway-delete", 
    options: [{
            name: 'id',
            description: 'Enter the id of the giveaway you want to delete',
            type: 'STRING',
            required: true
           }], 
    description: "Delete Giveaway",
  },
    run: async (client, interaction) => {

if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:973476189979160616> You must have permissions to \`Manage Events\` or \`Giveaways\` role to manage the giveaway.',
                ephemeral: true
            });
        }
const id = interaction.options.getString('id')
const giveaway2 = db.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})

if(db.fetch(`gw_ended_${id}`) === "ended") {
interaction.reply({content: "<:sgs_cross:973476220585013318> This giveaway is already over!"}) 
} else {
   
const guildPrefs = await db2.GuildPrefs.findOne({
                where: {
                    guildId: giveaway.guildId,
                },
            })
            const channel = await client.channels.fetch(
                giveaway.channelId
            )
            const message = await client.channels.cache.get(giveaway.channelId).messages.fetch(giveaway.messageId)
            const entrants = await db2.Entrants.findAll({
                where: {
                    giveawayUuid: giveaway.uuid,
                },
            })
db.set(`gw_ended_${id}`,`ended`)
db.set(`gw_deleted_${id}`, `deleted`) 
const embed = new Discord.MessageEmbed() 
.setDescription('Giveaway deleted!') 
.setColor('#2F3136') 
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('cekilis')
                .setLabel("")
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉")
        )
message.edit({content: null, embeds: [embed], components: [row]})
const embed1 = new Discord.MessageEmbed() 
.setTitle('🎉 Giveaway Deleted!') 
.setDescription(`🏆 New winner(s): No winner!`) 
.setColor('#2F3136') 
const row1 = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Giveaway')
.setEmoji('')
.setURL(`https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`)
) 
interaction.reply({embeds: [embed1], components: [row1]}) 

await giveaway.update({ isFinished: true })
}  

}
}
