/**
 * Data Proxies
 */

import GetActionProxy from './action.proxy'
import Events, { raiseEvent, EventEmitter } from '../events'

export default (models) => {

    const Action = models.Action

    const ActionProxy = GetActionProxy(Action, Events)

    return {
        ActionProxy,
        Events
    }
}