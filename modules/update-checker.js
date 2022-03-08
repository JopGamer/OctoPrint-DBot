const axios = require('axios')
const package = require('../package.json')
const config = require('../config')
const colors = require('colors');
let alerted = false

module.exports = async () => {
    if (config.check_for_updates) {
        const check_for_update = async (time) => {
            if (alerted) return;
            let error = false

            const data = await axios({
                url: `https://jopgamer.xyz/octobot/updatecheck`,
                headers: {
                    'X-Api-Key': package.version,
                    'Content-Type': 'application/json'
                }
            }).catch(e => {
                let time2 = time * 2
                if (!time2) time2 = 5
                if (time2 > 120) {
                    console.log(colors.red("[ERROR]"), `Check for updates faild... Update Checks Disabled!`)
                    error = true
                }
                if (error) return;

                console.log(colors.red("[ERROR]"), `Check for updates faild... Retring in ${time2}s`)
                setTimeout(() => {
                    check_for_update(time2)
                }, time2 * 1000)
                error = true
            })
            if (error) return;

            if (data.data.status == 1) {
                console.log("")
                console.log(`New update avalible: ${package.version} --> ${data.data.version}`)
                console.log("")
                if (data.data.message) {
                    console.log(`Message from developer: ${data.data.message}`)
                }

                if (data.data.updated) {
                    console.log(colors.cyan("Updated:"))
                    data.data.updated.forEach(f => {
                        console.log(`  - ${f}`)
                    })
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
                
                alerted = true
            }

            if (data.data.retry) {
                setTimeout(() => {
                    check_for_update()
                }, data.data.retry)
            }
        }

        check_for_update()
    }
}