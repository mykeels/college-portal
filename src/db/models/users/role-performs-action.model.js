/**
 * Allows for many-to-many relationship between Role and Action
 */

import Sequelize from 'sequelize'

export default (sequelize, Role, Action) => {
    const RolePerformsAction = sequelize.define('role_performs_action', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    })
    
    RolePerformsAction.belongsTo(Role)
    RolePerformsAction.belongsTo(Action)

    return RolePerformsAction
}