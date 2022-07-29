const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const db = require("./database.js")
const { userMention, time: timestamp, bold } = require("@discordjs/builders")
const db2 = require('croxydb') 
const Discord = require('discord.js')
module.exports = async (giveaway, client) => {
    const time = giveaway.endDate - Date.now()
    setTimeout(
        async () => {
let yar = db2.fetch(`gw_ended_${giveaway.messageId}`)
    if(yar === "ended") {
return 
} else {
db2.set(`gw_ended_${giveaway.messageId}`,`ended`)
            const guildPrefs = await db.GuildPrefs.findOne({
                where: {
                    guildId: giveaway.guildId,
                },
            })
            const channel = await client.channels.fetch(
                giveaway.channelId
            )
            const message = await client.channels.cache.get(giveaway.channelId).messages.fetch(giveaway.messageId)
            const entrants = await db.Entrants.findAll({
                where: {
                    giveawayUuid: giveaway.uuid,
                },
            })
            if (entrants.length == 0) {
                const embed = new MessageEmbed()
                    .setTitle("Giveaway Ended! Nobody joined...")

                        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('cekilis')
                .setLabel("")
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉"), 
            
        )
                await message.edit({
                    content: null,
                    embeds: [embed],
                    components: [row],
                })
                await giveaway.update({ isFinished: true })
            }
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
            const embed = new MessageEmbed()
.setColor('#2F3136') 
                .setTitle("Giveaway Ended!")
                .addField('<:gift:937058971771088946> Prize', `${bold(giveaway.item)}`)
                        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('reroll')
                .setLabel("Reroll")
                .setStyle("SECONDARY")
           
                .setEmoji(""), 
        )
            await message.edit({
                content: null,
                embeds: [embed],
                components: [row],
            }) 
            const nam = new Discord.MessageEmbed() 
            .setTitle(`<:gift:937058971771088946> Prize: ${giveaway.item}`)
            .setDescription(`**${entrants.length}** Entrants!`) 
.setColor('#2F3136')
            await message.reply({
                content: `🎉 Giveaway Ended! Winner(s): ${winnerNames.join(", ")} \n${giveaway.winners > entrants.length? `The last ${giveaway.winners - entrants.length == 1? "winner slot was": `${giveaway.winners - entrants.length} winner slots were`} not chosen as there were not enough entrants.`: ""}`,
                embeds: [nam] 
            })
            await giveaway.update({ isFinished: true })
           // console.log(`Giveaway ${giveaway.uuid} ended with ${entrants.length} entrants.`)
           } 
        }, time > 0 ? time : 0)

}
