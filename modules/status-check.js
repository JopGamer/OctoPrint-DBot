const discord = require('discord.js');
const axios = require('axios')
const status = require('./job-info')
const bed_info = require('./bed-info')
const tool_info = require('./tool-info')
const job_info = require('./job-info')
const config = require('../config')
let last_status;

module.exports = async (client) => {
    setInterval(async () => {
        const info = await status()
        const channel = client.channels.cache.find(ch => ch.id == config.discord.channelId)

        if (!last_status) return last_status = info.state;
        if (last_status == info.state) return;
        if (client.disable_status_check) return;

        if (last_status == "Operational" && info.state == "Printing") {
            const job = await job_info().catch()
            const bed = await bed_info().catch()
            const tool = await tool_info().catch()

            const embed1 = new discord.MessageEmbed()
                .setColor("YELLOW")
                .setDescription(`Teplota podložky: **${bed.bed.actual.toFixed(1)}°C** | Teplota nástroja: **${tool.tool0.actual.toFixed(1)}°C**`)

            const embed2 = new discord.MessageEmbed()
                .setColor("GREEN")
                .setDescription(`Začala tlač súboru: **${job.job.file.name}**`)

            channel.send({
                embeds: [embed2]
            })

            const msg = await channel.send({
                embeds: [embed1]
            })

            const inter = setInterval(async () => {
                const bed = await bed_info()
                const tool = await tool_info()

                if (tool.tool0.actual.toFixed(0) == tool.tool0.target) {
                    clearInterval(inter)

                    const embed2 = new discord.MessageEmbed()
                        .setColor("YELLOW")
                        .setDescription(`Teplota podložky: **${bed.bed.actual.toFixed(1)}°C** | Teplota nástroja: **${tool.tool0.actual.toFixed(1)}°C**`)
                        .setTimestamp()
                        .setFooter({text: "Bed a Tool sú nahriaté"})

                    msg.edit({
                        embeds: [embed2]
                    })
                } else {
                    const embed2 = new discord.MessageEmbed()
                        .setColor("YELLOW")
                        .setDescription(`Teplota podložky: **${bed.bed.actual.toFixed(1)}°C** | Teplota nástroja: **${tool.tool0.actual.toFixed(1)}°C**`)

                    msg.edit({
                        embeds: [embed2]
                    })
                }
            }, 2500)
        } else if (last_status == "Printing" && info.state == "Operational") {
            const job = await job_info().catch()
            
            let buff = (await axios({
                url: config.octoprint.camera,
                responseType: "arraybuffer"
            })).data;
            const attachment = new discord.MessageAttachment(buff, 'shot.jpg');

            channel.send({
                content: `Tlač súboru **${job.job.file.name}** sa skončila!`,
                files: [attachment]
            })
        } else if (last_status == "Printing" && info.state == "Cancelling") {
            //just this one line
            last_status = info.state
            //of code how ironic
        } else if (last_status == "Cancelling" && info.state == "Operational") {
            const job = await job_info().catch()
            
            let buff = (await axios({
                url: config.octoprint.camera,
                responseType: "arraybuffer"
            })).data;
            const attachment = new discord.MessageAttachment(buff, 'shot.jpg');

            channel.send({
                content: `Tlač súboru **${job.job.file.name}** bola zrušená!`,
                files: [attachment]
            })
        } else {
            const embed1 = new discord.MessageEmbed()
                .setColor("BLUE")
                .setDescription(`Status tlačiarne: **${info.state}**`)

            channel.send({
                embeds: [embed1]
            })
        }

        last_status = info.state
    }, 2500)
}