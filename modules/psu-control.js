const axios = require('axios')
const config = require('../config')

module.exports = (action, callback) => {
    axios({
        method: "POST",
        url: `${config.octoprint.url}/api/plugin/psucontrol`,
        headers: {
            'X-Api-Key': config.octoprint.token,
        },
        data: { command: action },
        json: true
    }).then(d => {
        if (!callback) {
            return d.data;
        } else {
            callback(d.data)
        }
    })
}