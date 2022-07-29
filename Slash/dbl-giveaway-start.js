const {
    bold,
    time: timestamp,
    channelMention,
    roleMention,
} = require("@discordjs/builders")
const Discord = require('discord.js');
const end = require("../helpers/end.js")
const { v4: uuidv4 } = require("uuid")
const addModal = require("../helpers/addModal")
const {
    MessageActionRow,
    MessageEmbed,
    MessageButton,
    TextInputComponent,
    Modal,
} = require("discord.js")
const db = require("../helpers/database.js")
const ms = require('ms') 
const db2 = require('croxydb');
const { duration } = require("moment");
module.exports = {
  en: {
    name: "dbl-giveaway-start", 
    options: [{          
            name: 'dbl',
            description: 'What bot list do you use?',
            type: 'STRING',
            choices: [{name: "Top.gg", value: "Top.gg"}], 
            required: true
        }, {
            name: 'channel',
            description: 'Where is the channel to start the gift? ❔ Example: #heyyy',
            type: 'CHANNEL',
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
const channel = c || interaction.channel
const user = u || interaction.user
        const uuid = uuidv4()
var values = interaction.options._hoistedOptions.map(a => a.value)
var dbl_name = values[0]

if(!db2.fetch(`onaylı_kullanıcı_${interaction.user.id}`)) {
let mesaj = `<a:asistant:973486258519162880> To start a DBL giveaway, you need to be an approved user! 
<:sgs_tick:973476146391945246> You can apply for an approved user from the button below!
<:sgs_error:973476189979160616> If the button is not working, click on the \`Support Server\` button and apply from our support server.`
const onay = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('SECONDARY')
.setLabel('Apply')
.setEmoji('')
.setCustomId('onayli'), 
new MessageButton() 
.setStyle('LINK')
.setLabel('Support Server')
.setEmoji('')
.setURL('https://discord.gg/KZfAEjrPUF') 
) 
interaction.reply({content: mesaj, components: [onay]}) 
}
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
           new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("dbl")
                    .setLabel(`${dbl_name} Token`)
                    .setPlaceholder("You need to enter your bot\'s token on the bot list.")
                    .setRequired(true)
                    .setStyle("PARAGRAPH")
            ),
           new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("dbl_id")
                    .setLabel(`Bot Id`)
                    .setPlaceholder("You need to enter your bot id.")
                    .setRequired(true)
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
        const dbl_token = modalSubmitInteraction.fields.getTextInputValue("dbl")
        const dbl_id = modalSubmitInteraction.fields.getTextInputValue("dbl_id")

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

try {

const Topgg = require("@top-gg/sdk")
const dbl = new Topgg.Api(dbl_token) 
dbl.getBot(dbl_id).then(async bot => {

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId('cekilis_dbl')
            .setLabel("")
            .setStyle("SECONDARY")
            .setEmoji("🎉"), 
        new MessageButton()
            .setLabel("Timer")
            .setStyle("LINK")
            .setEmoji("")
            .setURL(`http://spacegw.xyz/?end=${ends}`), 
    )


        const embed = new MessageEmbed()
            .setColor('#2F3136') 
            .setTitle(`<:gift:973484715917054002> ${prize}`)
            .setDescription(`<:sgs_tick:973476146391945246> Click on the button below to enter the giveaway!`)
            .addField(`**• Giveaway Information**`, `<:sgc_owner:973476240507932712> Giveaway Owner: ${user} (\`${user.tag}\`) \n🏆 Winners: **${winners}** \n⏰ Ends: ${timestamp(Math.floor(ends / 1000), "R")} (${timestamp(Math.floor(ends / 1000))})`)
            .addField("**• Requirements**", `<:role_req:973476432967786506> Oy: [${bot.username}](https://top.gg/bot/${dbl_id}/vote)`,
                true
            )
            .setImage('https://media.discordapp.net/attachments/843458271180226571/938374306788966400/PicsArt_02-02-01.04.18.jpg')
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
            content: `🎉🎉 Giveaway Started! 🎉🎉`,
            embeds: [embed],
            components: [row],
        })
        db2.set(`giveaway_${message.id}`, uuid) 
        db2.set(`cekilis_topgg_token_${interaction.guild.id}_${message.id}`, dbl_token) 
        giveaway.update({ messageId: message.id })
        await modalSubmitInteraction.reply({
            content: `🎉 Ok! Giveaway ${channel} started!`,
            ephemeral: true,
        })
        await end(giveaway, interaction.client)
}) 
} catch(e) {
interaction.reply({content: `<:sgs_error:973476189979160616> Make sure the boat enters the top.gg correctly!`, ephemeral: true}) 
} 

}
}
 
