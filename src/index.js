import Waterline from 'waterline'
import config from './index.config'
import fs from 'fs'
import path from 'path'

const orm = new Waterline()

fs.readdirSync(path.join(__dirname, 'models'))
    .filter(file => /\.model\.js$/.test(file))
    .forEach(file => {
        orm.loadCollection(require(path.join(__dirname, file)))
    })

export default {
    waterline: orm,
    config: config
}