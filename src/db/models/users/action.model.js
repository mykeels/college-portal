/**
 * An Action is an entity that represents an actual task can be performed by a User 
 * within the system. 
 * 
 * Actions are usually bound to Roles, which can then be assigned to a User
 */

import Sequelize from 'sequelize'
import UserType from './user-type.model'

export default ((sequelize) => {
    return sequelize.define('action', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING
        }
    })
})