/**
 * Data Proxies
 */

import GetActionProxy from './action.proxy'
import GetUserProxy from './user.proxy'
import GetPhoneNumberProxy from './phone-number.proxy'

import Events, { raiseEvent, EventEmitter } from '../events'

export default (models) => {

    const Action = models.Action
    const PhoneNumber = models.PhoneNumber
    const User = models.User

    const ActionProxy = Action ? GetActionProxy(Action, Events) : null
    const UserProxy = User ? GetUserProxy(User, Events) : null
    const PhoneProxy = PhoneNumber ? GetPhoneNumberProxy(UserProxy, PhoneNumber, Events) : null

    return {
        ActionProxy,
        PhoneProxy,
        UserProxy,
        Events
    }
}