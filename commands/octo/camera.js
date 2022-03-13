const discord = require('discord.js')
const delay = require('delay')
const axios = require("axios")
const config = require('../../config')
const job_info = require('../../modules/job-info')

function sectotime(seconds) {
    let negative = ""
    if (seconds < 0) negative = "-"
    let sec = Math.abs(seconds)

    let hod = sec / 60 / 60
    hod = hod.toFixed(0);
    if (hod * 60 > sec) hod--
    
    let min = (sec - (hod * 60 * 60)) / 60
    min = min.toFixed(0);
    if (min < 0) {
        hod--
        min = (sec - (hod * 60 * 60)) / 60
        min = min.toFixed(0);
    }
    if ((hod * 60 * 60) + (min * 60) > sec) min--

    let sec2 = sec - ((hod * 60 * 60) + (min * 60)) 
    sec2 = sec2.toFixed(0)
    
    if (hod < 10) hod = `0${hod}`
    if (min < 10) min = `0${min}`
    if (sec2 < 10) sec2 = `0${sec2}`
    return `${negative}${hod}:${min}:${sec2}`
}

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

        interaction.reply({
            content: `${config.emojis.success} - Live view has been spawned!`,
            ephemeral: true
        })

        let buff = (await axios({
            url: config.octoprint.camera,
            responseType: "arraybuffer"
        })).data;

        let info = await job_info()
        if (!info.job) info = {job: {estimatedPrintTime: 0}, progress: {printTime: 0}} 
        const attachment = new discord.MessageAttachment(buff, 'shot.jpg');
        const idk = await interaction.channel.send({
            content: `Čas do konca: ${sectotime(info.job.estimatedPrintTime)}`,
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