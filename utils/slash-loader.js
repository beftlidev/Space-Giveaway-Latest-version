const db2 = require("../helpers/database.js")
const end = require("../helpers/end.js")
const db3 = require("../helpers/database-poll.js")

const end2 = require("../helpers/end-poll.js")
const Discord = require('discord.js')
const moment = require('moment')
const {Collection, MessageActionRow, MessageButton} = require("discord.js"),
      {readdirSync} = require("fs")
      const db = require("croxydb") 
      const Util = require('util')
module.exports = async(client, interaction) => {
  client.commands = new Collection()
  
  client.contextMenus = new Collection()
  var files = readdirSync("./Slash") 
  var files2 = readdirSync("./Apps")
  var props;
  var props2;

  for(var file in files) {
      console.log(`[SLASH COMMAND] | Loaded: ${files[file]}`)
      var props = require(`../Slash/` + files[file])
      client.commands.set(files[file].replace(".js", ""), props)
  }

  var allCommands = {
    en: client.commands.map(a => {
      return {name: a.en.name, description: (a.type) ? undefined : a.en.description, options: a.en.options, type: (a.type) ? a.type : "CHAT_INPUT"}
    })
  }
  client.languageCommands = allCommands;

client.on('ready', async() => {

setInterval(() => { 
const promises = [
client.shard.fetchClientValues('guilds.cache.size'),
client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
		];
  Promise.all(promises)
	.then(results => {
		const guildd = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
client.user.setPresence({ activities: [{ name: `${guildd} Servers - Shard Id: [ ${Number(client.shard.ids)+1} / 6 ] - spacegw.xyz`, url :'https://twitch.tv/iugur1', type: 'PLAYING' }] });
}) 
},60000) 

console.log("[BOT] | The status was set successfully.") 

    client.guilds.cache.forEach(async (guild) => {
      try {
          await guild.commands.set(client.languageCommands.en) 
         // await guild.contextMenus.set(client.languageCommandsApps.en)
      } catch(err) {}
    })

console.log("[BOT] | Slash command loaded for " + client.guilds.cache.size + ".")
//console.log("[BOT] | Apps command loaded for " + client.guilds.cache.size + ".")

setInterval( async () => {
  let ping = await client.shard.fetchClientValues('ws.ping')
  let server = await client.shard.fetchClientValues('guilds.cache.size')
  let user = await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)) 
  let embed = new Discord.MessageEmbed()
  let i = client.shard.ids
  let durum = ""
   if(200 > client.ws.ping) {
     durum = "<a:sg_online:973476304915668992>"
   }else if(700 > client.ws.ping) {
     durum = "<a:sg_idle:973476325820100618>"
   }else{
     durum = "<a:sg_dnd:973476334636531713>"
   }
  for(i=0;i<client.shard.count;i++) {
  for(i=0;i<client.shard.count;i++) {
  embed.setTitle("<:rdp:973476571241390080> Shard Info").setTimestamp().setColor('#2F3136').addField(`Shard ${i+1} ( ${durum} )`, `<:server_req:921813959282151514> Sunucular: **${server[i]}** \n<:wumpus_sgs:932622621307183124> Kullanıcılar: **${user[i]}** \n🏓 Gecikme: **${Math.round(ping[i])}**
`, true)
  }
try {
  client.channels.cache.get('973462224251285554').messages.fetch('973510969181491200').then(msg => {
msg.edit({ embeds: [embed] })

})
} catch(error) {
}
   }
    }, 60000);

try {
            await db2.Sequelize.authenticate()
            console.log("[BOT] [GIVEAWAY] | Connection has been established successfully.")
        } catch (error) {
            console.error("[BOT] [GIVEAWAY] | Unable to connect to the database:", error)
        }
        await db2.Sequelize.sync()
        const giveaways = await db2.Giveaways.findAll({
            where: { isFinished: false },
        })
        giveaways.forEach((giveaway) => end(giveaway, client))

    try {

            await db3.Sequelize.authenticate()

            console.log("[BOT] [POLL] | Connection has been established successfully.")

        } catch (error) {

            console.error("[BOT] | Unable to connect to the database:", error)

        }

        await db3.Sequelize.sync()

        const polls = await db3.Polls.findAll({

            where: { isFinished: false },

        })

        polls.forEach((poll) => end(poll, client))
    
console.log(`[BOT] | ${client.user.tag} is online.`);
try {
  const log = client.channels.cache.get('973462226004488202')
  const weow = new Discord.MessageEmbed()
  .setColor('GREEN')
  .setDescription('🌟 Bot Aktif!')
  log.send({embeds: [weow]})
} catch(error) {}
})

client.on('guildCreate', async(guild) => {

const guildd = client.guilds.cache.get(guild.id)
    try {
      await guildd.commands.set(client.languageCommands.en)
     // await guildd.contextMenus.set(client.languageCommandsApps.en)
    } catch(err) {}

})

client.on('messageCreate', async(message) => {

if (message.content.toLowerCase() === "<@765207268408033322>") {
let dil = db.fetch(`language_${message.guild.id}`)
if(message.author.bot) return;
const row = new MessageActionRow()
.addComponents(
       new MessageButton() 
     .setStyle("LINK")
        .setLabel("Invite link") 
       .setURL("https://discord.com/oauth2/authorize?client_id=765207268408033322&scope=bot+applications.commands&permissions=2147483656") 
        );
let aa = new Discord.MessageEmbed() 
.setDescription(`Hello, 👋!
😋 I'm an advanced Giveaway bot for your server!
😍 You can add me to your server from the link below. `) 
.setColor('GREEN') 
      message.channel.send({embeds: [aa], components: [row] }) 
} 

if (message.content.startsWith("!eval")) {
      var args = message.content.split(" ").slice(1)
  if (message.author.id !== "753842258457002036") return
  let arguman = args.join(" ");
  if (!arguman) return
  let executedIn = process.hrtime();
  function clean(msg) {
    if (typeof msg !== "string")
      msg = Util.inspect(msg, { depth: 0 });
    msg = msg
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
    executedIn = process.hrtime(executedIn);
    executedIn = executedIn[0] * Math.pow(10, 3) + executedIn[1] / Math.pow(10, 6);
    return msg
  }
  try {
    const evaled = clean(await eval(arguman));
    const embddddd = new Discord.MessageEmbed()
   .setTitle("🥳 Kod başarıyla çalıştırıldı")
      .setDescription(`
> Kod parçacığı \`${executedIn.toFixed(3)} ms\` de **çalıştırıldı.**
      \`\`\`js\n${evaled}\`\`\`
      `)
      .setColor("GREEN")
     message.channel.send({embeds: [embddddd]});
  } catch(err) {
    console.log(err)
    message.channel.send({embeds: [
      new Discord.MessageEmbed()
      .setTitle("🤯 Bir hata ile karşılaşıldı")
      .setDescription(`
      \`\`\`js\n${err}\`\`\`
      `)
      .setColor("RED")
      .setTimestamp()
                         ]});
  }
    }

if (message.content.startsWith("!kara-liste")) {
      var args = message.content.split(" ").slice(1)
  if (message.author.id !== "753842258457002036") return
  let arguman = args.join(" ");
db.set(`kara_liste_${args[0]}`, `evet`)
db.set(`kara_liste_sebep_${args[0]}`, args.slice(1).join(" "))
message.reply(`\✅ ${args[0]} id\' li kullanıcı ${args.slice(1).join(" ")} sebebi ile kara listeye alındı!`)
}

if (message.content.startsWith("!kara-liste")) {
      var args = message.content.split(" ").slice(1)
  if (message.author.id !== "753842258457002036") return
  let arguman = args.join(" ");
db.set(`kara_liste_${args[0]}`, `hayır`)
db.delete(`kara_liste_sebep_${args[0]}`)
message.reply(`\✅ ${args[0]} id\' li kullanıcı beyaz listeye alındı!`)
}

})

  client.on('interactionCreate', async(interaction) => {
    var cmdsInteract = {
      en: allCommands.en.find(a => a.name === interaction.commandName)
    }
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) return
    var theCMD;
    interaction.selectedValue = (interaction.options._hoistedOptions[0]) ? interaction.options._hoistedOptions[0].value : undefined
    if (cmdsInteract.en) {

      theCMD = client.commands.find(a => a.en.name === interaction.commandName)
      await client.komuten.add(`komut_${interaction.commandName}`,1)
      db.add(`bot_using`,1)
      theCMD.run(client, interaction)
      
    }
  })
}
