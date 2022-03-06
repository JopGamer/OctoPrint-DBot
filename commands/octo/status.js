const discord = require('discord.js')
const delay = require('delay')
const axios = require("axios")
const config = require('../../config')

module.exports = {
    name: 'camera',
    description: "Pravidelne posiela obrázky z printer cam",
    category: 'OctoPrint',

    async execute(client, interaction) {
        const btn = new discord.MessageButton()
            .setStyle("SECONDARY")
            .setDisabled()
            .setCustomId("idk")
            .setLabel(`Live for 30 sec`)

        const row1 = new discord.MessageActionRow()
            .addComponents([btn])

        let buff = (await axios({
            url: config.octoprint.camera,
            responseType: "arraybuffer"
        })).data;

        interaction.reply({
            content: `${config.emojis.success} - Live view has been spawned!`,
            ephemeral: true
        })

        const attachment = new discord.MessageAttachment(buff, 'shot.jpg');
        const idk = await interaction.channel.send({
            files: [attachment],
            components: [row1]
        })

        await delay(2500)

        let time = 30
        for (let i = 0; i < 11; i++) {
            time = time - 2.5
            const buff = (await axios({
                url: config.octoprint.camera,
                responseType: "arraybuffer"
            })).data;

            const attachment = new discord.MessageAttachment(buff, 'shot.jpg');

            btn.setLabel(`Live for ${time} sec`)

            const row1 = new discord.MessageActionRow()
                .addComponents([btn])

            idk.edit({
                files: [attachment],
                components: [row1]
            })

            await delay(2500)
        }

        const buff2 = (await axios({
            url: config.octoprint.camera,
            responseType: "arraybuffer"
        })).data;

        const attachment2 = new discord.MessageAttachment(buff2, 'shot.jpg');

        btn.setLabel(`Offline...`)

        const row2 = new discord.MessageActionRow()
            .addComponents([btn])

        idk.edit({
            files: [attachment2],
            components: [row2]
        })
    }
}