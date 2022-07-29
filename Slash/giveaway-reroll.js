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
    name: "giveaway-reroll", 
    options: [{
            name: 'id',
            description: 'Enter the id of the giveaway you want to reroll',
            type: 'STRING',
            required: true
           }], 
    description: "Reroll Giveaway",
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

if(!db.fetch(`gw_ended_${id}`)) {
interaction.reply({content: "<:sgs_error:973476189979160616> This giveaway is not over yet, please try to reroll the winner after the draw ends."}) 
} else if(db.fetch(`gw_deleted_${id}`) === "deleted") {
interaction.reply({content: `<:sgs_cross:921392930185445376> This giveaway has been deleted, so you can\'t take any action!`}) 
} else {

        const entrants = await db2.Entrants.findAll({
            where: {
                giveawayUuid: giveaway2,
            },
        })
        const channel = await client.channels.fetch(
            giveaway.channelId
        )
        const message = await client.channels.cache.get(giveaway.channelId).messages.fetch(giveaway.messageId)
 
const winnerNames = []
const entrantList = [...entrants]
            for (
                let i = 0;
                i <
                (giveaway.winners > entrants.length
                    ? entrants.length
                    : giveaway.winners);
                i++
            ) {
                const winnerIndex = Math.floor(Math.random() * entrants.length)
                winnerNames[i] = userMention(entrantList[winnerIndex].userId)
                entrantList.splice(winnerIndex, 1)
            }

const embed = new Discord.MessageEmbed() 
.setTitle('🎉 The giveaway has been rerolled! ') 
.setDescription(`🏆 New winner(s): ${winnerNames.join(", ")}`) 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Giveaway')
.setEmoji('')
.setURL(`https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`)
) 

interaction.reply({embeds: [embed], components: [row]}) 

} 

}
}
