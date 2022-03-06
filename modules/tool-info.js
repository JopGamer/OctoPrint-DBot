const axios = require('axios')
const config = require('../2config')

module.exports = async () => {
    let data;
    data = await axios({
        url: `${config.octoprint.url}/api/printer/tool`,
        headers: {
            'X-Api-Key': config.octoprint.token,
            'Content-Type': 'application/json'
        }
    })
    
    return data.data
}