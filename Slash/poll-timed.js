const {
    bold,
    time: timestamp,
    channelMention,
    roleMention,
} = require("@discordjs/builders")
const Discord = require('discord.js');
const end = require("../helpers/end-poll.js")
const { v4: uuidv4 } = require("uuid")
const addModal = require("../helpers/addModal")
const {
    MessageActionRow,
    MessageEmbed,
    MessageButton,
    TextInputComponent,
    Modal,
} = require("discord.js")
const db = require("../helpers/database-poll.js")
const ms = require('ms') 
const db2 = require('croxydb');
const { duration } = require("moment");
module.exports = {
  en: {
    name: "poll-timed", 
    description: '✏️ You start a timed poll',
    options: [
       {          
            name: 'channel',
            description: 'Is there a channel you want? ❔ Example: #poll',
            type: 'CHANNEL',
            required: false 
        }, 
       {          
            name: 'role-requirement',
            description: '❌ Out of use. ❌ Kullanım dışı.',
            type: 'ROLE',
            required: false
       }
    ]
  },
    run: async (client, interaction) => {
const role_req = interaction.options.getRole('role-requirement') 
const k = interaction.options.getChannel('channel') 
const kanal = k || interaction.channel
const uuid = uuidv4()

     if(!interaction.member.permissions.has('MANAGE_MESSAGES')){
            return interaction.reply({
                content: '<:sgs_error:973476189979160616> You must have permissions to manage messages to start poll.',
                ephemeral: true
            });
       }

        const rows = [
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("poll")
                    .setLabel("Poll")
                    .setPlaceholder("Enter a poll text. ❔ Example: Cats are nice, aren\'t they?")
                    .setRequired(true)
                    .setStyle("PARAGRAPH")
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
            .setTitle("Poll Start")
        const modalSubmitInteraction = await addModal(interaction, modal)
        const desc = modalSubmitInteraction.fields.getTextInputValue("poll")
        const duration = modalSubmitInteraction.fields.getTextInputValue("duration") || "1m"
       
const ends = Date.now() + ms(duration)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${desc}
⏰ Ends: ${timestamp(Math.floor(ends / 1000), "R")} (${timestamp(Math.floor(ends / 1000))})
<:msgreq:973476621212344380> 👍 0 👎 0`) 
.setColor("BLURPLE") 
.setTimestamp() 

const row = new MessageActionRow()
			.addComponents(
new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("👍") 
.setCustomId("oylamaevet_timed"), 
new MessageButton() 
.setStyle("SECONDARY") 
.setLabel("") 
.setEmoji("👎") 
.setCustomId("oylamahayır_timed"),
                        new MessageButton()

            .setLabel("")

            .setStyle("LINK")

            .setEmoji("⏰")

            .setURL(`http://spacegw.xyz/?end=${ends}`), 
);

 await modalSubmitInteraction.reply({

            content: `🎉 Ok! The poll was launched on ${kanal} channel!`,

            ephemeral: true,

        })

const message = await kanal.send({
embeds: [embed], 
components: [row]
})

db2.set(`oylama_${interaction.guild.id}_${message.id}`, `${desc}`)
db2.set(`poll_${message.id}`, uuid) 
        const poll = await db.Polls.create({
            uuid: uuid,
            guildId: interaction.guildId,
            userId: interaction.user.id, 
            item: desc,
            channelId: kanal.id,
            endDate: ends,
            requirements:
                    role_req == null ? 'null' : role_req.id
        }) 

        poll.update({ messageId: message.id })
        await end(poll, interaction.client)

}
}
