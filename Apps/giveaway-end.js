const Discord = require('discord.js');
const {MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 
const { ApplicationCommandType } = require("discord-api-types/v9")
const db2 = require("../helpers/database.js")
const end = require("../helpers/end")
module.exports = {
  tr: {
    name: "Çekiliş Bitir", 
    type: ApplicationCommandType.Message,
  },
  en: {
    name: "Giveaway End", 
    type: ApplicationCommandType.Message,
  },
    run: async (client, interaction) => {

let dil = db.fetch(`language_${interaction.guild.id}`)
let id = interaction.targetId
if(!dil) {
if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:921392927568195645> You must have permissions to \`Manage Events\` or \`Giveaways\` role to end the giveaway.',
                ephemeral: true
            });
        }
const giveaway2 = db.fetch(`giveaway_${interaction.targetId}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})

if (!giveaway)
            return await interaction.reply({
                content: "<:sgs_error:921392927568195645> That message is not a giveaway.",
                ephemeral: true,
            })

if(db.fetch(`gw_ended_${interaction.targetId}`) === "ended") {
interaction.reply({content: "<:sgs_cross:921392930185445376> This giveaway is already over!", ephemeral: true}) 
} else {
    interaction.reply({content: `<:sgs_tick:921392926683197460> Giveaway Ended!`, ephemeral: true})

        db.set(`gw_ended_${interaction.targetId}`,`ended`)
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
                .setLabel("Enter")
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉"), 
            new MessageButton()
                .setCustomId('cekilis_ayarlar')
                .setLabel("")
                .setStyle("SECONDARY")
                .setEmoji("803719494715310100"), 
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
                .addField('<:gift:937058971771088946> Prize', `${bold(giveaway.item)}`)
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('cekilis')
                .setLabel("Enter")
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉"), 
            new MessageButton()
                .setCustomId('cekilis_ayarlar')
                .setLabel("")
                .setStyle("SECONDARY")
                .setEmoji("803719494715310100"), 
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
                content: `🎉 Giveaway Over! Winner(s): ${winnerNames.join(", ")} \n${giveaway.winners > entrants.length? `The last ${giveaway.winners - entrants.length == 1? "winner slot was": `${giveaway.winners - entrants.length} winner slots were`} not chosen as there were not enough entrants.`: ""}`,
                embeds: [nam] 
            })
            await giveaway.update({ isFinished: true })
            console.log(`Giveaway ${giveaway.uuid} ended with ${entrants.length} entrants.`)
} 

} 

if(dil === "TR") {
if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:921392927568195645> Çekiliş bitirmek için \`Etkinlikleri Yönet\` veya \`Giveaways\` rolüne izinleriniz olmalıdır.',
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
if(db.fetch(`gw_ended_${id}`) === "ended") {
interaction.reply({content: "<:sgs_cross:921392930185445376> Bu çekiliş zaten sona ermiş!",ephemeral: true}) 
} else {
    interaction.reply({content: `<:sgs_tick:921392926683197460> Çekiliş Bitirildi!`, ephemeral: true})

     db.set(`gw_ended_${id}`,`ended`)
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
                    .setTitle("Çekiliş Bitti! Kimse katılmadı...")
                        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('cekilis')
                .setLabel("Katıl")
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉"), 
            new MessageButton()
                .setCustomId('cekilis_ayarlar')
                .setLabel("")
                .setStyle("SECONDARY")
                .setEmoji("803719494715310100"), 
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
                .addField('<:gift:937058971771088946> Ödül', `${bold(giveaway.item)}`)
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('cekilis')
                .setLabel("Katıl")
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉"), 
            new MessageButton()
                .setCustomId('cekilis_ayarlar')
                .setLabel("")
                .setStyle("SECONDARY")
                .setEmoji("803719494715310100"), 
        )
            await message.edit({
                content: null,
                embeds: [embed],
                components: [row],
            })
            const nam = new Discord.MessageEmbed() 
            .setTitle(`<:gift:937058971771088946> Ödül: ${giveaway.item}`)
            .setDescription(`**${entrants.length}** Katılımcı!`) 
.setColor('#2F3136')
            await message.reply({
                content: `🎉 Çekiliş Bitti! Kazanan(lar): ${winnerNames.join(", ")} \n${giveaway.winners > entrants.length? `The last ${giveaway.winners - entrants.length == 1? "winner slot was": `${giveaway.winners - entrants.length} winner slots were`} not chosen as there were not enough entrants.`: ""}`,
                embeds: [nam] 
            })
            await giveaway.update({ isFinished: true })
            console.log(`Giveaway ${giveaway.uuid} ended with ${entrants.length} entrants.`)
} 
} 

}
}
