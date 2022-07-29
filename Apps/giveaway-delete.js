const Discord = require('discord.js');
const {MessageActionRow, MessageButton} = require("discord.js") 
const db = require('croxydb') 
const { ApplicationCommandType } = require("discord-api-types/v9")
const db2 = require("../helpers/database.js")
const end = require("../helpers/end")
module.exports = {
  tr: {
    name: "Çekiliş Sil", 
    type: ApplicationCommandType.Message,
  },
  en: {
    name: "Giveaway Delete", 
    type: ApplicationCommandType.Message,
  },
    run: async (client, interaction) => {

let dil = db.fetch(`language_${interaction.guild.id}`)
let id = interaction.targetId
if(!dil) {

if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:921392927568195645> You must have permissions to \`Manage Events\` or \`Giveaways\` role to delete the giveaway.',
                ephemeral: true
            });
        }

const giveaway2 = db.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})

if (!giveaway)
            return await interaction.reply({
                content: "<:sgs_error:921392927568195645> That message is not a giveaway.",
                ephemeral: true,
            })

if(db.fetch(`gw_ended_${id}`) === "ended") {
interaction.reply({content: "<:sgs_cross:921392930185445376> This giveaway is already over!",ephemeral: true}) 
} else {
    interaction.reply({content: `<:sgs_tick:921392926683197460> Giveaway Deleted!`, ephemeral: true})

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
                .setLabel("Enter")
                .setStyle("SECONDARY")
                .setDisabled(true) 
                .setEmoji("🎉"), 
            new MessageButton()
                .setCustomId('cekilis_ayarlar')
                .setLabel("")
                .setStyle("SECONDARY")
                .setDisabled(true)
                .setEmoji("803719494715310100"), 
        )
message.edit({content: null, embeds: [embed], components: [row]})
await giveaway.update({ isFinished: true })
} 
} 

if(dil === "TR") {

if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:921392927568195645> Çekiliş silmek için \`Etkinlikleri Yönet\` veya \`Giveaways\` rolüne izinleriniz olmalıdır.',
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
interaction.reply({content: "<:sgs_cross:921392930185445376> Bu çekiliş zaten sona ermiş!", ephemeral: true}) 
} else {
    interaction.reply({content: `<:sgs_tick:921392926683197460> Çekiliş Silindi!`, ephemeral: true})

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
.setDescription('Çekiliş silindi!') 
.setColor('#2F3136') 
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
                .setDisabled(true)
                .setEmoji("803719494715310100"), 
        )
message.edit({content: null, embeds: [embed], components: [row]})
await giveaway.update({ isFinished: true })
} 
} 

}
}
