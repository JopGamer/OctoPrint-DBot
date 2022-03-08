const config = require('../../config')
const psu_control = require('../../modules/psu-control')
const delay = require('delay')

module.exports = {
    name: 'psu',
    description: "Ovládanie napájania tlačiarne.",
    check: "psucontrol",
    category: 'OctoPrint',
    args: [{ type: "selectionmenu", name: "action", items: ["Power on", "Power off", "Toggle"], req: true }],

    async execute(client, interaction) {
        const action = interaction.options.getString("action")
        interaction.deferReply()

        client.disable_status_check = true

        if (action == "power on") {
            psu_control("turnPSUOn", async (d) => {
                interaction.editReply({
                    content: `${config.emojis.success} - Tlačiareň sa úspešne zapla!`
                })
                await delay(1000)
                client.disable_status_check = false
            })
        } else if (action == "power off") {
            psu_control("turnPSUOff", async (d) => {
                interaction.editReply({
                    content: `${config.emojis.success} - Tlačiareň sa úspešne vypla!`
                })
                await delay(1000)
                client.disable_status_check = false
            })
        } else {
            psu_control("togglePSU", async (d) => {
                interaction.editReply({
                    content: `${config.emojis.success} - Napájanie sa úspešne preplo!`
                })
                await delay(1000)
                client.disable_status_check = false
            })
        }
    }
}