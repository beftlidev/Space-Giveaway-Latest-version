const Discord = require('discord.js') 
const db = require("croxydb") 
const addModal = require("../helpers/addModal")
const {
    MessageActionRow,
    MessageEmbed,
    MessageButton,
    TextInputComponent,
    Modal,
} = require("discord.js")
const {
    bold,
    time: timestamp,
    channelMention,
    roleMention,
} = require("@discordjs/builders")
module.exports = {
  en: {
    name: "poll", 
    description: '✏️ You start a poll',
    options: [
       {          
            name: 'channel',
            description: 'Is there a channel you want? ❔ Example: #poll',
            type: 'CHANNEL',
            required: false 
        }
    ]
  },
    run: async (client, interaction) => {
const k = interaction.options.getChannel('channel') 
const kanal = k || interaction.channel

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
        ]
        const modal = new Modal()
            .setCustomId(`modal-${interaction.id}`)
            .addComponents(rows)
            .setTitle("Poll Start")
        const modalSubmitInteraction = await addModal(interaction, modal)
        const desc = modalSubmitInteraction.fields.getTextInputValue("poll")

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${desc}
<:msgreq:973476621212344380> 👍 0 👎 0`) 
.setColor("BLURPLE") 
.setTimestamp() 

const row = new MessageActionRow()
			.addComponents(
new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("👍") 
.setCustomId("oylamaevet"), 
new MessageButton() 
.setStyle("SECONDARY") 
.setLabel("") 
.setEmoji("👎") 
.setCustomId("oylamahayır") 
);

await modalSubmitInteraction.reply({content: `🎉 Ok! The poll was launched on ${kanal} channel!`, ephemeral: true})

const message = await kanal.send({
embeds: [embed], 
components: [row]
})

db.set(`oylama_${interaction.guild.id}_${message.id}`, `${desc}`)

}
} 
