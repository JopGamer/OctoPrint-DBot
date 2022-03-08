const discord = require('discord.js');
const status = require('./job-info')
const bed_info = require('./bed-info')
const tool_info = require('./tool-info')
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
            const bed = await bed_info()
            const tool = await tool_info()

            const embed1 = new discord.MessageEmbed()
                .setColor("YELLOW")
                .setDescription(`Teplota podložky: **${bed.bed.actual.toFixed(1)}°C** | Teplota nástroja: **${tool.tool0.actual.toFixed(1)}°C**`)

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
                        .setFooter("Bed a Tool sú nahriaté")

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