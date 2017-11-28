import db from '../'

const FgGreen = '\x1b[32m'
const FgWhite = '\x1b[37m'

db.sync().then(() => {
    console.log(FgGreen, '\nMigration Successful!', FgWhite)
    process.exit()
}).catch(err => {
    process.exit()
})