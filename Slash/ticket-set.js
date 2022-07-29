const {MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent} = require("discord.js") 
const addModal = require("../helpers/addModal")
const Discord = require("discord.js") 

const db = require("croxydb") 

module.exports = {

  en: {
    name: "ticket-set", 
  description: '🎫 You set a ticket.',
    options: [
        {
            name: 'role',
            description: 'What role can you see ticket channels? ❔ Example: @Moderator',
            type: 'ROLE',
            required: true
        },
        {
            name: 'category',
            description: 'Which category to open tickets in? ℹ️ Note: Specify category id! ❔ Example: 28282828282828',
            type: 'STRING',
            required: true
        }, {
            name: 'channel',
            description: 'Create tickets on which channel? ❔ Example: #ticket',
            type: 'CHANNEL',
            required: false 
        },  
    ]
  },

    run: async (client, interaction) => {

let dil = db.fetch(`language_${interaction.guild.id}`)
const ch = interaction.options.getChannel('channel');
const channel = ch || interaction.channel
const role = interaction.options.getRole('role');

const category = interaction.options.getString('category');
const kanal = channel || interaction.channel
const embed = new MessageEmbed().setColor("#5865F2");

if(!db.fetch(`onaylı_kullanıcı_${interaction.user.id}`)) {
let mesaj = `<a:asistant:973486258519162880> You have to be an approved user to set up a Ticket system!
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
if(!interaction.member.permissions.has('ADMINISTRATOR')){
            return interaction.reply({
                content: '<:sgs_error:973476189979160616> You must have permissions to administrator to set ticket.',
                ephemeral: true
            });
        }
const rows = [
            new MessageActionRow().addComponents(
                new TextInputComponent()
                    .setCustomId("message")
                    .setLabel("Message")
                    .setPlaceholder("What do you want to write as a message? ❔ Example: Don\'t open tickets for no reason!")
                    .setStyle("PARAGRAPH")
            ),
        ]
        const modal = new Modal()
            .setCustomId(`modal-${interaction.id}`)
            .addComponents(rows)
            .setTitle("Ticket")
        const modalSubmitInteraction = await addModal(interaction, modal)
        const message = modalSubmitInteraction.fields.getTextInputValue("message")
const bok = new Discord.MessageEmbed() 
.setDescription(`<:sgs_tick:973476146391945246> Ticket set!`)
interaction.reply({embeds: [bok], ephemeral: true}) 
const row = new MessageActionRow()
			.addComponents(
  new MessageButton()
  .setStyle("PRIMARY")
  .setCustomId("ticket_ac")
  .setLabel("Click!")
);
const ticketEmbed = embed.setDescription(`${message || 'You can click on the button below to create a ticket.'}`)
const ticket = await kanal.send({ embeds: [ticketEmbed], 
 components: [row]});
db.set(`ticket_kategori_${interaction.guild.id}`, category)
db.set(`ticket_kanal_${interaction.guild.id}`, channel.id) 
db.set(`ticket_rol_${interaction.guild.id}`, role.id)
//db.set(`ticket_mesaj_${interaction.guild.id}`, ticket.id)

}
} 
