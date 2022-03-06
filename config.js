module.exports = {
    //This emojis will bot use you can change it if you want.
    emojis: {
        off: ':x:',
        error: ':warning:',
        queue: ':bar_chart:',
        music: ':musical_note:',
        success: ':white_check_mark:',
        loading: ':clock1:',
    },

    discord: {
        token: "", //Put here Discord Bot token from https://discordapp.com/developers/applications.
        clientId: "", //Put here id of Discord Bot.
        channelId: "", //Put here id of channel where will bot operate.
        guildId: "", //Put here id of server where will bot operate.
        userIds: [""] //Put here user ids that can interact with bot.
    },

    octoprint: {
        token: "", //OctoPrint Application Key.
        url: "http://your.url", //OctoPrint url. (Url thay you use to access OctoPrint)
        camera: "http://your.url" //Url for screen shots.
    }
}