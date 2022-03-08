const discord = require('discord.js')
const axios = require('axios')
const config = require('../config')
const FormData = require('form-data');
const psu_control = require('../modules/psu-control');

module.exports = (client, message) => {
    if (!config.discord.userIds.find(u => message.author.id) || message.channel.id !== config.discord.channelId) return;
    if (message.attachments.first()) {
        if (message.attachments.first().name.includes(".gcode") && message.attachments.first().contentType == "text/plain; charset=utf-8") {
            axios(message.attachments.first().attachment)
                .then(async data => {
                    const text = data.data
                    let info = text.split("\n")
                    info = [info[0], info[1], info[2]]

                    const upload = (type) => {
                        psu_control("getPSUState", async d => {
                            let timeout = 0
                            if (d.isPSUOn == false) {
                                timeout = 3000
                                request({
                                    method: "POST",
                                    url: `${config.octoprint.url}/api/plugin/psucontrol`,
                                    headers: {
                                        'X-Api-Key': config.octoprint.token,
                                    },
                                    body: { command: "turnPSUOn" },
                                    json: true
                                })
                            }

                            setTimeout(async () => {
                                const embed1 = new discord.MessageEmbed()
                                    .setColor("BLUE")
                                    .setDescription([
                                        `**File is uploading...**`,
                                    ].join("\n"))

                                const msg = await message.reply({
                                    embeds: [embed1]
                                })

                                const embed2 = new discord.MessageEmbed()
                                    .setColor("BLUE")

                                if (type == 1) {
                                    embed2.setDescription([
                                        `**File has been Uploaded!**`,
                                        ` `,
                                        `Print Duration: **${sectotime(parseFloat(info[1].split(":")[1]))}**`,
                                        `Filament: **${info[2].split(":")[1]}**`
                                    ].join("\n"))
                                } else {
                                    embed2.setDescription(`**File has been Uploaded!**`)
                                }

                                const btn1 = new discord.MessageButton()
                                    .setLabel("Print")
                                    .setStyle("SUCCESS")
                                    .setCustomId("print")

                                const row1 = new discord.MessageActionRow()
                                    .addComponents([btn1])

                                const form = new FormData();
                                form.append("file", `${text}`, `${message.attachments.first().name}`)
                                form.append("select", "true")
                                let error = false

                                form.getLength((e, length) => {
                                    axios.post(`${config.octoprint.url}/api/files/local`, form, {
                                        headers: {
                                            "X-Api-Key": config.octoprint.token,
                                            "Content-Length": length,
                                            ...form.getHeaders()
                                        },
                                    }).catch(e => {
                                        if (e.response.data.error == "Trying to overwrite file that is currently being printed") {
                                            const embed3 = new discord.MessageEmbed()
                                                .setColor("RED")
                                                .setTitle("OctoPrint Error")
                                                .setDescription("Na OctoPrinte na ktorý si sa snažil tento súbor nahrať prebieha tlač ktorá využíva súbor z rovnakým menom.")
                                            
                                            msg.edit({
                                                embeds: [embed3]
                                            })
                                        }
                                        error = true
                                    }).then(response => {
                                            if (error) return;
                                            msg.edit({
                                                embeds: [embed2],
                                                components: [row1]
                                            }).then(() => {
                                                const filter = i => i.user.id == message.author.id && i.isButton() && i.channel.id == message.channel.id
                                                const collector = msg.channel.createMessageComponentCollector({ filter, time: 45 * 1000 });

                                                collector.on("collect", (i) => {
                                                    if (i.customId == "print") {
                                                        collector.stop()

                                                        psu_control("start", d => {
                                                                const embed3 = new discord.MessageEmbed()
                                                                    .setColor("GREEN")
                                                                    .setDescription(`Printing of file **${message.attachments.first().name}** has been started!`)

                                                                btn1.setDisabled()

                                                                i.reply({
                                                                    embeds: [embed3]
                                                                })
                                                            })
                                                            .catch(e => {
                                                                if (e.response.body.error == "Printer is not operational") {

                                                                } else {
                                                                    i.reply({
                                                                        content: `${config.emojis.error} - Error: \`${e.response.data.error}\``
                                                                    })
                                                                }
                                                            })
                                                    }
                                                })

                                                collector.on("end", (c, reason) => {
                                                    btn1.setDisabled()

                                                    const row2 = new discord.MessageActionRow()
                                                        .addComponents([btn1])

                                                    msg.edit({
                                                        embeds: [embed2],
                                                        components: [row2]
                                                    })
                                                })
                                            })
                                        })
                                }, timeout)
                            })
                        })
                    }

                    console.log(info)
                    if (info[0] == ";FLAVOR:Marlin\r") {
                        return upload(1);
                    } else if (info[0].includes("; generated by PrusaSlicer")) {
                        return upload(2);
                    } else {
                        return upload();
                    }
                })
        }
    }
}

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