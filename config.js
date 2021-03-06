module.exports = {
    //This emojis will bot use you can change it if you want.
    emojis: {
        off: ':x:',
        error: ':warning:',
        queue: ':bar_chart:',
        music: ':musical_note:',
        success: ':white_check_mark:',
        loading: '<a:loading:875475541308891186>',
        action: ' <:action:936924378371874826>'
    },

    check_for_updates: true,

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
        camera: "http://ip-adresss-here/webcam/?action=snapshot" //Url for screen shots.
    }
}