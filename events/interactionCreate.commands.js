const config = require('../config')

module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        const cmd = client.commands.get(commandName);
        if (cmd) {
            if (config.discord.channelId == interaction.channel.id) {
                if (config.discord.userIds.find(u => interaction.member.id)) {
                    cmd.execute(client, interaction);
                } else {
                    interaction.reply({ content: `${config.emojis.error} - Missing permissions!`, ephemeral: true })
                }
            } else {
                interaction.reply({ content: `${config.emojis.error} - Wrong channel!`, ephemeral: true })
            }
        }
    }
}