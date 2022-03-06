const axios = require('axios')
const config = require('../2config')

module.exports = async () => {
    let data;
    data = await axios({
        url: `${config.octoprint.url}/api/printer/bed`,
        headers: {
            'X-Api-Key': config.octoprint.token,
            'Content-Type': 'application/json'
        }
    })
    return data.data
}