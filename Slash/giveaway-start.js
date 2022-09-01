const {
    bold,
    time: timestamp,
    channelMention,
    roleMention,
} = require("@discordjs/builders")
const Discord = require('discord.js');
const end = require("../helpers/end-giveaway.js")
const { v4: uuidv4 } = require("uuid")
const addModal = require("../helpers/addModal")
const {
    MessageActionRow,
    MessageEmbed,
    MessageButton,
    TextInputComponent,
    Modal,
} = require("discord.js")
const db = require("../helpers/database-giveaway.js")
const ms = require('ms') 
const db2 = require('croxydb');
const { duration } = require("moment");
module.exports = {
  en: {
    name: "giveaway-start", 
    options: [{
            name: 'channel',
            description: 'Where is the channel to start the gift? ❔ Example: #heyyy',
            type: 'CHANNEL',
            required: false
        }, 
       {          
            name: 'tag',
            description: 'Would you like to specify a role for the quick tag? ❔ Example: @Member',
            type: 'ROLE',
            required: false
       },
       {          
            name: 'other-giveaway-owner',
            description: 'You can add another owner to the giveaway. ❔ Example: @Cheesey#0001',
            type: 'USER',
            required: false
        }, 
       {          
            name: 'role-requirement',
            description: 'Only those in which role can participate in the giveaway? ❔ Example: @Member',
            type: 'ROLE',
            required: false
       }], 
    description: "🎉 You start a giveaway.",
},
    run: async (client, interaction) => {

const role_req = interaction.options.getRole('role-requirement') 
const u = interaction.options.getUser('other-giveaway-owner') 
const c = interaction.options.getChannel('channel') 
const tag = interaction.options.getRole('tag') 
const channel = c || interaction.channel
const user = u || interaction.user
        const uuid = uuidv4()


if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:973476189979160616> You must have permissions to \`Manage Events\` or \`Giveaways\` role to start the giveaway.',
                ephemeral: true
            });
        }

        const rows = [
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("prize")
                    .setLabel("Prize")
                    .setPlaceholder("What should be the reward of the gift? ❔ Example: Spotify")
                    .setRequired(true)
                    .setStyle("PARAGRAPH")
            ),
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("desc")
                    .setLabel("Description")
                    .setPlaceholder("What would you like to write as a description? ❔ Example: Good luck.")
                    .setRequired(false)
                    .setStyle("PARAGRAPH")
            ),
new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("winners")
                    .setLabel("Winners")
                    .setPlaceholder("How many winners should the gift have? ❔ Example: 1")
                    .setRequired(true)
                    .setStyle("SHORT")
            ),
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("duration")
                    .setLabel("Duration")
                    .setPlaceholder("How many days/hours/minutes do you want Giveaway to take? ❔ Example: 7h")
                    .setStyle("SHORT")
            ),
        ]

        const modal = new Modal()
            .setCustomId(`modal-${interaction.id}`)
            .addComponents(rows)
            .setTitle("Giveaway Start")

        const modalSubmitInteraction = await addModal(interaction, modal)

        const winners = modalSubmitInteraction.fields.getTextInputValue("winners")
        const prize = modalSubmitInteraction.fields.getTextInputValue("prize")
        const duration = modalSubmitInteraction.fields.getTextInputValue("duration") || "1m"
        const desc = modalSubmitInteraction.fields.getTextInputValue("desc") || "Good luck."
  
const ends = Date.now() + ms(duration)

if(!channel.isText()) {
           return modalSubmitInteraction.reply({
             content: '<:sgs_error:973476189979160616> The selected channel is not text-based.',
                ephemeral: true
            });
        }
if (!Number(winners) || Number(winners) < 1) {
      return modalSubmitInteraction.reply({
        content: '<:sgs_error:973476189979160616> Please specify a winner count above 0!',
      })
    }

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('cekilis')
            .setLabel("")
            .setStyle("SECONDARY")
            .setEmoji("🎉"), 
        new MessageButton()
            .setLabel("")
            .setStyle("LINK")
            .setEmoji("⏰")
            .setURL(`http://spacegw.xyz/?end=${ends}`), 
    )

        const embed = new MessageEmbed()
            .setColor('#2F3136') 
            .setTitle(`<:gift:973484715917054002> ${prize}`)
            .setDescription(`<:sgs_tick:973476146391945246> Click on the button below to enter the giveaway!
📘 ${desc}`)
            .addField(`**• Giveaway Information**`, `<:sgc_owner:973476240507932712> Giveaway Owner: ${user} (\`${user.tag}\`) \n<:msgreq:973476621212344380> Entrants: **0 (Chance: \`%0\`)** \n🏆 Winners: **${winners}** \n⏰ Ends: ${timestamp(Math.floor(ends / 1000), "R")} (${timestamp(Math.floor(ends / 1000))})`)
            .addField("**• Requirements**", `<:role_req:973476432967786506> Role Requirement: ${role_req || 'No'}`,
            )
            .setTimestamp()

        const giveaway = await db.Giveaways.create({
            uuid: uuid,
            guildId: interaction.guildId,
            userId: user.id, 
            item: prize,
            channelId: channel.id,
            winners: winners,
            endDate: ends,
            requirements:
                    role_req == null ? 'null' : role_req.id
        }) 
        const message = await channel.send({
            content: `🎉🎉 Hey ${tag || "everyone"} giveaway started! 🎉🎉`,
            embeds: [embed],
            components: [row],
        })
        await client.giveaway.set(`giveaway_desc_${message.id}`, `${desc || "Good luck."}`)
        await client.giveaway.set(`giveaway_${message.id}`, uuid) 
        giveaway.update({ messageId: message.id })
        await modalSubmitInteraction.reply({
            content: `🎉 Ok! Giveaway ${channel} started!`,
            ephemeral: true,
        })
        await end(giveaway, interaction.client)

}
}
