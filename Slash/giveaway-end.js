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
    name: "giveaway-end", 
    options: [{
            name: 'id',
            description: 'Enter the id of the giveaway you want to end',
            type: 'STRING',
            required: true
           }], 
    description: "End Giveaway",
  },
    run: async (client, interaction) => {

if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:973476189979160616> You must have permissions to \`Manage Events\` or \`Giveaways\` role to manage the giveaway.',
                ephemeral: true
            });
        }



const id = await client.giveaway.fetch(`gw_settings_id_${interaction.message.id}`)
const giveaway2 = await client.giveaway.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})
if(await client.giveaway.fetch(`gw_ended_${id}`) === "ended") {
interaction.reply({content: `${await client.emoji.fetch(`no`)} This giveaway is already over!`}) 
} else {
    interaction.reply({content: `${await client.emoji.fetch(`yes`)} Giveaway Ended!`})

        await client.giveaway.set(`gw_ended_${id}`,`ended`)
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
            if (entrants.length == 0) {
                const embed = new MessageEmbed()
                    .setTitle("Giveaway Ended! No one attended...")
                        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('cekilis')
                .setLabel("") 
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉")
        )
                await message.edit({
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
                .addField(`${await client.emoji.fetch(`gift`)} Prize`, `${bold(giveaway.item)}`)
        const row2 = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('reroll')
                .setLabel("Reroll")
                .setStyle("SECONDARY")
                .setEmoji("")
        )
            await message.edit({
                content: null,
                embeds: [embed],
                components: [row2],
            })
const embed2 = new Discord.MessageEmbed() 
.setTitle(`🎉 Giveaway Ended! | Prize: ${giveaway.item}`) 
.setDescription(`🏆 Winner(s): ${winnerNames.join(", ")} \n${giveaway.winners > entrants.length? `The last ${giveaway.winners - entrants.length == 1? "winner slot was": `${giveaway.winners - entrants.length} winner slots were`} not chosen as there were not enough entrants.`: ""}`) 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton()
.setStyle('SECONDARY')
.setLabel(`${entrants.length} Entrants!`)
.setEmoji('🎉')
.setCustomId('kdkskdkd'),
new MessageButton() 
.setStyle('LINK')
.setLabel('Giveaway')
.setEmoji('')
.setURL(`https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`)
) 
interaction.reply({embeds: [embed2], components: [row]}) 

            await giveaway.update({ isFinished: true })
            console.log(`Giveaway ${giveaway.uuid} ended with ${entrants.length} entrants.`)
}  

}
}
