const axios = require('axios')
const package = require('../package.json')
const config = require('../config')
const colors = require('colors');

module.exports = async () => {
    if (config.check_for_updates) {
        const data = await axios({
            url: `https://jopgamer.xyz/octobot/updatecheck`,
            headers: {
                'X-Api-Key': package.version,
                'Content-Type': 'application/json'
            }
        })

        if (data.data.status == 1) {
            console.log("")
            console.log(`New update avalible: ${package.version} --> ${data.data.version}`)
            console.log("")
            if (data.data.message) {
                console.log(`Message from developer: ${data.data.message}`)
            }

            if (data.data.fixed) {
                console.log(colors.yellow("Fixed:"))
                data.data.fixed.forEach(f => {
                    console.log(`  - ${f}`)
                })
            }

            if (data.data.added) {
                console.log(colors.green("Added:"))
                data.data.added.forEach(a => {
                    console.log(`  - ${a}`)
                })
            }

            if (data.data.removed) {
                console.log(colors.red("Removed:"))
                data.data.removed.forEach(r => {
                    console.log(`  - ${r}`)
                })
            }

            console.log("")
            console.log(colors.blue(`GitHub Repo: `) + `${data.data.git}`)
            console.log("")
        }
    }
}