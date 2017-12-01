/**
 * A User symbolizes an Entity  that has login credentials, roles, and can perform actions within the system
 */

import Sequelize from 'sequelize'
import { hash } from '../../helpers/hash'

export default (sequelize = new Sequelize(), PhoneNumber) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        pwd: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.ENUM,
            values: ['male', 'female']
        }
    })

    /**
     * A User may have more than one phone-number, each of which is a potential login credential
     */
    
    User.hasMany(PhoneNumber, {
        as: 'phones',
        foreignKeyConstraint: true
    })

    User.beforeCreate((user, options) => {
        return hash(user.pwd).then(hashedPwd => {
            user.pwd = hashedPwd
        }).catch(err => {
            throw err
        })
    })
    
    User.beforeBulkUpdate((instances, options) => {
        if (instances.attributes && instances.attributes.pwd) {
            return hash(instances.attributes.pwd).then(hashedPwd => {
                instances.attributes.pwd = hashedPwd
                console.log(hashedPwd)
            }).catch(err => {
                console.log(err)
            })
        }
        return Promise.resolve(instance)
    })
    
    return User
}