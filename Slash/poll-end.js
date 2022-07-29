const Discord = require('discord.js');
const { Op } = require("sequelize")
const { bold } = require("@discordjs/builders")
const { userMention, time: timestamp } = require("@discordjs/builders")
const { v4: uuidv4 } = require("uuid")
const db2 = require("../helpers/database-poll.js") 
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 
module.exports = {
  en: {
    name: "poll-end", 
    options: [{
            name: 'id',
            description: 'Enter the id of the poll you want to end',
            type: 'STRING',
            required: true
           }], 
    description: "End poll",
  },
    run: async (client, interaction) => {

if(!interaction.member.permissions.has('MANAGE_EVENTS')){
            return interaction.reply({
                content: '<:sgs_error:973476189979160616> You must have permissions to \`Manage Events\` role to manage the poll.',
                ephemeral: true
            });
        }
const id = interaction.options.getString('id')
const poll2 = db.fetch(`poll_${id}`)
const poll = await db2.Polls.findOne({
where: { uuid: poll2 },
})

if(db.fetch(`poll_ended_${id}`) === "ended") {
interaction.reply({content: "<:sgs_cross:973476220585013318> This poll is already over!"}) 
} else {
    interaction.reply({content: `<:sgs_tick:973476146391945246> Poll Ended!`})

        db.set(`poll_ended_${id}`,`ended`)
const guildPrefs = await db2.GuildPrefs.findOne({
                where: {
                    guildId: poll.guildId,
                },
            })
            const channel = await client.channels.fetch(
                poll.channelId
            )
            const message = await client.channels.cache.get(poll.channelId).messages.fetch(poll.messageId)
     
        const entrants = await db2.Entrants.findAll({
                where: {
                    pollUuid: poll.uuid,
                },
            })

           let evetdb = db.fetch(`oylama_katilim_evet_${poll.guildId}_${poll.messageId}`) || "0"
           let hayırdb = db.fetch(`oylama_katilim_hayır_${poll.guildId}_${poll.messageId}`) || "0"

const row = new MessageActionRow()
			.addComponents(
new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("👍") 
.setDisabled(true)
.setCustomId("oylamaevet"), 
new MessageButton() 
.setStyle("SECONDARY") 
.setLabel("") 
.setEmoji("👎") 
.setDisabled(true)
.setCustomId("oylamahayır") 
);

            await message.edit({
                content: null,
                components: [row],
            }) 

let karar;
if(evetdb > hayırdb) {
karar = "Winner: 👍";
} else if(hayırdb > evetdb) {
karar = "Winner: 👎";
} else if(evetdb = hayırdb) {
karar = "Winner: Same";
}

const embed = new Discord.MessageEmbed() 
.setTitle(`🎉 Poll Ended!`) 
.setDescription(`🏆 Winner(s): ${karar}`) 
.setColor('#2F3136') 
const row2 = new MessageActionRow()
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Poll')
.setEmoji('')
.setURL(`https://discord.com/channels/${poll.guildId}/${poll.channelId}/${poll.messageId}`)
) 
interaction.reply({embeds: [embed], components: [row2]}) 

            await poll.update({ isFinished: true })
}  

}
}
