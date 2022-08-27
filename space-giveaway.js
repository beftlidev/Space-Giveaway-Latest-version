const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const INTENTS = Object.entries(Discord.Intents.FLAGS).filter(([K]) => !["GUILD_PRESENCES"].includes(K)).reduce((t, [, V]) => t | V, 0)
const client = new Discord.Client({intents: INTENTS}) 
const Util = require('util') 
const {Collection} = require("discord.js"),
      {readdirSync} = require("fs")
const db = require("croxydb"); 
const { MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const got = require("got");
const express = require('express')
const app = express()
const Canvas = require('canvas') 
const fetch = ("node-fetch");
const fs = require("fs");

const {
    JsonDatabase,
    YamlDatabase
} = require("wio.db");

const komut = new JsonDatabase({
    databasePath:"./databases/komut.json" 
});

client.komut = komut

client.login("");

require("./utils/slash-loader.js")(client)

client.on('interactionCreate', async(interaction) => {
const { Op } = require("sequelize")
const { bold } = require("@discordjs/builders")
const { userMention, time: timestamp } = require("@discordjs/builders")
const { v4: uuidv4 } = require("uuid")
const db2 = require("./helpers/database.js") 

if(interaction.customId == "reroll") {

if(!interaction.member.permissions.has('MANAGE_EVENTS') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: '<:sgs_error:973476189979160616> You must have permissions to \`Manage Events\` or \`Giveaways\` role to manage the giveaway.',
                ephemeral: true
            });
        }
const id = interaction.message.id
const giveaway2 = db.fetch(`giveaway_${id}`)
const giveaway = await db2.Giveaways.findOne({
where: { uuid: giveaway2 },
})

if(!db.fetch(`gw_ended_${id}`)) {
interaction.reply({content: "<:sgs_error:973476189979160616> This giveaway is not over yet, please try to reroll the winner after the draw ends."}) 
} else if(db.fetch(`gw_deleted_${id}`) === "deleted") {
interaction.reply({content: `<:sgs_cross:921392930185445376> This giveaway has been deleted, so you can\'t take any action!`}) 
} else {

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

const embed = new Discord.MessageEmbed() 
.setTitle('🎉 The giveaway has been rerolled! ') 
.setDescription(`🏆 New winner(s): ${winnerNames.join(", ")}`) 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Giveaway')
.setEmoji('')
.setURL(`https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`)
) 

interaction.reply({embeds: [embed], components: [row]}) 

}

}

if(interaction.customId == 'cekilis') {
   
    const giveaway2 = db.fetch(`giveaway_${interaction.message.id}`)
    const giveaway = await db2.Giveaways.findOne({
    where: { uuid: giveaway2 },
    })
    if (!giveaway2)
    return interaction.reply({
    content: "There was an error. Please try again later.",
    ephemeral: true,
    })
    
            if(giveaway.requirements !== 'null') {
              if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(giveaway.requirements)) {
              return await interaction.reply({
                content: "<:sgs_cross:921392930185445376> You do not have the required roles to enter this giveaway.",
                ephemeral: true,
              })
            }
    
    const result = await db2.Entrants.findOrCreate({
    where: {
    [Op.and]: [
    { giveawayUuid: giveaway.uuid },
    { userId: interaction.user.id },
    ],
    },
    defaults: {
    uuid: uuidv4(),
    userId: interaction.user.id,
    giveawayUuid: giveaway2,
                        },
                    })
    const entrants = await db2.Entrants.findAll({
                    where: {
                        giveawayUuid: giveaway.uuid,
                    },
                })
    
                if (result[1]) {

db.add(`giveaway_entrants_${interaction.message.id}`, 1)
let mrb = db.fetch(`giveaway_entrants_${interaction.message.id}`)

let rol;
if(giveaway.requirements !== "null") {
rol = `<@&${giveaway.requirements}>` 
} else {
rol = "No"
}

const desc = db.fetch(`giveaway_desc_${interaction.message.id}`)
const mew = client.users.cache.get(giveaway.userId)
        const embed = new MessageEmbed()
            .setColor('#2F3136') 
            .setTitle(`<:gift:973484715917054002> ${giveaway.item}`)
            .setDescription(`<:sgs_tick:973476146391945246> Click on the button below to enter the giveaway!
📘 ${desc}`)
            .addField(`**• Giveaway Information**`, `<:sgc_owner:973476240507932712> Giveaway Owner: ${mew} (\`${mew.tag}\`) \n<:msgreq:973476621212344380> Entrants: **${mrb} (Chance: \`%${Number(100/mrb).toFixed(1)}\`)** \n🏆 Winners: **${giveaway.winners}** \n⏰ Ends: ${timestamp(Math.floor(giveaway.endDate / 1000), "R")} (${timestamp(Math.floor(giveaway.endDate / 1000))})`)
            .addField("**• Requirements**", `<:role_req:973476432967786506> Role Requirement: ${rol}`,
            )
            .setTimestamp()

await interaction.update({embeds: [embed]})
                  await interaction.reply({
                  content: `<:sgs_tick:921392926683197460> You entered the giveaway successfully!`,
                  ephemeral: true,
                  })
                  } else {



                  await interaction.reply({
                  content: "<:sgs_error:921392927568195645> You already entered this giveaway.",
                  ephemeral: true,
                  })
                  }
              
              } else {
                const result = await db2.Entrants.findOrCreate({
                    where: {
                    [Op.and]: [
                    { giveawayUuid: giveaway.uuid },
                    { userId: interaction.user.id },
                    ],
                    },
                    defaults: {
                    uuid: uuidv4(),
                    userId: interaction.user.id,
                    giveawayUuid: giveaway2,
                                        },
                                    })
                    const entrants = await db2.Entrants.findAll({
                                    where: {
                                        giveawayUuid: giveaway.uuid,
                                    },
                                })
    if (result[1]) {

db.add(`giveaway_entrants_${interaction.message.id}`, 1)
let mrb = db.fetch(`giveaway_entrants_${interaction.message.id}`)

let rol;
if(giveaway.requirements !== "null") {
rol = `<@&${giveaway.requirements}>` 
} else {
rol = "No"
}

const desc = db.fetch(`giveaway_desc_${interaction.message.id}`)
const mew = client.users.cache.get(giveaway.userId)
        const embed = new MessageEmbed()
            .setColor('#2F3136') 
            .setTitle(`<:gift:973484715917054002> ${giveaway.item}`)
            .setDescription(`<:sgs_tick:973476146391945246> Click on the button below to enter the giveaway!
📘 ${desc}`)
            .addField(`**• Giveaway Information**`, `<:sgc_owner:973476240507932712> Giveaway Owner: ${mew} (\`${mew.tag}\`) \n<:msgreq:973476621212344380> Entrants: **${mrb} (Chance: \`%${Number(100/mrb).toFixed(1)}\`)** \n🏆 Winners: **${giveaway.winners}** \n⏰ Ends: ${timestamp(Math.floor(giveaway.endDate / 1000), "R")} (${timestamp(Math.floor(giveaway.endDate / 1000))})`)
            .addField("**• Requirements**", `<:role_req:973476432967786506> Role Requirement: ${rol}`,
            )
            .setTimestamp()

await interaction.update({embeds: [embed]})

    await interaction.reply({
    content: `<:sgs_tick:921392926683197460> You entered the giveaway successfully!`,
    ephemeral: true,
    })
    } else {




    await interaction.reply({
    content: "<:sgs_error:921392927568195645> You already entered this giveaway.",
    ephemeral: true,
    })
    }
              
    }
    
    }
    if(interaction.customId === "cekilis_dbl") {
    
    const Topgg = require("@top-gg/sdk")
    const dbl = new Topgg.Api(db.fetch(`cekilis_topgg_token_${interaction.guild.id}_${interaction.message.id}`)) 
    dbl.hasVoted(interaction.user.id).then(async voted => {
    const giveaway2 = db.fetch(`giveaway_${interaction.message.id}`)
    const giveaway = await db2.Giveaways.findOne({
    where: { uuid: giveaway2 },
    })
    if (!giveaway2)
    return interaction.reply({
    content: "There was an error. Please try again later.",
    ephemeral: true,
    })
    if(voted === false) {
    interaction.reply({content: `<:sgs_cross:921392930185445376> To enter this giveaway, you must vote on the specified bot via top.gg!`, ephemeral: true}) 
    } else {
    const result = await db2.Entrants.findOrCreate({
    where: {
    [Op.and]: [
    { giveawayUuid: giveaway.uuid },
    { userId: interaction.user.id },
    ],
    },
    defaults: {
    uuid: uuidv4(),
    userId: interaction.user.id,
    giveawayUuid: giveaway2,
                        },
                    })
    const entrants = await db2.Entrants.findAll({
                    where: {
                        giveawayUuid: giveaway.uuid,
                    },
                })
    
                if (result[1]) {
                  const sj = new Discord.MessageEmbed() 
    .setDescription(`👥 Total Participating Members: ( **${entrants.length}** )
🏆 Your Chance to Win: ( **%${Number(100/entrants.length).toFixed(1)}** )
                  `) 
                  .setColor('#2F3136') 
                  await interaction.reply({
                  content: `<:sgs_tick:921392926683197460> You entered the giveaway successfully!!`,
                  embeds: [sj],
                  ephemeral: true,
                  })
                  } else {
                      const sj2 = new Discord.MessageEmbed() 
    .setDescription(`👥 Total Participating Members: ( **${entrants.length}** )
🏆 Your Chance to Win: ( **%${Number(100/entrants.length).toFixed(1)}** )
                  `) 
                  .setColor('#2F3136') 
                  await interaction.reply({
                  content: "<:sgs_error:921392927568195645> You already entered this giveaway.",
                  embeds: [sj2],
                  ephemeral: true,
                  })
                  }
    } 
    }) 
    
    
    } 
})

client.on("messageCreate", message => {
  if (message.channel.type === "dm") return;
});

client.setMaxListeners(50);

const talkedRecently = new Set();

client.on("interactionCreate", async (button) => {

    if (button.customId == "ticket_ac") {

    let Category = db.fetch(`ticket_kategori_${button.guild.id}`);
    let Role = db.fetch(`ticket_rol_${button.guild.id}`);
    const ticketChannel = await button.guild.channels.create(
      `${button.user.username}`,
      {
        name: "ticket",
        parent: Category,
        type: "text"
      }
    );
    ticketChannel.permissionOverwrites.create(button.user.id, {
VIEW_CHANNEL: true,
SEND_MESSAGES: true
    });
   ticketChannel.permissionOverwrites.create(Role, {
      VIEW_CHANNEL: true, 
     SEND_MESSAGES: true
    });
    ticketChannel.permissionOverwrites.create(button.guild.id, {  VIEW_CHANNEL: false })
button.reply({content: `<:sgs_tick:973476146391945246> Ticket created successfully! ( <#${ticketChannel.id}> )`, ephemeral: true}) 
    const ticketEmbed = new MessageEmbed()
      .setDescription(
        `You can click on the button below to take any action about Ticket.`
      );
const row = new MessageActionRow()
			.addComponents(
    new MessageButton()
      .setStyle("SECONDARY")
.setEmoji('973476220585013318') 
      .setLabel("Close")
      .setCustomId("ticket_kapat")
);
    ticketChannel.send({content: `${button.user} - <@&`+ Role +`>`, embeds: [ticketEmbed], components: [row]}).then(msg => {
msg.pin()
}) 


  }
    if(button.customId == "ticket_geri") {

const row = new MessageActionRow()
			.addComponents(
    new MessageButton()
      .setStyle("SECONDARY")
      .setLabel("Close")
.setEmoji('973476220585013318') 
      .setCustomId("ticket_kapat")
);
const embed = new Discord.MessageEmbed() 
.setDescription('You can click on the button below to take any action about Ticket.') 
.setColor('#FF7F00') 
button.update({embeds: [embed], components: [row]})

}
    if(button.customId == "ticket_kapat") {

const embed = new Discord.MessageEmbed() 
.setDescription(`🔓 - Ticket opens it back. 
<:sgs_cross:973476220585013318> - Ticket deletes completely. 
📜 - Backs up Ticket messages into a txt file.
`)
.setColor('#0099ff')
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle("PRIMARY")
.setLabel("")
.setEmoji("🔓")
.setCustomId("ticket_geri"), 
    new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("973476220585013318")
.setCustomId("ticket_sil"), 
new MessageButton() 
.setStyle("SUCCESS")
.setLabel("")
.setEmoji("📜")
.setCustomId("ticket_mesaj") 
) 
button.update({embeds: [embed], components: [row]})

} 
    if (button.customId == "ticket_sil") {
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle("PRIMARY")
.setLabel("")
.setEmoji("🔓")
.setDisabled(true) 
.setCustomId("ticket_geri"), 
    new MessageButton() 
.setStyle("SECONDARY")
.setLabel("")
.setEmoji("973476220585013318")
.setDisabled(true)
.setCustomId("ticket_sil"), 
new MessageButton() 
.setStyle("SUCCESS")
.setLabel("")
.setEmoji("📜")
.setDisabled(true)
.setCustomId("ticket_mesaj") 
) 

const embed = new Discord.MessageEmbed() 
.setDescription('<:sgs_tick:973476146391945246> Ticket will be closed in 10 seconds...')
button.channel.send({embeds: [embed]}) 
const embed2 = new Discord.MessageEmbed() 
.setDescription('Deleting channel. You can\'t take any action!') 
.setColor('RED')
button.update({embeds: [embed2], components: [row]}) 
    setTimeout(() => {
      button.channel.delete().catch(e => {})
    }, 10000);


  }
    if(button.customId == "ticket_mesaj") {

let sj = await button.channel.messages.fetch({limit: 100})
let response = []
sj = sj.sort((a, b) => a.createdTimestamp - b.createdTimestamp)
sj.forEach((m) => {
if (m.author.bot) return
const attachment = m.attachments.first()
const url = attachment ? attachment.url : null
if (url !== null) {m.content = url}
    response.push(`${m.author.tag} | ${m.content}`)})
await button.channel.send({embeds: [new Discord.MessageEmbed()	
.setColor('#0099ff')
.setTitle('<:sgs_tick:973476146391945246> I back up messages sent to Ticket...')]})
let attach = new Discord.MessageAttachment(Buffer.from(response.toString().replaceAll(',', '\n'), 'utf-8'),`${button.channel.name}.txt`)
setTimeout(async () => {await button.channel.send({ content: `<:sgs_tick:973476146391945246> \`${button.channel.name}\` I transferred ticket \'s messages to the file below.`, files: [attach]})}, 3000)

}   
    
    if(button.customId == "oylamaevet") {

if(db.fetch(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

button.reply({content: `<:sgs_error:973476189979160616> You responded NO to the survey! To give a YES reaction, withdraw the NO reaction.`, ephemeral: true})

} else {

if(db.fetch(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

await db.delete(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`) 

await db.subtract(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`, 1)

let evetdb = db.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)

let hayırdb = db.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = db.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 

.setTitle("Poll started! 🎉")

.setDescription(`${query}
<:msgreq:973476621212344380> 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 

.setColor("BLURPLE") 

.setTimestamp() 

button.update({embeds: [embed]})  

} else {

await db.set(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`, "katildi") 

await db.add(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`, 1)

let evetdb = db.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)

let hayırdb = db.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = db.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 

.setTitle("Poll started! 🎉")

.setDescription(`${query}
<:msgreq:973476621212344380> 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 

.setColor("BLURPLE") 

.setTimestamp() 

button.update({embeds: [embed]}) 

} 
}
}

if(button.customId == "oylamahayır") {

if(db.fetch(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

button.reply({content: `<:sgs_error:973476189979160616> You responded YES to the survey! To give a NO reaction, withdraw the YES reaction.`, ephemeral: true})

} else {

if(db.fetch(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

await db.delete(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`) 

await db.subtract(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`, 1)

let evetdb = db.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)

let hayırdb = db.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = db.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 

.setTitle("Poll started! 🎉")

.setDescription(`${query}
<:msgreq:973476621212344380> 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 

.setColor("BLURPLE") 

.setTimestamp() 

button.update({embeds: [embed]}) 

} else {

await db.set(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`, "katildi") 

await db.add(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`, 1)

let evetdb = db.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)

let hayırdb = db.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = db.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 

.setTitle("Poll started! 🎉")

.setDescription(`${query}
<:msgreq:973476621212344380> 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 

.setColor("BLURPLE") 

.setTimestamp() 

button.update({embeds: [embed]}) 

    

} 
}
}

    const { Op } = require("sequelize")

const { bold } = require("@discordjs/builders")

const { userMention, time: timestamp } = require("@discordjs/builders")


const db2 = require("./helpers/database-poll.js") 

if(button.customId == "oylamaevet_timed") {
const polldb2 = db.fetch(`poll_${button.message.id}`)

    const polldb = await db2.Polls.findOne({

    where: { uuid: polldb2 },

    })
if(db.fetch(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`)) {
button.reply({content: `<:sgs_error:973476189979160616> You responded NO to the survey! To give a YES reaction, withdraw the NO reaction.`, ephemeral: true})
} else {

if(db.fetch(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

await db.delete(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`) 
await db.subtract(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`, 1)

let evetdb = db.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)
let hayırdb = db.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = db.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${query}
⏰ Ends: ${timestamp(Math.floor(polldb.endDate / 1000), "R")} (${timestamp(Math.floor(polldb.endDate / 1000))})
<:msgreq:973476621212344380> 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 
.setColor("BLURPLE") 
.setTimestamp() 

button.update({embeds: [embed]})  

} else {

await db.set(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`, "katildi") 
await db.add(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`, 1)

let evetdb = db.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)
let hayırdb = db.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = db.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${query}
⏰ Ends: ${timestamp(Math.floor(polldb.endDate / 1000), "R")} (${timestamp(Math.floor(polldb.endDate / 1000))})
<:msgreq:973476621212344380> 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 
.setColor("BLURPLE") 
.setTimestamp() 

button.update({embeds: [embed]}) 

} 
}
}

if(button.customId == "oylamahayır_timed") {
const polldb2 = db.fetch(`poll_${button.message.id}`)

    const polldb = await db2.Polls.findOne({

    where: { uuid: polldb2 },

    })
if(db.fetch(`oylama_katildi_evet_${button.user.id}_${button.guild.id}_${button.message.id}`)) {
button.reply({content: `<:sgs_error:973476189979160616> You responded YES to the survey! To give a NO reaction, withdraw the YES reaction.`, ephemeral: true})
} else {

if(db.fetch(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`)) {

await db.delete(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`) 
await db.subtract(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`, 1)

let evetdb = db.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)
let hayırdb = db.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = db.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${query}
⏰ Ends: ${timestamp(Math.floor(polldb.endDate / 1000), "R")} (${timestamp(Math.floor(polldb.endDate / 1000))})
<:msgreq:973476621212344380> 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 
.setColor("BLURPLE") 
.setTimestamp() 

button.update({embeds: [embed]}) 

} else {

await db.set(`oylama_katildi_hayır_${button.user.id}_${button.guild.id}_${button.message.id}`, "katildi") 
await db.add(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`, 1)

let evetdb = db.fetch(`oylama_katilim_evet_${button.guild.id}_${button.message.id}`)
let hayırdb = db.fetch(`oylama_katilim_hayır_${button.guild.id}_${button.message.id}`)

let query = db.fetch(`oylama_${button.guild.id}_${button.message.id}`)

const embed = new Discord.MessageEmbed() 
.setTitle("Poll started! 🎉")
.setDescription(`${query}
⏰ Ends: ${timestamp(Math.floor(polldb.endDate / 1000), "R")} (${timestamp(Math.floor(polldb.endDate / 1000))})
<:msgreq:973476621212344380> 👍 ${evetdb || "0"} 👎 ${hayırdb || "0"}`) 
.setColor("BLURPLE") 
.setTimestamp() 

button.update({embeds: [embed]}) 
    
} 
}
} 


if (button.customId === "buton_rol") {

let rol = db.fetch(`buton_rol_${button.message.id}_${button.guild.id}`)

if (button.member.roles.cache.get(rol)) {

await button.member.roles.remove(rol);
button.reply({content: '<:sgs_tick:973476146391945246> I have successfully reclaimed the role of <@&'+ rol +'> from you.', ephemeral: true}) 

} else {

await button.member.roles.add(rol);
button.reply({content: '<:sgs_tick:973476146391945246> I have successfully assigned you the role of <@&'+ rol +'>.', ephemeral: true}) 

}

} 



if(button.customId === "onayli") {
if(db.fetch(`onaylı_kullanıcı_başvuru_durum_${button.user.id}`) === 'yes') {
button.reply({content: `<:sgs_cross:973476220585013318> You\'ve already applied!`, ephemeral: true})
} else {
    const moment = require('moment')
    let Category = "973462202898063360" 
    let Role = "973462157826084865" 
    const ticketChannel = await client.guilds.cache.get('752164000418234448').channels.create(
      `✅ - ${button.user.username}`,
      {
        name: "ticket",
        parent: Category,
        type: "text"
      }
    );
   ticketChannel.permissionOverwrites.create(Role, {
      VIEW_CHANNEL: true, 
     SEND_MESSAGES: true
    });
    ticketChannel.permissionOverwrites.create(button.guild.id, {  VIEW_CHANNEL: false })
button.reply({content: `<:sgs_tick:973476146391945246> The application was successfully made and will be returned within 24-48 hours! If no return is made, your application has been rejected.`, ephemeral: true}) 
    const ticketEmbed = new MessageEmbed()
      .setDescription(
        `Bilet hakkında herhangi bir işlem yapmak için aşağıdaki düğmeye tıklayabilirsiniz.
<:sgs_tick:973476146391945246> Hesap oluşturulma tarihi: ${moment.utc(button.guild.members.cache.get(button.user.id).user.createdAt).format('DD/MM/YYYY')}`
      );
const row = new MessageActionRow()
			.addComponents(
new MessageButton() 
.setStyle('SECONDARY')
.setLabel('Onayla')
.setEmoji('')
.setCustomId('onayla_kullanici'), 
new MessageButton() 
.setStyle('SECONDARY')
.setLabel('Reddet')
.setEmoji('')
.setCustomId('reddet_kullanici'), 
    new MessageButton()
      .setStyle("SECONDARY")
.setEmoji('921392930185445376') 
      .setLabel("")
      .setCustomId("ticket_kapat")
);
db.set(`onaylı_kullanıcı_başvuru_durum_${button.user.id}`, `yes`) 
    ticketChannel.send({content: `<@&`+ Role +`>`, embeds: [ticketEmbed], components: [row]}).then(msg => {
msg.pin()
db.set(`onaylı_kullanıcı_başvuru_${msg.id}`, button.user.id)
}) 
} 
} 

if(button.customId === "onayla_kullanici") {
let user = db.fetch(`onaylı_kullanıcı_başvuru_${button.message.id}`) 
let u = client.users.cache.get(user) 
db.set(`onaylı_kullanıcı_${user}`, `evet`)
db.set(`onaylı_kullanıcı_rozet_${user}`, `<:onayli:973476532951613440>`)
db.delete(`onaylı_kullanıcı_başvuru_${button.message.id}`)
const embed = new Discord.MessageEmbed() 
.setDescription('🎉 Approved user application accepted, congratulations! If you want, come to our support server below, send this message to the gallery channel and get a special role!') 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Support Server')
.setEmoji('')
.setURL('https://discord.gg/KZfAEjrPUF') 
) 
button.reply({content: '<:onayli:973476532951613440> Başvuru kabul edildi!'}) 
u.send({embeds: [embed], components: [row]})
} 

if(button.customId === "reddet_kullanici") {
let user = db.fetch(`onaylı_kullanıcı_başvuru_${button.message.id}`) 
let u = client.users.cache.get(user) 
db.delete(`onaylı_kullanıcı_başvuru_durum_${user}`)
db.delete(`onaylı_kullanıcı_başvuru_${button.message.id}`) 
const embed = new Discord.MessageEmbed() 
.setDescription(`😔 Unfortunately, your application was rejected! If you have a complaint, come to our support server below and report it.
Reason for rejection: The account wasn\'t opened a month ago. `) 
.setColor('#2F3136') 
const row = new MessageActionRow() 
.addComponents(
new MessageButton() 
.setStyle('LINK')
.setLabel('Support Server')
.setEmoji('')
.setURL('https://discord.gg/KZfAEjrPUF') 
) 
button.reply({content: '<:onayli:973476532951613440> Başvuru reddedildi!'}) 
u.send({embeds: [embed], components: [row]})
}

}) 

process.on("unhandledRejection", (reason, promise) => {
return console.log(reason)
}); 
