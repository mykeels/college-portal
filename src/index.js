import Waterline from 'waterline'
import config from './index.config'
import fs from 'fs'
import path from 'path'

const orm = new Waterline()

const getModelFiles = (dir) => fs.readdirSync(path.join(__dirname, dir))
                                    .map(file => path.join(__dirname, dir + '/' + file))

getModelFiles('models/users')
    .concat('models/users/images')
    .forEach(file => {
        if (/\.model\.js$/.test(file))
            orm.registerModel(require(file).default)
    })

const db = {
    waterline: orm,
    config: config
}

db.waterline.initialize(db.config, (err, models) => {
    if (err) throw err

    console.log('db initialized')

    models.collections.user.create({
        id: 1,
        email: 'test@mailinator.com',
        pwd: '12345',
        gender: 'male',
        creation_date: new Date()
    }).then(function (user) {
        console.log(user)
        return user
    }).catch(function (err) {
        console.error(err)
    })

})

export default db