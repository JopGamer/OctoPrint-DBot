const axios = require('axios')
const package = require('../package.json')

module.exports = async () => {
    const data = await axios({
        url: `https://jopgamer.tk/octobot/updatecheck`,
        headers: {
            'X-Api-Key': package.version,
            'Content-Type': 'application/json'
        }
    })

    if (data.data.status == 1) {
        console.log("")
        console.log(`New update awalible: ${package.version} --> ${data.data.version}`)
        console.log("")
    }
}