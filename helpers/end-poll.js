const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const db = require("./database-poll.js")
const { userMention, time: timestamp, bold } = require("@discordjs/builders")
const db2 = require('croxydb') 
const Discord = require('discord.js')

module.exports = async (poll, client) => {
    const time = poll.endDate - Date.now()
    setTimeout(async () => {
let yar = db2.fetch(`poll_ended_${poll.messageId}`)
    if(yar === "ended") {
return 
} else {

db2.set(`poll_ended_${poll.messageId}`,`ended`)
            const guildPrefs = await db.GuildPrefs.findOne({
                where: {
                    guildId: poll.guildId,
                },
            })
            const channel = await client.channels.fetch(
                poll.channelId
            )
            const message = await client.channels.cache.get(poll.channelId).messages.fetch(poll.messageId)

           let evetdb = db2.fetch(`oylama_katilim_evet_${poll.guildId}_${poll.messageId}`) || "0"
           let hayırdb = db2.fetch(`oylama_katilim_hayır_${poll.guildId}_${poll.messageId}`) || "0"

let karar;
if(evetdb > hayırdb) {
karar = "Winner: 👍";
} else if(hayırdb > evetdb) {
karar = "Winner: 👎";
} else if(evetdb = hayırdb) {
karar = "Winner: Same";
}

const row = new MessageActionRow()
			.addComponents(
new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("👍") 
.setDisabled(true)
.setCustomId("oylamaevet_timed"), 
new MessageButton() 
.setStyle("SECONDARY") 
.setLabel("") 
.setEmoji("👎") 
.setDisabled(true)
.setCustomId("oylamahayır_timed") 
);

            await message.edit({
                content: null,
                components: [row],
            }) 

const embed = new MessageEmbed()
.setTitle("Poll Ended!")
.setDescription(`${karar}`)
.setColor('#2F3136')

message.reply({embeds: [embed]})

            await poll.update({ isFinished: true })

           } 
        }, time > 0 ? time : 0)
}
