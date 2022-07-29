const Discord = require('discord.js')
const { MessageEmbed, ShardingManager, WebhookClient } = require("discord.js");

const manager = new ShardingManager("./space-giveaway.js", {
    token: 'NzY1MjA3MjY4NDA4MDMzMzIy.GAgu9s.KxgoT-6ZXZ8XVafgo0VNB1F8THvmVBa2RtCZrQ',
    totalShards: 6,
    mode: 'process', 
    respawn: true,
});

const { AutoPoster } = require('topgg-autoposter')
const poster = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc2NTIwNzI2ODQwODAzMzMyMiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjQ5MDAxMTI3fQ.kJ0NjT995DOE8uSiuvQC5IiSWNjO7N4swV5Jh8umDc0', manager)
poster.on('posted', (stats) => { 
  console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
})

/*const webhook_id = '935826653299490876'
const webhook_token = '8GUnPCHjuRifk-V5unmekH1MTUALULVcAKytltnfRLt9VqzBVWhf85L_35w_XQm7GpGH'
const webhook = new WebhookClient({ id: webhook_id, token: webhook_token });*/

manager.on('shardCreate', async(i) => {
console.log(`[BOT] | ${Number(i.id)+1} / 5 Id' li Shard kullanıma hazırlanıyor!`)
})

manager.on('shardReady', async(i) => {
console.log(`[BOT] | ${Number(i.id)+1} / 6 Id' li Shard kullanıma hazır!`)
})

manager.spawn();
