/**
 * Data Proxies
 */

import GetActionProxy from './action.proxy'
import GetUserProxy from './user.proxy'
import GetPhoneNumberProxy from './phone-number.proxy'
import GetImageTypeProxy from './image-type.proxy'
import GetImageProxy from './image.proxy'
import GetUserTypeProxy from './user-type.proxy'
import GetUserHasTypeProxy from './user-has-type.proxy'
import GetUserHasRoleProxy from './user-has-role.proxy'
import GetRoleProxy from './role.proxy'
import GetRolePerformsActionProxy from './role-performs-action.proxy'

import Events, { raiseEvent, EventEmitter } from '../events'

export default (models) => {

    const ActionModel = models.Action
    const PhoneModel = models.PhoneNumber
    const UserModel = models.User
    const ImageTypeModel = models.ImageType
    const ImageModel = models.Image
    const RoleModel = models.Role
    const UserTypeModel = models.UserType
    const UserHasTypeModel = models.UserHasType
    const UserHasRoleModel = models.UserHasRole
    const RolePerformsActionModel = models.RolePerformsAction

    const ActionProxy = ActionModel ? GetActionProxy(ActionModel, Events) : null
    const UserProxy = UserModel ? GetUserProxy(UserModel, Events) : null
    const UserTypeProxy = UserTypeModel ? GetUserTypeProxy(UserTypeModel, Events) : null
    const PhoneProxy = PhoneModel ? GetPhoneNumberProxy(UserProxy, PhoneModel, Events) : null
    const ImageTypeProxy = ImageTypeModel ? GetImageTypeProxy(ImageTypeModel, Events) : null
    const ImageProxy = ImageModel ? GetImageProxy(UserProxy, ImageTypeProxy, ImageModel, Events) : null
    const RoleProxy = RoleModel ? GetRoleProxy(UserTypeProxy, RoleModel, Events) : null
    const RolePerformsActionProxy = RolePerformsActionModel ? GetRolePerformsActionProxy(RoleProxy, ActionProxy, RolePerformsActionModel, Events) : null
    const UserHasRoleProxy = UserHasRoleModel ? GetUserHasRoleProxy(UserProxy, RoleProxy, UserHasRoleModel, Events) : null
    const UserHasTypeProxy = UserHasTypeModel ? GetUserHasTypeProxy(UserProxy, UserTypeProxy, UserHasTypeModel, Events) : null


    return {
        ActionProxy,
        PhoneProxy,
        UserProxy,
        UserTypeProxy,
        ImageTypeProxy,
        ImageProxy,
        RoleProxy,
        RolePerformsActionProxy,
        UserHasRoleProxy,
        UserHasTypeProxy,
        Events
    }
}