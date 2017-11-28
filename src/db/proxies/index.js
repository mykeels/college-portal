/**
 * Data Proxies
 */

import GetActionProxy from './action.proxy'
import Events, { raiseEvent, EventEmitter } from '../events'

export default (sequelize) => {
    const {
            User,
            UserType,
            UserHasType,
            Role,
            UserHasRole,
            PhoneNumber,
            Action,
            RolePerformsAction,
            Image,
            ImageType
    } = require('../models/users')

    const ActionProxy = GetActionProxy(Action, Events)

    return {
        ActionProxy
    }
}