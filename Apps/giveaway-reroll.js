const Discord = require('discord.js');
const {MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 
const { ApplicationCommandType } = require("discord-api-types/v9")
const db2 = require("../helpers/database.js")
const end = require("../helpers/end")
module.exports = {
  tr: {
    name: "Çekiliş Yeniden Çek", 
    type: ApplicationCommandType.Message,
  },
  en: {
    name: "Giveaway Reroll", 
    type: ApplicationCommandType.Message,
  },
    run: async (client, interaction) => {

let dil = db.fetch(`language_${interaction.guild.id}`)
let id = interaction.targetId
if(!dil) {
if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:921392927568195645> You must have permissions to \`Manage Events\` or \`Giveaways\` role to reroll the giveaway.',
                ephemeral: true
            });
        }
const giveaway2 = db.fetch(`giveaway_${interaction.targetId}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})

if(!db.fetch(`gw_ended_${id}`)) {
interaction.reply({content: "<:sgs_cross:921392930185445376> This giveaway is not over yet, please try to reroll the winner after the draw ends.", ephemeral: true}) 
} else if(db.fetch(`gw_deleted_${id}`) === "deleted") {
interaction.reply({content: `<:sgs_cross:921392930185445376> This giveaway has been deleted, so you can\'t take any action!`, ephemeral: true}) 
} else {
    interaction.reply({content: `<:sgs_tick:921392926683197460> Giveaway Rerolled!`, ephemeral: true})

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
            await message.reply({
                content: `🎉 The giveaway has been rerolled! New winner(s): ${winnerNames.join(", ")}`,
            })
} 
} 

if(dil === "TR") {
if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:921392927568195645> Çekiliş kazanan yeniden çekmek için \`Etkinlikleri Yönet\` veya \`Giveaways\` rolüne izinleriniz olmalıdır.',
                ephemeral: true
            });
        }
const giveaway2 = db.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})

if (!giveaway)
            return await interaction.reply({
                content: "<:sgs_error:921392927568195645> Bu mesaj bir çekiliş değil.",
                ephemeral: true,
            })

if(!db.fetch(`gw_ended_${id}`)) {
interaction.reply({content: "<:sgs_cross:921392930185445376> Bu çekiliş daha sona ermemiş, lütfen çekiliş sona erdikten sonra tekrar kazanan yeniden çekmeyi deneyiniz.",ephemeral: true}) 
} else if(db.fetch(`gw_deleted_${id}`) === "deleted") {
interaction.reply({content: `<:sgs_cross:921392930185445376> Bu çekiliş silinmiş, o yüzden herhangi bir işlem yapamazsın!`, ephemeral: true}) 
} else {
    interaction.reply({content: `<:sgs_tick:921392926683197460> Çekiliş Kazanan Yeniden Çekildi!`, ephemeral: true})

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
            await message.reply({
                content: `🎉 Çekiliş yeniden çekildi! Yeni kazanan(lar): ${winnerNames.join(", ")}`,
            })
} 
} 

}
}
